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

const newUrgency = `<div class="sm-offer-window-simple" role="note" aria-label="Oferta de hoje e prazo">
  <div class="sm-offer-window-simple-head">
    <div><span>OFERTA DE HOJE</span><small>Disponível somente de <strong data-sm-date-range>--</strong></small></div>
    <b>TERMINA HOJE</b>
  </div>
  <div class="sm-offer-days-inline" aria-label="Dias da oferta">
    <div><strong data-sm-day-1>--</strong><span data-sm-month-1>---</span></div><i>—</i>
    <div><strong data-sm-day-2>--</strong><span data-sm-month-2>---</span></div><i>—</i>
    <div class="is-today"><strong data-sm-day-3>--</strong><span data-sm-month-3>---</span></div>
  </div>
  <div class="sm-offer-benefits-inline">
    <span><strong>60% OFF</strong> nos 98 Supermapas</span><i>•</i><span><strong>+ 2 BÔNUS GRÁTIS</strong></span>
  </div>
  <div class="sm-offer-countdown-simple">
    <span>A OFERTA TERMINA EM</span>
    <div class="sm-countdown-inline" aria-label="Contagem regressiva até meia-noite">
      <div><strong data-sm-countdown-hours>--</strong><small>HORAS</small></div><i>:</i>
      <div><strong data-sm-countdown-minutes>--</strong><small>MIN</small></div><i>:</i>
      <div><strong data-sm-countdown-seconds>--</strong><small>SEG</small></div>
    </div>
  </div>
</div>`;
if (!html.includes('sm-offer-window-simple')) {
  if (!html.includes(oldUrgency)) throw new Error('Existing checkout urgency block not found.');
  html = html.replace(oldUrgency, newUrgency);
}

html = html.replace('<span class="sm-offer-value-checkout-kicker">HOJE, COM A OFERTA ATUAL</span>', '');
html = html.replace(
  '<div class="sm-offer-value-was"><span>98 Supermapas</span><s>R$ 137,90</s></div>',
  '<div class="sm-offer-value-was sm-offer-value-was--total"><span>Valor dos materiais</span><s>R$ 221,90</s></div><span class="sm-offer-price-today">HOJE POR</span>'
);
html = html.replace(
  '<div class="sm-offer-value-bonus-summary"><span>+ 50 Super-resumos</span><span>+ 190 Supercards</span><b>GRÁTIS</b></div>',
  '<div class="sm-offer-value-bonus-summary sm-offer-value-bonus-summary--compact"><strong>50 Super-resumos + 190 Supercards</strong><b>GRÁTIS</b></div>'
);

const css = `
<style id="sm-preview-offer-value-urgency-v3">
.sm-offer-value-total{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:5px;padding:20px 21px;border:1.5px solid rgba(112,86,217,.25);border-radius:20px;background:linear-gradient(135deg,#f8f5ff 0%,#fff 70%);box-shadow:0 14px 32px rgba(58,43,103,.075)}
.sm-offer-value-total>div:first-child{min-width:0}.sm-offer-value-total>div:first-child>span{display:block;color:#6048c4;font-size:10.5px;font-weight:950;letter-spacing:.13em}.sm-offer-value-total>div:first-child>small{display:block;margin-top:5px;color:#746d7b;font-size:11px;line-height:1.35}.sm-offer-value-total>div:first-child>b{display:inline-flex;margin-top:9px;padding:5px 8px;border-radius:999px;background:#f1edff;color:#6b50d2;font-size:8px;line-height:1;font-weight:950;letter-spacing:.09em}.sm-offer-value-total-price{display:flex;flex:0 0 auto;flex-direction:column;align-items:flex-end}.sm-offer-value-total-price small{color:#7d7585;font-size:9px;font-weight:900;letter-spacing:.10em}.sm-offer-value-total-price s{margin-top:3px;color:#463d50;font-size:30px;line-height:1;font-weight:950;text-decoration-color:#ef641f;text-decoration-thickness:3.5px}.sm-offer-value-price .sm-offer-value-free{padding-left:8px!important;padding-right:8px!important;font-size:9px!important;letter-spacing:.025em!important}
.sm-offer-window-simple{position:relative;z-index:1;margin:12px 0 6px;padding:4px 0 16px;border-bottom:1px solid rgba(255,255,255,.14)}.sm-offer-window-simple-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}.sm-offer-window-simple-head>div{min-width:0}.sm-offer-window-simple-head span{display:block;color:#fff;font-size:11px;font-weight:950;letter-spacing:.14em}.sm-offer-window-simple-head small{display:block;margin-top:5px;color:#d9d0e4;font-size:10px;line-height:1.35}.sm-offer-window-simple-head small strong{color:#fff;font-weight:850}.sm-offer-window-simple-head>b{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;min-height:32px;padding:0 11px;border-radius:999px;background:#ef641f;color:#fff;font-size:8.5px;font-weight:950;letter-spacing:.08em;white-space:nowrap;box-shadow:0 7px 18px rgba(239,100,31,.2)}
.sm-offer-days-inline{display:flex;align-items:center;justify-content:center;gap:10px;margin:14px 0 10px}.sm-offer-days-inline>div{display:flex;align-items:baseline;gap:4px;color:#e7deed}.sm-offer-days-inline>div>strong{font-size:18px;line-height:1;font-weight:950}.sm-offer-days-inline>div>span{font-size:7px;font-weight:900;letter-spacing:.10em}.sm-offer-days-inline>i{color:rgba(255,255,255,.28);font-style:normal;font-size:13px}.sm-offer-days-inline>.is-today{padding:7px 10px;border-radius:999px;background:#ef641f;color:#fff;box-shadow:0 6px 16px rgba(239,100,31,.2)}
.sm-offer-benefits-inline{display:flex;align-items:center;justify-content:center;gap:8px;color:#ddd4e5;font-size:9.5px;line-height:1.2;text-align:center}.sm-offer-benefits-inline strong{color:#ffd1b8;font-size:10.5px;font-weight:950}.sm-offer-benefits-inline span:last-child strong{color:#bff1dd}.sm-offer-benefits-inline>i{color:rgba(255,255,255,.3);font-style:normal}
.sm-offer-countdown-simple{margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,.10)}.sm-offer-countdown-simple>span{display:block;margin-bottom:8px;color:#d8cfe2;font-size:7.5px;font-weight:950;letter-spacing:.15em;text-align:center}.sm-countdown-inline{display:flex;align-items:flex-start;justify-content:center;gap:10px}.sm-countdown-inline>div{display:flex;min-width:56px;flex-direction:column;align-items:center}.sm-countdown-inline>div>strong{color:#fff;font-variant-numeric:tabular-nums;font-size:34px;line-height:.95;font-weight:950;letter-spacing:-.035em;text-shadow:0 8px 24px rgba(0,0,0,.12)}.sm-countdown-inline>div>small{margin-top:5px;color:#bfb5c9;font-size:6.5px;font-weight:900;letter-spacing:.13em}.sm-countdown-inline>i{margin-top:2px;color:#ef9b70;font-style:normal;font-size:28px;line-height:1;font-weight:900}
.sm-offer-value-was--total{margin:14px 0 2px!important}.sm-offer-value-was--total span{font-weight:800;color:#eee7f4}.sm-offer-value-was--total s{color:#ffd0b8;font-size:14px;font-weight:900;text-decoration-thickness:2px}.sm-offer-price-today{position:relative;z-index:1;display:block;margin-top:8px;color:#d8ccff;font-size:8.5px;font-weight:950;letter-spacing:.15em}.sm-offer-value-final{margin-top:3px!important}.sm-offer-value-bonus-summary--compact{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;padding:12px 13px!important}.sm-offer-value-bonus-summary--compact strong{font-size:10.5px;line-height:1.25;color:#fff}.sm-offer-value-bonus-summary--compact b{flex:0 0 auto!important;margin:0!important}
@media(max-width:640px){.sm-offer-value-total{padding:16px 14px;gap:10px;border-radius:18px}.sm-offer-value-total>div:first-child>span{font-size:9.4px}.sm-offer-value-total>div:first-child>small{font-size:9.5px}.sm-offer-value-total>div:first-child>b{margin-top:7px;font-size:7px}.sm-offer-value-total-price s{font-size:23px}.sm-offer-window-simple{margin-top:9px;padding-bottom:14px}.sm-offer-window-simple-head span{font-size:10px}.sm-offer-window-simple-head small{font-size:9px}.sm-offer-window-simple-head>b{min-height:30px;padding:0 9px;font-size:7.5px}.sm-offer-days-inline{gap:7px;margin:12px 0 9px}.sm-offer-days-inline>div>strong{font-size:17px}.sm-offer-days-inline>.is-today{padding:6px 9px}.sm-offer-benefits-inline{gap:6px;font-size:8.2px}.sm-offer-benefits-inline strong{font-size:9.2px}.sm-countdown-inline{gap:8px}.sm-countdown-inline>div{min-width:52px}.sm-countdown-inline>div>strong{font-size:31px}.sm-countdown-inline>i{font-size:25px}.sm-offer-value-bonus-summary--compact strong{font-size:9.8px}}
@media(max-width:390px){.sm-offer-value-total{align-items:flex-end}.sm-offer-value-total>div:first-child>small{max-width:175px}.sm-offer-value-total-price s{font-size:21px}.sm-offer-window-simple-head{gap:8px}.sm-offer-window-simple-head>b{padding:0 8px;font-size:7px}.sm-offer-days-inline{gap:5px}.sm-offer-benefits-inline{font-size:7.6px}.sm-offer-benefits-inline strong{font-size:8.6px}.sm-countdown-inline{gap:6px}.sm-countdown-inline>div{min-width:48px}.sm-countdown-inline>div>strong{font-size:29px}.sm-countdown-inline>i{font-size:23px}.sm-offer-value-price .sm-offer-value-free{font-size:8.5px!important}}
</style>`;
html = html.replace('</head>', css + '\n</head>');

const runtime = `
<script id="sm-preview-offer-value-urgency-v3-runtime">
(function(){
  var TZ='America/Fortaleza';
  var datePartsFmt=new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'});
  var dayFmt=new Intl.DateTimeFormat('pt-BR',{timeZone:'UTC',day:'numeric'});
  var monthShortFmt=new Intl.DateTimeFormat('pt-BR',{timeZone:'UTC',month:'short'});
  var monthLongFmt=new Intl.DateTimeFormat('pt-BR',{timeZone:'UTC',month:'long'});
  function zonedToday(){var parts=datePartsFmt.formatToParts(new Date()),x={};parts.forEach(function(p){if(p.type!=='literal')x[p.type]=Number(p.value);});return new Date(Date.UTC(x.year,x.month-1,x.day,12,0,0));}
  function shortMonth(d){return monthShortFmt.format(d).replace('.','').toUpperCase();}
  function fill(selector,value){document.querySelectorAll(selector).forEach(function(el){el.textContent=value;});}
  function render(){
    var d3=zonedToday(),d2=new Date(d3),d1=new Date(d3);d2.setUTCDate(d2.getUTCDate()-1);d1.setUTCDate(d1.getUTCDate()-2);
    [[1,d1],[2,d2],[3,d3]].forEach(function(pair){fill('[data-sm-day-'+pair[0]+']',dayFmt.format(pair[1]));fill('[data-sm-month-'+pair[0]+']',shortMonth(pair[1]));});
    var sameMonth=d1.getUTCMonth()===d3.getUTCMonth()&&d1.getUTCFullYear()===d3.getUTCFullYear();
    var range=sameMonth?dayFmt.format(d1)+' a '+dayFmt.format(d3)+' de '+monthLongFmt.format(d3):dayFmt.format(d1)+' de '+monthLongFmt.format(d1)+' a '+dayFmt.format(d3)+' de '+monthLongFmt.format(d3);
    fill('[data-sm-date-range]',range);
  }
  render();setInterval(render,1000);
})();
</script>`;
html = html.replace('</body>', runtime + '\n</body>');

fs.writeFileSync(target, html);
console.log('Offer value simplified: compact date line, borderless benefits, inline countdown and stronger final price.');
