import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/preview-offer-price-white-v1.mjs <html-file>');

let html = fs.readFileSync(target, 'utf8');

const css = `
<style id="sm-preview-offer-price-white-v1">
.sm-offer-price-today{margin-top:13px!important;gap:8px!important;align-items:center!important}
.sm-offer-price-today strong{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:29px!important;padding:0 11px!important;border-radius:999px!important;background:#2ab47f!important;color:#fff!important;font-size:12px!important;font-weight:950!important;line-height:1!important;letter-spacing:.10em!important;box-shadow:0 7px 18px rgba(42,180,127,.24)!important;text-shadow:none!important}
.sm-offer-price-today em{color:#fff!important;font-size:11px!important;font-weight:900!important}
.sm-offer-value-final{align-items:flex-start!important;margin-top:5px!important;margin-bottom:3px!important;color:#fff!important}
.sm-offer-value-final sup{margin:13px 6px 0 0!important;color:#fff!important;font-size:24px!important;font-weight:900!important}
.sm-offer-value-final strong{color:#fff!important;font-size:86px!important;letter-spacing:-.055em!important;text-shadow:0 10px 26px rgba(0,0,0,.12)!important}
.sm-offer-value-final>span{margin:12px 0 0 1px!important;color:#fff!important;font-size:31px!important;font-weight:900!important}
.sm-offer-value-installments{margin:2px 0 20px!important}
@media(max-width:640px){
  .sm-offer-price-today{margin-top:12px!important;gap:7px!important}
  .sm-offer-price-today strong{min-height:28px!important;padding:0 10px!important;font-size:11.5px!important}
  .sm-offer-price-today em{font-size:10.5px!important}
  .sm-offer-value-final sup{margin-top:12px!important;font-size:22px!important}
  .sm-offer-value-final strong{font-size:78px!important}
  .sm-offer-value-final>span{margin-top:11px!important;font-size:29px!important}
  .sm-offer-value-installments{margin-top:0!important;margin-bottom:20px!important}
}
@media(max-width:390px){
  .sm-offer-price-today strong{min-height:27px!important;padding:0 9px!important;font-size:11px!important}
  .sm-offer-value-final sup{font-size:21px!important}
  .sm-offer-value-final strong{font-size:74px!important}
  .sm-offer-value-final>span{font-size:27px!important}
}
</style>`;

html = html.replace('</head>', css + '\n</head>');
fs.writeFileSync(target, html);
console.log('Offer price refined: HOJE uses the same #2AB47F green as the GRÁTIS badge, with white label and white R$57,00.');
