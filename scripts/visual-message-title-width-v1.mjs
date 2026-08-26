import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/visual-message-title-width-v1.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

const css = `<style id="sm-visual-message-title-width-v1">
@media(max-width:700px){
  #publicos .sm-study-bridge-copy{
    width:100%!important;
    max-width:none!important;
    padding-left:0!important;
    padding-right:0!important;
  }
  #publicos .sm-study-bridge-copy h3{
    width:100%!important;
    max-width:none!important;
    margin-left:auto!important;
    margin-right:auto!important;
    padding:0 1px!important;
    font-size:clamp(31px,8.15vw,38px)!important;
    line-height:.98!important;
    letter-spacing:-.042em!important;
    text-wrap:balance!important;
  }
  #publicos .sm-study-bridge-copy p{
    max-width:92%!important;
  }
}
@media(max-width:430px){
  #publicos .sm-study-bridge-copy h3{
    font-size:clamp(30px,8vw,36px)!important;
  }
}
</style>`;

html = html.replace('</head>', css + '</head>');
fs.writeFileSync(target, html);
console.log('Bridge title widened and rebalanced on mobile.');
