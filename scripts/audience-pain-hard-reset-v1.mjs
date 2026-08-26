import fs from 'node:fs';
const target=process.argv[2];
if(!target) throw new Error('Usage: node scripts/audience-pain-hard-reset-v1.mjs <html-file>');
let html=fs.readFileSync(target,'utf8');

/* Rename collision-prone internals after the audience section is generated. */
html=html.replaceAll('class="sm-pain-number"','class="sm-audience-index"');
html=html.replaceAll('class="sm-pain-halo"','class="sm-audience-orbit"');
html=html.replace(/<h3>(Horas preparando resumos que ainda precisam ficar claros para a turma\.)<\/h3>/g,'<div class="sm-audience-pain-title">$1</div>');
html=html.replace(/<h3>(Você estuda uma regra hoje e poucos dias depois precisa procurar tudo de novo\.)<\/h3>/g,'<div class="sm-audience-pain-title">$1</div>');
html=html.replace(/<h3>(Você abre uma apostila e parece que todas as informações têm a mesma importância\.)<\/h3>/g,'<div class="sm-audience-pain-title">$1</div>');

const css=`<style id="sm-audience-pain-hard-reset-v1">
/* Final collision-free audience card system. */
#publicos.sm-pain-audience .sm-pain-card,
#publicos.sm-pain-audience .sm-pain-card:nth-child(2),
#publicos.sm-pain-audience .sm-pain-card:nth-child(3){
  min-height:0!important;
  height:auto!important;
  display:flex!important;
  flex-direction:column!important;
  transform:none!important;
}
#publicos.sm-pain-audience .sm-pain-visual{
  position:relative!important;
  flex:0 0 238px!important;
  width:100%!important;
  height:238px!important;
  min-height:238px!important;
  display:flex!important;
  align-items:flex-end!important;
  justify-content:center!important;
  overflow:hidden!important;
}
#publicos.sm-pain-audience .sm-audience-orbit{
  position:absolute!important;
  left:50%!important;
  top:24px!important;
  width:200px!important;
  height:200px!important;
  min-width:200px!important;
  min-height:200px!important;
  border-radius:50%!important;
  background:var(--soft)!important;
  transform:translateX(-50%)!important;
  z-index:0!important;
  pointer-events:none!important;
}
#publicos.sm-pain-audience .sm-audience-index{
  position:absolute!important;
  left:18px!important;
  top:16px!important;
  width:40px!important;
  height:40px!important;
  min-width:40px!important;
  min-height:40px!important;
  max-width:40px!important;
  max-height:40px!important;
  padding:0!important;
  margin:0!important;
  display:grid!important;
  place-items:center!important;
  border-radius:12px!important;
  background:var(--accent)!important;
  color:#fff!important;
  font-size:11px!important;
  line-height:1!important;
  font-weight:900!important;
  letter-spacing:0!important;
  transform:none!important;
  z-index:6!important;
  box-sizing:border-box!important;
}
#publicos.sm-pain-audience .sm-pain-visual img,
#publicos.sm-pain-audience .sm-pain-card--teal .sm-pain-visual img{
  position:relative!important;
  left:auto!important;
  right:auto!important;
  top:auto!important;
  bottom:auto!important;
  display:block!important;
  width:auto!important;
  height:216px!important;
  min-width:0!important;
  max-width:78%!important;
  max-height:216px!important;
  margin:0 auto!important;
  object-fit:contain!important;
  object-position:center bottom!important;
  transform:none!important;
  opacity:1!important;
  visibility:visible!important;
  z-index:2!important;
}
#publicos.sm-pain-audience .sm-pain-copy{
  display:block!important;
  flex:none!important;
  width:100%!important;
  min-height:0!important;
  height:auto!important;
  padding:16px 20px 17px!important;
  overflow:visible!important;
  background:#fff!important;
}
#publicos.sm-pain-audience .sm-pain-role{
  display:block!important;
  position:static!important;
  width:auto!important;
  height:auto!important;
  min-height:0!important;
  margin:0 0 3px!important;
  padding:0!important;
  color:var(--accent)!important;
  background:none!important;
  border:0!important;
  font-size:15px!important;
  line-height:1.05!important;
  font-weight:950!important;
  letter-spacing:.085em!important;
  transform:none!important;
}
#publicos.sm-pain-audience .sm-audience-pain-title{
  display:block!important;
  position:static!important;
  width:100%!important;
  min-width:0!important;
  max-width:none!important;
  height:auto!important;
  min-height:0!important;
  max-height:none!important;
  margin:0 0 6px!important;
  padding:0!important;
  overflow:visible!important;
  color:#211d29!important;
  background:none!important;
  border:0!important;
  box-shadow:none!important;
  font-size:21px!important;
  line-height:1.06!important;
  font-weight:850!important;
  letter-spacing:-.03em!important;
  text-align:left!important;
  white-space:normal!important;
  transform:none!important;
}
#publicos.sm-pain-audience .sm-pain-copy p{
  display:block!important;
  position:static!important;
  width:100%!important;
  height:auto!important;
  min-height:0!important;
  margin:0!important;
  padding:0!important;
  color:#68616f!important;
  background:none!important;
  font-size:13.5px!important;
  line-height:1.38!important;
  transform:none!important;
}
#publicos.sm-pain-audience .sm-pain-chips{
  display:flex!important;
  position:static!important;
  flex-wrap:wrap!important;
  gap:6px!important;
  width:100%!important;
  height:auto!important;
  min-height:0!important;
  margin:9px 0 0!important;
  padding:0!important;
  transform:none!important;
}
#publicos.sm-pain-audience .sm-pain-chips span{
  display:inline-flex!important;
  width:auto!important;
  height:auto!important;
  min-height:0!important;
  margin:0!important;
  padding:7px 9px!important;
  border-radius:999px!important;
  background:var(--soft)!important;
  color:var(--accent)!important;
  font-size:9px!important;
  line-height:1!important;
  font-weight:900!important;
  letter-spacing:.045em!important;
}

@media(max-width:900px){
  #publicos.sm-pain-audience .sm-pain-visual{flex-basis:245px!important;height:245px!important;min-height:245px!important}
  #publicos.sm-pain-audience .sm-pain-visual img,
  #publicos.sm-pain-audience .sm-pain-card--teal .sm-pain-visual img{height:222px!important;max-height:222px!important;max-width:72%!important}
}
@media(max-width:640px){
  #publicos.sm-pain-audience .sm-pain-visual{flex-basis:220px!important;height:220px!important;min-height:220px!important}
  #publicos.sm-pain-audience .sm-audience-orbit{top:20px!important;width:188px!important;height:188px!important;min-width:188px!important;min-height:188px!important}
  #publicos.sm-pain-audience .sm-audience-index{left:12px!important;top:12px!important;width:34px!important;height:34px!important;min-width:34px!important;min-height:34px!important;max-width:34px!important;max-height:34px!important;border-radius:10px!important;font-size:10px!important}
  #publicos.sm-pain-audience .sm-pain-visual img,
  #publicos.sm-pain-audience .sm-pain-card--teal .sm-pain-visual img{height:202px!important;max-height:202px!important;max-width:76%!important}
  #publicos.sm-pain-audience .sm-pain-copy{padding:13px 16px 15px!important}
  #publicos.sm-pain-audience .sm-pain-role{font-size:14px!important;margin-bottom:2px!important}
  #publicos.sm-pain-audience .sm-audience-pain-title{font-size:19px!important;margin-bottom:5px!important}
  #publicos.sm-pain-audience .sm-pain-copy p{font-size:13px!important;line-height:1.35!important}
  #publicos.sm-pain-audience .sm-pain-chips{margin-top:8px!important}
}
@media(max-width:430px){
  #publicos.sm-pain-audience .sm-pain-visual{flex-basis:210px!important;height:210px!important;min-height:210px!important}
  #publicos.sm-pain-audience .sm-pain-visual img,
  #publicos.sm-pain-audience .sm-pain-card--teal .sm-pain-visual img{height:192px!important;max-height:192px!important;max-width:80%!important}
}
</style>`;
html=html.replace('</head>',css+'</head>');
fs.writeFileSync(target,html);
console.log('Audience cards hard-reset to collision-free compact layout.');
