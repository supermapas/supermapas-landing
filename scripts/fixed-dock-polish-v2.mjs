import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/fixed-dock-polish-v2.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

const oldBadge = '<div class="sm-dock-discount" aria-label="Oferta especial de cinquenta por cento de desconto"><span>OFERTA ESPECIAL</span><strong>50% OFF</strong></div>';
const newLead = '<div class="sm-dock-discount" aria-label="Cinquenta por cento de desconto">50% OFF</div><div class="sm-dock-inventory">98 Supermapas + 50 Super-Resumos + 190 Supercards</div>';
if (!html.includes(oldBadge)) throw new Error('Current fixed dock discount badge not found.');
html = html.replace(oldBadge, newLead);

const css = `<style id="sm-fixed-dock-polish-v2">
.sm-sales-dock{
  display:flex!important;
  grid-template-columns:none!important;
  align-items:center!important;
  justify-content:flex-start!important;
  gap:14px!important;
}
.sm-sales-dock .sm-dock-discount{
  position:static!important;
  display:inline-flex!important;
  align-items:center!important;
  justify-content:center!important;
  flex:0 0 auto!important;
  width:auto!important;
  min-width:0!important;
  min-height:38px!important;
  margin:0!important;
  padding:0 15px!important;
  border:0!important;
  border-radius:999px!important;
  background:#f36a2d!important;
  color:#fff!important;
  font-size:12px!important;
  font-weight:950!important;
  line-height:1!important;
  letter-spacing:.04em!important;
  white-space:nowrap!important;
  box-shadow:0 5px 14px rgba(243,106,45,.24)!important;
}
.sm-sales-dock .sm-dock-inventory{
  position:static!important;
  display:block!important;
  visibility:visible!important;
  opacity:1!important;
  flex:1 1 auto!important;
  width:auto!important;
  min-width:0!important;
  max-width:none!important;
  margin:0 auto 0 0!important;
  padding:0!important;
  color:#514b5a!important;
  font-size:12px!important;
  font-weight:850!important;
  line-height:1.2!important;
  white-space:nowrap!important;
  overflow:visible!important;
  text-overflow:clip!important;
}
.sm-sales-dock .sm-dock-actions{
  position:static!important;
  display:flex!important;
  flex:0 0 auto!important;
  width:auto!important;
  min-width:0!important;
  margin-left:auto!important;
}
@media(max-width:640px){
  .sm-sales-dock{gap:10px!important}
  .sm-sales-dock .sm-dock-discount{
    min-height:0!important;
    padding:0!important;
    border:0!important;
    border-radius:0!important;
    background:transparent!important;
    box-shadow:none!important;
    color:#ef641f!important;
    font-size:14px!important;
    font-weight:950!important;
    line-height:1!important;
    letter-spacing:.025em!important;
  }
  .sm-sales-dock .sm-dock-inventory{display:none!important}
  .sm-sales-dock .sm-dock-actions{margin-left:auto!important}
}
</style>`;
html = html.replace('</head>', css + '</head>');

fs.writeFileSync(target, html);
console.log('Fixed dock polished: mobile discount is orange text only; desktop inventory forced visible without price.');
