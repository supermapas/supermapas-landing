import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/preview-offer-value-math-correction-v1.mjs <html-file>');

let html = fs.readFileSync(target, 'utf8');

const replacements = [
  ['60% OFF', '50% OFF'],
  ['60% de desconto', '50% de desconto'],
  ['Sessenta por cento de desconto', 'Cinquenta por cento de desconto'],
  ['R$ 137,90', 'R$ 134,00'],
  ['R$137,90', 'R$134,00'],
  ['137,90 + R$ 37,00 + R$ 47,00', '134,00 + R$ 37,00 + R$ 47,00'],
  ['R$ 221,90', 'R$ 218,00'],
  ['R$221,90', 'R$218,00'],
  ['12x de R$ 5,90', '12x de R$ 6,93'],
  ['12x de R$5,90', '12x de R$6,93'],
  ['R$ 57 à vista', 'R$ 67 à vista'],
  ['R$57 à vista', 'R$67 à vista'],
  ['R$ 57,00', 'R$ 67,00'],
  ['R$57,00', 'R$67,00']
];

for (const [from, to] of replacements) html = html.split(from).join(to);

html = html.replace(
  /(<div class="sm-offer-value-final"><sup>R\$<\/sup><strong>)57(<\/strong><span>,00<\/span><\/div>)/g,
  '$167$2'
);

fs.writeFileSync(target, html);
console.log('Temporary offer applied: 50% OFF, R$67,00, 12x de R$6,93, R$134,00 reference and R$218,00 summed materials value.');
