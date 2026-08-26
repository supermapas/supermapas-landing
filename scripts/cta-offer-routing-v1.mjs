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

const js = `<script id="sm-cta-offer-routing-v1">(()=>{const scroller=document.querySelector('.sm-sales-scroll');document.addEventListener('click',e=>{const a=e.target.closest?.('a[href="#oferta"]');if(!a)return;const offer=document.getElementById('oferta');if(!offer)return;e.preventDefault();offer.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});},false);})();</script>`;
html = html.replace('</body>', js + '</body>');

fs.writeFileSync(target, html);
console.log(`Routed ${changed} non-final CTAs to #oferta; final offer CTA remains checkout-only.`);
