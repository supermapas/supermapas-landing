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
        <span class="sm-study-bridge-eyebrow"><i aria-hidden="true"></i> DA CONFUSÃO À CLAREZA</span>
        <h3>Quando a informação se organiza, <strong>você enxerga o que importa.</strong></h3>
        <p>É essa mudança que os Supermapas trazem para o estudo.</p>
      </div>
      <div class="sm-study-bridge-flow-wrap">
        <span class="sm-study-bridge-flow-label">O QUE MUDA NA PRÁTICA</span>
        <div class="sm-study-bridge-flow" aria-label="Transformações no estudo com Supermapas">
          <div class="sm-study-bridge-item sm-study-bridge-item--purple"><span>Conteúdo espalhado</span><b aria-hidden="true">→</b><strong>Organizado</strong></div>
          <div class="sm-study-bridge-item sm-study-bridge-item--orange"><span>Texto longo</span><b aria-hidden="true">→</b><strong>Consulta rápida</strong></div>
          <div class="sm-study-bridge-item sm-study-bridge-item--green"><span>Reler tudo</span><b aria-hidden="true">→</b><strong>Revisão visual</strong></div>
        </div>
      </div>
    </div>`;

html = html.replace(oldTurn + '\n\n    ' + oldTransform, bridge);
html = html.replace(/\s*<footer class="sm-pain-close"><span>É exatamente esse excesso de informação solta que os Supermapas transformam em uma visão organizada\.<\/span><\/footer>/, '');

const css = `<style id="sm-visual-message-simplify-v1">
/* Cohesive editorial bridge: enough structure to feel intentional, light enough to preserve flow. */
#publicos .sm-study-bridge{
  position:relative!important;
  width:min(1080px,100%)!important;
  margin:42px auto 0!important;
  padding:38px 42px 34px!important;
  overflow:hidden!important;
  border:1px solid rgba(74,61,94,.10)!important;
  border-radius:30px!important;
  background:linear-gradient(135deg,#fcfbff 0%,#fff 54%,#fbfdfc 100%)!important;
  box-shadow:0 16px 42px rgba(57,44,82,.055)!important;
  color:#27222e!important;
}
#publicos .sm-study-bridge:before{
  content:""!important;
  position:absolute!important;
  left:0!important;
  top:0!important;
  width:100%!important;
  height:4px!important;
  background:linear-gradient(90deg,#6d52d5 0 34%,#e58a36 34% 67%,#459a79 67% 100%)!important;
  opacity:.82!important;
}
#publicos .sm-study-bridge-copy{
  max-width:900px!important;
  margin:0 auto 30px!important;
  text-align:center!important;
}
#publicos .sm-study-bridge-eyebrow{
  display:inline-flex!important;
  align-items:center!important;
  gap:8px!important;
  margin:0 0 13px!important;
  padding:8px 12px!important;
  border:1px solid rgba(109,82,213,.13)!important;
  border-radius:999px!important;
  background:#f5f2ff!important;
  color:#6655aa!important;
  font-size:10.5px!important;
  line-height:1!important;
  font-weight:900!important;
  letter-spacing:.12em!important;
}
#publicos .sm-study-bridge-eyebrow i{
  width:7px!important;
  height:7px!important;
  border-radius:50%!important;
  background:#7056d9!important;
  box-shadow:0 0 0 4px rgba(112,86,217,.10)!important;
}
#publicos .sm-study-bridge-copy h3{
  max-width:920px!important;
  margin:0 auto!important;
  color:#28232f!important;
  font-size:clamp(40px,4.25vw,58px)!important;
  line-height:.99!important;
  letter-spacing:-.046em!important;
  font-weight:820!important;
}
#publicos .sm-study-bridge-copy h3 strong{
  display:inline!important;
  color:#6b50d2!important;
  font-weight:900!important;
}
#publicos .sm-study-bridge-copy h3 strong:after{
  content:none!important;
  display:none!important;
}
#publicos .sm-study-bridge-copy p{
  margin:14px 0 0!important;
  color:#746e79!important;
  font-size:15.5px!important;
  line-height:1.45!important;
  font-weight:560!important;
}
#publicos .sm-study-bridge-flow-wrap{
  position:relative!important;
  padding:22px 22px 8px!important;
  border:1px solid rgba(67,54,86,.085)!important;
  border-radius:22px!important;
  background:rgba(255,255,255,.84)!important;
}
#publicos .sm-study-bridge-flow-label{
  position:absolute!important;
  left:50%!important;
  top:0!important;
  transform:translate(-50%,-50%)!important;
  padding:5px 11px!important;
  border-radius:999px!important;
  background:#fff!important;
  color:#8a838f!important;
  box-shadow:0 0 0 1px rgba(67,54,86,.075)!important;
  font-size:9px!important;
  line-height:1!important;
  font-weight:900!important;
  letter-spacing:.12em!important;
  white-space:nowrap!important;
}
#publicos .sm-study-bridge-flow{
  display:grid!important;
  grid-template-columns:repeat(3,minmax(0,1fr))!important;
  gap:12px!important;
}
#publicos .sm-study-bridge-item{
  --tone:#6d52d5;
  --soft:#f2eeff;
  position:relative!important;
  display:grid!important;
  grid-template-columns:minmax(0,1fr) 30px minmax(0,1fr)!important;
  align-items:center!important;
  gap:7px!important;
  min-width:0!important;
  min-height:72px!important;
  padding:10px 12px!important;
  border-radius:16px!important;
  background:linear-gradient(90deg,#f7f6f8 0 46%,var(--soft) 54% 100%)!important;
}
#publicos .sm-study-bridge-item--orange{--tone:#d97825;--soft:#fff1e4}
#publicos .sm-study-bridge-item--green{--tone:#31866b;--soft:#eaf7f1}
#publicos .sm-study-bridge-item span,
#publicos .sm-study-bridge-item strong{
  min-width:0!important;
  font-size:12px!important;
  line-height:1.2!important;
  text-align:center!important;
}
#publicos .sm-study-bridge-item span{
  color:#7f7885!important;
  font-weight:760!important;
}
#publicos .sm-study-bridge-item strong{
  position:relative!important;
  color:var(--tone)!important;
  font-weight:900!important;
}
#publicos .sm-study-bridge-item strong:before{
  content:""!important;
  display:inline-block!important;
  width:6px!important;
  height:6px!important;
  margin:0 6px 1px 0!important;
  border-radius:50%!important;
  background:var(--tone)!important;
}
#publicos .sm-study-bridge-item b{
  display:grid!important;
  place-items:center!important;
  width:30px!important;
  height:30px!important;
  border-radius:50%!important;
  background:#fff!important;
  color:var(--tone)!important;
  box-shadow:0 4px 12px rgba(55,43,76,.08)!important;
  font-size:16px!important;
  line-height:1!important;
  font-weight:800!important;
}

@media(max-width:900px){
  #publicos .sm-study-bridge{padding:34px 28px 28px!important}
  #publicos .sm-study-bridge-copy h3{font-size:clamp(38px,5.8vw,50px)!important}
  #publicos .sm-study-bridge-flow{grid-template-columns:1fr!important;gap:8px!important}
  #publicos .sm-study-bridge-item{min-height:64px!important}
}

@media(max-width:700px){
  #publicos .sm-study-bridge{
    width:100%!important;
    margin-top:28px!important;
    padding:31px 14px 16px!important;
    border-radius:24px!important;
    box-shadow:0 12px 30px rgba(57,44,82,.05)!important;
  }
  #publicos .sm-study-bridge:before{height:3px!important}
  #publicos .sm-study-bridge-copy{
    max-width:100%!important;
    margin-bottom:25px!important;
    padding:0 5px!important;
  }
  #publicos .sm-study-bridge-eyebrow{
    margin-bottom:12px!important;
    padding:7px 10px!important;
    font-size:9px!important;
    letter-spacing:.105em!important;
  }
  #publicos .sm-study-bridge-copy h3{
    max-width:560px!important;
    font-size:clamp(34px,9.2vw,42px)!important;
    line-height:1.01!important;
    letter-spacing:-.045em!important;
  }
  #publicos .sm-study-bridge-copy h3 strong{display:inline!important}
  #publicos .sm-study-bridge-copy p{
    max-width:440px!important;
    margin:12px auto 0!important;
    font-size:13.5px!important;
  }
  #publicos .sm-study-bridge-flow-wrap{
    padding:20px 8px 8px!important;
    border-radius:18px!important;
  }
  #publicos .sm-study-bridge-flow-label{font-size:8.5px!important}
  #publicos .sm-study-bridge-flow{gap:7px!important}
  #publicos .sm-study-bridge-item{
    grid-template-columns:minmax(0,1fr) 34px minmax(0,1fr)!important;
    min-height:66px!important;
    padding:9px 8px!important;
    border-radius:14px!important;
  }
  #publicos .sm-study-bridge-item span,
  #publicos .sm-study-bridge-item strong{font-size:12.5px!important}
  #publicos .sm-study-bridge-item b{width:32px!important;height:32px!important;font-size:16px!important}
}

@media(max-width:430px){
  #publicos .sm-study-bridge-copy h3{font-size:clamp(32px,9.4vw,39px)!important}
  #publicos .sm-study-bridge-item span,
  #publicos .sm-study-bridge-item strong{font-size:11.5px!important}
}
</style>`;

html = html.replace('</head>', css + '</head>');
fs.writeFileSync(target, html);
console.log('Visual transition rebuilt as a cohesive, balanced editorial bridge.');
