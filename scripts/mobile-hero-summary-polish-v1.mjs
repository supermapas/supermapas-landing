import fs from 'node:fs';
const target=process.argv[2];
if(!target) throw new Error('Usage: node scripts/mobile-hero-summary-polish-v1.mjs <html-file>');
let html=fs.readFileSync(target,'utf8');

/* Force a safe mobile line break in the first hero line. */
html=html.replace(
  '<span class="sm-mh-title-line sm-mh-title-line-dark">Pare de se perder em regras.</span>',
  '<span class="sm-mh-title-line sm-mh-title-line-dark">Pare de se perder<span class="sm-mobile-hero-break"><br>em regras.</span></span>'
);

const css=`<style id="sm-mobile-hero-summary-polish-v1">
/* Fixed carousel shadow: independent of the active image alpha/transition. */
.sm-format-carousel-frame{
  filter:none!important;
  background:#fff!important;
  box-shadow:0 14px 28px rgba(51,37,88,.13),0 4px 10px rgba(51,37,88,.07)!important;
}
.sm-format-carousel-slide{filter:none!important;box-shadow:none!important}
.sm-mobile-hero-break{display:inline}
@media(max-width:640px){
  .sm-mobile-hero,.sm-mh-copy{overflow:hidden!important}
  .sm-mh-title{
    width:calc(100% - 36px)!important;
    max-width:520px!important;
    margin:0 auto!important;
    padding:0!important;
    transform:none!important;
    left:auto!important;right:auto!important;
    font-size:clamp(31px,8.1vw,39px)!important;
    line-height:.98!important;
    letter-spacing:-.03em!important;
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
  .sm-mobile-hero-break{display:inline!important}
  .sm-mh-title-line-accent{font-size:.96em!important}
  .sm-mh-title-tail{font-size:.88em!important;line-height:1.02!important}

  /* Summary should have a visual presence comparable to maps/cards on mobile. */
  .sm-format-v2-summary-visual.sm-format-carousel .sm-format-carousel-frame{
    width:82%!important;
    max-width:430px!important;
    transform:none!important;
  }
  /* Keep arrows close to the summary frame, not to the outer card/nav rail. */
  .sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-prev{left:7%!important}
  .sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-next{right:7%!important}

  /* Supercard arrows also sit just outside the material, away from side navigation. */
  .sm-format-v2-card-visual.sm-format-carousel .sm-carousel-prev{left:5%!important}
  .sm-format-v2-card-visual.sm-format-carousel .sm-carousel-next{right:5%!important}

  .sm-format-carousel-frame{
    box-shadow:0 12px 24px rgba(51,37,88,.13),0 3px 8px rgba(51,37,88,.07)!important;
  }
}
@media(max-width:430px){
  .sm-mh-title{
    width:calc(100% - 40px)!important;
    font-size:clamp(29px,7.9vw,34px)!important;
    letter-spacing:-.025em!important;
  }
  .sm-mh-title-line-accent{font-size:.94em!important}
  .sm-mh-title-tail{font-size:.86em!important}
  .sm-format-v2-summary-visual.sm-format-carousel .sm-format-carousel-frame{width:86%!important}
  .sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-prev{left:5%!important}
  .sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-next{right:5%!important}
  .sm-format-v2-card-visual.sm-format-carousel .sm-carousel-prev{left:6%!important}
  .sm-format-v2-card-visual.sm-format-carousel .sm-carousel-next{right:6%!important}
}
</style>`;
html=html.replace('</head>',css+'</head>');
fs.writeFileSync(target,html);
console.log('Mobile hero break, arrow spacing and fixed carousel shadow applied.');
