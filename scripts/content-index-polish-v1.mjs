import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/content-index-polish-v1.mjs <html-file>');

let html = fs.readFileSync(target, 'utf8');

const style = `<style id="sm-content-index-polish-v1">
/* Keep iOS Safari from zooming when the catalog search receives focus. */
@media (max-width:760px){
  .sm-catalog-search input{font-size:16px!important;line-height:1.3}
}

/* Refined closing note: centered, lighter and visually tied to the catalog. */
.sm-catalog-foot{
  position:relative;
  display:grid;
  grid-template-columns:48px minmax(0,1fr);
  align-items:center;
  gap:16px;
  width:min(900px,calc(100% - 32px));
  margin:30px auto 0;
  padding:20px 24px;
  border:1px solid rgba(114,91,209,.16);
  border-radius:20px;
  background:linear-gradient(135deg,#fff 0%,#faf8ff 55%,#f2eeff 100%);
  box-shadow:0 15px 40px rgba(64,47,128,.09);
  color:#6f6779;
  overflow:hidden;
}
.sm-catalog-foot:before{
  content:"";
  position:absolute;
  right:-42px;
  top:-58px;
  width:150px;
  height:150px;
  border-radius:50%;
  background:radial-gradient(circle,rgba(114,91,209,.13),rgba(114,91,209,0) 72%);
  pointer-events:none;
}
.sm-catalog-foot>span{
  position:relative;
  z-index:1;
  display:flex;
  align-items:center;
  justify-content:center;
  width:46px;
  height:46px;
  border-radius:14px;
  background:linear-gradient(145deg,#7459cf,#8a71df);
  box-shadow:0 10px 22px rgba(114,91,209,.22);
  color:#fff;
  font-size:23px;
  font-weight:900;
}
.sm-catalog-foot p{
  position:relative;
  z-index:1;
  margin:0;
  color:#716a7b;
  font-size:14px;
  line-height:1.55;
  text-align:left;
}
.sm-catalog-foot strong{
  display:block;
  margin-bottom:2px;
  color:#352f40;
  font-size:15px;
  line-height:1.35;
}
@media(max-width:760px){
  .sm-catalog-foot{
    grid-template-columns:1fr;
    justify-items:center;
    width:100%;
    margin-top:24px;
    padding:22px 20px 23px;
    gap:12px;
    border-radius:20px;
  }
  .sm-catalog-foot>span{width:48px;height:48px;border-radius:15px}
  .sm-catalog-foot p{max-width:440px;font-size:13px;line-height:1.55;text-align:center}
  .sm-catalog-foot strong{margin-bottom:4px;font-size:14px}
}
</style>`;

const script = `<script id="sm-content-index-polish-interactions">(function(){
  var input=document.getElementById('sm-catalog-search-input');
  if(!input)return;
  var groups=[].slice.call(document.querySelectorAll('[data-catalog-group]'));

  function keepClosed(){
    groups.forEach(function(group){group.open=false;});
  }

  /* The original filter decides which groups/items match. This refinement only
     keeps matching accordions closed so the visitor chooses what to expand. */
  input.addEventListener('input',keepClosed);
  input.addEventListener('search',keepClosed);

  var clear=input.parentElement&&input.parentElement.querySelector('button');
  if(clear) clear.addEventListener('click',keepClosed);
})();</script>`;

if (!html.includes('id="sm-content-index-polish-v1"')) {
  html = html.replace('</head>', style + '</head>');
}
if (!html.includes('id="sm-content-index-polish-interactions"')) {
  html = html.replace('</body>', script + '</body>');
}

fs.writeFileSync(target, html);
console.log('content index polish applied');
