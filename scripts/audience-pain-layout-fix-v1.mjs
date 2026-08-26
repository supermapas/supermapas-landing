import fs from 'node:fs';
const target=process.argv[2];
if(!target) throw new Error('Usage: node scripts/audience-pain-layout-fix-v1.mjs <html-file>');
let html=fs.readFileSync(target,'utf8');

/* Keep the third illustration eager/reliable in this near-fold section. */
html=html.replace('alt="Ilustração representando estudantes" loading="lazy"','alt="Ilustração representando estudantes" loading="eager" fetchpriority="low"');

const css=`<style id="sm-audience-pain-layout-fix-v1">
/* Hard isolation from legacy/global typography and card styles. */
.sm-pain-audience .sm-pain-card,
.sm-pain-audience .sm-pain-visual,
.sm-pain-audience .sm-pain-copy,
.sm-pain-audience .sm-pain-role,
.sm-pain-audience .sm-pain-copy h3,
.sm-pain-audience .sm-pain-copy p,
.sm-pain-audience .sm-pain-chips,
.sm-pain-audience .sm-pain-chips span{box-sizing:border-box!important}

.sm-pain-audience .sm-pain-cards{
  display:grid!important;
  grid-template-columns:repeat(3,minmax(0,1fr))!important;
  gap:20px!important;
  align-items:stretch!important;
}
.sm-pain-audience .sm-pain-card,
.sm-pain-audience .sm-pain-card:nth-child(2){
  position:relative!important;
  display:flex!important;
  flex-direction:column!important;
  min-width:0!important;
  min-height:590px!important;
  transform:none!important;
  overflow:hidden!important;
  isolation:isolate!important;
}
.sm-pain-audience .sm-pain-visual{
  position:relative!important;
  flex:0 0 260px!important;
  width:100%!important;
  height:260px!important;
  min-height:260px!important;
  display:flex!important;
  align-items:flex-end!important;
  justify-content:center!important;
  overflow:hidden!important;
  z-index:1!important;
}
.sm-pain-audience .sm-pain-halo{z-index:0!important;pointer-events:none!important}
.sm-pain-audience .sm-pain-visual img{
  position:relative!important;
  z-index:2!important;
  display:block!important;
  width:auto!important;
  height:235px!important;
  max-width:82%!important;
  max-height:235px!important;
  margin:0 auto!important;
  object-fit:contain!important;
  object-position:center bottom!important;
  transform:none!important;
  opacity:1!important;
  visibility:visible!important;
  background:transparent!important;
  border:0!important;
  box-shadow:none!important;
}
.sm-pain-audience .sm-pain-number{z-index:4!important}
.sm-pain-audience .sm-pain-copy{
  position:relative!important;
  z-index:3!important;
  display:flex!important;
  flex:1 1 auto!important;
  flex-direction:column!important;
  width:100%!important;
  min-width:0!important;
  padding:24px 24px 22px!important;
  background:#fff!important;
  overflow:visible!important;
}
.sm-pain-audience .sm-pain-role{
  position:static!important;
  display:block!important;
  width:auto!important;
  height:auto!important;
  margin:0 0 10px!important;
  padding:0!important;
  background:none!important;
  border:0!important;
  border-radius:0!important;
  color:var(--accent)!important;
  font-size:11px!important;
  line-height:1.2!important;
  font-weight:900!important;
  letter-spacing:.13em!important;
  box-shadow:none!important;
  transform:none!important;
}
.sm-pain-audience .sm-pain-copy h3{
  position:static!important;
  display:block!important;
  width:auto!important;
  max-width:none!important;
  height:auto!important;
  min-height:0!important;
  margin:0 0 12px!important;
  padding:0!important;
  overflow:visible!important;
  background:none!important;
  background-image:none!important;
  border:0!important;
  border-radius:0!important;
  box-shadow:none!important;
  color:#211d29!important;
  font-size:23px!important;
  line-height:1.08!important;
  letter-spacing:-.035em!important;
  font-weight:850!important;
  text-align:left!important;
  text-decoration:none!important;
  transform:none!important;
  white-space:normal!important;
}
.sm-pain-audience .sm-pain-copy h3::before,
.sm-pain-audience .sm-pain-copy h3::after{content:none!important;display:none!important}
.sm-pain-audience .sm-pain-copy p{
  position:static!important;
  display:block!important;
  margin:0!important;
  padding:0!important;
  background:none!important;
  border:0!important;
  color:#68616f!important;
  font-size:15px!important;
  line-height:1.48!important;
  text-align:left!important;
  transform:none!important;
}
.sm-pain-audience .sm-pain-chips{
  position:static!important;
  display:flex!important;
  flex-wrap:wrap!important;
  gap:7px!important;
  margin:auto 0 0!important;
  padding:20px 0 0!important;
  background:none!important;
  transform:none!important;
}
.sm-pain-audience .sm-pain-chips span{
  position:static!important;
  display:inline-flex!important;
  width:auto!important;
  height:auto!important;
  min-height:0!important;
  margin:0!important;
  padding:8px 10px!important;
  background:var(--soft)!important;
  border:0!important;
  border-radius:999px!important;
  color:var(--accent)!important;
  font-size:10px!important;
  line-height:1.15!important;
  font-weight:900!important;
  letter-spacing:.05em!important;
  box-shadow:none!important;
  transform:none!important;
  white-space:normal!important;
}

@media(max-width:900px){
  .sm-pain-audience .sm-pain-cards{grid-template-columns:1fr!important;gap:16px!important}
  .sm-pain-audience .sm-pain-card,
  .sm-pain-audience .sm-pain-card:nth-child(2){
    display:flex!important;
    flex-direction:column!important;
    min-height:0!important;
  }
  .sm-pain-audience .sm-pain-visual{
    flex-basis:280px!important;
    height:280px!important;
    min-height:280px!important;
  }
  .sm-pain-audience .sm-pain-visual img{height:255px!important;max-height:255px!important;max-width:70%!important}
  .sm-pain-audience .sm-pain-copy{padding:24px 24px 22px!important}
}

@media(max-width:640px){
  .sm-pain-audience .sm-pain-cards{gap:14px!important}
  .sm-pain-audience .sm-pain-card{border-radius:22px!important}
  .sm-pain-audience .sm-pain-visual{
    flex-basis:250px!important;
    height:250px!important;
    min-height:250px!important;
  }
  .sm-pain-audience .sm-pain-visual img{
    height:226px!important;
    max-height:226px!important;
    max-width:78%!important;
    transform:none!important;
  }
  .sm-pain-audience .sm-pain-copy{padding:20px 18px 18px!important}
  .sm-pain-audience .sm-pain-role{font-size:10px!important;margin-bottom:8px!important}
  .sm-pain-audience .sm-pain-copy h3{font-size:21px!important;line-height:1.08!important;margin-bottom:10px!important}
  .sm-pain-audience .sm-pain-copy p{font-size:14px!important;line-height:1.42!important}
  .sm-pain-audience .sm-pain-chips{padding-top:15px!important;gap:6px!important}
  .sm-pain-audience .sm-pain-chips span{padding:7px 8px!important;font-size:9px!important}
}

@media(max-width:430px){
  .sm-pain-audience .sm-pain-visual{flex-basis:235px!important;height:235px!important;min-height:235px!important}
  .sm-pain-audience .sm-pain-visual img{height:212px!important;max-height:212px!important;max-width:82%!important}
  .sm-pain-audience .sm-pain-copy h3{font-size:20px!important}
}
</style>`;
html=html.replace('</head>',css+'</head>');
fs.writeFileSync(target,html);
console.log('Audience pain layout isolated and fixed on desktop/mobile.');
