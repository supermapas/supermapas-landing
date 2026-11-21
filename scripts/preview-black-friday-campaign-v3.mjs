import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/preview-black-friday-campaign-v3.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

// The campaign is applied to the original production-derived HTML, after pricing and clock scripts.
// Preserve product imagery, original section spacing, live daily countdown and checkout URLs.
const desktop = '<section class="sm-desktop-hero" id="inicio-desktop" aria-label="Supermapas de Língua Portuguesa">';
const mobile = '<section class="sm-mobile-hero" id="inicio-mobile" aria-label="Supermapas de Língua Portuguesa">';
const ribbon = '<div class="sm-bf-ribbon" aria-label="Black Friday Supermapas"><span class="sm-bf-ribbon-star" aria-hidden="true">✦</span><strong>BLACK FRIDAY</strong><i aria-hidden="true"></i><span>SUPERMAPAS <b>70% OFF</b></span></div>';
if (!html.includes(desktop) || !html.includes(mobile)) throw new Error('Hero sections not found');
html = html.replace(desktop, desktop + ribbon).replace(mobile, mobile + ribbon);

const badgeText = '<span>OFERTA ESPECIAL + 2 BÔNUS</span>';
if (html.split(badgeText).length !== 3) throw new Error('Expected two original offer badges');
html = html.replaceAll(badgeText, '<span>BLACK FRIDAY + 2 BÔNUS</span>');

// Keep concise, clear purchase labels, not "kit black".
html = html.replaceAll('QUERO DOMINAR PORTUGUÊS', 'GARANTIR MEU ACESSO');
html = html.replace('<span>QUERO AGORA</span>', '<span>GARANTIR</span>');

const clearLabel = '<span class="sm-offer-clear-label">OFERTA VÁLIDA NOS DIAS</span>';
if (!html.includes(clearLabel)) throw new Error('Countdown heading missing');
html = html.replace(clearLabel, '<span class="sm-offer-clear-label">BLACK FRIDAY • OFERTA DO DIA</span>');
if (!html.includes('data-sm-countdown-seconds') || !html.includes('data-sm-dock-countdown') || !html.includes('data-sm-date-range')) {
  throw new Error('Midnight countdown markers missing');
}
if (!html.includes('class="sm-dock-whatsapp"') || !html.includes('class="sm-offer-value-cta"')) throw new Error('Checkout or support CTA missing');

const css = [
'<style id="sm-preview-black-friday-campaign-v3">',
':root{--bf-ink:#21192d;--bf-plum:#342044;--bf-violet:#6c45cf;--bf-violet-dark:#5630b4;--bf-gold:#f8c875;--bf-cream:#fffaf1;--bf-muted:#645c70}',
'/* One palette across all campaign surfaces. The logo remains on a light background. */',
'.sm-desktop-hero,.sm-mobile-hero{background:linear-gradient(145deg,#fffdfa 0%,#f9f5ff 62%,#fff 100%)!important}',
'.sm-dh-header{border-bottom-color:#e8deef!important}.sm-mh-brand-wrap{border-bottom-color:#e8deef!important}',
'.sm-bf-ribbon{box-sizing:border-box;position:relative;z-index:6;display:flex;justify-content:center;align-items:center;gap:12px;min-height:46px;width:100%;padding:10px 14px;background:linear-gradient(110deg,#21192d,#3b2754 54%,#21192d);border-bottom:2px solid #f8c875;color:#fff;font-size:11px;line-height:1.1;font-weight:850;letter-spacing:.1em;text-align:center}',
'.sm-bf-ribbon-star{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#f8c875;color:#21192d;font-size:13px;line-height:1;flex:none}.sm-bf-ribbon>strong{font-size:12px;font-weight:950;color:#f8c875;letter-spacing:.13em;white-space:nowrap}.sm-bf-ribbon>i{width:1px;height:16px;flex:none;background:#ffffff57}.sm-bf-ribbon>span:last-child{color:#f7f1ff;white-space:nowrap}.sm-bf-ribbon b{display:inline-block;margin-left:6px;padding:5px 7px;border-radius:6px;background:#f8c875;color:#21192d;font-weight:950;letter-spacing:.03em}',
'/* Hero: dark ink, high contrast, consistent purple and no black text on purple buttons */',
'.sm-dh-copy h1,.sm-mh-title,.sm-mh-title-line-dark{color:#21192d!important}',
'.sm-dh-copy h1 span,.sm-mh-title span,.sm-mh-title-line-accent{color:#6c45cf!important}',
'.sm-dh-copy>p,.sm-mh-subtitle{color:#645c70!important}.sm-dh-copy>p strong,.sm-mh-subtitle strong{color:#30253e!important}',
'.sm-dh-header nav a{color:#493b58!important}.sm-dh-header nav a:hover{color:#6c45cf!important}',
'.sm-hero-offer-badge-v3{box-sizing:border-box!important;background:#21192d!important;border:1px solid #493459!important;box-shadow:0 9px 26px #21192d23!important;overflow:hidden!important}',
'.sm-hero-offer-badge-v3 strong{display:flex!important;justify-content:center!important;align-items:center!important;background:#f8c875!important;color:#21192d!important;-webkit-text-fill-color:#21192d!important;text-align:center!important}',
'.sm-hero-offer-badge-v3 span{display:flex!important;justify-content:center!important;align-items:center!important;color:#fff!important;-webkit-text-fill-color:#fff!important;text-align:center!important}',
'/* Three hero CTAs: label, icon and background have explicit contrast and alignment */',
'.sm-dh-primary,.sm-mh-cta,.sm-dh-header-cta{box-sizing:border-box!important;display:flex!important;justify-content:center!important;align-items:center!important;text-align:center!important;gap:12px!important;background:linear-gradient(120deg,#6c45cf,#5830b6)!important;color:#fff!important;-webkit-text-fill-color:#fff!important;border:1px solid #6c45cf!important;box-shadow:0 12px 24px #5730b42b!important;text-decoration:none!important}',
'.sm-dh-primary span,.sm-mh-cta span{display:flex!important;align-items:center!important;justify-content:center!important;min-width:0!important;color:#fff!important;-webkit-text-fill-color:#fff!important;font-weight:950!important;text-align:center!important;line-height:1.2!important}',
'.sm-dh-primary b,.sm-mh-cta b{display:grid!important;place-items:center!important;flex:0 0 auto!important;background:#fff!important;color:#5830b6!important;-webkit-text-fill-color:#5830b6!important;border-radius:50%!important;line-height:1!important}',
'.sm-dh-header-cta{font-size:11.5px!important;padding:0 10px!important;white-space:nowrap!important}',
'.sm-dh-actions small,.sm-mh-guarantee{color:#63596f!important}',
'.sm-dh-proof,.sm-mh-proof{background:#fff!important;border:1px solid #e9ddf6!important;box-shadow:0 8px 25px #21192d0c!important}',
'.sm-dh-proof strong,.sm-mh-proof-item strong{color:#5830b6!important}.sm-dh-proof span,.sm-mh-proof-item small{color:#63596f!important}',
'/* Offer section: elegant cream/lavender with crisp white valuation table */',
'.sm-offer-value{background:linear-gradient(180deg,#f7f2ff 0%,#fffaf4 68%,#fff 100%)!important}',
'.sm-offer-value-head h2{color:#21192d!important}.sm-offer-value-head h2 span{color:#6c45cf!important}',
'.sm-offer-value-head p{color:#63596f!important}',
'.sm-offer-value-list--unified{background:#fff!important;border-color:#e5d8f2!important;box-shadow:0 16px 42px #291d3e14!important}',
'.sm-offer-value-list--unified>.sm-offer-value-item{background:#fff!important;border-bottom-color:#f0e9f5!important}',
'.sm-offer-value-list--unified>.sm-offer-value-total--simple{background:#f6f0ff!important}',
'.sm-offer-value-bridge p{color:#21192d!important}.sm-offer-value-bridge-alert{color:#bd4034!important}',
'/* Checkout: complete dark-surface text/icon color system */',
'.sm-offer-value-checkout{background:radial-gradient(circle at 95% 0%,#65418a7d,transparent 45%),linear-gradient(145deg,#20172b,#362447 63%,#45285d)!important;border:1px solid #80649c!important;box-shadow:0 24px 58px #21192d3a!important;color:#fff!important}',
'.sm-offer-clear-label{color:#f8c875!important;letter-spacing:.11em!important}',
'.sm-offer-clear-range,.sm-offer-clear-countdown>div>strong{color:#fff!important;-webkit-text-fill-color:#fff!important}',
'.sm-offer-clear-countdown>div>small,.sm-offer-clear-countdown>i{color:#e5d5fa!important}',
'.sm-offer-clear-today{display:inline-flex!important;justify-content:center!important;align-items:center!important;background:#f8c875!important;color:#21192d!important;-webkit-text-fill-color:#21192d!important;border:0!important;box-shadow:0 8px 18px #0000001c!important;text-align:center!important}',
'.sm-offer-value-was--total span{color:#e4d7ef!important}.sm-offer-value-was--total s{color:#f8c875!important;-webkit-text-fill-color:#f8c875!important}',
'.sm-offer-price-today{color:#e9dbf4!important}.sm-offer-price-today strong{display:inline-flex!important;justify-content:center!important;align-items:center!important;background:#f8c875!important;color:#21192d!important;-webkit-text-fill-color:#21192d!important;border:0!important;text-align:center!important}.sm-offer-price-today em{color:#eee3fa!important}',
'.sm-offer-value-final,.sm-offer-value-final sup,.sm-offer-value-final strong,.sm-offer-value-final>span{color:#fff!important;-webkit-text-fill-color:#fff!important}',
'.sm-offer-value-installments,.sm-offer-value-installments strong{color:#f4ebff!important;-webkit-text-fill-color:#f4ebff!important}',
'.sm-offer-value-perks>span{border-color:#8a6b9c70!important;background:#ffffff12!important}',
'.sm-offer-value-perks b{display:grid!important;place-items:center!important;background:#f8c875!important;color:#21192d!important;-webkit-text-fill-color:#21192d!important;line-height:1!important}',
'.sm-offer-value-perks strong{color:#fff!important;-webkit-text-fill-color:#fff!important}.sm-offer-value-perks small{color:#e6d7ef!important}',
'.sm-offer-value-cta{box-sizing:border-box!important;display:grid!important;grid-template-columns:48px minmax(0,1fr) 48px!important;align-items:center!important;justify-items:stretch!important;gap:8px!important;min-height:66px!important;background:linear-gradient(115deg,#f8c875,#ffe0a0)!important;color:#21192d!important;-webkit-text-fill-color:#21192d!important;border:1px solid #ffe8b9!important;box-shadow:0 13px 28px #100c183d!important;text-decoration:none!important}',
'.sm-offer-value-cta:before{width:44px!important;height:44px!important;visibility:hidden!important}',
'.sm-offer-value-cta span{grid-column:2!important;display:flex!important;justify-content:center!important;align-items:center!important;min-width:0!important;color:#21192d!important;-webkit-text-fill-color:#21192d!important;text-align:center!important;font-size:clamp(12px,3.5vw,15px)!important;font-weight:950!important;line-height:1.1!important}',
'.sm-offer-value-cta b{grid-column:3!important;display:grid!important;place-items:center!important;justify-self:end!important;width:42px!important;height:42px!important;border-radius:50%!important;background:#21192d!important;color:#f8c875!important;-webkit-text-fill-color:#f8c875!important;font-size:22px!important;line-height:1!important}',
'.sm-offer-value-trust,.sm-offer-value-trust span{color:#eadff3!important}',
'/* Mobile sticky dock: preserve production layout, make all nested labels and icons legible */',
'.sm-sales-dock{background:#21192d!important;border:1px solid #5d4674!important;box-shadow:0 10px 30px #1b112f4d!important}',
'.sm-sales-dock .sm-dock-discount{display:flex!important;align-items:center!important;justify-content:center!important;color:#f8c875!important;-webkit-text-fill-color:#f8c875!important;text-align:center!important}',
'.sm-sales-dock .sm-dock-urgency{display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:center!important;text-align:center!important}',
'.sm-sales-dock .sm-dock-urgency span{color:#dfd0ef!important;-webkit-text-fill-color:#dfd0ef!important}',
'.sm-sales-dock .sm-dock-urgency strong{color:#fff!important;-webkit-text-fill-color:#fff!important;font-variant-numeric:tabular-nums!important}',
'.sm-sales-dock .sm-dock-actions{align-items:stretch!important}',
'.sm-sales-dock .sm-dock-checkout{display:flex!important;justify-content:center!important;align-items:center!important;text-align:center!important;background:#f8c875!important;color:#21192d!important;-webkit-text-fill-color:#21192d!important;border:0!important}',
'.sm-sales-dock .sm-dock-checkout span,.sm-sales-dock .sm-dock-checkout b{display:flex!important;justify-content:center!important;align-items:center!important;color:#21192d!important;-webkit-text-fill-color:#21192d!important;text-align:center!important;line-height:1.1!important}',
'.sm-sales-dock .sm-dock-whatsapp{display:flex!important;justify-content:center!important;align-items:center!important;text-align:center!important;background:#198754!important;color:#fff!important;-webkit-text-fill-color:#fff!important;border:0!important}',
'.sm-sales-dock .sm-dock-whatsapp span{color:#fff!important;-webkit-text-fill-color:#fff!important;line-height:1.1!important;text-align:center!important}',
'.sm-sales-dock .sm-dock-whatsapp svg{display:block!important;flex-shrink:0!important;fill:#fff!important;color:#fff!important}',
'.sm-sales-dock .sm-dock-whatsapp svg path{fill:#fff!important}',
'/* Narrow widths: keep every control inside its available grid cell */',
'@media(max-width:640px){.sm-bf-ribbon{min-height:41px;padding:7px 5px;gap:7px;font-size:9px;letter-spacing:.025em}.sm-bf-ribbon-star{width:18px;height:18px;font-size:11px}.sm-bf-ribbon>strong{font-size:10px;letter-spacing:.055em}.sm-bf-ribbon>i{height:14px}.sm-bf-ribbon b{margin-left:3px;padding:4px 5px}.sm-offer-value-cta{grid-template-columns:40px minmax(0,1fr) 40px!important;gap:4px!important;min-height:64px!important}.sm-offer-value-cta:before{width:38px!important;height:38px!important}.sm-offer-value-cta b{width:38px!important;height:38px!important}.sm-offer-value-cta span{font-size:13.5px!important}.sm-sales-dock .sm-dock-checkout span{font-size:9px!important;letter-spacing:0!important}.sm-sales-dock .sm-dock-whatsapp span{font-size:9px!important}}',
'@media(max-width:380px){.sm-bf-ribbon{gap:5px;font-size:8px}.sm-bf-ribbon-star{display:none}.sm-bf-ribbon>strong{font-size:9px}.sm-bf-ribbon b{padding:3px 4px}.sm-offer-value-cta span{font-size:12.5px!important}.sm-sales-dock .sm-dock-checkout span{font-size:8.5px!important}.sm-sales-dock .sm-dock-whatsapp span{font-size:8.5px!important}}',
'</style>'
].join('\n');

html = html.replace('<head>', '<head><meta name="robots" content="noindex,nofollow">');
html = html.replace('</head>', css + '\n</head>');
if (!html.includes('class="sm-bf-ribbon"') || html.includes('QUERO MEU KIT BLACK')) throw new Error('Black Friday campaign validation failed');
fs.writeFileSync(target, html);
console.log('Black Friday v3: coordinated colors for hero, pricing, CTA labels, icons, badges and sticky dock; daily clock preserved.');
