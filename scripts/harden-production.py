#!/usr/bin/env python3
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / 'public'
INDEX = ROOT / 'index.html'

CANONICAL = 'https://www.supermapas.com.br/'
TITLE = 'Supermapas de Língua Portuguesa | Supermapas'
DESCRIPTION = '98 Supermapas, 50 Super-resumos e 190 Supercards para estudar, revisar e consultar Língua Portuguesa de forma visual.'
OG_IMAGE = 'https://static.wixstatic.com/media/1a67b8_3ac74c621b754162abd32de5d6843052~mv2.png'
FAVICON = 'https://static.wixstatic.com/media/1a67b8_4f097583af86427db8e4168a1012c7a3~mv2.png'
META_PIXEL_ID = '261169597067924'
GOOGLE_TAG_ID = 'AW-18370953717'
CHECKOUT_OLD = 'https://pay.hotmart.com/A92093667Q?checkoutMode=2&off=ia91gsts'
CHECKOUT = 'https://pay.hotmart.com/A92093667Q?off=ia91gsts&checkoutMode=10'

# Keep the approved visuals, but request appropriately sized WebP variants from the same Wix CDN.
# Replacements are applied across the hydrated bundle so React cannot restore the heavier PNG URLs.
HERO_IMAGE_ORIGINAL = 'https://static.wixstatic.com/media/1a67b8_3ac74c621b754162abd32de5d6843052~mv2.png'
HERO_IMAGE_WEBP = 'https://static.wixstatic.com/media/1a67b8_3ac74c621b754162abd32de5d6843052~mv2.png/v1/fit/w_1600,h_1200/file.webp'
IMAGE_REWRITES = {
    HERO_IMAGE_ORIGINAL: HERO_IMAGE_WEBP,
    'https://static.wixstatic.com/media/1a67b8_65fd23abbd49440aa523bd8d2b7142df~mv2.png':
        'https://static.wixstatic.com/media/1a67b8_65fd23abbd49440aa523bd8d2b7142df~mv2.png/v1/fit/w_1200,h_844/file.webp',
    'https://static.wixstatic.com/media/1a67b8_97c960898bc04b7b8c8e9b1c0c1e49ab~mv2.png':
        'https://static.wixstatic.com/media/1a67b8_97c960898bc04b7b8c8e9b1c0c1e49ab~mv2.png/v1/fit/w_760,h_1054/file.webp',
    'https://static.wixstatic.com/media/1a67b8_01c579c2d24b495bbd011e319bebeb41~mv2.png':
        'https://static.wixstatic.com/media/1a67b8_01c579c2d24b495bbd011e319bebeb41~mv2.png/v1/fit/w_760,h_1054/file.webp',
    'https://static.wixstatic.com/media/1a67b8_b696731e83344bc893cf613867cee66c~mv2.png':
        'https://static.wixstatic.com/media/1a67b8_b696731e83344bc893cf613867cee66c~mv2.png/v1/fit/w_640,h_904/file.webp',
    'https://static.wixstatic.com/media/1a67b8_fbd380961a1b47d3aa4569aef6278ebb~mv2.png':
        'https://static.wixstatic.com/media/1a67b8_fbd380961a1b47d3aa4569aef6278ebb~mv2.png/v1/fit/w_640,h_904/file.webp',
    'https://static.wixstatic.com/media/1a67b8_4906fb8fd7ef4ec1b33346f2b3ce670d~mv2.png':
        'https://static.wixstatic.com/media/1a67b8_4906fb8fd7ef4ec1b33346f2b3ce670d~mv2.png/v1/fit/w_640,h_904/file.webp',
}

# Replace stale checkout references and the selected image URLs everywhere React may hydrate from,
# not only index.html.
replaced = 0
image_replacements = 0
for path in ROOT.rglob('*'):
    if not path.is_file() or path.suffix.lower() not in {'.html', '.js', '.json', '.txt'}:
        continue
    try:
        text = path.read_text(encoding='utf-8')
    except (UnicodeDecodeError, OSError):
        continue

    changed = False

    count = text.count(CHECKOUT_OLD)
    if count:
        text = text.replace(CHECKOUT_OLD, CHECKOUT)
        replaced += count
        changed = True

    for old, new in IMAGE_REWRITES.items():
        count = text.count(old)
        if count:
            text = text.replace(old, new)
            image_replacements += count
            changed = True

    if changed:
        path.write_text(text, encoding='utf-8')

html = INDEX.read_text(encoding='utf-8')

head = f'''\n<link rel="canonical" href="{CANONICAL}"/>\n<meta property="og:type" content="website"/>\n<meta property="og:locale" content="pt_BR"/>\n<meta property="og:site_name" content="Supermapas"/>\n<meta property="og:title" content="{TITLE}"/>\n<meta property="og:description" content="{DESCRIPTION}"/>\n<meta property="og:url" content="{CANONICAL}"/>\n<meta property="og:image" content="{OG_IMAGE}"/>\n<meta name="twitter:card" content="summary_large_image"/>\n<link rel="icon" href="{FAVICON}"/>\n<script id="sm-meta-pixel">!function(f,b,e,v,n,t,s){{if(f.fbq)return;n=f.fbq=function(){{n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)}};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','{META_PIXEL_ID}');fbq('track','PageView');</script>\n'''
if 'id="sm-meta-pixel"' not in html:
    if '</head>' not in html:
        raise SystemExit('closing head missing')
    html = html.replace('</head>', head + '</head>', 1)

hero_perf = f'''\n<link id="sm-wix-preconnect" rel="preconnect" href="https://static.wixstatic.com" crossorigin=""/>\n<link id="sm-hero-preload" rel="preload" as="image" href="{HERO_IMAGE_WEBP}" fetchpriority="high"/>\n'''
if 'id="sm-hero-preload"' not in html:
    if '</head>' not in html:
        raise SystemExit('closing head missing')
    html = html.replace('</head>', hero_perf + '</head>', 1)

google_tag = f'''\n<script async id="sm-google-tag-loader" src="https://www.googletagmanager.com/gtag/js?id={GOOGLE_TAG_ID}"></script>\n<script id="sm-google-tag">window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','{GOOGLE_TAG_ID}');</script>\n'''
if 'id="sm-google-tag"' not in html:
    if '</head>' not in html:
        raise SystemExit('closing head missing')
    html = html.replace('</head>', google_tag + '</head>', 1)

def make_hero_eager(match):
    tag = match.group(0)
    if 'loading="lazy"' in tag:
        tag = tag.replace('loading="lazy"', 'loading="eager"', 1)
    elif 'loading=' not in tag:
        tag = tag.replace('<img', '<img loading="eager"', 1)
    return tag

html = re.sub(r'<img\b[^>]*class="sm-(?:dh|mh)-composite"[^>]*>', make_hero_eager, html)

forward = r'''<script id="sm-checkout-attribution">(function(){var KEYS=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','gclid','ttclid'];var src=new URLSearchParams(location.search);function patchLink(a){try{var u=new URL(a.href,location.href);KEYS.forEach(function(k){var v=src.get(k);if(v)u.searchParams.set(k,v)});a.href=u.toString()}catch(_){}}function patchAll(){document.querySelectorAll('a[href*="pay.hotmart.com/A92093667Q"]').forEach(patchLink)}function markPendingImages(){document.querySelectorAll('img').forEach(function(img){try{if(img.complete&&img.naturalWidth>0)return;var selected=img.currentSrc||img.getAttribute('src');if(!selected)return;img.dataset.smReturnRetry='1';img.dataset.smReturnSrc=selected}catch(_){}})}function retryImage(img){try{if(img.dataset.smReturnRetried==='1')return;if(img.complete&&img.naturalWidth>0){delete img.dataset.smReturnRetry;delete img.dataset.smReturnSrc;return}var s=img.dataset.smReturnSrc||img.currentSrc||img.getAttribute('src');if(!s)return;img.dataset.smReturnRetried='1';img.removeAttribute('srcset');img.removeAttribute('sizes');img.removeAttribute('loading');img.loading='eager';img.fetchPriority='high';var u=new URL(s,location.href);u.searchParams.set('_sm_retry','1');img.src=u.toString();img.addEventListener('load',function(){delete img.dataset.smReturnRetry;delete img.dataset.smReturnSrc;delete img.dataset.smReturnRetried},{once:true})}catch(_){}}function recoverMarkedImages(){document.querySelectorAll('img[data-sm-return-retry="1"]').forEach(function(img){if(!(img.complete&&img.naturalWidth>0))retryImage(img);else{delete img.dataset.smReturnRetry;delete img.dataset.smReturnSrc}})}function prepareCheckout(e){var n=e.target;var a=n&&n.closest?n.closest('a[href*="pay.hotmart.com/A92093667Q"]'):null;if(!a)return;markPendingImages();patchLink(a)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patchAll,{once:true});else patchAll();document.addEventListener('pointerdown',prepareCheckout,true);document.addEventListener('click',prepareCheckout,true);window.addEventListener('pageshow',function(e){if(!document.querySelector('img[data-sm-return-retry="1"]'))return;recoverMarkedImages();requestAnimationFrame(recoverMarkedImages)},false)})();</script>'''
if 'id="sm-checkout-attribution"' not in html:
    if '</body>' not in html:
        raise SystemExit('closing body missing')
    html = html.replace('</body>', forward + '</body>', 1)

INDEX.write_text(html, encoding='utf-8')

all_text = []
for path in ROOT.rglob('*'):
    if not path.is_file() or path.suffix.lower() not in {'.html', '.js', '.json', '.txt'}:
        continue
    try:
        all_text.append(path.read_text(encoding='utf-8'))
    except (UnicodeDecodeError, OSError):
        pass
bundle_text = '\n'.join(all_text)
html = INDEX.read_text(encoding='utf-8')
hero_tags = re.findall(r'<img\b[^>]*class="sm-(?:dh|mh)-composite"[^>]*>', html)
checks = [
    ('canonical', f'rel="canonical" href="{CANONICAL}"' in html),
    ('open graph', 'property="og:title"' in html and 'property="og:image"' in html),
    ('favicon', 'rel="icon"' in html),
    ('meta pixel', META_PIXEL_ID in html and 'sm-meta-pixel' in html),
    ('google tag', GOOGLE_TAG_ID in html and 'sm-google-tag' in html and 'googletagmanager.com/gtag/js' in html),
    ('checkout offer', 'off=ia91gsts' in bundle_text),
    ('checkout mode', 'checkoutMode=10' in bundle_text),
    ('stale checkout removed globally', 'checkoutMode=2' not in bundle_text),
    ('attribution forwarding', 'sm-checkout-attribution' in html and 'fbclid' in html and 'gclid' in html),
    ('dynamic checkout attribution', 'patchLink' in html and "document.addEventListener('click'" in html),
    ('return image recovery marker', 'markPendingImages' in html and 'data-sm-return-retry' in html),
    ('targeted BFCache image recovery', "window.addEventListener('pageshow'" in html and 'recoverMarkedImages' in html and "u.searchParams.set('_sm_retry','1')" in html),
    ('no forced page reload', 'location.reload' not in html),
    ('hero WebP rewrite', HERO_IMAGE_WEBP in bundle_text),
    ('format WebP rewrites', all(new in bundle_text for new in IMAGE_REWRITES.values())),
    ('hero preload', 'id="sm-hero-preload"' in html and f'href="{HERO_IMAGE_WEBP}"' in html),
    ('Wix CDN preconnect', 'id="sm-wix-preconnect"' in html),
    ('hero eager server HTML', len(hero_tags) == 2 and all('loading="eager"' in tag for tag in hero_tags)),
]
failed = [name for name, ok in checks if not ok]
if failed:
    raise SystemExit('hardening validation failed: ' + ', '.join(failed))
print(
    'production hardening checks passed; '
    f'checkout replacements: {replaced}; image URL replacements: {image_replacements}'
)
