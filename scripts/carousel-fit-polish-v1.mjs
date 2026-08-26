import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/carousel-fit-polish-v1.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

if (!html.includes('data-sm-carousel="maps"') || !html.includes('data-sm-carousel="summaries"') || !html.includes('data-sm-carousel="cards"')) {
  throw new Error('Carousel fit polish requires the three sales carousels.');
}

const css = `<style id="sm-carousel-fit-polish-v1">
/* Restore the original Production geometry. The carousel must not resize the visual column. */
.sm-format-carousel{
  position:relative!important;
  overflow:visible!important;
}

/* Only the INTERNAL frame gets a ratio. The outer .sm-format-v2-visual keeps Production sizing/padding. */
.sm-format-v2-map-visual.sm-format-carousel{--sm-frame-w:93%;--sm-frame-ratio:2048/1447}
.sm-format-v2-summary-visual.sm-format-carousel{--sm-frame-w:47%;--sm-frame-ratio:1447/2048}
.sm-format-v2-card-visual.sm-format-carousel{--sm-frame-w:93%;--sm-frame-ratio:2048/1447}

.sm-format-carousel-frame{
  position:absolute!important;
  left:50%!important;
  top:50%!important;
  right:auto!important;
  bottom:auto!important;
  inset:auto!important;
  width:var(--sm-frame-w)!important;
  height:auto!important;
  aspect-ratio:var(--sm-frame-ratio)!important;
  transform:translate(-50%,-50%)!important;
  margin:0!important;
  padding:0!important;
  border:0!important;
  border-radius:0!important;
  background:transparent!important;
  overflow:visible!important;
  filter:none!important;
}
.sm-format-carousel-track{
  position:absolute!important;
  inset:0!important;
  width:100%!important;
  height:100%!important;
  margin:0!important;
  padding:0!important;
  overflow:visible!important;
  border:0!important;
  border-radius:0!important;
  background:transparent!important;
}
.sm-format-carousel-slide{
  position:absolute!important;
  inset:0!important;
  display:block!important;
  width:100%!important;
  height:100%!important;
  max-width:none!important;
  margin:0!important;
  padding:0!important;
  border:0!important;
  object-fit:contain!important;
  object-position:50% 50%!important;
  background:transparent!important;
  transform:none!important;
  filter:drop-shadow(0 22px 28px #33255824)!important;
}

/* Controls sit just outside the exact image rectangle. */
.sm-format-carousel .sm-carousel-arrow{
  top:50%!important;
  bottom:auto!important;
  transform:translateY(-50%)!important;
  margin:0!important;
}
.sm-format-carousel .sm-carousel-prev{left:calc((100% - var(--sm-frame-w))/2 - 24px)!important}
.sm-format-carousel .sm-carousel-next{right:calc((100% - var(--sm-frame-w))/2 - 24px)!important}

@media(max-width:1100px) and (min-width:901px){
  .sm-format-v2-map-visual.sm-format-carousel{--sm-frame-w:92%}
  .sm-format-v2-summary-visual.sm-format-carousel{--sm-frame-w:46.5%}
  .sm-format-v2-card-visual.sm-format-carousel{--sm-frame-w:92%}
}
@media(max-width:900px) and (min-width:641px){
  .sm-format-v2-map-visual.sm-format-carousel{--sm-frame-w:91%}
  .sm-format-v2-summary-visual.sm-format-carousel{--sm-frame-w:48%}
  .sm-format-v2-card-visual.sm-format-carousel{--sm-frame-w:91%}
}
@media(max-width:640px){
  .sm-format-v2-map-visual.sm-format-carousel{--sm-frame-w:92%}
  .sm-format-v2-summary-visual.sm-format-carousel{--sm-frame-w:54%}
  .sm-format-v2-card-visual.sm-format-carousel{--sm-frame-w:92%}
  .sm-format-carousel .sm-carousel-prev{left:calc((100% - var(--sm-frame-w))/2 - 17px)!important}
  .sm-format-carousel .sm-carousel-next{right:calc((100% - var(--sm-frame-w))/2 - 17px)!important}
}
</style>`;

html = html.replace('</head>', css + '</head>');

if (!html.includes('id="sm-catalog-search-input"') || (html.match(/data-catalog-group/g) || []).length < 14) {
  throw new Error('Content catalog integrity check failed after carousel fit polish.');
}

fs.writeFileSync(target, html);
console.log('Carousel fit polish v1 applied with Production geometry.');
