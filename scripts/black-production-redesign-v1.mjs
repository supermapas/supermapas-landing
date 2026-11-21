import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/black-production-redesign-v1.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

// Production-first: preserve original hero structure, product art, section spacing,
// all CTA copy and destinations, offer layout, and midnight-reset countdown.
const desktop = '<section class="sm-desktop-hero" id="inicio-desktop" aria-label="Supermapas de Língua Portuguesa">';
const mobile = '<section class="sm-mobile-hero" id="inicio-mobile" aria-label="Supermapas de Língua Portuguesa">';
const ribbon = '<div class="sm-bf2026-banner" role="note" aria-label="Campanha Black Friday Supermapas"><span class="sm-bf2026-spark" aria-hidden="true">✦</span><strong>BLACK FRIDAY</strong><span class="sm-bf2026-rule" aria-hidden="true"></span><span class="sm-bf2026-message">SUPERMAPAS <b>70% OFF</b></span></div>';
if (html.split(desktop).length !== 2 || html.split(mobile).length !== 2) throw new Error('Production hero markup changed');
html = html.replace(desktop, desktop + ribbon).replace(mobile, mobile + ribbon);

const badgeText = '<span>OFERTA ESPECIAL + 2 BÔNUS</span>';
if (html.split(badgeText).length !== 3) throw new Error('Expected original desktop/mobile badges');
html = html.replaceAll(badgeText, '<span>BLACK FRIDAY + 2 BÔNUS</span>');

const originalOfferLabel = '<span class="sm-offer-clear-label">OFERTA VÁLIDA NOS DIAS</span>';
if (!html.includes(originalOfferLabel)) throw new Error('Original offer date heading missing');
html = html.replace(originalOfferLabel, '<span class="sm-offer-clear-label">BLACK FRIDAY SUPERMAPAS</span>');

const offerEyebrow = '<span class="sm-offer-value-eyebrow">O QUE VOCÊ RECEBE</span>';
if (!html.includes(offerEyebrow)) throw new Error('Original offer eyebrow missing');
html = html.replace(offerEyebrow, '<span class="sm-offer-value-eyebrow">EDIÇÃO BLACK FRIDAY • O QUE VOCÊ RECEBE</span>');

if (!html.includes('data-sm-countdown-hours') || !html.includes('data-sm-dock-countdown') || !html.includes('data-sm-date-range')) throw new Error('Original rolling clock missing');
if (!html.includes('QUERO DOMINAR PORTUGUÊS') || !html.includes('QUERO AGORA')) throw new Error('Original CTA copy missing');
if (!html.includes('https://pay.hotmart.com/A92093667Q?off=ia91gsts&checkoutMode=10')) throw new Error('Original checkout link missing');

// Scoped, production-compatible palette: ink + existing purple + warm orange.
// No global resets, no broad selector changes, no mobile dock geometry changes.
const css = [
'<style id="sm-black-production-redesign-v1">',
':root{--sm-bf-ink:#211b2d;--sm-bf-purple:#7056d9;--sm-bf-orange:#f36a2d}',
'.sm-bf2026-banner{box-sizing:border-box;position:relative;z-index:7;display:flex;justify-content:center;align-items:center;gap:12px;width:100%;min-height:43px;padding:9px 14px;background:linear-gradient(100deg,#211b2d 0%,#302440 55%,#211b2d 100%);color:#fff;font-size:11px;font-weight:800;letter-spacing:.08em;line-height:1.15;text-align:center;border-bottom:2px solid #f36a2d}',
'.sm-bf2026-spark{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;color:#ffa66f;font-size:16px;line-height:1}',
'.sm-bf2026-banner>strong{color:#fff;font-size:12px;font-weight:950;letter-spacing:.13em;white-space:nowrap;line-height:1.1}',
'.sm-bf2026-rule{display:block;width:1px;height:16px;flex:0 0 1px;background:rgba(255,255,255,.28)}',
'.sm-bf2026-message{display:inline-flex;justify-content:center;align-items:center;gap:7px;color:#e9e2f3;white-space:nowrap;line-height:1.1}',
'.sm-bf2026-message b{display:inline-flex;align-items:center;justify-content:center;padding:5px 8px;border-radius:6px;background:#f36a2d;color:#fff;-webkit-text-fill-color:#fff;font-weight:950;letter-spacing:.03em;line-height:1}',
'/* Hero remains bright, and the original product imagery stays unchanged. */',
'.sm-desktop-hero{background:linear-gradient(180deg,#fff 0%,#fbf9ff 100%)!important}',
'.sm-mobile-hero{background:linear-gradient(180deg,#fff 0%,#fbf9ff 100%)!important}',
'.sm-hero-offer-badge-v3{background:#282033!important;border:1px solid #443553!important;box-shadow:0 8px 22px rgba(34,24,49,.11)!important}',
'.sm-hero-offer-badge-v3 strong{display:flex!important;justify-content:center!important;align-items:center!important;background:#f36a2d!important;color:#fff!important;-webkit-text-fill-color:#fff!important;text-align:center!important;line-height:1.05!important}',
'.sm-hero-offer-badge-v3 span{display:flex!important;justify-content:center!important;align-items:center!important;color:#fff!important;-webkit-text-fill-color:#fff!important;text-align:center!important;line-height:1.05!important}',
'/* Refine the original offer rather than replacing its layout or typography. */',
'.sm-offer-value{background:linear-gradient(180deg,#faf8ff 0%,#fff 86%)!important}',
'.sm-offer-value-eyebrow{background:#f2ebff!important;border:1px solid #e2d7fa!important;color:#6447c4!important;letter-spacing:.085em!important}',
'.sm-offer-value-checkout{background:linear-gradient(155deg,#292037 0%,#45305f 63%,#6044a4 100%)!important;box-shadow:inset 0 3px 0 #f36a2d,0 24px 54px rgba(53,38,93,.22)!important;border:1px solid rgba(124,94,169,.5)!important}',
'.sm-offer-clear-label{color:#ffa873!important;-webkit-text-fill-color:#ffa873!important;letter-spacing:.12em!important}',
'.sm-offer-clear-range,.sm-offer-clear-countdown>div>strong{color:#fff!important;-webkit-text-fill-color:#fff!important}',
'.sm-offer-clear-countdown>div>small{color:#dcd3e7!important;-webkit-text-fill-color:#dcd3e7!important}',
'.sm-offer-clear-countdown>i{color:#ffa873!important;-webkit-text-fill-color:#ffa873!important}',
'.sm-offer-clear-today{display:inline-flex!important;align-items:center!important;justify-content:center!important;background:#f36a2d!important;color:#fff!important;-webkit-text-fill-color:#fff!important;text-align:center!important}',
'.sm-offer-value-final sup,.sm-offer-value-final strong,.sm-offer-value-final>span{color:#fff!important;-webkit-text-fill-color:#fff!important}',
'.sm-offer-value-cta{background:linear-gradient(135deg,#f36a2d,#f47a38)!important;color:#fff!important;-webkit-text-fill-color:#fff!important}',
'.sm-offer-value-cta span{display:flex!important;align-items:center!important;justify-content:center!important;color:#fff!important;-webkit-text-fill-color:#fff!important;text-align:center!important}',
'.sm-offer-value-cta b{display:grid!important;place-items:center!important;color:#fff!important;-webkit-text-fill-color:#fff!important;line-height:1!important}',
'/* Keep the original mobile dock and its equal-width actions. Reinforce only contrast. */',
'.sm-sales-dock .sm-dock-checkout span{color:#fff!important;-webkit-text-fill-color:#fff!important}',
'.sm-sales-dock .sm-dock-checkout b{color:#fff!important;-webkit-text-fill-color:#fff!important}',
'.sm-sales-dock .sm-dock-whatsapp span{color:#fff!important;-webkit-text-fill-color:#fff!important}',
'.sm-sales-dock .sm-dock-whatsapp svg{fill:#fff!important;color:#fff!important}',
'@media(max-width:640px){.sm-bf2026-banner{min-height:40px;gap:7px;padding:7px 5px;font-size:9px;letter-spacing:.025em}.sm-bf2026-banner>strong{font-size:10px;letter-spacing:.065em}.sm-bf2026-spark{font-size:12px}.sm-bf2026-rule{height:13px}.sm-bf2026-message{gap:4px}.sm-bf2026-message b{padding:4px 5px}.sm-hero-offer-badge-v3 span{font-size:12px!important}.sm-offer-value-eyebrow{font-size:9px!important;letter-spacing:.045em!important}}',
'@media(max-width:365px){.sm-bf2026-banner{gap:5px;font-size:8.2px}.sm-bf2026-banner>strong{font-size:9px}.sm-bf2026-spark{display:none}.sm-bf2026-message b{padding:4px}.sm-hero-offer-badge-v3 span{font-size:11px!important}}',
'</style>'
].join('\n');
html = html.replace('<head>', '<head><meta name="robots" content="noindex,nofollow">');
html = html.replace('</head>', css + '\n</head>');
fs.writeFileSync(target, html);
console.log('Black Friday from Production: original structure and CTA preserved, pricing script independent, daily midnight clock intact.');
