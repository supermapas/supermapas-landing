import fs from 'node:fs';
import path from 'node:path';

const target=process.argv[2];
if(!target)throw new Error('Usage: node scripts/black-friday-47-art-direction-v1.mjs <html>');
let html=fs.readFileSync(target,'utf8');
const once=(a,b,label)=>{if(html.split(a).length!==2)throw new Error('Expected one '+label);html=html.replace(a,b);};
const all=(a,b,min=1)=>{const n=html.split(a).length-1;if(n<min)throw new Error('Expected '+min+' occurrences: '+a);html=html.split(a).join(b);return n;};

// Retain the pre-campaign R$67 / 70% offer while keeping Black campaign branding.
// R$67 / 0.30 = R$223.33 reference; plus R$37 and R$47 bonuses = R$307.33.
for(const required of ['70% OFF','R$ 223,33','R$ 307,33','12x de R$ 6,93','<strong>67</strong>']){
 if(!html.includes(required))throw new Error('Expected restored offer: '+required);
}

// Creative direction: original composition, clear hero, dark campaign accent and carefully scoped CTA styling.
const desktop='<section class="sm-desktop-hero" id="inicio-desktop" aria-label="Supermapas de Língua Portuguesa">';
const mobile='<section class="sm-mobile-hero" id="inicio-mobile" aria-label="Supermapas de Língua Portuguesa">';
const strip='<div class="sm-black47-strip" role="note" aria-label="Black November Supermapas, 70% de desconto"><span class="sm-black47-star" aria-hidden="true"><svg viewBox="0 0 24 24" width="13" height="13" focusable="false" aria-hidden="true"><path d="M12 2.5 14.9 8.9 22 9.7 16.7 14.5 18.2 21.5 12 17.9 5.8 21.5 7.3 14.5 2 9.7 9.1 8.9Z" fill="currentColor"/></svg></span><strong>BLACK NOVEMBER</strong><span class="sm-black47-flash">70% OFF</span><span class="sm-black47-tagline">SUPERMAPAS</span></div>';
once(desktop,desktop+strip,'desktop hero');
once(mobile,mobile+strip,'mobile hero');
all('<span>OFERTA ESPECIAL + 2 BÔNUS</span>','<span>BLACK NOVEMBER + 2 BÔNUS</span>',2);
once('<span class="sm-mh-title-line sm-mh-title-line-accent">Domine Língua Portuguesa</span>','<span class="sm-mh-title-line sm-mh-title-line-accent"><span class="sm-black47-title-line">Domine Língua</span><span class="sm-black47-title-line">Portuguesa</span></span>','mobile headline composition');
once('<span class="sm-offer-value-eyebrow">O QUE VOCÊ RECEBE</span>','<span class="sm-offer-value-eyebrow">BLACK NOVEMBER • O QUE VOCÊ RECEBE</span>','offer eyebrow');
once('<span class="sm-offer-clear-label">OFERTA VÁLIDA NOS DIAS</span>','<span class="sm-offer-clear-label">BLACK NOVEMBER • OFERTA ESPECIAL</span>','clock label');
// Preserve original user-facing 'TERMINA HOJE'; countdown behavior is unchanged.
// Preserve original dock label 'TERMINA HOJE'.
// Preserve original countdown accessibility label.
// Preserve original date-range accessibility label.
all('<span>QUERO DOMINAR PORTUGUÊS</span>','<span>GARANTIR MEU ACESSO</span>',3);
all('>QUERO DOMINAR PORTUGUÊS</a>','>GARANTIR MEU ACESSO</a>',1);
all('<span>QUERO AGORA</span>','<span>EU QUERO</span>',1);

// Pricing and countdown stay client-side, no checkout change.
for(const required of ['data-sm-countdown-hours','data-sm-countdown-minutes','data-sm-countdown-seconds','data-sm-dock-countdown','data-sm-date-range','America/Fortaleza','https://pay.hotmart.com/A92093667Q?off=ia91gsts&checkoutMode=10']){
 if(!html.includes(required))throw new Error('Required element missing: '+required);
}
if(html.includes('QUERO MEU KIT BLACK'))throw new Error('Deprecated copy found');

let css=[
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
'/* Valuation: no clipped grid on narrow phones; reference and sum follow exact 70% mathematics. */',
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
'@media(min-width:821px){.sm-sales-dock .sm-dock-discount{color:#1b1630!important;-webkit-text-fill-color:#1b1630!important}.sm-sales-dock .sm-sales-dock .sm-dock-inventory{color:#f0e9f7!important;-webkit-text-fill-color:#f0e9f7!important}}',
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
'/* Black Friday 47 v3: premium orange campaign hierarchy, with explicit foreground colors. */',
':root{--black47-orange:#F36A2D;--black47-deep:#1b1530;--black47-bright:#6c40e5}',
'.sm-black47-strip{background:linear-gradient(100deg,#151022,#25193b 55%,#151022)!important;border-bottom:3px solid #F36A2D!important;min-height:46px!important;gap:12px!important;box-shadow:0 4px 14px #160d2522!important}',
'.sm-black47-strip strong{font-size:clamp(12px,1.15vw,15px)!important;letter-spacing:.12em!important;color:#fff!important;-webkit-text-fill-color:#fff!important}',
'.sm-black47-star{color:#FFB58A!important;-webkit-text-fill-color:#FFB58A!important;border-color:#FFB58A55!important}',
'.sm-black47-flash{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:25px!important;padding:5px 11px!important;border-radius:7px!important;background:#F36A2D!important;color:#fff!important;-webkit-text-fill-color:#fff!important;font-size:11px!important;font-weight:950!important;letter-spacing:.06em!important;white-space:nowrap!important;box-shadow:0 3px 12px #F36A2D44!important}',
'.sm-black47-tagline{color:#dcd2ef!important;-webkit-text-fill-color:#dcd2ef!important;letter-spacing:.10em!important;white-space:nowrap!important}',
'.sm-hero-offer-badge-v3{border-color:#F36A2D66!important;box-shadow:0 10px 26px #1b15302a!important}',
'.sm-hero-offer-badge-v3 strong{background:#F36A2D!important;color:#fff!important;-webkit-text-fill-color:#fff!important;box-shadow:0 3px 10px #F36A2D22!important}',
'.sm-hero-offer-badge-v3 span{color:#fff!important;-webkit-text-fill-color:#fff!important}',
'.sm-desktop-hero .sm-dh-header .sm-dh-header-cta{background:#23193c!important;border:1px solid #23193c!important;color:#fff!important;-webkit-text-fill-color:#fff!important;box-shadow:0 6px 18px #23193c20!important}',
'.sm-dh-primary,.sm-mh-cta{background:linear-gradient(115deg,#744bea,#5127b9)!important;color:#fff!important;-webkit-text-fill-color:#fff!important;box-shadow:0 13px 26px #5c36cf40!important}',
'.sm-dh-primary span,.sm-mh-cta span{color:#fff!important;-webkit-text-fill-color:#fff!important}',
'.sm-dh-primary b,.sm-mh-cta b{background:#fff!important;color:#5228bd!important;-webkit-text-fill-color:#5228bd!important}',
'.sm-offer-value-eyebrow{background:#23193c!important;border-color:#23193c!important;color:#fff!important;-webkit-text-fill-color:#fff!important;box-shadow:0 5px 14px #23193c19!important}',
'.sm-offer-value-checkout{border-top:4px solid #F36A2D!important;box-shadow:0 24px 55px #261b3840!important}',
'.sm-offer-clear-label{color:#FFB88C!important;-webkit-text-fill-color:#FFB88C!important;font-weight:950!important}',
'.sm-offer-clear-today{background:#F36A2D!important;color:#fff!important;-webkit-text-fill-color:#fff!important;box-shadow:0 5px 16px #F36A2D55!important}',
'.sm-offer-price-today strong{background:#F36A2D!important;color:#fff!important;-webkit-text-fill-color:#fff!important;border-radius:999px!important;padding:5px 9px!important}',
'.sm-offer-value-final strong{font-weight:950!important;text-shadow:0 8px 25px #0000002c!important}',
'.sm-offer-value-cta{background:linear-gradient(115deg,#C44911,#A83707)!important;border:1px solid #F79358!important;color:#fff!important;-webkit-text-fill-color:#fff!important;box-shadow:0 13px 28px #A8370755!important}',
'.sm-offer-value-cta span{color:#fff!important;-webkit-text-fill-color:#fff!important;font-weight:950!important}',
'.sm-offer-value-cta b{background:#fff!important;color:#A83707!important;-webkit-text-fill-color:#A83707!important;border-radius:50%!important}',
'.sm-sales-dock{border-color:#7051a5!important}',
'.sm-sales-dock .sm-dock-discount{background:#ffffff10!important;border-color:#ffffff30!important;color:#FFB88C!important;-webkit-text-fill-color:#FFB88C!important}',
'.sm-sales-dock .sm-dock-discount strong{background:#F36A2D!important;color:#fff!important;-webkit-text-fill-color:#fff!important;box-shadow:0 3px 12px #F36A2D33!important}',
'.sm-sales-dock .sm-dock-checkout{background:#F36A2D!important;border-color:#F36A2D!important;color:#fff!important;-webkit-text-fill-color:#fff!important;box-shadow:0 4px 14px #F36A2D44!important}',
'.sm-sales-dock .sm-dock-checkout span,.sm-sales-dock .sm-dock-checkout b{color:#fff!important;-webkit-text-fill-color:#fff!important}',
'@media(min-width:821px){.sm-sales-dock .sm-dock-discount{color:#FFB88C!important;-webkit-text-fill-color:#FFB88C!important}}',
'@media(max-width:640px){.sm-black47-strip{min-height:42px!important;padding:6px 8px!important;gap:7px!important}.sm-black47-strip strong{font-size:11px!important;letter-spacing:.045em!important}.sm-black47-flash{min-height:23px!important;padding:4px 7px!important;font-size:10px!important}.sm-black47-tagline{font-size:9px!important;letter-spacing:.03em!important}.sm-black47-star{flex:0 0 16px!important;width:16px!important;height:16px!important;font-size:10px!important}.sm-offer-value-cta span{font-size:13.5px!important}}',
'.sm-offer-value-total--simple .sm-offer-value-total-price s{text-decoration-color:#F36A2D!important}',
'.sm-offer-value-item--bonus .sm-offer-value-type{color:#A83707!important;-webkit-text-fill-color:#A83707!important}',
'/* Accessible orange contract: vibrant orange + dark ink; deep burnt-orange + white. */',
'.sm-black47-flash,.sm-hero-offer-badge-v3 strong,.sm-offer-clear-today,.sm-offer-price-today strong,.sm-sales-dock .sm-dock-discount strong{color:#1B1530!important;-webkit-text-fill-color:#1B1530!important}',
'.sm-black47-flash{background:#F36A2D!important;box-shadow:0 3px 12px #F36A2D44!important}',
'.sm-hero-offer-badge-v3 strong{background:#F36A2D!important}',
'.sm-offer-clear-today,.sm-offer-price-today strong{background:#F36A2D!important}',
'.sm-sales-dock .sm-dock-discount strong{background:#F36A2D!important}',
'.sm-sales-dock .sm-dock-checkout{background:#B9430C!important;border-color:#B9430C!important;color:#fff!important;-webkit-text-fill-color:#fff!important;box-shadow:0 4px 14px #A8370755!important}',
'.sm-sales-dock .sm-dock-checkout span,.sm-sales-dock .sm-dock-checkout b{color:#fff!important;-webkit-text-fill-color:#fff!important}',
'.sm-offer-value-cta{background:linear-gradient(115deg,#C44911,#A83707)!important;border-color:#F79358!important;box-shadow:0 13px 28px #A8370755!important}',
'.sm-offer-value-cta span{color:#fff!important;-webkit-text-fill-color:#fff!important}',
'.sm-offer-value-cta b{background:#fff!important;color:#A83707!important;-webkit-text-fill-color:#A83707!important}',
'.sm-black47-strip{border-bottom-color:#F36A2D!important}',
'.sm-offer-value-checkout{border-top-color:#F36A2D!important}',
'.sm-offer-value-total--simple .sm-offer-value-total-price s{text-decoration-color:#F36A2D!important}',
'/* Black Friday v4: remove inherited green shadow from HOJE and brighten only fixed dock CTA. */',
'.sm-offer-price-today strong{box-shadow:0 7px 18px rgba(243,106,45,.24)!important;text-shadow:none!important}',
'.sm-sales-dock .sm-dock-checkout{background:#FF914D!important;border-color:#FF914D!important;color:#24172F!important;-webkit-text-fill-color:#24172F!important;box-shadow:0 4px 14px rgba(243,106,45,.25)!important}',
'.sm-sales-dock .sm-dock-checkout span,.sm-sales-dock .sm-dock-checkout b{color:#24172F!important;-webkit-text-fill-color:#24172F!important;text-align:center!important}',
'/* Black November: optically centered vector star, no baseline offset. */',
'.sm-black47-star{display:grid!important;place-items:center!important;flex:0 0 22px!important;width:22px!important;height:22px!important;line-height:0!important;padding:0!important;vertical-align:middle!important}',
'.sm-black47-star svg{display:block!important;flex:none!important;width:13px!important;height:13px!important;overflow:visible!important;color:#FFB58A!important;fill:#FFB58A!important;transform:none!important}',
'.sm-black47-star svg path{fill:currentColor!important}',
'.sm-black47-strip strong{letter-spacing:.055em!important}',
'@media(max-width:640px){.sm-black47-star{flex-basis:18px!important;width:18px!important;height:18px!important}.sm-black47-star svg{width:11px!important;height:11px!important}.sm-black47-strip strong{font-size:10px!important;letter-spacing:.015em!important}}',
'@media(max-width:360px){.sm-black47-star{display:grid!important;flex:0 0 16px!important;width:16px!important;height:16px!important}.sm-black47-tagline{display:none!important}.sm-black47-strip strong{font-size:10px!important;letter-spacing:.01em!important}}',
'@media(max-width:360px){.sm-mobile-hero .sm-hero-offer-badge-v3 span{font-size:9.2px!important;letter-spacing:-.035em!important;white-space:nowrap!important}}',
'@media(max-width:360px){.sm-black47-strip{gap:6px!important}.sm-black47-star{display:none!important}.sm-black47-strip strong{font-size:10px!important}.sm-black47-flash{font-size:9px!important}.sm-black47-tagline{font-size:8px!important}}',
'</style>'
].join('\n');
// Keep the approved Production CTA geometry, typography and arrow treatment.
// Campaign overrides must not replace those rules; only the dock color changes.
css=css.replace(/([^{}]+)\{([^{}]*)\}/g,(rule,selector)=>
 /\.sm-dh-header-cta|\.sm-dh-primary|\.sm-mh-cta|\.sm-offer-value-cta|\.sm-dock-checkout/.test(selector)?'':rule);
css=css.replace('</style>',`
.sm-sales-dock .sm-dock-checkout{background:linear-gradient(135deg,#f36a2d 0%,#ff7a2f 100%)!important;border-color:#f36a2d!important;color:#fff!important;-webkit-text-fill-color:#fff!important;box-shadow:0 4px 14px rgba(243,106,45,.25)!important}
.sm-sales-dock .sm-dock-checkout span,.sm-sales-dock .sm-dock-checkout b{color:#fff!important;-webkit-text-fill-color:#fff!important}
/* One orange surface across the campaign, matching the purchase CTA. */
.sm-black47-flash,.sm-hero-offer-badge-v3 strong,.sm-offer-clear-today,.sm-offer-price-today strong,.sm-sales-dock .sm-dock-discount strong{background:linear-gradient(135deg,#f36a2d 0%,#ff7a2f 100%)!important}
.sm-black47-star,.sm-black47-star svg,.sm-offer-clear-label,.sm-sales-dock .sm-dock-discount,.sm-offer-value-item--bonus .sm-offer-value-type{color:#f36a2d!important;-webkit-text-fill-color:#f36a2d!important}
.sm-black47-star svg{fill:#f36a2d!important}
.sm-offer-clear-countdown>i{color:#f36a2d!important;-webkit-text-fill-color:#f36a2d!important}
.sm-format-v2-unit-card .sm-format-v2-bonus-badge{background:linear-gradient(135deg,#f36a2d 0%,#ff7a2f 100%)!important}
/* Make the campaign recognizable immediately, then repeat at purchase points. */
.sm-black47-strip{min-height:66px!important;padding:12px 18px!important;gap:16px!important;border-bottom:3px solid #f36a2d!important}
.sm-black47-strip strong{font-size:clamp(19px,2vw,26px)!important;letter-spacing:.065em!important;line-height:1.15!important}
.sm-black47-flash{font-size:15px!important;padding:7px 12px!important}
.sm-hero-offer-badge-v3 span{font-size:15px!important;font-weight:950!important;letter-spacing:.025em!important}
.sm-offer-value-eyebrow{font-size:13px!important;letter-spacing:.07em!important;padding:13px 20px!important}
.sm-offer-clear-label{font-size:13px!important;letter-spacing:.055em!important;line-height:1.35!important}
.sm-sales-dock .sm-dock-inventory{display:flex!important;flex-direction:column!important;gap:3px!important}
.sm-sales-dock .sm-dock-inventory strong{display:block!important;color:#fff!important;font-size:13px!important;letter-spacing:.045em!important}
.sm-sales-dock .sm-dock-inventory span{display:block!important;font-size:10px!important;opacity:.85}
@media(max-width:820px){.sm-sales-dock .sm-dock-inventory{display:none!important}.sm-dock-urgency>span{font-size:8px!important;letter-spacing:0!important;white-space:nowrap!important}}
@media(max-width:640px){.sm-black47-strip{min-height:44px!important;display:flex!important;flex-wrap:nowrap!important;align-items:center!important;justify-content:center!important;gap:8px!important;padding:8px 10px!important}.sm-black47-strip strong{font-size:clamp(10px,3vw,14px)!important;letter-spacing:.025em!important;white-space:nowrap!important;flex:0 0 auto!important}.sm-black47-star{display:none!important}.sm-black47-flash{font-size:10px!important;min-height:24px!important;padding:4px 7px!important;flex:0 0 auto!important}.sm-black47-tagline{display:block!important;font-size:9px!important;letter-spacing:.025em!important;white-space:nowrap!important;flex:0 0 auto!important}.sm-hero-offer-badge-v3 span{font-size:11px!important;letter-spacing:0!important}.sm-offer-value-eyebrow{font-size:11px!important;padding:11px 14px!important}}
@media(max-width:360px){.sm-black47-strip{gap:6px!important;padding-left:6px!important;padding-right:6px!important}.sm-black47-strip strong{font-size:10px!important}.sm-black47-flash{font-size:9px!important;padding-left:6px!important;padding-right:6px!important}.sm-black47-tagline{font-size:8px!important}.sm-mobile-hero .sm-hero-offer-badge-v3 span{font-size:9.2px!important;letter-spacing:-.035em!important}}
/* Campaign name and brand share typography and vertical alignment at every width. */
.sm-black47-strip{--black47-masthead-size:clamp(19px,2vw,26px);--black47-masthead-tracking:.065em;align-items:center!important}
.sm-black47-strip>strong,.sm-black47-strip>.sm-black47-tagline:last-child{font-size:var(--black47-masthead-size)!important;font-weight:950!important;letter-spacing:var(--black47-masthead-tracking)!important;line-height:1.15!important;align-self:center!important;white-space:nowrap!important}
@media(max-width:640px){.sm-black47-strip{--black47-masthead-size:clamp(10px,2.8vw,14px);--black47-masthead-tracking:.025em}}
@media(max-width:360px){.sm-black47-strip{--black47-masthead-size:10px;--black47-masthead-tracking:.01em}}
/* The full campaign label wraps inside the Production dock's narrow clock column. */
@media(max-width:820px){.sm-sales-dock .sm-dock-urgency>span{display:block!important;box-sizing:border-box!important;width:100%!important;max-width:100%!important;white-space:normal!important;overflow-wrap:normal!important;word-break:normal!important;font-size:8px!important;line-height:1.1!important;letter-spacing:0!important;text-align:center!important}.sm-sales-dock .sm-dock-urgency{gap:3px!important}}
</style>`);
html=html.replaceAll('GARANTIR MEU ACESSO','APROVEITAR A OFERTA')
 .replaceAll('QUERO DOMINAR PORTUGUÊS','APROVEITAR A OFERTA')
 .replaceAll('<span>EU QUERO</span>','<span>QUERO AGORA</span>');
once('<div class="sm-dock-inventory">98 Supermapas + 50 Super-Resumos + 190 Supercards</div>',
 '<div class="sm-dock-inventory"><strong>BLACK NOVEMBER</strong><span>98 Supermapas + 50 Super-Resumos + 190 Supercards</span></div>','campaign dock name');
html=html.replaceAll('aria-label="Oferta termina hoje"><span>TERMINA HOJE</span>',
 'aria-label="Black November termina hoje"><span>BLACK NOVEMBER</span>');
html=html.replace('<head>','<head><meta name="robots" content="noindex,nofollow">');
html=html.replace('</head>',css+'\n</head>');
// Normalize existing orange accents in generated CSS, including content sections.
// Keep the approved gradient endpoint and each color's existing transparency.
const normalizeOrange=css=>css.replace(/#([a-f\d]{8}|[a-f\d]{6}|[a-f\d]{4}|[a-f\d]{3})\b/gi,(match,hex)=>{
 const full=hex.length<=4?[...hex].map(c=>c+c).join(''):hex;
 const [r,g,b]=[0,2,4].map(i=>parseInt(full.slice(i,i+2),16));
 if(full.slice(0,6).toLowerCase()==='ff7a2f')return match;
 return r>160&&g>40&&g<190&&b<165&&r>g*1.25&&r>b*1.4?'#f36a2d'+full.slice(6):match;
});
html=html.replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/g,(_,open,css,close)=>open+normalizeOrange(css)+close);
const normalizeCssFiles=dir=>{for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
 const file=path.join(dir,entry.name);
 if(entry.isDirectory())normalizeCssFiles(file);
 else if(entry.name.endsWith('.css'))fs.writeFileSync(file,normalizeOrange(fs.readFileSync(file,'utf8')));
}};
normalizeCssFiles(path.dirname(target));
fs.writeFileSync(target,html);
console.log('Black November preview: 70% OFF, R$67, 12x R$6,93, reference R$223,33, total R$307,33; branding, countdown and checkout preserved.');
