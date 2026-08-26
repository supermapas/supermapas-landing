import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/offer-value-contrast-polish-v1.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

const css = `<style id="sm-offer-value-contrast-polish-v1">
.sm-offer-value-item{border-color:rgba(87,67,139,.18)!important;box-shadow:0 14px 34px rgba(58,43,103,.085)!important}.sm-offer-value-item--main{border-color:rgba(112,86,217,.34)!important;box-shadow:0 18px 42px rgba(68,48,120,.14)!important}.sm-offer-value-index{background:#ede7ff!important;color:#6749d3!important;font-size:13px!important;font-weight:950!important}.sm-offer-value-type{color:#6a4ed1!important;font-size:10px!important;font-weight:950!important;letter-spacing:.16em!important}.sm-offer-value-item--bonus .sm-offer-value-type{color:#e7611f!important}.sm-offer-value-copy h3{color:#211c28!important;font-weight:900!important}.sm-offer-value-copy h3 strong{color:#6547d6!important}.sm-offer-value-copy small{color:#706979!important;font-weight:650!important}.sm-offer-value-price>small{color:#746d7d!important;font-weight:800!important}.sm-offer-value-price s{color:#6d6675!important;font-weight:900!important;text-decoration-color:#6d6675!important;text-decoration-thickness:2.5px!important}.sm-offer-value-price b{padding:7px 11px!important;background:#fff0e7!important;color:#d95416!important;border:1px solid rgba(232,95,29,.08)!important;font-size:11px!important;font-weight:950!important;box-shadow:0 5px 12px rgba(232,95,29,.07)!important}.sm-offer-value-price .sm-offer-value-free{background:#e5f7ef!important;color:#087e59!important;border-color:rgba(8,126,89,.08)!important;box-shadow:0 5px 12px rgba(8,126,89,.06)!important}
@media(max-width:640px){.sm-offer-value-index{font-size:11px!important}.sm-offer-value-type{font-size:9.5px!important}.sm-offer-value-copy small{font-size:9.5px!important}.sm-offer-value-price s{font-size:15px!important}.sm-offer-value-price b{padding:6px 9px!important;font-size:9.5px!important}}
</style>`;
html = html.replace('</head>', css + '</head>');
fs.writeFileSync(target, html);
console.log('Offer value cards contrast strengthened.');
