from pathlib import Path

page = Path('public/index.html')
html = page.read_text(encoding='utf-8')
replacements = {
    'Muito prático, bonito e funcional.': 'Muito prático, bonito, fácil de aplicar e muito funcional.',
    'Claro, objetivo e fácil de entender.': 'Amei a organização do material e a facilidade de entendimento.',
    'Auxilia muito nos concursos e o professor.': 'Muito bom, fácil interpretação, auxilia muito nos concursos e o professor.',
}
for old, new in replacements.items():
    if old not in html:
        raise SystemExit(f'marketing proof excerpt missing: {old}')
    html = html.replace(old, new, 1)
page.write_text(html, encoding='utf-8')
print('early proof excerpts aligned with existing real reviews')
