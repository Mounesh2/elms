const fs = require('fs');
const path = require('path');

function getFiles(dir, allFiles = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, allFiles);
    } else {
      allFiles.push(name);
    }
  }
  return allFiles;
}

const appDir = path.join(process.cwd(), 'app');
const files = getFiles(appDir);

const routes = {};
const conflicts = [];

// 1. Check for page.tsx and route.ts in the same directory
const dirs = [...new Set(files.map(f => path.dirname(f)))];
dirs.forEach(dir => {
  const dirFiles = fs.readdirSync(dir);
  const hasPage = dirFiles.some(f => f.startsWith('page.'));
  const hasRoute = dirFiles.some(f => f.startsWith('route.'));
  if (hasPage && hasRoute) {
    conflicts.push(`Same directory has both page.tsx and route.ts: ${path.relative(appDir, dir)}`);
  }
});

// 2. Check for route groups conflicts
files.forEach(file => {
  if (file.endsWith('page.tsx') || file.endsWith('route.ts')) {
    const relativePath = path.relative(appDir, file);
    const parts = relativePath.split(path.sep);
    const cleanParts = parts.filter(p => !p.startsWith('(') || !p.endsWith(')'));
    let route = cleanParts.join('/');
    
    // Normalize route
    route = route.replace(/\/(page|route)\.(tsx|ts)$/, '');
    if (route.endsWith('page.tsx')) route = '/';
    if (route.endsWith('route.ts')) route = '/api'; // This is a bit rough but works for comparison

    if (!routes[route]) routes[route] = [];
    routes[route].push(relativePath);
  }
});

for (const route in routes) {
  if (routes[route].length > 1) {
    conflicts.push(`Duplicate route: ${route}\n  - ${routes[route].join('\n  - ')}`);
  }
}

// 3. Check for file vs directory conflicts (e.g., app/test.tsx vs app/test/page.tsx)
const allPaths = files.map(f => path.relative(appDir, f));
allPaths.forEach(p => {
    const ext = path.extname(p);
    if (ext && !p.includes('(post)') && !p.includes('node_modules')) {
        const withoutExt = p.slice(0, -ext.length);
        if (dirs.some(d => path.relative(appDir, d) === withoutExt)) {
            conflicts.push(`File shadowing directory: ${p} and ${withoutExt}/`);
        }
    }
});

console.log('--- Conflicts ---');
conflicts.forEach(c => console.log(c));
if (conflicts.length === 0) console.log('No obvious conflicts found.');
