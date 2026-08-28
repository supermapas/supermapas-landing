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

const js = `<script id="sm-cta-offer-routing-v1">(()=>{const scroller=document.querySelector('.sm-sales-scroll');const offer=document.getElementById('oferta');if(!scroller||!offer)return;let navigating=false;let navigationTimer=0;const exactTop=()=>scroller.scrollTop+offer.getBoundingClientRect().top-scroller.getBoundingClientRect().top;const stopProgrammaticScroll=()=>{if(!navigating)return;navigating=false;clearTimeout(navigationTimer);scroller.scrollTo({top:scroller.scrollTop,behavior:'auto'});};['pointerdown','touchstart','wheel'].forEach(type=>scroller.addEventListener(type,stopProgrammaticScroll,{passive:true}));document.addEventListener('click',e=>{const a=e.target.closest?.('a[href="#oferta"]');if(!a)return;e.preventDefault();clearTimeout(navigationTimer);const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;navigating=!reduced;scroller.scrollTo({top:exactTop(),behavior:reduced?'auto':'smooth'});if(navigating)navigationTimer=setTimeout(()=>{navigating=false;},1100);},false);})();</script>`;
html = html.replace('</body>', js + '</body>');

fs.writeFileSync(target, html);
console.log(`Routed ${changed} non-final CTAs to #oferta without delayed forced realignment; user scroll input now cancels any in-progress smooth navigation.`);
