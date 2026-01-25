/* Lightweight helper: explains visual commands and how to record snapshots locally */
console.log(`
Visual regression helper — commands

1) Install dependencies (first time):
   npm install

2) Record baseline snapshots (run dev server first):
   npm run dev
   npm run visual:record

3) Run visual tests (compare latest -> baseline):
   npm run visual:test

Notes:
- Baseline images are in visual-snapshots/baseline
- Latest run images are written to visual-snapshots/latest
- To update baselines after visual approval: run the record command above
`);
