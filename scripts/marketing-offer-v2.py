from pathlib import Path

PAGE = Path('public/index.html')
html = PAGE.read_text(encoding='utf-8')


def replace_once(old: str, new: str, label: str) -> None:
    global html
    if old not in html:
        raise SystemExit(f'marketing-offer-v2: missing anchor: {label}')
    html = html.replace(old, new, 1)


DEADLINE = '2026-08-30T23:59:59-03:00'

style = r'''
<style id="sm-marketing-offer-v2-css">
.sm-campaign-bar{position:sticky;top:0;z-index:80;display:flex;align-items:center;justify-content:center;gap:18px;min-height:46px;padding:8px 18px;background:linear-gradient(90deg,#5e45b0,#7657d0 48%,#6047b6);color:#fff;box-shadow:0 8px 24px rgba(50,37,94,.14);font-family:inherit}
.sm-campaign-bar-copy{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:900;letter-spacing:.035em;text-transform:uppercase}.sm-campaign-bar-copy b{display:inline-flex;align-items:center;padding:4px 8px;border-radius:999px;background:#fff;color:#644bb8;font-size:11px}.sm-campaign-countdown{display:flex;align-items:center;gap:5px}.sm-campaign-countdown span{display:grid;place-items:center;min-width:43px;height:30px;padding:0 7px;border-radius:8px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.20);font-size:12px;font-weight:900}.sm-campaign-countdown i{font-style:normal;font-size:10px;opacity:.75}
.sm-early-proof{padding:23px 18px 25px;background:#fff;border-bottom:1px solid #eee9f5}.sm-early-proof-inner{width:min(1120px,100%);margin:0 auto;display:grid;grid-template-columns:auto 1fr;gap:26px;align-items:center}.sm-early-proof-score{display:flex;align-items:center;gap:16px;padding-right:25px;border-right:1px solid #e9e3f2}.sm-early-proof-score strong{font-size:24px;line-height:1;color:#6b50c2}.sm-early-proof-score span{display:block;margin-top:4px;font-size:11px;font-weight:800;color:#777080}.sm-early-proof-stars{font-size:14px;letter-spacing:2px;color:#f3ad20}.sm-early-proof-quotes{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.sm-early-proof-quote{padding:11px 13px;border-radius:12px;background:#f8f6ff;border:1px solid #ece6f7;color:#5f586a;font-size:12px;font-weight:750;line-height:1.35}.sm-early-proof-quote b{color:#6b51be}
.sm-campaign-price-note{display:block!important;margin:0 0 3px!important;color:#6c55bd!important;font-size:10px!important;font-weight:900!important;letter-spacing:.04em!important;text-transform:uppercase}.sm-campaign-price-note del{opacity:.65}.sm-campaign-discount-pill{display:inline-flex;align-items:center;justify-content:center;padding:5px 9px;border-radius:999px;background:#efe9ff;color:#654db7;font-size:10px;font-weight:900;letter-spacing:.04em}
.sm-offer-campaign-flag{display:flex;align-items:center;justify-content:center;gap:8px;margin:-3px 0 14px;padding:9px 12px;border-radius:12px;background:#f0ebff;color:#644bb7;font-size:11px;font-weight:900;letter-spacing:.07em;text-transform:uppercase}.sm-offer-campaign-flag b{display:inline-grid;place-items:center;min-width:54px;height:26px;padding:0 8px;border-radius:999px;background:#6f55c7;color:#fff;font-size:11px}.sm-offer-close-price del{color:#9c95a5;font-weight:800}.sm-offer-close-price p strong{color:#168b67}.sm-offer-countdown-box{margin:14px 0 16px;padding:14px;border-radius:15px;background:#2f2840;color:#fff}.sm-offer-countdown-box>span{display:block;margin-bottom:9px;text-align:center;font-size:10px;font-weight:900;letter-spacing:.07em;text-transform:uppercase;opacity:.86}.sm-offer-countdown{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.sm-offer-countdown div{padding:9px 5px;border-radius:10px;background:rgba(255,255,255,.09);text-align:center}.sm-offer-countdown strong{display:block;font-size:19px;line-height:1}.sm-offer-countdown small{display:block;margin-top:4px;font-size:8px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;opacity:.67}.sm-offer-stack{display:grid;gap:7px;margin:15px 0 4px;padding:13px 14px;border-radius:14px;background:#faf9fe;border:1px solid #ece7f5}.sm-offer-stack span{font-size:11px;font-weight:800;color:#5f5869}.sm-offer-stack b{color:#168b67;margin-right:4px}.sm-offer-card-note{display:block!important;margin-top:3px!important;color:#746e7d!important;font-size:9px!important;font-weight:750!important;line-height:1.2!important}.sm-campaign-deadline-note{margin:8px 0 0;text-align:center;color:#766f80;font-size:10px;font-weight:750}
.sm-campaign-expired .sm-campaign-bar{background:#4b4655}.sm-campaign-expired .sm-offer-campaign-flag{background:#f2f0f5;color:#706a78}.sm-campaign-expired .sm-promo-checkout{pointer-events:none;opacity:.55;filter:grayscale(.35)}
@media(max-width:820px){.sm-campaign-bar{gap:9px;padding:7px 10px;min-height:44px}.sm-campaign-bar-copy{font-size:10px;gap:6px}.sm-campaign-bar-copy .sm-campaign-long{display:none}.sm-campaign-countdown span{min-width:34px;height:28px;padding:0 5px;font-size:10px}.sm-campaign-countdown i{display:none}.sm-early-proof-inner{grid-template-columns:1fr;gap:12px}.sm-early-proof-score{justify-content:center;padding:0;border-right:0}.sm-early-proof-quotes{grid-template-columns:1fr 1fr 1fr}.sm-early-proof-quote{font-size:11px}}
@media(max-width:560px){.sm-campaign-bar{justify-content:space-between}.sm-campaign-bar-copy{flex-direction:column;align-items:flex-start;gap:2px}.sm-campaign-bar-copy b{font-size:9px;padding:3px 6px}.sm-campaign-countdown{gap:3px}.sm-campaign-countdown span{min-width:31px;height:27px;font-size:9px}.sm-early-proof{padding:18px 12px}.sm-early-proof-score strong{font-size:20px}.sm-early-proof-quotes{grid-template-columns:1fr}.sm-early-proof-quote:nth-child(3){display:none}.sm-offer-countdown strong{font-size:17px}}
</style>
'''
replace_once('</head>', style + '</head>', 'head')

bar = f'''<div class="sm-campaign-bar" data-sm-deadline="{DEADLINE}" aria-label="Oferta de 50% de desconto">
  <div class="sm-campaign-bar-copy"><b>50% OFF</b><span><span class="sm-campaign-long">OFERTA ESPECIAL · </span>R$134 → R$67</span></div>
  <div class="sm-campaign-countdown" data-sm-countdown="compact" aria-label="Tempo restante da oferta"><span data-sm-days>00</span><i>d</i><span data-sm-hours>00</span><i>h</i><span data-sm-minutes>00</span><i>m</i><span data-sm-seconds>00</span><i>s</i></div>
</div>'''
replace_once('<div class="sm-sales-main" role="main">', '<div class="sm-sales-main" role="main">' + bar, 'sales-main')

# Make the purchase CTAs campaign-specific without changing destinations.
html = html.replace('>Acessar agora</a>', '>Garantir 50% OFF</a>')
html = html.replace('<span>QUERO ACESSAR AGORA</span>', '<span>GARANTIR 50% OFF AGORA</span>')
html = html.replace('<span>ACESSAR AGORA</span>', '<span>GARANTIR R$67 AGORA</span>')
html = html.replace('>ACESSAR AGORA <b', '>GARANTIR R$67 AGORA <b')

# Price anchors in the hero summary strips.
replace_once('<div class="sm-dh-price"><strong>12x de R$6,93</strong><span>ou R$67 à vista</span></div>', '<div class="sm-dh-price"><small class="sm-campaign-price-note">DE <del>R$134</del> · 50% OFF</small><strong>12x de R$6,93</strong><span>ou R$67 à vista</span></div>', 'desktop hero price')
replace_once('<div class="sm-mh-price"><strong>12x de R$6,93</strong><span>ou R$67 à vista</span></div>', '<div class="sm-mh-price"><small class="sm-campaign-price-note">DE <del>R$134</del> · 50% OFF</small><strong>12x de R$6,93</strong><span>ou R$67 à vista</span></div>', 'mobile hero price')

proof = '''<section class="sm-early-proof" aria-label="Avaliações e prova social">
  <div class="sm-early-proof-inner">
    <div class="sm-early-proof-score"><div><div class="sm-early-proof-stars" aria-hidden="true">★★★★★</div><strong>4,7/5</strong><span>avaliação na Hotmart</span></div><div><strong>+20 mil</strong><span>pessoas já adquiriram</span></div></div>
    <div class="sm-early-proof-quotes"><div class="sm-early-proof-quote"><b>“</b> Muito prático, bonito e funcional.</div><div class="sm-early-proof-quote"><b>“</b> Claro, objetivo e fácil de entender.</div><div class="sm-early-proof-quote"><b>“</b> Auxilia muito nos concursos e o professor.</div></div>
  </div>
</section>'''
replace_once('<section class="sm-format-v2"', proof + '<section class="sm-format-v2"', 'format section')

# Make the offer card feel like a campaign, while preserving its approved structure.
replace_once('<div class="sm-offer-close-card-top"><span>ACESSO DIGITAL COMPLETO</span><small>Supermapas de Língua Portuguesa</small></div>', '<div class="sm-offer-close-card-top"><span>ACESSO DIGITAL COMPLETO</span><small>Supermapas de Língua Portuguesa</small></div><div class="sm-offer-campaign-flag"><b>50% OFF</b><span>CONDIÇÃO ESPECIAL ATÉ 30/08, 23:59</span></div>', 'offer flag')
replace_once('<div class="sm-offer-close-price"><small>por apenas</small><div><sup>R$</sup><strong>67</strong><span>,00</span></div><p>Pagamento único · acesso digital</p></div>', '<div class="sm-offer-close-price"><small>de <del>R$134,00</del> por</small><div><sup>R$</sup><strong>67</strong><span>,00</span></div><p><strong>Você economiza R$67</strong> · pagamento único</p></div><div class="sm-offer-countdown-box" data-sm-deadline="' + DEADLINE + '"><span>ESSA CONDIÇÃO TERMINA EM</span><div class="sm-offer-countdown" data-sm-countdown="full"><div><strong data-sm-days>00</strong><small>dias</small></div><div><strong data-sm-hours>00</strong><small>horas</small></div><div><strong data-sm-minutes>00</strong><small>min</small></div><div><strong data-sm-seconds>00</strong><small>seg</small></div></div></div>', 'offer price')

# Be explicit about the Supercards unit/page distinction in the offer value stack.
replace_once('<div><strong>190</strong><span>Supercards</span></div></div><div class="sm-offer-close-confidence">', '<div><strong>190</strong><span>Supercards<small class="sm-offer-card-note">95 páginas · 2 por página</small></span></div></div><div class="sm-offer-stack"><span><b>✓</b> Atualizações do acervo incluídas</span><span><b>✓</b> PDFs para consulta e impressão</span><span><b>✓</b> Acesso digital após a confirmação do pagamento</span></div><div class="sm-offer-close-confidence">', 'supercards note and stack')

# Mark every Hotmart CTA so the campaign can genuinely stop at the deadline.
html = html.replace('href="https://pay.hotmart.com/A92093667Q?checkoutMode=2&amp;off=ia91gsts"', 'class="sm-promo-checkout" href="https://pay.hotmart.com/A92093667Q?checkoutMode=2&amp;off=ia91gsts"')
html = html.replace('href="https://pay.hotmart.com/A92093667Q?checkoutMode=2&off=ia91gsts"', 'class="sm-promo-checkout" href="https://pay.hotmart.com/A92093667Q?checkoutMode=2&off=ia91gsts"')
# Avoid duplicate class attributes where links already have classes.
html = html.replace('class="sm-dh-header-cta" class="sm-promo-checkout"', 'class="sm-dh-header-cta sm-promo-checkout"')
html = html.replace('class="sm-dh-primary" class="sm-promo-checkout"', 'class="sm-dh-primary sm-promo-checkout"')
html = html.replace('class="sm-mh-cta" class="sm-promo-checkout"', 'class="sm-mh-cta sm-promo-checkout"')
html = html.replace('class="sm-mh-offer-cta" class="sm-promo-checkout"', 'class="sm-mh-offer-cta sm-promo-checkout"')
html = html.replace('class="sm-offer-close-cta" class="sm-promo-checkout"', 'class="sm-offer-close-cta sm-promo-checkout"')
html = html.replace('class="sm-dock-checkout" class="sm-promo-checkout"', 'class="sm-dock-checkout sm-promo-checkout"')

runtime = f'''
<script id="sm-marketing-offer-v2">
(function(){{
  'use strict';
  var deadline=new Date('{DEADLINE}').getTime();
  var nodes=Array.prototype.slice.call(document.querySelectorAll('[data-sm-countdown]'));
  var promoLinks=Array.prototype.slice.call(document.querySelectorAll('a[href*="pay.hotmart.com/A92093667Q"]'));
  promoLinks.forEach(function(a){{a.classList.add('sm-promo-checkout')}});
  function two(n){{return String(n).padStart(2,'0')}}
  function set(node,key,value){{var target=node.querySelector('[data-sm-'+key+']');if(target)target.textContent=two(value)}}
  function expire(){{
    document.body.classList.add('sm-campaign-expired');
    var bar=document.querySelector('.sm-campaign-bar-copy');
    if(bar)bar.innerHTML='<b>ENCERRADA</b><span>OFERTA DE 50% FINALIZADA</span>';
    promoLinks.forEach(function(a){{a.setAttribute('aria-disabled','true');a.removeAttribute('href');var text=a.querySelector('span');if(text)text.textContent='OFERTA ENCERRADA';else if(a.textContent.trim())a.textContent='OFERTA ENCERRADA';}});
  }}
  function tick(){{
    var diff=deadline-Date.now();
    if(diff<=0){{nodes.forEach(function(n){{set(n,'days',0);set(n,'hours',0);set(n,'minutes',0);set(n,'seconds',0)}});expire();return false}}
    var days=Math.floor(diff/86400000);diff-=days*86400000;
    var hours=Math.floor(diff/3600000);diff-=hours*3600000;
    var minutes=Math.floor(diff/60000);diff-=minutes*60000;
    var seconds=Math.floor(diff/1000);
    nodes.forEach(function(n){{set(n,'days',days);set(n,'hours',hours);set(n,'minutes',minutes);set(n,'seconds',seconds)}});
    return true;
  }}
  if(tick())setInterval(tick,1000);
}})();
</script>
'''
replace_once('</body>', runtime + '</body>', 'body')

PAGE.write_text(html, encoding='utf-8')
print('marketing offer v2 applied; deadline:', DEADLINE)
