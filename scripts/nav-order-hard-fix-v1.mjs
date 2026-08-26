import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/nav-order-hard-fix-v1.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

// Keep the static side-rail source in the same order as the actual page:
// Início -> Para quem é? -> Como o visual ajuda -> remaining sections.
function takeEntryById(id) {
  const patterns = [
    new RegExp(`\\['([^']+)','${id}'\\],?`, 'g'),
    new RegExp(`\\[\"([^\"]+)\",\"${id}\"\\],?`, 'g')
  ];
  for (const re of patterns) {
    const m = re.exec(html);
    if (m && m[0]) {
      const entry = m[0].replace(/,$/, '');
      html = html.replace(re, '');
      return entry;
    }
  }
  return null;
}

const audienceEntry = takeEntryById('publicos');
const visualEntry = takeEntryById('estudo-visual');

const startPatterns = [
  /(\['Início','inicio'\],?)/,
  /(\["Início","inicio"\],?)/,
  /(\['Início','hero'\],?)/,
  /(\["Início","hero"\],?)/
];

if (audienceEntry || visualEntry) {
  for (const re of startPatterns) {
    if (!re.test(html)) continue;
    html = html.replace(re, m => {
      const entries = [audienceEntry, visualEntry].filter(Boolean).join(',');
      return `${m}${m.trim().endsWith(',') ? '' : ','}${entries ? entries + ',' : ''}`;
    });
    break;
  }
}

const runtime = `<script id="sm-nav-order-hard-fix-v1">(()=>{
  const norm=s=>(s||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').trim().toLowerCase();
  const targetOf=el=>[
    el.getAttribute?.('href'),el.getAttribute?.('data-target'),el.getAttribute?.('data-section'),el.getAttribute?.('data-anchor'),el.getAttribute?.('aria-controls'),el.getAttribute?.('aria-label'),el.textContent
  ].filter(Boolean).join(' ');
  const isAudience=el=>{const v=norm(targetOf(el));return v.includes('publicos')||v.includes('para quem e');};
  const isVisual=el=>{const v=norm(targetOf(el));return v.includes('estudo-visual')||v.includes('como o visual ajuda')||v.includes('visual ajuda')||v.includes('diferenca na pratica');};
  const isStart=el=>{const v=norm(targetOf(el));return v.includes('#inicio')||v==='inicio'||v.includes(' inicio ')||v.includes('hero');};
  const itemOf=el=>el.closest('li,[role="listitem"],button,a,[class*="item"],[class*="step"],[class*="dot"]')||el;
  const reorder=()=>{
    const scopeCandidates=[...document.querySelectorAll('aside,nav,[class*="rail"],[class*="side"],[class*="anchor"],[class*="progress"],[class*="section-nav"]')];
    for(const scope of scopeCandidates){
      const all=[...scope.querySelectorAll('a,button,[data-target],[data-section],[data-anchor],[aria-controls],[aria-label],[role="button"]')];
      const aud=all.find(isAudience), visual=all.find(isVisual), start=all.find(isStart);
      if(!start) continue;
      const si=itemOf(start);
      let anchor=si;
      if(aud){
        const ai=itemOf(aud);
        if(ai!==si&&ai.parentElement&&ai.parentElement===si.parentElement){
          if(si.nextElementSibling!==ai) si.insertAdjacentElement('afterend',ai);
          anchor=ai;
        }
      }
      if(visual){
        const vi=itemOf(visual);
        if(vi!==anchor&&vi.parentElement&&anchor.parentElement&&vi.parentElement===anchor.parentElement){
          if(anchor.nextElementSibling!==vi) anchor.insertAdjacentElement('afterend',vi);
        }
      }
    }
  };
  let raf=0;
  const schedule=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(reorder);};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',schedule,{once:true}); else schedule();
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(reorder,250);setTimeout(reorder,1000);setTimeout(reorder,2500);
})();</script>`;

html = html.replace('</body>', runtime + '</body>');
fs.writeFileSync(target, html);
console.log('Side rail order hard-fixed: Início -> Para quem é -> Como o visual ajuda.');
