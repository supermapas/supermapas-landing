import fs from 'node:fs';

const file = process.argv[2];
if (!file) throw new Error('Usage: node scripts/production-50off-cta-v1.mjs <html-file>');

let html = fs.readFileSync(file, 'utf8');

function replaceRequired(needle, replacement, expected = 1) {
  const count = html.split(needle).length - 1;
  if (count !== expected) {
    throw new Error(`Expected ${expected} occurrence(s) of ${JSON.stringify(needle)}, found ${count}`);
  }
  html = html.split(needle).join(replacement);
}

function replaceAtLeast(needle, replacement, minimum = 1) {
  const count = html.split(needle).length - 1;
  if (count < minimum) {
    throw new Error(`Expected at least ${minimum} occurrence(s) of ${JSON.stringify(needle)}, found ${count}`);
  }
  html = html.split(needle).join(replacement);
}

const offerPill = '<div class="sm-offer-pill" aria-label="Oferta especial de cinquenta por cento de desconto"><span>OFERTA ESPECIAL</span><strong>50% OFF</strong></div>';
replaceRequired('<div class="sm-dh-copy"><h1>', `<div class="sm-dh-copy">${offerPill}<h1>`);
replaceRequired('<div class="sm-mh-copy"><h1', `<div class="sm-mh-copy">${offerPill}<h1`);

replaceRequired(
  '<div class="sm-dh-price"><strong>12x de R$6,93</strong><span>ou R$67 à vista</span></div>',
  '<div class="sm-dh-price"><small class="sm-price-was">de <s>R$137,90</s> · <b>50% OFF</b></small><strong>12x de R$6,93</strong><span>ou R$67 à vista</span></div>'
);
replaceRequired(
  '<div class="sm-mh-price"><strong>12x de R$6,93</strong><span>ou R$67 à vista</span></div>',
  '<div class="sm-mh-price"><small class="sm-price-was">de <s>R$137,90</s> · <b>50% OFF</b></small><strong>12x de R$6,93</strong><span>ou R$67 à vista</span></div>'
);

replaceRequired(
  '<span class="sm-offer-close-eyebrow">ACESSO COMPLETO</span>',
  '<span class="sm-offer-close-eyebrow">OFERTA ESPECIAL · 50% OFF</span>'
);
replaceRequired(
  '<div class="sm-offer-close-price"><small>por apenas</small><div>',
  '<div class="sm-offer-close-price"><div class="sm-offer-close-discount"><s>R$137,90</s><b>50% OFF</b></div><small>por apenas</small><div>'
);
replaceRequired(
  '<p>Pagamento único · acesso digital</p>',
  '<p>Oferta de 50% · pagamento único · acesso digital</p>'
);
replaceRequired(
  '<p>A oferta pode ser parcelada em até 12x de R$6,93 no cartão. O parcelamento possui acréscimo; o valor à vista é R$67.</p>',
  '<p>A oferta atual já inclui 50% de desconto: de R$137,90 por R$67 à vista. Também pode ser parcelada em até 12x de R$6,93 no cartão, com acréscimo.</p>'
);

replaceAtLeast('QUERO ACESSAR AGORA', 'QUERO GARANTIR 50% OFF', 3);
replaceAtLeast('ACESSAR AGORA', 'GARANTIR 50% OFF', 2);
replaceAtLeast('Acessar agora', 'Garantir 50% OFF', 1);

replaceRequired('<small>✓ 7 dias de garantia</small>', '<small>✓ 50% OFF já aplicado · 7 dias de garantia</small>');
replaceRequired('<div class="sm-mh-guarantee">✓ 7 dias de garantia</div>', '<div class="sm-mh-guarantee">✓ 50% OFF já aplicado · 7 dias de garantia</div>');

const css = `
<style id="sm-production-offer-v1">
.sm-offer-pill{display:inline-flex;align-items:center;gap:8px;width:max-content;margin:0 0 16px;padding:5px 5px 5px 12px;border:1px solid rgba(101,78,210,.18);border-radius:999px;background:#fff;box-shadow:0 8px 24px rgba(54,38,120,.10);font-size:11px;font-weight:800;letter-spacing:.08em;color:#51428f}
.sm-offer-pill strong{display:inline-flex;align-items:center;justify-content:center;padding:6px 10px;border-radius:999px;background:#f36a2d;color:#fff;font-size:12px;letter-spacing:.04em;box-shadow:0 5px 14px rgba(243,106,45,.24)}
.sm-price-was{display:block!important;margin-bottom:2px!important;font-size:11px!important;font-weight:700!important;line-height:1.2!important;color:#6e6880!important}
.sm-price-was s{opacity:.72;text-decoration-thickness:1.5px}.sm-price-was b{color:#e55721!important;font-weight:900!important}
.sm-offer-close-discount{display:flex;align-items:center;gap:9px;margin-bottom:6px;font-size:13px;font-weight:800;color:#7a7489}
.sm-offer-close-discount s{text-decoration-thickness:1.5px}.sm-offer-close-discount b{display:inline-flex;padding:5px 8px;border-radius:999px;background:#f36a2d;color:#fff;font-size:11px;letter-spacing:.04em}
.sm-dh-primary,.sm-mh-cta,.sm-mh-offer-cta,.sm-offer-close-cta,.sm-faq-closing a,.sm-dh-offer>a,.sm-dh-header-cta{font-weight:900!important}
@media(max-width:640px){.sm-offer-pill{margin:0 auto 14px;font-size:10px;padding-left:10px}.sm-offer-pill strong{font-size:11px;padding:5px 8px}.sm-price-was{font-size:10px!important}.sm-offer-close-discount{justify-content:center}}
</style>`;
replaceRequired('</head>', `${css}\n</head>`);

fs.writeFileSync(file, html);
console.log(`Applied production 50% offer CTA transform to ${file}`);
