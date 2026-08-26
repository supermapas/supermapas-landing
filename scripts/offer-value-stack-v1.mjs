import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/offer-value-stack-v1.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

const CHECKOUT = 'https://pay.hotmart.com/A92093667Q?off=ia91gsts&checkoutMode=10';

const section = `<section class="sm-offer-value" id="oferta" aria-labelledby="sm-offer-value-title">
  <div class="sm-offer-value-shell">
    <header class="sm-offer-value-head">
      <span class="sm-offer-value-eyebrow">OFERTA ESPECIAL · 50% OFF</span>
      <h2 id="sm-offer-value-title">Veja o valor de tudo o que você recebe <span>hoje.</span></h2>
      <p>Os 50% de desconto são aplicados aos 98 Supermapas. Os Super-resumos e os Supercards entram como bônus gratuitos.</p>
    </header>

    <div class="sm-offer-value-layout">
      <div class="sm-offer-value-list" aria-label="Composição da oferta">
        <article class="sm-offer-value-item sm-offer-value-item--main">
          <div class="sm-offer-value-index">01</div>
          <div class="sm-offer-value-copy">
            <span class="sm-offer-value-type">MATERIAL PRINCIPAL</span>
            <h3><strong>98</strong> Supermapas</h3>
            <small>Acervo completo de Língua Portuguesa</small>
          </div>
          <div class="sm-offer-value-price">
            <small>de</small><s>R$ 137,90</s>
            <b>50% OFF</b>
          </div>
        </article>

        <article class="sm-offer-value-item sm-offer-value-item--bonus">
          <div class="sm-offer-value-index">02</div>
          <div class="sm-offer-value-copy">
            <span class="sm-offer-value-type">BÔNUS 1</span>
            <h3><strong>50</strong> Super-resumos</h3>
            <small>Valor do material separadamente</small>
          </div>
          <div class="sm-offer-value-price">
            <s>R$ 37,00</s>
            <b class="sm-offer-value-free">GRÁTIS</b>
          </div>
        </article>

        <article class="sm-offer-value-item sm-offer-value-item--bonus">
          <div class="sm-offer-value-index">03</div>
          <div class="sm-offer-value-copy">
            <span class="sm-offer-value-type">BÔNUS 2</span>
            <h3><strong>190</strong> Supercards</h3>
            <small>Valor do material separadamente</small>
          </div>
          <div class="sm-offer-value-price">
            <s>R$ 47,00</s>
            <b class="sm-offer-value-free">GRÁTIS</b>
          </div>
        </article>

        <div class="sm-offer-value-note"><span>✓</span><p>Você paga apenas pelos <strong>98 Supermapas</strong>. Os dois bônus entram sem custo adicional.</p></div>
      </div>

      <aside class="sm-offer-value-checkout" aria-label="Preço final dos Supermapas">
        <span class="sm-offer-value-checkout-kicker">HOJE, COM A OFERTA ATUAL</span>
        <div class="sm-offer-value-was"><span>98 Supermapas</span><s>R$ 137,90</s></div>
        <div class="sm-offer-value-final"><sup>R$</sup><strong>67</strong><span>,00</span></div>
        <p class="sm-offer-value-installments">ou em até <strong>12x de R$ 6,93</strong> no cartão</p>
        <div class="sm-offer-value-bonus-summary"><span>+ 50 Super-resumos</span><span>+ 190 Supercards</span><b>GRÁTIS</b></div>
        <a class="sm-offer-value-cta" href="${CHECKOUT}"><span>QUERO DOMINAR PORTUGUÊS</span><b aria-hidden="true">→</b></a>
        <div class="sm-offer-value-trust"><span>✓ 7 dias de garantia</span><span>◆ Compra processada pela Hotmart</span></div>
      </aside>
    </div>
  </div>
</section>`;

const re = /<section class="sm-offer-close" id="oferta"[\s\S]*?<\/section>(?=<section class="sm-essential")/;
if (!re.test(html)) throw new Error('Current offer section not found.');
html = html.replace(re, section);

const css = `<style id="sm-offer-value-stack-v1">
.sm-offer-value{padding:clamp(76px,8vw,118px) 0;background:linear-gradient(180deg,#fff 0%,#f8f5ff 100%);color:#241f2c}.sm-offer-value-shell{width:min(1160px,calc(100% - 48px));margin:0 auto}.sm-offer-value-head{max-width:900px;margin:0 auto 34px;text-align:center}.sm-offer-value-eyebrow{display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px;padding:9px 14px;border:1px solid rgba(112,86,217,.2);border-radius:999px;background:#f3efff;color:#7056d9;font-size:12px;font-weight:900;letter-spacing:.15em}.sm-offer-value-head h2{margin:0;font-size:clamp(40px,5vw,64px);line-height:.98;letter-spacing:-.045em}.sm-offer-value-head h2 span{color:#7056d9}.sm-offer-value-head p{max-width:760px;margin:15px auto 0;color:#6b6473;font-size:16px;line-height:1.55}.sm-offer-value-layout{display:grid;grid-template-columns:minmax(0,1.28fr) minmax(330px,.72fr);gap:22px;align-items:stretch}.sm-offer-value-list{display:flex;flex-direction:column;gap:12px}.sm-offer-value-item{display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:16px;align-items:center;min-height:116px;padding:18px 20px;border:1px solid rgba(70,56,102,.12);border-radius:22px;background:#fff;box-shadow:0 12px 30px rgba(58,43,103,.06)}.sm-offer-value-item--main{border-color:rgba(112,86,217,.22);box-shadow:0 16px 38px rgba(68,48,120,.10)}.sm-offer-value-index{display:grid;place-items:center;width:44px;height:44px;border-radius:13px;background:#f0ebff;color:#6e52d5;font-size:12px;font-weight:950}.sm-offer-value-copy{min-width:0}.sm-offer-value-type{display:block;margin-bottom:5px;color:#7056d9;font-size:9px;font-weight:950;letter-spacing:.14em}.sm-offer-value-item--bonus .sm-offer-value-type{color:#ef6b22}.sm-offer-value-copy h3{margin:0;color:#2c2635;font-size:21px;line-height:1.08;letter-spacing:-.025em}.sm-offer-value-copy h3 strong{color:#7056d9}.sm-offer-value-copy small{display:block;margin-top:5px;color:#8a8291;font-size:11px}.sm-offer-value-price{display:flex;flex-direction:column;align-items:flex-end;gap:5px;white-space:nowrap}.sm-offer-value-price>small{color:#918a98;font-size:10px}.sm-offer-value-price s{color:#8b8492;font-size:17px;font-weight:800;text-decoration-thickness:2px}.sm-offer-value-price b{display:inline-flex;padding:6px 9px;border-radius:999px;background:#fff1e8;color:#e85f1d;font-size:10px;font-weight:950;letter-spacing:.05em}.sm-offer-value-price .sm-offer-value-free{background:#eaf8f2;color:#168c66}.sm-offer-value-note{display:flex;align-items:center;gap:11px;margin-top:2px;padding:15px 17px;border:1px solid rgba(112,86,217,.14);border-radius:17px;background:#f7f3ff;color:#50475a}.sm-offer-value-note>span{display:grid;place-items:center;flex:0 0 26px;height:26px;border-radius:50%;background:#7056d9;color:#fff;font-size:12px;font-weight:950}.sm-offer-value-note p{margin:0;font-size:13px;line-height:1.42}.sm-offer-value-checkout{position:relative;overflow:hidden;display:flex;flex-direction:column;padding:28px;border-radius:28px;background:linear-gradient(150deg,#2b2338 0%,#44315f 58%,#6247bb 100%);color:#fff;box-shadow:0 24px 54px rgba(53,38,93,.22)}.sm-offer-value-checkout:after{content:"";position:absolute;right:-85px;top:-90px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,.07)}.sm-offer-value-checkout-kicker{position:relative;z-index:1;color:#d8ccff;font-size:10px;font-weight:950;letter-spacing:.14em}.sm-offer-value-was{position:relative;z-index:1;display:flex;justify-content:space-between;gap:12px;margin:24px 0 5px;color:#d8d0e3;font-size:12px}.sm-offer-value-was s{font-weight:800;text-decoration-thickness:2px}.sm-offer-value-final{position:relative;z-index:1;display:flex;align-items:flex-start;line-height:.9;margin:4px 0 8px}.sm-offer-value-final sup{margin:9px 4px 0 0;font-size:19px;font-weight:850}.sm-offer-value-final strong{font-size:76px;letter-spacing:-.065em}.sm-offer-value-final>span{margin-top:8px;font-size:30px;font-weight:850}.sm-offer-value-installments{position:relative;z-index:1;margin:0 0 20px;color:#e1daeb;font-size:13px}.sm-offer-value-installments strong{color:#fff}.sm-offer-value-bonus-summary{position:relative;z-index:1;display:grid;gap:6px;margin:0 0 22px;padding:15px;border:1px solid rgba(255,255,255,.13);border-radius:16px;background:rgba(255,255,255,.07);font-size:12px}.sm-offer-value-bonus-summary b{width:max-content;margin-top:2px;padding:5px 8px;border-radius:999px;background:#2ab47f;color:#fff;font-size:10px;letter-spacing:.06em}.sm-offer-value-cta{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:auto;padding:17px 18px;border-radius:16px;background:#fff;color:#4932a4;text-decoration:none;font-size:13px;font-weight:950;letter-spacing:.025em}.sm-offer-value-cta>b{font-size:22px}.sm-offer-value-trust{position:relative;z-index:1;display:flex;justify-content:space-between;gap:10px;margin-top:14px;color:#d9d0e5;font-size:9px;font-weight:750}
@media(max-width:820px){.sm-offer-value-layout{grid-template-columns:1fr}.sm-offer-value-checkout{min-height:0}.sm-offer-value-trust{justify-content:flex-start;flex-wrap:wrap}}
@media(max-width:640px){.sm-offer-value{padding:58px 0 66px}.sm-offer-value-shell{width:calc(100% - 28px)}.sm-offer-value-head{margin-bottom:24px}.sm-offer-value-eyebrow{font-size:10px;padding:8px 12px}.sm-offer-value-head h2{font-size:clamp(36px,9.8vw,44px)}.sm-offer-value-head p{font-size:14px}.sm-offer-value-list{gap:9px}.sm-offer-value-item{grid-template-columns:38px minmax(0,1fr) auto;gap:10px;min-height:0;padding:14px 13px;border-radius:18px}.sm-offer-value-index{width:36px;height:36px;border-radius:11px;font-size:10px}.sm-offer-value-copy h3{font-size:17px}.sm-offer-value-copy small{font-size:9px}.sm-offer-value-price s{font-size:14px}.sm-offer-value-price b{padding:5px 7px;font-size:9px}.sm-offer-value-note{padding:13px 14px}.sm-offer-value-note p{font-size:12px}.sm-offer-value-checkout{padding:23px 20px;border-radius:23px}.sm-offer-value-final strong{font-size:68px}.sm-offer-value-final>span{font-size:26px}.sm-offer-value-trust{font-size:8.5px}}
@media(max-width:390px){.sm-offer-value-item{grid-template-columns:34px minmax(0,1fr) auto;gap:8px;padding-left:10px;padding-right:10px}.sm-offer-value-copy h3{font-size:16px}.sm-offer-value-price s{font-size:13px}}
</style>`;
html = html.replace('</head>', css + '</head>');

fs.writeFileSync(target, html);
console.log('Offer rebuilt: 50% applies to Supermapas; two bonuses shown as free.');
