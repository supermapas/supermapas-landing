import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/desktop-hero-transition-polish-v1.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

const css = `<style id="sm-desktop-hero-transition-polish-v1">
@media (min-width:901px){
  /* Desktop header CTA: stronger, single-line and properly centered. */
  .sm-desktop-hero .sm-dh-header-cta{
    display:inline-flex!important;
    align-items:center!important;
    justify-content:center!important;
    flex:0 0 auto!important;
    width:auto!important;
    min-width:196px!important;
    min-height:44px!important;
    margin:0!important;
    padding:0 20px!important;
    border:0!important;
    border-radius:13px!important;
    background:linear-gradient(135deg,#f36a2d 0%,#ff7a2f 100%)!important;
    color:#fff!important;
    -webkit-text-fill-color:#fff!important;
    box-shadow:0 10px 24px rgba(243,106,45,.24)!important;
    font-size:11.5px!important;
    line-height:1!important;
    font-weight:950!important;
    letter-spacing:.025em!important;
    text-align:center!important;
    white-space:nowrap!important;
    text-decoration:none!important;
  }
  .sm-desktop-hero .sm-dh-header-cta:hover{
    transform:translateY(-1px)!important;
    box-shadow:0 14px 28px rgba(243,106,45,.30)!important;
  }

  /* Remove the artificial vertical gap between desktop hero and audience section. */
  .sm-desktop-hero{
    min-height:0!important;
    height:auto!important;
    margin-bottom:0!important;
    padding-bottom:22px!important;
  }
  #publicos.sm-pain-audience{
    margin-top:0!important;
    padding-top:28px!important;
  }
}
</style>`;

if (!html.includes('id="sm-desktop-hero-transition-polish-v1"')) {
  html = html.replace('</head>', `${css}</head>`);
}

fs.writeFileSync(target, html);
console.log('Desktop hero CTA and transition spacing polished.');
