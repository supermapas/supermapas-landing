from pathlib import Path
import runpy

PUBLIC = Path("public")
PUBLIC.mkdir(parents=True, exist_ok=True)

robots = """User-agent: *
Allow: /

Sitemap: https://www.supermapas.com.br/sitemap.xml
"""

sitemap = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.supermapas.com.br/</loc>
  </url>
  <url>
    <loc>https://www.supermapas.com.br/mapas-gratuitos</loc>
  </url>
</urlset>
"""

not_found = """<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,follow">
  <title>Página não encontrada | Supermapas</title>
  <style>
    *{box-sizing:border-box}html,body{margin:0;min-height:100%;font-family:Arial,Helvetica,sans-serif;background:#f7f5ff;color:#221f2f}body{min-height:100vh;display:grid;place-items:center;padding:24px}.card{width:min(620px,100%);background:#fff;border:1px solid #e9e4f5;border-radius:24px;padding:44px 34px;text-align:center;box-shadow:0 18px 55px rgba(63,46,110,.10)}.mark{width:58px;height:58px;margin:0 auto 20px;border-radius:18px;display:grid;place-items:center;background:#7257c8;color:#fff;font-size:23px;font-weight:800}h1{font-size:clamp(30px,7vw,48px);line-height:1.05;margin:0 0 14px}p{font-size:17px;line-height:1.6;color:#625d6d;margin:0 auto 28px;max-width:470px}a{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:0 24px;border-radius:14px;background:#7257c8;color:#fff;text-decoration:none;font-weight:800}a:focus-visible{outline:3px solid #cfc3f3;outline-offset:3px}
  </style>
</head>
<body>
  <main class="card">
    <div class="mark" aria-hidden="true">404</div>
    <h1>Página não encontrada</h1>
    <p>Este endereço não está mais disponível. Você pode voltar para a página principal dos Supermapas de Língua Portuguesa.</p>
    <a href="/">Ir para a página principal</a>
  </main>
</body>
</html>
"""

(PUBLIC / "robots.txt").write_text(robots, encoding="utf-8")
(PUBLIC / "sitemap.xml").write_text(sitemap, encoding="utf-8")
(PUBLIC / "404.html").write_text(not_found, encoding="utf-8")

runpy.run_path("scripts/build-free-maps-page.py", run_name="__main__")
runpy.run_path("scripts/polish-free-maps-page.py", run_name="__main__")
runpy.run_path("scripts/add-free-maps-complete-cta.py", run_name="__main__")

assert "Sitemap: https://www.supermapas.com.br/sitemap.xml" in robots
assert "https://www.supermapas.com.br/" in sitemap
assert "https://www.supermapas.com.br/mapas-gratuitos" in sitemap
assert "noindex,follow" in not_found
assert "_next/static" not in not_found
assert "googletagmanager" not in not_found
assert "connect.facebook.net" not in not_found
assert (PUBLIC / "mapas-gratuitos" / "index.html").exists()

free_page = (PUBLIC / "mapas-gratuitos" / "index.html").read_text(encoding="utf-8")
assert "Conheça gratuitamente os <span>SuperMapas</span> de Língua Portuguesa." in free_page
assert 'download="Supermapas-versao-gratuita.pdf"' in free_page
assert 'class="lower-cta js-preserve"' in free_page
assert "QUERO CONHECER A VERSÃO COMPLETA" in free_page

print("legacy route hardening assets generated")
