const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('app_files_flat.txt', 'utf8');
const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);

const routes = {};

lines.forEach(line => {
    // line is something like C:\Users\moune\Desktop\Kodnest\ELMS\learnhub\app\(student)\cart\page.tsx
    const appIndex = line.indexOf('\\app\\');
    if (appIndex === -1) return;
    const relativePath = line.slice(appIndex + 5);
    
    if (!relativePath.endsWith('page.tsx') && !relativePath.endsWith('route.ts')) return;

    const parts = relativePath.split('\\');
    const cleanParts = parts.filter(p => !p.startsWith('(') || !p.endsWith(')'));
    let route = cleanParts.join('/');
    
    route = route.replace(/\/(page|route)\.(tsx|ts)$/, '');
    if (route.endsWith('page.tsx')) route = '/';
    if (route.endsWith('route.ts')) route = '/api';

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
