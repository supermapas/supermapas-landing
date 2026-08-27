import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/preview-offer-calendar-clock-v1.mjs <html-file>');

let html = fs.readFileSync(target, 'utf8');

const oldClockRe = /<script id="sm-preview-offer-57-60off-from-production-v2-runtime">[\s\S]*?<\/script>/;
const oldRangeRe = /<script id="sm-preview-offer-value-urgency-v3-runtime">[\s\S]*?<\/script>/;

if (!oldClockRe.test(html)) throw new Error('Main offer clock runtime not found.');

const runtime = `<script id="sm-preview-offer-calendar-clock-v1-runtime">
(function(){
  var TZ='America/Fortaleza';
  var partsFmt=new Intl.DateTimeFormat('en-US',{
    timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',
    hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'
  });
  var offerDateFmt=new Intl.DateTimeFormat('pt-BR',{timeZone:TZ,day:'numeric',month:'long'});
  var monthFmt=new Intl.DateTimeFormat('pt-BR',{timeZone:'UTC',month:'long'});

  function pad(n){return String(n).padStart(2,'0');}
  function parts(date){
    var out={};
    partsFmt.formatToParts(date).forEach(function(p){
      if(p.type!=='literal') out[p.type]=Number(p.value);
    });
    return {year:out.year,month:out.month,day:out.day,hour:out.hour,minute:out.minute,second:out.second};
  }
  function zonedToUtc(y,m,d,h,mi,s){
    var target=Date.UTC(y,m-1,d,h,mi,s);
    var guess=target;
    for(var i=0;i<4;i++){
      var p=parts(new Date(guess));
      var represented=Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second);
      var diff=target-represented;
      guess+=diff;
      if(diff===0) break;
    }
    return guess;
  }
  function calendarDate(y,m,d){return new Date(Date.UTC(y,m-1,d,12,0,0));}
  function shiftDay(date,delta){var x=new Date(date.getTime());x.setUTCDate(x.getUTCDate()+delta);return x;}
  function sameMonth(a,b){return a.getUTCFullYear()===b.getUTCFullYear()&&a.getUTCMonth()===b.getUTCMonth();}
  function day(d){return d.getUTCDate();}
  function month(d){return monthFmt.format(d);}
  function rangeText(p){
    var today=calendarDate(p.year,p.month,p.day);
    var d1=shiftDay(today,-2),d2=shiftDay(today,-1),d3=today;
    if(sameMonth(d1,d3)) return day(d1)+', '+day(d2)+' e '+day(d3)+' de '+month(d3);
    if(sameMonth(d1,d2)) return day(d1)+' e '+day(d2)+' de '+month(d1)+' e '+day(d3)+' de '+month(d3);
    if(sameMonth(d2,d3)) return day(d1)+' de '+month(d1)+', '+day(d2)+' e '+day(d3)+' de '+month(d3);
    return day(d1)+' de '+month(d1)+', '+day(d2)+' de '+month(d2)+' e '+day(d3)+' de '+month(d3);
  }
  function remainingSeconds(now,p){
    var tomorrow=calendarDate(p.year,p.month,p.day+1);
    var midnightUtc=zonedToUtc(tomorrow.getUTCFullYear(),tomorrow.getUTCMonth()+1,tomorrow.getUTCDate(),0,0,0);
    var seconds=Math.max(0,Math.ceil((midnightUtc-now.getTime())/1000));
    return Math.min(86399,seconds);
  }
  function fill(selector,value){document.querySelectorAll(selector).forEach(function(el){el.textContent=value;});}
  function ensureDock(){
    var dock=document.querySelector('.sm-sales-dock');
    if(!dock) return;
    if(!dock.querySelector('.sm-dock-urgency')){
      var urgency=document.createElement('div');
      urgency.className='sm-dock-urgency';
      urgency.setAttribute('aria-label','Oferta termina hoje');
      urgency.innerHTML='<span>TERMINA HOJE</span><strong data-sm-dock-countdown>--:--:--</strong>';
      var actions=dock.querySelector('.sm-dock-actions');
      dock.insertBefore(urgency,actions||null);
    }
  }
  function tick(){
    ensureDock();
    var now=new Date();
    var p=parts(now);
    fill('[data-sm-offer-date]',offerDateFmt.format(now));
    fill('[data-sm-date-range]',rangeText(p));
    var left=remainingSeconds(now,p);
    var h=Math.floor(left/3600),m=Math.floor((left%3600)/60),s=left%60;
    fill('[data-sm-countdown-hours]',pad(h));
    fill('[data-sm-countdown-minutes]',pad(m));
    fill('[data-sm-countdown-seconds]',pad(s));
    fill('[data-sm-dock-countdown]',pad(h)+':'+pad(m)+':'+pad(s));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',tick,{once:true}); else tick();
  setInterval(tick,250);
  document.addEventListener('visibilitychange',function(){if(!document.hidden) tick();});
  window.addEventListener('focus',tick);
})();
</script>`;

html = html.replace(oldClockRe, runtime);
html = html.replace(oldRangeRe, '');

// Build-time calendar sanity checks for 30/31-day months and leap years.
function datesFor(y,m,d){
  const today=new Date(Date.UTC(y,m-1,d,12));
  const prev1=new Date(today); prev1.setUTCDate(prev1.getUTCDate()-1);
  const prev2=new Date(today); prev2.setUTCDate(prev2.getUTCDate()-2);
  return [prev2,prev1,today].map(x=>[x.getUTCFullYear(),x.getUTCMonth()+1,x.getUTCDate()].join('-'));
}
const checks=[
  [2026,9,1,['2026-8-30','2026-8-31','2026-9-1']],
  [2026,10,1,['2026-9-29','2026-9-30','2026-10-1']],
  [2026,3,1,['2026-2-27','2026-2-28','2026-3-1']],
  [2028,3,1,['2028-2-28','2028-2-29','2028-3-1']],
  [2027,1,1,['2026-12-30','2026-12-31','2027-1-1']]
];
for(const [y,m,d,expected] of checks){
  const actual=datesFor(y,m,d);
  if(actual.join('|')!==expected.join('|')) throw new Error('Calendar sanity check failed: '+actual.join(', '));
}

fs.writeFileSync(target, html);
console.log('Offer calendar/countdown centralized in America/Fortaleza with real month lengths, leap-year handling and midnight reset.');
