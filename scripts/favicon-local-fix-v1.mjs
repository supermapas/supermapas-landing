import fs from 'node:fs';

const file = process.argv[2];
if (!file) throw new Error('Usage: node scripts/favicon-local-fix-v1.mjs <html-file>');

let html = fs.readFileSync(file, 'utf8');

const localFavicon = '<link rel="icon" type="image/png" href="/favicon.png?v=20260826"/>';

html = html.replace(/<link\s+rel=["']icon["'][^>]*>/i, localFavicon);

if (!html.includes(localFavicon)) {
  html = html.replace('</head>', `${localFavicon}\n</head>`);
}

fs.writeFileSync(file, html);
