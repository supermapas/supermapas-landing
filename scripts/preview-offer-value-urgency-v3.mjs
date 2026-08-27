import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/preview-offer-value-urgency-v3.mjs <html-file>');

let html = fs.readFileSync(target, 'utf8');

// Refine the offer-section headline so "hoje" is reserved for the actual deadline block.
html = html.replace(
  '<h2 id="sm-offer-value-title">Veja o valor de tudo o que você recebe <span>hoje.</span></h2>\n      <p>Os 60% de desconto são aplicados aos 98 Supermapas. Os Super-resumos e os Supercards entram como bônus gratuitos.</p>',
  '<h2 id="sm-offer-value-title">Veja tudo o que você recebe — <span>e quanto pagaria separadamente.</span></h2>\n      <p>Compare o valor individual dos materiais com a condição especial aplicada à oferta.</p>'
);

// Make both bonus badges explicit.
html = html.replaceAll('<b class="sm-offer-value-free">GRÁTIS</b>', '<b class="sm-offer-value-free">BÔNUS GRÁTIS</b>');

// Replace the explanatory note with a stronger combined-value conclusion only.
const noteNeedle = '<div class="sm-offer-value-note"><span>✓</span><p>Você paga apenas pelos <strong>98 Supermapas</strong>. Os dois bônus entram sem custo adicional.</p></div>';
const totalBlock = `
<div class="sm-offer-value-total" role="note" aria-label="Valor total somado dos materiais">
  <div>
    <span>VALOR TOTAL DOS MATERIAIS</span>
    <small>98 Supermapas + 50 Super-resumos + 190 Supercards</small>
    <b>VOCÊ NÃO PAGA ESSE VALOR</b>
  </div>
  <div class="sm-offer-value-total-price">
    <small>TOTAL</small>
    <s>R$ 221,90</s>
  </div>
</div>`;

if (!html.includes('sm-offer-value-total')) {
  if (!html.includes(noteNeedle)) throw new Error('Offer value note not found.');
  html = html.replace(noteNeedle, totalBlock);
}

// Replace the simpler countdown with a visual rolling three-day offer window.
const oldUrgency = `<div class="sm-daily-urgency sm-daily-urgency--checkout" role="note" aria-label="Prazo da oferta de hoje">
  <span>O valor promocional termina <strong>hoje, <b data-sm-offer-date>--</b></strong></span>
  <div class="sm-daily-countdown" aria-label="Contagem regressiva até meia-noite">
    <div><strong data-sm-countdown-hours>--</strong><small>HORAS</small></div><i>:</i>
    <div><strong data-sm-countdown-minutes>--</strong><small>MIN</small></div><i>:</i>
    <div><strong data-sm-countdown-seconds>--</strong><small>SEG</small></div>
  </div>
</div>`;

const newUrgency = `<div class="sm-offer-window-card" role="note" aria-label="Período e encerramento da oferta">
  <div class="sm-offer-window-head">
    <span>SOMENTE NESTES DIAS</span>
    <strong>TERMINA HOJE</strong>
  </div>
  <div class="sm-offer-days" aria-label="Três dias da oferta">
    <div class="sm-offer-day"><strong data-sm-day-1>--</strong><span data-sm-month-1>---</span></div>
    <div class="sm-offer-day"><strong data-sm-day-2>--</strong><span data-sm-month-2>---</span></div>
    <div class="sm-offer-day sm-offer-day--today"><strong data-sm-day-3>--</strong><span data-sm-month-3>---</span><b>HOJE</b></div>
  </div>
  <div class="sm-offer-benefit-strip">
    <span><strong>60% OFF</strong> nos 98 Supermapas</span>
    <i aria-hidden="true"></i>
    <span><strong>+ 2 BÔNUS GRÁTIS</strong></span>
  </div>
  <div class="sm-offer-window-countdown-wrap">
    <span>A OFERTA TERMINA EM</span>
    <div class="sm-daily-countdown sm-daily-countdown--featured" aria-label="Contagem regressiva até meia-noite">
      <div><strong data-sm-countdown-hours>--</strong><small>HORAS</small></div><i>:</i>
      <div><strong data-sm-countdown-minutes>--</strong><small>MIN</small></div><i>:</i>
      <div><strong data-sm-countdown-seconds>--</strong><small>SEG</small></div>
    </div>
  </div>
</div>`;

if (!html.includes('sm-offer-window-card')) {
  if (!html.includes(oldUrgency)) throw new Error('Existing checkout urgency block not found.');
  html = html.replace(oldUrgency, newUrgency);
}

// Anchor the final price against the combined value of all delivered materials.
html = html.replace(
  '<div class="sm-offer-value-was"><span>98 Supermapas</span><s>R$ 137,90</s></div>',
  '<div class="sm-offer-value-was sm-offer-value-was--total"><span>Valor dos materiais</span><s>R$ 221,90</s></div>'
);

const css = `
<style id="sm-preview-offer-value-urgency-v3">
.sm-offer-value-total{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:5px;padding:20px 21px;border:1.5px solid rgba(112,86,217,.25);border-radius:20px;background:linear-gradient(135deg,#f8f5ff 0%,#fff 70%);box-shadow:0 14px 32px rgba(58,43,103,.075)}
.sm-offer-value-total>div:first-child{min-width:0}.sm-offer-value-total>div:first-child>span{display:block;color:#6048c4;font-size:10.5px;font-weight:950;letter-spacing:.13em}.sm-offer-value-total>div:first-child>small{display:block;margin-top:5px;color:#746d7b;font-size:11px;line-height:1.35}.sm-offer-value-total>div:first-child>b{display:inline-flex;margin-top:9px;padding:5px 8px;border-radius:999px;background:#f1edff;color:#6b50d2;font-size:8px;line-height:1;font-weight:950;letter-spacing:.09em}
.sm-offer-value-total-price{display:flex;flex:0 0 auto;flex-direction:column;align-items:flex-end}.sm-offer-value-total-price small{color:#7d7585;font-size:9px;font-weight:900;letter-spacing:.10em}.sm-offer-value-total-price s{margin-top:3px;color:#463d50;font-size:30px;line-height:1;font-weight:950;text-decoration-color:#ef641f;text-decoration-thickness:3.5px}
.sm-offer-value-price .sm-offer-value-free{padding-left:8px!important;padding-right:8px!important;font-size:9px!important;letter-spacing:.025em!important}
.sm-offer-window-card{position:relative;z-index:1;margin:14px 0 14px;padding:14px;border:1px solid rgba(255,255,255,.18);border-radius:20px;background:linear-gradient(145deg,rgba(255,255,255,.115),rgba(255,255,255,.055));box-shadow:inset 0 1px 0 rgba(255,255,255,.08);overflow:hidden}
.sm-offer-window-card:after{content:"";position:absolute;right:-58px;top:-72px;width:150px;height:150px;border-radius:50%;background:radial-gradient(circle,rgba(255,128,62,.17),rgba(255,128,62,0) 70%);pointer-events:none}
.sm-offer-window-head{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}.sm-offer-window-head>span{color:#d9cff2;font-size:8px;font-weight:950;letter-spacing:.14em}.sm-offer-window-head>strong{display:inline-flex;align-items:center;justify-content:center;min-height:30px;padding:0 10px;border-radius:999px;background:#ef641f;color:#fff;font-size:8px;font-weight:950;letter-spacing:.075em;box-shadow:0 7px 17px rgba(239,100,31,.23);white-space:nowrap}
.sm-offer-days{position:relative;z-index:1;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.sm-offer-day{position:relative;display:flex;min-width:0;min-height:62px;flex-direction:column;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.11);border-radius:14px;background:rgba(255,255,255,.075);color:#fff}.sm-offer-day>strong{font-size:23px;line-height:.95;font-weight:950;letter-spacing:-.035em}.sm-offer-day>span{margin-top:5px;color:#cfc5da;font-size:7px;line-height:1;font-weight:900;letter-spacing:.13em;text-transform:uppercase}.sm-offer-day--today{border-color:rgba(255,139,79,.58);background:linear-gradient(145deg,#f36a2d,#eb5e20);box-shadow:0 8px 20px rgba(239,100,31,.22)}.sm-offer-day--today>span{color:#fff}.sm-offer-day--today>b{position:absolute;right:6px;top:5px;padding:3px 5px;border-radius:999px;background:rgba(255,255,255,.18);color:#fff;font-size:5.5px;line-height:1;font-weight:950;letter-spacing:.08em}
.sm-offer-benefit-strip{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:10px;margin-top:9px;padding:9px 10px;border:1px solid rgba(255,255,255,.11);border-radius:13px;background:rgba(255,255,255,.075);color:#e7dfed;font-size:8.5px;line-height:1.2;text-align:center}.sm-offer-benefit-strip span{min-width:0}.sm-offer-benefit-strip strong{color:#ffd1b8;font-size:10px;font-weight:950}.sm-offer-benefit-strip span:last-child strong{color:#bff1dd}.sm-offer-benefit-strip i{flex:0 0 1px;width:1px;height:20px;background:rgba(255,255,255,.15)}
.sm-offer-window-countdown-wrap{position:relative;z-index:1;margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,.12)}.sm-offer-window-countdown-wrap>span{display:block;margin-bottom:6px;color:#d9cff2;font-size:7.5px;font-weight:950;letter-spacing:.14em;text-align:center}
.sm-daily-countdown--featured{gap:6px!important}.sm-daily-countdown--featured>div{position:relative;min-height:53px!important;padding:5px 3px!important;border:1px solid rgba(239,100,31,.13)!important;border-radius:12px!important;background:#fff!important;box-shadow:0 8px 19px rgba(18,10,29,.16)!important}.sm-daily-countdown--featured>div:before{content:"";position:absolute;left:12px;right:12px;top:0;height:2px;border-radius:0 0 2px 2px;background:#ef641f}.sm-daily-countdown--featured>div strong{color:#2d2535!important;font-size:23px!important}.sm-daily-countdown--featured>div small{margin-top:4px!important;color:#7f7686!important;font-size:6.5px!important}.sm-daily-countdown--featured>i{color:#f0a57c!important;font-size:18px!important}
.sm-offer-value-was--total{margin-top:16px!important}.sm-offer-value-was--total span{font-weight:800;color:#eee7f4}.sm-offer-value-was--total s{color:#ffd0b8;font-size:14px;font-weight:900;text-decoration-thickness:2px}
@media(max-width:640px){
  .sm-offer-value-total{padding:16px 14px;gap:10px;border-radius:18px}.sm-offer-value-total>div:first-child>span{font-size:9.4px}.sm-offer-value-total>div:first-child>small{font-size:9.5px}.sm-offer-value-total>div:first-child>b{margin-top:7px;font-size:7px}.sm-offer-value-total-price s{font-size:23px}
  .sm-offer-window-card{margin-top:12px;padding:12px;border-radius:18px}.sm-offer-window-head{margin-bottom:8px}.sm-offer-window-head>span{font-size:7.5px}.sm-offer-window-head>strong{min-height:29px;padding:0 9px;font-size:7.5px}.sm-offer-days{gap:6px}.sm-offer-day{min-height:58px;border-radius:12px}.sm-offer-day>strong{font-size:21px}.sm-offer-day>span{font-size:6.5px}.sm-offer-benefit-strip{gap:8px;padding:8px;font-size:7.7px}.sm-offer-benefit-strip strong{font-size:9px}.sm-offer-benefit-strip i{height:18px}.sm-daily-countdown--featured{gap:5px!important}.sm-daily-countdown--featured>div{min-height:51px!important}.sm-daily-countdown--featured>div strong{font-size:22px!important}.sm-daily-countdown--featured>i{font-size:17px!important}
}
@media(max-width:390px){
  .sm-offer-value-total{align-items:flex-end}.sm-offer-value-total>div:first-child>small{max-width:175px}.sm-offer-value-total-price s{font-size:21px}.sm-offer-window-head>span{font-size:7px}.sm-offer-window-head>strong{font-size:7px;padding:0 8px}.sm-offer-benefit-strip{gap:6px;padding-left:6px;padding-right:6px;font-size:7.1px}.sm-offer-benefit-strip strong{font-size:8.4px}.sm-offer-day--today>b{font-size:5px}.sm-offer-value-price .sm-offer-value-free{font-size:8.5px!important}
}
</style>`;
html = html.replace('</head>', css + '\n</head>');

const runtime = `
<script id="sm-preview-offer-value-urgency-v3-runtime">
(function(){
  var TZ='America/Fortaleza';
  var datePartsFmt=new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'});
  var dayFmt=new Intl.DateTimeFormat('pt-BR',{timeZone:'UTC',day:'numeric'});
  var monthFmt=new Intl.DateTimeFormat('pt-BR',{timeZone:'UTC',month:'short'});
  function zonedToday(){
    var parts=datePartsFmt.formatToParts(new Date());
    var x={};parts.forEach(function(p){if(p.type!=='literal')x[p.type]=Number(p.value);});
    return new Date(Date.UTC(x.year,x.month-1,x.day,12,0,0));
  }
  function monthLabel(d){return monthFmt.format(d).replace('.','').toUpperCase();}
  function fill(selector,value){document.querySelectorAll(selector).forEach(function(el){el.textContent=value;});}
  function render(){
    var d3=zonedToday();
    var d2=new Date(d3);d2.setUTCDate(d2.getUTCDate()-1);
    var d1=new Date(d3);d1.setUTCDate(d1.getUTCDate()-2);
    [[1,d1],[2,d2],[3,d3]].forEach(function(pair){
      fill('[data-sm-day-'+pair[0]+']',dayFmt.format(pair[1]));
      fill('[data-sm-month-'+pair[0]+']',monthLabel(pair[1]));
    });
  }
  render();
  setInterval(render,1000);
})();
</script>`;
html = html.replace('</body>', runtime + '\n</body>');

fs.writeFileSync(target, html);
console.log('Offer value v3 refined: compact total, visual rolling dates, single benefit strip and tighter countdown.');
