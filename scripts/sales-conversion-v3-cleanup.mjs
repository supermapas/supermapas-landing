import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/sales-conversion-v3-cleanup.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

// Remove the old hero offer pill so the new 50% + 2 bonuses badge is the single offer badge.
html = html.replace(/<div class="sm-offer-pill"[^>]*>.*?<\/div>/gs, '');

// Remove the orphan section-nav stop for the deleted samples section.
html = html.replace(/<button type="button" class="sm-section-nav-stop"[^>]*aria-label="Ir para Veja o material"[^>]*><span aria-hidden="true"><\/span><\/button>/g, '');

// Recalculate stop positions after removing one section.
html = html.replace(/<nav class="sm-section-nav"[\s\S]*?<\/nav>/, (nav) => {
  const stops = [...nav.matchAll(/<button type="button" class="sm-section-nav-stop[^>]*>/g)];
  const total = stops.length;
  let i = 0;
  return nav.replace(/(<button type="button" class="sm-section-nav-stop[^>]*style=")top:[^%]+%("[^>]*>)/g, (_m, a, b) => {
    const pct = total > 1 ? (i / (total - 1)) * 100 : 0;
    i += 1;
    return a + 'top:' + pct.toFixed(4).replace(/\.0+$/,'') + '%' + b;
  });
});

if (html.includes('Ir para Veja o material')) throw new Error('Orphan samples nav item still present.');
if (!html.includes('id="sm-catalog-search-input"')) throw new Error('Searchable catalog missing after cleanup.');
if (!html.includes('sm-hero-offer-badge-v3')) throw new Error('New hero offer badge missing after cleanup.');

fs.writeFileSync(target, html);
console.log('Sales v3 cleanup applied: nav reflowed and duplicate hero offer removed.');
