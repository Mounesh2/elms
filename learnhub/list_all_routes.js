const fs = require('fs');
const path = require('path');

function getFiles(dir, allFiles = []) {
  if (!fs.existsSync(dir)) return allFiles;
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

const allRoutes = [];

files.forEach(file => {
  const isPage = file.match(/[\\\/]page\.(tsx|jsx|js)$/i);
  const isRoute = file.match(/[\\\/]route\.(ts|js)$/i);
  
  if (isPage || isRoute) {
    const relativePath = path.relative(appDir, file);
    const parts = relativePath.split(/[\\\/]/);
    
    // Normalize route parts: remove route groups
    const cleanParts = parts.filter(p => !p.startsWith('(') || !p.endsWith(')'));
    let route = '/' + cleanParts.slice(0, -1).join('/');
    route = route.replace(/\/$/, '') || '/';
    
    allRoutes.push({
        type: isPage ? 'PAGE' : 'ROUTE',
        resolved: route,
        original: relativePath
    });
  }
});

allRoutes.sort((a, b) => a.resolved.localeCompare(b.resolved));

allRoutes.forEach(r => {
    console.log(`${r.type.padEnd(6)} | ${r.resolved.padEnd(40)} | ${r.original}`);
});

// Check for conflicts
const seen = {};
console.log('\n--- DETECTED CONFLICTS ---');
allRoutes.forEach(r => {
    if (seen[r.resolved]) {
        // A PAGE and a ROUTE can potentially conflict if they are GET
        // But Next.js handles them if they are in the same dir.
        // Wait, if they are in DIFFERENT dirs but resolve to same path, it's a conflict.
        if (seen[r.resolved].type === r.type) {
             console.log(`CONFLICT: Duplicate ${r.type} for ${r.resolved}`);
             console.log(`  1: ${seen[r.resolved].original}`);
             console.log(`  2: ${r.original}`);
        }
    }
    seen[r.resolved] = r;
});
