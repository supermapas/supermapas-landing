#!/usr/bin/env python3
from pathlib import Path
import re

INDEX = Path('public/index.html')
html = INDEX.read_text(encoding='utf-8')

# 1) Replace only the fixed Supermapas visual in "O que você recebe" with an optimized autoplay carousel.
old_map_visual = '''<div class="sm-format-v2-visual sm-format-v2-map-visual" aria-hidden="true"><div class="sm-format-v2-map-glow"></div><img fetchpriority="low" alt="" loading="eager" width="1800" height="1266" decoding="async" data-nimg="1" style="color:transparent" src="https://static.wixstatic.com/media/1a67b8_65fd23abbd49440aa523bd8d2b7142df~mv2.png/v1/fit/w_1200,h_844/file.webp"/></div>'''

slides = [
    ('1a67b8_3e827dcacabe4d1b88a221cb0ca6b105~mv2.png', 'Conjunções coordenativas'),
    ('1a67b8_30dae8421505424690773b1fec45576c~mv2.png', 'Termos integrantes da oração'),
    ('1a67b8_c3225c09f1d342eb80d4ecad55949b12~mv2.png', 'Concordância verbal'),
    ('1a67b8_ac2d2e76c7284c5884b89c37cc468ebc~mv2.png', 'Uso da vírgula'),
    ('1a67b8_4a00ecc7a0714bc4946bbc1cdafdd8e8~mv2.png', 'Figuras de pensamento'),
    ('1a67b8_ee950fcb35dd46d6aa3cac85c3018a1e~mv2.png', 'Classificação dos verbos'),
    ('1a67b8_671c4f73838544f99f02cf381f2c30d0~mv2.png', 'Vozes verbais'),
    ('1a67b8_b19132c7753849e08a076d81791245a4~mv2.png', 'Crase'),
]

slide_html = []
for i, (media_id, title) in enumerate(slides):
    url = f'https://static.wixstatic.com/media/{media_id}/v1/fit/w_1200,h_848/file.webp'
    loading = 'eager' if i == 0 else 'lazy'
    fetchpriority = 'low'
    cls = 'sm-format-v2-map-slide is-active' if i == 0 else 'sm-format-v2-map-slide'
    slide_html.append(
        f'<img class="{cls}" data-sm-carousel-slide="{i}" fetchpriority="{fetchpriority}" alt="Supermapa de {title}" loading="{loading}" width="1200" height="848" decoding="async" src="{url}"/>'
    )

new_map_visual = (
    '<div class="sm-format-v2-visual sm-format-v2-map-visual sm-format-v2-map-carousel" aria-label="Amostras de Supermapas em carrossel">'
    '<div class="sm-format-v2-map-glow"></div>'
    '<div class="sm-format-v2-map-carousel-track">' + ''.join(slide_html) + '</div>'
    '</div>'
)

if old_map_visual not in html:
    raise SystemExit('Fixed Supermapas visual not found; refusing to patch the wrong bundle.')
html = html.replace(old_map_visual, new_map_visual, 1)

# 2) Remove the entire "Veja o material por dentro" section.
inside_match = re.search(r'<section class="sm-inside" id="amostras".*?</section>(?=<section class="sm-coverage)', html, flags=re.S)
if not inside_match:
    raise SystemExit('sm-inside section not found.')
html = html[:inside_match.start()] + html[inside_match.end():]

# Remove its desktop navigation link.
html = html.replace('<a href="#amostras">Veja o material</a>', '', 1)

# Remove the matching side-navigation stop and the static JS entry.
html, nav_stop_count = re.subn(
    r'<button type="button" class="sm-section-nav-stop" style="top:30%" aria-label="Ir para Veja o material"><span aria-hidden="true"></span></button>',
    '', html, count=1
)
if nav_stop_count != 1:
    raise SystemExit('Side nav stop for removed section not found exactly once.')
html = html.replace("['Veja o material','amostras'],", '', 1)

# Re-space side nav stops dynamically now that there are 10 sections instead of 11.
nav_guard = "if(!label||!rail||!progress||!thumb||stops.length!==items.length)return;"
nav_guard_replacement = nav_guard + "stops.forEach(function(stop,index){stop.style.top=(index/(items.length-1)*100)+'%';});"
if nav_guard not in html:
    raise SystemExit('Section-nav initialization guard not found.')
html = html.replace(nav_guard, nav_guard_replacement, 1)

# 3) Preserve the current near-fold loading strategy: only the first carousel image is eager.
old_tune = "document.querySelectorAll('.sm-format-v2-visual img').forEach(function(img){try{img.loading='eager';img.fetchPriority='low'}catch(_){}})"
new_tune = "document.querySelectorAll('.sm-format-v2-visual img:not([data-sm-carousel-slide]),.sm-format-v2-map-carousel img[data-sm-carousel-slide=\"0\"]').forEach(function(img){try{img.loading='eager';img.fetchPriority='low'}catch(_){}})"
if old_tune not in html:
    raise SystemExit('Near-fold image tuning hook not found.')
html = html.replace(old_tune, new_tune, 1)

# 4) Add minimal carousel styles without changing the approved section layout.
carousel_css = '''
<style id="sm-format-map-carousel-v1">
.sm-format-v2-map-carousel{position:relative;overflow:hidden}
.sm-format-v2-map-carousel-track{position:relative;width:100%;height:100%;min-height:inherit}
.sm-format-v2-map-carousel .sm-format-v2-map-slide{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;opacity:0;transform:scale(.992);transition:opacity .65s ease,transform .8s ease;pointer-events:none}
.sm-format-v2-map-carousel .sm-format-v2-map-slide.is-active{opacity:1;transform:scale(1)}
@media (prefers-reduced-motion:reduce){.sm-format-v2-map-carousel .sm-format-v2-map-slide{transition:none}}
</style>
'''
if '</head>' not in html:
    raise SystemExit('Missing </head>.')
html = html.replace('</head>', carousel_css + '</head>', 1)

# 5) Autoplay with pause when the tab is hidden and respect reduced motion.
carousel_js = '''
<script id="sm-format-map-carousel-v1-js">(function(){
  var root=document.querySelector('.sm-format-v2-map-carousel');
  if(!root)return;
  var slides=[].slice.call(root.querySelectorAll('[data-sm-carousel-slide]'));
  if(slides.length<2)return;
  var index=0,timer=null,delay=3600;
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function show(next){slides[index].classList.remove('is-active');index=(next+slides.length)%slides.length;slides[index].classList.add('is-active');}
  function stop(){if(timer){clearInterval(timer);timer=null;}}
  function start(){if(reduced||document.hidden||timer)return;timer=setInterval(function(){show(index+1)},delay);}
  document.addEventListener('visibilitychange',function(){if(document.hidden)stop();else start();});
  root.addEventListener('mouseenter',stop);root.addEventListener('mouseleave',start);
  root.addEventListener('focusin',stop);root.addEventListener('focusout',start);
  start();
})();</script>
'''
if '</body>' not in html:
    raise SystemExit('Missing </body>.')
html = html.replace('</body>', carousel_js + '</body>', 1)

# Validation: removed section must be gone and all 8 optimized slides present.
assert 'id="amostras"' not in html
assert '#amostras' not in html
assert html.count('data-sm-carousel-slide=') >= 8
for media_id, _ in slides:
    assert media_id in html

INDEX.write_text(html, encoding='utf-8')
print('Applied first aggressive-sales-v2 iteration: 8-map carousel + removed sm-inside section.')
