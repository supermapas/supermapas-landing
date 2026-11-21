import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/preview-black-friday-campaign-v2.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

// Black Friday accents are deliberately confined to existing light/dark surfaces.
// Keep original typography, readable hero, mobile dock geometry and CTA destinations.
const desktop = '<section class="sm-desktop-hero" id="inicio-desktop" aria-label="Supermapas de Língua Portuguesa">';
const mobile = '<section class="sm-mobile-hero" id="inicio-mobile" aria-label="Supermapas de Língua Portuguesa">';
const ribbon = '<div class="sm-black-ribbon" role="note" aria-label="Campanha Black Friday Supermapas"><span class="sm-black-ribbon-icon" aria-hidden="true">✦</span><strong>BLACK FRIDAY</strong><span class="sm-black-ribbon-divider" aria-hidden="true"></span><span>SUPERMAPAS <b>70% OFF</b></span></div>';
if (!html.includes(desktop) || !html.includes(mobile)) throw new Error('Both hero sections must exist');
html = html.replace(desktop, desktop + ribbon).replace(mobile, mobile + ribbon);

const originalBadge = '<span>OFERTA ESPECIAL + 2 BÔNUS</span>';
if (html.split(originalBadge).length - 1 !== 2) throw new Error('Expected exactly two hero offer badges');
html = html.replaceAll(originalBadge, '<span>BLACK FRIDAY + 2 BÔNUS</span>');

// Keep the previous, tested purchase copy: QUERO DOMINAR PORTUGUÊS.
// Keep the existing mobile dock's TERMINA HOJE + countdown and its exact dimensions.
const clearLabel = '<span class="sm-offer-clear-label">OFERTA VÁLIDA NOS DIAS</span>';
if (!html.includes(clearLabel)) throw new Error('Original countdown header not found');
html = html.replace(clearLabel, '<span class="sm-offer-clear-label">BLACK FRIDAY • OFERTA DO DIA</span>');

const dockMarkup = '<div class="sm-dock-urgency" aria-label="Oferta termina hoje"><span>TERMINA HOJE</span><strong data-sm-dock-countdown>--:--:--</strong></div>';
if (!html.includes(dockMarkup)) throw new Error('Daily countdown missing from mobile dock');

const offerClock = '<div class="sm-offer-clear-countdown" aria-label="Contagem regressiva até meia-noite">';
if (!html.includes(offerClock)) throw new Error('Original offer countdown missing');

const css = [
'<style id="sm-preview-black-friday-campaign-v2">',
':root{--sm-bf-ink:#1c1724;--sm-bf-purple:#7056d9;--sm-bf-gold:#ffd58a}',
'/* High-contrast campaign ribbon, separate from the light hero */',
'.sm-black-ribbon{box-sizing:border-box;position:relative;z-index:5;display:flex;align-items:center;justify-content:center;gap:12px;width:100%;min-height:42px;padding:9px 14px;background:linear-gradient(95deg,#1c1724,#2e2044 53%,#1c1724);color:#f5efff;font-size:11px;font-weight:800;line-height:1.2;letter-spacing:.09em;text-align:center;box-shadow:inset 0 -1px rgba(255,255,255,.1)}',
'.sm-black-ribbon-icon{color:#ffd58a;font-size:16px;line-height:1}.sm-black-ribbon>strong{color:#ffd58a;font-size:12px;font-weight:950;white-space:nowrap;letter-spacing:.13em}.sm-black-ribbon-divider{flex:0 0 1px;width:1px;height:16px;background:rgba(255,255,255,.27)}.sm-black-ribbon>span:last-child{color:#fff;white-space:nowrap}.sm-black-ribbon b{margin-left:5px;color:#ffd58a;font-weight:950}',
'/* Preserve original hero backgrounds, text and product images; badge ties them to Black */',
'.sm-hero-offer-badge-v3{background:#21192d!important;border:1px solid #4a3868!important;box-shadow:0 10px 24px rgba(41,27,66,.14)!important}',
'.sm-hero-offer-badge-v3 strong{background:#ffd58a!important;color:#21192d!important}',
'.sm-hero-offer-badge-v3 span{color:#fff!important}',
'/* Light offer section and white material valuation panel stay readable */',
'.sm-offer-value{background:linear-gradient(180deg,#f7f4fd 0%,#fff 90%)!important}',
'.sm-offer-value-head h2 span{color:#7056d9!important}',
'.sm-offer-value-bridge-alert{color:#c74e35!important}',
'/* Dark checkout card and matching purple call to action */',
'.sm-offer-value-checkout{background:radial-gradient(circle at 93% 0%,rgba(136,91,206,.22),transparent 47%),linear-gradient(145deg,#1c1724 0%,#30213f 60%,#48336d 100%)!important;border:1px solid rgba(164,131,223,.40)!important;box-shadow:0 24px 50px rgba(39,25,67,.21)!important}',
'.sm-offer-clear-label{color:#ffd58a!important;letter-spacing:.12em!important}',
'.sm-offer-clear-range{color:#fff!important}',
'.sm-offer-clear-today{background:#ffd58a!important;color:#241c2e!important;box-shadow:0 8px 20px rgba(255,213,138,.16)!important}',
'.sm-offer-clear-countdown>div>strong{color:#fff!important}.sm-offer-clear-countdown>i{color:#d2b6ff!important}',
'.sm-offer-value-was--total s{color:#ffe0b1!important}',
'.sm-offer-value-final sup,.sm-offer-value-final strong,.sm-offer-value-final>span{color:#fff!important}',
'.sm-offer-value-cta{background:linear-gradient(110deg,#8060dc,#6a4ac7)!important;color:#fff!important;border-color:rgba(255,255,255,.24)!important;box-shadow:0 12px 27px rgba(23,11,47,.24)!important}',
'.sm-offer-value-cta span,.sm-offer-value-cta b{color:#fff!important}',
'/* Preserve dock sizing and its two actions; only harmonize colors */',
'.sm-sales-dock .sm-dock-discount{color:#7056d9!important}',
'.sm-sales-dock .sm-dock-checkout{background:#7056d9!important;color:#fff!important}',
'.sm-sales-dock .sm-dock-checkout span,.sm-sales-dock .sm-dock-checkout b{color:#fff!important}',
'.sm-dock-urgency strong{font-variant-numeric:tabular-nums!important}',
'@media(max-width:640px){.sm-black-ribbon{min-height:39px;padding:8px 6px;gap:7px;font-size:9px;letter-spacing:.035em}.sm-black-ribbon-icon{font-size:12px}.sm-black-ribbon>strong{font-size:10px;letter-spacing:.07em}.sm-black-ribbon-divider{height:13px}.sm-black-ribbon b{margin-left:3px}.sm-offer-clear-label{font-size:10px!important;letter-spacing:.085em!important}}',
'@media(max-width:360px){.sm-black-ribbon{gap:5px;font-size:8.5px}.sm-black-ribbon>strong{font-size:9px}.sm-black-ribbon-icon{display:none}.sm-black-ribbon-divider{height:12px}}',
'</style>'
].join('\n');

html = html.replace('<head>', '<head><meta name="robots" content="noindex,nofollow">');
html = html.replace('</head>', css + '\n</head>');
if (!html.includes('data-sm-countdown-seconds') || !html.includes('data-sm-dock-countdown')) {
  throw new Error('Daily clock elements missing');
}
fs.writeFileSync(target, html);
console.log('Black Friday v2: high-contrast ribbon, light hero, dark checkout, original CTAs and midnight-reset countdown retained.');
