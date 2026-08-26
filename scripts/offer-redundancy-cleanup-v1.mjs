import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/offer-redundancy-cleanup-v1.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

// Remove the redundant offer-summary panels from both hero variants.
// Their content is already communicated by the hero and later dedicated sections.
const desktopBefore = html;
html = html.replace(/<div class="sm-dh-offer"\b[\s\S]*?<\/div><\/section>(?=<section class="sm-mobile-hero")/, '</section>');
if (html === desktopBefore) throw new Error('Desktop hero offer summary not found.');

const mobileBefore = html;
html = html.replace(/<div class="sm-mh-offer"\b[\s\S]*?<\/div><\/section>(?=<section)/, '</section>');
if (html === mobileBefore) throw new Error('Mobile hero offer summary not found.');

// The fixed dock should sell the current offer without exposing price before
// the dedicated offer section. Keep the existing checkout + WhatsApp actions.
const dockLeadRe = /<div class="sm-dock-counts"[\s\S]*?<\/div><div class="sm-dock-price"[\s\S]*?<\/div>(?=<div class="sm-dock-actions">)/;
if (!dockLeadRe.test(html)) throw new Error('Fixed dock counts/price blocks not found.');
html = html.replace(
  dockLeadRe,
  '<div class="sm-dock-discount" aria-label="Oferta especial de cinquenta por cento de desconto"><span>OFERTA ESPECIAL</span><strong>50% OFF</strong></div>'
);

const css = `<style id="sm-offer-redundancy-cleanup-v1">
.sm-dock-discount{
  display:flex;align-items:center;gap:9px;min-width:0;
  padding:6px 7px 6px 12px;border:1px solid rgba(101,78,210,.18);border-radius:999px;
  background:#fff;box-shadow:0 6px 18px rgba(54,38,120,.08);
  color:#51428f;font-size:10px;font-weight:900;line-height:1;letter-spacing:.10em;white-space:nowrap;
}
.sm-dock-discount strong{
  display:inline-flex;align-items:center;justify-content:center;padding:7px 11px;border-radius:999px;
  background:#f36a2d;color:#fff;font-size:12px;line-height:1;font-weight:950;letter-spacing:.04em;
  box-shadow:0 5px 14px rgba(243,106,45,.22);
}
@media(max-width:640px){
  .sm-dock-discount{flex:0 0 auto;padding:5px 6px 5px 9px;font-size:8px;gap:6px;letter-spacing:.07em}
  .sm-dock-discount strong{padding:6px 8px;font-size:10px}
}
</style>`;
html = html.replace('</head>', css + '</head>');

fs.writeFileSync(target, html);
console.log('Redundant hero offer panels removed; fixed dock simplified to 50% OFF + actions.');
