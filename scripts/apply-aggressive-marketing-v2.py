#!/usr/bin/env python3
from pathlib import Path
import re

INDEX = Path('public/index.html')
html = INDEX.read_text(encoding='utf-8')

CTA = 'QUERO DOMINAR PORTUGUÊS'
CHECKOUT_HOST = 'pay.hotmart.com/A92093667Q'

# 1) Normalize the visible copy of every Hotmart checkout anchor, while preserving arrow/icon markup.
anchor_pattern = re.compile(r'(<a\b[^>]*href="[^"]*' + re.escape(CHECKOUT_HOST) + r'[^"]*"[^>]*>)(.*?)(</a>)', re.S | re.I)

def rewrite_checkout_anchor(match):
    opening, inner, closing = match.groups()
    if re.search(r'<span\b', inner, flags=re.I):
        inner = re.sub(r'(<span\b[^>]*>).*?(</span>)', lambda m: m.group(1) + CTA + m.group(2), inner, count=1, flags=re.S | re.I)
        return opening + inner + closing
    icons = ''.join(re.findall(r'<b\b[^>]*>.*?</b>', inner, flags=re.S | re.I))
    return opening + CTA + ((' ' + icons) if icons else '') + closing

html, checkout_cta_count = anchor_pattern.subn(rewrite_checkout_anchor, html)
if checkout_cta_count < 5:
    raise SystemExit(f'Expected several checkout CTAs, changed only {checkout_cta_count}.')

# 2) Hero: stronger promise, no artificial deadline.
old_desktop_title = '<h1>Entenda e revise <span>Língua Portuguesa</span> de um jeito muito mais visual.</h1>'
new_desktop_title = '<h1>Pare de se perder em regras. <span>Domine Língua Portuguesa</span> de forma visual.</h1>'
html = html.replace(old_desktop_title, new_desktop_title, 1)

old_mobile_title = '<h1 class="sm-mh-title"><span class="sm-mh-title-line sm-mh-title-line-dark">Entenda e revise</span><span class="sm-mh-title-line sm-mh-title-line-accent">Língua Portuguesa</span><span class="sm-mh-title-line sm-mh-title-line-dark sm-mh-title-tail">de um jeito muito mais visual.</span></h1>'
new_mobile_title = '<h1 class="sm-mh-title"><span class="sm-mh-title-line sm-mh-title-line-dark">Pare de se perder em regras.</span><span class="sm-mh-title-line sm-mh-title-line-accent">Domine Língua Portuguesa</span><span class="sm-mh-title-line sm-mh-title-line-dark sm-mh-title-tail">de forma visual.</span></h1>'
html = html.replace(old_mobile_title, new_mobile_title, 1)

old_hero_copy = ('Um acervo completo com <strong>98 Supermapas</strong>, <strong>50 Super-resumos</strong> e '
                 '<strong>190 Supercards</strong> para consultar regras, organizar conteúdos e revisar com mais clareza e praticidade.')
new_hero_copy = ('Domine os principais conteúdos de Língua Portuguesa com <strong>98 Supermapas</strong> e receba '
                 '<strong>50 Super-resumos + 190 Supercards como bônus</strong> para revisar e reforçar o que estudou.')
html = html.replace(old_hero_copy, new_hero_copy)

# Offer badge in both hero copies. 50% is an existing offer, without a fake countdown/deadline.
if 'sm-hero-offer-badge-v2' not in html:
    desktop_copy = '<div class="sm-dh-copy">'
    mobile_copy = '<div class="sm-mh-copy">'
    badge = '<div class="sm-hero-offer-badge-v2"><strong>50% OFF</strong><span>oferta atual + 2 bônus</span></div>'
    html = html.replace(desktop_copy, desktop_copy + badge, 1)
    html = html.replace(mobile_copy, mobile_copy + badge, 1)

# Desktop/mobile hero metric labels.
html = html.replace('<strong>50</strong><span>Super-resumos</span>', '<strong>50</strong><span>BÔNUS • Super-resumos</span>')
html = html.replace('<strong>190</strong><span>Supercards</span>', '<strong>190</strong><span>BÔNUS • Supercards</span>')

# 3) "O que você recebe": position the hierarchy as core product + two bonuses.
html = html.replace('<span class="sm-format-v2-eyebrow">INCLUSO NO MATERIAL</span>',
                    '<span class="sm-format-v2-eyebrow">98 SUPERMAPAS + 2 BÔNUS</span>', 1)
old_format_intro = 'Supermapas para estudar, Super-resumos para revisar e Supercards para reforçar os conteúdos de Língua Portuguesa.'
new_format_intro = 'Seu material principal são os 98 Supermapas. E, para acelerar suas revisões, você ainda recebe 50 Super-resumos e 190 Supercards como bônus.'
html = html.replace(old_format_intro, new_format_intro, 1)

# Add bonus badges only to the two bonus units.
if 'sm-format-v2-bonus-badge">BÔNUS 1<' not in html:
    summary_copy = '<div class="sm-format-v2-copy"><div class="sm-format-v2-kicker"><span class="sm-format-v2-index">02</span><span class="sm-format-v2-purpose">REVISAR</span></div>'
    summary_replacement = '<div class="sm-format-v2-copy"><span class="sm-format-v2-bonus-badge">BÔNUS 1</span><div class="sm-format-v2-kicker"><span class="sm-format-v2-index">02</span><span class="sm-format-v2-purpose">REVISAR</span></div>'
    if summary_copy in html:
        html = html.replace(summary_copy, summary_replacement, 1)

if 'sm-format-v2-bonus-badge">BÔNUS 2<' not in html:
    card_copy = '<div class="sm-format-v2-copy"><div class="sm-format-v2-kicker"><span class="sm-format-v2-index">03</span><span class="sm-format-v2-purpose">REFORÇAR</span></div>'
    card_replacement = '<div class="sm-format-v2-copy"><span class="sm-format-v2-bonus-badge">BÔNUS 2</span><div class="sm-format-v2-kicker"><span class="sm-format-v2-index">03</span><span class="sm-format-v2-purpose">REFORÇAR</span></div>'
    if card_copy in html:
        html = html.replace(card_copy, card_replacement, 1)

html = html.replace('O essencial de cada tema condensado para retomar pontos importantes com rapidez e clareza.',
                    '<strong>Você recebe como bônus:</strong> o essencial de cada tema condensado para retomar pontos importantes com rapidez e clareza.', 1)
html = html.replace('Conceitos-chave em cards objetivos para reforçar conteúdos e fazer revisões curtas ao longo da rotina.',
                    '<strong>Você recebe como bônus:</strong> conceitos-chave em cards objetivos para reforçar conteúdos e fazer revisões curtas ao longo da rotina.', 1)

# 4) Visual treatment for offer + bonus badges, without rebuilding approved geometry.
marketing_css = '''
<style id="sm-aggressive-marketing-v2">
.sm-hero-offer-badge-v2{display:inline-flex;align-items:center;gap:9px;width:max-content;margin:0 0 16px;padding:7px 12px 7px 8px;border-radius:999px;background:#fff4ec;border:1px solid rgba(244,105,37,.2);box-shadow:0 7px 20px rgba(90,54,26,.07)}
.sm-hero-offer-badge-v2 strong{display:inline-flex;padding:6px 10px;border-radius:999px;background:linear-gradient(135deg,#f36a25,#ff466c);color:#fff;font-size:12px;line-height:1;font-weight:950;letter-spacing:.04em}.sm-hero-offer-badge-v2 span{color:#6b5c54;font-size:12px;font-weight:850}
.sm-format-v2-bonus-badge{display:inline-flex;align-items:center;justify-content:center;margin:0 0 12px;padding:7px 12px;border-radius:999px;background:linear-gradient(135deg,#ff7a1a,#ff4d6d);color:#fff;font-size:12px;font-weight:900;letter-spacing:.08em;box-shadow:0 7px 18px rgba(255,77,109,.2)}
.sm-format-v2-unit-summary .sm-format-v2-title,.sm-format-v2-unit-card .sm-format-v2-title{margin-top:2px}
@media(max-width:720px){.sm-hero-offer-badge-v2{margin:0 auto 14px;padding:6px 10px 6px 7px}.sm-hero-offer-badge-v2 strong{font-size:10px}.sm-hero-offer-badge-v2 span{font-size:10px}.sm-format-v2-bonus-badge{margin-bottom:9px;padding:6px 10px;font-size:10px}}
</style>
'''
# Replace old version if already materialized, otherwise insert.
html = re.sub(r'<style id="sm-aggressive-marketing-v2">.*?</style>', marketing_css.strip(), html, count=1, flags=re.S) if 'id="sm-aggressive-marketing-v2"' in html else html.replace('</head>', marketing_css + '</head>', 1)

# Validation.
if CTA not in html:
    raise SystemExit('New CTA copy missing.')
if 'Pare de se perder em regras.' not in html:
    raise SystemExit('Aggressive hero headline missing.')
if '50% OFF' not in html:
    raise SystemExit('Existing offer badge missing from hero.')
if 'BÔNUS 1' not in html or 'BÔNUS 2' not in html:
    raise SystemExit('Bonus badges missing.')
if '98 SUPERMAPAS + 2 BÔNUS' not in html:
    raise SystemExit('Offer hierarchy eyebrow missing.')
if 'https://pay.hotmart.com/A92093667Q?off=ia91gsts&checkoutMode=10' not in html:
    raise SystemExit('Approved checkout URL missing after marketing patch.')

INDEX.write_text(html, encoding='utf-8')
print(f'Applied aggressive marketing v2: {checkout_cta_count} checkout CTAs normalized; hero strengthened; bonuses positioned explicitly.')
