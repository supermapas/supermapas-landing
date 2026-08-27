import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/preview-offer-57-60off-from-production-v2.mjs <html-file>');

let html = fs.readFileSync(target, 'utf8');

// IMPORTANT: never replace bare "50%" globally. CSS/layout contains many 50%
// values (left/top/translate positions). Only change exact offer copy below.
const replacements = [
  ['<strong>50% OFF</strong><span>OFERTA ESPECIAL + 2 BÔNUS</span>', '<strong>60% OFF</strong><span>OFERTA ESPECIAL + 2 BÔNUS</span>'],
  ['✓ 50% OFF já aplicado · 7 dias de garantia', '✓ 60% OFF já aplicado · 7 dias de garantia'],
  ['aria-label="Cinquenta por cento de desconto">50% OFF', 'aria-label="Sessenta por cento de desconto">60% OFF'],
  ['<span class="sm-offer-value-eyebrow">OFERTA ESPECIAL · 50% OFF</span>', '<span class="sm-offer-value-eyebrow">OFERTA ESPECIAL · 60% OFF</span>'],
  ['Os 50% de desconto são aplicados aos 98 Supermapas.', 'Os 60% de desconto são aplicados aos 98 Supermapas.'],
  ['<b>50% OFF</b>', '<b>60% OFF</b>'],
  ['<p class="sm-offer-value-installments">ou em até <strong>12x de R$ 6,93</strong> no cartão</p>', '<p class="sm-offer-value-installments">ou em até <strong>12x de R$ 5,90</strong> no cartão</p>'],
  ['<h3>12x de R$6,93 ou R$67 à vista</h3>', '<h3>12x de R$5,90 ou R$57 à vista</h3>'],
  ['A oferta atual já inclui 50% de desconto: de R$137,90 por R$67 à vista. Também pode ser parcelada em até 12x de R$6,93 no cartão, com acréscimo.', 'A oferta atual já inclui 60% de desconto: de R$137,90 por R$57 à vista. Também pode ser parcelada em até 12x de R$5,90 no cartão, com acréscimo.']
];

for (const [from, to] of replacements) html = html.split(from).join(to);

html = html.replace(
  /(<div class="sm-offer-value-final"><sup>R\$<\/sup><strong>)67(<\/strong><span>,00<\/span><\/div>)/g,
  '$157$2'
);

// Main countdown stays inside the existing price card.
const checkoutUrgency = `
<div class="sm-daily-urgency sm-daily-urgency--checkout" role="note" aria-label="Prazo da oferta de hoje">
  <span>O valor promocional termina <strong>hoje, <b data-sm-offer-date>--</b></strong></span>
  <div class="sm-daily-countdown" aria-label="Contagem regressiva até meia-noite">
    <div><strong data-sm-countdown-hours>--</strong><small>HORAS</small></div><i>:</i>
    <div><strong data-sm-countdown-minutes>--</strong><small>MIN</small></div><i>:</i>
    <div><strong data-sm-countdown-seconds>--</strong><small>SEG</small></div>
  </div>
</div>`;

if (!html.includes('sm-daily-urgency--checkout')) {
  const kicker = '<span class="sm-offer-value-checkout-kicker">HOJE, COM A OFERTA ATUAL</span>';
  if (!html.includes(kicker)) throw new Error('Offer checkout kicker not found.');
  html = html.replace(kicker, kicker + checkoutUrgency);
}

const css = `<style id="sm-preview-offer-57-60off-from-production-v2">
.sm-daily-urgency--checkout{position:relative;z-index:1;box-sizing:border-box;width:100%;max-width:100%;min-width:0;margin:14px 0 2px;padding:14px;border:1px solid rgba(255,255,255,.16);border-radius:16px;background:rgba(255,255,255,.08);overflow:hidden}
.sm-daily-urgency--checkout>span{display:block;max-width:100%;margin-bottom:10px;color:#f4effa;font-size:12px;line-height:1.35}.sm-daily-urgency--checkout>span strong{color:#fff}.sm-daily-urgency--checkout>span b{font:inherit;color:#ffd6bf}
.sm-daily-countdown{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:7px;box-sizing:border-box;width:100%;max-width:100%;min-width:0;overflow:hidden}
.sm-daily-countdown>div{display:flex;min-width:0;flex-direction:column;align-items:center;justify-content:center;min-height:58px;padding:7px 5px;border-radius:12px;background:#fff;color:#34293e;box-shadow:0 8px 22px rgba(20,12,31,.14)}
.sm-daily-countdown>div strong{font-variant-numeric:tabular-nums;font-size:23px;line-height:1;font-weight:950}.sm-daily-countdown>div small{margin-top:5px;color:#817789;font-size:7px;font-weight:900;letter-spacing:.11em}.sm-daily-countdown>i{color:#e5d9ee;font-style:normal;font-size:20px;font-weight:900}
.sm-dock-urgency{display:none}
@media(max-width:720px){.sm-daily-urgency--checkout{margin-top:13px;padding:12px}.sm-daily-countdown{gap:5px}.sm-daily-countdown>div{min-height:52px;padding:6px 3px}.sm-daily-countdown>div strong{font-size:20px}.sm-daily-countdown>i{font-size:17px}}
@media(max-width:640px){
  .sm-sales-dock{box-sizing:border-box!important;width:auto!important;max-width:calc(100vw - 12px)!important;min-width:0!important;min-height:60px!important;gap:7px!important;padding:8px 9px!important;overflow:hidden!important}
  .sm-sales-dock .sm-dock-discount{display:flex!important;align-items:center!important;justify-content:center!important;flex:0 0 auto!important;min-height:42px!important;padding:0 3px!important;font-size:13px!important;letter-spacing:0!important;white-space:nowrap!important}
  .sm-sales-dock .sm-dock-inventory{display:none!important}
  .sm-dock-urgency{display:flex;flex:0 1 96px;min-width:80px;max-width:96px;min-height:42px;box-sizing:border-box;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:5px 6px;border-left:1px solid rgba(96,82,112,.12);border-right:1px solid rgba(96,82,112,.12);color:#615969;line-height:1;overflow:hidden}
  .sm-dock-urgency span{display:block;max-width:100%;color:#736b7b;font-size:7.5px;font-weight:900;letter-spacing:.065em;white-space:nowrap}
  .sm-dock-urgency strong{display:block;max-width:100%;color:#ef641f;font-variant-numeric:tabular-nums;font-size:12px;font-weight:950;letter-spacing:-.01em;white-space:nowrap}
  .sm-sales-dock .sm-dock-actions{display:flex!important;align-items:center!important;gap:6px!important;flex:0 0 auto!important;min-width:0!important;margin-left:auto!important}
  .sm-sales-dock .sm-dock-checkout{box-sizing:border-box!important;width:auto!important;min-width:0!important;max-width:112px!important;min-height:44px!important;padding:0 11px!important;gap:5px!important;border-radius:12px!important;white-space:nowrap!important}
  .sm-sales-dock .sm-dock-checkout span{font-size:10.5px!important;line-height:1!important;letter-spacing:0!important;white-space:nowrap!important}
  .sm-sales-dock .sm-dock-checkout b{font-size:15px!important;line-height:1!important}
  .sm-sales-dock .sm-dock-whatsapp{box-sizing:border-box!important;display:grid!important;place-items:center!important;flex:0 0 38px!important;width:38px!important;min-width:38px!important;max-width:38px!important;height:38px!important;min-height:38px!important;padding:0!important;border-radius:11px!important;overflow:hidden!important}
  .sm-sales-dock .sm-dock-whatsapp span{display:none!important}
  .sm-sales-dock .sm-dock-whatsapp svg{width:19px!important;height:19px!important;margin:0!important}
}
@media(max-width:390px){
  .sm-sales-dock{gap:6px!important;padding-left:7px!important;padding-right:7px!important}
  .sm-sales-dock .sm-dock-discount{font-size:12px!important;padding-left:2px!important;padding-right:2px!important}
  .sm-dock-urgency{flex-basis:84px;min-width:72px;max-width:84px;padding-left:4px;padding-right:4px}
  .sm-dock-urgency span{font-size:7px;letter-spacing:.04em}
  .sm-dock-urgency strong{font-size:11px}
  .sm-sales-dock .sm-dock-checkout{max-width:101px!important;min-height:42px!important;padding-left:9px!important;padding-right:9px!important}
  .sm-sales-dock .sm-dock-checkout span{font-size:9.7px!important}
  .sm-sales-dock .sm-dock-whatsapp{flex-basis:35px!important;width:35px!important;min-width:35px!important;max-width:35px!important;height:35px!important;min-height:35px!important}
}
@media(max-width:360px){
  .sm-sales-dock{min-height:58px!important;gap:5px!important;padding:7px 6px!important}
  .sm-sales-dock .sm-dock-discount{font-size:11px!important}
  .sm-dock-urgency{flex-basis:72px;min-width:64px;max-width:72px;padding-left:3px;padding-right:3px}
  .sm-dock-urgency span{font-size:6.5px;letter-spacing:.02em}
  .sm-dock-urgency strong{font-size:10px}
  .sm-sales-dock .sm-dock-checkout{max-width:90px!important;min-height:40px!important;padding-left:7px!important;padding-right:7px!important}
  .sm-sales-dock .sm-dock-checkout span{font-size:9px!important}
  .sm-sales-dock .sm-dock-whatsapp{flex-basis:32px!important;width:32px!important;min-width:32px!important;max-width:32px!important;height:32px!important;min-height:32px!important}
}
</style>`;
html = html.replace('</head>', css + '\n</head>');

const runtime = `<script id="sm-preview-offer-57-60off-from-production-v2-runtime">
(function(){
  var OFFSET_MS=3*60*60*1000;
  var dateFmt=new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Fortaleza',day:'numeric',month:'long'});
  function pad(n){return String(n).padStart(2,'0');}
  function remaining(nowMs){
    var localMs=nowMs-OFFSET_MS;
    var d=new Date(localMs);
    var nextLocalMidnight=Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()+1,0,0,0);
    var nextUtc=nextLocalMidnight+OFFSET_MS;
    return Math.max(0,Math.floor((nextUtc-nowMs)/1000));
  }
  function ensureDock(){
    var dock=document.querySelector('.sm-sales-dock');
    if(!dock)return;
    if(!dock.querySelector('.sm-dock-urgency')){
      var urgency=document.createElement('div');
      urgency.className='sm-dock-urgency';
      urgency.setAttribute('aria-label','Oferta acaba hoje');
      urgency.innerHTML='<span>ACABA HOJE</span><strong data-sm-dock-countdown>--:--:--</strong>';
      var actions=dock.querySelector('.sm-dock-actions');
      dock.insertBefore(urgency,actions||null);
    }
    var checkout=dock.querySelector('.sm-dock-checkout');
    if(checkout&&!checkout.dataset.smCompactOffer){
      checkout.dataset.smCompactOffer='1';
      checkout.innerHTML='<span>QUERO AGORA</span><b aria-hidden="true">→</b>';
    }
  }
  function tick(){
    ensureDock();
    var now=new Date();
    var label=dateFmt.format(now);
    document.querySelectorAll('[data-sm-offer-date]').forEach(function(el){el.textContent=label;});
    var left=remaining(now.getTime());
    var h=Math.floor(left/3600),m=Math.floor((left%3600)/60),s=left%60;
    var clock=pad(h)+':'+pad(m)+':'+pad(s);
    document.querySelectorAll('[data-sm-countdown-hours]').forEach(function(el){el.textContent=pad(h);});
    document.querySelectorAll('[data-sm-countdown-minutes]').forEach(function(el){el.textContent=pad(m);});
    document.querySelectorAll('[data-sm-countdown-seconds]').forEach(function(el){el.textContent=pad(s);});
    document.querySelectorAll('[data-sm-dock-countdown]').forEach(function(el){el.textContent=clock;});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();
  setInterval(tick,500);
})();
</script>`;
html = html.replace('</body>', runtime + '\n</body>');

fs.writeFileSync(target, html);
console.log('Preview applied safely: full-height mobile dock with 60% OFF, daily urgency and compact CTA.');
