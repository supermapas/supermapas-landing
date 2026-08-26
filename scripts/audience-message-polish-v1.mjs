import fs from 'node:fs';
const target=process.argv[2];
if(!target) throw new Error('Usage: node scripts/audience-message-polish-v1.mjs <html-file>');
let html=fs.readFileSync(target,'utf8');

html=html.replaceAll(
  'Horas preparando resumos que ainda precisam ficar claros para a turma.',
  'Você quer explicar conteúdos complexos de um jeito mais claro para a turma.'
);
html=html.replaceAll(
  'Quando você precisa organizar regras, exemplos e exceções antes mesmo de começar a montar a aula.',
  'E tornar a aula mais visual e interessante, sem perder tempo criando tudo do zero.'
);
html=html.replaceAll('MENOS TEMPO PREPARANDO','MAIS CLAREZA NA AULA');
html=html.replaceAll('MAIS CLAREZA NA AULA</span><span>MAIS CLAREZA NA AULA','AULAS MAIS VISUAIS</span><span>MAIS CLAREZA NA AULA');

const css=`<style id="sm-audience-message-polish-v1">
/* Make the eyebrow visually belong to the headline instead of forming a narrow pyramid. */
#publicos.sm-pain-audience .sm-pain-head{max-width:980px!important}
#publicos.sm-pain-audience .sm-pain-eyebrow{
  width:min(760px,86%)!important;
  min-height:54px!important;
  padding:10px 28px!important;
  font-size:14px!important;
  line-height:1!important;
  letter-spacing:.18em!important;
  border-width:1.5px!important;
  box-sizing:border-box!important;
}
@media(max-width:640px){
  #publicos.sm-pain-audience .sm-pain-eyebrow{
    width:88%!important;
    min-height:46px!important;
    padding:9px 18px!important;
    font-size:11.5px!important;
    letter-spacing:.15em!important;
  }
}
@media(max-width:430px){
  #publicos.sm-pain-audience .sm-pain-eyebrow{width:92%!important;min-height:44px!important;font-size:11px!important}
}
</style>`;
html=html.replace('</head>',css+'</head>');
fs.writeFileSync(target,html);
console.log('Audience professor message and eyebrow polished.');
