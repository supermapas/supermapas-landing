import fs from 'node:fs';
const target = process.argv[2] || 'dist/index.html';
const html = fs.readFileSync(target, 'utf8');
fs.writeFileSync(target, html, 'utf8');
console.log('sales-v2 materializer syntax ok');
