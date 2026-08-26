#!/usr/bin/env python3
from pathlib import Path
import re

INDEX = Path('public/index.html')
html = INDEX.read_text(encoding='utf-8')

# ------------------------------------------------------------
# 1) CAROUSELS: faster autoplay + previous/next controls
# ------------------------------------------------------------

def add_controls(match):
    block = match.group(0)
    if 'sm-format-carousel-controls' in block:
        return block
    insert = (
        '<div class="sm-format-carousel-controls" aria-label="Controles do carrossel">'
        '<button type="button" class="sm-format-carousel-prev" aria-label="Imagem anterior">‹</button>'
        '<button type="button" class="sm-format-carousel-next" aria-label="Próxima imagem">›</button>'
        '</div>'
    )
    return block.replace('</div></div></article>', '</div>' + insert + '</div></article>', 1)

html = re.sub(
    r'<article class="sm-format-v2-unit sm-format-v2-unit-(?:map|summary|card)">.*?</article>',
    add_controls,
    html,
    flags=re.S,
)

carousel_css = '''
<style id="sm-carousel-refinements-v3">
.sm-format-carousel{overflow:visible!important}
.sm-format-carousel-track{overflow:hidden!important;border-radius:inherit}
.sm-format-carousel-controls{position:absolute;z-index:8;left:50%;bottom:16px;transform:translateX(-50%);display:flex;align-items:center;gap:10px;pointer-events:auto}
.sm-format-carousel-controls button{display:grid;place-items:center;width:42px;height:42px;padding:0;border:1px solid rgba(110,86,205,.18);border-radius:50%;background:rgba(255,255,255,.96);box-shadow:0 9px 26px rgba(55,40,107,.14);color:#6f57cc;font:700 30px/1 Arial,sans-serif;cursor:pointer;transition:transform .18s ease,box-shadow .18s ease,background .18s ease}
.sm-format-carousel-controls button:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(55,40,107,.19);background:#fff}
.sm-format-carousel-controls button:active{transform:translateY(0)}
.sm-format-v2-unit-card .sm-format-carousel-slide{left:8%!important;width:84%!important;right:auto!important}
.sm-format-v2-unit-card .sm-format-carousel-controls{left:50%}
@media(max-width:720px){.sm-format-carousel-controls{bottom:10px;gap:8px}.sm-format-carousel-controls button{width:36px;height:36px;font-size:25px}.sm-format-v2-unit-card .sm-format-carousel-slide{left:5%!important;width:90%!important}}
</style>
'''
html = re.sub(r'<style id="sm-carousel-refinements-v3">.*?</style>', carousel_css.strip(), html, flags=re.S)
if 'id="sm-carousel-refinements-v3"' not in html:
    html = html.replace('</head>', carousel_css + '</head>', 1)

carousel_js = '''
<script id="sm-carousel-refinements-v3-js">(function(){
 var roots=[].slice.call(document.querySelectorAll('[data-sm-carousel]'));
 roots.forEach(function(root){
   if(root.dataset.smRefinedCarousel==='1')return;
   root.dataset.smRefinedCarousel='1';
   var slides=[].slice.call(root.querySelectorAll('[data-sm-carousel-slide]'));
   if(slides.length<2)return;
   var index=Math.max(0,slides.findIndex(function(s){return s.classList.contains('is-active')}));
   var timer=null;
   var delay=2200;
   function show(next){
     slides[index].classList.remove('is-active');
     index=(next+slides.length)%slides.length;
     slides[index].classList.add('is-active');
   }
   function stop(){if(timer){clearInterval(timer);timer=null}}
   function start(){stop();if(document.hidden)return;timer=setInterval(function(){show(index+1)},delay)}
   var prev=root.querySelector('.sm-format-carousel-prev');
   var next=root.querySelector('.sm-format-carousel-next');
   if(prev)prev.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();show(index-1);start()});
   if(next)next.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();show(index+1);start()});
   root.addEventListener('mouseenter',stop);
   root.addEventListener('mouseleave',start);
   root.addEventListener('focusin',stop);
   root.addEventListener('focusout',start);
   document.addEventListener('visibilitychange',function(){if(document.hidden)stop();else start()});
   start();
 });
})();</script>
'''
html = re.sub(r'<script id="sm-carousel-refinements-v3-js">.*?</script>', carousel_js.strip(), html, flags=re.S)
if 'id="sm-carousel-refinements-v3-js"' not in html:
    html = html.replace('</body>', carousel_js + '</body>', 1)

# Disable the older autoplay controller so only the refined timing runs.
html = re.sub(r'<script id="sm-format-carousels-v2-js">.*?</script>', '', html, flags=re.S)

# ------------------------------------------------------------
# 2) BONUS: one strong badge only, no duplicated word below
# ------------------------------------------------------------
html = html.replace('<h3 class="sm-format-v2-title"><strong>50</strong><span>BÔNUS • Super-resumos</span></h3>',
                    '<h3 class="sm-format-v2-title"><strong>50</strong><span>Super-resumos</span></h3>', 1)
html = html.replace('<h3 class="sm-format-v2-title"><strong>190</strong><span>BÔNUS • Supercards</span></h3>',
                    '<h3 class="sm-format-v2-title"><strong>190</strong><span>Supercards</span></h3>', 1)
html = html.replace('<p><strong>Você recebe como bônus:</strong> o essencial de cada tema condensado para retomar pontos importantes com rapidez e clareza.</p>',
                    '<p>O essencial de cada tema condensado para retomar pontos importantes com rapidez e clareza.</p>', 1)
html = html.replace('<p><strong>Você recebe como bônus:</strong> conceitos-chave em cards objetivos para reforçar conteúdos e fazer revisões curtas ao longo da rotina.</p>',
                    '<p>Conceitos-chave em cards objetivos para reforçar conteúdos e fazer revisões curtas ao longo da rotina.</p>', 1)

bonus_css = '''
<style id="sm-bonus-refinement-v3">
.sm-format-v2-bonus-badge{display:flex!important;width:max-content!important;margin:0 0 16px!important;padding:9px 18px!important;border-radius:999px!important;background:linear-gradient(135deg,#f36a25,#ff496b)!important;box-shadow:0 10px 24px rgba(243,106,37,.22)!important;color:#fff!important;font-size:13px!important;font-weight:950!important;letter-spacing:.12em!important}
@media(max-width:720px){.sm-format-v2-bonus-badge{margin-bottom:12px!important;padding:8px 14px!important;font-size:11px!important}}
</style>
'''
if 'id="sm-bonus-refinement-v3"' not in html:
    html = html.replace('</head>', bonus_css + '</head>', 1)

# ------------------------------------------------------------
# 3) BEFORE/AFTER: white page styling, map on left, text on right
# ------------------------------------------------------------
MAP_URL = 'https://static.wixstatic.com/media/1a67b8_b19132c7753849e08a076d81791245a4~mv2.png/v1/fit/w_1400,h_990/file.webp'

compare_section = '''<section class="sm-visual-study sm-visual-compare-v2" id="estudo-visual" aria-labelledby="sm-visual-study-title">
  <div class="sm-vc-shell">
    <header class="sm-vc-intro">
      <span class="sm-vc-eyebrow">VEJA A DIFERENÇA NA PRÁTICA</span>
      <h2 id="sm-visual-study-title">A mesma matéria. <span>Uma forma muito mais visual de entender.</span></h2>
      <p>Arraste a barra para comparar o texto corrido com a organização visual dos Supermapas.</p>
    </header>

    <div class="sm-vc-compare" data-sm-before-after style="--sm-vc-position:50%">
      <div class="sm-vc-before" aria-label="Texto tradicional sobre crase">
        <div class="sm-vc-text-wrap">
          <span class="sm-vc-side-label sm-vc-side-label-text">TEXTO CORRIDO</span>
          <h3>Crase</h3>
          <p>A crase representa a fusão de duas vogais idênticas, normalmente a preposição <strong>a</strong> com o artigo feminino <strong>a</strong> ou <strong>as</strong>. Para verificar sua ocorrência, é necessário observar a regência do termo anterior e se o termo seguinte admite artigo feminino.</p>
          <p>Seu emprego pode ser obrigatório diante de palavras femininas quando houver regência, em locuções femininas e na indicação de horas. Em alguns casos, pode ser facultativo, como diante de nomes próprios femininos e pronomes possessivos.</p>
          <p>Não ocorre diante de palavras masculinas, verbos no infinitivo e pronomes pessoais. A análise depende sempre da relação entre os termos da frase.</p>
        </div>
      </div>

      <div class="sm-vc-after" aria-label="Supermapa de crase">
        <div class="sm-vc-map-wrap">
          <span class="sm-vc-side-label sm-vc-side-label-map">COM SUPERMAPAS</span>
          <img src="''' + MAP_URL + '''" alt="Supermapa de Língua Portuguesa sobre crase" loading="lazy" decoding="async" fetchpriority="low"/>
        </div>
      </div>

      <div class="sm-vc-divider" aria-hidden="true"><span><b>↔</b></span></div>
      <input class="sm-vc-range" type="range" min="8" max="92" value="50" aria-label="Comparar texto corrido com Supermapas"/>
    </div>

    <div class="sm-vc-benefits" aria-label="Benefícios da organização visual">
      <div><b>01</b><span><strong>Encontre mais rápido</strong><small>Regras e exceções ficam visualmente separadas.</small></span></div>
      <div><b>02</b><span><strong>Entenda as relações</strong><small>O conteúdo deixa de parecer um bloco único de texto.</small></span></div>
      <div><b>03</b><span><strong>Revise sem reler tudo</strong><small>Volte aos pontos-chave com muito mais praticidade.</small></span></div>
    </div>
  </div>
</section>'''

html = re.sub(r'<section class="sm-visual-study sm-visual-compare-v2" id="estudo-visual".*?</section>', compare_section, html, count=1, flags=re.S)

compare_css = '''
<style id="sm-visual-compare-v3-css">
.sm-visual-compare-v2{padding:92px 24px;background:#fff!important;overflow:hidden}
.sm-vc-shell{width:min(1180px,100%);margin:0 auto}
.sm-vc-intro{text-align:center;max-width:860px;margin:0 auto 40px}
.sm-vc-eyebrow{display:inline-block;margin-bottom:12px;font-size:12px;font-weight:900;letter-spacing:.16em;color:#7357d7}
.sm-vc-intro h2{margin:0;color:#292534;font-size:clamp(34px,5vw,60px);line-height:1;letter-spacing:-.045em;font-weight:900}
.sm-vc-intro h2 span{color:#7559df}.sm-vc-intro p{max-width:700px;margin:18px auto 0;color:#6f6978;font-size:17px;line-height:1.6}
.sm-vc-compare{position:relative;width:100%;aspect-ratio:16/9;max-height:690px;overflow:hidden;background:#fff;border:0!important;border-radius:24px;box-shadow:0 24px 65px rgba(61,47,111,.12);isolation:isolate}
.sm-vc-before,.sm-vc-after{position:absolute;inset:0;background:#fff}
.sm-vc-before{z-index:1;display:flex;align-items:stretch;justify-content:stretch}
.sm-vc-text-wrap{box-sizing:border-box;width:100%;height:100%;padding:7% 7.5%;display:flex;flex-direction:column;justify-content:center;background:#fff;color:#4d4855;overflow:hidden}
.sm-vc-text-wrap h3{margin:0 0 22px;font:900 clamp(28px,3.5vw,48px)/1.02 Arial,sans-serif;color:#302a39;letter-spacing:-.035em}
.sm-vc-text-wrap p{max-width:96%;margin:0 0 16px;font:500 clamp(12px,1.3vw,17px)/1.65 Arial,sans-serif;color:#625c69;text-align:left}
.sm-vc-after{z-index:2;clip-path:inset(0 calc(100% - var(--sm-vc-position)) 0 0);display:flex;align-items:stretch;justify-content:stretch}
.sm-vc-map-wrap{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:2.5%;background:#fff}
.sm-vc-map-wrap img{width:100%;height:100%;object-fit:contain;display:block}
.sm-vc-side-label{position:absolute;z-index:3;top:18px;padding:9px 13px;border-radius:999px;font-size:10px;font-weight:900;letter-spacing:.1em;box-shadow:0 7px 20px rgba(55,40,107,.10)}
.sm-vc-side-label-map{left:18px;background:#7458dd;color:#fff}.sm-vc-side-label-text{right:18px;background:#f2effb;color:#6f59c7}
.sm-vc-divider{position:absolute;z-index:4;top:0;bottom:0;left:var(--sm-vc-position);width:3px;background:#fff;box-shadow:0 0 0 1px rgba(83,60,169,.16),0 0 24px rgba(63,44,131,.2);transform:translateX(-50%);pointer-events:none}
.sm-vc-divider span{position:absolute;top:50%;left:50%;width:58px;height:58px;border-radius:50%;display:grid;place-items:center;background:#fff;color:#7559df;box-shadow:0 10px 28px rgba(54,38,112,.22);transform:translate(-50%,-50%)}
.sm-vc-divider b{font-size:23px;line-height:1}.sm-vc-range{position:absolute;z-index:5;inset:0;width:100%;height:100%;opacity:0;cursor:ew-resize;margin:0}
.sm-vc-benefits{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:22px}.sm-vc-benefits>div{display:flex;gap:14px;align-items:flex-start;padding:18px 20px;border:1px solid #ece8f5;background:#fff;border-radius:18px;box-shadow:0 10px 30px rgba(54,43,99,.05)}
.sm-vc-benefits b{display:grid;place-items:center;flex:0 0 38px;height:38px;border-radius:12px;background:#f0ebff;color:#7155d4;font-size:12px;font-weight:900}.sm-vc-benefits span{display:flex;flex-direction:column;gap:4px}.sm-vc-benefits strong{color:#302c3b;font-size:14px}.sm-vc-benefits small{color:#777180;font-size:12px;line-height:1.45}
@media(max-width:720px){.sm-visual-compare-v2{padding:62px 16px}.sm-vc-intro{margin-bottom:28px}.sm-vc-intro h2{font-size:36px}.sm-vc-intro p{font-size:15px}.sm-vc-compare{aspect-ratio:4/5;border-radius:20px}.sm-vc-text-wrap{padding:13% 8%}.sm-vc-text-wrap h3{font-size:27px;margin-bottom:16px}.sm-vc-text-wrap p{font-size:11px;line-height:1.55;margin-bottom:10px}.sm-vc-map-wrap{padding:2%}.sm-vc-side-label{top:12px;font-size:8px;padding:7px 9px}.sm-vc-side-label-map{left:12px}.sm-vc-side-label-text{right:12px}.sm-vc-divider span{width:48px;height:48px}.sm-vc-divider b{font-size:19px}.sm-vc-benefits{grid-template-columns:1fr;gap:10px;margin-top:16px}.sm-vc-benefits>div{padding:15px 16px}}
</style>
'''
# Remove previous comparison CSS so it cannot fight the new layout.
html = re.sub(r'<style id="sm-visual-compare-v2-css">.*?</style>', '', html, flags=re.S)
html = re.sub(r'<style id="sm-visual-compare-v3-css">.*?</style>', compare_css.strip(), html, flags=re.S)
if 'id="sm-visual-compare-v3-css"' not in html:
    html = html.replace('</head>', compare_css + '</head>', 1)

# Keep the existing range JS; it already starts at 50% and updates --sm-vc-position.
if 'data-sm-before-after' not in html or 'value="50"' not in html:
    raise SystemExit('Before/after refinement failed.')
if 'sm-format-carousel-prev' not in html or 'sm-format-carousel-next' not in html:
    raise SystemExit('Carousel arrow controls missing.')

INDEX.write_text(html, encoding='utf-8')
print('Applied preview refinements v3: faster controlled carousels, bonus cleanup, card alignment, light before/after.')
