import fs from 'node:fs';
const target=process.argv[2];
if(!target) throw new Error('Usage: node scripts/audience-pain-compact-v2.mjs <html-file>');
let html=fs.readFileSync(target,'utf8');

const css=`<style id="sm-audience-pain-compact-v2">
/* Compact copy hierarchy across all three audience cards. */
.sm-pain-audience .sm-pain-card{min-height:548px!important}
.sm-pain-audience .sm-pain-copy{padding:18px 22px 18px!important}
.sm-pain-audience .sm-pain-role{
  margin:0 0 4px!important;
  font-size:14px!important;
  line-height:1.05!important;
  letter-spacing:.10em!important;
  font-weight:950!important;
}
.sm-pain-audience .sm-pain-copy h3{
  margin:0 0 7px!important;
  font-size:22px!important;
  line-height:1.06!important;
}
.sm-pain-audience .sm-pain-copy p{
  margin:0!important;
  font-size:14px!important;
  line-height:1.40!important;
}
.sm-pain-audience .sm-pain-chips{
  margin-top:auto!important;
  padding-top:12px!important;
  gap:6px!important;
}

/* Normalize every visual ornament explicitly, including card 03. */
.sm-pain-audience .sm-pain-halo{
  position:absolute!important;
  left:50%!important;
  top:28px!important;
  width:220px!important;
  height:220px!important;
  min-width:220px!important;
  min-height:220px!important;
  border-radius:50%!important;
  transform:translateX(-50%)!important;
  background:var(--soft)!important;
  z-index:0!important;
}
.sm-pain-audience .sm-pain-number{
  position:absolute!important;
  left:20px!important;
  top:18px!important;
  width:42px!important;
  height:42px!important;
  min-width:42px!important;
  min-height:42px!important;
  padding:0!important;
  margin:0!important;
  display:grid!important;
  place-items:center!important;
  border-radius:13px!important;
  background:var(--accent)!important;
  color:#fff!important;
  font-size:12px!important;
  line-height:1!important;
  font-weight:900!important;
  transform:none!important;
  z-index:5!important;
}
.sm-pain-audience .sm-pain-card--teal .sm-pain-visual{
  align-items:flex-end!important;
  justify-content:center!important;
}
.sm-pain-audience .sm-pain-card--teal .sm-pain-visual img{
  position:relative!important;
  left:auto!important;
  right:auto!important;
  top:auto!important;
  bottom:auto!important;
  margin:0 auto!important;
  height:235px!important;
  max-height:235px!important;
  max-width:82%!important;
  object-fit:contain!important;
  object-position:center bottom!important;
  transform:none!important;
  z-index:2!important;
}

@media(max-width:900px){
  .sm-pain-audience .sm-pain-card{min-height:0!important}
  .sm-pain-audience .sm-pain-copy{padding:18px 22px 18px!important}
  .sm-pain-audience .sm-pain-role{font-size:14px!important;margin-bottom:4px!important}
  .sm-pain-audience .sm-pain-copy h3{font-size:22px!important;margin-bottom:7px!important}
  .sm-pain-audience .sm-pain-chips{padding-top:12px!important}
  .sm-pain-audience .sm-pain-card--teal .sm-pain-visual img{height:255px!important;max-height:255px!important;max-width:70%!important}
}

@media(max-width:640px){
  .sm-pain-audience .sm-pain-copy{padding:15px 17px 16px!important}
  .sm-pain-audience .sm-pain-role{font-size:13px!important;margin-bottom:3px!important;letter-spacing:.08em!important}
  .sm-pain-audience .sm-pain-copy h3{font-size:20px!important;margin-bottom:6px!important}
  .sm-pain-audience .sm-pain-copy p{font-size:13.5px!important;line-height:1.38!important}
  .sm-pain-audience .sm-pain-chips{padding-top:10px!important}
  .sm-pain-audience .sm-pain-number{left:12px!important;top:12px!important;width:34px!important;height:34px!important;min-width:34px!important;min-height:34px!important;border-radius:10px!important;font-size:10px!important}
  .sm-pain-audience .sm-pain-halo{top:24px!important;width:205px!important;height:205px!important;min-width:205px!important;min-height:205px!important}
  .sm-pain-audience .sm-pain-card--teal .sm-pain-visual img{height:226px!important;max-height:226px!important;max-width:78%!important}
}

@media(max-width:430px){
  .sm-pain-audience .sm-pain-role{font-size:12.5px!important}
  .sm-pain-audience .sm-pain-copy h3{font-size:19px!important}
  .sm-pain-audience .sm-pain-card--teal .sm-pain-visual img{height:212px!important;max-height:212px!important;max-width:82%!important}
}
</style>`;
html=html.replace('</head>',css+'</head>');
fs.writeFileSync(target,html);
console.log('Audience cards compacted and student visual normalized.');
