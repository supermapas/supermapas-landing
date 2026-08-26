from pathlib import Path

PAGE = Path('public/index.html')
html = PAGE.read_text(encoding='utf-8')

OLD_DEADLINE = '2026-08-30T23:59:59-03:00'
NEW_DEADLINE = '2026-08-25T23:59:59-03:00'

if OLD_DEADLINE not in html:
    raise SystemExit('tighten-daily-offer: previous deadline not found')

html = html.replace(OLD_DEADLINE, NEW_DEADLINE)

old_flag = 'CONDIÇÃO ESPECIAL ATÉ 30/08, 23:59'
new_flag = 'OFERTA ACABA HOJE · 25/08 · 23:59'
if old_flag not in html:
    raise SystemExit('tighten-daily-offer: offer flag not found')
html = html.replace(old_flag, new_flag, 1)

old_bar = '<span class="sm-campaign-long">OFERTA ESPECIAL · </span>R$134 → R$67'
new_bar = '<span class="sm-campaign-long">ACABA HOJE · 25/08 · </span>R$134 → R$67'
if old_bar not in html:
    raise SystemExit('tighten-daily-offer: campaign bar copy not found')
html = html.replace(old_bar, new_bar, 1)

old_countdown_label = '<span>ESSA CONDIÇÃO TERMINA EM</span>'
new_countdown_label = '<span>OFERTA DE 50% ACABA HOJE</span>'
if old_countdown_label not in html:
    raise SystemExit('tighten-daily-offer: countdown label not found')
html = html.replace(old_countdown_label, new_countdown_label, 1)

PAGE.write_text(html, encoding='utf-8')

assert NEW_DEADLINE in html
assert OLD_DEADLINE not in html
assert 'OFERTA ACABA HOJE · 25/08 · 23:59' in html
assert 'ACABA HOJE · 25/08 · ' in html
assert 'OFERTA DE 50% ACABA HOJE' in html

print('daily same-day offer deadline applied')
