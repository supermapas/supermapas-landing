import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/content-index-polish-v1.mjs <html-file>');

let html = fs.readFileSync(target, 'utf8');

html = html.replace('Veja tudo o que está <span>incluído no material.</span>', 'Veja tudo o que está <span>incluso no material.</span>');
if (!html.includes('href="/favicon.png"')) {
  html = html.replace('</head>', '<link rel="icon" type="image/png" sizes="64x64" href="/favicon.png"/><link rel="apple-touch-icon" href="/favicon.png"/></head>');
}

const style = `<style id="sm-content-index-polish-v1">
@media (max-width:760px){
  .sm-catalog-search input{font-size:16px!important;line-height:1.3}

  .sm-proof-v2-reasons>div{
    display:grid!important;
    grid-template-columns:repeat(4,minmax(0,1fr))!important;
    gap:6px!important;
    align-items:center!important;
    margin:0 0 18px!important;
    padding:0 0 18px!important;
    border-bottom:1px solid rgba(255,255,255,.18)!important;
  }
  .sm-proof-v2-reasons>div>span{
    min-width:0!important;
    width:100%!important;
    padding:9px 4px!important;
    border-radius:999px!important;
    font-size:10.5px!important;
    line-height:1.15!important;
    text-align:center!important;
    white-space:nowrap!important;
  }
  .sm-proof-v2-reasons>small{
    display:flex!important;
    align-items:center!important;
    gap:10px!important;
    margin:0!important;
    padding-top:2px!important;
  }
}
</style>`;

const script = `<script id="sm-content-index-polish-interactions">(function(){
  var input=document.getElementById('sm-catalog-search-input');
  if(!input)return;
  var groups=[].slice.call(document.querySelectorAll('[data-catalog-group]'));

  function keepClosed(){
    groups.forEach(function(group){group.open=false;});
  }

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
