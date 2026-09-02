import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/preview-offer-value-math-correction-v1.mjs <html-file>');

let html = fs.readFileSync(target, 'utf8');

const replacements = [
  ['50% OFF', '70% OFF'],
  ['60% OFF', '70% OFF'],
  ['50% de desconto', '70% de desconto'],
  ['60% de desconto', '70% de desconto'],
  ['Cinquenta por cento de desconto', 'Setenta por cento de desconto'],
  ['Sessenta por cento de desconto', 'Setenta por cento de desconto'],
  ['R$ 134,00', 'R$ 156,67'],
  ['R$134,00', 'R$156,67'],
  ['R$ 142,50', 'R$ 156,67'],
  ['R$142,50', 'R$156,67'],
  ['R$ 137,90', 'R$ 156,67'],
  ['R$137,90', 'R$156,67'],
  ['134,00 + R$ 37,00 + R$ 47,00', '156,67 + R$ 37,00 + R$ 47,00'],
  ['142,50 + R$ 37,00 + R$ 47,00', '156,67 + R$ 37,00 + R$ 47,00'],
  ['137,90 + R$ 37,00 + R$ 47,00', '156,67 + R$ 37,00 + R$ 47,00'],
  ['R$ 218,00', 'R$ 240,67'],
  ['R$218,00', 'R$240,67'],
  ['R$ 226,50', 'R$ 240,67'],
  ['R$226,50', 'R$240,67'],
  ['R$ 221,90', 'R$ 240,67'],
  ['R$221,90', 'R$240,67'],
  ['12x de R$ 6,93', '12x de R$ 4,86'],
  ['12x de R$6,93', '12x de R$4,86'],
  ['12x de R$ 5,90', '12x de R$ 4,86'],
  ['12x de R$5,90', '12x de R$4,86'],
  ['R$ 67 à vista', 'R$ 47 à vista'],
  ['R$67 à vista', 'R$47 à vista'],
  ['R$ 57 à vista', 'R$ 47 à vista'],
  ['R$57 à vista', 'R$47 à vista']
];

for (const [from, to] of replacements) html = html.split(from).join(to);

html = html.replace(
  /(<div class="sm-offer-value-final"><sup>R\$<\/sup><strong>)(?:47|57|67)(<\/strong><span>,00<\/span><\/div>)/g,
  '$147$2'
);

fs.writeFileSync(target, html);
console.log('Preview offer applied: 70% OFF, R$47,00, 12x de R$4,86, R$156,67 reference and R$240,67 summed materials value.');
