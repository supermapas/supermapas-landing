import fs from 'node:fs';
const target=process.argv[2];
if(!target) throw new Error('Usage: node scripts/mobile-hero-summary-polish-v1.mjs <html-file>');
let html=fs.readFileSync(target,'utf8');
const css=`<style id="sm-mobile-hero-summary-polish-v1">
/* Fixed carousel shadow: independent of the active image alpha/transition. */
.sm-format-carousel-frame{
  filter:none!important;
  background:#fff!important;
  box-shadow:0 14px 28px rgba(51,37,88,.13),0 4px 10px rgba(51,37,88,.07)!important;
}
.sm-format-carousel-slide{filter:none!important;box-shadow:none!important}
@media(max-width:640px){
  .sm-mobile-hero,.sm-mh-copy{overflow:hidden!important}
  .sm-mh-title{
    width:calc(100% - 24px)!important;
    max-width:560px!important;
    margin:0 auto!important;
    padding:0!important;
    transform:none!important;
    left:auto!important;right:auto!important;
    font-size:clamp(32px,8.7vw,42px)!important;
    line-height:.98!important;
    letter-spacing:-.035em!important;
    text-align:center!important;
    overflow:visible!important;
    overflow-wrap:normal!important;
    word-break:normal!important;
  }
  .sm-mh-title-line{
    display:block!important;
    width:100%!important;
    max-width:100%!important;
    margin-left:auto!important;
    margin-right:auto!important;
    white-space:normal!important;
    text-wrap:balance!important;
    transform:none!important;
  }
  .sm-mh-title-line-accent{font-size:.96em!important}
  .sm-mh-title-tail{font-size:.88em!important;line-height:1.02!important}

  /* Summary should have a visual presence comparable to maps/cards on mobile. */
  .sm-format-v2-summary-visual.sm-format-carousel .sm-format-carousel-frame{
    width:82%!important;
    max-width:430px!important;
    transform:none!important;
  }
  .sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-prev{left:3%!important}
  .sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-next{right:3%!important}

  .sm-format-carousel-frame{
    box-shadow:0 12px 24px rgba(51,37,88,.13),0 3px 8px rgba(51,37,88,.07)!important;
  }
}
@media(max-width:430px){
  .sm-mh-title{
    width:calc(100% - 30px)!important;
    font-size:clamp(30px,8.4vw,36px)!important;
    letter-spacing:-.03em!important;
  }
  .sm-mh-title-line-accent{font-size:.94em!important}
  .sm-mh-title-tail{font-size:.86em!important}
  .sm-format-v2-summary-visual.sm-format-carousel .sm-format-carousel-frame{width:86%!important}
  .sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-prev{left:1%!important}
  .sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-next{right:1%!important}
}
</style>`;
html=html.replace('</head>',css+'</head>');
fs.writeFileSync(target,html);
console.log('Mobile hero, summary scale and fixed carousel shadow applied.');
