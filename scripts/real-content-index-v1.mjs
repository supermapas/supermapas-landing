import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/real-content-index-v1.mjs <html-file>');

let html = fs.readFileSync(target, 'utf8');

const groups = [
  ['Fonologia', [[1,'Noções iniciais de fonologia - Parte 1'],[2,'Noções iniciais de fonologia - Parte 2']]],
  ['Acentuação', [[3,'Regras gerais de acentuação - Parte 1'],[4,'Regras gerais de acentuação - Parte 2']]],
  ['Ortografia', [[5,'Emprego do hífen'],[6,'Emprego das letras - Parte 1'],[7,'Emprego das letras - Parte 2'],[8,'Emprego das iniciais maiúsculas e minúsculas']]],
  ['Expressões problemáticas', [[9,'Uso dos porquês'],[10,'Mas x mais'],[11,'Mal x mau'],[12,'Acerca de x a cerca de x há cerca de'],[13,'Em vez de x ao invés de'],[14,'Cessão x sessão x seção'],[15,'De encontro a x ao encontro de'],[16,'Viagem x viajem, onde x aonde'],[17,'Se não x senão, tão pouco x tampouco']]],
  ['Morfologia', [[18,'Morfologia - Estrutura das palavras'],[19,'Morfologia - Formação das palavras'],[20,'Classes de palavras'],[21,'Substantivos - Definição e classificação'],[22,'Substantivos - Formação e flexão'],[23,'Adjetivos - Definição, classificação e flexão'],[24,'Artigo - Emprego, combinação e classificação'],[25,'Numeral - Emprego e classificação'],[26,'Pronomes - Pronomes pessoais'],[27,'Pronomes - Pronomes de tratamento'],[28,'Pronomes - Pronomes possessivos e demonstrativos'],[29,'Pronomes - Pronomes relativos, indefinidos e interrogativos'],[30,'Colocação pronominal'],[31,'Verbos - Classificação - Parte 1'],[32,'Verbos - Classificação - Parte 2'],[33,'Verbos abundantes'],[34,'Verbos auxiliares'],[35,'Formas nominais do verbo'],[36,'Tempos e modos verbais'],[37,'Tempos primitivos'],[38,'Tempos derivados do presente do indicativo'],[39,'Tempos derivados do pretérito perfeito do indicativo'],[40,'Tempos derivados do infinitivo pessoal'],[41,'Tempos compostos'],[42,'Tempos verbais - Presente do indicativo'],[43,'Tempos verbais - Pretérito imperfeito do indicativo'],[44,'Tempos verbais - Pretérito perfeito do indicativo'],[45,'Tempos verbais - Pretérito mais-que-perfeito do indicativo'],[46,'Tempos verbais - Futuro do presente do indicativo'],[47,'Tempos verbais - Futuro do pretérito do indicativo'],[48,'Tempos verbais - Presente do subjuntivo'],[49,'Tempos verbais - Pretérito imperfeito do subjuntivo'],[50,'Tempos verbais - Futuro do subjuntivo'],[51,'Correlação de tempos verbais'],[52,'Vozes verbais'],[53,'Transitividade verbal'],[54,'Advérbios - Definição e classificação'],[55,'Conjunção - Definição e classificação'],[56,'Conjunções coordenativas'],[57,'Conjunções subordinativas'],[58,'Conjunções importantes'],[59,'Preposição - Definição e classificação'],[60,'Interjeição - Definição e classificação']]],
  ['Semântica', [[61,'Semântica - Parte 1'],[62,'Semântica - Parte 2']]],
  ['Sintaxe', [[63,'Sintaxe - Definição e termos essenciais'],[64,'Termos essenciais da oração'],[65,'Sujeito - Definição e classificação'],[66,'Predicado'],[67,'Termos integrantes da oração'],[68,'Termos acessórios da oração'],[69,'Adjunto adnominal x complemento nominal'],[70,'Período composto'],[71,'Período composto por coordenação'],[72,'Orações subordinadas adjetivas'],[73,'Orações subordinadas substantivas'],[74,'Orações subordinadas adverbiais'],[75,'Orações reduzidas']]],
  ['Concordância', [[76,'Concordância verbal - Parte 1'],[77,'Concordância verbal - Parte 2'],[78,'Concordância nominal']]],
  ['Regência', [[79,'Regência verbal - Parte 1'],[80,'Regência verbal - Parte 2'],[81,'Crase']]],
  ['Estudo dos vocábulos', [[82,'Funções da palavra “que”'],[83,'Funções da palavra “se”'],[84,'Funções da palavra “como”']]],
  ['Pontuação', [[85,'Uso da vírgula - Parte 1'],[86,'Uso da vírgula - Parte 2']]],
  ['Figuras de linguagem', [[87,'Figuras de linguagem'],[88,'Figuras de palavras'],[89,'Figuras de pensamento'],[90,'Figuras de sintaxe'],[91,'Figuras de som']]],
  ['Vícios de linguagem', [[92,'Vícios de linguagem - Parte 1'],[93,'Vícios de linguagem - Parte 2']]],
  ['Tipos e gêneros textuais', [[94,'Tipologia textual'],[95,'Gêneros textuais narrativos'],[96,'Gêneros textuais descritivos'],[97,'Gêneros textuais argumentativos'],[98,'Gêneros textuais expositivos']]],
];

const esc = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const groupHtml = groups.map(([name, items], gi) => {
  const start = items[0][0], end = items[items.length - 1][0];
  return `<details class="sm-catalog-group" data-catalog-group data-group-name="${esc(name)}">
    <summary>
      <span class="sm-catalog-index">${String(gi + 1).padStart(2,'0')}</span>
      <span class="sm-catalog-summary-copy"><strong>${esc(name)}</strong><small>Mapas ${String(start).padStart(2,'0')}–${String(end).padStart(2,'0')}</small></span>
      <span class="sm-catalog-count"><b>${items.length}</b><small>${items.length === 1 ? 'Supermapa' : 'Supermapas'}</small></span>
      <span class="sm-catalog-toggle" aria-hidden="true"><i></i><i></i></span>
    </summary>
    <div class="sm-catalog-items">${items.map(([n,title]) => `<div class="sm-catalog-item" data-catalog-item data-search="${esc((name+' '+title).toLowerCase())}"><span>${String(n).padStart(2,'0')}</span><strong>${esc(title)}</strong></div>`).join('')}</div>
  </details>`;
}).join('');

const section = `<section class="sm-coverage sm-catalog" id="conteudo" aria-labelledby="sm-catalog-title">
  <div class="sm-catalog-shell">
    <header class="sm-catalog-head">
      <div class="sm-catalog-heading">
        <span class="sm-catalog-eyebrow">CONTEÚDO COMPLETO</span>
        <h2 id="sm-catalog-title">Veja tudo o que está <span>incluído no material.</span></h2>
        <p>Os 98 Supermapas estão organizados na mesma sequência do arquivo completo. Abra um tópico para conferir cada mapa.</p>
      </div>
      <div class="sm-catalog-stats" aria-label="98 Supermapas organizados em 14 tópicos">
        <div><strong>98</strong><span>Supermapas</span></div><i></i><div><strong>14</strong><span>tópicos</span></div>
      </div>
    </header>
    <div class="sm-catalog-search-wrap">
      <label class="sm-catalog-search" for="sm-catalog-search-input"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4.2 4.2"></path></svg><input id="sm-catalog-search-input" type="search" autocomplete="off" placeholder="Procure um conteúdo: crase, verbos, vírgula..."/><button type="button" aria-label="Limpar busca" hidden>×</button></label>
      <span class="sm-catalog-search-help">Digite um assunto para localizar rapidamente o mapa correspondente.</span>
    </div>
    <div class="sm-catalog-groups">${groupHtml}</div>
    <div class="sm-catalog-empty" hidden><strong>Nenhum conteúdo encontrado.</strong><span>Tente outra palavra ou expressão.</span></div>
    <footer class="sm-catalog-foot"><span aria-hidden="true">✓</span><p><strong>Um único arquivo, um acervo completo.</strong> Todos os conteúdos acima fazem parte do mesmo material de Língua Portuguesa.</p></footer>
  </div>
</section>`;

const style = `<style id="sm-real-content-index-v1">
.sm-catalog{padding:108px 0;background:linear-gradient(180deg,#fbfaff 0%,#fff 22%,#fff 100%)}
.sm-catalog-shell{width:min(1160px,calc(100% - 48px));margin:0 auto}
.sm-catalog-head{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:46px;align-items:end;margin-bottom:34px}
.sm-catalog-eyebrow{display:inline-block;margin-bottom:12px;color:#725bd1;font-size:11px;font-weight:900;letter-spacing:.14em}
.sm-catalog-heading h2{max-width:760px;margin:0;color:#282331;font-size:48px;line-height:1.04;letter-spacing:-.045em}.sm-catalog-heading h2 span{color:#725bd1}
.sm-catalog-heading p{max-width:720px;margin:18px 0 0;color:#6f6879;font-size:16px;line-height:1.65}
.sm-catalog-stats{display:flex;align-items:center;gap:22px;padding:20px 24px;border:1px solid rgba(114,91,209,.18);border-radius:20px;background:#fff;box-shadow:0 14px 42px rgba(62,45,126,.09)}
.sm-catalog-stats div{display:flex;flex-direction:column}.sm-catalog-stats strong{color:#2d2737;font-size:31px;line-height:1;font-weight:900}.sm-catalog-stats span{margin-top:5px;color:#7a7284;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.08em}.sm-catalog-stats i{width:1px;height:39px;background:#e8e3f3}
.sm-catalog-search-wrap{display:flex;align-items:center;gap:18px;margin-bottom:22px}.sm-catalog-search{display:flex;align-items:center;gap:11px;flex:1;max-width:680px;padding:0 15px;border:1px solid #e4dff0;border-radius:15px;background:#fff;box-shadow:0 9px 28px rgba(55,40,107,.07)}
.sm-catalog-search:focus-within{border-color:#8a72e0;box-shadow:0 0 0 3px rgba(114,91,209,.1),0 10px 30px rgba(55,40,107,.08)}.sm-catalog-search svg{width:20px;height:20px;fill:none;stroke:#7968c7;stroke-width:1.8;stroke-linecap:round}.sm-catalog-search input{width:100%;height:52px;border:0;outline:0;background:transparent;color:#332d3d;font:inherit;font-size:14px}.sm-catalog-search input::placeholder{color:#9a94a3}.sm-catalog-search button{border:0;background:transparent;color:#847b91;font-size:22px;cursor:pointer}.sm-catalog-search-help{color:#8a8391;font-size:12px;line-height:1.4}
.sm-catalog-groups{display:grid;gap:10px}.sm-catalog-group{border:1px solid #e7e2ef;border-radius:18px;background:#fff;overflow:hidden;box-shadow:0 8px 24px rgba(55,41,103,.045);transition:border-color .2s,box-shadow .2s}.sm-catalog-group[open]{border-color:rgba(114,91,209,.28);box-shadow:0 16px 38px rgba(62,45,126,.09)}
.sm-catalog-group summary{display:grid;grid-template-columns:52px minmax(0,1fr) 118px 38px;gap:16px;align-items:center;min-height:82px;padding:12px 20px;cursor:pointer;list-style:none}.sm-catalog-group summary::-webkit-details-marker{display:none}.sm-catalog-group summary:hover{background:#fbfaff}
.sm-catalog-index{display:flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:14px;background:#f1edff;color:#7159cf;font-size:13px;font-weight:900;letter-spacing:.04em}.sm-catalog-summary-copy{display:flex;flex-direction:column;gap:4px}.sm-catalog-summary-copy strong{color:#322c3c;font-size:18px;line-height:1.2}.sm-catalog-summary-copy small{color:#908998;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}.sm-catalog-count{display:flex;align-items:baseline;justify-content:flex-end;gap:7px}.sm-catalog-count b{color:#6f58c9;font-size:23px}.sm-catalog-count small{color:#89818f;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em}.sm-catalog-toggle{position:relative;width:32px;height:32px;border-radius:50%;background:#f4f1fb}.sm-catalog-toggle i{position:absolute;left:9px;top:15px;width:14px;height:2px;border-radius:2px;background:#725bd1;transition:transform .2s}.sm-catalog-toggle i+ i{transform:rotate(90deg)}.sm-catalog-group[open] .sm-catalog-toggle i+ i{transform:rotate(0)}
.sm-catalog-items{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px 30px;padding:6px 24px 24px 88px;border-top:1px solid #eeeaf4;background:linear-gradient(180deg,#fcfbff,#fff)}.sm-catalog-item{display:grid;grid-template-columns:34px minmax(0,1fr);gap:10px;align-items:start;padding:12px 0;border-bottom:1px solid #eeeaf4}.sm-catalog-item span{display:flex;align-items:center;justify-content:center;width:30px;height:24px;border-radius:7px;background:#f0ecfb;color:#735dca;font-size:10px;font-weight:900}.sm-catalog-item strong{padding-top:2px;color:#4e4857;font-size:13px;line-height:1.45;font-weight:750}.sm-catalog-item[hidden]{display:none}
.sm-catalog-empty{margin-top:10px;padding:34px;border:1px dashed #dcd5e8;border-radius:18px;text-align:center}.sm-catalog-empty strong,.sm-catalog-empty span{display:block}.sm-catalog-empty strong{color:#3e3748}.sm-catalog-empty span{margin-top:5px;color:#8a8291;font-size:13px}
.sm-catalog-foot{display:flex;align-items:center;gap:12px;margin-top:24px;padding:18px 22px;border-radius:16px;background:#f5f2fd;color:#6f6779}.sm-catalog-foot>span{display:flex;align-items:center;justify-content:center;flex:0 0 30px;height:30px;border-radius:50%;background:#725bd1;color:#fff;font-weight:900}.sm-catalog-foot p{margin:0;font-size:13px;line-height:1.55}.sm-catalog-foot strong{color:#3b3447}
@media(max-width:760px){.sm-catalog{padding:72px 0}.sm-catalog-shell{width:calc(100% - 28px)}.sm-catalog-head{grid-template-columns:1fr;gap:24px;margin-bottom:24px}.sm-catalog-heading h2{font-size:34px;line-height:1.08}.sm-catalog-heading p{font-size:14px;margin-top:14px}.sm-catalog-stats{width:max-content;padding:15px 18px;gap:17px}.sm-catalog-stats strong{font-size:25px}.sm-catalog-search-wrap{display:block}.sm-catalog-search{max-width:none}.sm-catalog-search-help{display:block;margin:9px 3px 0}.sm-catalog-group summary{grid-template-columns:44px minmax(0,1fr) 34px;gap:11px;min-height:72px;padding:10px 12px}.sm-catalog-index{width:40px;height:40px;border-radius:12px}.sm-catalog-count{display:none}.sm-catalog-summary-copy strong{font-size:15px}.sm-catalog-summary-copy small{font-size:9px}.sm-catalog-items{grid-template-columns:1fr;padding:4px 14px 18px 67px}.sm-catalog-item{grid-template-columns:30px minmax(0,1fr);padding:10px 0}.sm-catalog-item strong{font-size:12px}.sm-catalog-foot{align-items:flex-start;padding:16px}.sm-catalog-foot p{font-size:12px}}
</style>`;

const script = `<script id="sm-real-content-index-interactions">(function(){var input=document.getElementById('sm-catalog-search-input');if(!input)return;var groups=[].slice.call(document.querySelectorAll('[data-catalog-group]'));var clear=input.parentElement.querySelector('button');var empty=document.querySelector('.sm-catalog-empty');function norm(s){return (s||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().trim()}function filter(){var q=norm(input.value);var any=false;groups.forEach(function(group){var items=[].slice.call(group.querySelectorAll('[data-catalog-item]'));var groupName=norm(group.getAttribute('data-group-name'));var groupHit=q&&groupName.indexOf(q)!==-1;var visible=0;items.forEach(function(item){var hit=!q||groupHit||norm(item.getAttribute('data-search')).indexOf(q)!==-1;item.hidden=!hit;if(hit)visible++});group.hidden=visible===0;if(visible){any=true;if(q)group.open=true}});clear.hidden=!q;if(empty)empty.hidden=any||!q}input.addEventListener('input',filter);clear.addEventListener('click',function(){input.value='';filter();input.focus()})})();</script>`;

const sectionRe = /<section class="sm-coverage" id="conteudo"[\s\S]*?<\/section>/;
if (!sectionRe.test(html)) throw new Error('Original content section not found');
html = html.replace(sectionRe, section);
if (!html.includes('sm-real-content-index-v1')) html = html.replace('</head>', style + '</head>');
if (!html.includes('sm-real-content-index-interactions')) html = html.replace('</body>', script + '</body>');
fs.writeFileSync(target, html);
console.log('Applied real 98-map content index to', target);
