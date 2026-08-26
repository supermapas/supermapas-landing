import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/carousel-fit-polish-v1.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

if (!html.includes('data-sm-carousel="maps"') || !html.includes('data-sm-carousel="summaries"') || !html.includes('data-sm-carousel="cards"')) throw new Error('Carousel fit polish requires the three sales carousels.');

const css = `<style id="sm-carousel-fit-polish-v1">
.sm-format-carousel{position:relative!important;overflow:visible!important}
.sm-format-carousel-frame{position:relative!important;inset:auto!important;left:auto!important;top:auto!important;right:auto!important;bottom:auto!important;flex:0 0 auto!important;margin:0!important;padding:0!important;border:0!important;background:transparent!important;overflow:visible!important;filter:drop-shadow(0 14px 18px rgba(51,37,88,.12)) drop-shadow(0 -4px 8px rgba(51,37,88,.045))!important}
.sm-format-carousel-track{position:relative!important;width:100%!important;height:100%!important;margin:0!important;padding:0!important;overflow:hidden!important;border:0!important;background:transparent!important}
.sm-format-carousel-slide{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;margin:0!important;padding:0!important;border:0!important;object-fit:contain!important;object-position:50% 50%!important;background:transparent!important;transform:none!important;filter:none!important}
.sm-format-v2-map-visual.sm-format-carousel .sm-format-carousel-frame{width:93%!important;aspect-ratio:2048/1447!important;transform:translateX(16px)!important}
.sm-format-v2-summary-visual.sm-format-carousel .sm-format-carousel-frame{width:47%!important;aspect-ratio:1447/2048!important;transform:none!important}
.sm-format-v2-card-visual.sm-format-carousel .sm-format-carousel-frame{width:82%!important;aspect-ratio:2048/1447!important;transform:translateX(19px)!important}
.sm-format-carousel .sm-carousel-arrow{top:50%!important;bottom:auto!important;transform:translateY(-50%)!important;margin:0!important;z-index:8!important}
.sm-format-v2-map-visual.sm-format-carousel .sm-carousel-prev{left:1%!important}.sm-format-v2-map-visual.sm-format-carousel .sm-carousel-next{right:1%!important}
.sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-prev{left:22%!important}.sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-next{right:22%!important}
/* Supercards: arrows closer to the material edges without touching the frame. */
.sm-format-v2-card-visual.sm-format-carousel .sm-carousel-prev{left:4%!important}.sm-format-v2-card-visual.sm-format-carousel .sm-carousel-next{right:4%!important}
@media (max-width:1100px) and (min-width:901px){.sm-format-v2-map-visual.sm-format-carousel .sm-format-carousel-frame{width:92%!important;transform:translateX(12px)!important}.sm-format-v2-summary-visual.sm-format-carousel .sm-format-carousel-frame{width:46.5%!important;transform:none!important}.sm-format-v2-card-visual.sm-format-carousel .sm-format-carousel-frame{width:84%!important;transform:translateX(11px)!important}}
@media (max-width:900px) and (min-width:641px){.sm-format-v2-map-visual.sm-format-carousel .sm-format-carousel-frame{width:91%!important;transform:translateX(9px)!important}.sm-format-v2-summary-visual.sm-format-carousel .sm-format-carousel-frame{width:48%!important;transform:none!important}.sm-format-v2-card-visual.sm-format-carousel .sm-format-carousel-frame{width:90%!important;transform:translateX(10px)!important}.sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-prev{left:21%!important}.sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-next{right:21%!important}}
@media (max-width:640px){.sm-format-carousel-frame{filter:drop-shadow(0 10px 14px rgba(51,37,88,.11)) drop-shadow(0 -3px 6px rgba(51,37,88,.04))!important}.sm-format-v2-map-visual.sm-format-carousel .sm-format-carousel-frame{width:92%!important;transform:none!important}.sm-format-v2-summary-visual.sm-format-carousel .sm-format-carousel-frame{width:54%!important;transform:none!important}.sm-format-v2-card-visual.sm-format-carousel .sm-format-carousel-frame{width:92%!important;transform:none!important}.sm-format-v2-map-visual.sm-format-carousel .sm-carousel-prev,.sm-format-v2-card-visual.sm-format-carousel .sm-carousel-prev{left:0!important}.sm-format-v2-map-visual.sm-format-carousel .sm-carousel-next,.sm-format-v2-card-visual.sm-format-carousel .sm-carousel-next{right:0!important}.sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-prev{left:19%!important}.sm-format-v2-summary-visual.sm-format-carousel .sm-carousel-next{right:19%!important}}
</style>`;
html = html.replace('</head>', css + '</head>');
if (!html.includes('id="sm-catalog-search-input"') || (html.match(/data-catalog-group/g) || []).length < 14) throw new Error('Content catalog integrity check failed after carousel fit polish.');
fs.writeFileSync(target, html);
console.log('Carousel fit polish v1 applied.');
