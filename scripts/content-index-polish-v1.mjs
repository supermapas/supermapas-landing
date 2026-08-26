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

  .sm-proof-v2-reasons{
    display:block!important;
  }
  .sm-proof-v2-reasons>p,
  .sm-proof-v2-reasons>h3,
  .sm-proof-v2-reasons>strong{
    margin-bottom:18px!important;
  }
  .sm-proof-v2-reasons>div{
    display:grid!important;
    grid-template-columns:repeat(4,minmax(0,1fr))!important;
    gap:6px!important;
    align-items:stretch!important;
    margin:0!important;
    padding:0 0 22px!important;
    border-bottom:1px solid rgba(255,255,255,.18)!important;
  }
  .sm-proof-v2-reasons>div>span{
    box-sizing:border-box!important;
    min-width:0!important;
    width:100%!important;
    height:42px!important;
    padding:0 3px!important;
    border-radius:999px!important;
    display:flex!important;
    align-items:center!important;
    justify-content:center!important;
    font-size:10px!important;
    line-height:1!important;
    text-align:center!important;
    white-space:nowrap!important;
  }
  .sm-proof-v2-reasons>small{
    display:flex!important;
    align-items:center!important;
    gap:10px!important;
    margin:22px 0 0!important;
    padding:0!important;
    border:0!important;
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
