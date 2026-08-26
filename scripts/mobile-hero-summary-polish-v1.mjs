import fs from 'node:fs';
const target=process.argv[2];
if(!target) throw new Error('Usage: node scripts/mobile-hero-summary-polish-v1.mjs <html-file>');
let html=fs.readFileSync(target,'utf8');

html=html.replace(
  '<span class="sm-mh-title-line sm-mh-title-line-dark">Pare de se perder em regras.</span>',
  '<span class="sm-mh-title-line sm-mh-title-line-dark"><span class="sm-mh-first-line">Pare de se perder</span><span class="sm-mobile-hero-break"><br><span class="sm-mh-second-line">em regras.</span></span></span>'
);
html=html.replaceAll('oferta atual + 2 bônus','OFERTA ESPECIAL + 2 BÔNUS');

const css=`<style id="sm-mobile-hero-summary-polish-v1">
.sm-format-carousel-frame{filter:none!important;background:#fff!important;box-shadow:0 14px 28px rgba(51,37,88,.13),0 4px 10px rgba(51,37,88,.07)!important}
.sm-format-carousel-slide{filter:none!important;box-shadow:none!important}
.sm-mobile-hero-break{display:inline}

/* Balanced offer badge: shorter, narrower, and equal typography on both sides. */
.sm-hero-offer-badge-v3{
  width:min(76vw,520px)!important;
  max-width:100%!important;
  min-height:52px!important;
  margin-left:auto!important;
  margin-right:auto!important;
  padding:5px 7px!important;
  display:flex!important;
  align-items:center!important;
  justify-content:space-between!important;
  gap:8px!important;
  box-sizing:border-box!important;
  text-transform:uppercase!important;
}
.sm-hero-offer-badge-v3 strong,
.sm-hero-offer-badge-v3 span{
  font-size:15px!important;
  line-height:1!important;
  font-weight:800!important;
  letter-spacing:.01em!important;
  text-transform:uppercase!important;
  white-space:nowrap!important;
  box-sizing:border-box!important;
  display:flex!important;
  align-items:center!important;
  justify-content:center!important;
  min-height:38px!important;
}
.sm-hero-offer-badge-v3 strong{
  padding:8px 15px!important;
}
.sm-hero-offer-badge-v3 span{
  flex:1!important;
  text-align:center!important;
  padding:8px 6px!important;
}

@media(max-width:640px){
  .sm-mobile-hero,.sm-mh-copy{overflow:hidden!important}
  .sm-mh-title{width:calc(100% - 12px)!important;max-width:none!important;margin:0 auto!important;padding:0!important;transform:none!important;left:auto!important;right:auto!important;font-size:clamp(34px,9vw,42px)!important;line-height:.96!important;letter-spacing:-.035em!important;text-align:center!important;overflow:visible!important;overflow-wrap:normal!important;word-break:normal!important}
  .sm-mh-title,.sm-mh-title *{text-decoration:none!important;border-bottom:0!important;background-image:none!important;box-shadow:none!important}
  .sm-mh-title::before,.sm-mh-title::after,.sm-mh-title-line::before,.sm-mh-title-line::after,.sm-mh-first-line::before,.sm-mh-first-line::after,.sm-mh-second-line::before,.sm-mh-second-line::after{content:none!important;display:none!important}
  .sm-mh-title-line{display:block!important;width:100%!important;max-width:100%!important;margin-left:auto!important;margin-right:auto!important;white-space:normal!important;transform:none!important}
  .sm-mobile-hero-break{display:inline!important}
  .sm-mh-first-line{color:#6b4de6!important}
  .sm-mh-second-line{color:#201d25!important}
  .sm-mh-title-line-accent{font-size:.78em!important;white-space:nowrap!important;letter-spacing:-.04em!important;color:#6b4de6!important}
  .sm-mh-title-tail{font-size:.90em!important;line-height:1!important;white-space:nowrap!important;color:#201d25!important}

  .sm-hero-offer-badge-v3{width:calc(100% - 42px)!important;min-height:50px!important;padding:4px 6px!important;gap:6px!important}
  .sm-hero-offer-badge-v3 strong,
  .sm-hero-offer-badge-v3 span{font-size:13.5px!important;min-height:36px!important}
  .sm-hero-offer-badge-v3 strong{padding:7px 12px!important}
  .sm-hero-offer-badge-v3 span{padding:7px 4px!important}

  .sm-format-v2-summary-visual.sm-format-carousel .sm-format-carousel-frame{width:82%!important;max-width:430px!important;transform:none!important}
  .sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-prev{left:7%!important}
  .sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-next{right:7%!important}

  .sm-format-v2-map-visual.sm-format-carousel .sm-carousel-prev,
  .sm-format-v2-card-visual.sm-format-carousel .sm-carousel-prev{left:6.5%!important;right:auto!important;transform:translate(-50%,-50%)!important}
  .sm-format-v2-map-visual.sm-format-carousel .sm-carousel-next,
  .sm-format-v2-card-visual.sm-format-carousel .sm-carousel-next{right:6.5%!important;left:auto!important;transform:translate(50%,-50%)!important}

  .sm-format-carousel-frame{box-shadow:0 12px 24px rgba(51,37,88,.13),0 3px 8px rgba(51,37,88,.07)!important}
}
@media(max-width:430px){
  .sm-mh-title{width:calc(100% - 10px)!important;font-size:clamp(33px,8.9vw,39px)!important}
  .sm-mh-title-line-accent{font-size:.76em!important}
  .sm-mh-title-tail{font-size:.89em!important}
  .sm-hero-offer-badge-v3{width:calc(100% - 34px)!important;min-height:48px!important}
  .sm-hero-offer-badge-v3 strong,
  .sm-hero-offer-badge-v3 span{font-size:13px!important;min-height:34px!important}
  .sm-format-v2-summary-visual.sm-format-carousel .sm-format-carousel-frame{width:86%!important}
  .sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-prev{left:5%!important}
  .sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-next{right:5%!important}
}
</style>`;
html=html.replace('</head>',css+'</head>');
fs.writeFileSync(target,html);
console.log('Hero offer badge rebalanced with equal text sizing and shorter height.');
