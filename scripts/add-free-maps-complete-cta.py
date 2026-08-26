from pathlib import Path

PAGE = Path("public/mapas-gratuitos/index.html")
html = PAGE.read_text(encoding="utf-8")

old_css = '.metric span{display:block;font-size:10px;color:#716a7a;margin-top:5px;font-weight:800}'
new_css = old_css + '.lower-cta-wrap{grid-column:1/-1;display:flex;justify-content:center;margin-top:4px}.lower-cta{display:inline-flex;align-items:center;justify-content:center;gap:10px;width:min(100%,460px);min-height:58px;padding:14px 24px;border-radius:15px;background:linear-gradient(135deg,#7057c8,#876ad9);box-shadow:0 14px 34px rgba(112,87,200,.24);color:#fff;text-decoration:none;font-size:14px;font-weight:900;letter-spacing:.01em;text-align:center;transition:transform .18s ease,box-shadow .18s ease}.lower-cta:hover{transform:translateY(-1px);box-shadow:0 17px 38px rgba(112,87,200,.30)}.lower-cta span{font-size:19px;line-height:1}'
if old_css not in html:
    raise SystemExit("free maps lower metrics CSS marker not found")
html = html.replace(old_css, new_css, 1)

old_block = '''        <div class="metrics" aria-label="Conteúdo do acervo completo">
          <div class="metric"><strong>98</strong><span>Supermapas</span></div>
          <div class="metric"><strong>50</strong><span>Super-resumos</span></div>
          <div class="metric"><strong>190</strong><span>Supercards</span></div>
        </div>'''
new_block = old_block + '''
        <div class="lower-cta-wrap">
          <a class="lower-cta js-preserve" href="/">QUERO CONHECER A VERSÃO COMPLETA <span aria-hidden="true">→</span></a>
        </div>'''
if old_block not in html:
    raise SystemExit("free maps lower metrics block marker not found")
html = html.replace(old_block, new_block, 1)

PAGE.write_text(html, encoding="utf-8")

assert 'class="lower-cta js-preserve"' in html
assert 'QUERO CONHECER A VERSÃO COMPLETA' in html
assert '.lower-cta-wrap{grid-column:1/-1' in html

print("free maps bottom complete-version CTA added")
