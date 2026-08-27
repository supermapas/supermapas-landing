import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/preview-offer-value-unified-panel-v1.mjs <html-file>');

let html = fs.readFileSync(target, 'utf8');

html = html.replace(
  '<div class="sm-offer-value-list" aria-label="Composição da oferta">',
  '<div class="sm-offer-value-list sm-offer-value-list--unified" aria-label="Composição da oferta">'
);

html = html.replace(
  '<div class="sm-offer-value-price sm-offer-value-price--main-simple">\n            <small>VALOR</small><strong>R$ 137,90</strong>\n          </div>',
  '<div class="sm-offer-value-price sm-offer-value-price--main-simple">\n            <small>VALOR DE REFERÊNCIA</small><s>R$ 137,90</s>\n          </div>'
);

html = html.replace(
  '<span>VALOR TOTAL SE COMPRADOS SEPARADAMENTE</span>\n    <small>98 Supermapas + 50 Super-resumos + 190 Supercards</small>',
  '<span>SOMA DOS 3 MATERIAIS</span>\n    <small>R$ 137,90 + R$ 37,00 + R$ 47,00</small>'
);

const css = `
<style id="sm-preview-offer-value-unified-panel-v1">
.sm-offer-value-list--unified{
  gap:0!important;
  overflow:hidden!important;
  border:1.5px solid rgba(112,86,217,.22)!important;
  border-radius:24px!important;
  background:#fff!important;
  box-shadow:0 18px 42px rgba(58,43,103,.10)!important;
}
.sm-offer-value-list--unified>.sm-offer-value-item{
  min-height:112px!important;
  margin:0!important;
  border:0!important;
  border-bottom:1px solid #ece8f4!important;
  border-radius:0!important;
  box-shadow:none!important;
  background:#fff!important;
}
.sm-offer-value-list--unified>.sm-offer-value-item--main{
  background:linear-gradient(90deg,#fbf9ff 0%,#fff 68%)!important;
}
.sm-offer-value-list--unified>.sm-offer-value-item:last-of-type{
  border-bottom:0!important;
}
.sm-offer-value-price--main-simple{align-items:flex-end!important;gap:5px!important}
.sm-offer-value-price--main-simple small{
  color:#8c8593!important;
  font-size:8.5px!important;
  font-weight:950!important;
  letter-spacing:.075em!important;
}
.sm-offer-value-price--main-simple s{
  color:#77707e!important;
  font-size:16px!important;
  line-height:1!important;
  font-weight:850!important;
  text-decoration-color:#b4adba!important;
  text-decoration-thickness:2px!important;
}
.sm-offer-value-list--unified>.sm-offer-value-total--simple{
  position:relative!important;
  margin:0!important;
  padding:20px 21px!important;
  border:0!important;
  border-top:2px solid rgba(112,86,217,.18)!important;
  border-radius:0!important;
  background:linear-gradient(135deg,#f6f2ff 0%,#fff 74%)!important;
  box-shadow:none!important;
}
.sm-offer-value-list--unified>.sm-offer-value-total--simple:before{
  content:'+'!important;
  position:absolute!important;
  left:20px!important;
  top:-17px!important;
  display:grid!important;
  place-items:center!important;
  width:32px!important;
  height:32px!important;
  border:2px solid #fff!important;
  border-radius:50%!important;
  background:#7056d9!important;
  color:#fff!important;
  font-size:18px!important;
  line-height:1!important;
  font-weight:950!important;
  box-shadow:0 6px 14px rgba(112,86,217,.22)!important;
}
.sm-offer-value-list--unified>.sm-offer-value-total--simple>div:first-child{padding-left:41px!important}
.sm-offer-value-list--unified>.sm-offer-value-total--simple>div:first-child>span{
  color:#5740b9!important;
  font-size:11px!important;
  font-weight:950!important;
  letter-spacing:.11em!important;
}
.sm-offer-value-list--unified>.sm-offer-value-total--simple>div:first-child>small{
  margin-top:6px!important;
  color:#6d6674!important;
  font-size:11px!important;
  font-weight:750!important;
}
.sm-offer-value-list--unified>.sm-offer-value-total--simple .sm-offer-value-total-price:before{
  content:'TOTAL'!important;
  margin-bottom:5px!important;
  color:#7e7687!important;
  font-size:8.5px!important;
  font-weight:950!important;
  letter-spacing:.12em!important;
}
.sm-offer-value-list--unified>.sm-offer-value-total--simple .sm-offer-value-total-price s{
  color:#3c3447!important;
  font-size:28px!important;
  font-weight:950!important;
  text-decoration-color:#ef641f!important;
  text-decoration-thickness:4px!important;
}
@media(max-width:640px){
  .sm-offer-value-list--unified{border-radius:20px!important}
  .sm-offer-value-list--unified>.sm-offer-value-item{min-height:0!important;padding-top:15px!important;padding-bottom:15px!important}
  .sm-offer-value-price--main-simple small{font-size:7.3px!important;letter-spacing:.055em!important}
  .sm-offer-value-price--main-simple s{font-size:13.5px!important}
  .sm-offer-value-list--unified>.sm-offer-value-total--simple{padding:18px 14px!important}
  .sm-offer-value-list--unified>.sm-offer-value-total--simple:before{left:13px!important;top:-15px!important;width:28px!important;height:28px!important;font-size:16px!important}
  .sm-offer-value-list--unified>.sm-offer-value-total--simple>div:first-child{padding-left:33px!important}
  .sm-offer-value-list--unified>.sm-offer-value-total--simple>div:first-child>span{font-size:9.3px!important}
  .sm-offer-value-list--unified>.sm-offer-value-total--simple>div:first-child>small{font-size:9px!important;white-space:nowrap!important}
  .sm-offer-value-list--unified>.sm-offer-value-total--simple .sm-offer-value-total-price:before{font-size:7px!important}
  .sm-offer-value-list--unified>.sm-offer-value-total--simple .sm-offer-value-total-price s{font-size:22px!important}
}
@media(max-width:390px){
  .sm-offer-value-list--unified>.sm-offer-value-total--simple>div:first-child>small{font-size:8.2px!important}
  .sm-offer-value-list--unified>.sm-offer-value-total--simple .sm-offer-value-total-price s{font-size:20px!important}
}
</style>`;

html = html.replace('</head>', css + '\n</head>');
fs.writeFileSync(target, html);
console.log('Offer value composition unified into one visual panel with explicit arithmetic total.');
