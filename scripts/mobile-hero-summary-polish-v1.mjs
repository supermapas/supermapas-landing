import fs from 'node:fs';
const target=process.argv[2];
if(!target) throw new Error('Usage: node scripts/mobile-hero-summary-polish-v1.mjs <html-file>');
let html=fs.readFileSync(target,'utf8');

/* Force the mobile hero to four deliberate lines:
   Pare de se perder / em regras. / Domine Língua Portuguesa / de forma visual. */
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
    width:calc(100% - 12px)!important;
    max-width:none!important;
    margin:0 auto!important;
    padding:0!important;
    transform:none!important;
    left:auto!important;right:auto!important;
    font-size:clamp(34px,9vw,42px)!important;
    line-height:.96!important;
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
    transform:none!important;
  }
  .sm-mobile-hero-break{display:inline!important}
  /* Keep the accent and tail as single lines so the whole title is exactly 4 lines. */
  .sm-mh-title-line-accent{
    font-size:.78em!important;
    white-space:nowrap!important;
    letter-spacing:-.04em!important;
  }
  .sm-mh-title-tail{
    font-size:.90em!important;
    line-height:1!important;
    white-space:nowrap!important;
  }

  /* Summary keeps the larger approved mobile scale. */
  .sm-format-v2-summary-visual.sm-format-carousel .sm-format-carousel-frame{
    width:82%!important;
    max-width:430px!important;
    transform:none!important;
  }
  .sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-prev{left:7%!important}
  .sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-next{right:7%!important}

  /* Maps/cards: frame is 92% wide, so its borders are exactly 4% from each side.
     Center each arrow on that border: half inside the image, half outside. */
  .sm-format-v2-map-visual.sm-format-carousel .sm-carousel-prev,
  .sm-format-v2-card-visual.sm-format-carousel .sm-carousel-prev{
    left:4%!important;
    right:auto!important;
    transform:translate(-50%,-50%)!important;
  }
  .sm-format-v2-map-visual.sm-format-carousel .sm-carousel-next,
  .sm-format-v2-card-visual.sm-format-carousel .sm-carousel-next{
    right:4%!important;
    left:auto!important;
    transform:translate(50%,-50%)!important;
  }

  .sm-format-carousel-frame{
    box-shadow:0 12px 24px rgba(51,37,88,.13),0 3px 8px rgba(51,37,88,.07)!important;
  }
}
@media(max-width:430px){
  .sm-mh-title{
    width:calc(100% - 10px)!important;
    font-size:clamp(33px,8.9vw,39px)!important;
  }
  .sm-mh-title-line-accent{font-size:.76em!important}
  .sm-mh-title-tail{font-size:.89em!important}
  .sm-format-v2-summary-visual.sm-format-carousel .sm-format-carousel-frame{width:86%!important}
  .sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-prev{left:5%!important}
  .sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-next{right:5%!important}
}
</style>`;
html=html.replace('</head>',css+'</head>');
fs.writeFileSync(target,html);
console.log('Four-line mobile hero and border-centered map/card arrows applied.');
