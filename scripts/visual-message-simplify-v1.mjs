import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/visual-message-simplify-v1.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

const oldTurn = `<div class="sm-pain-turn">
      <span class="sm-pain-turn-mark" aria-hidden="true">✦</span>
      <div><small>A VIRADA</small><h3>O problema não é estudar pouco. <span>É tentar aprender informação demais sem uma organização visual clara.</span></h3></div>
    </div>`;

const oldTransform = `<div class="sm-pain-transform" aria-label="Como a organização visual transforma o estudo">
      <div><span class="sm-pain-before">REGRA ESPALHADA</span><b aria-hidden="true">→</b><span class="sm-pain-after">CONTEÚDO ORGANIZADO</span></div>
      <div><span class="sm-pain-before">TEXTO DIFÍCIL DE CONSULTAR</span><b aria-hidden="true">→</b><span class="sm-pain-after">VISÃO RÁPIDA DO ASSUNTO</span></div>
      <div><span class="sm-pain-before">RELEITURA CONSTANTE</span><b aria-hidden="true">→</b><span class="sm-pain-after">REVISÃO VISUAL</span></div>
    </div>`;

if (!html.includes(oldTurn) || !html.includes(oldTransform)) {
  throw new Error('Original visual transition blocks not found.');
}

const bridge = `<div class="sm-study-bridge" aria-label="Como os Supermapas deixam o estudo mais claro">
      <div class="sm-study-bridge-copy">
        <span>DA CONFUSÃO À CLAREZA</span>
        <h3>Quando a informação se organiza, <strong>fica mais fácil enxergar o que importa.</strong></h3>
        <p>É essa mudança que os Supermapas trazem para o estudo.</p>
      </div>
      <div class="sm-study-bridge-flow" aria-label="Transformações no estudo com Supermapas">
        <div><span>Conteúdo espalhado</span><b aria-hidden="true">→</b><strong>Organizado</strong></div>
        <div><span>Texto longo</span><b aria-hidden="true">→</b><strong>Consulta rápida</strong></div>
        <div><span>Reler tudo</span><b aria-hidden="true">→</b><strong>Revisão visual</strong></div>
      </div>
    </div>`;

html = html.replace(oldTurn + '\n\n    ' + oldTransform, bridge);
html = html.replace(/\s*<footer class="sm-pain-close"><span>É exatamente esse excesso de informação solta que os Supermapas transformam em uma visão organizada\.<\/span><\/footer>/, '');

const css = `<style id="sm-visual-message-simplify-v1">
/* Lightweight editorial bridge: it should connect sections, not become another hero. */
#publicos .sm-study-bridge{
  width:min(1060px,100%)!important;
  margin:38px auto 0!important;
  padding:30px 0 2px!important;
  border-top:1px solid rgba(60,48,76,.10)!important;
  background:transparent!important;
  color:#27222e!important;
}
#publicos .sm-study-bridge-copy{
  max-width:760px!important;
  margin:0 auto 24px!important;
  text-align:center!important;
}
#publicos .sm-study-bridge-copy>span{
  display:block!important;
  margin:0 0 9px!important;
  color:#7663bf!important;
  font-size:10.5px!important;
  line-height:1!important;
  font-weight:900!important;
  letter-spacing:.16em!important;
}
#publicos .sm-study-bridge-copy h3{
  margin:0!important;
  color:#28232f!important;
  font-size:clamp(25px,2.7vw,36px)!important;
  line-height:1.08!important;
  letter-spacing:-.035em!important;
  font-weight:760!important;
}
#publicos .sm-study-bridge-copy h3 strong{
  color:#6d52d5!important;
  font-weight:850!important;
}
#publicos .sm-study-bridge-copy p{
  margin:9px 0 0!important;
  color:#77707e!important;
  font-size:14px!important;
  line-height:1.45!important;
  font-weight:500!important;
}
#publicos .sm-study-bridge-flow{
  display:grid!important;
  grid-template-columns:repeat(3,minmax(0,1fr))!important;
  gap:0!important;
  border-top:1px solid rgba(60,48,76,.08)!important;
  border-bottom:1px solid rgba(60,48,76,.08)!important;
}
#publicos .sm-study-bridge-flow>div{
  position:relative!important;
  display:grid!important;
  grid-template-columns:minmax(0,1fr) auto minmax(0,1fr)!important;
  align-items:center!important;
  gap:9px!important;
  min-width:0!important;
  padding:17px 18px!important;
  background:transparent!important;
}
#publicos .sm-study-bridge-flow>div+div:before{
  content:""!important;
  position:absolute!important;
  left:0!important;
  top:14px!important;
  bottom:14px!important;
  width:1px!important;
  background:rgba(60,48,76,.09)!important;
}
#publicos .sm-study-bridge-flow span,
#publicos .sm-study-bridge-flow strong{
  min-width:0!important;
  font-size:11px!important;
  line-height:1.2!important;
  font-weight:800!important;
  text-align:center!important;
}
#publicos .sm-study-bridge-flow span{color:#8a838f!important}
#publicos .sm-study-bridge-flow strong{color:#5f45c6!important}
#publicos .sm-study-bridge-flow b{
  color:#b0a5d7!important;
  font-size:15px!important;
  font-weight:700!important;
}

@media(max-width:700px){
  #publicos .sm-study-bridge{
    width:100%!important;
    margin-top:25px!important;
    padding-top:23px!important;
  }
  #publicos .sm-study-bridge-copy{
    max-width:94%!important;
    margin-bottom:18px!important;
  }
  #publicos .sm-study-bridge-copy>span{font-size:9px!important;margin-bottom:7px!important}
  #publicos .sm-study-bridge-copy h3{
    font-size:clamp(22px,6.1vw,28px)!important;
    line-height:1.08!important;
    letter-spacing:-.03em!important;
  }
  #publicos .sm-study-bridge-copy p{margin-top:8px!important;font-size:12.5px!important}
  #publicos .sm-study-bridge-flow{
    grid-template-columns:1fr!important;
    padding:4px 0!important;
  }
  #publicos .sm-study-bridge-flow>div{
    grid-template-columns:minmax(0,1fr) 24px minmax(0,1fr)!important;
    min-height:51px!important;
    padding:10px 6px!important;
  }
  #publicos .sm-study-bridge-flow>div+div:before{
    left:8%!important;
    right:8%!important;
    top:0!important;
    bottom:auto!important;
    width:auto!important;
    height:1px!important;
  }
  #publicos .sm-study-bridge-flow span,
  #publicos .sm-study-bridge-flow strong{font-size:10.5px!important}
  #publicos .sm-study-bridge-flow b{font-size:14px!important;text-align:center!important}
}
</style>`;

html = html.replace('</head>', css + '</head>');
fs.writeFileSync(target, html);
console.log('Visual transition rebuilt as lightweight editorial bridge.');
