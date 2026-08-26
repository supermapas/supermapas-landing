import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/proof-real-screenshots-v1.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

const images = {
  classroom: 'https://static.wixstatic.com/media/1a67b8_36b304da980743f08b402e9c86d3944c~mv2.jpg',
  praise: 'https://static.wixstatic.com/media/1a67b8_e0f878659a9e417da687cd45461e1858~mv2.jpg',
  laptop: 'https://static.wixstatic.com/media/1a67b8_ed632738abe6458181c2bbb55a248cc2~mv2.jpg',
  thanks: 'https://static.wixstatic.com/media/1a67b8_85c67d5be00d4adea985d0305a1d9e68~mv2.jpg',
  organized: 'https://static.wixstatic.com/media/1a67b8_788febeffa3b4c58ad7abd76799fa0a5~mv2.jpg',
  acquisition: 'https://static.wixstatic.com/media/1a67b8_4bbdfa5baded403c954b4aaab0d2b5b1~mv2.jpg',
  professor: 'https://static.wixstatic.com/media/1a67b8_256fd895fe2148c08266da2a7f44faaf~mv2.jpg',
  review: 'https://static.wixstatic.com/media/1a67b8_eac987958b7e4358b49d53b009d5e275~mv2.jpg',
  louise: 'https://static.wixstatic.com/media/1a67b8_6056a5f7db6f496281d860d9ce821fe6~mv2.jpg',
  comment: 'https://static.wixstatic.com/media/1a67b8_b798185000de41c2b635b3ad87c61568~mv2.jpg',
  craft: 'https://static.wixstatic.com/media/1a67b8_3f77f3f1c973433daff15ebbb63a3d38~mv2.jpg'
};

const section = `<section class="sm-proof-real" id="prova-social" aria-labelledby="sm-proof-real-title">
  <div class="sm-proof-real-shell">
    <header class="sm-proof-real-head">
      <span class="sm-proof-real-eyebrow">QUEM COMPRA, USA E RECOMENDA</span>
      <h2 id="sm-proof-real-title">Não é só uma nota alta. <span>É gente usando os Supermapas de verdade.</span></h2>
      <p>Avaliação na Hotmart, milhares de compradores e registros reais de professores e estudantes usando e recomendando o material.</p>
    </header>

    <div class="sm-proof-real-stats" aria-label="Prova social dos Supermapas">
      <article class="sm-proof-real-stat sm-proof-real-stat--rating">
        <span>NOTA NA HOTMART</span>
        <div><strong>4,7</strong><small>/5</small></div>
        <b aria-label="Cinco estrelas">★★★★★</b>
        <p>Avaliação do produto na plataforma de compra.</p>
      </article>
      <article class="sm-proof-real-stat sm-proof-real-stat--buyers">
        <span>QUEM JÁ ADQUIRIU</span>
        <div><strong>+20 mil</strong></div>
        <b>pessoas</b>
        <p>já compraram os Supermapas ao longo da história do projeto.</p>
      </article>
    </div>

    <div class="sm-proof-real-use-head">
      <span>USO REAL</span>
      <h3>Dos arquivos para a aula, a revisão e o estudo.</h3>
    </div>

    <div class="sm-proof-real-use">
      <figure class="sm-proof-real-use-card sm-proof-real-use-card--classroom">
        <div><img src="${images.classroom}" alt="Supermapas sendo projetados e utilizados em sala de aula" loading="lazy" decoding="async"/></div>
        <figcaption><span>EM SALA DE AULA</span><strong>Material sendo usado por professores com a turma.</strong></figcaption>
      </figure>
      <figure class="sm-proof-real-use-card sm-proof-real-use-card--laptop">
        <div><img src="${images.laptop}" alt="Supermapas sendo usados em revisão para prova de gramática" loading="lazy" decoding="async"/></div>
        <figcaption><span>NA REVISÃO</span><strong>Supermapas usados como apoio para revisar conteúdos.</strong></figcaption>
      </figure>
    </div>

    <div class="sm-proof-real-messages-head">
      <div><span>PRINTS REAIS</span><h3>O que chega para a gente depois da compra.</h3></div>
      <p>Mensagens e comentários enviados por quem adquiriu o material.</p>
    </div>

    <div class="sm-proof-real-messages" aria-label="Depoimentos reais em capturas de tela">
      <figure><img src="${images.praise}" alt="Mensagem elogiando a riqueza dos mapas mentais e dizendo que valeu cada centavo" loading="lazy" decoding="async"/></figure>
      <figure><img src="${images.acquisition}" alt="Mensagem dizendo que os Supermapas foram a melhor aquisição dos últimos meses" loading="lazy" decoding="async"/></figure>
      <figure><img src="${images.professor}" alt="Mensagem de professor dizendo que usará os mapas como facilitador nas aulas" loading="lazy" decoding="async"/></figure>
      <figure><img src="${images.review}" alt="Mensagem dizendo que os mapas ajudam a revisar o conteúdo em instantes" loading="lazy" decoding="async"/></figure>
      <figure><img src="${images.craft}" alt="Mensagem elogiando o material, o capricho e a dedicação" loading="lazy" decoding="async"/></figure>
      <figure><img src="${images.organized}" alt="Mensagem dizendo que o material é lindo e organizado" loading="lazy" decoding="async"/></figure>
      <figure><img src="${images.thanks}" alt="Mensagem agradecendo pelo atendimento e elogiando a qualidade e didática dos mapas" loading="lazy" decoding="async"/></figure>
      <figure><img src="${images.louise}" alt="Comentário dizendo que os Supermapas são maravilhosos" loading="lazy" decoding="async"/></figure>
      <figure><img src="${images.comment}" alt="Comentário dizendo que os Supermapas são muito bons e incríveis" loading="lazy" decoding="async"/></figure>
    </div>
  </div>
</section>`;

const re = /<section class="sm-proof-v2[\s\S]*?<\/section>(?=<section class="sm-offer-close")/;
if (!re.test(html)) throw new Error('Current proof section not found.');
html = html.replace(re, section);

const css = `<style id="sm-proof-real-screenshots-v1">
.sm-proof-real{padding:clamp(48px,5.5vw,78px) 0 clamp(72px,8vw,112px);background:linear-gradient(180deg,#fff 0%,#faf8ff 48%,#fff 100%);color:#251f2e}
.sm-proof-real-shell{width:min(1180px,calc(100% - 48px));margin:0 auto}
.sm-proof-real-head{max-width:1080px;margin:0 auto 34px;text-align:center}.sm-proof-real-eyebrow{display:inline-flex;align-items:center;justify-content:center;width:min(760px,86%);min-height:54px;margin:0 0 18px;padding:10px 28px;box-sizing:border-box;border:1.5px solid rgba(112,86,217,.20);border-radius:999px;background:#f3efff;color:#7056d9;font-size:14px;line-height:1;font-weight:900;letter-spacing:.18em}.sm-proof-real-use-head>span,.sm-proof-real-messages-head span{display:inline-block;color:#7056d9;font-size:11px;font-weight:950;letter-spacing:.16em}.sm-proof-real-head h2{max-width:1080px;margin:0 auto 14px;font-size:clamp(50px,5.7vw,82px);line-height:.95;letter-spacing:-.048em}.sm-proof-real-head h2 span{color:#7056d9}.sm-proof-real-head p{max-width:780px;margin:0 auto;color:#6d6575;font-size:16px;line-height:1.55}
.sm-proof-real-stats{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:34px 0 52px}.sm-proof-real-stat{position:relative;overflow:hidden;min-height:190px;padding:28px 30px;border:1px solid rgba(112,86,217,.16);border-radius:26px;background:#fff;box-shadow:0 18px 46px rgba(58,43,103,.08)}.sm-proof-real-stat:after{content:"";position:absolute;width:160px;height:160px;border-radius:50%;right:-60px;top:-70px;background:radial-gradient(circle,rgba(112,86,217,.13),rgba(112,86,217,0) 70%)}.sm-proof-real-stat>span{display:block;color:#7a6ac2;font-size:10px;font-weight:950;letter-spacing:.15em}.sm-proof-real-stat>div{display:flex;align-items:baseline;gap:7px;margin:11px 0 4px}.sm-proof-real-stat strong{font-size:56px;line-height:.95;letter-spacing:-.055em}.sm-proof-real-stat small{font-size:23px;color:#81798a}.sm-proof-real-stat>b{display:block;color:#f2a400;font-size:19px;letter-spacing:.08em}.sm-proof-real-stat--buyers>b{color:#7056d9;font-size:16px;letter-spacing:.02em}.sm-proof-real-stat p{max-width:420px;margin:10px 0 0;color:#726a7a;font-size:13px;line-height:1.45}
.sm-proof-real-use-head{display:flex;align-items:end;justify-content:space-between;gap:24px;margin-bottom:18px}.sm-proof-real-use-head h3{max-width:720px;margin:7px 0 0;font-size:32px;line-height:1.06;letter-spacing:-.035em}.sm-proof-real-use{display:grid;grid-template-columns:1.55fr .75fr;gap:16px;margin-bottom:48px}.sm-proof-real-use-card{margin:0;overflow:hidden;border:1px solid rgba(75,60,107,.12);border-radius:24px;background:#fff;box-shadow:0 18px 44px rgba(58,43,103,.10)}.sm-proof-real-use-card>div{position:relative;overflow:hidden;background:#eee}.sm-proof-real-use-card--classroom>div{aspect-ratio:1.48/1}.sm-proof-real-use-card--laptop>div{aspect-ratio:.78/1}.sm-proof-real-use-card img{width:100%;height:100%;display:block;object-fit:cover}.sm-proof-real-use-card figcaption{padding:17px 19px 19px}.sm-proof-real-use-card figcaption span{display:block;margin-bottom:5px;color:#7056d9;font-size:9px;font-weight:950;letter-spacing:.14em}.sm-proof-real-use-card figcaption strong{font-size:15px;line-height:1.32}
.sm-proof-real-messages-head{display:flex;justify-content:space-between;align-items:end;gap:28px;margin-bottom:18px}.sm-proof-real-messages-head h3{margin:7px 0 0;font-size:30px;line-height:1.05;letter-spacing:-.03em}.sm-proof-real-messages-head p{max-width:360px;margin:0;color:#716979;font-size:13px;line-height:1.45;text-align:right}.sm-proof-real-messages{columns:3 300px;column-gap:14px}.sm-proof-real-messages figure{break-inside:avoid;margin:0 0 14px;padding:8px;border:1px solid rgba(74,60,104,.12);border-radius:18px;background:#fff;box-shadow:0 12px 30px rgba(58,43,103,.07);overflow:hidden}.sm-proof-real-messages img{display:block;width:100%;height:auto;border-radius:12px;background:#111}
@media(max-width:760px){.sm-proof-real{padding:34px 0 68px}.sm-proof-real-shell{width:calc(100% - 28px)}.sm-proof-real-head{max-width:none;margin-bottom:26px}.sm-proof-real-eyebrow{width:88%;min-height:46px;margin-bottom:14px;padding:9px 18px;font-size:11.5px;letter-spacing:.15em}.sm-proof-real-head h2{width:100%;max-width:none;margin-bottom:14px;font-size:clamp(40px,10.8vw,50px);line-height:.94}.sm-proof-real-head p{font-size:14px}.sm-proof-real-stats{grid-template-columns:1fr;gap:11px;margin:26px 0 38px}.sm-proof-real-stat{min-height:0;padding:22px 20px;border-radius:21px}.sm-proof-real-stat strong{font-size:48px}.sm-proof-real-use-head{display:block;margin-bottom:14px}.sm-proof-real-use-head h3{font-size:27px}.sm-proof-real-use{grid-template-columns:1fr;gap:12px;margin-bottom:38px}.sm-proof-real-use-card--classroom>div{aspect-ratio:1.48/1}.sm-proof-real-use-card--laptop>div{aspect-ratio:1.05/1}.sm-proof-real-use-card--laptop img{object-position:center 33%}.sm-proof-real-messages-head{display:block;margin-bottom:12px}.sm-proof-real-messages-head h3{font-size:27px}.sm-proof-real-messages-head p{margin-top:8px;text-align:left}.sm-proof-real-messages{display:flex!important;columns:auto!important;align-items:center!important;gap:12px!important;margin:0 -14px!important;padding:4px 14px 10px!important;overflow-x:auto!important;overflow-y:visible!important;scroll-snap-type:x mandatory!important;scrollbar-width:none!important}.sm-proof-real-messages::-webkit-scrollbar{display:none}.sm-proof-real-messages figure{display:block!important;flex:0 0 auto!important;width:84vw!important;max-width:420px!important;height:auto!important;min-height:0!important;margin:0!important;padding:0!important;border:0!important;border-radius:16px!important;background:transparent!important;box-shadow:0 10px 26px rgba(58,43,103,.10)!important;overflow:hidden!important;scroll-snap-align:center!important}.sm-proof-real-messages img{display:block!important;width:100%!important;height:auto!important;max-height:none!important;margin:0!important;border-radius:16px!important;background:transparent!important;object-fit:contain!important}}
@media(max-width:430px){.sm-proof-real-eyebrow{width:92%;min-height:44px;font-size:11px}.sm-proof-real-head h2{font-size:clamp(38px,10.5vw,46px)}}
</style>`;
html = html.replace('</head>', css + '</head>');

fs.writeFileSync(target, html);
console.log('Proof section rebuilt with standardized eyebrow, tighter spacing, stronger title and natural mobile screenshot cards.');