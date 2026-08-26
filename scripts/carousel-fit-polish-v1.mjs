import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/carousel-fit-polish-v1.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

if (!html.includes('data-sm-carousel="maps"') || !html.includes('data-sm-carousel="summaries"') || !html.includes('data-sm-carousel="cards"')) {
  throw new Error('Carousel fit polish requires the three sales carousels.');
}

const css = `<style id="sm-carousel-fit-polish-v1">
/* Keep the previously approved visual size, but make the frame itself exactly match the file ratio. */
.sm-format-carousel{
  --sm-frame-w:94%;
  --sm-frame-ratio:2048/1447;
  position:relative!important;
  overflow:visible!important;
}
.sm-format-v2-map-visual.sm-format-carousel{
  --sm-frame-w:94%;
  --sm-frame-ratio:2048/1447;
}
.sm-format-v2-summary-visual.sm-format-carousel{
  --sm-frame-w:64%;
  --sm-frame-ratio:1447/2048;
}
.sm-format-v2-card-visual.sm-format-carousel{
  --sm-frame-w:94%;
  --sm-frame-ratio:2048/1447;
}

/* No site-created canvas: the frame has the same ratio as the source file. */
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
  border-radius:5px!important;
  background:transparent!important;
  overflow:visible!important;
  filter:drop-shadow(0 18px 18px rgba(41,31,78,.17)) drop-shadow(0 -8px 12px rgba(41,31,78,.09)) drop-shadow(9px 0 12px rgba(41,31,78,.07)) drop-shadow(-9px 0 12px rgba(41,31,78,.07))!important;
}
.sm-format-carousel-track{
  position:absolute!important;
  inset:0!important;
  width:100%!important;
  height:100%!important;
  margin:0!important;
  padding:0!important;
  overflow:hidden!important;
  border:0!important;
  border-radius:4px!important;
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
}

/* Arrows follow the real edge of the reduced frame, not the larger layout box. */
.sm-format-carousel .sm-carousel-arrow{
  top:50%!important;
  bottom:auto!important;
  transform:translateY(-50%)!important;
  margin:0!important;
}
.sm-format-carousel .sm-carousel-prev{
  left:calc((100% - var(--sm-frame-w))/2 - 24px)!important;
}
.sm-format-carousel .sm-carousel-next{
  right:calc((100% - var(--sm-frame-w))/2 - 24px)!important;
}

@media(max-width:720px){
  .sm-format-v2-map-visual.sm-format-carousel,
  .sm-format-v2-card-visual.sm-format-carousel{--sm-frame-w:92%}
  .sm-format-v2-summary-visual.sm-format-carousel{--sm-frame-w:62%}
  .sm-format-carousel .sm-carousel-prev{
    left:calc((100% - var(--sm-frame-w))/2 - 17px)!important;
  }
  .sm-format-carousel .sm-carousel-next{
    right:calc((100% - var(--sm-frame-w))/2 - 17px)!important;
  }
}
</style>`;

html = html.replace('</head>', css + '</head>');

if (!html.includes('id="sm-catalog-search-input"') || (html.match(/data-catalog-group/g) || []).length < 14) {
  throw new Error('Content catalog integrity check failed after carousel fit polish.');
}

fs.writeFileSync(target, html);
console.log('Carousel fit polish v1 applied.');
