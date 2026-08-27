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

// Add urgency only inside the existing price card. Do not inject new layout
// blocks into the mobile hero or fixed dock; this keeps Production geometry intact.
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
@media(max-width:720px){.sm-daily-urgency--checkout{margin-top:13px;padding:12px}.sm-daily-countdown{gap:5px}.sm-daily-countdown>div{min-height:52px;padding:6px 3px}.sm-daily-countdown>div strong{font-size:20px}.sm-daily-countdown>i{font-size:17px}}
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
  function tick(){
    var now=new Date();
    var label=dateFmt.format(now);
    document.querySelectorAll('[data-sm-offer-date]').forEach(function(el){el.textContent=label;});
    var left=remaining(now.getTime());
    var h=Math.floor(left/3600),m=Math.floor((left%3600)/60),s=left%60;
    document.querySelectorAll('[data-sm-countdown-hours]').forEach(function(el){el.textContent=pad(h);});
    document.querySelectorAll('[data-sm-countdown-minutes]').forEach(function(el){el.textContent=pad(m);});
    document.querySelectorAll('[data-sm-countdown-seconds]').forEach(function(el){el.textContent=pad(s);});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();
  setInterval(tick,500);
})();
</script>`;
html = html.replace('</body>', runtime + '\n</body>');

fs.writeFileSync(target, html);
console.log('Preview applied safely from production base: targeted offer copy only; production layout preserved.');
