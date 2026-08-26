import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/creators-authority-polish-v1.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

// Remove the extra purple trust block above the actual Idealizadores section.
html = html.replace(/<div class="sm-behind-trust-v3">.*?<\/div>(?=<div class="sm-creators-shell">)/s, '');

// Strengthen creator authority copy without inventing credentials.
html = html.replace(
  '<h3>Edson Diniz</h3><p>Professor, criador e fundador dos SuperMapas.</p>',
  '<h3>Edson Diniz</h3><p>Professor, empreendedor e criador dos Supermapas. Há quase 10 anos transforma conteúdos de Língua Portuguesa em materiais visuais para estudo, revisão e sala de aula.</p>'
);

html = html.replace(
  '<h3>Odair Diniz</h3><p>Incentivador, colaborador e parte da história dos SuperMapas.</p>',
  '<h3>Odair Diniz</h3><p>Criador do Superdicas de Português e colaborador dos Supermapas. Participa da pesquisa, troca de ideias e construção dos materiais desde os primeiros anos do projeto.</p>'
);

// Slightly refine the section intro to support authority instead of sentimentality alone.
html = html.replace(
  '<p>Um projeto que nasceu de uma ideia, cresceu com incentivo e continua sendo construído em família.</p>',
  '<p>Experiência prática, produção constante de conteúdo e uma trajetória construída em família por trás de cada material.</p>'
);

// Turn the existing footer into an editorial-authority statement.
html = html.replace(
  '<footer class="sm-creators-foot"><span aria-hidden="true">✦</span><p><strong>SuperMapas é feito por pessoas.</strong> Por trás de cada material existe estudo, criação, colaboração e uma história construída ao longo do caminho.</p></footer>',
  '<footer class="sm-creators-foot sm-creators-foot--authority"><span aria-hidden="true">✓</span><p><strong>Conteúdo com base e revisão.</strong> Os Supermapas são criados a partir de referências bibliográficas e revisados por professores antes de serem disponibilizados.</p></footer>'
);

const css = `<style id="sm-creators-authority-polish-v2">
/* Bring social proof and offer closer together without overlap or negative offsets. */
.sm-proof-real{padding-bottom:32px!important}
.sm-offer-value{padding-top:44px!important}

/* Keep both creator cards structurally symmetrical. */
.sm-creators-grid{align-items:stretch!important}
.sm-creator-card{display:flex!important;flex-direction:column!important;height:100%!important;min-width:0!important}
.sm-creator-photo-wrap{flex:0 0 auto!important}
.sm-creator-copy{display:flex!important;flex:1 1 auto!important;flex-direction:column!important;min-width:0!important}
.sm-creator-copy>div:first-child{display:flex!important;flex:1 1 auto!important;flex-direction:column!important;min-width:0!important}
.sm-creator-copy h3{margin-bottom:14px!important}
.sm-creator-copy p{margin:0!important;line-height:1.52!important}
.sm-creator-instagram{margin-top:22px!important;display:grid!important;grid-template-columns:24px minmax(0,1fr) 18px!important;align-items:center!important;gap:9px!important;min-width:0!important;box-sizing:border-box!important}
.sm-creator-instagram svg{width:22px!important;height:22px!important}
.sm-creator-instagram span{min-width:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.sm-creator-instagram b{justify-self:end!important}

/* Editorial-authority note below both cards. */
.sm-creators-foot--authority{align-items:center!important;border-color:rgba(112,86,217,.18)!important;background:linear-gradient(135deg,#fbf9ff,#f4f0ff)!important}
.sm-creators-foot--authority>span{display:grid!important;place-items:center!important;background:#7056d9!important;color:#fff!important;font-weight:950!important}
.sm-creators-foot--authority p{line-height:1.48!important}
.sm-creators-foot--authority strong{color:#2d2736!important}

@media(max-width:760px){
  .sm-proof-real{padding-bottom:18px!important}
  .sm-offer-value{padding-top:24px!important}

  .sm-creators-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}
  .sm-creator-card{border-radius:20px!important;overflow:hidden!important}
  .sm-creator-copy{padding:16px 13px 14px!important}
  .sm-creator-kicker{font-size:9px!important;letter-spacing:.14em!important}
  .sm-creator-copy h3{margin:8px 0 10px!important;font-size:clamp(22px,5.8vw,28px)!important;line-height:1!important;letter-spacing:-.035em!important}
  .sm-creator-copy p{font-size:12.5px!important;line-height:1.43!important;letter-spacing:-.005em!important}
  .sm-creator-instagram{grid-template-columns:20px minmax(0,1fr) 14px!important;gap:6px!important;width:100%!important;min-height:48px!important;margin-top:16px!important;padding:9px 9px!important;border-radius:15px!important}
  .sm-creator-instagram svg{width:19px!important;height:19px!important}
  .sm-creator-instagram span{font-size:clamp(9px,2.45vw,11px)!important;line-height:1!important;font-weight:850!important;letter-spacing:-.015em!important}
  .sm-creator-instagram b{font-size:13px!important}
  .sm-creators-foot--authority{margin-top:12px!important;padding:16px 15px!important;gap:11px!important;border-radius:18px!important}
  .sm-creators-foot--authority>span{flex:0 0 34px!important;width:34px!important;height:34px!important;border-radius:11px!important;font-size:13px!important}
  .sm-creators-foot--authority p{font-size:12.5px!important;line-height:1.42!important}
}

@media(max-width:430px){
  .sm-creator-copy{padding-left:11px!important;padding-right:11px!important}
  .sm-creator-copy p{font-size:12px!important;line-height:1.4!important}
  .sm-creator-instagram{padding-left:8px!important;padding-right:8px!important;gap:5px!important}
  .sm-creator-instagram span{font-size:9.2px!important}
}
</style>`;

if (!html.includes('sm-creators-authority-polish-v2')) {
  html = html.replace('</head>', css + '</head>');
}

fs.writeFileSync(target, html);
console.log('Creators authority, alignment and section spacing polished.');
