import fs from 'node:fs';
const target=process.argv[2];
if(!target) throw new Error('Usage: node scripts/audience-nav-mobile-polish-v1.mjs <html-file>');
let html=fs.readFileSync(target,'utf8');

const css=`<style id="sm-audience-nav-mobile-polish-v1">
@media(max-width:640px){
  /* Give the transition block a clear hierarchy on mobile. */
  #publicos.sm-pain-audience .sm-pain-turn{
    display:block!important;
    margin:24px 0 12px!important;
    padding:20px 18px 19px!important;
    border-radius:22px!important;
    background:linear-gradient(145deg,#2a203d 0%,#49317c 52%,#6b4de6 100%)!important;
    box-shadow:0 16px 34px rgba(68,48,112,.18)!important;
    overflow:hidden!important;
  }
  #publicos.sm-pain-audience .sm-pain-turn:before{
    content:"";position:absolute;right:-38px;top:-48px;width:145px;height:145px;border-radius:50%;
    background:rgba(255,255,255,.08);pointer-events:none;
  }
  #publicos.sm-pain-audience .sm-pain-turn-mark{display:none!important}
  #publicos.sm-pain-audience .sm-pain-turn small{
    display:inline-flex!important;align-items:center!important;justify-content:center!important;
    margin:0 0 10px!important;padding:7px 10px!important;border-radius:999px!important;
    background:rgba(255,255,255,.13)!important;color:#fff!important;
    font-size:9px!important;line-height:1!important;font-weight:950!important;letter-spacing:.18em!important;
  }
  #publicos.sm-pain-audience .sm-pain-turn h3{
    margin:0!important;font-size:22px!important;line-height:1.08!important;letter-spacing:-.035em!important;color:#fff!important;
  }
  #publicos.sm-pain-audience .sm-pain-turn h3 span{display:block!important;margin-top:5px!important;color:#ded4ff!important;font-weight:750!important}

  #publicos.sm-pain-audience .sm-pain-transform{display:grid!important;grid-template-columns:1fr!important;gap:8px!important;margin-top:0!important}
  #publicos.sm-pain-audience .sm-pain-transform>div{
    position:relative!important;display:grid!important;grid-template-columns:minmax(0,1fr) 28px minmax(0,1fr)!important;
    gap:7px!important;align-items:stretch!important;min-height:0!important;padding:9px!important;
    border:1px solid rgba(104,76,213,.12)!important;border-radius:17px!important;background:#fff!important;
    box-shadow:0 8px 22px rgba(55,41,82,.055)!important;
  }
  #publicos.sm-pain-audience .sm-pain-transform span{
    position:relative!important;min-height:58px!important;padding:20px 8px 8px!important;border-radius:12px!important;
    font-size:10px!important;line-height:1.16!important;font-weight:900!important;letter-spacing:.025em!important;
  }
  #publicos.sm-pain-audience .sm-pain-before{background:#f5f3f7!important;color:#68616f!important}
  #publicos.sm-pain-audience .sm-pain-after{background:linear-gradient(135deg,#f0ebff,#f7f4ff)!important;color:#6045ce!important}
  #publicos.sm-pain-audience .sm-pain-before:before,
  #publicos.sm-pain-audience .sm-pain-after:before{
    position:absolute;left:8px;top:6px;font-size:7.5px;line-height:1;font-weight:950;letter-spacing:.13em;
  }
  #publicos.sm-pain-audience .sm-pain-before:before{content:"ANTES";color:#9a939f}
  #publicos.sm-pain-audience .sm-pain-after:before{content:"COM SUPERMAPAS";color:#7458dc}
  #publicos.sm-pain-audience .sm-pain-transform b{
    display:grid!important;place-items:center!important;align-self:center!important;width:28px!important;height:28px!important;
    border-radius:50%!important;background:#6b4de6!important;color:#fff!important;font-size:14px!important;box-shadow:0 5px 12px rgba(107,77,230,.2)!important;
  }
  #publicos.sm-pain-audience .sm-pain-close{
    position:relative!important;max-width:none!important;margin:12px 0 0!important;padding:15px 16px 15px 42px!important;
    border:1px solid rgba(107,77,230,.14)!important;border-radius:17px!important;background:#f6f2ff!important;
    color:#3f3749!important;text-align:left!important;font-size:14px!important;line-height:1.38!important;font-weight:750!important;
  }
  #publicos.sm-pain-audience .sm-pain-close:before{
    content:"✓";position:absolute;left:14px;top:50%;transform:translateY(-50%);display:grid;place-items:center;
    width:20px;height:20px;border-radius:50%;background:#6b4de6;color:#fff;font-size:11px;font-weight:950;
  }
  #publicos.sm-pain-audience .sm-pain-close span{color:inherit!important}
}
</style>`;

const script=`<script id="sm-audience-nav-order-v1">(()=>{const reorder=()=>{const audience=[...document.querySelectorAll('a[href="#publicos"]')];for(const a of audience){const container=a.closest('nav,aside,[class*="nav"],[class*="menu"],[class*="rail"]');if(!container)continue;const links=[...container.querySelectorAll('a[href^="#"]')];const start=links.find(x=>/^#inicio(?:-|$)/.test(x.getAttribute('href')||'')||/^início$/i.test((x.textContent||'').trim()));if(start&&start.nextElementSibling!==a)start.insertAdjacentElement('afterend',a);}};document.readyState==='loading'?document.addEventListener('DOMContentLoaded',reorder,{once:true}):reorder();})();</script>`;

html=html.replace('</head>',css+'</head>').replace('</body>',script+'</body>');
fs.writeFileSync(target,html);
console.log('Audience mobile transition polished and side navigation reordered.');
