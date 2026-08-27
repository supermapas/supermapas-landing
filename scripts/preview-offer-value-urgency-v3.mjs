import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/preview-offer-value-urgency-v3.mjs <html-file>');

let html = fs.readFileSync(target, 'utf8');

html = html.replace(
  '<h2 id="sm-offer-value-title">Veja o valor de tudo o que você recebe <span>hoje.</span></h2>\n      <p>Os 60% de desconto são aplicados aos 98 Supermapas. Os Super-resumos e os Supercards entram como bônus gratuitos.</p>',
  '<h2 id="sm-offer-value-title">Veja tudo o que você recebe — <span>e quanto pagaria separadamente.</span></h2>\n      <p>Compare o valor individual dos materiais com a condição especial aplicada à oferta.</p>'
);

html = html.replaceAll('<b class="sm-offer-value-free">GRÁTIS</b>', '<b class="sm-offer-value-free">BÔNUS GRÁTIS</b>');

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

const oldUrgency = `<div class="sm-daily-urgency sm-daily-urgency--checkout" role="note" aria-label="Prazo da oferta de hoje">
  <span>O valor promocional termina <strong>hoje, <b data-sm-offer-date>--</b></strong></span>
  <div class="sm-daily-countdown" aria-label="Contagem regressiva até meia-noite">
    <div><strong data-sm-countdown-hours>--</strong><small>HORAS</small></div><i>:</i>
    <div><strong data-sm-countdown-minutes>--</strong><small>MIN</small></div><i>:</i>
    <div><strong data-sm-countdown-seconds>--</strong><small>SEG</small></div>
  </div>
</div>`;

const newUrgency = `<div class="sm-offer-clear" role="note" aria-label="Período e encerramento da oferta">
  <span class="sm-offer-clear-label">OFERTA VÁLIDA NOS DIAS</span>
  <strong class="sm-offer-clear-range" data-sm-date-range>--</strong>
  <span class="sm-offer-clear-today">TERMINA HOJE</span>
  <div class="sm-offer-clear-countdown" aria-label="Contagem regressiva até meia-noite">
    <div><strong data-sm-countdown-hours>--</strong><small>HORAS</small></div><i>:</i>
    <div><strong data-sm-countdown-minutes>--</strong><small>MIN</small></div><i>:</i>
    <div><strong data-sm-countdown-seconds>--</strong><small>SEG</small></div>
  </div>
</div>`;

if (!html.includes('sm-offer-clear')) {
  if (!html.includes(oldUrgency)) throw new Error('Existing checkout urgency block not found.');
  html = html.replace(oldUrgency, newUrgency);
}

html = html.replace('<span class="sm-offer-value-checkout-kicker">HOJE, COM A OFERTA ATUAL</span>', '');
html = html.replace(
  '<div class="sm-offer-value-was"><span>98 Supermapas</span><s>R$ 137,90</s></div>',
  '<div class="sm-offer-value-was sm-offer-value-was--total"><span>Valor dos materiais</span><s>R$ 221,90</s></div><span class="sm-offer-price-today"><strong>HOJE</strong> <em>POR</em></span>'
);
html = html.replace(
  '<div class="sm-offer-value-bonus-summary"><span>+ 50 Super-resumos</span><span>+ 190 Supercards</span><b>GRÁTIS</b></div>',
  ''
);

const css = `
<style id="sm-preview-offer-value-urgency-v3">
.sm-offer-value-total{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:5px;padding:20px 21px;border:1.5px solid rgba(112,86,217,.25);border-radius:20px;background:linear-gradient(135deg,#f8f5ff 0%,#fff 70%);box-shadow:0 14px 32px rgba(58,43,103,.075)}
.sm-offer-value-total>div:first-child{min-width:0}.sm-offer-value-total>div:first-child>span{display:block;color:#6048c4;font-size:10.5px;font-weight:950;letter-spacing:.13em}.sm-offer-value-total>div:first-child>small{display:block;margin-top:5px;color:#746d7b;font-size:11px;line-height:1.35}.sm-offer-value-total>div:first-child>b{display:inline-flex;margin-top:9px;padding:5px 8px;border-radius:999px;background:#f1edff;color:#6b50d2;font-size:8px;line-height:1;font-weight:950;letter-spacing:.09em}.sm-offer-value-total-price{display:flex;flex:0 0 auto;flex-direction:column;align-items:flex-end}.sm-offer-value-total-price small{color:#7d7585;font-size:9px;font-weight:900;letter-spacing:.10em}.sm-offer-value-total-price s{margin-top:3px;color:#463d50;font-size:30px;line-height:1;font-weight:950;text-decoration-color:#ef641f;text-decoration-thickness:3.5px}.sm-offer-value-price .sm-offer-value-free{padding-left:8px!important;padding-right:8px!important;font-size:9px!important;letter-spacing:.025em!important}

.sm-offer-clear{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;margin:3px 0 0;padding:18px 6px 24px;border-bottom:1px solid rgba(255,255,255,.16);text-align:center}.sm-offer-clear-label{display:block;color:#d7cbea;font-size:11px;font-weight:950;line-height:1;letter-spacing:.16em}.sm-offer-clear-range{display:block;margin-top:9px;color:#fff;font-size:24px;line-height:1.08;font-weight:950;letter-spacing:-.025em}.sm-offer-clear-today{display:inline-flex;align-items:center;justify-content:center;min-height:34px;margin-top:16px;padding:0 15px;border-radius:999px;background:#ef641f;color:#fff;font-size:11px;line-height:1;font-weight:950;letter-spacing:.10em;box-shadow:0 8px 20px rgba(239,100,31,.22)}
.sm-offer-clear-countdown{display:flex;align-items:flex-start;justify-content:center;gap:11px;width:100%;margin-top:15px}.sm-offer-clear-countdown>div{display:flex;min-width:67px;flex-direction:column;align-items:center}.sm-offer-clear-countdown>div>strong{color:#fff;font-variant-numeric:tabular-nums;font-size:48px;line-height:.92;font-weight:950;letter-spacing:-.045em;text-shadow:0 9px 24px rgba(0,0,0,.10)}.sm-offer-clear-countdown>div>small{margin-top:8px;color:#c9c0d1;font-size:8px;font-weight:950;letter-spacing:.16em}.sm-offer-clear-countdown>i{margin-top:0;color:#ef9b70;font-style:normal;font-size:39px;line-height:.9;font-weight:900}

.sm-offer-value-was--total{margin:20px 0 4px!important}.sm-offer-value-was--total span{font-weight:800;color:#eee7f4}.sm-offer-value-was--total s{color:#ffd0b8;font-size:14px;font-weight:900;text-decoration-thickness:2px}
.sm-offer-price-today{position:relative;z-index:1;display:flex;align-items:baseline;gap:6px;width:max-content;margin:12px 0 0;font-size:12px;font-weight:950;line-height:1;letter-spacing:.14em}.sm-offer-price-today strong{color:#087e59;font-size:15px;font-weight:950}.sm-offer-price-today em{color:#fff;font-style:normal;font-size:11px;font-weight:850}
.sm-offer-value-final{margin-top:4px!important;margin-bottom:10px!important;color:#fff!important}.sm-offer-value-final sup{color:#fff!important;font-size:21px!important}.sm-offer-value-final strong,.sm-offer-value-final>span{color:#087e59!important}.sm-offer-value-final strong{font-size:92px!important;text-shadow:0 11px 28px rgba(8,126,89,.22)}.sm-offer-value-final>span{margin-top:10px!important;font-size:35px!important;font-weight:900!important}.sm-offer-value-installments{margin-bottom:24px!important}

@media(max-width:640px){.sm-offer-value-total{padding:16px 14px;gap:10px;border-radius:18px}.sm-offer-value-total>div:first-child>span{font-size:9.4px}.sm-offer-value-total>div:first-child>small{font-size:9.5px}.sm-offer-value-total>div:first-child>b{margin-top:7px;font-size:7px}.sm-offer-value-total-price s{font-size:23px}.sm-offer-clear{margin-top:0;padding:20px 2px 23px}.sm-offer-clear-label{font-size:10.5px}.sm-offer-clear-range{margin-top:10px;font-size:24px}.sm-offer-clear-today{min-height:35px;margin-top:17px;padding:0 16px;font-size:11px}.sm-offer-clear-countdown{gap:9px;margin-top:17px}.sm-offer-clear-countdown>div{min-width:64px}.sm-offer-clear-countdown>div>strong{font-size:46px}.sm-offer-clear-countdown>div>small{margin-top:7px;font-size:7.5px}.sm-offer-clear-countdown>i{font-size:37px}.sm-offer-value-was--total{margin-top:18px!important}.sm-offer-price-today{margin-top:11px;font-size:11px}.sm-offer-price-today strong{font-size:14px}.sm-offer-price-today em{font-size:10.5px}.sm-offer-value-final strong{font-size:84px!important}.sm-offer-value-final sup{font-size:20px!important}.sm-offer-value-final>span{font-size:32px!important}.sm-offer-value-installments{margin-bottom:22px!important}}
@media(max-width:390px){.sm-offer-value-total{align-items:flex-end}.sm-offer-value-total>div:first-child>small{max-width:175px}.sm-offer-value-total-price s{font-size:21px}.sm-offer-clear{padding-left:0;padding-right:0}.sm-offer-clear-label{font-size:10px}.sm-offer-clear-range{font-size:22px}.sm-offer-clear-countdown{gap:7px}.sm-offer-clear-countdown>div{min-width:59px}.sm-offer-clear-countdown>div>strong{font-size:43px}.sm-offer-clear-countdown>i{font-size:34px}.sm-offer-value-final strong{font-size:78px!important}.sm-offer-value-final>span{font-size:30px!important}.sm-offer-value-price .sm-offer-value-free{font-size:8.5px!important}}
</style>`;
html = html.replace('</head>', css + '\n</head>');

const runtime = `
<script id="sm-preview-offer-value-urgency-v3-runtime">
(function(){
  var TZ='America/Fortaleza';
  var datePartsFmt=new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'});
  var dayFmt=new Intl.DateTimeFormat('pt-BR',{timeZone:'UTC',day:'numeric'});
  var monthLongFmt=new Intl.DateTimeFormat('pt-BR',{timeZone:'UTC',month:'long'});
  function zonedToday(){var parts=datePartsFmt.formatToParts(new Date()),x={};parts.forEach(function(p){if(p.type!=='literal')x[p.type]=Number(p.value);});return new Date(Date.UTC(x.year,x.month-1,x.day,12,0,0));}
  function fill(selector,value){document.querySelectorAll(selector).forEach(function(el){el.textContent=value;});}
  function render(){
    var d3=zonedToday(),d2=new Date(d3),d1=new Date(d3);d2.setUTCDate(d2.getUTCDate()-1);d1.setUTCDate(d1.getUTCDate()-2);
    var sameMonth=d1.getUTCMonth()===d3.getUTCMonth()&&d1.getUTCFullYear()===d3.getUTCFullYear();
    var range;
    if(sameMonth){
      range=dayFmt.format(d1)+', '+dayFmt.format(d2)+' e '+dayFmt.format(d3)+' de '+monthLongFmt.format(d3);
    }else{
      range=dayFmt.format(d1)+' de '+monthLongFmt.format(d1)+', '+dayFmt.format(d2)+' de '+monthLongFmt.format(d2)+' e '+dayFmt.format(d3)+' de '+monthLongFmt.format(d3);
    }
    fill('[data-sm-date-range]',range);
  }
  render();setInterval(render,1000);
})();
</script>`;
html = html.replace('</body>', runtime + '\n</body>');

fs.writeFileSync(target, html);
console.log('Offer value simplified: duplicate benefit row removed and R$57 highlighted with strong green.');
