import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('./.playwright-ci/node_modules/playwright-core');
const preview = process.env.PREVIEW_URL;
const production = 'https://www.supermapas.com.br/';
if (!preview) throw new Error('PREVIEW_URL is required');
fs.mkdirSync('visual-artifacts', {recursive:true});
const browser = await chromium.launch({channel:'chrome', headless:true, args:['--no-sandbox']});
const failures = [], results = [];
const widths = [320, 360, 390, 430, 768, 1440];
const selectors = ['.sm-dh-header-cta','.sm-dh-primary','.sm-mh-cta','.sm-offer-value-cta','.sm-dock-checkout','.sm-dock-whatsapp','.sm-hero-offer-badge-v3 strong','.sm-hero-offer-badge-v3 span','.sm-bf-campaign>strong','.sm-bf-campaign-discount'];

function rgb(s) {
  const m=String(s).match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  return m ? [+m[1],+m[2],+m[3]] : null;
}
function lum([r,g,b]) {
  const a=[r,g,b].map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});
  return a[0]*.2126+a[1]*.7152+a[2]*.0722;
}
function contrast(a,b) { const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); }
const page = await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
page.on('pageerror',e=>failures.push('pageerror '+e.message));
for (const width of widths) {
  await page.setViewportSize({width,height:width>800?900:844});
  await page.goto(preview,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(1000);
  await page.evaluate(()=>document.fonts.ready);
  const report=await page.evaluate((selectors)=>{
    const rect=o=>{const r=o.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}};
    const visible=o=>{const s=getComputedStyle(o),r=o.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0};
    const data=[];
    for (const sel of selectors) for(const el of document.querySelectorAll(sel)){
      if(!visible(el))continue;
      const s=getComputedStyle(el),r=rect(el);
      const descendants=[...el.querySelectorAll('span,b,svg')].filter(visible).map(x=>({tag:x.tagName,text:(x.textContent||'').trim().slice(0,45),color:getComputedStyle(x).color,fill:getComputedStyle(x).fill,rect:rect(x),scrollWidth:x.scrollWidth,clientWidth:x.clientWidth}));
      data.push({sel,text:(el.textContent||'').trim().slice(0,65),color:s.color,bg:s.backgroundColor,gradient:s.backgroundImage,rect:r,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,descendants});
    }
    const dock=document.querySelector('.sm-sales-dock');
    const mainClock=document.querySelector('[data-sm-countdown-seconds]');
    const dockClock=document.querySelector('[data-sm-dock-countdown]');
    return {innerWidth,scrollWidth:document.documentElement.scrollWidth,items:data,dock: dock?{visible:visible(dock),rect:rect(dock)}:null,mainClock:mainClock?.textContent,dockClock:dockClock?.textContent,checkout:document.querySelector('.sm-offer-value-cta')?.getAttribute('href'),price:document.querySelector('.sm-offer-value-final strong')?.textContent,installments:document.querySelector('.sm-offer-value-installments')?.textContent,discount:document.querySelector('.sm-hero-offer-badge-v3 strong')?.textContent};
  },selectors);
  if(width===390){const geom=await page.evaluate(()=>{const sels=['.sm-offer-value-list--unified','.sm-offer-value-item','.sm-offer-value-price','.sm-offer-value-total--simple','.sm-offer-value-bridge','.sm-offer-value-checkout','.sm-offer-value-was--total','.sm-offer-clear-label','.sm-offer-value-final','.sm-offer-value-cta','.sm-side-rail','.sm-mobile-side-rail'];return sels.map(sel=>{const e=document.querySelector(sel);if(!e)return {sel,missing:true};const r=e.getBoundingClientRect(),cs=getComputedStyle(e);return {sel,x:Math.round(r.x),right:Math.round(r.right),width:Math.round(r.width),clientWidth:e.clientWidth,scrollWidth:e.scrollWidth,overflow:cs.overflow,display:cs.display}})});console.log('PREVIEW_OFFER_GEOMETRY '+JSON.stringify(geom));}
  const summary={width,scrollWidth:report.scrollWidth,overflow:report.scrollWidth-width,mainClock:report.mainClock,dockClock:report.dockClock,price:report.price,installments:report.installments,discount:report.discount,components:report.items.length};
  results.push(summary);
  if(report.scrollWidth>width+2) failures.push(width+': document horizontal overflow '+report.scrollWidth);
  if(width<=820){const geometry=await page.evaluate(()=>{const sels=['.sm-offer-value-list--unified','.sm-offer-value-bridge','.sm-offer-value-checkout','.sm-offer-value-cta','.sm-offer-value-bridge p'];return sels.map(sel=>{const e=document.querySelector(sel);if(!e)return {sel,missing:true};const r=e.getBoundingClientRect();return {sel,x:r.x,right:r.right,w:r.width}})});for(const g of geometry){if(g.missing||g.x< -2||g.right>width+2)failures.push(width+': clipped offer region '+JSON.stringify(g));}}
  if(report.price!=='57') failures.push(width+': price not R$57');
  if(!report.installments?.includes('12x de R$ 5,90')) failures.push(width+': installment mismatch');
  if(report.discount!=='70% OFF') failures.push(width+': discount mismatch');
  if(report.mainClock==='--') failures.push(width+': main countdown did not initialize');
  if(!report.checkout?.includes('pay.hotmart.com/A92093667Q')) failures.push(width+': checkout link changed');
  for(const item of report.items){
    const {rect:r,sel}=item;
    if(r.x< -2 || r.right>width+2) failures.push(width+': '+sel+' outside viewport '+JSON.stringify(r));
    for(const child of item.descendants){
      if(child.rect.x<r.x-3||child.rect.right>r.right+3)failures.push(width+': '+sel+' nested '+child.tag+' outside button');
      if(child.clientWidth && child.scrollWidth>child.clientWidth+3)failures.push(width+': '+sel+' clipped child '+child.tag);
    }
    const fg=rgb(item.color),bg=rgb(item.bg);
    if(fg && bg && item.gradient==='none' && contrast(fg,bg)<3.0 && (sel.includes('bf-campaign')||sel.includes('badge'))) failures.push(width+': contrast low '+sel+' '+contrast(fg,bg).toFixed(2));
    if(sel==='.sm-bf-campaign-discount' && fg && bg && contrast(fg,bg)<4.5) failures.push(width+': campaign discount contrast low');
  }
  if(width===390||width===1440){
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.waitForTimeout(500);
    const name='hero-'+width;
    const buffer=await page.screenshot({path:'visual-artifacts/'+name+'.jpg',type:'jpeg',quality:48});
    if(width===390){
      console.log('SCREENSHOT_BEGIN '+name);
      console.log(buffer.toString('base64').match(/.{1,140}/g).join('\n'));
      console.log('SCREENSHOT_END '+name);
    }
    await page.locator('#oferta').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const offer='offer-'+width;
    const offerBuffer=await page.screenshot({path:'visual-artifacts/'+offer+'.jpg',type:'jpeg',quality:48});
    if(width===390){
      console.log('SCREENSHOT_BEGIN '+offer);
      console.log(offerBuffer.toString('base64').match(/.{1,140}/g).join('\n'));
      console.log('SCREENSHOT_END '+offer);
    }
  }
  console.log('VIEWPORT_AUDIT '+JSON.stringify(summary));
}
await page.close();
// The same checks on Production provide a baseline for any existing layout overflow.
const base=await browser.newPage({viewport:{width:390,height:844}});
await base.goto(production,{waitUntil:'domcontentloaded',timeout:60000});
await base.waitForTimeout(1000);
const baseline=await base.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
console.log('PRODUCTION_BASELINE '+JSON.stringify(baseline));
await base.locator('#oferta').scrollIntoViewIfNeeded();
await base.waitForTimeout(600);
const prodGeometry=await base.evaluate(()=>{const sels=['.sm-offer-value-list--unified','.sm-offer-value-item','.sm-offer-value-price','.sm-offer-value-total--simple','.sm-offer-value-bridge','.sm-offer-value-checkout','.sm-offer-value-was--total','.sm-offer-clear-label','.sm-offer-value-final','.sm-offer-value-cta'];return sels.map(sel=>{const e=document.querySelector(sel);if(!e)return {sel,missing:true};const r=e.getBoundingClientRect();return {sel,x:Math.round(r.x),right:Math.round(r.right),width:Math.round(r.width),clientWidth:e.clientWidth,scrollWidth:e.scrollWidth}})});console.log('PRODUCTION_OFFER_GEOMETRY '+JSON.stringify(prodGeometry));
const prodImage=await base.screenshot({path:'visual-artifacts/offer-production-390.jpg',type:'jpeg',quality:48});
console.log('SCREENSHOT_BEGIN offer-production-390');
console.log(prodImage.toString('base64').match(/.{1,140}/g).join('\n'));
console.log('SCREENSHOT_END offer-production-390');
await base.close();
const clock=await browser.newPage({viewport:{width:390,height:844}});
await clock.clock.install({time:new Date('2026-11-22T02:59:57Z')});
await clock.goto(preview,{waitUntil:'domcontentloaded',timeout:60000});
await clock.clock.runFor(800);
const before=await clock.locator('[data-sm-countdown-hours]').first().textContent();
const rangeBefore=await clock.locator('[data-sm-date-range]').first().textContent();
await clock.clock.runFor(5500);
const after=await clock.locator('[data-sm-countdown-hours]').first().textContent();
const rangeAfter=await clock.locator('[data-sm-date-range]').first().textContent();
console.log('MIDNIGHT_AUDIT '+JSON.stringify({before,after,rangeBefore,rangeAfter}));
if(before!=='00')failures.push('midnight before incorrect '+before);
if(after!=='23')failures.push('midnight after incorrect '+after);
if(rangeBefore===rangeAfter)failures.push('midnight date range did not change');
await clock.close();
await browser.close();
fs.writeFileSync('visual-artifacts/report.json',JSON.stringify({results,baseline,midnight:{before,after,rangeBefore,rangeAfter},failures},null,2));
console.log('VISUAL_AUDIT_RESULT '+JSON.stringify({passed:failures.length===0,failures,results,baseline}));
if(failures.length)process.exitCode=1;
