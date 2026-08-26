import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/audience-pain-bridge-v1.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

const professor = 'https://static.wixstatic.com/media/1a67b8_9d104cc15aac4cf990999ceec9b87dda~mv2.png/v1/fit/w_800,h_1000/file.webp';
const student = 'https://static.wixstatic.com/media/1a67b8_499a570994f64b30bc06b1a02a0e8bde~mv2.png/v1/fit/w_800,h_1000/file.webp';
const exam = 'https://static.wixstatic.com/media/1a67b8_a19b08525d54425db9c3a4055a32ff01~mv2.png/v1/fit/w_800,h_1000/file.webp';

/* Remove the old, long audience section from its previous lower position. */
html = html.replace(/<section class="sm-audience-use" id="publicos"[\s\S]*?<\/section>/, '');

const section = `<section class="sm-pain-audience" id="publicos" aria-labelledby="sm-pain-audience-title">
  <div class="sm-pain-shell">
    <header class="sm-pain-head">
      <span class="sm-pain-eyebrow">VOCÊ SE RECONHECE NISSO?</span>
      <h2 id="sm-pain-audience-title">Português não precisa parecer <span>um amontoado de regras.</span></h2>
      <p>Professor, concurseiro ou estudante: quando a informação fica espalhada, até revisar o que você já estudou pode consumir tempo demais.</p>
    </header>

    <div class="sm-pain-cards" aria-label="Dores de professores, concurseiros e estudantes">
      <article class="sm-pain-card sm-pain-card--purple">
        <div class="sm-pain-visual"><span class="sm-pain-number">01</span><span class="sm-pain-halo"></span><img src="${professor}" alt="Ilustração representando professores" loading="lazy" decoding="async"/></div>
        <div class="sm-pain-copy"><span class="sm-pain-role">PARA PROFESSORES</span><h3>Horas preparando resumos que ainda precisam ficar claros para a turma.</h3><p>Quando você precisa organizar regras, exemplos e exceções antes mesmo de começar a montar a aula.</p><div class="sm-pain-chips"><span>MENOS TEMPO PREPARANDO</span><span>MAIS CLAREZA NA AULA</span></div></div>
      </article>

      <article class="sm-pain-card sm-pain-card--orange">
        <div class="sm-pain-visual"><span class="sm-pain-number">02</span><span class="sm-pain-halo"></span><img src="${exam}" alt="Ilustração representando concurseiros" loading="lazy" decoding="async"/></div>
        <div class="sm-pain-copy"><span class="sm-pain-role">PARA CONCURSEIROS</span><h3>Você estuda uma regra hoje e poucos dias depois precisa procurar tudo de novo.</h3><p>Na revisão, o tempo vai embora tentando reencontrar exatamente aquela regra, exceção ou diferença que já apareceu antes.</p><div class="sm-pain-chips"><span>REVISÃO MAIS RÁPIDA</span><span>MENOS INFORMAÇÃO PERDIDA</span></div></div>
      </article>

      <article class="sm-pain-card sm-pain-card--teal">
        <div class="sm-pain-visual"><span class="sm-pain-number">03</span><span class="sm-pain-halo"></span><img src="${student}" alt="Ilustração representando estudantes" loading="lazy" decoding="async"/></div>
        <div class="sm-pain-copy"><span class="sm-pain-role">PARA ESTUDANTES</span><h3>Você abre uma apostila e parece que todas as informações têm a mesma importância.</h3><p>Textos longos dificultam enxergar o que é regra principal, o que é exemplo e o que é exceção.</p><div class="sm-pain-chips"><span>MAIS ORGANIZAÇÃO</span><span>MENOS CONFUSÃO</span></div></div>
      </article>
    </div>

    <div class="sm-pain-turn">
      <span class="sm-pain-turn-mark" aria-hidden="true">✦</span>
      <div><small>A VIRADA</small><h3>O problema não é estudar pouco. <span>É tentar aprender informação demais sem uma organização visual clara.</span></h3></div>
    </div>

    <div class="sm-pain-transform" aria-label="Como a organização visual transforma o estudo">
      <div><span class="sm-pain-before">REGRA ESPALHADA</span><b aria-hidden="true">→</b><span class="sm-pain-after">CONTEÚDO ORGANIZADO</span></div>
      <div><span class="sm-pain-before">TEXTO DIFÍCIL DE CONSULTAR</span><b aria-hidden="true">→</b><span class="sm-pain-after">VISÃO RÁPIDA DO ASSUNTO</span></div>
      <div><span class="sm-pain-before">RELEITURA CONSTANTE</span><b aria-hidden="true">→</b><span class="sm-pain-after">REVISÃO VISUAL</span></div>
    </div>

    <footer class="sm-pain-close"><span>É exatamente esse excesso de informação solta que os Supermapas transformam em uma visão organizada.</span></footer>
  </div>
</section>`;

/* Insert immediately after both hero variants and before "O que você recebe". */
const formatMarker = '<section class="sm-format-v2" id="formatos"';
if (!html.includes(formatMarker)) throw new Error('Format section marker not found.');
html = html.replace(formatMarker, section + formatMarker);

/* Desktop header navigation should reflect the new on-page order. */
html = html.replace('<a href="#formatos">O que você recebe</a><a href="#conteudo">Conteúdos</a><a href="#publicos">Para quem é?</a>', '<a href="#publicos">Para quem é?</a><a href="#formatos">O que você recebe</a><a href="#conteudo">Conteúdos</a>');

const css = `<style id="sm-audience-pain-bridge-v1">
.sm-pain-audience{background:linear-gradient(180deg,#fff 0%,#fbfaff 54%,#fff 100%);padding:clamp(60px,7vw,102px) 0;overflow:hidden;color:#211d29}
.sm-pain-shell{width:min(1180px,calc(100% - 48px));margin:0 auto}
.sm-pain-head{max-width:860px;margin:0 auto 42px;text-align:center}
.sm-pain-eyebrow{display:inline-flex;align-items:center;justify-content:center;padding:9px 14px;border:1px solid rgba(112,86,217,.2);border-radius:999px;background:#f3efff;color:#7056d9;font-size:12px;font-weight:900;letter-spacing:.16em}
.sm-pain-head h2{margin:18px 0 14px;font-size:clamp(38px,4.8vw,68px);line-height:.96;letter-spacing:-.045em;font-weight:900}
.sm-pain-head h2 span{color:#7056d9}
.sm-pain-head p{max-width:760px;margin:0 auto;color:#655e6c;font-size:17px;line-height:1.55}
.sm-pain-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;align-items:stretch}
.sm-pain-card{--accent:#7056d9;--soft:#f3efff;position:relative;overflow:hidden;display:flex;flex-direction:column;min-height:560px;background:#fff;border:1px solid color-mix(in srgb,var(--accent) 18%,transparent);border-radius:28px;box-shadow:0 18px 45px rgba(54,39,84,.09)}
.sm-pain-card--orange{--accent:#ef7b13;--soft:#fff3e8}
.sm-pain-card--teal{--accent:#18a99b;--soft:#eafaf7}
.sm-pain-visual{position:relative;height:245px;display:flex;align-items:flex-end;justify-content:center;background:linear-gradient(180deg,var(--soft),#fff);overflow:hidden}
.sm-pain-halo{position:absolute;width:220px;height:220px;border-radius:50%;background:var(--soft);filter:blur(1px);top:30px}
.sm-pain-visual:after{content:"";position:absolute;left:26px;right:26px;bottom:0;height:1px;background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--accent) 24%,transparent),transparent)}
.sm-pain-visual img{position:relative;z-index:1;display:block;width:auto;height:222px;max-width:78%;object-fit:contain;object-position:center bottom}
.sm-pain-number{position:absolute;z-index:3;left:20px;top:18px;display:grid;place-items:center;width:42px;height:42px;border-radius:13px;background:var(--accent);color:#fff;font-size:12px;font-weight:900;box-shadow:0 8px 18px color-mix(in srgb,var(--accent) 26%,transparent)}
.sm-pain-copy{display:flex;flex:1;flex-direction:column;padding:25px 24px 24px}
.sm-pain-role{color:var(--accent);font-size:12px;font-weight:950;letter-spacing:.13em}
.sm-pain-copy h3{margin:11px 0 12px;font-size:24px;line-height:1.08;letter-spacing:-.035em}
.sm-pain-copy p{margin:0;color:#68616f;font-size:15px;line-height:1.5}
.sm-pain-chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:auto;padding-top:20px}
.sm-pain-chips span{padding:8px 10px;border-radius:999px;background:var(--soft);color:var(--accent);font-size:10px;font-weight:900;letter-spacing:.06em}
.sm-pain-card:nth-child(2){transform:translateY(-8px)}
.sm-pain-turn{position:relative;display:grid;grid-template-columns:auto 1fr;align-items:center;gap:20px;margin:42px 0 18px;padding:26px 30px;border:1px solid rgba(112,86,217,.16);border-radius:24px;background:linear-gradient(135deg,#2d2440 0%,#4b347f 52%,#684cd2 100%);box-shadow:0 18px 40px rgba(66,48,113,.16);color:#fff}
.sm-pain-turn-mark{display:grid;place-items:center;width:56px;height:56px;border-radius:17px;background:#fff;color:#7056d9;font-size:24px;font-weight:900}
.sm-pain-turn small{display:block;margin-bottom:5px;color:#d9cffd;font-size:11px;font-weight:900;letter-spacing:.15em}
.sm-pain-turn h3{margin:0;font-size:clamp(22px,2.6vw,34px);line-height:1.08;letter-spacing:-.03em}
.sm-pain-turn h3 span{color:#e7ddff}
.sm-pain-transform{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.sm-pain-transform>div{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px;min-height:92px;padding:14px;border:1px solid rgba(55,44,76,.09);border-radius:18px;background:#fff;box-shadow:0 10px 26px rgba(56,43,82,.06)}
.sm-pain-transform span{display:grid;place-items:center;min-height:56px;padding:9px;border-radius:13px;text-align:center;font-size:11px;line-height:1.22;font-weight:900;letter-spacing:.045em}
.sm-pain-before{background:#f5f2f7;color:#756e7b}
.sm-pain-after{background:#f0ecff;color:#674bd5}
.sm-pain-transform b{color:#7056d9;font-size:18px}
.sm-pain-close{max-width:820px;margin:24px auto 0;text-align:center;color:#494151;font-size:18px;line-height:1.5;font-weight:750}

@media(max-width:900px){
  .sm-pain-cards{grid-template-columns:1fr;gap:14px}
  .sm-pain-card,.sm-pain-card:nth-child(2){transform:none;min-height:0;display:grid;grid-template-columns:38% 62%;align-items:stretch}
  .sm-pain-visual{height:auto;min-height:300px}
  .sm-pain-visual img{height:270px;max-width:88%}
  .sm-pain-copy{padding:28px 24px}
  .sm-pain-transform{grid-template-columns:1fr}
}
@media(max-width:640px){
  .sm-pain-audience{padding:46px 0 52px}
  .sm-pain-shell{width:calc(100% - 28px)}
  .sm-pain-head{margin-bottom:26px}
  .sm-pain-eyebrow{padding:8px 12px;font-size:10px}
  .sm-pain-head h2{margin:14px 0 12px;font-size:clamp(34px,9.6vw,44px);line-height:.98}
  .sm-pain-head p{font-size:15px;line-height:1.45}
  .sm-pain-cards{gap:12px}
  .sm-pain-card{grid-template-columns:34% 66%;border-radius:22px}
  .sm-pain-visual{min-height:238px}
  .sm-pain-visual img{height:215px;max-width:94%;transform:translateX(3px)}
  .sm-pain-number{left:12px;top:12px;width:34px;height:34px;border-radius:10px;font-size:10px}
  .sm-pain-copy{padding:20px 16px 18px}
  .sm-pain-role{font-size:10px}
  .sm-pain-copy h3{margin:8px 0 9px;font-size:19px;line-height:1.06}
  .sm-pain-copy p{font-size:13px;line-height:1.4}
  .sm-pain-chips{gap:5px;padding-top:14px}
  .sm-pain-chips span{padding:6px 7px;font-size:8.5px}
  .sm-pain-turn{grid-template-columns:auto 1fr;gap:12px;margin:24px 0 12px;padding:18px;border-radius:19px}
  .sm-pain-turn-mark{width:42px;height:42px;border-radius:13px;font-size:18px}
  .sm-pain-turn h3{font-size:20px}
  .sm-pain-transform{gap:8px}
  .sm-pain-transform>div{min-height:76px;padding:10px;border-radius:15px}
  .sm-pain-transform span{min-height:48px;padding:7px;font-size:9.5px}
  .sm-pain-close{margin-top:17px;font-size:15px;line-height:1.42}
}
@media(max-width:430px){
  .sm-pain-card{grid-template-columns:32% 68%}
  .sm-pain-visual{min-height:248px}
  .sm-pain-visual img{height:220px}
  .sm-pain-copy h3{font-size:18px}
}
</style>`;

html = html.replace('</head>', css + '</head>');
fs.writeFileSync(target, html);
console.log('Audience pain bridge v1 inserted after hero; legacy audience section removed.');
