import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/sales-conversion-v3.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

const CHECKOUT = 'pay.hotmart.com/A92093667Q';
const CTA = 'QUERO DOMINAR PORTUGUÊS';
const MAP_URL = 'https://static.wixstatic.com/media/1a67b8_b19132c7753849e08a076d81791245a4~mv2.png/v1/fit/w_1400,h_990/file.webp';

function escRe(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }
function injectHead(markup){ html = html.replace('</head>', markup + '</head>'); }
function injectBody(markup){ html = html.replace('</body>', markup + '</body>'); }

// ------------------------------------------------------------
// 1. Checkout CTA copy — preserve approved Hotmart URL/attribution.
// ------------------------------------------------------------
const checkoutRe = new RegExp(`(<a\\b[^>]*href="[^"]*${escRe(CHECKOUT)}[^"]*"[^>]*>)(.*?)(</a>)`, 'gis');
html = html.replace(checkoutRe, (_m, open, inner, close) => {
  if (/<span\b/i.test(inner)) {
    inner = inner.replace(/(<span\b[^>]*>).*?(<\/span>)/is, `$1${CTA}$2`);
    return open + inner + close;
  }
  const icon = (inner.match(/<b\b[^>]*>.*?<\/b>/is) || [''])[0];
  return open + CTA + (icon ? ' ' + icon : '') + close;
});

// ------------------------------------------------------------
// 2. Hero — stronger promise, existing 50% offer and bonuses.
// ------------------------------------------------------------
html = html.replace('<h1>Entenda e revise <span>Língua Portuguesa</span> de um jeito muito mais visual.</h1>', '<h1>Pare de se perder em regras. <span>Domine Língua Portuguesa</span> de forma visual.</h1>');
html = html.replace('<h1 class="sm-mh-title"><span class="sm-mh-title-line sm-mh-title-line-dark">Entenda e revise</span><span class="sm-mh-title-line sm-mh-title-line-accent">Língua Portuguesa</span><span class="sm-mh-title-line sm-mh-title-line-dark sm-mh-title-tail">de um jeito muito mais visual.</span></h1>', '<h1 class="sm-mh-title"><span class="sm-mh-title-line sm-mh-title-line-dark">Pare de se perder em regras.</span><span class="sm-mh-title-line sm-mh-title-line-accent">Domine Língua Portuguesa</span><span class="sm-mh-title-line sm-mh-title-line-dark sm-mh-title-tail">de forma visual.</span></h1>');
const oldHero = 'Um acervo completo com <strong>98 Supermapas</strong>, <strong>50 Super-resumos</strong> e <strong>190 Supercards</strong> para consultar regras, organizar conteúdos e revisar com mais clareza e praticidade.';
const newHero = 'Domine os principais conteúdos de Língua Portuguesa com <strong>98 Supermapas</strong> e receba <strong>50 Super-resumos + 190 Supercards como bônus</strong> para revisar e reforçar o que estudou.';
html = html.split(oldHero).join(newHero);
const badge = '<div class="sm-hero-offer-badge-v3"><strong>50% OFF</strong><span>oferta atual + 2 bônus</span></div>';
html = html.replace('<div class="sm-dh-copy">', '<div class="sm-dh-copy">' + badge);
html = html.replace('<div class="sm-mh-copy">', '<div class="sm-mh-copy">' + badge);

// ------------------------------------------------------------
// 3. O que você recebe — three optimized carousels.
// ------------------------------------------------------------
const MAPS = [
 ['1a67b8_3e827dcacabe4d1b88a221cb0ca6b105~mv2.png','Conjunções coordenativas'],
 ['1a67b8_30dae8421505424690773b1fec45576c~mv2.png','Termos integrantes da oração'],
 ['1a67b8_c3225c09f1d342eb80d4ecad55949b12~mv2.png','Concordância verbal'],
 ['1a67b8_ac2d2e76c7284c5884b89c37cc468ebc~mv2.png','Uso da vírgula'],
 ['1a67b8_4a00ecc7a0714bc4946bbc1cdafdd8e8~mv2.png','Figuras de pensamento'],
 ['1a67b8_ee950fcb35dd46d6aa3cac85c3018a1e~mv2.png','Classificação dos verbos'],
 ['1a67b8_671c4f73838544f99f02cf381f2c30d0~mv2.png','Vozes verbais'],
 ['1a67b8_b19132c7753849e08a076d81791245a4~mv2.png','Crase']
];
const SUMMARIES = [
 ['1a67b8_3a2c655dbe054c83beb2a5f85ec903e6~mv2.png','Classificação dos substantivos'],
 ['1a67b8_2f6efc79faaa42c7b15aeb08d7520926~mv2.png','Uso dos porquês'],
 ['1a67b8_d022fe53fe6040cd953a0857c4493650~mv2.png','Principais figuras de linguagem'],
 ['1a67b8_a12af1e8987146e1abd4b95908a4044c~mv2.png','Expressões que não devem ser confundidas'],
 ['1a67b8_da7e90948a3445b2b4d952bd3bee5eb6~mv2.png','Palavras parecidas que não devem ser confundidas'],
 ['1a67b8_4838cca1ee0d4e768af18c471bf8abb2~mv2.png','Classes de palavras']
];
const CARDS = [
 ['1a67b8_ac1b846c691a46068e08876c9a5dcf47~mv2.png','Cesta, sesta, sexta e preposições'],
 ['1a67b8_3fa1f421c7464bcf9d40c7192f71ced8~mv2.png','Demais, de mais, São e Santo'],
 ['1a67b8_5b821eddb5d944448b2c689c9d819905~mv2.png','Infringir, infligir, a fim e afim'],
 ['1a67b8_3986299424e0498b919bfc6ac189e315~mv2.png','Diferir, deferir, te e ti'],
 ['1a67b8_55f3b432f4514590aba492bbe9135720~mv2.png','Viagem, viajem, detetizar e dedetizar'],
 ['1a67b8_3aacfaaf9b404c65a03f7687cc68c3d3~mv2.png','Perda, perca, em vez de e ao invés de']
];
function slides(items, kind, fit){
 return items.map(([id,title],i)=>`<img class="sm-format-carousel-slide${i===0?' is-active':''}" data-sm-carousel-slide="${i}" alt="${kind}: ${title}" loading="${i===0?'eager':'lazy'}" fetchpriority="low" decoding="async" src="https://static.wixstatic.com/media/${id}/v1/fit/${fit}/file.webp"/>`).join('');
}
function controls(){return '<button type="button" class="sm-carousel-arrow sm-carousel-prev" aria-label="Imagem anterior">‹</button><button type="button" class="sm-carousel-arrow sm-carousel-next" aria-label="Próxima imagem">›</button>';}
const mapArticle = `<article class="sm-format-v2-unit sm-format-v2-unit-map"><div class="sm-format-v2-copy"><div class="sm-format-v2-kicker"><span class="sm-format-v2-index">01</span><span class="sm-format-v2-purpose">ENTENDER E CONSULTAR</span></div><h3 class="sm-format-v2-title"><strong>98</strong><span>Supermapas</span></h3><p>Regras, relações e exemplos organizados visualmente para compreender e consultar conteúdos completos.</p></div><div class="sm-format-v2-visual sm-format-v2-map-visual sm-format-carousel" data-sm-carousel="maps"><div class="sm-format-carousel-frame"><div class="sm-format-carousel-track">${slides(MAPS,'Supermapa','w_1200,h_848')}</div></div>${controls()}</div></article>`;
const summaryArticle = `<article class="sm-format-v2-unit sm-format-v2-unit-summary"><div class="sm-format-v2-visual sm-format-v2-summary-visual sm-format-carousel" data-sm-carousel="summaries"><div class="sm-format-carousel-frame"><div class="sm-format-carousel-track">${slides(SUMMARIES,'Super-resumo','w_760,h_1080')}</div></div>${controls()}</div><div class="sm-format-v2-copy"><span class="sm-format-v2-bonus-badge">BÔNUS 1</span><div class="sm-format-v2-kicker"><span class="sm-format-v2-index">02</span><span class="sm-format-v2-purpose">REVISAR</span></div><h3 class="sm-format-v2-title"><strong>50</strong><span>Super-resumos</span></h3><p>O essencial de cada tema condensado para retomar pontos importantes com rapidez e clareza.</p></div></article>`;
const cardArticle = `<article class="sm-format-v2-unit sm-format-v2-unit-card"><div class="sm-format-v2-copy"><span class="sm-format-v2-bonus-badge">BÔNUS 2</span><div class="sm-format-v2-kicker"><span class="sm-format-v2-index">03</span><span class="sm-format-v2-purpose">REFORÇAR</span></div><h3 class="sm-format-v2-title"><strong>190</strong><span>Supercards</span></h3><p>Conceitos-chave em cards objetivos para reforçar conteúdos e fazer revisões curtas ao longo da rotina.</p></div><div class="sm-format-v2-visual sm-format-v2-card-visual sm-format-carousel" data-sm-carousel="cards"><div class="sm-format-carousel-frame"><div class="sm-format-carousel-track">${slides(CARDS,'Supercard','w_1000,h_667')}</div></div>${controls()}</div></article>`;
html = html.replace(/<article class="sm-format-v2-unit sm-format-v2-unit-map">.*?<\/article>/s, mapArticle);
html = html.replace(/<article class="sm-format-v2-unit sm-format-v2-unit-summary">.*?<\/article>/s, summaryArticle);
html = html.replace(/<article class="sm-format-v2-unit sm-format-v2-unit-card">.*?<\/article>/s, cardArticle);
html = html.replace('<span class="sm-format-v2-eyebrow">INCLUSO NO MATERIAL</span>', '<span class="sm-format-v2-eyebrow">98 SUPERMAPAS + 2 BÔNUS</span>');
html = html.replace('Supermapas para estudar, Super-resumos para revisar e Supercards para reforçar os conteúdos de Língua Portuguesa.', 'Seu material principal são os 98 Supermapas. E, para acelerar suas revisões, você ainda recebe 50 Super-resumos e 190 Supercards como bônus.');

// Remove old detailed sample section only; never touch #conteudo.
html = html.replace(/<section class="sm-inside" id="amostras".*?<\/section>(?=<section class="sm-coverage)/s, '');
html = html.replace('<a href="#amostras">Veja o material</a>', '');
html = html.replace("['Veja o material','amostras'],", '');

// ------------------------------------------------------------
// 4. Before/after — equal A4-landscape pages; slider restricted to page.
// Map is revealed on LEFT; dense text remains on RIGHT.
// ------------------------------------------------------------
const visualSection = `<section class="sm-visual-study sm-visual-compare-v3" id="estudo-visual" aria-labelledby="sm-visual-study-title"><div class="sm-vc-shell"><header class="sm-vc-intro"><span class="sm-vc-eyebrow">VEJA A DIFERENÇA NA PRÁTICA</span><h2 id="sm-visual-study-title">A mesma matéria. <span>Uma forma muito mais visual de entender.</span></h2><p>Arraste a barra e compare duas páginas do mesmo tamanho: texto corrido e Supermapa.</p></header><div class="sm-vc-stage"><div class="sm-vc-page" data-sm-before-after style="--sm-vc-position:50%"><div class="sm-vc-text-page"><span class="sm-vc-label sm-vc-label-text">TEXTO CORRIDO</span><div class="sm-vc-text-content"><h3>Crase</h3><p>A crase representa a fusão da preposição <strong>a</strong> com o artigo feminino <strong>a</strong> ou <strong>as</strong>. Para verificar sua ocorrência, é preciso observar a regência do termo anterior e identificar se o termo seguinte admite artigo feminino.</p><p>O emprego é obrigatório em construções nas quais um termo exige a preposição <strong>a</strong> e a palavra seguinte aceita artigo feminino, além de diversas locuções femininas e indicações de horas. Em certos contextos, o uso pode ser facultativo.</p><p>Não ocorre, em regra, diante de palavras masculinas, verbos no infinitivo e pronomes pessoais. Também não basta haver uma palavra feminina: é necessário que exista simultaneamente a preposição e o artigo.</p><p>Na prática, a análise depende da relação entre os termos da frase. Substituições e testes de regência ajudam a confirmar se há ou não a fusão que justifica o acento grave.</p></div></div><div class="sm-vc-map-page"><span class="sm-vc-label sm-vc-label-map">COM SUPERMAPAS</span><img src="${MAP_URL}" alt="Supermapa de Língua Portuguesa sobre crase" loading="lazy" decoding="async"/></div><div class="sm-vc-divider"><span>↔</span></div><input class="sm-vc-range" type="range" min="0" max="100" value="50" aria-label="Comparar texto corrido com Supermapas"/></div></div><div class="sm-vc-benefits"><div><b>01</b><span><strong>Encontre mais rápido</strong><small>Regras e exceções ficam visualmente separadas.</small></span></div><div><b>02</b><span><strong>Entenda as relações</strong><small>O conteúdo deixa de parecer um bloco único de texto.</small></span></div><div><b>03</b><span><strong>Revise sem reler tudo</strong><small>Volte aos pontos-chave com mais praticidade.</small></span></div></div></div></section>`;
html = html.replace(/<section class="sm-visual-study" id="estudo-visual".*?<\/section>/s, visualSection);

// ------------------------------------------------------------
// 5. Proof + creators — strengthen without inventing testimonials/credentials.
// ------------------------------------------------------------
html = html.replace('<section class="sm-proof-v2" id="prova-social"', '<section class="sm-proof-v2 sm-proof-aggressive-v3" id="prova-social"');
if (!html.includes('sm-proof-power-v3')) {
 const proofOpen = /(<section class="sm-proof-v2 sm-proof-aggressive-v3" id="prova-social"[^>]*>)/;
 html = html.replace(proofOpen, `$1<div class="sm-proof-power-v3"><span>PROVA REAL DE QUEM JÁ ESCOLHEU OS SUPERMAPAS</span><h2>Mais de <strong>20 mil pessoas</strong> já adquiriram os Supermapas.</h2><p>Veja abaixo avaliações e comentários reais de compradores.</p><div><b>+20 mil<small>compradores</small></b><b>★ 4,7/5<small>na Hotmart</small></b><b>7 dias<small>de garantia</small></b></div></div>`);
}
if (!html.includes('sm-behind-trust-v3')) {
 const creatorsOpen = /(<section class="sm-creators" id="idealizadores"[^>]*>)/;
 html = html.replace(creatorsOpen, `$1<div class="sm-behind-trust-v3"><span>QUEM CRIA TAMBÉM CUIDA DO MATERIAL</span><h2>Um projeto feito para tornar Português <strong>mais claro, visual e consultável.</strong></h2><p>O acervo é desenvolvido e aprimorado continuamente, com atenção à organização, leitura e utilidade prática.</p><div><b>✓ Material autoral</b><b>✓ Atualizações incluídas</b><b>✓ +20 mil compradores</b></div></div>`);
}

// ------------------------------------------------------------
// CSS — shadows belong to material frame, arrows stay outside left/right.
// ------------------------------------------------------------
injectHead(`<style id="sm-sales-conversion-v3-css">
.sm-hero-offer-badge-v3{display:inline-flex;align-items:center;gap:9px;width:max-content;margin:0 0 16px;padding:7px 12px 7px 8px;border-radius:999px;background:#fff4ec;border:1px solid rgba(244,105,37,.2);box-shadow:0 7px 20px rgba(90,54,26,.07)}.sm-hero-offer-badge-v3 strong{padding:6px 10px;border-radius:999px;background:linear-gradient(135deg,#f36a25,#ff466c);color:#fff;font-size:12px;font-weight:950}.sm-hero-offer-badge-v3 span{font-size:12px;font-weight:850;color:#6b5c54}
.sm-format-v2-bonus-badge{display:inline-flex!important;width:max-content;padding:10px 19px!important;margin:0 0 16px!important;border-radius:999px!important;background:linear-gradient(135deg,#f36a25,#ff496b)!important;color:#fff!important;font-size:13px!important;font-weight:950!important;letter-spacing:.12em!important;box-shadow:0 10px 24px rgba(243,106,37,.22)!important}
.sm-format-carousel{position:relative!important;overflow:visible!important}.sm-format-carousel-frame{position:absolute;inset:5%;overflow:visible;border-radius:8px;filter:drop-shadow(0 18px 18px rgba(41,31,78,.16)) drop-shadow(0 -8px 12px rgba(41,31,78,.08)) drop-shadow(10px 0 12px rgba(41,31,78,.06)) drop-shadow(-10px 0 12px rgba(41,31,78,.06))}.sm-format-carousel-track{position:relative;width:100%;height:100%;overflow:hidden;border-radius:6px;background:#fff}.sm-format-carousel-slide{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;object-fit:contain!important;object-position:50% 50%!important;opacity:0;transform:none!important;transition:opacity .42s ease!important;pointer-events:none;background:#fff}.sm-format-carousel-slide.is-active{opacity:1}.sm-carousel-arrow{position:absolute;z-index:9;top:50%;transform:translateY(-50%);display:grid;place-items:center;width:42px;height:42px;padding:0;border:1px solid rgba(110,86,205,.18);border-radius:50%;background:#fff;box-shadow:0 9px 26px rgba(55,40,107,.16);color:#6f57cc;font:700 30px/1 Arial,sans-serif;cursor:pointer}.sm-carousel-prev{left:-18px}.sm-carousel-next{right:-18px}.sm-format-v2-unit-card .sm-format-carousel-frame{inset:10% 7%}.sm-format-v2-unit-card .sm-format-carousel-slide{object-fit:contain!important;object-position:center!important}
.sm-visual-compare-v3{padding:92px 24px;background:#fff}.sm-vc-shell{width:min(1180px,100%);margin:auto}.sm-vc-intro{text-align:center;max-width:850px;margin:0 auto 40px}.sm-vc-eyebrow{display:inline-block;margin-bottom:12px;color:#7357d7;font-size:12px;font-weight:900;letter-spacing:.16em}.sm-vc-intro h2{margin:0;color:#292534;font-size:clamp(34px,5vw,60px);line-height:1;letter-spacing:-.045em}.sm-vc-intro h2 span{color:#7559df}.sm-vc-intro p{max-width:700px;margin:18px auto 0;color:#6f6978;font-size:17px;line-height:1.6}.sm-vc-stage{width:min(1050px,100%);margin:auto;padding:22px}.sm-vc-page{position:relative;width:100%;aspect-ratio:3508/2480;background:#fff;box-shadow:0 24px 52px rgba(45,34,83,.18),0 7px 18px rgba(45,34,83,.10);overflow:hidden}.sm-vc-text-page,.sm-vc-map-page{position:absolute;inset:0;background:#fff}.sm-vc-text-page{z-index:1}.sm-vc-text-content{height:100%;box-sizing:border-box;padding:7% 8%;display:flex;flex-direction:column;justify-content:flex-start}.sm-vc-text-content h3{margin:3% 0 4%;font-size:clamp(28px,3.5vw,48px);line-height:1;color:#302a39}.sm-vc-text-content p{margin:0 0 2.6%;font-size:clamp(12px,1.2vw,16px);line-height:1.72;color:#57515e;text-align:justify}.sm-vc-map-page{z-index:2;clip-path:inset(0 calc(100% - var(--sm-vc-position)) 0 0)}.sm-vc-map-page img{width:100%;height:100%;display:block;object-fit:contain;background:#fff}.sm-vc-label{position:absolute;z-index:4;top:18px;padding:8px 12px;border-radius:999px;font-size:10px;font-weight:900;letter-spacing:.1em}.sm-vc-label-map{left:18px;background:#7458dd;color:#fff}.sm-vc-label-text{right:18px;background:#f1edfb;color:#6f59c7}.sm-vc-divider{position:absolute;z-index:5;top:0;bottom:0;left:var(--sm-vc-position);width:3px;background:#fff;box-shadow:0 0 0 1px rgba(83,60,169,.15);transform:translateX(-50%);pointer-events:none}.sm-vc-divider span{position:absolute;top:50%;left:50%;display:grid;place-items:center;width:56px;height:56px;border-radius:50%;background:#fff;color:#7559df;font-size:22px;box-shadow:0 10px 28px rgba(54,38,112,.22);transform:translate(-50%,-50%)}.sm-vc-range{position:absolute;z-index:6;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:ew-resize}.sm-vc-benefits{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:22px auto 0;width:min(1050px,100%)}.sm-vc-benefits>div{display:flex;gap:14px;padding:18px 20px;border:1px solid #ece8f5;border-radius:18px;background:#fff;box-shadow:0 10px 30px rgba(54,43,99,.05)}.sm-vc-benefits b{display:grid;place-items:center;flex:0 0 38px;height:38px;border-radius:12px;background:#f0ebff;color:#7155d4}.sm-vc-benefits span{display:flex;flex-direction:column;gap:4px}.sm-vc-benefits strong{font-size:14px;color:#302c3b}.sm-vc-benefits small{font-size:12px;color:#777180;line-height:1.45}
.sm-proof-power-v3{max-width:1120px;margin:0 auto 38px;padding:38px;text-align:center;border:1px solid rgba(116,85,211,.16);border-radius:28px;background:linear-gradient(145deg,#fff,#f6f2ff);box-shadow:0 22px 55px rgba(55,38,105,.09)}.sm-proof-power-v3>span,.sm-behind-trust-v3>span{display:block;color:#7657d8;font-size:11px;font-weight:900;letter-spacing:.15em;margin-bottom:10px}.sm-proof-power-v3 h2,.sm-behind-trust-v3 h2{margin:0 auto;font-size:clamp(28px,3.5vw,45px);line-height:1.07;letter-spacing:-.035em}.sm-proof-power-v3 h2 strong,.sm-behind-trust-v3 h2 strong{color:#7657d8}.sm-proof-power-v3 p{margin:12px auto 20px;color:#716a7c}.sm-proof-power-v3>div{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.sm-proof-power-v3 b{padding:15px;border-radius:16px;background:#fff;font-size:21px}.sm-proof-power-v3 small{display:block;margin-top:4px;font-size:11px;color:#777181}.sm-behind-trust-v3{max-width:1050px;margin:0 auto 32px;padding:32px 36px;border-radius:26px;background:linear-gradient(135deg,#2e283b,#44365f);color:#fff}.sm-behind-trust-v3>span{color:#cbbcff}.sm-behind-trust-v3 p{max-width:760px;color:rgba(255,255,255,.78);line-height:1.6}.sm-behind-trust-v3>div{display:flex;gap:9px;flex-wrap:wrap}.sm-behind-trust-v3 b{padding:8px 12px;border-radius:999px;background:rgba(255,255,255,.1);font-size:12px}
@media(max-width:720px){.sm-hero-offer-badge-v3{margin:0 auto 14px}.sm-format-v2-bonus-badge{padding:8px 14px!important;font-size:11px!important}.sm-format-carousel-frame{inset:6%}.sm-carousel-arrow{width:36px;height:36px;font-size:25px}.sm-carousel-prev{left:-11px}.sm-carousel-next{right:-11px}.sm-format-v2-unit-card .sm-format-carousel-frame{inset:12% 6%}.sm-visual-compare-v3{padding:62px 12px}.sm-vc-stage{padding:12px}.sm-vc-page{aspect-ratio:3508/2480}.sm-vc-intro h2{font-size:35px}.sm-vc-intro p{font-size:15px}.sm-vc-text-content{padding:9%}.sm-vc-text-content h3{font-size:24px;margin-top:5%}.sm-vc-text-content p{font-size:9.5px;line-height:1.55;margin-bottom:2.3%}.sm-vc-label{top:9px;padding:6px 8px;font-size:8px}.sm-vc-label-map{left:9px}.sm-vc-label-text{right:9px}.sm-vc-divider span{width:44px;height:44px;font-size:18px}.sm-vc-benefits{grid-template-columns:1fr}.sm-proof-power-v3{margin:0 14px 28px;padding:26px 18px}.sm-proof-power-v3>div{grid-template-columns:1fr}.sm-behind-trust-v3{margin:0 14px 28px;padding:26px 20px}.sm-behind-trust-v3>div{display:grid}}
</style>`);

// ------------------------------------------------------------
// JS — faster carousel, side arrows, 50/50 slider.
// ------------------------------------------------------------
injectBody(`<script id="sm-sales-conversion-v3-js">(function(){
 document.querySelectorAll('[data-sm-carousel]').forEach(function(root){var slides=[].slice.call(root.querySelectorAll('[data-sm-carousel-slide]'));if(slides.length<2)return;var i=0,t=null,delay=2200;function show(n){slides[i].classList.remove('is-active');i=(n+slides.length)%slides.length;slides[i].classList.add('is-active')}function stop(){if(t){clearInterval(t);t=null}}function start(){stop();if(!document.hidden)t=setInterval(function(){show(i+1)},delay)}var p=root.querySelector('.sm-carousel-prev'),n=root.querySelector('.sm-carousel-next');if(p)p.addEventListener('click',function(e){e.preventDefault();show(i-1);start()});if(n)n.addEventListener('click',function(e){e.preventDefault();show(i+1);start()});root.addEventListener('mouseenter',stop);root.addEventListener('mouseleave',start);document.addEventListener('visibilitychange',function(){document.hidden?stop():start()});start()});
 var cmp=document.querySelector('[data-sm-before-after]');if(cmp){var range=cmp.querySelector('.sm-vc-range');function update(){cmp.style.setProperty('--sm-vc-position',range.value+'%')}range.addEventListener('input',update,{passive:true});update()}
})();</script>`);

// Guardrails: the approved searchable catalog MUST survive untouched.
if (!html.includes('id="sm-catalog-search-input"')) throw new Error('Searchable content catalog disappeared — refusing build.');
if (!html.includes('class="sm-catalog-groups"')) throw new Error('Expandable content topics disappeared — refusing build.');
if (!html.includes('data-sm-carousel="maps"') || !html.includes('data-sm-carousel="summaries"') || !html.includes('data-sm-carousel="cards"')) throw new Error('Carousel materialization incomplete.');
if (html.includes('id="amostras"')) throw new Error('Old samples section still present.');
if (!html.includes(CTA)) throw new Error('CTA replacement failed.');

fs.writeFileSync(target, html);
console.log('Sales conversion v3 applied on production base; searchable catalog preserved.');
