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

const js = `<script id="sm-cta-offer-routing-v1">(()=>{const scroller=document.querySelector('.sm-sales-scroll');const offer=document.getElementById('oferta');if(!scroller||!offer)return;const exactTop=()=>scroller.scrollTop+offer.getBoundingClientRect().top-scroller.getBoundingClientRect().top;const align=behavior=>scroller.scrollTo({top:exactTop(),behavior});const settle=()=>{const target=exactTop();if(Math.abs(scroller.scrollTop-target)>1)scroller.scrollTo({top:target,behavior:'auto'});};document.addEventListener('click',e=>{const a=e.target.closest?.('a[href="#oferta"]');if(!a)return;e.preventDefault();const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;align(reduced?'auto':'smooth');if('onscrollend'in scroller)scroller.addEventListener('scrollend',settle,{once:true});else setTimeout(settle,900);setTimeout(settle,1200);},false);})();</script>`;
html = html.replace('</body>', js + '</body>');

fs.writeFileSync(target, html);
console.log(`Routed ${changed} non-final CTAs to #oferta with exact section alignment; final offer CTA remains checkout-only.`);
