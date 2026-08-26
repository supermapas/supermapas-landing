import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/visual-compare-polish-v1.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

if (!html.includes('sm-visual-compare-v3') || !html.includes('data-sm-before-after')) {
  throw new Error('Visual comparison section not found.');
}

const denseText = `<div class="sm-vc-text-content"><h3>Crase</h3><p>A crase é o fenômeno que ocorre quando há a fusão de duas vogais idênticas, normalmente a preposição <strong>a</strong> com o artigo feminino <strong>a</strong> ou <strong>as</strong>. Para identificar sua ocorrência, primeiro é necessário observar se o termo anterior exige a preposição <strong>a</strong> e, depois, verificar se o termo seguinte admite artigo feminino.</p><p>Em estruturas regidas por verbos ou nomes que pedem a preposição <strong>a</strong>, haverá crase quando o complemento vier acompanhado do artigo feminino. É o que acontece em construções como “referi-me à autora”, pois o verbo ou nome regente exige preposição e o substantivo feminino aceita artigo.</p><p>O uso também aparece com frequência em locuções adverbiais, prepositivas e conjuntivas femininas, como <strong>à tarde</strong>, <strong>à medida que</strong>, <strong>à espera de</strong> e <strong>à vontade</strong>. Em indicações de horas determinadas, emprega-se o acento grave: <strong>às seis horas</strong>, <strong>à meia-noite</strong>.</p><p>Há situações em que a crase é facultativa. Isso pode ocorrer antes de nomes próprios femininos, antes de pronomes possessivos femininos e depois da preposição <strong>até</strong>, dependendo da construção e da presença ou ausência do artigo.</p><p>Por outro lado, em regra, não se usa crase antes de palavras masculinas, verbos no infinitivo, pronomes pessoais e expressões em que não exista artigo feminino. Dizer apenas que a palavra seguinte é feminina não é suficiente: é preciso que estejam presentes simultaneamente a preposição e o artigo.</p><p>Um teste útil é substituir a palavra feminina por uma masculina correspondente. Se surgir a combinação <strong>ao</strong>, normalmente haverá crase no feminino. Assim, “referi-me ao autor” ajuda a confirmar “referi-me à autora”.</p><p>Também é importante distinguir a crase do simples acento grave. O acento é apenas o sinal gráfico utilizado para marcar a ocorrência da crase na escrita. A análise correta depende sempre da relação sintática entre os termos, da regência e da possibilidade de uso do artigo.</p><p>Por isso, resolver questões de crase exige observar várias regras, exceções e testes ao mesmo tempo. Em um texto corrido, essas informações ficam distribuídas em vários parágrafos e precisam ser recuperadas mentalmente durante a leitura.</p></div>`;

html = html.replace(/<div class="sm-vc-text-content">.*?<\/div><\/div><div class="sm-vc-map-page">/s, denseText + '</div><div class="sm-vc-map-page">');

const css = `<style id="sm-visual-compare-polish-v1">
.sm-visual-study.sm-visual-compare-v3{background:#fff!important;color:#211c2b!important;padding-top:clamp(54px,6vw,88px)!important;padding-bottom:clamp(58px,6vw,92px)!important}
.sm-visual-compare-v3 .sm-vc-shell{background:transparent!important;border:0!important;box-shadow:none!important}
.sm-visual-compare-v3 .sm-vc-intro,.sm-visual-compare-v3 .sm-vc-intro h2,.sm-visual-compare-v3 .sm-vc-intro p{color:#211c2b!important}
.sm-visual-compare-v3 .sm-vc-intro h2 span{color:#7056d9!important}
.sm-visual-compare-v3 .sm-vc-eyebrow{color:#7056d9!important;background:#f1edff!important;border:1px solid rgba(112,86,217,.18)!important}
.sm-visual-compare-v3 .sm-vc-stage{background:transparent!important;border:0!important;box-shadow:none!important;padding:clamp(8px,1.2vw,14px)!important}
.sm-visual-compare-v3 .sm-vc-page{background:#fff!important;border:1px solid rgba(67,51,98,.10)!important;box-shadow:0 24px 58px rgba(55,39,90,.16),0 5px 16px rgba(55,39,90,.08)!important;overflow:hidden!important}
.sm-visual-compare-v3 .sm-vc-text-page{background:#fff!important;color:#292333!important}
.sm-visual-compare-v3 .sm-vc-text-content{padding:clamp(28px,3.2vw,52px)!important;height:100%!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;justify-content:flex-start!important;gap:clamp(8px,.8vw,13px)!important}
.sm-visual-compare-v3 .sm-vc-text-content h3{margin:0 0 4px!important;color:#26202f!important;font-size:clamp(30px,3.2vw,52px)!important;line-height:.95!important}
.sm-visual-compare-v3 .sm-vc-text-content p{margin:0!important;color:#51495d!important;font-size:clamp(11px,.95vw,15px)!important;line-height:1.42!important;text-align:justify!important}
.sm-visual-compare-v3 .sm-vc-text-content strong{color:#31283b!important}
.sm-visual-compare-v3 .sm-vc-map-page{background:#fff!important}
.sm-visual-compare-v3 .sm-vc-map-page img{filter:none!important;box-shadow:none!important}
.sm-visual-compare-v3 .sm-vc-divider{width:5px!important;background:linear-gradient(180deg,#7b4df1 0%,#5f59ee 48%,#2e9ee7 100%)!important;box-shadow:0 0 0 1px rgba(255,255,255,.85),0 6px 22px rgba(83,69,203,.34)!important}
.sm-visual-compare-v3 .sm-vc-divider span{width:44px!important;height:44px!important;display:grid!important;place-items:center!important;border-radius:50%!important;background:linear-gradient(135deg,#7548ee,#388fe6)!important;color:#fff!important;border:3px solid #fff!important;box-shadow:0 7px 22px rgba(68,54,180,.38)!important;font-weight:900!important}
.sm-visual-compare-v3 .sm-vc-benefits{margin-top:clamp(22px,2.4vw,34px)!important;gap:14px!important}
.sm-visual-compare-v3 .sm-vc-benefits>div{position:relative!important;overflow:hidden!important;display:grid!important;grid-template-columns:auto 1fr!important;align-items:center!important;gap:14px!important;min-height:108px!important;padding:18px 20px!important;background:linear-gradient(135deg,#fff 0%,#faf8ff 100%)!important;border:1px solid rgba(112,86,217,.14)!important;border-radius:20px!important;box-shadow:0 12px 28px rgba(71,53,107,.08)!important}
.sm-visual-compare-v3 .sm-vc-benefits>div:before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:linear-gradient(180deg,#7758e7,#3f9fd4)}
.sm-visual-compare-v3 .sm-vc-benefits b{display:grid!important;place-items:center!important;width:46px!important;height:46px!important;border-radius:14px!important;background:#7056d9!important;color:#fff!important;font-size:14px!important;box-shadow:0 8px 18px rgba(112,86,217,.22)!important}
.sm-visual-compare-v3 .sm-vc-benefits span{display:flex!important;flex-direction:column!important;gap:4px!important}
.sm-visual-compare-v3 .sm-vc-benefits strong{color:#282133!important;font-size:16px!important}
.sm-visual-compare-v3 .sm-vc-benefits small{color:#6d6675!important;font-size:13px!important;line-height:1.38!important}
@media(max-width:740px){
  .sm-visual-study.sm-visual-compare-v3{padding-top:30px!important;padding-bottom:34px!important}
  .sm-visual-compare-v3 .sm-vc-shell{padding-top:0!important;padding-bottom:0!important}
  .sm-visual-compare-v3 .sm-vc-intro{margin-bottom:14px!important;padding-bottom:0!important}
  .sm-visual-compare-v3 .sm-vc-eyebrow{margin-bottom:10px!important}
  .sm-visual-compare-v3 .sm-vc-intro h2{margin-top:0!important;margin-bottom:12px!important;line-height:1.03!important}
  .sm-visual-compare-v3 .sm-vc-intro p{margin-top:0!important;margin-bottom:0!important;line-height:1.35!important}
  .sm-visual-compare-v3 .sm-vc-stage{margin-top:8px!important;padding-top:4px!important;padding-bottom:4px!important}
  .sm-visual-compare-v3 .sm-vc-text-content{padding:20px!important;gap:7px!important}
  .sm-visual-compare-v3 .sm-vc-text-content h3{font-size:28px!important}
  .sm-visual-compare-v3 .sm-vc-text-content p{font-size:9.5px!important;line-height:1.34!important}
  .sm-visual-compare-v3 .sm-vc-divider span{width:38px!important;height:38px!important}
  .sm-visual-compare-v3 .sm-vc-benefits{grid-template-columns:1fr!important;margin-top:14px!important;gap:10px!important}
  .sm-visual-compare-v3 .sm-vc-benefits>div{min-height:84px!important;padding-top:14px!important;padding-bottom:14px!important}
}
</style>`;

html = html.replace('</head>', css + '</head>');
fs.writeFileSync(target, html);
console.log('Visual comparison polish v1 applied with compact mobile spacing.');
