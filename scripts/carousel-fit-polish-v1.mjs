import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/carousel-fit-polish-v1.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

if (!html.includes('data-sm-carousel="maps"') || !html.includes('data-sm-carousel="summaries"') || !html.includes('data-sm-carousel="cards"')) {
  throw new Error('Carousel fit polish requires the three sales carousels.');
}

const css = `<style id="sm-carousel-fit-polish-v1">
/* The material itself defines the visible frame. No extra white canvas around it. */
.sm-format-carousel{--sm-frame-w:92%;--sm-frame-ratio:3508/2480;position:relative!important;overflow:visible!important}
.sm-format-carousel-frame{position:absolute!important;left:50%!important;top:50%!important;right:auto!important;bottom:auto!important;inset:auto!important;width:var(--sm-frame-w)!important;height:auto!important;aspect-ratio:var(--sm-frame-ratio)!important;transform:translate(-50%,-50%)!important;border-radius:5px!important;background:transparent!important;overflow:visible!important;filter:drop-shadow(0 18px 18px rgba(41,31,78,.17)) drop-shadow(0 -8px 12px rgba(41,31,78,.09)) drop-shadow(9px 0 12px rgba(41,31,78,.07)) drop-shadow(-9px 0 12px rgba(41,31,78,.07))!important}
.sm-format-carousel-track{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;overflow:hidden!important;border-radius:4px!important;background:transparent!important}
.sm-format-carousel-slide{position:absolute!important;inset:0!important;display:block!important;width:100%!important;height:100%!important;max-width:none!important;margin:0!important;padding:0!important;object-fit:cover!important;object-position:50% 50%!important;background:transparent!important;transform:none!important}

/* Each format uses the real proportion of its files. */
.sm-format-v2-map-visual.sm-format-carousel{--sm-frame-w:94%;--sm-frame-ratio:3508/2480}
.sm-format-v2-summary-visual.sm-format-carousel{--sm-frame-w:64%;--sm-frame-ratio:2480/3508}
.sm-format-v2-card-visual.sm-format-carousel{--sm-frame-w:94%;--sm-frame-ratio:3/2}

/* Arrows live immediately outside the real material edge, never below it. */
.sm-format-carousel .sm-carousel-arrow{top:50%!important;bottom:auto!important;transform:translateY(-50%)!important;margin:0!important}
.sm-format-v2-map-visual .sm-carousel-prev,.sm-format-v2-card-visual .sm-carousel-prev{left:0!important}
.sm-format-v2-map-visual .sm-carousel-next,.sm-format-v2-card-visual .sm-carousel-next{right:0!important}
.sm-format-v2-summary-visual .sm-carousel-prev{left:14%!important}
.sm-format-v2-summary-visual .sm-carousel-next{right:14%!important}

/* Some card source canvases carry slightly different optical centers.
   Normalize the visible composition without changing their size. */
.sm-format-v2-card-visual [data-sm-carousel-slide="0"]{object-position:50% 50%!important}
.sm-format-v2-card-visual [data-sm-carousel-slide="1"]{object-position:50% 50%!important}
.sm-format-v2-card-visual [data-sm-carousel-slide="2"]{object-position:50% 50%!important}
.sm-format-v2-card-visual [data-sm-carousel-slide="3"]{object-position:50% 50%!important}
.sm-format-v2-card-visual [data-sm-carousel-slide="4"]{object-position:50% 50%!important}
.sm-format-v2-card-visual [data-sm-carousel-slide="5"]{object-position:50% 50%!important}

@media(max-width:720px){
 .sm-format-v2-map-visual.sm-format-carousel{--sm-frame-w:92%}
 .sm-format-v2-summary-visual.sm-format-carousel{--sm-frame-w:62%}
 .sm-format-v2-card-visual.sm-format-carousel{--sm-frame-w:92%}
 .sm-format-v2-map-visual .sm-carousel-prev,.sm-format-v2-card-visual .sm-carousel-prev{left:-1%!important}
 .sm-format-v2-map-visual .sm-carousel-next,.sm-format-v2-card-visual .sm-carousel-next{right:-1%!important}
 .sm-format-v2-summary-visual .sm-carousel-prev{left:13%!important}
 .sm-format-v2-summary-visual .sm-carousel-next{right:13%!important}
}
</style>`;

html = html.replace('</head>', css + '</head>');

// Guard: the approved searchable/expandable content section must remain untouched.
if (!html.includes('id="sm-catalog-search-input"') || (html.match(/data-catalog-group/g) || []).length < 14) {
  throw new Error('Content catalog integrity check failed after carousel fit polish.');
}

fs.writeFileSync(target, html);
console.log('Carousel fit polish v1 applied.');
