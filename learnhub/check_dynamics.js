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
const files = getFiles(appDir).filter(f => f.toLowerCase().endsWith('page.tsx') || f.toLowerCase().endsWith('route.ts'));

const segmentTree = {};

files.forEach(file => {
    const relativePath = path.relative(appDir, file).replace(/\\/g, '/');
    const parts = relativePath.split('/');
    const cleanParts = parts.filter(p => !p.startsWith('(') || !p.endsWith(')'));
    
    let current = segmentTree;
    cleanParts.slice(0, -1).forEach((part, idx) => {
        if (!current[part]) {
            current[part] = { _files: [] };
        }
        current = current[part];
    });
    if (current) {
        current._files.push(relativePath);
    }
});

function checkMismatches(tree, parentPath = '') {
    if (!tree) return;
    const children = Object.keys(tree).filter(k => !k.startsWith('_'));
    const dynamicChildren = children.filter(k => k.startsWith('[') && k.endsWith(']'));
    
    if (dynamicChildren.length > 1) {
        console.log(`!!! MISMATCH at ${parentPath || '/'}: ${dynamicChildren.join(', ')}`);
        dynamicChildren.forEach(child => {
            console.log(`  - ${child} used by:`);
            const subFiles = [];
            const collect = (t) => {
                if (t._files) subFiles.push(...t._files);
                Object.keys(t).filter(k => !k.startsWith('_')).forEach(k => collect(t[k]));
            };
            collect(tree[child]);
            subFiles.forEach(f => console.log(`    * ${f}`));
        });
    }
    
    children.forEach(child => {
        checkMismatches(tree[child], parentPath + '/' + child);
    });
}

console.log('--- DYNAMIC SEGMENT TREE CHECK ---');
checkMismatches(segmentTree);
