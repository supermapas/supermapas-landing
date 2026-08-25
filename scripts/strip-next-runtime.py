#!/usr/bin/env python3
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / 'public'
INDEX = ROOT / 'index.html'

html = INDEX.read_text(encoding='utf-8')
before_bytes = len(html.encode('utf-8'))

# The exported page already contains the complete server-rendered landing DOM. For this static
# sales page, React/Next hydration duplicates that DOM payload and loads the full App Router
# runtime even though the only client behaviors we need are the image lightbox, persistent sales
# dock, and section navigator. Keep all compiled files in the artifact for easy rollback, but stop
# referencing the Next JavaScript runtime from index.html.

link_re = re.compile(r'<link\b[^>]*>', re.IGNORECASE)

def strip_script_preload(match):
    tag = match.group(0)
    low = tag.lower()
    if 'rel="preload"' in low and 'as="script"' in low and '/_next/static/chunks/' in low:
        return ''
    return tag

html, preload_scan_count = link_re.subn(strip_script_preload, html)

next_script_re = re.compile(
    r'<script\b[^>]*\bsrc=["\']/_next/static/chunks/[^"\']+["\'][^>]*>\s*</script>',
    re.IGNORECASE,
)
html, next_script_count = next_script_re.subn('', html)

script_re = re.compile(r'<script\b([^>]*)>(.*?)</script>', re.IGNORECASE | re.DOTALL)
rsc_count = 0

def strip_rsc(match):
    global rsc_count
    attrs, body = match.group(1), match.group(2)
    if 'self.__next_f' in body:
        rsc_count += 1
        return ''
    return match.group(0)

html = script_re.sub(strip_rsc, html)

static_runtime = r'''<script id="sm-static-interactions">(function(){
'use strict';

function onReady(fn){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn,{once:true});
  else fn();
}

function initLightbox(){
  var overlay=null,previousBodyOverflow='';

  function dataFor(article){
    if(!article)return null;
    var img=article.querySelector('.sm-inside-map-stage img');
    if(!img)return null;
    var labelNode=article.querySelector('.sm-inside-feature-meta small');
    var titleNode=article.querySelector('.sm-inside-feature-meta h3');
    var isSummary=article.classList.contains('sm-inside-feature--summary');
    return {
      label:labelNode?labelNode.textContent.trim():'MATERIAL REAL',
      title:titleNode?titleNode.textContent.trim():'Supermapas',
      alt:img.getAttribute('alt')||'',
      src:img.currentSrc||img.getAttribute('src')||'',
      srcSet:img.getAttribute('srcset')||'',
      width:isSummary?1400:1800,
      height:isSummary?1980:1272
    };
  }

  function close(){
    if(!overlay)return;
    overlay.remove();
    overlay=null;
    document.body.style.overflow=previousBodyOverflow;
    window.removeEventListener('keydown',onKey);
  }

  function onKey(e){if(e.key==='Escape')close();}

  function open(article){
    var data=dataFor(article);
    if(!data||!data.src)return;
    close();
    var zoomed=false;
    previousBodyOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';

    overlay=document.createElement('div');
    overlay.className='sm-image-lightbox';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-label',data.label+': '+data.title);
    overlay.innerHTML='<div class="sm-image-lightbox-panel"><div class="sm-image-lightbox-toolbar"><div class="sm-image-lightbox-title"><small></small><strong></strong></div><div class="sm-image-lightbox-actions"><button type="button">AMPLIAR</button><button class="sm-image-lightbox-close" type="button" aria-label="Fechar imagem ampliada">×</button></div></div><div class="sm-image-lightbox-stage"><img decoding="async"></div></div>';

    overlay.querySelector('.sm-image-lightbox-title small').textContent=data.label;
    overlay.querySelector('.sm-image-lightbox-title strong').textContent=data.title;
    var toggle=overlay.querySelector('.sm-image-lightbox-actions button:first-child');
    var stage=overlay.querySelector('.sm-image-lightbox-stage');
    var large=stage.querySelector('img');
    large.src=data.src;
    if(data.srcSet)large.setAttribute('srcset',data.srcSet);
    large.setAttribute('sizes','96vw');
    large.alt=data.alt;
    large.width=data.width;
    large.height=data.height;

    function toggleZoom(){
      zoomed=!zoomed;
      stage.classList.toggle('is-zoomed',zoomed);
      toggle.textContent=zoomed?'AJUSTAR':'AMPLIAR';
      large.setAttribute('sizes',zoomed?String(data.width)+'px':'96vw');
    }

    toggle.addEventListener('click',toggleZoom);
    large.addEventListener('click',toggleZoom);
    overlay.querySelector('.sm-image-lightbox-close').addEventListener('click',close);
    overlay.addEventListener('mousedown',function(e){if(e.target===overlay)close();});
    document.body.appendChild(overlay);
    window.addEventListener('keydown',onKey);
  }

  document.addEventListener('click',function(e){
    var expand=e.target.closest&&e.target.closest('.sm-inside-expand-link');
    if(expand){open(expand.closest('article'));return;}
    var marker=e.target.closest&&e.target.closest('.sm-inside-open');
    if(marker){
      var stage=marker.closest('.sm-inside-map-stage');
      if(stage)open(stage.closest('article'));
    }
  });
}

function initDock(){
  var shell=document.querySelector('.sm-sales-shell');
  var scroller=document.querySelector('.sm-sales-scroll');
  if(!shell||!scroller)return;
  var mq=window.matchMedia('(max-width: 640px)');
  var heroObserver=null,offerObserver=null,dock=null;
  var heroVisible=true,offerVisible=false;

  function dockMarkup(){
    return '<div class="sm-dock-counts"><strong>98 Supermapas + 50 Super-Resumos + 190 Supercards</strong><span>acervo completo</span></div><div class="sm-dock-price"><strong>12x de R$6,93</strong><span>ou R$67 à vista</span></div><div class="sm-dock-actions"><a class="sm-dock-checkout" href="https://pay.hotmart.com/A92093667Q?checkoutMode=2&off=ia91gsts">Acessar agora <b aria-hidden="true">→</b></a><a class="sm-dock-whatsapp" href="https://wa.me/message/EFBIDZUKN7B2O1" target="_blank" rel="noreferrer" aria-label="Tire dúvidas com o Supermapas pelo WhatsApp em uma nova aba"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.12 1.03 6.99 2.9a9.825 9.825 0 0 1 2.9 7.01c-.003 5.45-4.443 9.89-9.906 9.89m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.14 1.588 5.945L.056 24l6.304-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"></path></svg><span>Tire dúvidas</span></a></div>';
  }

  function render(){
    var shouldShow=!heroVisible&&scroller.scrollTop>120&&!(mq.matches&&offerVisible);
    if(shouldShow&&!dock){
      dock=document.createElement('div');
      dock.className='sm-sales-dock sm-sales-dock-visible';
      dock.setAttribute('aria-label','Oferta Supermapas');
      dock.innerHTML=dockMarkup();
      shell.appendChild(dock);
    }else if(!shouldShow&&dock){
      dock.remove();
      dock=null;
    }
  }

  function disconnect(){
    if(heroObserver)heroObserver.disconnect();
    if(offerObserver)offerObserver.disconnect();
    heroObserver=offerObserver=null;
  }

  function bind(){
    disconnect();
    heroVisible=true;
    offerVisible=false;
    var hero=document.getElementById(mq.matches?'inicio-mobile':'inicio-desktop');
    var offer=document.getElementById('oferta');
    if(hero){
      heroObserver=new IntersectionObserver(function(entries){heroVisible=entries[0].isIntersecting;render();},{root:scroller,threshold:.04});
      heroObserver.observe(hero);
    }
    if(offer){
      offerObserver=new IntersectionObserver(function(entries){offerVisible=entries[0].isIntersecting;render();},{root:scroller,threshold:.02});
      offerObserver.observe(offer);
    }
    render();
  }

  scroller.addEventListener('scroll',render,{passive:true});
  if(mq.addEventListener)mq.addEventListener('change',bind);else mq.addListener(bind);
  bind();
}

function initSectionNav(){
  var items=[
    ['Início','inicio'],['O que você recebe','formatos'],['Como o visual ajuda','estudo-visual'],
    ['Veja o material','amostras'],['Conteúdos','conteudo'],['Para quem é?','publicos'],
    ['Avaliações','prova-social'],['Qual o valor?','oferta'],['Informações essenciais','informacoes-essenciais'],
    ['Quem está por trás?','idealizadores'],['Dúvidas finais','faq']
  ];
  var nav=document.querySelector('.sm-section-nav');
  var scroller=document.querySelector('.sm-sales-scroll');
  if(!nav||!scroller)return;
  var label=nav.querySelector('.sm-section-nav-label');
  var rail=nav.querySelector('.sm-section-nav-rail');
  var progress=nav.querySelector('.sm-section-nav-progress');
  var thumb=nav.querySelector('.sm-section-nav-thumb');
  var stops=Array.prototype.slice.call(nav.querySelectorAll('.sm-section-nav-stop'));
  if(!label||!rail||!progress||!thumb||stops.length!==items.length)return;

  var active=0,preview=0,hovering=false,dragging=false,raf=null,hideTimer=null,locked=null,allLabels=null;

  function section(id){
    if(id!=='inicio')return document.getElementById(id);
    var desktop=document.getElementById('inicio-desktop');
    var mobile=document.getElementById('inicio-mobile');
    return desktop&&desktop.getBoundingClientRect().height>0?desktop:mobile;
  }

  function showLabel(temporary){
    nav.classList.add('is-label-visible');
    if(hideTimer){clearTimeout(hideTimer);hideTimer=null;}
    if(temporary){
      hideTimer=setTimeout(function(){if(!dragging&&!hovering)nav.classList.remove('is-label-visible');},1300);
    }
  }

  function ensureAllLabels(){
    if(!dragging){if(allLabels){allLabels.remove();allLabels=null;}return;}
    if(!allLabels){
      allLabels=document.createElement('div');
      allLabels.className='sm-section-nav-all-labels';
      allLabels.setAttribute('aria-hidden','true');
      items.forEach(function(item,index){
        var span=document.createElement('span');
        span.className='sm-section-nav-all-label';
        span.style.top=(index/(items.length-1)*100)+'%';
        span.textContent=item[0];
        allLabels.appendChild(span);
      });
      rail.appendChild(allLabels);
    }
    Array.prototype.forEach.call(allLabels.children,function(span,index){span.classList.toggle('is-selected',index===preview);});
  }

  function render(index){
    var shown=typeof index==='number'?index:(dragging||hovering?preview:active);
    var ratio=shown/(items.length-1);
    label.textContent=items[shown][0];
    label.style.top=(ratio*100)+'%';
    progress.style.height=(ratio*100)+'%';
    thumb.style.top=(ratio*100)+'%';
    stops.forEach(function(stop,index){
      stop.classList.toggle('is-active',index===active);
      stop.classList.toggle('is-preview',index===shown);
      if(index===active)stop.setAttribute('aria-current','location');else stop.removeAttribute('aria-current');
    });
    nav.classList.toggle('is-dragging',dragging);
    ensureAllLabels();
  }

  function scan(){
    raf=null;
    if(dragging)return;
    var anchor=.38*window.innerHeight,best=0,distance=Infinity;
    items.forEach(function(item,index){
      var el=section(item[1]);
      if(!el)return;
      var rect=el.getBoundingClientRect();
      if(rect.top<=anchor&&rect.bottom>=anchor){best=index;distance=-1;return;}
      if(distance>=0){
        var d=Math.min(Math.abs(rect.top-anchor),Math.abs(rect.bottom-anchor));
        if(d<distance){distance=d;best=index;}
      }
    });
    if(best!==active){active=best;preview=best;showLabel(true);}
    else if(!hovering)preview=active;
    render();
  }

  function schedule(){if(raf===null)raf=requestAnimationFrame(scan);}

  function scrollTo(index){
    var el=section(items[index][1]);
    if(!el)return;
    var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
    active=index;preview=index;
    showLabel(true);
    render(index);
  }

  function indexFromY(y){
    var rect=rail.getBoundingClientRect();
    var ratio=Math.max(0,Math.min(1,(y-rect.top)/rect.height));
    return Math.round(ratio*(items.length-1));
  }

  function lockScroll(){
    if(locked)return;
    locked={overflowY:scroller.style.overflowY,overscrollBehaviorY:scroller.style.overscrollBehaviorY};
    scroller.style.overflowY='hidden';
    scroller.style.overscrollBehaviorY='none';
  }

  function unlockScroll(){
    if(!locked)return;
    scroller.style.overflowY=locked.overflowY;
    scroller.style.overscrollBehaviorY=locked.overscrollBehaviorY;
    locked=null;
  }

  function finishDrag(index){
    if(!dragging)return;
    dragging=false;
    unlockScroll();
    if(typeof index==='number')scrollTo(index);else{preview=active;showLabel(true);render();}
  }

  stops.forEach(function(stop,index){
    stop.addEventListener('click',function(){if(!dragging)scrollTo(index);});
    stop.addEventListener('focus',function(){preview=index;hovering=true;showLabel(false);render(index);});
    stop.addEventListener('blur',function(){hovering=false;preview=active;showLabel(true);render();});
  });

  rail.addEventListener('pointerenter',function(){hovering=true;preview=active;showLabel(false);render();});
  rail.addEventListener('pointerleave',function(){if(!dragging){hovering=false;preview=active;showLabel(true);render();}});
  rail.addEventListener('pointerdown',function(e){
    if(e.pointerType==='mouse'&&e.button!==0)return;
    e.preventDefault();e.stopPropagation();
    dragging=true;hovering=true;lockScroll();showLabel(false);
    if(rail.setPointerCapture)rail.setPointerCapture(e.pointerId);
    preview=indexFromY(e.clientY);render(preview);
  });
  rail.addEventListener('pointermove',function(e){if(!dragging)return;e.preventDefault();preview=indexFromY(e.clientY);render(preview);});
  rail.addEventListener('pointerup',function(e){
    if(!dragging)return;
    e.preventDefault();e.stopPropagation();
    var index=indexFromY(e.clientY);
    if(rail.hasPointerCapture&&rail.hasPointerCapture(e.pointerId))rail.releasePointerCapture(e.pointerId);
    hovering=false;finishDrag(index);
  });
  rail.addEventListener('pointercancel',function(){hovering=false;finishDrag();});
  rail.addEventListener('lostpointercapture',function(){if(dragging){hovering=false;finishDrag(preview);}});

  scroller.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  try{if(new URLSearchParams(location.search).get('embed')==='wix')showLabel(true);}catch(_){ }
  scan();
}

onReady(function(){initLightbox();initDock();initSectionNav();});
})();</script>'''

if 'id="sm-static-interactions"' in html:
    raise SystemExit('static interaction runtime already present before optimization')
if '</body>' not in html:
    raise SystemExit('closing body missing')
html = html.replace('</body>', static_runtime + '</body>', 1)

# Safety assertions. The compiled runtime files remain in public/_next/static/chunks; only their
# network references and RSC hydration payload are removed from the document.
checks = [
    ('static interaction runtime', 'id="sm-static-interactions"' in html),
    ('no Next chunk script references', not re.search(r'<script\b[^>]*\bsrc=["\']/_next/static/chunks/', html, re.I)),
    ('no Next script preloads', not re.search(r'<link\b(?=[^>]*as=["\']script["\'])(?=[^>]*href=["\']/_next/static/chunks/)', html, re.I)),
    ('no RSC hydration payload', 'self.__next_f' not in html),
    ('landing CSS preserved', 'href="/_next/static/chunks/06-3g1k36rw0y.css"' in html and 'href="/_next/static/chunks/3qg_tgjt67qum.css"' in html),
    ('lightbox behavior', 'sm-image-lightbox' in html and 'Escape' in html),
    ('dock behavior', 'sm-dock-checkout' in html and 'IntersectionObserver' in html),
    ('section nav behavior', 'setPointerCapture' in html and 'scrollIntoView' in html),
    ('tracking preserved', 'sm-meta-pixel' in html and 'sm-google-tag' in html),
    ('checkout attribution preserved', 'sm-checkout-attribution' in html and 'fbclid' in html and 'gclid' in html),
    ('return recovery preserved', 'recoverMarkedImages' in html and '_sm_retry' in html),
]
failed=[name for name,ok in checks if not ok]
if failed:
    raise SystemExit('static runtime validation failed: '+', '.join(failed))

INDEX.write_text(html, encoding='utf-8')
after_bytes=len(html.encode('utf-8'))
print(
    'static runtime optimization passed; '
    f'Next scripts removed: {next_script_count}; RSC scripts removed: {rsc_count}; '
    f'HTML bytes: {before_bytes} -> {after_bytes}'
)
