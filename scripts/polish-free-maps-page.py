from pathlib import Path

PAGE = Path("public/mapas-gratuitos/index.html")
html = PAGE.read_text(encoding="utf-8")

old_title = '<h1>Conheça os <span>SuperMapas</span> antes de acessar o acervo completo.</h1>'
new_title = '<h1>Conheça gratuitamente os <span>SuperMapas</span> de Língua Portuguesa.</h1>'
if old_title not in html:
    raise SystemExit("free maps hero title marker not found")
html = html.replace(old_title, new_title, 1)

old_h1_css = 'h1{font-size:clamp(44px,5.2vw,72px);line-height:.99;letter-spacing:-.045em;margin:0;max-width:760px}'
new_h1_css = 'h1{font-size:clamp(44px,5.2vw,72px);line-height:.99;letter-spacing:-.045em;margin:0;max-width:760px;text-wrap:balance}'
if old_h1_css not in html:
    raise SystemExit("free maps hero CSS marker not found")
html = html.replace(old_h1_css, new_h1_css, 1)

old_download = '<a class="download" id="download-link" href="#" target="_blank" rel="noopener">'
new_download = '<a class="download" id="download-link" href="#" download="Supermapas-versao-gratuita.pdf" target="_blank" rel="noopener">'
if old_download not in html:
    raise SystemExit("free maps download link marker not found")
html = html.replace(old_download, new_download, 1)

staging_endpoint = "https://qzrkgekzfbmsghudxkmd.supabase.co/functions/v1/capture-free-maps-lead"
production_endpoint = "https://lkgcipyxkkhmqqxcqxxp.supabase.co/functions/v1/capture-free-maps-lead"
if staging_endpoint not in html:
    raise SystemExit("staging free maps endpoint marker not found")
html = html.replace(staging_endpoint, production_endpoint, 1)

staging_anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cmtnZWt6ZmJtc2dodWR4a21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2NDU4NTcsImV4cCI6MjEwMjIyMTg1N30.ndlkz5HfmKTZjv3O2W-1D3Mw1gMIx97XBBxR0yEi9eE"
production_anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrZ2NpcHl4a2tobXFxeGNxeHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MjEyNTEsImV4cCI6MjEwMjM5NzI1MX0.VI4vcNpkKbkncieQYaLN0_Z3YiDeS-Y6Ioq7AFHeuIo"
if staging_anon not in html:
    raise SystemExit("staging anon key marker not found")
html = html.replace(staging_anon, production_anon, 1)

PAGE.write_text(html, encoding="utf-8")

assert 'Conheça gratuitamente os <span>SuperMapas</span> de Língua Portuguesa.' in html
assert 'text-wrap:balance' in html
assert 'download="Supermapas-versao-gratuita.pdf"' in html
assert production_endpoint in html
assert production_anon in html
assert staging_endpoint not in html
assert staging_anon not in html

print("free maps page polished and pointed to production lead capture")
