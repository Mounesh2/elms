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
const pageFiles = files.filter(f => f.endsWith('page.tsx') || f.endsWith('route.ts'));

const routes = {};

pageFiles.forEach(file => {
  const relativePath = path.relative(appDir, file);
  // Remove route groups like (student)
  const route = relativePath
    .split(path.sep)
    .filter(part => !part.startsWith('(') || !part.endsWith(')'))
    .join('/')
    .replace(/\/page\.tsx$/, '')
    .replace(/\/route\.ts$/, '')
    .replace(/^page\.tsx$/, '/')
    .replace(/^route\.ts$/, '/api'); // Simplified

  if (!routes[route]) {
    routes[route] = [];
  }
  routes[route].push(relativePath);
});

console.log('--- Conflicts ---');
for (const route in routes) {
  if (routes[route].length > 1) {
    console.log(`Route: ${route}`);
    routes[route].forEach(file => console.log(`  - ${file}`));
  }
}
