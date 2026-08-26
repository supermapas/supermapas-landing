import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/audience-visual-transition-polish-v1.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

if (!html.includes('id="publicos"') || !html.includes('id="estudo-visual"')) {
  throw new Error('Audience or visual study section not found.');
}

html = html.replace(
  '<h2 id="sm-visual-study-title">A mesma matéria. <span>Uma forma muito mais visual de entender.</span></h2>',
  '<h2 id="sm-visual-study-title"><span class="sm-vc-title-line sm-vc-title-line-1">A mesma matéria.</span> <span class="sm-vc-title-line sm-vc-title-line-2">Uma forma muito mais</span> <span class="sm-vc-title-line sm-vc-title-line-3">visual de entender.</span></h2>'
);

const css = `<style id="sm-audience-visual-transition-polish-v1">
/* Tighten the transition between audience pain and visual proof without offsets. */
#publicos.sm-pain-audience{padding-bottom:28px!important}
#publicos.sm-pain-audience .sm-pain-close{
  width:100%!important;
  max-width:1120px!important;
  margin:20px auto 0!important;
  white-space:nowrap!important;
  font-size:17px!important;
  line-height:1.4!important;
}

.sm-visual-study.sm-visual-compare-v3{padding-top:30px!important}
.sm-visual-compare-v3 .sm-vc-intro{
  max-width:1120px!important;
  margin-left:auto!important;
  margin-right:auto!important;
  text-align:center!important;
}

/* Match the audience eyebrow architecture exactly. */
.sm-visual-compare-v3 .sm-vc-eyebrow{
  display:inline-flex!important;
  align-items:center!important;
  justify-content:center!important;
  width:min(760px,86%)!important;
  min-height:54px!important;
  margin:0 0 18px!important;
  padding:10px 28px!important;
  box-sizing:border-box!important;
  border:1.5px solid rgba(112,86,217,.20)!important;
  border-radius:999px!important;
  background:#f3efff!important;
  color:#7056d9!important;
  font-size:14px!important;
  line-height:1!important;
  font-weight:900!important;
  letter-spacing:.18em!important;
}

.sm-visual-compare-v3 .sm-vc-intro h2{
  max-width:1080px!important;
  margin:0 auto 16px!important;
  font-size:clamp(48px,5.4vw,78px)!important;
  line-height:.95!important;
  letter-spacing:-.048em!important;
  font-weight:900!important;
}
.sm-visual-compare-v3 .sm-vc-title-line{display:inline!important}
.sm-visual-compare-v3 .sm-vc-title-line-1{color:#211c2b!important}
.sm-visual-compare-v3 .sm-vc-title-line-2,
.sm-visual-compare-v3 .sm-vc-title-line-3{color:#7056d9!important}
.sm-visual-compare-v3 .sm-vc-intro p{
  margin:0 auto!important;
  font-size:17px!important;
  line-height:1.45!important;
}

@media(max-width:900px){
  #publicos.sm-pain-audience .sm-pain-close{
    max-width:760px!important;
    white-space:normal!important;
  }
}

@media(max-width:640px){
  #publicos.sm-pain-audience{padding-bottom:20px!important}
  #publicos.sm-pain-audience .sm-pain-close{
    margin-top:14px!important;
    font-size:14px!important;
    line-height:1.38!important;
    white-space:normal!important;
  }
  .sm-visual-study.sm-visual-compare-v3{padding-top:22px!important}
  .sm-visual-compare-v3 .sm-vc-eyebrow{
    width:88%!important;
    min-height:46px!important;
    margin-bottom:14px!important;
    padding:9px 18px!important;
    font-size:11.5px!important;
    letter-spacing:.15em!important;
  }
  .sm-visual-compare-v3 .sm-vc-intro h2{
    width:100%!important;
    max-width:none!important;
    margin-bottom:12px!important;
    font-size:clamp(34px,9.3vw,44px)!important;
    line-height:.96!important;
    letter-spacing:-.05em!important;
  }
  .sm-visual-compare-v3 .sm-vc-title-line{
    display:block!important;
    width:100%!important;
    white-space:nowrap!important;
  }
  .sm-visual-compare-v3 .sm-vc-intro p{font-size:15px!important}
}

@media(max-width:430px){
  .sm-visual-compare-v3 .sm-vc-eyebrow{
    width:92%!important;
    min-height:44px!important;
    font-size:11px!important;
  }
  .sm-visual-compare-v3 .sm-vc-intro h2{font-size:clamp(32px,9vw,40px)!important}
}
</style>`;

html = html.replace('</head>', css + '</head>');
fs.writeFileSync(target, html);
console.log('Audience-to-visual transition tightened and visual intro hierarchy strengthened.');
