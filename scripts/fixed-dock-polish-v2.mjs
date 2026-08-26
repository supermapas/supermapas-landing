import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/fixed-dock-polish-v2.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

const oldBadge = '<div class="sm-dock-discount" aria-label="Oferta especial de cinquenta por cento de desconto"><span>OFERTA ESPECIAL</span><strong>50% OFF</strong></div>';
const newLead = '<div class="sm-dock-discount" aria-label="Cinquenta por cento de desconto">50% OFF</div><div class="sm-dock-inventory">98 Supermapas + 50 Super-Resumos + 190 Supercards</div>';
if (!html.includes(oldBadge)) throw new Error('Current fixed dock discount badge not found.');
html = html.replace(oldBadge, newLead);

const css = `<style id="sm-fixed-dock-polish-v2">
.sm-sales-dock{display:flex!important;align-items:center!important;gap:14px!important}
.sm-dock-discount{display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 auto!important;min-height:38px!important;padding:0 15px!important;border:0!important;border-radius:999px!important;background:#f36a2d!important;color:#fff!important;font-size:12px!important;font-weight:950!important;line-height:1!important;letter-spacing:.04em!important;white-space:nowrap!important;box-shadow:0 5px 14px rgba(243,106,45,.24)!important}
.sm-dock-inventory{min-width:0!important;margin-right:auto!important;color:#514b5a!important;font-size:12px!important;font-weight:850!important;line-height:1.2!important;white-space:nowrap!important}
.sm-sales-dock .sm-dock-actions{flex:0 0 auto!important;margin-left:auto!important}
@media(max-width:640px){.sm-sales-dock{gap:8px!important}.sm-dock-discount{min-height:34px!important;padding:0 10px!important;font-size:10px!important}.sm-dock-inventory{display:none!important}.sm-sales-dock .sm-dock-actions{margin-left:auto!important}}
</style>`;
html = html.replace('</head>', css + '</head>');

fs.writeFileSync(target, html);
console.log('Fixed dock polished: orange 50% OFF only on mobile; desktop inventory restored without price.');
