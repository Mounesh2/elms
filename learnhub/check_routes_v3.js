const fs = require('fs');
const path = require('path');

// Read with utf16le since the file was created with cmd/powershell redirection which defaults to UTF-16 or has BOM
let content;
try {
    content = fs.readFileSync('app_files_flat.txt', 'utf16le');
} catch (e) {
    content = fs.readFileSync('app_files_flat.txt', 'utf8');
}

// Remove BOM if present
if (content.charCodeAt(0) === 0xFEFF || content.charCodeAt(0) === 0xFFFE) {
    content = content.slice(1);
}

const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);

const routes = {};

lines.forEach(line => {
    // Basic normalization of path
    const normalizedLine = line.replace(/\0/g, ''); // Remove any residual null bytes
    const match = normalizedLine.match(/[\\\/]app[\\\/](.*)$/i);
    if (!match) return;
    const relativePath = match[1];
    
    const lowerPath = relativePath.toLowerCase();
    if (!lowerPath.endsWith('page.tsx') && !lowerPath.endsWith('route.ts')) return;

    const parts = relativePath.split(/[\\\/]/);
    const cleanParts = parts.filter(p => !p.startsWith('(') || !p.endsWith(')'));
    let route = cleanParts.join('/');
    
    route = route.replace(/\/(page|route)\.(tsx|ts)$/i, '');
    if (route.toLowerCase().endsWith('page.tsx')) route = '/';
    if (route.toLowerCase().endsWith('route.ts')) route = '/api';
    if (route === '') route = '/';

    if (!routes[route]) routes[route] = [];
    routes[route].push(relativePath);
});

console.log('--- Route Map ---');
for (const route in routes) {
  if (routes[route].length > 1) {
    console.log(`Conflict: ${route}`);
    routes[route].forEach(file => console.log(`  - ${file}`));
  }
}
