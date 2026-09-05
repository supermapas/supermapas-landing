import fs from 'node:fs';

const file = process.argv[2] || 'dist/index.html';
let html = fs.readFileSync(file, 'utf8');

const forbidden = [
  '261169597067924',
  'AW-18370953717',
  'A92093667Q',
  'ia91gsts'
];

// Remove Supermapas Meta Pixel block.
html = html.replace(/<script[^>]*id=["']sm-meta-pixel["'][^>]*>[\s\S]*?<\/script>/gi, '<!-- Mapas da Ale: Meta tracking intentionally disabled during bootstrap -->');

// Remove Supermapas Google Ads loader/config blocks.
html = html.replace(/<script[^>]*id=["']sm-google-tag-loader["'][^>]*>[\s\S]*?<\/script>/gi, '<!-- Mapas da Ale: Google Ads tracking intentionally disabled during bootstrap -->');
html = html.replace(/<script[^>]*id=["']sm-google-tag["'][^>]*>[\s\S]*?<\/script>/gi, '<!-- Mapas da Ale: Google Ads config intentionally disabled during bootstrap -->');

// Disable legacy Supermapas Hotmart checkout URLs until Mapas da Ale checkouts are defined.
html = html.replace(/https:\/\/pay\.hotmart\.com\/A92093667Q\?[^"'<>\s]*/gi, '#mapas-da-ale-checkout-pendente');

// Defense in depth: scrub any residual literal identifiers injected by later inline code or transformed markup.
html = html
  .replaceAll('261169597067924', 'MAPAS_DA_ALE_META_PIXEL_PENDENTE')
  .replaceAll('AW-18370953717', 'MAPAS_DA_ALE_GOOGLE_ADS_PENDENTE')
  .replaceAll('A92093667Q', 'MAPAS_DA_ALE_HOTMART_PRODUTO_PENDENTE')
  .replaceAll('ia91gsts', 'MAPAS_DA_ALE_HOTMART_OFERTA_PENDENTE');

fs.writeFileSync(file, html);

const remaining = forbidden.filter((token) => html.includes(token));
if (remaining.length) {
  console.error(`BOOTSTRAP BLOCKED: forbidden Supermapas identifiers remain: ${remaining.join(', ')}`);
  process.exit(1);
}

console.log('Mapas da Ale bootstrap sanitize: tracking and legacy checkout identifiers removed.');
