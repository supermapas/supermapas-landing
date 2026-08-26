#!/usr/bin/env python3
from pathlib import Path
import re

INDEX = Path('public/index.html')
html = INDEX.read_text(encoding='utf-8')

# --- SOCIAL PROOF ---------------------------------------------------------
# Keep every existing real review. We only strengthen the framing around them.
if 'id="sm-proof-power-v2"' not in html:
    proof_open = re.search(r'<section\b[^>]*\bid="prova-social"[^>]*>', html, flags=re.I)
    if not proof_open:
        raise SystemExit('Social proof section #prova-social not found.')

    opening = proof_open.group(0)
    if 'sm-proof-aggressive-v2' not in opening:
        if 'class="' in opening:
            opening_new = opening.replace('class="', 'class="sm-proof-aggressive-v2 ', 1)
        else:
            opening_new = opening[:-1] + ' class="sm-proof-aggressive-v2">'
        html = html[:proof_open.start()] + opening_new + html[proof_open.end():]
        insert_at = proof_open.start() + len(opening_new)
    else:
        insert_at = proof_open.end()

    proof_power = '''<div id="sm-proof-power-v2" class="sm-proof-power-v2" aria-label="Resultados e confiança dos compradores">
      <div class="sm-proof-power-copy">
        <span class="sm-proof-power-eyebrow">PROVA REAL DE QUEM JÁ ESCOLHEU OS SUPERMAPAS</span>
        <h2>Mais de <strong>20 mil pessoas</strong> já levaram o Supermapas para a rotina de estudos.</h2>
        <p>Não fique só na promessa: veja abaixo avaliações e comentários de compradores reais.</p>
      </div>
      <div class="sm-proof-power-stats" aria-label="Indicadores de confiança">
        <div><strong>+20 mil</strong><span>pessoas já adquiriram</span></div>
        <div><strong>★ 4,7/5</strong><span>avaliação na Hotmart</span></div>
        <div><strong>7 dias</strong><span>de garantia</span></div>
      </div>
    </div>'''
    html = html[:insert_at] + proof_power + html[insert_at:]

# --- WHO IS BEHIND --------------------------------------------------------
# Find the section from its visible heading instead of depending on a legacy class/id.
if 'id="sm-behind-trust-v2"' not in html:
    m = re.search(r'Quem\s+est[áa]\s+por\s+tr[áa]s', html, flags=re.I)
    if m:
        sec_start = html.rfind('<section', 0, m.start())
        sec_open_end = html.find('>', sec_start)
        sec_end = html.find('</section>', m.end())
        if sec_start >= 0 and sec_open_end >= 0 and sec_end >= 0:
            opening = html[sec_start:sec_open_end+1]
            if 'sm-behind-aggressive-v2' not in opening:
                if 'class="' in opening:
                    opening_new = opening.replace('class="', 'class="sm-behind-aggressive-v2 ', 1)
                else:
                    opening_new = opening[:-1] + ' class="sm-behind-aggressive-v2">'
                html = html[:sec_start] + opening_new + html[sec_open_end+1:]
                delta = len(opening_new) - len(opening)
                sec_open_end += delta
                sec_end += delta
            behind = '''<div id="sm-behind-trust-v2" class="sm-behind-trust-v2">
              <span class="sm-behind-eyebrow">QUEM CRIA TAMBÉM CUIDA DO MATERIAL</span>
              <h2>Um projeto feito para tornar Português <strong>mais claro, visual e consultável.</strong></h2>
              <p>O acervo é desenvolvido e aprimorado continuamente, com atenção à organização, à leitura e à utilidade prática de cada material.</p>
              <div class="sm-behind-points" aria-label="Compromissos do Supermapas">
                <span>✓ Material autoral</span><span>✓ Atualizações incluídas</span><span>✓ +20 mil compradores</span>
              </div>
            </div>'''
            insert_at = sec_open_end + 1
            html = html[:insert_at] + behind + html[insert_at:]
    else:
        print('Warning: creator section heading not found; social proof was still updated.')

css = '''
<style id="sm-trust-proof-v2-css">
.sm-proof-aggressive-v2{position:relative;overflow:hidden}
.sm-proof-aggressive-v2:before{content:"";position:absolute;inset:0 0 auto;height:340px;background:radial-gradient(circle at 50% 0,rgba(123,91,227,.14),transparent 68%);pointer-events:none}
.sm-proof-power-v2{position:relative;z-index:2;max-width:1120px;margin:0 auto 38px;padding:42px 40px 32px;text-align:center;border:1px solid rgba(116,85,211,.16);border-radius:30px;background:linear-gradient(145deg,#fff 0%,#faf8ff 60%,#f4f0ff 100%);box-shadow:0 24px 60px rgba(55,38,105,.09)}
.sm-proof-power-eyebrow,.sm-behind-eyebrow{display:block;color:#7657d8;font-size:12px;font-weight:900;letter-spacing:.16em;margin-bottom:12px}
.sm-proof-power-copy h2{max-width:800px;margin:0 auto;color:#272434;font-size:clamp(28px,3.6vw,48px);line-height:1.05;letter-spacing:-.04em}
.sm-proof-power-copy h2 strong{color:#7657d8}
.sm-proof-power-copy p{max-width:680px;margin:14px auto 0;color:#706b7c;font-size:17px;line-height:1.55}
.sm-proof-power-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:26px}
.sm-proof-power-stats>div{padding:18px 12px;border-radius:18px;background:#fff;border:1px solid rgba(116,85,211,.12);box-shadow:0 8px 24px rgba(55,38,105,.06)}
.sm-proof-power-stats strong{display:block;color:#2f2a3a;font-size:25px;line-height:1.05}.sm-proof-power-stats span{display:block;margin-top:5px;color:#777181;font-size:12px;font-weight:750}
.sm-behind-aggressive-v2{position:relative}.sm-behind-trust-v2{max-width:1050px;margin:0 auto 34px;padding:34px 38px;border-radius:28px;background:linear-gradient(135deg,#2e283b,#44365f);color:#fff;box-shadow:0 25px 60px rgba(37,26,58,.18)}
.sm-behind-trust-v2 .sm-behind-eyebrow{color:#cbbcff}.sm-behind-trust-v2 h2{max-width:850px;margin:0;font-size:clamp(27px,3.4vw,44px);line-height:1.08;letter-spacing:-.035em}.sm-behind-trust-v2 h2 strong{color:#cab8ff}
.sm-behind-trust-v2 p{max-width:780px;margin:13px 0 0;color:rgba(255,255,255,.78);font-size:16px;line-height:1.6}.sm-behind-points{display:flex;flex-wrap:wrap;gap:10px;margin-top:21px}.sm-behind-points span{padding:9px 13px;border-radius:999px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.12);font-size:12px;font-weight:850}
@media(max-width:720px){.sm-proof-power-v2{margin:0 16px 26px;padding:28px 18px 22px;border-radius:24px}.sm-proof-power-copy h2{font-size:30px}.sm-proof-power-copy p{font-size:15px}.sm-proof-power-stats{grid-template-columns:1fr;gap:8px}.sm-proof-power-stats>div{display:flex;align-items:center;justify-content:space-between;text-align:left;padding:13px 15px}.sm-proof-power-stats strong{font-size:21px}.sm-proof-power-stats span{margin:0;font-size:11px}.sm-behind-trust-v2{margin:0 16px 26px;padding:27px 20px;border-radius:24px}.sm-behind-trust-v2 h2{font-size:30px}.sm-behind-points{display:grid;grid-template-columns:1fr;gap:7px}.sm-behind-points span{text-align:center}}
</style>
'''
if 'id="sm-trust-proof-v2-css"' not in html:
    html = html.replace('</head>', css + '</head>', 1)

assert 'id="sm-proof-power-v2"' in html
assert '+20 mil' in html
assert '4,7/5' in html

INDEX.write_text(html, encoding='utf-8')
print('Strengthened social proof and creator trust framing while preserving existing real reviews.')
