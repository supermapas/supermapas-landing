import fs from 'node:fs';

const file = process.argv[2];
if (!file) throw new Error('Usage: node mobile-side-rail-touch-lock-v1.mjs <html>');
let html = fs.readFileSync(file, 'utf8');

const patch = `
<style id="sm-mobile-side-rail-touch-lock-v1">
@media (max-width:640px){
  .sm-section-nav,
  .sm-section-nav-rail,
  .sm-section-nav-stop,
  .sm-section-nav-thumb,
  .sm-section-nav-track,
  .sm-section-nav-progress{
    touch-action:none!important;
    overscroll-behavior:contain!important;
    -webkit-user-select:none!important;
    user-select:none!important;
  }
}
</style>
<script id="sm-mobile-side-rail-touch-lock-v1-js">(()=>{
  const mq=matchMedia('(max-width:640px)');
  const rail=document.querySelector('.sm-section-nav-rail');
  if(!rail)return;
  let touching=false;
  const start=e=>{if(!mq.matches)return;touching=true;if(e.cancelable)e.preventDefault();};
  const move=e=>{if(!mq.matches||!touching)return;if(e.cancelable)e.preventDefault();};
  const end=()=>{touching=false;};
  rail.addEventListener('touchstart',start,{passive:false});
  rail.addEventListener('touchmove',move,{passive:false});
  rail.addEventListener('touchend',end,{passive:true});
  rail.addEventListener('touchcancel',end,{passive:true});
})()</script>`;

if (!html.includes('sm-mobile-side-rail-touch-lock-v1')) {
  html = html.replace('</body>', `${patch}</body>`);
}
fs.writeFileSync(file, html);
