import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/visual-message-simplify-v1.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

const oldTurn = `<div class="sm-pain-turn">
      <span class="sm-pain-turn-mark" aria-hidden="true">✦</span>
      <div><small>A VIRADA</small><h3>O problema não é estudar pouco. <span>É tentar aprender informação demais sem uma organização visual clara.</span></h3></div>
    </div>`;

const newTurn = `<div class="sm-pain-turn">
      <div class="sm-pain-turn-copy">
        <small>A VIRADA</small>
        <h3>Não é falta de estudo. <span>É excesso de informação solta.</span></h3>
        <p>Os Supermapas organizam o conteúdo para você entender, consultar e revisar com muito mais facilidade.</p>
      </div>
    </div>`;

if (!html.includes(oldTurn)) throw new Error('Visual turn block not found.');
html = html.replace(oldTurn, newTurn);

const oldTransform = `<div class="sm-pain-transform" aria-label="Como a organização visual transforma o estudo">
      <div><span class="sm-pain-before">REGRA ESPALHADA</span><b aria-hidden="true">→</b><span class="sm-pain-after">CONTEÚDO ORGANIZADO</span></div>
      <div><span class="sm-pain-before">TEXTO DIFÍCIL DE CONSULTAR</span><b aria-hidden="true">→</b><span class="sm-pain-after">VISÃO RÁPIDA DO ASSUNTO</span></div>
      <div><span class="sm-pain-before">RELEITURA CONSTANTE</span><b aria-hidden="true">→</b><span class="sm-pain-after">REVISÃO VISUAL</span></div>
    </div>`;

const newTransform = `<div class="sm-pain-transform" aria-label="Como os Supermapas transformam o estudo">
      <div><span class="sm-pain-before">CONTEÚDO ESPALHADO</span><b aria-hidden="true">→</b><span class="sm-pain-after">VISÃO ORGANIZADA</span></div>
      <div><span class="sm-pain-before">TEXTO LONGO</span><b aria-hidden="true">→</b><span class="sm-pain-after">CONSULTA RÁPIDA</span></div>
      <div><span class="sm-pain-before">RELEITURA CONSTANTE</span><b aria-hidden="true">→</b><span class="sm-pain-after">REVISÃO VISUAL</span></div>
    </div>`;

if (!html.includes(oldTransform)) throw new Error('Visual transformation block not found.');
html = html.replace(oldTransform, newTransform);

html = html.replace(/\s*<footer class="sm-pain-close"><span>É exatamente esse excesso de informação solta que os Supermapas transformam em uma visão organizada\.<\/span><\/footer>/, '');

const css = `<style id="sm-visual-message-simplify-v1">
/* One clear idea: problem -> organization -> practical benefit. */
#publicos .sm-pain-turn{
  display:block!important;
  margin:36px 0 16px!important;
  padding:28px 32px!important;
}
#publicos .sm-pain-turn-copy{max-width:1000px!important}
#publicos .sm-pain-turn small{
  margin:0 0 10px!important;
  font-size:12px!important;
  letter-spacing:.18em!important;
}
#publicos .sm-pain-turn h3{
  max-width:920px!important;
  margin:0!important;
  font-size:clamp(30px,3.4vw,46px)!important;
  line-height:1.02!important;
  letter-spacing:-.04em!important;
}
#publicos .sm-pain-turn h3 span{color:#e7ddff!important}
#publicos .sm-pain-turn p{
  max-width:850px!important;
  margin:14px 0 0!important;
  color:#eee9ff!important;
  font-size:16px!important;
  line-height:1.42!important;
  font-weight:650!important;
}
#publicos .sm-pain-transform>div{min-height:84px!important}
#publicos .sm-pain-transform span{font-size:11.5px!important}

@media(max-width:640px){
  #publicos .sm-pain-turn{
    margin:24px 0 12px!important;
    padding:21px 20px 22px!important;
    border-radius:20px!important;
  }
  #publicos .sm-pain-turn small{margin-bottom:8px!important;font-size:10px!important}
  #publicos .sm-pain-turn h3{
    max-width:none!important;
    font-size:clamp(25px,7.2vw,31px)!important;
    line-height:1.03!important;
  }
  #publicos .sm-pain-turn p{
    margin-top:11px!important;
    font-size:13.5px!important;
    line-height:1.38!important;
  }
  #publicos .sm-pain-transform{gap:8px!important}
  #publicos .sm-pain-transform>div{min-height:72px!important;padding:9px!important}
  #publicos .sm-pain-transform span{min-height:46px!important;font-size:9.5px!important}
}
</style>`;

html = html.replace('</head>', css + '</head>');
fs.writeFileSync(target, html);
console.log('Visual transformation message simplified.');
