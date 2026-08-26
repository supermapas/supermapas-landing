import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/visual-section-order-v1.mjs <html-file>');

let html = fs.readFileSync(target, 'utf8');

const visualRe = /<section class="sm-visual-study\b[\s\S]*?id="estudo-visual"[\s\S]*?<\/section>/;
const visualMatch = html.match(visualRe);
if (!visualMatch) throw new Error('Visual study section #estudo-visual not found.');

const visualSection = visualMatch[0];
html = html.replace(visualRe, '');

const formatMarker = '<section class="sm-format-v2" id="formatos"';
if (!html.includes(formatMarker)) throw new Error('Format section #formatos not found.');
if (!html.includes('id="publicos"')) throw new Error('Audience section #publicos not found.');

html = html.replace(formatMarker, visualSection + formatMarker);

fs.writeFileSync(target, html);
console.log('Visual study section moved after #publicos and before #formatos.');
