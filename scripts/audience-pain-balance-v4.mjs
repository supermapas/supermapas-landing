import fs from 'node:fs';
const target=process.argv[2];
if(!target) throw new Error('Usage: node scripts/audience-pain-balance-v4.mjs <html-file>');
let html=fs.readFileSync(target,'utf8');

const css=`<style id="sm-audience-pain-balance-v4">
/* Restore deliberate breathing room between role, pain headline and description. */
.sm-pain-audience .sm-pain-copy{padding:20px 22px 20px!important}
.sm-pain-audience .sm-pain-role{margin:0 0 8px!important;font-size:14px!important;line-height:1.08!important}
.sm-pain-audience .sm-pain-copy h3{margin:0 0 10px!important;line-height:1.08!important}
.sm-pain-audience .sm-pain-copy p{margin:0!important}
.sm-pain-audience .sm-pain-chips{padding-top:14px!important}

/* Student card: force the same visual geometry as cards 01 and 02. */
.sm-pain-audience .sm-pain-card:nth-child(3) .sm-pain-visual{
  position:relative!important;
  display:flex!important;
  align-items:flex-end!important;
  justify-content:center!important;
  height:260px!important;
  min-height:260px!important;
  flex-basis:260px!important;
  overflow:hidden!important;
}
.sm-pain-audience .sm-pain-card:nth-child(3) .sm-pain-halo{
  position:absolute!important;
  left:50%!important;
  top:30px!important;
  width:220px!important;
  height:220px!important;
  min-width:220px!important;
  min-height:220px!important;
  border-radius:50%!important;
  transform:translateX(-50%)!important;
  background:var(--soft)!important;
  z-index:0!important;
}
.sm-pain-audience .sm-pain-card:nth-child(3) .sm-pain-visual img{
  position:relative!important;
  inset:auto!important;
  display:block!important;
  width:auto!important;
  height:235px!important;
  max-width:82%!important;
  max-height:235px!important;
  margin:0 auto!important;
  object-fit:contain!important;
  object-position:center bottom!important;
  transform:none!important;
  z-index:2!important;
}

@media(max-width:900px){
  .sm-pain-audience .sm-pain-copy{padding:20px 22px 20px!important}
  .sm-pain-audience .sm-pain-role{margin-bottom:8px!important}
  .sm-pain-audience .sm-pain-copy h3{margin-bottom:10px!important}
  .sm-pain-audience .sm-pain-chips{padding-top:14px!important}
  .sm-pain-audience .sm-pain-card:nth-child(3) .sm-pain-visual{height:280px!important;min-height:280px!important;flex-basis:280px!important}
  .sm-pain-audience .sm-pain-card:nth-child(3) .sm-pain-halo{top:30px!important;width:230px!important;height:230px!important;min-width:230px!important;min-height:230px!important}
  .sm-pain-audience .sm-pain-card:nth-child(3) .sm-pain-visual img{height:255px!important;max-height:255px!important;max-width:70%!important}
}

@media(max-width:640px){
  .sm-pain-audience .sm-pain-copy{padding:18px 18px 18px!important}
  .sm-pain-audience .sm-pain-role{margin-bottom:7px!important;font-size:13px!important}
  .sm-pain-audience .sm-pain-copy h3{margin-bottom:9px!important}
  .sm-pain-audience .sm-pain-chips{padding-top:12px!important}
  .sm-pain-audience .sm-pain-card:nth-child(3) .sm-pain-visual{height:250px!important;min-height:250px!important;flex-basis:250px!important}
  .sm-pain-audience .sm-pain-card:nth-child(3) .sm-pain-halo{top:24px!important;width:205px!important;height:205px!important;min-width:205px!important;min-height:205px!important}
  .sm-pain-audience .sm-pain-card:nth-child(3) .sm-pain-visual img{height:226px!important;max-height:226px!important;max-width:78%!important}
}

@media(max-width:430px){
  .sm-pain-audience .sm-pain-card:nth-child(3) .sm-pain-visual{height:235px!important;min-height:235px!important;flex-basis:235px!important}
  .sm-pain-audience .sm-pain-card:nth-child(3) .sm-pain-halo{top:22px!important;width:195px!important;height:195px!important;min-width:195px!important;min-height:195px!important}
  .sm-pain-audience .sm-pain-card:nth-child(3) .sm-pain-visual img{height:212px!important;max-height:212px!important;max-width:82%!important}
}
</style>`;
html=html.replace('</head>',css+'</head>');
fs.writeFileSync(target,html);
console.log('Audience spacing balanced and student visual normalized.');
