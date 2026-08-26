import fs from 'node:fs';
const target=process.argv[2];
if(!target) throw new Error('Usage: node scripts/audience-pain-balance-v4.mjs <html-file>');
let html=fs.readFileSync(target,'utf8');

const css=`<style id="sm-audience-pain-balance-v4">
/* Deliberate breathing room across all three cards, without recreating large gaps. */
#publicos.sm-pain-audience .sm-pain-copy{padding:18px 18px 18px!important}
#publicos.sm-pain-audience .sm-pain-role{margin:0 0 8px!important;font-size:14px!important;line-height:1.08!important}
#publicos.sm-pain-audience .sm-audience-pain-title{margin:0 0 10px!important;line-height:1.08!important}
#publicos.sm-pain-audience .sm-pain-copy p{margin:0!important}
#publicos.sm-pain-audience .sm-pain-chips{margin-top:12px!important;padding:0!important}

/* Student card: use the final collision-free class names and mirror cards 01/02. */
#publicos.sm-pain-audience .sm-pain-card:nth-child(3) .sm-pain-visual{
  position:relative!important;
  display:flex!important;
  align-items:flex-end!important;
  justify-content:center!important;
  overflow:hidden!important;
}
#publicos.sm-pain-audience .sm-pain-card:nth-child(3) .sm-audience-orbit{
  position:absolute!important;
  left:50%!important;
  top:20px!important;
  width:188px!important;
  height:188px!important;
  min-width:188px!important;
  min-height:188px!important;
  max-width:188px!important;
  max-height:188px!important;
  aspect-ratio:1/1!important;
  flex:none!important;
  border-radius:999px!important;
  transform:translateX(-50%)!important;
  background:var(--soft)!important;
  z-index:0!important;
}
#publicos.sm-pain-audience .sm-pain-card:nth-child(3) .sm-pain-visual img{
  position:relative!important;
  inset:auto!important;
  display:block!important;
  width:auto!important;
  height:202px!important;
  max-height:202px!important;
  max-width:76%!important;
  margin:0 auto!important;
  object-fit:contain!important;
  object-position:center bottom!important;
  transform:scale(1.38)!important;
  transform-origin:center bottom!important;
  z-index:2!important;
}

@media(min-width:641px){
  #publicos.sm-pain-audience .sm-pain-copy{padding:20px 22px 20px!important}
  #publicos.sm-pain-audience .sm-pain-role{margin-bottom:8px!important}
  #publicos.sm-pain-audience .sm-audience-pain-title{margin-bottom:10px!important}
  #publicos.sm-pain-audience .sm-pain-chips{margin-top:14px!important}
  #publicos.sm-pain-audience .sm-pain-card:nth-child(3) .sm-audience-orbit{top:24px!important;width:200px!important;height:200px!important;min-width:200px!important;min-height:200px!important;max-width:200px!important;max-height:200px!important}
  #publicos.sm-pain-audience .sm-pain-card:nth-child(3) .sm-pain-visual img{height:216px!important;max-height:216px!important;max-width:78%!important;transform:scale(1.30)!important}
}

@media(max-width:430px){
  #publicos.sm-pain-audience .sm-pain-copy{padding:17px 16px 17px!important}
  #publicos.sm-pain-audience .sm-pain-role{margin-bottom:7px!important}
  #publicos.sm-pain-audience .sm-audience-pain-title{margin-bottom:9px!important}
  #publicos.sm-pain-audience .sm-pain-chips{margin-top:11px!important}
  #publicos.sm-pain-audience .sm-pain-card:nth-child(3) .sm-audience-orbit{top:18px!important;width:178px!important;height:178px!important;min-width:178px!important;min-height:178px!important;max-width:178px!important;max-height:178px!important}
  #publicos.sm-pain-audience .sm-pain-card:nth-child(3) .sm-pain-visual img{height:192px!important;max-height:192px!important;max-width:80%!important;transform:scale(1.42)!important}
}
</style>`;
html=html.replace('</head>',css+'</head>');
fs.writeFileSync(target,html);
console.log('Audience spacing balanced and final student visual normalized.');
