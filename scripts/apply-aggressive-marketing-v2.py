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

# 2) Hero: make the 98 Supermapas the core product and the other two formats explicit bonuses.
old_hero_copy = ('Um acervo completo com <strong>98 Supermapas</strong>, <strong>50 Super-resumos</strong> e '
                 '<strong>190 Supercards</strong> para consultar regras, organizar conteúdos e revisar com mais clareza e praticidade.')
new_hero_copy = ('Domine os principais conteúdos de Língua Portuguesa com <strong>98 Supermapas</strong> e receba '
                 '<strong>50 Super-resumos + 190 Supercards como bônus</strong> para revisar e reforçar o que estudou.')
if old_hero_copy in html:
    html = html.replace(old_hero_copy, new_hero_copy)

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
summary_copy_marker = '<article class="sm-format-v2-unit sm-format-v2-unit-summary"><div class="sm-format-v2-visual'
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

# Clarify copy inside the bonus blocks.
html = html.replace('O essencial de cada tema condensado para retomar pontos importantes com rapidez e clareza.',
                    '<strong>Você recebe como bônus:</strong> o essencial de cada tema condensado para retomar pontos importantes com rapidez e clareza.', 1)
html = html.replace('Conceitos-chave em cards objetivos para reforçar conteúdos e fazer revisões curtas ao longo da rotina.',
                    '<strong>Você recebe como bônus:</strong> conceitos-chave em cards objetivos para reforçar conteúdos e fazer revisões curtas ao longo da rotina.', 1)

# 4) Visual treatment for the bonus badges, without rebuilding the approved section.
marketing_css = '''
<style id="sm-aggressive-marketing-v2">
.sm-format-v2-bonus-badge{display:inline-flex;align-items:center;justify-content:center;margin:0 0 12px;padding:7px 12px;border-radius:999px;background:linear-gradient(135deg,#ff7a1a,#ff4d6d);color:#fff;font-size:12px;font-weight:900;letter-spacing:.08em;box-shadow:0 7px 18px rgba(255,77,109,.2)}
.sm-format-v2-unit-summary .sm-format-v2-title,.sm-format-v2-unit-card .sm-format-v2-title{margin-top:2px}
@media(max-width:720px){.sm-format-v2-bonus-badge{margin-bottom:9px;padding:6px 10px;font-size:10px}}
</style>
'''
if 'id="sm-aggressive-marketing-v2"' not in html:
    html = html.replace('</head>', marketing_css + '</head>', 1)

# Validation.
if CTA not in html:
    raise SystemExit('New CTA copy missing.')
if 'BÔNUS 1' not in html or 'BÔNUS 2' not in html:
    raise SystemExit('Bonus badges missing.')
if '98 SUPERMAPAS + 2 BÔNUS' not in html:
    raise SystemExit('Offer hierarchy eyebrow missing.')
if 'https://pay.hotmart.com/A92093667Q?off=ia91gsts&checkoutMode=10' not in html:
    raise SystemExit('Approved checkout URL missing after marketing patch.')

INDEX.write_text(html, encoding='utf-8')
print(f'Applied aggressive marketing v2: {checkout_cta_count} checkout CTAs normalized; Super-resumos and Supercards positioned as bonuses.')
