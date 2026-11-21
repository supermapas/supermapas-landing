import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/preview-black-friday-campaign-v1.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

const desktop = '<section class="sm-desktop-hero" id="inicio-desktop" aria-label="Supermapas de Língua Portuguesa">';
const mobile = '<section class="sm-mobile-hero" id="inicio-mobile" aria-label="Supermapas de Língua Portuguesa">';
const ribbon = '<div class="sm-black-ribbon" role="note"><span class="sm-black-ribbon-dot" aria-hidden="true"></span><strong>BLACK FRIDAY SUPERM​APAS</strong><span class="sm-black-ribbon-sep" aria-hidden="true">✦</span><span>70% OFF + 2 BÔNUS</span></div>';
if (!html.includes(desktop) || !html.includes(mobile)) throw new Error('Hero markup not found');
html = html.replace(desktop, desktop + ribbon).replace(mobile, mobile + ribbon);
html = html.replaceAll('<span>OFERTA ESPECIAL + 2 BÔNUS</span>', '<span>BLACK FRIDAY • KIT COMPLETO</span>');
html = html.replaceAll('<span>QUERO DOMINAR PORTUGUÊS</span>', '<span>QUERO MEU KIT BLACK</span>');

const offerStart = html.indexOf('<div class="sm-offer-clear" role="note"');
const offerEnd = html.indexOf('<div class="sm-offer-value-was sm-offer-value-was--total">', offerStart);
if (offerStart < 0 || offerEnd < 0 || offerEnd - offerStart > 2000) throw new Error('Offer urgency markup not found');
const blackOffer = '<div class="sm-offer-clear sm-black-offer-head" role="note" aria-label="Campanha Black Friday"><span class="sm-offer-clear-label">BLACK FRIDAY 2026</span><strong class="sm-black-offer-title">A Black de quem estuda de verdade.</strong><span class="sm-black-offer-pill">70% OFF + 2 BÔNUS GRÁTIS</span></div>\n        ';
html = html.slice(0, offerStart) + blackOffer + html.slice(offerEnd);
html = html.replace('<span class="sm-offer-price-today"><strong>HOJE</strong> <em>POR</em></span>', '<span class="sm-offer-price-today"><strong>BLACK</strong> <em>POR</em></span>');
html = html.replaceAll('<span>QUERO AGORA</span>', '<span>QUERO BLACK</span>');

const dockUrgency = '<div class="sm-dock-urgency" aria-label="Oferta termina hoje"><span>TERMINA HOJE</span><strong data-sm-dock-countdown>--:--:--</strong></div>';
const blackDock = '<div class="sm-dock-urgency sm-black-dock-tag" aria-label="Campanha Black Friday"><span>BLACK FRIDAY</span><strong>R$ 57</strong></div>';
if (!html.includes(dockUrgency)) throw new Error('Dock markup not found');
html = html.replaceAll(dockUrgency, blackDock);
html = html.replace("urgency.setAttribute('aria-label','Oferta termina hoje');", "urgency.setAttribute('aria-label','Campanha Black Friday');");
html = html.replace("urgency.innerHTML='<span>TERMINA HOJE</span><strong data-sm-dock-countdown>--:--:--</strong>';", "urgency.innerHTML='<span>BLACK FRIDAY</span><strong>R$ 57</strong>';" );

const css = [
'<style id="sm-preview-black-friday-campaign-v1">',
':root{--sm-black:#15121d;--sm-black-purple:#b48bff;--sm-black-lime:#c6fb89}',
'.sm-black-ribbon{position:relative;z-index:8;display:flex;align-items:center;justify-content:center;gap:13px;min-height:44px;padding:10px 16px;background:linear-gradient(95deg,#241539 0%,#120f1b 55%,#25163d 100%);color:#eee6ff;font-size:11px;font-weight:750;letter-spacing:.09em;text-align:center;border-bottom:1px solid rgba(196,163,255,.27)}',
'.sm-black-ribbon strong{color:#fff;font-size:12px;font-weight:950;letter-spacing:.1em}.sm-black-ribbon-dot{width:8px;height:8px;border-radius:50%;background:#c6fb89;box-shadow:0 0 14px #c6fb89}.sm-black-ribbon-sep{color:#a978ff}',
'.sm-desktop-hero,.sm-mobile-hero{background:radial-gradient(circle at 85% 28%,rgba(124,67,201,.30),transparent 39%),linear-gradient(140deg,#17121f 0%,#22192e 50%,#120f1a 100%)!important}',
'.sm-dh-header{border-color:rgba(198,169,250,.18)!important}.sm-dh-header nav a{color:#e7dff5!important}.sm-dh-copy h1,.sm-mh-title-line-dark{color:#fff!important}.sm-dh-copy h1>span,.sm-mh-title-line-accent{color:#c9aaff!important}',
'.sm-dh-copy>p,.sm-mh-subtitle{color:#e3d9ee!important}.sm-dh-copy>p strong,.sm-mh-subtitle strong{color:#fff!important}.sm-dh-actions small,.sm-mh-guarantee{color:#ded3ed!important}',
'.sm-dh-proof,.sm-mh-proof{color:#f5efff!important}.sm-dh-proof strong,.sm-mh-proof strong{color:#fff!important}.sm-dh-proof span,.sm-mh-proof span{color:#d9cce7!important}',
'.sm-hero-offer-badge-v3{background:rgba(183,137,255,.15)!important;border:1px solid rgba(202,167,255,.45)!important;box-shadow:0 10px 30px rgba(0,0,0,.16)!important}.sm-hero-offer-badge-v3 strong{background:#c6fb89!important;color:#17121d!important}.sm-hero-offer-badge-v3 span{color:#f1eaff!important}',
'.sm-dh-primary,.sm-mh-cta,.sm-dh-header-cta{background:linear-gradient(100deg,#b98bff,#d2b4ff)!important;color:#1c1429!important;border-color:transparent!important;box-shadow:0 12px 28px rgba(122,76,205,.22)!important}.sm-dh-primary span,.sm-mh-cta span,.sm-dh-header-cta span{color:#1c1429!important}',
'.sm-offer-value{background:radial-gradient(circle at 12% 0%,rgba(113,68,183,.20),transparent 40%),linear-gradient(160deg,#191521 0%,#231b30 100%)!important}.sm-offer-value-head .sm-offer-value-eyebrow{color:#c6fb89!important}.sm-offer-value-head h2{color:#fff!important}.sm-offer-value-head h2 span{color:#c9aaff!important}.sm-offer-value-head p{color:#ded4e9!important}',
'.sm-offer-value-bridge p{color:#f5edff!important}.sm-offer-value-bridge-alert{color:#ffb78d!important}.sm-offer-value-bridge-line{background:linear-gradient(180deg,#7d5bc6,#c9aaff)!important}',
'.sm-offer-value-checkout{background:radial-gradient(circle at 88% 0%,rgba(170,112,255,.27),transparent 50%),linear-gradient(145deg,#100e18 0%,#241635 58%,#402262 100%)!important;border:1px solid rgba(201,170,255,.32)!important;box-shadow:0 22px 55px rgba(0,0,0,.26)!important}',
'.sm-black-offer-head{border-bottom:1px solid rgba(205,175,255,.20)!important;padding:12px 6px 24px!important}.sm-black-offer-head .sm-offer-clear-label{color:#c6fb89!important;font-size:12px!important;letter-spacing:.18em!important}.sm-black-offer-title{display:block;max-width:360px;margin:12px auto 0;color:#fff;font-size:clamp(25px,3vw,35px);font-weight:950;letter-spacing:-.045em;line-height:1.09;text-wrap:balance}.sm-black-offer-pill{display:inline-flex;margin-top:16px;padding:9px 14px;border:1px solid rgba(198,251,137,.35);border-radius:999px;background:rgba(198,251,137,.12);color:#c6fb89;font-size:11px;font-weight:950;letter-spacing:.07em}',
'.sm-offer-price-today strong{background:#c6fb89!important;color:#1a1820!important;box-shadow:0 7px 18px rgba(198,251,137,.14)!important}.sm-offer-value-cta{background:linear-gradient(100deg,#b98bff,#d2b4ff)!important;color:#1c1429!important;box-shadow:0 12px 24px rgba(0,0,0,.17)!important}.sm-offer-value-cta span{color:#1c1429!important}',
'.sm-sales-dock{background:#1d1727!important;border:1px solid rgba(187,148,255,.35)!important;box-shadow:0 10px 32px rgba(16,9,26,.28)!important}.sm-sales-dock .sm-dock-discount{background:#c6fb89!important;color:#19151f!important}.sm-sales-dock .sm-dock-checkout{background:#b98bff!important;color:#1c1429!important}.sm-sales-dock .sm-dock-checkout span{color:#1c1429!important}.sm-sales-dock .sm-dock-whatsapp{color:#fff!important}.sm-black-dock-tag span{color:#d7c6ed!important}.sm-black-dock-tag strong{color:#fff!important}',
'.sm-offer-value-total--simple{border-color:rgba(169,120,245,.32)!important}',
'@media(max-width:640px){.sm-black-ribbon{min-height:40px;gap:8px;padding:8px 6px;font-size:8.2px;letter-spacing:.04em}.sm-black-ribbon strong{font-size:9px;letter-spacing:.055em}.sm-black-ribbon-dot{width:6px;height:6px;flex:0 0 6px}.sm-mobile-hero{padding-top:0!important}.sm-black-offer-title{font-size:29px}.sm-black-offer-head{padding-top:14px!important;padding-bottom:20px!important}.sm-black-offer-pill{font-size:10px}.sm-sales-dock .sm-dock-discount{font-size:10px!important}.sm-sales-dock .sm-dock-checkout span{font-size:8.8px!important}}',
'</style>'
].join('\n');
html = html.replace('</head>', css + '\n</head>');
if (!html.includes('sm-black-offer-title') || !html.includes('BLACK FRIDAY SUPERM')) throw new Error('Black campaign markup missing');
fs.writeFileSync(target, html);
console.log('Black Friday preview campaign applied with preserved checkout URL, 70% OFF, no daily fake urgency.');
