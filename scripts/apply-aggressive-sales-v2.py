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

def slides(items, kind, fit):
    parts=[]
    for i,(media_id,title) in enumerate(items):
        active=' is-active' if i==0 else ''
        loading='eager' if i==0 else 'lazy'
        url=f'https://static.wixstatic.com/media/{media_id}/v1/fit/{fit}/file.webp'
        parts.append(f'<img class="sm-format-carousel-slide{active}" data-sm-carousel-slide="{i}" alt="{kind}: {title}" loading="{loading}" fetchpriority="low" decoding="async" src="{url}"/>')
    return ''.join(parts)

def article(kind, copy, items, fit, glow):
    return (
        f'<article class="sm-format-v2-unit sm-format-v2-unit-{kind}">'
        + (copy if kind != 'summary' else '')
        + f'<div class="sm-format-v2-visual sm-format-v2-{kind}-visual sm-format-carousel" data-sm-carousel="{ "cards" if kind=="card" else ("summaries" if kind=="summary" else "maps") }" aria-label="Amostras em carrossel">'
        + f'<div class="{glow}"></div><div class="sm-format-carousel-track">{slides(items, "Supercard" if kind=="card" else ("Super-resumo" if kind=="summary" else "Supermapa"), fit)}</div></div>'
        + (copy if kind == 'summary' else '')
        + '</article>'
    )

map_copy='<div class="sm-format-v2-copy"><div class="sm-format-v2-kicker"><span class="sm-format-v2-index">01</span><span class="sm-format-v2-purpose">ENTENDER E CONSULTAR</span></div><h3 class="sm-format-v2-title"><strong>98</strong><span>Supermapas</span></h3><p>Regras, relações e exemplos organizados visualmente para compreender e consultar conteúdos completos.</p></div>'
summary_copy='<div class="sm-format-v2-copy"><div class="sm-format-v2-kicker"><span class="sm-format-v2-index">02</span><span class="sm-format-v2-purpose">REVISAR</span></div><h3 class="sm-format-v2-title"><strong>50</strong><span>Super-resumos</span></h3><p>O essencial de cada tema condensado para retomar pontos importantes com rapidez e clareza.</p></div>'
card_copy='<div class="sm-format-v2-copy"><div class="sm-format-v2-kicker"><span class="sm-format-v2-index">03</span><span class="sm-format-v2-purpose">REFORÇAR</span></div><h3 class="sm-format-v2-title"><strong>190</strong><span>Supercards</span></h3><p>Conceitos-chave em cards objetivos para reforçar conteúdos e fazer revisões curtas ao longo da rotina.</p></div>'

repls=[
    (r'<article class="sm-format-v2-unit sm-format-v2-unit-map">.*?</article>', article('map', map_copy, MAPS, 'w_1200,h_848', 'sm-format-v2-map-glow')),
    (r'<article class="sm-format-v2-unit sm-format-v2-unit-summary">.*?</article>', article('summary', summary_copy, SUMMARIES, 'w_760,h_1080', 'sm-format-v2-summary-glow')),
    (r'<article class="sm-format-v2-unit sm-format-v2-unit-card">.*?</article>', article('card', card_copy, CARDS, 'w_1000,h_667', 'sm-format-v2-card-glow')),
]
for pattern,replacement in repls:
    html,count=re.subn(pattern,replacement,html,count=1,flags=re.S)
    if count!=1 and 'data-sm-carousel=' not in html:
        raise SystemExit(f'Could not replace format article: {pattern}')

# Remove the old detailed samples section and navigation references.
html=re.sub(r'<section class="sm-inside" id="amostras".*?</section>(?=<section class="sm-coverage)', '', html, count=1, flags=re.S)
html=html.replace('<a href="#amostras">Veja o material</a>','')
html=re.sub(r'<button type="button" class="sm-section-nav-stop"[^>]*aria-label="Ir para Veja o material"[^>]*><span aria-hidden="true"></span></button>','',html,count=1)
html=html.replace("['Veja o material','amostras'],",'')

nav_guard="if(!label||!rail||!progress||!thumb||stops.length!==items.length)return;"
nav_reflow="stops.forEach(function(stop,index){stop.style.top=(index/(items.length-1)*100)+'%';});"
if nav_guard in html and nav_reflow not in html:
    html=html.replace(nav_guard,nav_guard+nav_reflow,1)

old_tune="document.querySelectorAll('.sm-format-v2-visual img').forEach(function(img){try{img.loading='eager';img.fetchPriority='low'}catch(_){}})"
new_tune="document.querySelectorAll('.sm-format-v2-visual img:not([data-sm-carousel-slide]),.sm-format-carousel img[data-sm-carousel-slide=\"0\"]').forEach(function(img){try{img.loading='eager';img.fetchPriority='low'}catch(_){}})"
html=html.replace(old_tune,new_tune)

css='''<style id="sm-format-carousels-v2">.sm-format-carousel{position:relative!important;overflow:hidden!important}.sm-format-carousel .sm-format-carousel-track{position:relative;width:100%;height:100%;min-height:inherit}.sm-format-carousel .sm-format-carousel-slide{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;object-fit:contain!important;opacity:0;transform:scale(.992)!important;transition:opacity .65s ease,transform .8s ease!important;pointer-events:none}.sm-format-carousel .sm-format-carousel-slide.is-active{opacity:1;transform:scale(1)!important}@media (prefers-reduced-motion:reduce){.sm-format-carousel .sm-format-carousel-slide{transition:none!important}}</style>'''
if 'id="sm-format-carousels-v2"' not in html:
    html=html.replace('</head>',css+'</head>',1)
js='''<script id="sm-format-carousels-v2-js">(function(){var roots=[].slice.call(document.querySelectorAll('[data-sm-carousel]'));if(!roots.length)return;var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;roots.forEach(function(root,ri){var slides=[].slice.call(root.querySelectorAll('[data-sm-carousel-slide]'));if(slides.length<2)return;var index=0,timer=null;function show(n){slides[index].classList.remove('is-active');index=(n+slides.length)%slides.length;slides[index].classList.add('is-active')}function stop(){if(timer){clearInterval(timer);timer=null}}function start(){if(reduced||document.hidden||timer)return;timer=setInterval(function(){show(index+1)},3600)}document.addEventListener('visibilitychange',function(){if(document.hidden)stop();else start()});root.addEventListener('mouseenter',stop);root.addEventListener('mouseleave',start);if(!reduced)setTimeout(start,ri*700)})})();</script>'''
if 'id="sm-format-carousels-v2-js"' not in html:
    html=html.replace('</body>',js+'</body>',1)

if 'data-sm-carousel="maps"' not in html or 'data-sm-carousel="summaries"' not in html or 'data-sm-carousel="cards"' not in html:
    raise SystemExit('Carousel materialization incomplete')
if 'id="amostras"' in html:
    raise SystemExit('Old samples section still present')

INDEX.write_text(html,encoding='utf-8')
print('Applied robust sales v2 carousels and removed old samples section.')
