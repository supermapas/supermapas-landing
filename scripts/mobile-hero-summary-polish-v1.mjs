import fs from 'node:fs';
const target=process.argv[2];
if(!target) throw new Error('Usage: node scripts/mobile-hero-summary-polish-v1.mjs <html-file>');
let html=fs.readFileSync(target,'utf8');
const css=`<style id="sm-mobile-hero-summary-polish-v1">
@media(max-width:640px){
  .sm-mh-title{font-size:clamp(42px,11vw,58px)!important;line-height:.98!important;letter-spacing:-.035em!important;text-align:center!important;max-width:100%!important;margin-left:auto!important;margin-right:auto!important;overflow-wrap:anywhere!important;word-break:normal!important}
  .sm-mh-title-line{display:block!important;max-width:100%!important;white-space:normal!important;text-wrap:balance!important}
  .sm-mh-title-tail{font-size:.92em!important;line-height:1!important}
  .sm-format-v2-summary-visual.sm-format-carousel .sm-format-carousel-frame{width:64%!important}
  .sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-prev{left:14%!important}
  .sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-next{right:14%!important}
}
@media(max-width:430px){
  .sm-mh-title{font-size:clamp(40px,10.8vw,52px)!important}
  .sm-format-v2-summary-visual.sm-format-carousel .sm-format-carousel-frame{width:68%!important}
  .sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-prev{left:11%!important}
  .sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-next{right:11%!important}
}
</style>`;
html=html.replace('</head>',css+'</head>');
fs.writeFileSync(target,html);
console.log('Mobile hero and summary polish applied.');
