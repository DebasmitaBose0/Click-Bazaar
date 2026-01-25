const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const needle = 'dbose272@gmail.com';
let found = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else {
      const ext = path.extname(entry.name).toLowerCase();
      if (!['.js', '.ts', '.tsx', '.jsx', '.md', '.html', '.json', '.css', '.cjs'].includes(ext)) continue;
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes(needle)) found.push(full);
    }
  }
}

walk(root);

if (found.length) {
  console.log(`Found ${needle} in the following files:`);
  found.forEach(f => console.log('- ' + path.relative(root, f)));
  process.exit(0);
} else {
  console.error(`Could not find ${needle} in the repository.`);
  process.exit(1);
}
