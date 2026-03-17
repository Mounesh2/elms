const fs = require('fs');
const path = require('path');

function getFiles(dir, allFiles = []) {
  if (!fs.existsSync(dir)) return allFiles;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const name = path.join(dir, file).replace(/\\/g, '/');
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, allFiles);
    } else {
      allFiles.push(name);
    }
  }
  return allFiles;
}

const appDir = path.join(process.cwd(), 'app').replace(/\\/g, '/');
const files = getFiles(appDir);

const routes = [];

files.forEach(file => {
  if (file.toLowerCase().endsWith('page.tsx') || file.toLowerCase().endsWith('route.ts')) {
    const relativePath = path.relative(appDir, file).replace(/\\/g, '/');
    const parts = relativePath.split('/');
    
    // Normalize: remove route groups
    const cleanParts = parts.filter(p => !p.startsWith('(') || !p.endsWith(')'));
    
    // Create normalized path for overlap detection (replacing dynamic segments)
    const normalizedParts = cleanParts.slice(0, -1).map(p => {
       if (p.startsWith('[') && p.endsWith(']')) return '[dynamic]';
       return p.toLowerCase();
    });
    
    const resolvedPath = '/' + normalizedParts.join('/');
    const finalRoute = resolvedPath.replace(/\/$/, '') || '/';
    
    routes.push({
      original: relativePath,
      resolved: finalRoute,
      type: file.toLowerCase().endsWith('page.tsx') ? 'PAGE' : 'ROUTE'
    });
  }
});

routes.sort((a, b) => a.resolved.localeCompare(b.resolved));

const seen = {};
console.log('--- ROUTE ANALYSIS ---');
routes.forEach(r => {
    console.log(`${r.type.padEnd(6)} | ${r.resolved.padEnd(40)} | ${r.original}`);
    const key = `${r.type}:${r.resolved}`;
    if (seen[key]) {
        console.log(`!!! CONFLICT DETECTED: ${key}`);
        console.log(`  - ${seen[key].original}`);
        console.log(`  - ${r.original}`);
    }
    seen[key] = r;
});

// Also check for dynamic segment name mismatches
const dynamics = {};
routes.forEach(r => {
    const segments = r.original.split('/').filter(p => !p.startsWith('(') || !p.endsWith(')'));
    segments.forEach((seg, idx) => {
        if (seg.startsWith('[') && seg.endsWith(']')) {
             const parent = '/' + segments.slice(0, idx).join('/');
             const key = `${parent}`;
             if (!dynamics[key]) dynamics[key] = new Set();
             dynamics[key].add(seg);
        }
    });
});

console.log('\n--- DYNAMIC SEGMENT CHECK ---');
for (const parent in dynamics) {
    if (dynamics[parent].size > 1) {
        console.log(`!!! MISMATCH AT ${parent}: ${Array.from(dynamics[parent]).join(', ')}`);
    }
}
