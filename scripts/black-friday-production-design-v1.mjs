import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/black-friday-production-design-v1.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

// Exact Production markup. Avoid rewriting existing CTA structure or mobile dock.
const desktop = '<section class="sm-desktop-hero" id="inicio-desktop" aria-label="Supermapas de Língua Portuguesa">';
const mobile = '<section class="sm-mobile-hero" id="inicio-mobile" aria-label="Supermapas de Língua Portuguesa">';
if (html.split(desktop).length !== 2 || html.split(mobile).length !== 2) throw new Error('Unexpected hero structure');

const campaign = '<div class="sm-bf-campaign" role="note" aria-label="Black Friday Supermapas"><span class="sm-bf-campaign-mark" aria-hidden="true">✦</span><strong>BLACK FRIDAY</strong><span class="sm-bf-campaign-separator" aria-hidden="true"></span><span class="sm-bf-campaign-brand">SUPERMAPAS</span><span class="sm-bf-campaign-discount">70% OFF</span></div>';
html = html.replace(desktop, desktop + campaign).replace(mobile, mobile + campaign);

const badge = '<span>OFERTA ESPECIAL + 2 BÔNUS</span>';
if (html.split(badge).length !== 3) throw new Error('Unexpected offer badge structure');
html = html.replaceAll(badge, '<span>BLACK FRIDAY + 2 BÔNUS</span>');

const dateLabel = '<span class="sm-offer-clear-label">OFERTA VÁLIDA NOS DIAS</span>';
if (!html.includes(dateLabel)) throw new Error('Countdown label missing');
html = html.replace(dateLabel, '<span class="sm-offer-clear-label">BLACK FRIDAY SUPERMAPAS</span>');

const eyebrow = '<span class="sm-offer-value-eyebrow">O QUE VOCÊ RECEBE</span>';
if (!html.includes(eyebrow)) throw new Error('Offer eyebrow missing');
html = html.replace(eyebrow, '<span class="sm-offer-value-eyebrow">BLACK FRIDAY • KIT COMPLETO</span>');

// Invariant: original purchase copy, markup, checkout link and daily clock survive unchanged.
for (const required of ['QUERO DOMINAR PORTUGUÊS','QUERO AGORA','data-sm-countdown-hours','data-sm-dock-countdown','data-sm-date-range','https://pay.hotmart.com/A92093667Q?off=ia91gsts&checkoutMode=10']) {
  if (!html.includes(required)) throw new Error('Missing original element: ' + required);
}

const css = [
'<style id="sm-black-friday-production-design-v1">',
'/* Design tokens are used only in new campaign elements. Original hero, dock and CTA colors remain untouched. */',
'.sm-bf-campaign{box-sizing:border-box;position:relative;z-index:6;display:flex;align-items:center;justify-content:center;gap:12px;min-height:41px;width:100%;padding:7px 12px;background:#211b2d;color:#fff;-webkit-text-fill-color:#fff;border-bottom:2px solid #ef641f;font-size:11px;font-weight:850;line-height:1.1;letter-spacing:.075em;text-align:center}',
'.sm-bf-campaign-mark{display:flex;align-items:center;justify-content:center;width:22px;height:22px;flex:0 0 22px;border:1px solid rgba(255,255,255,.23);border-radius:50%;color:#ffb381;-webkit-text-fill-color:#ffb381;font-size:12px;line-height:1}',
'.sm-bf-campaign>strong{color:#fff;-webkit-text-fill-color:#fff;font-size:12px;font-weight:950;letter-spacing:.12em;line-height:1.1;white-space:nowrap}',
'.sm-bf-campaign-separator{display:block;width:1px;height:14px;flex:0 0 1px;background:rgba(255,255,255,.28)}',
'.sm-bf-campaign-brand{color:#e8def5;-webkit-text-fill-color:#e8def5;white-space:nowrap}',
'.sm-bf-campaign-discount{display:flex;align-items:center;justify-content:center;min-height:25px;padding:4px 10px;border-radius:6px;background:#ef641f;color:#211b2d;-webkit-text-fill-color:#211b2d;font-size:11px;font-weight:950;letter-spacing:.025em;white-space:nowrap;line-height:1}',
'/* Badge retains Production sizing and alignment; only palette and copy change. */',
'.sm-hero-offer-badge-v3{background:#211b2d!important;border-color:#51415e!important;box-shadow:0 7px 18px rgba(33,27,45,.11)!important}',
'.sm-hero-offer-badge-v3 strong{background:#ef641f!important;color:#211b2d!important;-webkit-text-fill-color:#211b2d!important;text-align:center!important}',
'.sm-hero-offer-badge-v3 span{color:#fff!important;-webkit-text-fill-color:#fff!important;text-align:center!important}',
'/* Card remains the Production purple; campaign marker is a fine accent, not a repaint. */',
'.sm-offer-value-checkout{border-top:3px solid #ef641f!important}',
'.sm-offer-clear-label{color:#ffd2b9!important;-webkit-text-fill-color:#ffd2b9!important}',
'/* Fix an existing Production bug: max-content bridge text forces the mobile grid to 438px and clips the entire price card. */',
'@media(max-width:820px){.sm-offer-value-layout{grid-template-columns:minmax(0,1fr)!important;min-width:0!important}.sm-offer-value-layout>.sm-offer-value-list,.sm-offer-value-layout>.sm-offer-value-bridge,.sm-offer-value-layout>.sm-offer-value-checkout{min-width:0!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important}.sm-offer-value-bridge p{width:100%!important;max-width:100%!important;white-space:normal!important;overflow-wrap:normal!important}}',
'@media(max-width:640px){.sm-section-nav-label{display:none!important}}',
'/* No changes to any existing CTA, its nested text/icon, the price typography or the dock. */',
'@media(max-width:640px){.sm-bf-campaign{min-height:38px;padding:6px 7px;gap:7px;font-size:10px;letter-spacing:.02em}.sm-bf-campaign-mark{width:18px;height:18px;flex-basis:18px;font-size:10px}.sm-bf-campaign>strong{font-size:10px;letter-spacing:.05em}.sm-bf-campaign-brand{display:none}.sm-bf-campaign-separator{display:none}.sm-bf-campaign-discount{min-height:24px;padding:4px 9px;font-size:10px}}',
'@media(max-width:360px){.sm-bf-campaign{gap:6px}.sm-bf-campaign-mark{display:none}.sm-bf-campaign>strong{font-size:10px}.sm-bf-campaign-discount{padding:4px 7px}}',
'</style>'
].join('\n');
html = html.replace('<head>', '<head><meta name="robots" content="noindex,nofollow">');
html = html.replace('</head>', css + '\n</head>');
fs.writeFileSync(target, html);
console.log('Production-first Black Friday: existing buttons and icons untouched; original countdown preserved.');
