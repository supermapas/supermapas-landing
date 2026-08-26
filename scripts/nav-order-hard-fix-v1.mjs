import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/nav-order-hard-fix-v1.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

// Reorder any static section arrays that contain Início / Conteúdos / Para quem é.
const audienceEntryPatterns = [
  /\['Para quem é\?','publicos'\],?/g,
  /\["Para quem é\?","publicos"\],?/g
];
let audienceEntry = null;
for (const re of audienceEntryPatterns) {
  const m = html.match(re);
  if (m && m[0]) {
    audienceEntry = m[0].replace(/,$/, '');
    html = html.replace(re, '');
    break;
  }
}
if (audienceEntry) {
  const startPatterns = [
    /(\['Início','inicio'\],?)/,
    /(\["Início","inicio"\],?)/,
    /(\['Início','hero'\],?)/,
    /(\["Início","hero"\],?)/
  ];
  for (const re of startPatterns) {
    if (re.test(html)) {
      html = html.replace(re, m => `${m}${m.trim().endsWith(',') ? '' : ','}${audienceEntry},`);
      break;
    }
  }
}

const runtime = `<script id="sm-nav-order-hard-fix-v1">(()=>{
  const norm=s=>(s||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').trim().toLowerCase();
  const targetOf=el=>[
    el.getAttribute?.('href'),el.getAttribute?.('data-target'),el.getAttribute?.('data-section'),el.getAttribute?.('data-anchor'),el.getAttribute?.('aria-controls'),el.getAttribute?.('aria-label'),el.textContent
  ].filter(Boolean).join(' ');
  const isAudience=el=>{const v=norm(targetOf(el));return v.includes('publicos')||v.includes('para quem e');};
  const isStart=el=>{const v=norm(targetOf(el));return v.includes('#inicio')||v==='inicio'||v.includes(' inicio ')||v.includes('hero');};
  const itemOf=el=>el.closest('li,[role="listitem"],button,a,[class*="item"],[class*="step"],[class*="dot"]')||el;
  const reorder=()=>{
    const scopeCandidates=[...document.querySelectorAll('aside,nav,[class*="rail"],[class*="side"],[class*="anchor"],[class*="progress"],[class*="section-nav"]')];
    for(const scope of scopeCandidates){
      const all=[...scope.querySelectorAll('a,button,[data-target],[data-section],[data-anchor],[aria-controls],[aria-label],[role="button"]')];
      const aud=all.find(isAudience), start=all.find(isStart);
      if(!aud||!start) continue;
      const ai=itemOf(aud), si=itemOf(start);
      if(ai===si||!ai.parentElement||ai.parentElement!==si.parentElement) continue;
      if(si.nextElementSibling!==ai) si.insertAdjacentElement('afterend',ai);
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
console.log('Side rail order hard-fixed: Para quem é after Início.');
