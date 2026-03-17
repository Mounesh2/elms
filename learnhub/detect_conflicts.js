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

files.forEach(file => {
  const isPage = file.match(/[\\\/]page\.(tsx|jsx|js)$/i);
  const isRoute = file.match(/[\\\/]route\.(ts|js)$/i);
  
  if (isPage || isRoute) {
    const relativePath = path.relative(appDir, file);
    const parts = relativePath.split(/[\\\/]/);
    
    // 1. Check for page and route in same directory
    const dir = path.dirname(relativePath);
    const dirFiles = fs.readdirSync(path.join(appDir, dir));
    if (dirFiles.some(f => f.match(/^page\./i)) && dirFiles.some(f => f.match(/^route\./i))) {
      conflicts.push(`CONFLICT: Same directory has both page and route at "${dir}"`);
    }

    // 2. Identify the effective route
    const routeParts = parts.filter(p => !p.startsWith('(') || !p.endsWith(')'));
    let route = '/' + routeParts.slice(0, -1).join('/');
    route = route.replace(/\/$/, '') || '/';
    
    // Add prefix for routes
    const type = isPage ? 'PAGE' : 'ROUTE';
    const key = `${type}:${route}`;

    if (!routes[key]) routes[key] = [];
    routes[key].push(relativePath);
  }
});

for (const key in routes) {
  if (routes[key].length > 1) {
    conflicts.push(`CONFLICT: Duplicate ${key.split(':')[0]} route for "${key.split(':')[1]}":\n  - ${routes[key].join('\n  - ')}`);
  }
}

console.log('--- Conflicts Found ---');
if (conflicts.length === 0) {
  console.log('None found.');
} else {
  conflicts.forEach(c => console.log(c));
}
