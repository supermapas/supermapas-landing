import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/preview-offer-value-math-correction-v1.mjs <html-file>');

let html = fs.readFileSync(target, 'utf8');

const replacements = [
  ['R$ 137,90', 'R$ 142,50'],
  ['R$137,90', 'R$142,50'],
  ['137,90 + R$ 37,00 + R$ 47,00', '142,50 + R$ 37,00 + R$ 47,00'],
  ['R$ 221,90', 'R$ 226,50'],
  ['R$221,90', 'R$226,50']
];

for (const [from, to] of replacements) {
  html = html.split(from).join(to);
}

fs.writeFileSync(target, html);
console.log('Offer math corrected: R$142,50 reference -> 60% OFF = R$57,00; summed materials total R$226,50.');
