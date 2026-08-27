import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/preview-dock-exact-production-size-v1.mjs <html-file>');

let html = fs.readFileSync(target, 'utf8');

const newDockMarkup = '<div class="sm-dock-discount" aria-label="Sessenta por cento de desconto">60% OFF</div><div class="sm-dock-inventory">98 Supermapas + 50 Super-Resumos + 190 Supercards</div><div class="sm-dock-urgency" aria-label="Oferta acaba hoje"><span>ACABA HOJE</span><strong data-sm-dock-countdown>--:--:--</strong></div><div class="sm-dock-actions"><a class="sm-dock-checkout" href="#oferta"><span>QUERO AGORA</span><b aria-hidden="true">→</b></a><a class="sm-dock-whatsapp" href="https://wa.me/message/EFBIDZUKN7B2O1" target="_blank" rel="noreferrer" aria-label="Tire dúvidas com o Supermapas pelo WhatsApp em uma nova aba"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.12 1.03 6.99 2.9a9.825 9.825 0 0 1 2.9 7.01c-.003 5.45-4.443 9.89-9.906 9.89m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.14 1.588 5.945L.056 24l6.304-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"></path></svg><span>Tire dúvidas</span></a></div>';

const dockFn = /function dockMarkup\(\)\{\s*return '<div class="sm-dock-discount"[\s\S]*?';\s*\}/;
if (!dockFn.test(html)) throw new Error('Dock markup factory not found.');
html = html.replace(dockFn, `function dockMarkup(){\n    return '${newDockMarkup}';\n  }`);

const css = `
<style id="sm-preview-dock-exact-production-size-v1">
@media(max-width:640px){
  /* Exact external geometry from current Production. */
  .sm-sales-dock{
    box-sizing:border-box!important;
    width:calc(100% - 14px)!important;
    max-width:none!important;
    min-width:0!important;
    min-height:56px!important;
    margin:5px auto 6px!important;
    padding:6px 6px 6px 12px!important;
    border-radius:15px!important;
    gap:6px!important;
    overflow:hidden!important;
  }
  .sm-sales-dock .sm-dock-inventory{display:none!important}
  .sm-sales-dock .sm-dock-discount{
    display:inline-flex!important;
    align-items:center!important;
    justify-content:center!important;
    flex:0 0 auto!important;
    min-width:0!important;
    min-height:0!important;
    padding:0!important;
    font-size:12.5px!important;
    line-height:1!important;
    letter-spacing:0!important;
    white-space:nowrap!important;
  }
  .sm-dock-urgency{
    display:flex!important;
    flex:0 1 76px!important;
    min-width:68px!important;
    max-width:76px!important;
    min-height:43px!important;
    box-sizing:border-box!important;
    flex-direction:column!important;
    align-items:center!important;
    justify-content:center!important;
    gap:2px!important;
    padding:3px 4px!important;
    border-left:1px solid rgba(96,82,112,.12)!important;
    border-right:1px solid rgba(96,82,112,.12)!important;
    line-height:1!important;
    overflow:hidden!important;
  }
  .sm-dock-urgency span{color:#736b7b!important;font-size:6.8px!important;font-weight:900!important;letter-spacing:.035em!important;white-space:nowrap!important}
  .sm-dock-urgency strong{color:#ef641f!important;font-variant-numeric:tabular-nums!important;font-size:10.8px!important;font-weight:950!important;letter-spacing:-.01em!important;white-space:nowrap!important}
  .sm-sales-dock .sm-dock-actions{
    display:flex!important;
    align-items:center!important;
    gap:4px!important;
    flex:0 0 auto!important;
    min-width:0!important;
    margin-left:auto!important;
  }
  .sm-sales-dock .sm-dock-actions>a{min-height:43px!important}
  .sm-sales-dock .sm-dock-checkout{
    box-sizing:border-box!important;
    width:auto!important;
    min-width:0!important;
    max-width:94px!important;
    padding:0 8px!important;
    gap:4px!important;
    border-radius:12px!important;
    white-space:nowrap!important;
  }
  .sm-sales-dock .sm-dock-checkout span{font-size:9.5px!important;line-height:1!important;letter-spacing:0!important;white-space:nowrap!important}
  .sm-sales-dock .sm-dock-checkout b{display:none!important}
  .sm-sales-dock .sm-dock-whatsapp{
    box-sizing:border-box!important;
    display:grid!important;
    place-items:center!important;
    flex:0 0 34px!important;
    width:34px!important;
    min-width:34px!important;
    max-width:34px!important;
    padding:0!important;
    border-radius:12px!important;
    overflow:hidden!important;
  }
  .sm-sales-dock .sm-dock-whatsapp span{display:none!important}
  .sm-sales-dock .sm-dock-whatsapp svg{width:17px!important;height:17px!important;margin:0!important}
}
@media(max-width:360px){
  /* Production uses the same outer size, with a slightly smaller left inset. */
  .sm-sales-dock{padding-left:8px!important;gap:5px!important}
  .sm-sales-dock .sm-dock-discount{font-size:11.3px!important}
  .sm-dock-urgency{flex-basis:64px!important;min-width:60px!important;max-width:64px!important;padding-left:2px!important;padding-right:2px!important}
  .sm-dock-urgency span{font-size:6.2px!important;letter-spacing:0!important}
  .sm-dock-urgency strong{font-size:9.8px!important}
  .sm-sales-dock .sm-dock-checkout{max-width:82px!important;padding-left:6px!important;padding-right:6px!important}
  .sm-sales-dock .sm-dock-checkout span{font-size:8.7px!important}
  .sm-sales-dock .sm-dock-whatsapp{flex-basis:31px!important;width:31px!important;min-width:31px!important;max-width:31px!important}
}
</style>`;
html = html.replace('</head>', css + '\n</head>');

fs.writeFileSync(target, html);
console.log('Dock fixed: exact Production outer geometry and native urgency markup on every recreation.');
