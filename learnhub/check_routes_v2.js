const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('app_files_flat.txt', 'utf8');
const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);

const routes = {};

lines.forEach(line => {
    const match = line.match(/[\\\/]app[\\\/](.*)$/i);
    if (!match) return;
    const relativePath = match[1];
    
    if (!relativePath.toLowerCase().endsWith('page.tsx') && !relativePath.toLowerCase().endsWith('route.ts')) return;

    const parts = relativePath.split(/[\\\/]/);
    const cleanParts = parts.filter(p => !p.startsWith('(') || !p.endsWith(')'));
    let route = cleanParts.join('/');
    
    route = route.replace(/\/(page|route)\.(tsx|ts)$/i, '');
    if (route.toLowerCase().endsWith('page.tsx')) route = '/';
    if (route.toLowerCase().endsWith('route.ts')) route = '/api';

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
