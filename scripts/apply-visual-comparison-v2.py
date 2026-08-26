#!/usr/bin/env python3
from pathlib import Path
import re

INDEX = Path('public/index.html')
html = INDEX.read_text(encoding='utf-8')

MAP_URL = 'https://static.wixstatic.com/media/1a67b8_b19132c7753849e08a076d81791245a4~mv2.png/v1/fit/w_1400,h_990/file.webp'

section = '''<section class="sm-visual-study sm-visual-compare-v2" id="estudo-visual" aria-labelledby="sm-visual-study-title">
  <div class="sm-vc-shell">
    <header class="sm-vc-intro">
      <span class="sm-vc-eyebrow">VEJA A DIFERENÇA NA PRÁTICA</span>
      <h2 id="sm-visual-study-title">Do conteúdo cansativo para uma revisão que <span>bate o olho e entende.</span></h2>
      <p>Arraste a barra e compare a mesma matéria em um formato tradicional com a organização visual dos Supermapas.</p>
    </header>

    <div class="sm-vc-compare" data-sm-before-after style="--sm-vc-position:50%">
      <div class="sm-vc-before" aria-label="Antes: estudo tradicional em texto corrido">
        <div class="sm-vc-paper">
          <div class="sm-vc-paper-top"><span>ESTUDO COMUM</span><small>CRASE</small></div>
          <h3>Definição e ocorrência da crase</h3>
          <p>A crase representa a fusão de duas vogais idênticas, normalmente a preposição <strong>a</strong> com o artigo feminino <strong>a</strong> ou <strong>as</strong>. Para verificar sua ocorrência, é necessário observar a regência do termo anterior e se o termo seguinte admite artigo feminino.</p>
          <p>O emprego pode ser obrigatório diante de palavras femininas quando houver regência, em locuções femininas e na indicação de horas. Pode ser facultativo diante de nomes próprios femininos e pronomes possessivos femininos.</p>
          <p>Não ocorre diante de palavras masculinas, verbos no infinitivo, pronomes pessoais e, em diversos casos, palavras de sentido indefinido. Também é importante distinguir crase de simples acento grave.</p>
          <div class="sm-vc-lines" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
        </div>
      </div>

      <div class="sm-vc-after" aria-label="Depois: conteúdo organizado em um Supermapa">
        <div class="sm-vc-map-wrap">
          <span class="sm-vc-after-label">COM SUPERMAPAS</span>
          <img src="''' + MAP_URL + '''" alt="Supermapa de Língua Portuguesa sobre crase" loading="lazy" decoding="async" fetchpriority="low"/>
        </div>
      </div>

      <div class="sm-vc-divider" aria-hidden="true"><span><b>↔</b></span></div>
      <input class="sm-vc-range" type="range" min="8" max="92" value="50" aria-label="Comparar estudo comum com Supermapas"/>
    </div>

    <div class="sm-vc-benefits" aria-label="Benefícios da organização visual">
      <div><b>01</b><span><strong>Encontre mais rápido</strong><small>Regras e exceções ficam visualmente separadas.</small></span></div>
      <div><b>02</b><span><strong>Entenda as relações</strong><small>O conteúdo deixa de parecer um bloco único de texto.</small></span></div>
      <div><b>03</b><span><strong>Revise sem reler tudo</strong><small>Volte aos pontos-chave com muito mais praticidade.</small></span></div>
    </div>
  </div>
</section>'''

pattern = re.compile(r'<section class="sm-visual-study" id="estudo-visual".*?</section>', re.S)
if 'sm-visual-compare-v2' not in html:
    html, count = pattern.subn(section, html, count=1)
    if count != 1:
        raise SystemExit('Original visual-study section not found exactly once.')

css = '''
<style id="sm-visual-compare-v2-css">
.sm-visual-compare-v2{padding:88px 24px;background:linear-gradient(180deg,#fff 0%,#faf9ff 100%);overflow:hidden}
.sm-vc-shell{width:min(1180px,100%);margin:0 auto}
.sm-vc-intro{text-align:center;max-width:860px;margin:0 auto 38px}
.sm-vc-eyebrow{display:inline-block;margin-bottom:12px;font-size:12px;font-weight:900;letter-spacing:.16em;color:#7357d7}
.sm-vc-intro h2{margin:0;color:#272437;font-size:clamp(34px,5vw,62px);line-height:.98;letter-spacing:-.045em;font-weight:900}
.sm-vc-intro h2 span{color:#7559df}
.sm-vc-intro p{max-width:710px;margin:18px auto 0;color:#6e6979;font-size:17px;line-height:1.6}
.sm-vc-compare{position:relative;width:100%;aspect-ratio:16/9;max-height:690px;border-radius:28px;overflow:hidden;background:#eeeaf9;box-shadow:0 28px 75px rgba(57,43,105,.16);border:1px solid rgba(111,86,209,.14);isolation:isolate}
.sm-vc-before,.sm-vc-after{position:absolute;inset:0}
.sm-vc-before{z-index:1;padding:5%;background:linear-gradient(135deg,#f1eee8,#ddd8d0);display:flex;align-items:center;justify-content:center}
.sm-vc-paper{width:82%;height:84%;padding:5% 6%;background:#fffefb;box-shadow:0 18px 50px rgba(70,62,48,.16);transform:rotate(-.8deg);overflow:hidden;color:#4b4844}
.sm-vc-paper-top{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #d8d2c7;padding-bottom:10px;margin-bottom:18px;font-weight:900;letter-spacing:.08em;color:#77716a}
.sm-vc-paper-top small{font-size:11px}
.sm-vc-paper h3{margin:0 0 18px;font:800 clamp(22px,3vw,42px)/1.08 Georgia,serif;color:#38342f}
.sm-vc-paper p{margin:0 0 14px;font:400 clamp(11px,1.2vw,16px)/1.68 Georgia,serif;text-align:justify;color:#5a554e}
.sm-vc-lines{display:grid;gap:8px;margin-top:18px}.sm-vc-lines i{height:1px;background:#d7d1c7}.sm-vc-lines i:nth-child(2){width:93%}.sm-vc-lines i:nth-child(4){width:87%}
.sm-vc-after{z-index:2;clip-path:inset(0 0 0 var(--sm-vc-position));background:#fff;display:flex;align-items:center;justify-content:center}
.sm-vc-map-wrap{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:2.5%;background:#fff}
.sm-vc-map-wrap img{width:100%;height:100%;object-fit:contain;display:block}
.sm-vc-after-label{position:absolute;z-index:3;top:18px;right:18px;padding:9px 13px;border-radius:999px;background:#7458dd;color:#fff;font-size:11px;font-weight:900;letter-spacing:.08em;box-shadow:0 8px 22px rgba(72,48,165,.22)}
.sm-vc-divider{position:absolute;z-index:4;top:0;bottom:0;left:var(--sm-vc-position);width:3px;background:#fff;box-shadow:0 0 0 1px rgba(83,60,169,.18),0 0 28px rgba(63,44,131,.25);transform:translateX(-50%);pointer-events:none}
.sm-vc-divider span{position:absolute;top:50%;left:50%;width:58px;height:58px;border-radius:50%;display:grid;place-items:center;background:#fff;color:#7559df;box-shadow:0 10px 28px rgba(54,38,112,.25);transform:translate(-50%,-50%);border:1px solid rgba(111,86,209,.16)}
.sm-vc-divider b{font-size:23px;line-height:1}
.sm-vc-range{position:absolute;z-index:5;inset:0;width:100%;height:100%;opacity:0;cursor:ew-resize;margin:0}
.sm-vc-benefits{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:22px}
.sm-vc-benefits>div{display:flex;gap:14px;align-items:flex-start;padding:18px 20px;border:1px solid #e8e2fa;background:#fff;border-radius:18px;box-shadow:0 10px 32px rgba(54,43,99,.06)}
.sm-vc-benefits b{display:grid;place-items:center;flex:0 0 38px;height:38px;border-radius:12px;background:#f0ebff;color:#7155d4;font-size:12px;font-weight:900}
.sm-vc-benefits span{display:flex;flex-direction:column;gap:4px}.sm-vc-benefits strong{color:#302c3b;font-size:14px}.sm-vc-benefits small{color:#777180;font-size:12px;line-height:1.45}
@media(max-width:720px){
 .sm-visual-compare-v2{padding:58px 16px}.sm-vc-intro{margin-bottom:26px}.sm-vc-intro h2{font-size:36px;line-height:1.02}.sm-vc-intro p{font-size:15px}
 .sm-vc-compare{aspect-ratio:4/5;border-radius:22px}.sm-vc-before{padding:8% 6%}.sm-vc-paper{width:92%;height:88%;padding:7%;transform:none}.sm-vc-paper h3{font-size:24px}.sm-vc-paper p{font-size:11px;line-height:1.58;margin-bottom:10px}
 .sm-vc-map-wrap{padding:2%}.sm-vc-after-label{top:12px;right:12px;font-size:9px;padding:7px 10px}.sm-vc-divider span{width:48px;height:48px}.sm-vc-divider b{font-size:19px}
 .sm-vc-benefits{grid-template-columns:1fr;gap:10px;margin-top:16px}.sm-vc-benefits>div{padding:15px 16px}
}
@media(prefers-reduced-motion:reduce){.sm-vc-after{transition:none}}
</style>
'''
if 'id="sm-visual-compare-v2-css"' not in html:
    html = html.replace('</head>', css + '</head>', 1)

js = '''
<script id="sm-visual-compare-v2-js">(function(){
 var root=document.querySelector('[data-sm-before-after]');if(!root)return;
 var input=root.querySelector('.sm-vc-range');if(!input)return;
 function update(){root.style.setProperty('--sm-vc-position',input.value+'%');}
 input.addEventListener('input',update,{passive:true});input.addEventListener('change',update,{passive:true});update();
})();</script>
'''
if 'id="sm-visual-compare-v2-js"' not in html:
    html = html.replace('</body>', js + '</body>', 1)

if 'data-sm-before-after' not in html or MAP_URL not in html:
    raise SystemExit('Before/after component validation failed.')

INDEX.write_text(html, encoding='utf-8')
print('Replaced visual-study section with interactive before/after comparison.')
