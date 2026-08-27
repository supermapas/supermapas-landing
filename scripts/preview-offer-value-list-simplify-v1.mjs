import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/preview-offer-value-list-simplify-v1.mjs <html-file>');

let html = fs.readFileSync(target, 'utf8');

html = html.replace(
  '<span class="sm-offer-value-eyebrow">OFERTA ESPECIAL · 60% OFF</span>\n      <h2 id="sm-offer-value-title">Veja tudo o que você recebe — <span>e quanto pagaria separadamente.</span></h2>\n      <p>Compare o valor individual dos materiais com a condição especial aplicada à oferta.</p>',
  '<span class="sm-offer-value-eyebrow">O QUE VOCÊ RECEBE</span>\n      <h2 id="sm-offer-value-title">Veja tudo o que está <span>incluído na sua compra.</span></h2>\n      <p>98 Supermapas + 50 Super-resumos + 190 Supercards de Língua Portuguesa.</p>'
);

html = html.replace(
  '<div class="sm-offer-value-price">\n            <small>de</small><s>R$ 137,90</s>\n            <b>60% OFF</b>\n          </div>',
  '<div class="sm-offer-value-price sm-offer-value-price--main-simple">\n            <small>VALOR</small><strong>R$ 137,90</strong>\n          </div>'
);

const oldTotal = `<div class="sm-offer-value-total" role="note" aria-label="Valor total somado dos materiais">
  <div>
    <span>VALOR TOTAL DOS MATERIAIS</span>
    <small>98 Supermapas + 50 Super-resumos + 190 Supercards</small>
    <b>VOCÊ NÃO PAGA ESSE VALOR</b>
  </div>
  <div class="sm-offer-value-total-price">
    <small>TOTAL</small>
    <s>R$ 221,90</s>
  </div>
</div>`;

const newTotal = `<div class="sm-offer-value-total sm-offer-value-total--simple" role="note" aria-label="Valor total dos materiais comprados separadamente">
  <div>
    <span>VALOR TOTAL SE COMPRADOS SEPARADAMENTE</span>
    <small>98 Supermapas + 50 Super-resumos + 190 Supercards</small>
  </div>
  <div class="sm-offer-value-total-price">
    <s>R$ 221,90</s>
  </div>
</div>`;

if (html.includes(oldTotal)) html = html.replace(oldTotal, newTotal);
else throw new Error('Current offer total block not found.');

const css = `
<style id="sm-preview-offer-value-list-simplify-v1">
.sm-offer-value-head{max-width:820px!important;margin-bottom:30px!important}
.sm-offer-value-head h2{max-width:780px!important;margin-left:auto!important;margin-right:auto!important}
.sm-offer-value-head p{max-width:650px!important}
.sm-offer-value-price--main-simple{gap:4px!important}
.sm-offer-value-price--main-simple small{color:#777080!important;font-size:9px!important;font-weight:900!important;letter-spacing:.08em!important}
.sm-offer-value-price--main-simple strong{color:#332d3b!important;font-size:17px!important;line-height:1!important;font-weight:950!important;white-space:nowrap!important}
.sm-offer-value-total--simple{padding-top:22px!important;padding-bottom:22px!important;background:#fff!important}
.sm-offer-value-total--simple>div:first-child>span{max-width:340px!important;color:#6048c4!important;font-size:11px!important;line-height:1.25!important;letter-spacing:.10em!important}
.sm-offer-value-total--simple>div:first-child>small{margin-top:6px!important;color:#7b7481!important}
.sm-offer-value-total--simple .sm-offer-value-total-price{justify-content:center!important}
.sm-offer-value-total--simple .sm-offer-value-total-price s{margin-top:0!important;color:#3f3749!important;font-size:30px!important;text-decoration-color:#ef641f!important;text-decoration-thickness:4px!important}
@media(max-width:640px){
  .sm-offer-value-head{margin-bottom:22px!important}
  .sm-offer-value-head h2{max-width:355px!important;font-size:clamp(31px,8.6vw,38px)!important;line-height:1.02!important;letter-spacing:-.04em!important}
  .sm-offer-value-head p{max-width:355px!important;margin-top:12px!important;font-size:13.5px!important;line-height:1.42!important}
  .sm-offer-value-price--main-simple strong{font-size:14.5px!important}
  .sm-offer-value-price--main-simple small{font-size:8px!important}
  .sm-offer-value-total--simple{align-items:center!important;padding:17px 14px!important}
  .sm-offer-value-total--simple>div:first-child>span{max-width:210px!important;font-size:9.4px!important;line-height:1.25!important}
  .sm-offer-value-total--simple>div:first-child>small{max-width:220px!important;font-size:9px!important}
  .sm-offer-value-total--simple .sm-offer-value-total-price s{font-size:23px!important}
}
@media(max-width:390px){
  .sm-offer-value-head h2{font-size:clamp(30px,8.4vw,35px)!important}
  .sm-offer-value-total--simple>div:first-child>span{max-width:190px!important;font-size:8.8px!important}
  .sm-offer-value-total--simple .sm-offer-value-total-price s{font-size:21px!important}
}
</style>`;

html = html.replace('</head>', css + '\n</head>');
fs.writeFileSync(target, html);
console.log('Offer value list simplified: clearer inclusion story, no discount badge in material list, simpler total.');
