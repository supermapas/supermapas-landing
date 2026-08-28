import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/cta-offer-routing-v1.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

let changed = 0;
html = html.replace(/<a\b[^>]*href=["']https:\/\/pay\.hotmart\.com\/A92093667Q[^"']*["'][^>]*>/g, tag => {
  if (/class=["'][^"']*sm-offer-value-cta[^"']*["']/.test(tag)) return tag;
  changed += 1;
  return tag.replace(/href=["']https:\/\/pay\.hotmart\.com\/A92093667Q[^"']*["']/, 'href="#oferta"');
});

if (!changed) throw new Error('No non-final Hotmart CTAs found to route to #oferta.');

const js = `<script id="sm-cta-offer-routing-v1">(()=>{const scroller=document.querySelector('.sm-sales-scroll');const offer=document.getElementById('oferta');if(!scroller||!offer)return;let navigating=false;let interrupted=false;let fallbackTimer=0;let settleTimer=0;let scrollEndHandler=null;const offset=()=>offer.getBoundingClientRect().top-scroller.getBoundingClientRect().top;const exactTop=()=>scroller.scrollTop+offset();const clearNavigation=()=>{navigating=false;clearTimeout(fallbackTimer);clearTimeout(settleTimer);fallbackTimer=settleTimer=0;if(scrollEndHandler){scroller.removeEventListener('scrollend',scrollEndHandler);scrollEndHandler=null;}};const cancelNavigation=()=>{if(!navigating)return;interrupted=true;clearNavigation();scroller.scrollTo({top:scroller.scrollTop,behavior:'auto'});};['pointerdown','touchstart','wheel'].forEach(type=>scroller.addEventListener(type,cancelNavigation,{passive:true}));const stabilize=()=>{if(!navigating||interrupted)return;clearTimeout(fallbackTimer);if(scrollEndHandler){scroller.removeEventListener('scrollend',scrollEndHandler);scrollEndHandler=null;}const until=performance.now()+700;const step=()=>{if(!navigating||interrupted)return;const delta=offset();if(Math.abs(delta)>1.25)scroller.scrollTo({top:scroller.scrollTop+delta,behavior:'auto'});if(performance.now()>=until){clearNavigation();return;}settleTimer=setTimeout(step,55);};step();};document.addEventListener('click',e=>{const a=e.target.closest?.('a[href="#oferta"]');if(!a)return;e.preventDefault();clearNavigation();interrupted=false;navigating=true;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduced){scroller.scrollTo({top:exactTop(),behavior:'auto'});requestAnimationFrame(stabilize);return;}if('onscrollend'in scroller){scrollEndHandler=()=>stabilize();scroller.addEventListener('scrollend',scrollEndHandler,{once:true});}fallbackTimer=setTimeout(stabilize,1250);scroller.scrollTo({top:exactTop(),behavior:'smooth'});},false);})();</script>`;
html = html.replace('</body>', js + '</body>');

fs.writeFileSync(target, html);
console.log(`Routed ${changed} non-final CTAs to #oferta with layout-shift-aware final alignment; any user scroll input cancels the alignment immediately.`);
