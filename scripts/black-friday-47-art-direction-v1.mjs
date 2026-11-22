import fs from 'node:fs';

const target=process.argv[2];
if(!target)throw new Error('Usage: node scripts/black-friday-47-art-direction-v1.mjs <html>');
let html=fs.readFileSync(target,'utf8');
const once=(a,b,label)=>{if(html.split(a).length!==2)throw new Error('Expected one '+label);html=html.replace(a,b);};
const all=(a,b,min=1)=>{const n=html.split(a).length-1;if(n<min)throw new Error('Expected '+min+' occurrences: '+a);html=html.split(a).join(b);return n;};

// Offer mathematics: R$47 / 0.20 = R$235; R$235 + R$37 + R$47 = R$319.
all('70% OFF','80% OFF',3);
all('70% de desconto','80% de desconto',1);
all('Setenta por cento de desconto','Oitenta por cento de desconto',1);
all('R$ 223,33','R$ 235,00',2);
all('R$ 307,33','R$ 319,00',3);
// The arithmetic line is updated by the R$ 223,33 replacement above.
all('12x de R$ 6,93','12x de R$ 4,86',1);
once('<div class="sm-offer-value-final"><sup>R$</sup><strong>67</strong><span>,00</span></div>','<div class="sm-offer-value-final"><sup>R$</sup><strong>47</strong><span>,00</span></div>','price');
// No price claim outside the main checkout price markup.

// Creative direction: original composition, clear hero, dark campaign accent and carefully scoped CTA styling.
const desktop='<section class="sm-desktop-hero" id="inicio-desktop" aria-label="Supermapas de Língua Portuguesa">';
const mobile='<section class="sm-mobile-hero" id="inicio-mobile" aria-label="Supermapas de Língua Portuguesa">';
const strip='<div class="sm-black47-strip" role="note" aria-label="Black Friday Supermapas"><span class="sm-black47-star" aria-hidden="true">✦</span><strong>BLACK FRIDAY</strong><i aria-hidden="true"></i><span>EDIÇÃO ESPECIAL SUPERM​APAS</span></div>'.replace('SUPERM​APAS','SUPERMAPAS');
once(desktop,desktop+strip,'desktop hero');
once(mobile,mobile+strip,'mobile hero');
all('<span>OFERTA ESPECIAL + 2 BÔNUS</span>','<span>BLACK FRIDAY + 2 BÔNUS</span>',2);
once('<span class="sm-mh-title-line sm-mh-title-line-accent">Domine Língua Portuguesa</span>','<span class="sm-mh-title-line sm-mh-title-line-accent"><span class="sm-black47-title-line">Domine Língua</span><span class="sm-black47-title-line">Portuguesa</span></span>','mobile headline composition');
once('<span class="sm-offer-value-eyebrow">O QUE VOCÊ RECEBE</span>','<span class="sm-offer-value-eyebrow">BLACK FRIDAY • O QUE VOCÊ RECEBE</span>','offer eyebrow');
once('<span class="sm-offer-clear-label">OFERTA VÁLIDA NOS DIAS</span>','<span class="sm-offer-clear-label">BLACK FRIDAY • OFERTA ESPECIAL</span>','clock label');
// Preserve original user-facing 'TERMINA HOJE'; countdown behavior is unchanged.
// Preserve original dock label 'TERMINA HOJE'.
// Preserve original countdown accessibility label.
// Preserve original date-range accessibility label.
all('<span>QUERO DOMINAR PORTUGUÊS</span>','<span>GARANTIR MEU ACESSO</span>',3);
all('>QUERO DOMINAR PORTUGUÊS</a>','>GARANTIR MEU ACESSO</a>',1);
all('<span>QUERO AGORA</span>','<span>GARANTIR</span>',1);

// Pricing and countdown stay client-side, no checkout change.
for(const required of ['data-sm-countdown-hours','data-sm-countdown-minutes','data-sm-countdown-seconds','data-sm-dock-countdown','data-sm-date-range','America/Fortaleza','https://pay.hotmart.com/A92093667Q?off=ia91gsts&checkoutMode=10']){
 if(!html.includes(required))throw new Error('Required element missing: '+required);
}
if(html.includes('QUERO MEU KIT BLACK'))throw new Error('Deprecated copy found');

const css=[
'<style id="sm-black47-art-direction">',
':root{--black47-ink:#1b1630;--black47-violet:#7056d9;--black47-accent:#c9b6ff;--black47-cream:#f8f6ff}',
'/* Campaign masthead: clean, deliberate spacing and high-contrast type. */',
'.sm-black47-strip{box-sizing:border-box;position:relative;z-index:5;display:flex;align-items:center;justify-content:center;gap:12px;min-height:43px;width:100%;padding:8px 16px;background:linear-gradient(110deg,#171225,#30254b 55%,#171225);border-bottom:2px solid #c9b6ff;color:#fff;-webkit-text-fill-color:#fff;font-size:11px;font-weight:800;letter-spacing:.09em;line-height:1.1;text-align:center}',
'.sm-black47-star{display:inline-flex;align-items:center;justify-content:center;flex:0 0 22px;width:22px;height:22px;border-radius:50%;border:1px solid #c9b6ff80;color:#c9b6ff!important;-webkit-text-fill-color:#c9b6ff!important;font-size:13px;line-height:1}',
'.sm-black47-strip strong{color:#c9b6ff!important;-webkit-text-fill-color:#c9b6ff!important;font-size:12px;font-weight:950;letter-spacing:.13em;white-space:nowrap}',
'.sm-black47-strip i{display:block;flex:0 0 1px;width:1px;height:15px;background:#ffffff50}',
'.sm-black47-strip>span:last-child{color:#f1eaf8!important;-webkit-text-fill-color:#f1eaf8!important;white-space:nowrap}',
'/* Bright editorial canvas; preserve the actual Supermapas product imagery. */',
'.sm-desktop-hero,.sm-mobile-hero{background:linear-gradient(160deg,#fff 0%,#fcfaff 70%,#fff 100%)!important}',
'.sm-hero-offer-badge-v3{box-sizing:border-box!important;max-width:100%!important;background:#1b1630!important;border-color:#4b3b5a!important;box-shadow:0 8px 22px #251b3024!important}',
'.sm-hero-offer-badge-v3 strong{display:flex!important;align-items:center!important;justify-content:center!important;background:#c9b6ff!important;color:#1b1630!important;-webkit-text-fill-color:#1b1630!important;text-align:center!important;line-height:1.1!important}',
'.sm-hero-offer-badge-v3 span{display:flex!important;align-items:center!important;justify-content:center!important;min-width:0!important;color:#fff!important;-webkit-text-fill-color:#fff!important;text-align:center!important;line-height:1.1!important}',
'.sm-mh-title-line-accent{white-space:normal!important;max-width:100%!important;width:100%!important;overflow:visible!important;text-align:center!important}.sm-mh-title-line-accent .sm-black47-title-line{display:block!important;white-space:nowrap!important;width:100%!important;max-width:100%!important;text-align:center!important;line-height:1.03!important}',
'.sm-mh-title-line-accent .sm-black47-title-line:after{display:none!important;content:none!important}',
'/* CTA color contract: violet = white label; luminous lavender = dark label and arrow. */',
'.sm-desktop-hero .sm-dh-header .sm-dh-header-cta{background:linear-gradient(130deg,#c9b6ff,#e7dfff)!important;border-color:#c9b6ff!important;color:#1b1630!important;-webkit-text-fill-color:#1b1630!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;text-align:center!important;line-height:1.15!important}',
'.sm-dh-primary,.sm-mh-cta{background:linear-gradient(125deg,#7359df,#5f43c8)!important;color:#fff!important;-webkit-text-fill-color:#fff!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:12px!important;text-align:center!important}',
'.sm-dh-primary span,.sm-mh-cta span{color:#fff!important;-webkit-text-fill-color:#fff!important;text-align:center!important;line-height:1.15!important;min-width:0!important}',
'.sm-dh-primary b,.sm-mh-cta b{display:grid!important;place-items:center!important;background:#fff!important;color:#5f43c8!important;-webkit-text-fill-color:#5f43c8!important;line-height:1!important;flex-shrink:0!important}',
'/* Valuation: no clipped grid on narrow phones; reference and sum follow exact 80% mathematics. */',
'.sm-offer-value{background:linear-gradient(180deg,#faf7ff 0%,#fff 100%)!important}',
'.sm-offer-value-eyebrow{background:#f0eaff!important;color:#5b3fbf!important;-webkit-text-fill-color:#5b3fbf!important;border-color:#e2d8ff!important}',
'.sm-offer-value-list--unified{align-self:start!important}',
'@media(max-width:820px){.sm-offer-value-layout{grid-template-columns:minmax(0,1fr)!important;min-width:0!important}.sm-offer-value-layout>.sm-offer-value-list,.sm-offer-value-layout>.sm-offer-value-bridge,.sm-offer-value-layout>.sm-offer-value-checkout{min-width:0!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important}.sm-offer-value-bridge p{width:100%!important;max-width:100%!important;white-space:normal!important}}',
'/* Checkout uses a controlled deep violet gradient and luminous lavender accent. */',
'.sm-offer-value-checkout{background:radial-gradient(circle at 96% 3%,#866be855 0%,transparent 45%),linear-gradient(150deg,#1b1630,#30244e 57%,#4e3991)!important;border:1px solid #7d6bb7!important;border-top:3px solid #c9b6ff!important;box-shadow:0 22px 48px #261b3830!important}',
'.sm-offer-clear-label{color:#e0d4ff!important;-webkit-text-fill-color:#e0d4ff!important}',
'.sm-offer-clear-range,.sm-offer-clear-countdown>div>strong{color:#fff!important;-webkit-text-fill-color:#fff!important}',
'.sm-offer-clear-countdown>div>small{color:#e3d8ee!important;-webkit-text-fill-color:#e3d8ee!important}',
'.sm-offer-clear-today{background:#c9b6ff!important;color:#1b1630!important;-webkit-text-fill-color:#1b1630!important;text-align:center!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;box-shadow:0 7px 17px #120d1a2b!important;letter-spacing:.045em!important}',
'.sm-offer-value-was--total span{color:#f0e7fa!important;-webkit-text-fill-color:#f0e7fa!important}',
'.sm-offer-value-was--total s{color:#d6c5ff!important;-webkit-text-fill-color:#d6c5ff!important}',
'.sm-offer-price-today strong{display:inline-flex!important;align-items:center!important;justify-content:center!important;background:#c9b6ff!important;color:#1b1630!important;-webkit-text-fill-color:#1b1630!important;text-align:center!important}',
'.sm-offer-price-today em{color:#fff!important;-webkit-text-fill-color:#fff!important}',
'.sm-offer-value-final,.sm-offer-value-final sup,.sm-offer-value-final strong,.sm-offer-value-final>span{color:#fff!important;-webkit-text-fill-color:#fff!important}',
'.sm-offer-value-installments,.sm-offer-value-installments strong{color:#f5ebff!important;-webkit-text-fill-color:#f5ebff!important}',
'.sm-offer-value-perks strong{color:#fff!important;-webkit-text-fill-color:#fff!important}',
'.sm-offer-value-perks small{color:#e4d8f0!important;-webkit-text-fill-color:#e4d8f0!important}',
'.sm-offer-value-perks b{color:#fff!important;-webkit-text-fill-color:#fff!important}',
'/* Main purchase CTA: luminous lavender surface, centered dark text and dark arrow. */',
'.sm-offer-value-cta{background:linear-gradient(125deg,#c9b6ff,#e7dfff)!important;border:1px solid #f0eaff!important;box-shadow:0 11px 26px #120d1a3a!important;color:#1b1630!important;-webkit-text-fill-color:#1b1630!important;text-decoration:none!important}',
'.sm-offer-value-cta span{display:flex!important;align-items:center!important;justify-content:center!important;min-width:0!important;text-align:center!important;line-height:1.12!important;color:#1b1630!important;-webkit-text-fill-color:#1b1630!important}',
'.sm-offer-value-cta b{display:grid!important;place-items:center!important;color:#1b1630!important;-webkit-text-fill-color:#1b1630!important;line-height:1!important}',
'.sm-offer-value-trust,.sm-offer-value-trust span{color:#efe5f8!important;-webkit-text-fill-color:#efe5f8!important}',
'/* Mobile dock: same Production dimensions and two-button arrangement. Contrast is explicit for every nested element. */',
'.sm-sales-dock{background:#1b1630!important;border:1px solid #574368!important;box-shadow:0 10px 28px #17102245!important}',
'.sm-sales-dock .sm-dock-discount{color:#c9b6ff!important;-webkit-text-fill-color:#c9b6ff!important}',
'@media(min-width:821px){.sm-sales-dock .sm-dock-discount{color:#1b1630!important;-webkit-text-fill-color:#1b1630!important}.sm-sales-dock .sm-dock-inventory{color:#f0e9f7!important;-webkit-text-fill-color:#f0e9f7!important}}',
'.sm-sales-dock .sm-dock-urgency span{color:#f1e6f8!important;-webkit-text-fill-color:#f1e6f8!important}',
'.sm-sales-dock .sm-dock-urgency strong{color:#fff!important;-webkit-text-fill-color:#fff!important;font-variant-numeric:tabular-nums!important}',
'.sm-sales-dock .sm-dock-checkout{background:#c9b6ff!important;border-color:#c9b6ff!important;color:#1b1630!important;-webkit-text-fill-color:#1b1630!important;display:flex!important;align-items:center!important;justify-content:center!important;text-align:center!important}',
'.sm-sales-dock .sm-dock-checkout span,.sm-sales-dock .sm-dock-checkout b{color:#1b1630!important;-webkit-text-fill-color:#1b1630!important;text-align:center!important;line-height:1.1!important}',
'.sm-sales-dock .sm-dock-whatsapp{background:#168254!important;color:#fff!important;-webkit-text-fill-color:#fff!important;display:flex!important;align-items:center!important;justify-content:center!important;text-align:center!important}',
'.sm-sales-dock .sm-dock-whatsapp span{color:#fff!important;-webkit-text-fill-color:#fff!important;text-align:center!important;line-height:1.1!important}',
'.sm-sales-dock .sm-dock-whatsapp svg,.sm-sales-dock .sm-dock-whatsapp svg path{fill:#fff!important;color:#fff!important}',
'@media(max-width:640px){.sm-black47-strip{min-height:39px;padding:7px 9px;gap:8px}.sm-black47-strip strong{font-size:10px;letter-spacing:.085em}.sm-black47-strip>span:last-child{font-size:9px;letter-spacing:.045em}.sm-black47-star{flex-basis:18px;width:18px;height:18px;font-size:11px}.sm-hero-offer-badge-v3 span{font-size:12px!important}.sm-offer-value-eyebrow{letter-spacing:.045em!important;font-size:9px!important}.sm-offer-value-cta span{font-size:13.5px!important}}',
'@media(min-width:821px) and (max-width:1150px){.sm-dh-header{grid-template-columns:160px minmax(0,1fr) 170px!important;gap:10px!important}.sm-dh-brand{width:160px!important}.sm-dh-header nav{gap:8px!important;min-width:0!important}.sm-dh-header nav a{font-size:10px!important;white-space:nowrap!important}.sm-desktop-hero .sm-dh-header .sm-dh-header-cta{min-width:165px!important;max-width:170px!important;padding:0 8px!important;font-size:10px!important}}',
'@media(max-width:640px){.sm-mh-title-line-accent{font-size:clamp(30px,9.3vw,38px)!important}}',
'@media(max-width:360px){.sm-mh-first-line{font-size:29px!important;letter-spacing:-1.55px!important}}',
'@media(max-width:360px){.sm-black47-strip{gap:6px;padding-left:6px;padding-right:6px}.sm-black47-strip>span:last-child{font-size:8px}.sm-black47-star{display:none}.sm-hero-offer-badge-v3 strong,.sm-hero-offer-badge-v3 span{font-size:10px!important;letter-spacing:-.02em!important}.sm-offer-value-cta span{font-size:12.5px!important}}',
'</style>'
].join('\n');
html=html.replace('<head>','<head><meta name="robots" content="noindex,nofollow">');
html=html.replace('</head>',css+'\n</head>');
fs.writeFileSync(target,html);
console.log('Black Friday 47 preview from Production: 80%, R$47, 12x R$4,86, reference R$235, total R$319; original midnight reset and checkout preserved.');
