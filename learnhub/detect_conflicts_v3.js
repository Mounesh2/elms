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
    
    // Normalize route parts: remove route groups and replace dynamic segments with a placeholder
    const cleanParts = parts.filter(p => !p.startsWith('(') || !p.endsWith(')'));
    let normalizedParts = cleanParts.slice(0, -1).map(p => {
      if (p.startsWith('[') && p.endsWith(']')) {
         return p.startsWith('[...') ? '[...catchall]' : '[dynamic]';
      }
      return p.toLowerCase();
    });

    const route = '/' + normalizedParts.join('/');
    const type = isPage ? 'PAGE' : 'ROUTE';
    const key = `${type}:${route}`;

    if (!routes[key]) routes[key] = [];
    routes[key].push({ path: relativePath, original: cleanParts.slice(0, -1).join('/') });
  }
});

for (const key in routes) {
  if (routes[key].length > 1) {
    // Check if they are actually different (e.g. [id] vs [slug])
    const uniqueOriginals = [...new Set(routes[key].map(r => r.original.toLowerCase()))];
    if (uniqueOriginals.length > 1 || routes[key].length > 1) {
       conflicts.push(`CONFLICT: ${key.split(':')[0]} collision for "${key.split(':')[1]}":\n  - ${routes[key].map(r => r.path).join('\n  - ')}`);
    }
  }
}

console.log('--- Advanced Conflicts Found ---');
if (conflicts.length === 0) {
  console.log('None found.');
} else {
  conflicts.forEach(c => console.log(c));
}
