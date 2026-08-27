import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/preview-offer-value-urgency-v3.mjs <html-file>');

let html = fs.readFileSync(target, 'utf8');

// 1) Show the actual sum of all three materials after the individual value cards.
const noteNeedle = '<div class="sm-offer-value-note"><span>✓</span><p>Você paga apenas pelos <strong>98 Supermapas</strong>. Os dois bônus entram sem custo adicional.</p></div>';
const totalBlock = `
<div class="sm-offer-value-total" role="note" aria-label="Valor total somado dos materiais">
  <div>
    <span>VALOR SOMADO DOS 3 MATERIAIS</span>
    <small>98 Supermapas + 50 Super-resumos + 190 Supercards</small>
  </div>
  <div class="sm-offer-value-total-price">
    <small>total</small>
    <s>R$ 221,90</s>
  </div>
</div>
<div class="sm-offer-value-deal-note">
  <span>HOJE</span>
  <p><strong>60% OFF nos 98 Supermapas</strong> + <strong>2 bônus grátis</strong>.</p>
</div>`;

if (!html.includes('sm-offer-value-total')) {
  if (!html.includes(noteNeedle)) throw new Error('Offer value note not found.');
  html = html.replace(noteNeedle, totalBlock + '\n' + noteNeedle);
}

// 2) Replace the simpler countdown block with a more explicit rolling 3-day offer window.
const oldUrgency = `<div class="sm-daily-urgency sm-daily-urgency--checkout" role="note" aria-label="Prazo da oferta de hoje">
  <span>O valor promocional termina <strong>hoje, <b data-sm-offer-date>--</b></strong></span>
  <div class="sm-daily-countdown" aria-label="Contagem regressiva até meia-noite">
    <div><strong data-sm-countdown-hours>--</strong><small>HORAS</small></div><i>:</i>
    <div><strong data-sm-countdown-minutes>--</strong><small>MIN</small></div><i>:</i>
    <div><strong data-sm-countdown-seconds>--</strong><small>SEG</small></div>
  </div>
</div>`;

const newUrgency = `<div class="sm-offer-window-card" role="note" aria-label="Período e encerramento da oferta">
  <div class="sm-offer-window-top">
    <div class="sm-offer-window-copy">
      <span>SOMENTE NOS DIAS</span>
      <strong data-sm-rolling-dates>--, -- e -- de ----</strong>
    </div>
    <div class="sm-offer-window-today">TERMINA HOJE</div>
  </div>
  <div class="sm-offer-window-benefits">
    <div class="sm-offer-window-discount"><strong>60% OFF</strong><span>nos 98 Supermapas</span></div>
    <div class="sm-offer-window-bonuses"><strong>+ 2 BÔNUS GRÁTIS</strong><span>50 Super-resumos + 190 Supercards</span></div>
  </div>
  <div class="sm-offer-window-countdown-wrap">
    <span>OFERTA TERMINA EM</span>
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

// 3) Make the final price card reference the combined material value, while keeping offer mechanics explicit.
html = html.replace(
  '<div class="sm-offer-value-was"><span>98 Supermapas</span><s>R$ 137,90</s></div>',
  '<div class="sm-offer-value-was sm-offer-value-was--total"><span>Valor total dos materiais</span><s>R$ 221,90</s></div>'
);

const css = `
<style id="sm-preview-offer-value-urgency-v3">
.sm-offer-value-total{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:4px;padding:18px 20px;border:1.5px solid rgba(112,86,217,.22);border-radius:20px;background:linear-gradient(135deg,#faf8ff,#fff);box-shadow:0 12px 28px rgba(58,43,103,.07)}
.sm-offer-value-total>div:first-child{min-width:0}.sm-offer-value-total>div:first-child>span{display:block;color:#6550bf;font-size:10px;font-weight:950;letter-spacing:.12em}.sm-offer-value-total>div:first-child>small{display:block;margin-top:5px;color:#7a7281;font-size:11px;line-height:1.35}
.sm-offer-value-total-price{display:flex;flex:0 0 auto;flex-direction:column;align-items:flex-end}.sm-offer-value-total-price small{color:#8c8492;font-size:9px;font-weight:850;text-transform:uppercase;letter-spacing:.08em}.sm-offer-value-total-price s{margin-top:2px;color:#51485d;font-size:28px;line-height:1;font-weight:950;text-decoration-color:#ef641f;text-decoration-thickness:3px}
.sm-offer-value-deal-note{display:flex;align-items:center;gap:10px;margin-top:9px;padding:12px 14px;border-radius:16px;background:#fff4ec;border:1px solid rgba(239,100,31,.16)}.sm-offer-value-deal-note>span{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;min-height:28px;padding:0 9px;border-radius:999px;background:#ef641f;color:#fff;font-size:9px;font-weight:950;letter-spacing:.08em}.sm-offer-value-deal-note p{margin:0;color:#615665;font-size:12px;line-height:1.35}.sm-offer-value-deal-note strong{color:#332a38}
.sm-offer-window-card{position:relative;z-index:1;margin:15px 0 16px;padding:15px;border:1px solid rgba(255,255,255,.18);border-radius:20px;background:linear-gradient(145deg,rgba(255,255,255,.12),rgba(255,255,255,.065));box-shadow:inset 0 1px 0 rgba(255,255,255,.08);overflow:hidden}
.sm-offer-window-card:after{content:"";position:absolute;right:-55px;top:-70px;width:155px;height:155px;border-radius:50%;background:radial-gradient(circle,rgba(255,128,62,.18),rgba(255,128,62,0) 70%);pointer-events:none}
.sm-offer-window-top{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:10px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,.12)}.sm-offer-window-copy{min-width:0}.sm-offer-window-copy>span{display:block;margin-bottom:4px;color:#d9cff2;font-size:8px;font-weight:950;letter-spacing:.13em}.sm-offer-window-copy>strong{display:block;color:#fff;font-size:13.5px;line-height:1.2;font-weight:900;letter-spacing:-.015em}.sm-offer-window-today{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;min-height:34px;padding:0 11px;border-radius:999px;background:#ef641f;color:#fff;font-size:9px;font-weight:950;letter-spacing:.08em;box-shadow:0 7px 18px rgba(239,100,31,.25);white-space:nowrap}
.sm-offer-window-benefits{position:relative;z-index:1;display:grid;grid-template-columns:.82fr 1.18fr;gap:8px;margin-top:11px}.sm-offer-window-benefits>div{display:flex;min-width:0;flex-direction:column;justify-content:center;min-height:58px;padding:10px 11px;border-radius:14px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.11)}.sm-offer-window-benefits strong{color:#fff;font-size:12px;line-height:1.08;font-weight:950}.sm-offer-window-benefits span{margin-top:4px;color:#e5ddec;font-size:8.5px;line-height:1.25}.sm-offer-window-discount strong{color:#ffd2ba}.sm-offer-window-bonuses strong{color:#bff2dd}
.sm-offer-window-countdown-wrap{position:relative;z-index:1;margin-top:11px;padding-top:11px;border-top:1px solid rgba(255,255,255,.12)}.sm-offer-window-countdown-wrap>span{display:block;margin-bottom:7px;color:#d9cff2;font-size:8px;font-weight:950;letter-spacing:.14em;text-align:center}
.sm-daily-countdown--featured{gap:8px!important}.sm-daily-countdown--featured>div{min-height:64px!important;border-radius:14px!important;background:#fff!important;box-shadow:0 10px 24px rgba(18,10,29,.18)!important}.sm-daily-countdown--featured>div strong{color:#2d2535!important;font-size:27px!important}.sm-daily-countdown--featured>div small{color:#7f7686!important;font-size:7px!important}.sm-daily-countdown--featured>i{color:#f0b18f!important;font-size:23px!important}
.sm-offer-value-was--total{margin-top:19px!important}.sm-offer-value-was--total span{font-weight:800;color:#eee7f4}.sm-offer-value-was--total s{color:#ffd0b8;font-size:14px;font-weight:900;text-decoration-thickness:2px}
@media(max-width:640px){
  .sm-offer-value-total{padding:15px 14px;gap:10px;border-radius:18px}.sm-offer-value-total>div:first-child>span{font-size:9px}.sm-offer-value-total>div:first-child>small{font-size:9.5px}.sm-offer-value-total-price s{font-size:23px}.sm-offer-value-deal-note{padding:11px 12px}.sm-offer-value-deal-note p{font-size:11px}
  .sm-offer-window-card{margin-top:13px;padding:13px;border-radius:18px}.sm-offer-window-copy>strong{font-size:12.5px}.sm-offer-window-today{min-height:32px;padding:0 9px;font-size:8px}.sm-offer-window-benefits{grid-template-columns:1fr 1fr;gap:7px}.sm-offer-window-benefits>div{min-height:56px;padding:9px}.sm-offer-window-benefits strong{font-size:10.5px}.sm-offer-window-benefits span{font-size:7.8px}.sm-daily-countdown--featured{gap:5px!important}.sm-daily-countdown--featured>div{min-height:59px!important}.sm-daily-countdown--featured>div strong{font-size:24px!important}.sm-daily-countdown--featured>i{font-size:19px!important}
}
@media(max-width:390px){
  .sm-offer-value-total{align-items:flex-end}.sm-offer-value-total>div:first-child>small{max-width:180px}.sm-offer-value-total-price s{font-size:21px}.sm-offer-window-top{align-items:flex-start}.sm-offer-window-copy>strong{font-size:11.5px}.sm-offer-window-today{font-size:7.5px;padding:0 8px}.sm-offer-window-benefits{grid-template-columns:1fr}.sm-offer-window-benefits>div{min-height:48px}.sm-offer-window-benefits span{font-size:8px}
}
</style>`;
html = html.replace('</head>', css + '\n</head>');

const runtime = `
<script id="sm-preview-offer-value-urgency-v3-runtime">
(function(){
  var TZ='America/Fortaleza';
  var dayFmt=new Intl.DateTimeFormat('pt-BR',{timeZone:TZ,day:'numeric'});
  var monthFmt=new Intl.DateTimeFormat('pt-BR',{timeZone:TZ,month:'long'});
  var fullFmt=new Intl.DateTimeFormat('pt-BR',{timeZone:TZ,day:'numeric',month:'long'});
  function zonedToday(){
    var parts=new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    var x={};parts.forEach(function(p){if(p.type!=='literal')x[p.type]=Number(p.value);});
    return new Date(Date.UTC(x.year,x.month-1,x.day,12,0,0));
  }
  function render(){
    var today=zonedToday();
    var d1=new Date(today);d1.setUTCDate(d1.getUTCDate()-2);
    var d2=new Date(today);d2.setUTCDate(d2.getUTCDate()-1);
    var d3=new Date(today);
    var sameMonth=d1.getUTCMonth()===d3.getUTCMonth()&&d1.getUTCFullYear()===d3.getUTCFullYear();
    var label=sameMonth
      ? dayFmt.format(d1)+', '+dayFmt.format(d2)+' e '+dayFmt.format(d3)+' de '+monthFmt.format(d3)
      : fullFmt.format(d1)+', '+fullFmt.format(d2)+' e '+fullFmt.format(d3);
    document.querySelectorAll('[data-sm-rolling-dates]').forEach(function(el){el.textContent=label;});
  }
  render();
  setInterval(render,1000);
})();
</script>`;
html = html.replace('</body>', runtime + '\n</body>');

fs.writeFileSync(target, html);
console.log('Offer value v3 applied: R$221,90 total, rolling 3-day window, highlighted 60% OFF, free bonuses and countdown.');
