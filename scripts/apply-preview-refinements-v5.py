#!/usr/bin/env python3
from pathlib import Path
import re

INDEX = Path('public/index.html')
html = INDEX.read_text(encoding='utf-8')

# Remove prior v4 refinement CSS/JS so this layer becomes the source of truth.
html = re.sub(r'<style id="sm-carousel-refinements-v4">.*?</style>', '', html, flags=re.S)
html = re.sub(r'<style id="sm-visual-compare-v4-css">.*?</style>', '', html, flags=re.S)
html = re.sub(r'<script id="sm-carousel-refinements-v4-js">.*?</script>', '', html, flags=re.S)

carousel_css = '''<style id="sm-carousel-refinements-v5">
.sm-format-carousel{position:relative!important;overflow:visible!important}
.sm-format-carousel-track{position:relative!important;width:100%!important;height:100%!important;min-height:inherit!important;overflow:visible!important;border-radius:inherit!important}
.sm-format-carousel-slide{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;object-fit:contain!important;object-position:center center!important;margin:0!important;filter:none!important}
.sm-format-v2-unit-card .sm-format-carousel-slide{inset:0!important;left:0!important;right:0!important;width:100%!important;height:100%!important;object-position:center center!important}
.sm-format-carousel-controls{position:absolute!important;z-index:9!important;inset:0!important;pointer-events:none!important}
.sm-format-carousel-controls button{position:absolute!important;top:50%!important;display:grid!important;place-items:center!important;width:42px!important;height:42px!important;padding:0!important;border:1px solid rgba(110,86,205,.18)!important;border-radius:50%!important;background:rgba(255,255,255,.98)!important;box-shadow:0 9px 26px rgba(55,40,107,.16)!important;color:#6f57cc!important;font:700 30px/1 Arial,sans-serif!important;cursor:pointer!important;pointer-events:auto!important;transform:translateY(-50%)!important}
.sm-format-carousel-prev{left:-20px!important}
.sm-format-carousel-next{right:-20px!important}
.sm-format-v2-map-visual,.sm-format-v2-summary-visual,.sm-format-v2-card-visual{filter:drop-shadow(0 16px 18px rgba(49,38,86,.12)) drop-shadow(0 -5px 10px rgba(49,38,86,.05))!important}
@media(max-width:720px){
 .sm-format-carousel-controls button{width:36px!important;height:36px!important;font-size:25px!important}
 .sm-format-carousel-prev{left:-10px!important}.sm-format-carousel-next{right:-10px!important}
 .sm-format-v2-map-visual,.sm-format-v2-summary-visual,.sm-format-v2-card-visual{filter:drop-shadow(0 12px 14px rgba(49,38,86,.11)) drop-shadow(0 -4px 8px rgba(49,38,86,.05))!important}
}
</style>'''
html = html.replace('</head>', carousel_css + '</head>', 1)

carousel_js = '''<script id="sm-carousel-refinements-v5-js">(function(){
[].slice.call(document.querySelectorAll('[data-sm-carousel]')).forEach(function(root){
 var slides=[].slice.call(root.querySelectorAll('[data-sm-carousel-slide]'));if(slides.length<2)return;
 var index=Math.max(0,slides.findIndex(function(x){return x.classList.contains('is-active')})),timer=null,delay=2200;
 function show(n){slides[index].classList.remove('is-active');index=(n+slides.length)%slides.length;slides[index].classList.add('is-active')}
 function stop(){if(timer){clearInterval(timer);timer=null}}
 function start(){stop();if(!document.hidden)timer=setInterval(function(){show(index+1)},delay)}
 var prev=root.querySelector('.sm-format-carousel-prev'),next=root.querySelector('.sm-format-carousel-next');
 if(prev)prev.onclick=function(e){e.preventDefault();e.stopPropagation();show(index-1);start()};
 if(next)next.onclick=function(e){e.preventDefault();e.stopPropagation();show(index+1);start()};
 root.addEventListener('mouseenter',stop);root.addEventListener('mouseleave',start);
 root.addEventListener('focusin',stop);root.addEventListener('focusout',start);
 document.addEventListener('visibilitychange',function(){document.hidden?stop():start()});start();
});})();</script>'''
html = html.replace('</body>', carousel_js + '</body>', 1)

MAP_URL = 'https://static.wixstatic.com/media/1a67b8_b19132c7753849e08a076d81791245a4~mv2.png/v1/fit/w_1400,h_990/file.webp'
compare_section = '''<section class="sm-visual-study sm-visual-compare-v2" id="estudo-visual" aria-labelledby="sm-visual-study-title">
  <div class="sm-vc-shell">
    <header class="sm-vc-intro">
      <span class="sm-vc-eyebrow">VEJA A DIFERENÇA NA PRÁTICA</span>
      <h2 id="sm-visual-study-title">A mesma matéria. <span>Uma forma muito mais visual de entender.</span></h2>
      <p>Arraste a barra apenas dentro da área do material e compare o texto corrido com a organização visual dos Supermapas.</p>
    </header>
    <div class="sm-vc-stage-shadow">
      <div class="sm-vc-compare" data-sm-before-after style="--sm-vc-position:50%">
        <div class="sm-vc-before" aria-label="Texto tradicional sobre crase">
          <div class="sm-vc-text-page">
            <span class="sm-vc-side-label sm-vc-side-label-text">TEXTO CORRIDO</span>
            <h3>Crase</h3>
            <p>A crase representa a fusão de duas vogais idênticas, normalmente a preposição <strong>a</strong> com o artigo feminino <strong>a</strong> ou <strong>as</strong>. Para verificar sua ocorrência, é necessário observar a regência do termo anterior e se o termo seguinte admite artigo feminino.</p>
            <p>Seu emprego é obrigatório diante de palavras femininas quando houver regência, em locuções femininas e na indicação de horas. Em alguns casos, pode ser facultativo, como diante de nomes próprios femininos e pronomes possessivos.</p>
            <p>Não ocorre diante de palavras masculinas, verbos no infinitivo, pronomes pessoais e em diversas construções de sentido indefinido. A análise depende sempre da relação entre os termos da frase.</p>
            <p>Para confirmar o uso, observe se o termo anterior exige a preposição <strong>a</strong> e se o termo seguinte admite artigo feminino. A substituição por uma palavra masculina também ajuda: se surgir <strong>ao</strong>, normalmente haverá crase no feminino.</p>
            <p>Exemplos: <strong>vou à escola</strong>, <strong>cheguei às oito horas</strong>, <strong>refiro-me àquela regra</strong>. Já em <strong>andar a cavalo</strong>, <strong>começar a estudar</strong> e <strong>entregar a ela</strong>, não ocorre crase.</p>
          </div>
        </div>
        <div class="sm-vc-after" aria-label="Supermapa de crase">
          <div class="sm-vc-map-page">
            <span class="sm-vc-side-label sm-vc-side-label-map">COM SUPERMAPAS</span>
            <img src="''' + MAP_URL + '''" alt="Supermapa de Língua Portuguesa sobre crase" loading="lazy" decoding="async"/>
          </div>
        </div>
        <div class="sm-vc-divider" aria-hidden="true"><span><b>↔</b></span></div>
        <input class="sm-vc-range" type="range" min="0" max="100" value="50" aria-label="Comparar texto corrido com Supermapas"/>
      </div>
    </div>
    <div class="sm-vc-benefits" aria-label="Benefícios da organização visual">
      <div><b>01</b><span><strong>Encontre mais rápido</strong><small>Regras e exceções ficam visualmente separadas.</small></span></div>
      <div><b>02</b><span><strong>Entenda as relações</strong><small>O conteúdo deixa de parecer um bloco único de texto.</small></span></div>
      <div><b>03</b><span><strong>Revise sem reler tudo</strong><small>Volte aos pontos-chave com muito mais praticidade.</small></span></div>
    </div>
  </div>
</section>'''
html = re.sub(r'<section class="sm-visual-study sm-visual-compare-v2" id="estudo-visual".*?</section>', compare_section, html, count=1, flags=re.S)

compare_css = '''<style id="sm-visual-compare-v5-css">
.sm-visual-compare-v2{padding:92px 24px;background:#fff!important;overflow:hidden}
.sm-vc-shell{width:min(1180px,100%);margin:0 auto}.sm-vc-intro{text-align:center;max-width:860px;margin:0 auto 40px}.sm-vc-eyebrow{display:inline-block;margin-bottom:12px;font-size:12px;font-weight:900;letter-spacing:.16em;color:#7357d7}.sm-vc-intro h2{margin:0;color:#292534;font-size:clamp(34px,5vw,60px);line-height:1;letter-spacing:-.045em;font-weight:900}.sm-vc-intro h2 span{color:#7559df}.sm-vc-intro p{max-width:700px;margin:18px auto 0;color:#6f6978;font-size:17px;line-height:1.6}
.sm-vc-stage-shadow{width:min(1060px,100%);margin:0 auto;padding:0;background:#fff;filter:drop-shadow(0 18px 22px rgba(49,38,86,.14)) drop-shadow(0 -5px 10px rgba(49,38,86,.05))}
.sm-vc-compare{position:relative;width:100%;aspect-ratio:1400/990;overflow:hidden;background:#fff;isolation:isolate}
.sm-vc-before,.sm-vc-after{position:absolute;inset:0;background:#fff}.sm-vc-before{z-index:1}.sm-vc-after{z-index:2;clip-path:inset(0 calc(100% - var(--sm-vc-position)) 0 0)}
.sm-vc-text-page,.sm-vc-map-page{position:absolute;inset:0;box-sizing:border-box;width:100%;height:100%;background:#fff}
.sm-vc-text-page{padding:7% 7.5%;display:flex;flex-direction:column;justify-content:flex-start;overflow:hidden;color:#4d4855}.sm-vc-text-page h3{margin:3% 0 3%;font:900 clamp(28px,3.4vw,48px)/1 Arial,sans-serif;color:#302a39;letter-spacing:-.035em}.sm-vc-text-page p{margin:0 0 2.1%;font:500 clamp(11px,1.13vw,16px)/1.56 Arial,sans-serif;color:#625c69;text-align:left}.sm-vc-map-page{display:flex;align-items:center;justify-content:center;padding:0}.sm-vc-map-page img{display:block;width:100%;height:100%;object-fit:contain;object-position:center}
.sm-vc-side-label{position:absolute;z-index:3;top:18px;padding:9px 13px;border-radius:999px;font-size:10px;font-weight:900;letter-spacing:.1em}.sm-vc-side-label-map{left:18px;background:#7458dd;color:#fff}.sm-vc-side-label-text{right:18px;background:#f2effb;color:#6f59c7}
.sm-vc-divider{position:absolute;z-index:4;top:0;bottom:0;left:var(--sm-vc-position);width:3px;background:#fff;box-shadow:0 0 0 1px rgba(83,60,169,.16),0 0 22px rgba(63,44,131,.2);transform:translateX(-50%);pointer-events:none}.sm-vc-divider span{position:absolute;top:50%;left:50%;width:58px;height:58px;border-radius:50%;display:grid;place-items:center;background:#fff;color:#7559df;box-shadow:0 10px 28px rgba(54,38,112,.22);transform:translate(-50%,-50%)}.sm-vc-divider b{font-size:23px;line-height:1}.sm-vc-range{position:absolute;z-index:5;inset:0;width:100%;height:100%;opacity:0;cursor:ew-resize;margin:0}
.sm-vc-benefits{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:24px auto 0;width:min(1060px,100%)}.sm-vc-benefits>div{display:flex;gap:14px;padding:18px 20px;border:1px solid #ece8f5;background:#fff;border-radius:18px;box-shadow:0 10px 30px rgba(54,43,99,.05)}.sm-vc-benefits b{display:grid;place-items:center;flex:0 0 38px;height:38px;border-radius:12px;background:#f0ebff;color:#7155d4}.sm-vc-benefits span{display:flex;flex-direction:column;gap:4px}.sm-vc-benefits strong{color:#302c3b;font-size:14px}.sm-vc-benefits small{color:#777180;font-size:12px}
@media(max-width:720px){.sm-visual-compare-v2{padding:62px 14px}.sm-vc-intro h2{font-size:36px}.sm-vc-intro p{font-size:15px}.sm-vc-stage-shadow{width:100%}.sm-vc-text-page{padding:9% 7%}.sm-vc-text-page h3{font-size:26px;margin:6% 0 4%}.sm-vc-text-page p{font-size:9.5px;line-height:1.46;margin-bottom:2.6%}.sm-vc-side-label{top:10px;padding:7px 9px;font-size:8px}.sm-vc-side-label-map{left:10px}.sm-vc-side-label-text{right:10px}.sm-vc-divider span{width:48px;height:48px}.sm-vc-benefits{grid-template-columns:1fr}}
</style>'''
html = html.replace('</head>', compare_css + '</head>', 1)

# Keep the original slider controller; it reads the same CSS variable and starts at 50%.

for marker in ['sm-carousel-refinements-v5','sm-visual-compare-v5-css','sm-format-carousel-prev','sm-vc-stage-shadow']:
    if marker not in html:
        raise SystemExit(f'Missing refinement marker: {marker}')

INDEX.write_text(html, encoding='utf-8')
print('Applied v5 carousel and before-after refinements.')
