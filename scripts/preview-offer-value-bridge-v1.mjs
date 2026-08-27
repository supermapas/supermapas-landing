import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/preview-offer-value-bridge-v1.mjs <html-file>');

let html = fs.readFileSync(target, 'utf8');

html = html.replace(
  '<h2 id="sm-offer-value-title">Veja tudo o que está <span>incluído na sua compra.</span></h2>\n      <p>98 Supermapas + 50 Super-resumos + 190 Supercards de Língua Portuguesa.</p>',
  '<h2 id="sm-offer-value-title">Tudo isso faz parte do <span>seu acesso.</span></h2>\n      <p>98 Supermapas + 50 Super-resumos + 190 Supercards de Língua Portuguesa.</p>'
);

const checkoutNeedle = `      </div>\n\n      <aside class="sm-offer-value-checkout" aria-label="Preço final dos Supermapas">`;
const bridge = `      </div>\n\n      <div class="sm-offer-value-bridge" aria-label="Transição para a condição especial">\n        <span class="sm-offer-value-bridge-line" aria-hidden="true"></span>\n        <p><span>E agora vem a melhor parte:</span><strong> você não paga R$ 221,90.</strong></p>\n        <b aria-hidden="true">↓</b>\n      </div>\n\n      <aside class="sm-offer-value-checkout" aria-label="Preço final dos Supermapas">`;

if (!html.includes('sm-offer-value-bridge')) {
  if (!html.includes(checkoutNeedle)) throw new Error('Offer checkout boundary not found.');
  html = html.replace(checkoutNeedle, bridge);
}

const css = `
<style id="sm-preview-offer-value-bridge-v1">
.sm-offer-value-bridge{display:none}
@media(max-width:820px){
  .sm-offer-value-layout{gap:0!important}
  .sm-offer-value-bridge{
    position:relative;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    min-height:112px;
    padding:20px 16px 18px;
    text-align:center;
  }
  .sm-offer-value-bridge-line{
    position:absolute;
    top:0;
    left:50%;
    width:2px;
    height:20px;
    transform:translateX(-50%);
    border-radius:999px;
    background:linear-gradient(180deg,#cfc4f4,#7056d9);
  }
  .sm-offer-value-bridge p{
    margin:4px 0 0;
    color:#5f5768;
    font-size:15px;
    line-height:1.34;
    letter-spacing:-.012em;
  }
  .sm-offer-value-bridge p span{font-weight:700}
  .sm-offer-value-bridge p strong{color:#2d2635;font-weight:950}
  .sm-offer-value-bridge>b{
    display:grid;
    place-items:center;
    width:30px;
    height:30px;
    margin-top:12px;
    border-radius:50%;
    background:#7056d9;
    color:#fff;
    font-size:17px;
    line-height:1;
    box-shadow:0 7px 18px rgba(112,86,217,.20);
  }
  .sm-offer-value-checkout{margin-top:0!important}
}
@media(max-width:640px){
  .sm-offer-value-head h2{max-width:360px!important;font-size:clamp(34px,9.2vw,41px)!important;line-height:1.01!important}
  .sm-offer-value-head p{max-width:350px!important;margin-top:13px!important}
  .sm-offer-value-bridge{min-height:106px;padding:19px 12px 16px}
  .sm-offer-value-bridge p{max-width:330px;font-size:14px}
}
</style>`;

html = html.replace('</head>', css + '\n</head>');
fs.writeFileSync(target, html);
console.log('Offer title simplified and total connected visually to the final-price card.');
