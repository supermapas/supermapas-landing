#!/usr/bin/env python3
from pathlib import Path
import re

INDEX = Path('public/index.html')
html = INDEX.read_text(encoding='utf-8')

MAPS = [
    ('1a67b8_3e827dcacabe4d1b88a221cb0ca6b105~mv2.png', 'Conjunções coordenativas'),
    ('1a67b8_30dae8421505424690773b1fec45576c~mv2.png', 'Termos integrantes da oração'),
    ('1a67b8_c3225c09f1d342eb80d4ecad55949b12~mv2.png', 'Concordância verbal'),
    ('1a67b8_ac2d2e76c7284c5884b89c37cc468ebc~mv2.png', 'Uso da vírgula'),
    ('1a67b8_4a00ecc7a0714bc4946bbc1cdafdd8e8~mv2.png', 'Figuras de pensamento'),
    ('1a67b8_ee950fcb35dd46d6aa3cac85c3018a1e~mv2.png', 'Classificação dos verbos'),
    ('1a67b8_671c4f73838544f99f02cf381f2c30d0~mv2.png', 'Vozes verbais'),
    ('1a67b8_b19132c7753849e08a076d81791245a4~mv2.png', 'Crase'),
]

SUMMARIES = [
    ('1a67b8_3a2c655dbe054c83beb2a5f85ec903e6~mv2.png', 'Classificação dos substantivos'),
    ('1a67b8_2f6efc79faaa42c7b15aeb08d7520926~mv2.png', 'Uso dos porquês'),
    ('1a67b8_d022fe53fe6040cd953a0857c4493650~mv2.png', 'Principais figuras de linguagem'),
    ('1a67b8_a12af1e8987146e1abd4b95908a4044c~mv2.png', 'Expressões que não devem ser confundidas'),
    ('1a67b8_da7e90948a3445b2b4d952bd3bee5eb6~mv2.png', 'Palavras parecidas que não devem ser confundidas'),
    ('1a67b8_4838cca1ee0d4e768af18c471bf8abb2~mv2.png', 'Classes de palavras'),
]

CARDS = [
    ('1a67b8_ac1b846c691a46068e08876c9a5dcf47~mv2.png', 'Cesta, sesta, sexta e preposições em português e inglês'),
    ('1a67b8_3fa1f421c7464bcf9d40c7192f71ced8~mv2.png', 'Demais, de mais, São e Santo'),
    ('1a67b8_5b821eddb5d944448b2c689c9d819905~mv2.png', 'Infringir, infligir, a fim e afim'),
    ('1a67b8_3986299424e0498b919bfc6ac189e315~mv2.png', 'Diferir, deferir, te e ti'),
    ('1a67b8_55f3b432f4514590aba492bbe9135720~mv2.png', 'Viagem, viajem, detetizar e dedetizar'),
    ('1a67b8_3aacfaaf9b404c65a03f7687cc68c3d3~mv2.png', 'Perda, perca, em vez de e ao invés de'),
]


def slides_html(items, kind, fit):
    out = []
    for i, (media_id, title) in enumerate(items):
        url = f'https://static.wixstatic.com/media/{media_id}/v1/fit/{fit}/file.webp'
        cls = 'sm-format-carousel-slide is-active' if i == 0 else 'sm-format-carousel-slide'
        loading = 'eager' if i == 0 else 'lazy'
        out.append(
            f'<img class="{cls}" data-sm-carousel-slide="{i}" alt="{kind}: {title}" loading="{loading}" '
            f'fetchpriority="low" decoding="async" src="{url}"/>'
        )
    return ''.join(out)


# 1) Supermapas carousel — idempotent.
if 'data-sm-carousel="maps"' not in html:
    old_map_visual = '<div class="sm-format-v2-visual sm-format-v2-map-visual" aria-hidden="true"><div class="sm-format-v2-map-glow"></div><img fetchpriority="low" alt="" loading="eager" width="1800" height="1266" decoding="async" data-nimg="1" style="color:transparent" src="https://static.wixstatic.com/media/1a67b8_65fd23abbd49440aa523bd8d2b7142df~mv2.png/v1/fit/w_1200,h_844/file.webp"/></div>'
    if old_map_visual not in html:
        raise SystemExit('Fixed Supermapas visual not found.')
    new_map_visual = (
        '<div class="sm-format-v2-visual sm-format-v2-map-visual sm-format-carousel" data-sm-carousel="maps" aria-label="Amostras de Supermapas em carrossel">'
        '<div class="sm-format-v2-map-glow"></div><div class="sm-format-carousel-track">'
        + slides_html(MAPS, 'Supermapa', 'w_1200,h_848') + '</div></div>'
    )
    html = html.replace(old_map_visual, new_map_visual, 1)

# 2) Super-resumos carousel — replace the current fixed two-image composition.
if 'data-sm-carousel="summaries"' not in html:
    pattern = r'<div class="sm-format-v2-visual sm-format-v2-summary-visual" aria-hidden="true">.*?</div><div class="sm-format-v2-copy">'
    replacement = (
        '<div class="sm-format-v2-visual sm-format-v2-summary-visual sm-format-carousel" data-sm-carousel="summaries" aria-label="Amostras de Super-resumos em carrossel">'
        '<div class="sm-format-v2-summary-glow"></div><div class="sm-format-carousel-track">'
        + slides_html(SUMMARIES, 'Super-resumo', 'w_760,h_1080') + '</div></div><div class="sm-format-v2-copy">'
    )
    html, count = re.subn(pattern, replacement, html, count=1, flags=re.S)
    if count != 1:
        raise SystemExit('Fixed Super-resumos visual not found exactly once.')

# 3) Supercards carousel — replace the current fixed three-card composition.
if 'data-sm-carousel="cards"' not in html:
    pattern = r'<div class="sm-format-v2-visual sm-format-v2-card-visual" aria-hidden="true">.*?</div></article>'
    replacement = (
        '<div class="sm-format-v2-visual sm-format-v2-card-visual sm-format-carousel" data-sm-carousel="cards" aria-label="Amostras de Supercards em carrossel">'
        '<div class="sm-format-v2-card-glow"></div><div class="sm-format-carousel-track">'
        + slides_html(CARDS, 'Supercard', 'w_1000,h_667') + '</div></div></article>'
    )
    html, count = re.subn(pattern, replacement, html, count=1, flags=re.S)
    if count != 1:
        raise SystemExit('Fixed Supercards visual not found exactly once.')

# 4) Remove "Veja o material por dentro" and its navigation references — idempotent.
inside_match = re.search(r'<section class="sm-inside" id="amostras".*?</section>(?=<section class="sm-coverage)', html, flags=re.S)
if inside_match:
    html = html[:inside_match.start()] + html[inside_match.end():]
html = html.replace('<a href="#amostras">Veja o material</a>', '', 1)
html = re.sub(r'<button type="button" class="sm-section-nav-stop" style="top:30%" aria-label="Ir para Veja o material"><span aria-hidden="true"></span></button>', '', html, count=1)
html = html.replace("['Veja o material','amostras'],", '', 1)

# Re-space side nav stops once.
nav_guard = "if(!label||!rail||!progress||!thumb||stops.length!==items.length)return;"
nav_reflow = "stops.forEach(function(stop,index){stop.style.top=(index/(items.length-1)*100)+'%';});"
if nav_guard in html and nav_reflow not in html:
    html = html.replace(nav_guard, nav_guard + nav_reflow, 1)

# Preserve near-fold loading strategy: first slide of each carousel can be eager; later slides stay lazy.
old_tune = "document.querySelectorAll('.sm-format-v2-visual img').forEach(function(img){try{img.loading='eager';img.fetchPriority='low'}catch(_){}})"
new_tune = "document.querySelectorAll('.sm-format-v2-visual img:not([data-sm-carousel-slide]),.sm-format-carousel img[data-sm-carousel-slide=\"0\"]').forEach(function(img){try{img.loading='eager';img.fetchPriority='low'}catch(_){}})"
if old_tune in html:
    html = html.replace(old_tune, new_tune, 1)

# 5) Shared carousel styles. Keep the existing unit geometry; only swap the visual content.
carousel_css = '''
<style id="sm-format-carousels-v2">
.sm-format-carousel{position:relative!important;overflow:hidden!important}
.sm-format-carousel .sm-format-carousel-track{position:relative;width:100%;height:100%;min-height:inherit}
.sm-format-carousel .sm-format-carousel-slide{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;object-fit:contain!important;opacity:0;transform:scale(.992)!important;transition:opacity .65s ease,transform .8s ease!important;pointer-events:none}
.sm-format-carousel .sm-format-carousel-slide.is-active{opacity:1;transform:scale(1)!important}
@media (prefers-reduced-motion:reduce){.sm-format-carousel .sm-format-carousel-slide{transition:none!important}}
</style>
'''
if 'id="sm-format-carousels-v2"' not in html:
    html = html.replace('</head>', carousel_css + '</head>', 1)

# 6) One autoplay controller for all three carousels. Stagger starts slightly so the section feels natural.
carousel_js = '''
<script id="sm-format-carousels-v2-js">(function(){
  var roots=[].slice.call(document.querySelectorAll('[data-sm-carousel]'));
  if(!roots.length)return;
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  roots.forEach(function(root,rootIndex){
    var slides=[].slice.call(root.querySelectorAll('[data-sm-carousel-slide]'));
    if(slides.length<2)return;
    var index=0,timer=null,delay=3600;
    function show(next){slides[index].classList.remove('is-active');index=(next+slides.length)%slides.length;slides[index].classList.add('is-active');}
    function stop(){if(timer){clearInterval(timer);timer=null;}}
    function start(){if(reduced||document.hidden||timer)return;timer=setInterval(function(){show(index+1)},delay);}
    document.addEventListener('visibilitychange',function(){if(document.hidden)stop();else start();});
    root.addEventListener('mouseenter',stop);root.addEventListener('mouseleave',start);
    root.addEventListener('focusin',stop);root.addEventListener('focusout',start);
    if(!reduced)setTimeout(start,rootIndex*700);
  });
})();</script>
'''
if 'id="sm-format-carousels-v2-js"' not in html:
    html = html.replace('</body>', carousel_js + '</body>', 1)

# Remove the earlier single-carousel assets if an older materialization exists.
html = re.sub(r'<style id="sm-format-map-carousel-v1">.*?</style>', '', html, flags=re.S)
html = re.sub(r'<script id="sm-format-map-carousel-v1-js">.*?</script>', '', html, flags=re.S)
html = html.replace('sm-format-v2-map-carousel sm-format-v2-map-carousel', 'sm-format-v2-map-carousel')

# Validation.
assert 'id="amostras"' not in html
assert '#amostras' not in html
for key, expected in [('maps', 8), ('summaries', 6), ('cards', 6)]:
    block = re.search(rf'data-sm-carousel="{key}".*?(?=</article>)', html, flags=re.S)
    if not block:
        raise SystemExit(f'Missing {key} carousel after patch.')
    if block.group(0).count('data-sm-carousel-slide=') != expected:
        raise SystemExit(f'{key} carousel has wrong slide count.')
for media_id, _ in MAPS + SUMMARIES + CARDS:
    assert media_id in html

INDEX.write_text(html, encoding='utf-8')
print('Applied sales v2 carousels: 8 Supermapas, 6 Super-resumos, 6 Supercards; removed sm-inside.')
