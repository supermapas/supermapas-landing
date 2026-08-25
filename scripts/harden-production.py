#!/usr/bin/env python3
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
CHECKOUT_OLD = 'https://pay.hotmart.com/A92093667Q?checkoutMode=10'
CHECKOUT = 'https://pay.hotmart.com/A92093667Q?checkoutMode=2&off=ia91gsts'

# Replace stale checkout references everywhere React may hydrate from, not only index.html.
replaced = 0
for path in ROOT.rglob('*'):
    if not path.is_file() or path.suffix.lower() not in {'.html', '.js', '.json', '.txt'}:
        continue
    try:
        text = path.read_text(encoding='utf-8')
    except (UnicodeDecodeError, OSError):
        continue
    count = text.count(CHECKOUT_OLD)
    if count:
        path.write_text(text.replace(CHECKOUT_OLD, CHECKOUT), encoding='utf-8')
        replaced += count

html = INDEX.read_text(encoding='utf-8')

head = f'''\n<link rel="canonical" href="{CANONICAL}"/>\n<meta property="og:type" content="website"/>\n<meta property="og:locale" content="pt_BR"/>\n<meta property="og:site_name" content="Supermapas"/>\n<meta property="og:title" content="{TITLE}"/>\n<meta property="og:description" content="{DESCRIPTION}"/>\n<meta property="og:url" content="{CANONICAL}"/>\n<meta property="og:image" content="{OG_IMAGE}"/>\n<meta name="twitter:card" content="summary_large_image"/>\n<link rel="icon" href="{FAVICON}"/>\n<script id="sm-meta-pixel">!function(f,b,e,v,n,t,s){{if(f.fbq)return;n=f.fbq=function(){{n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)}};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','{META_PIXEL_ID}');fbq('track','PageView');</script>\n'''
if 'id="sm-meta-pixel"' not in html:
    if '</head>' not in html:
        raise SystemExit('closing head missing')
    html = html.replace('</head>', head + '</head>', 1)

# Preserve the Google Ads / Google tag that is active on the current Wix site.
google_tag = f'''\n<script async id="sm-google-tag-loader" src="https://www.googletagmanager.com/gtag/js?id={GOOGLE_TAG_ID}"></script>\n<script id="sm-google-tag">window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','{GOOGLE_TAG_ID}');</script>\n'''
if 'id="sm-google-tag"' not in html:
    if '</head>' not in html:
        raise SystemExit('closing head missing')
    html = html.replace('</head>', google_tag + '</head>', 1)

# Forward campaign/click identifiers from the landing URL to every Hotmart checkout link.
# The persistent sales dock is rendered by React only after scrolling, so patch links at
# initial load and again synchronously when any Hotmart CTA is activated.
# Before leaving for checkout, promote still-pending images out of native lazy mode so a
# BFCache restore does not leave interrupted lazy requests permanently stalled.
forward = r'''<script id="sm-checkout-attribution">(function(){var KEYS=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','gclid','ttclid'];var src=new URLSearchParams(location.search);function patchLink(a){try{var u=new URL(a.href,location.href);KEYS.forEach(function(k){var v=src.get(k);if(v)u.searchParams.set(k,v)});a.href=u.toString()}catch(_){}}function patchAll(){document.querySelectorAll('a[href*="pay.hotmart.com/A92093667Q"]').forEach(patchLink)}function promotePendingImages(){document.querySelectorAll('img').forEach(function(img){try{if(img.complete)return;if(img.getAttribute('loading')==='lazy'){img.removeAttribute('loading');img.loading='eager'}var s=img.getAttribute('src');if(s)img.src=s;if(img.decode)img.decode().catch(function(){})}catch(_){}})}function prepareCheckout(e){var n=e.target;var a=n&&n.closest?n.closest('a[href*="pay.hotmart.com/A92093667Q"]'):null;if(!a)return;promotePendingImages();patchLink(a)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patchAll,{once:true});else patchAll();document.addEventListener('pointerdown',prepareCheckout,true);document.addEventListener('click',prepareCheckout,true)})();</script>'''
if 'id="sm-checkout-attribution"' not in html:
    if '</body>' not in html:
        raise SystemExit('closing body missing')
    html = html.replace('</body>', forward + '</body>', 1)

INDEX.write_text(html, encoding='utf-8')

# Assertions: technical only; no visual DOM copy/classes are altered.
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
checks = [
    ('canonical', f'rel="canonical" href="{CANONICAL}"' in html),
    ('open graph', 'property="og:title"' in html and 'property="og:image"' in html),
    ('favicon', 'rel="icon"' in html),
    ('meta pixel', META_PIXEL_ID in html and 'sm-meta-pixel' in html),
    ('google tag', GOOGLE_TAG_ID in html and 'sm-google-tag' in html and 'googletagmanager.com/gtag/js' in html),
    ('checkout offer', 'off=ia91gsts' in bundle_text),
    ('checkout mode', 'checkoutMode=2' in bundle_text),
    ('stale checkout removed globally', 'checkoutMode=10' not in bundle_text),
    ('attribution forwarding', 'sm-checkout-attribution' in html and 'fbclid' in html and 'gclid' in html),
    ('dynamic checkout attribution', 'patchLink' in html and "document.addEventListener('click'" in html),
    ('checkout image handoff', 'promotePendingImages' in html and "document.addEventListener('pointerdown'" in html and "img.loading='eager'" in html),
]
failed = [name for name, ok in checks if not ok]
if failed:
    raise SystemExit('hardening validation failed: ' + ', '.join(failed))
print(f'production hardening checks passed; checkout replacements: {replaced}')
