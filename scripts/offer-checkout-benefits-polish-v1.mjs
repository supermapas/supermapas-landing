import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/offer-checkout-benefits-polish-v1.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

const marker = '<div class="sm-offer-value-bonus-summary"><span>+ 50 Super-resumos</span><span>+ 190 Supercards</span><b>GRÁTIS</b></div>';
const benefits = `${marker}<div class="sm-offer-value-perks" aria-label="Condições de acesso e pagamento"><span><b>∞</b><strong>Acesso vitalício</strong><small>Seu acesso não expira.</small></span><span><b>1×</b><strong>Pagamento único</strong><small>Não é assinatura.</small></span></div>`;
if (!html.includes(marker)) throw new Error('Offer bonus summary not found.');
html = html.replace(marker, benefits);

const css = `<style id="sm-offer-checkout-benefits-polish-v1">
.sm-offer-value-perks{position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:-5px 0 18px}.sm-offer-value-perks>span{display:grid;grid-template-columns:34px minmax(0,1fr);grid-template-rows:auto auto;column-gap:9px;align-items:center;padding:11px 12px;border:1px solid rgba(255,255,255,.14);border-radius:14px;background:rgba(255,255,255,.075);color:#fff}.sm-offer-value-perks b{grid-row:1/3;display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:rgba(255,255,255,.13);font-size:13px;line-height:1;font-weight:950}.sm-offer-value-perks strong{font-size:11px;line-height:1.15;font-weight:900}.sm-offer-value-perks small{margin-top:2px;color:#e7e0ef;font-size:9px;line-height:1.2;font-weight:700}.sm-offer-value-cta{display:flex!important;align-items:center!important;justify-content:space-between!important;visibility:visible!important;opacity:1!important;min-height:60px!important;background:#fff!important;color:#4932a4!important;text-decoration:none!important}.sm-offer-value-cta span,.sm-offer-value-cta b{display:inline-flex!important;visibility:visible!important;opacity:1!important;color:#4932a4!important;-webkit-text-fill-color:#4932a4!important}.sm-offer-value-cta span{align-items:center!important;font-size:15px!important;line-height:1.1!important;font-weight:950!important;letter-spacing:.02em!important}.sm-offer-value-cta b{align-items:center!important;justify-content:center!important;font-size:24px!important;line-height:1!important}.sm-offer-value-cta:hover{background:#f7f4ff!important;color:#3e2991!important}.sm-offer-value-cta:hover span,.sm-offer-value-cta:hover b{color:#3e2991!important;-webkit-text-fill-color:#3e2991!important}
@media(max-width:640px){.sm-offer-value-perks{gap:7px;margin:-4px 0 16px}.sm-offer-value-perks>span{grid-template-columns:30px minmax(0,1fr);column-gap:8px;padding:10px}.sm-offer-value-perks b{width:30px;height:30px;border-radius:9px;font-size:12px}.sm-offer-value-perks strong{font-size:10.5px}.sm-offer-value-perks small{font-size:8.8px}.sm-offer-value-cta{min-height:58px!important;padding:15px 16px!important}.sm-offer-value-cta span{font-size:13.5px!important}}
@media(max-width:380px){.sm-offer-value-perks{grid-template-columns:1fr}.sm-offer-value-perks>span{grid-template-columns:30px minmax(0,1fr)}.sm-offer-value-cta span{font-size:13px!important}}
</style>`;
html = html.replace('</head>', css + '</head>');

fs.writeFileSync(target, html);
console.log('Offer CTA strengthened and payment clarified as non-subscription.');
