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
const widths = [320, 360, 390, 430, 768, 1024, 1440];
const selectors = ['.sm-dh-header-cta','.sm-dh-primary','.sm-mh-cta','.sm-offer-value-cta','.sm-dock-checkout','.sm-dock-whatsapp','.sm-hero-offer-badge-v3 strong','.sm-hero-offer-badge-v3 span','.sm-black47-strip>strong','.sm-black47-strip>span:last-child'];

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
      const descendants=[...el.querySelectorAll('span,b,svg')].filter(visible).map(x=>({tag:x.tagName,text:(x.textContent||'').trim().slice(0,45),color:getComputedStyle(x).color,bg:getComputedStyle(x).backgroundColor,fill:getComputedStyle(x).fill,rect:rect(x),scrollWidth:x.scrollWidth,clientWidth:x.clientWidth}));
      data.push({sel,text:(el.textContent||'').trim().slice(0,65),color:s.color,bg:s.backgroundColor,gradient:s.backgroundImage,rect:r,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,descendants});
    }
    const dock=document.querySelector('.sm-sales-dock');
    const mainClock=document.querySelector('[data-sm-countdown-seconds]');
    const dockClock=document.querySelector('[data-sm-dock-countdown]');
    return {innerWidth,scrollWidth:document.documentElement.scrollWidth,items:data,dock: dock?{visible:visible(dock),rect:rect(dock)}:null,mainClock:mainClock?.textContent,dockClock:dockClock?.textContent,checkout:document.querySelector('.sm-offer-value-cta')?.getAttribute('href'),price:document.querySelector('.sm-offer-value-final strong')?.textContent,installments:document.querySelector('.sm-offer-value-installments')?.textContent,discount:document.querySelector('.sm-hero-offer-badge-v3 strong')?.textContent};
  },selectors);
  const campaignCopy=await page.evaluate(()=>[...document.querySelectorAll('.sm-offer-clear-label,.sm-offer-clear-today,.sm-dock-urgency')].map(e=>e.textContent.trim()).join(' | '));
  if(/RENOVA|CICLO ATUAL/i.test(campaignCopy))failures.push(width+': internal countdown wording exposed '+campaignCopy);
  if(!campaignCopy.includes('TERMINA HOJE'))failures.push(width+': missing original urgency label '+campaignCopy);
  const themeCheck=await page.evaluate(()=>{const css=document.getElementById('sm-black47-art-direction')?.textContent||'';return {hasWarmPalette:/ffb46d|ffd19d|ffd09b|ffcf9d|ffceaa/i.test(css),hasLavender:css.includes('#c9b6ff')}});
  if(themeCheck.hasWarmPalette||!themeCheck.hasLavender)failures.push(width+': campaign palette regression '+JSON.stringify(themeCheck));
  if(width<=430){const firstLineAudit=await page.evaluate(()=>{const e=document.querySelector('.sm-mobile-hero .sm-mh-first-line');if(!e)return {missing:true};const r=e.getBoundingClientRect(),parent=e.closest('.sm-mh-title').getBoundingClientRect();return {x:r.x,right:r.right,parentX:parent.x,parentRight:parent.right,scrollWidth:e.scrollWidth,clientWidth:e.clientWidth}});console.log('MOBILE_FIRST_LINE_AUDIT '+JSON.stringify({width,firstLineAudit}));if(firstLineAudit.missing||firstLineAudit.x< -1||firstLineAudit.right>width+1||firstLineAudit.scrollWidth>firstLineAudit.clientWidth+2)failures.push(width+': first hero line clipped '+JSON.stringify(firstLineAudit));}
  if(width<=430){const titleAudit=await page.evaluate(()=>{const e=document.querySelector('.sm-mobile-hero .sm-mh-title-line-accent');if(!e)return {missing:true};return {clientWidth:e.clientWidth,scrollWidth:e.scrollWidth,text:e.textContent}});console.log('MOBILE_TITLE_AUDIT '+JSON.stringify({width,titleAudit}));if(titleAudit.missing||titleAudit.scrollWidth>titleAudit.clientWidth+2)failures.push(width+': mobile title text clipped '+JSON.stringify(titleAudit));}
  if(width<=430){const badgeAudit=await page.evaluate(()=>{const e=document.querySelector('.sm-mobile-hero .sm-hero-offer-badge-v3');if(!e)return {missing:true};const r=e.getBoundingClientRect(),parent=e.parentElement.getBoundingClientRect(),cs=getComputedStyle(e);return {x:r.x,right:r.right,parentX:parent.x,parentRight:parent.right,radius:cs.borderTopRightRadius,scrollWidth:e.scrollWidth,clientWidth:e.clientWidth}});console.log('MOBILE_BADGE_AUDIT '+JSON.stringify({width,badgeAudit}));if(badgeAudit.missing||badgeAudit.x< -1||badgeAudit.right>width+1||badgeAudit.right>badgeAudit.parentRight+2||badgeAudit.scrollWidth>badgeAudit.clientWidth+3)failures.push(width+': clipped mobile campaign badge '+JSON.stringify(badgeAudit));}
  if(width===390){const heroGeometry=await page.evaluate(()=>{const sels=['.sm-mh-title','.sm-mh-title-line-accent','.sm-mh-subtitle','.sm-mh-cta','.sm-hero-offer-badge-v3','.sm-black47-strip','.sm-sales-dock'];return sels.map(sel=>{const e=document.querySelector(sel);if(!e)return {sel,missing:true};const r=e.getBoundingClientRect(),cs=getComputedStyle(e);return {sel,x:Math.round(r.x),right:Math.round(r.right),width:Math.round(r.width),display:cs.display,visibility:cs.visibility}})});console.log('PREVIEW_HERO_GEOMETRY '+JSON.stringify(heroGeometry));}
  if(width===390){const geom=await page.evaluate(()=>{const sels=['.sm-offer-value-list--unified','.sm-offer-value-item','.sm-offer-value-price','.sm-offer-value-total--simple','.sm-offer-value-bridge','.sm-offer-value-checkout','.sm-offer-value-was--total','.sm-offer-clear-label','.sm-offer-value-final','.sm-offer-value-cta','.sm-side-rail','.sm-mobile-side-rail'];return sels.map(sel=>{const e=document.querySelector(sel);if(!e)return {sel,missing:true};const r=e.getBoundingClientRect(),cs=getComputedStyle(e);return {sel,x:Math.round(r.x),right:Math.round(r.right),width:Math.round(r.width),clientWidth:e.clientWidth,scrollWidth:e.scrollWidth,overflow:cs.overflow,display:cs.display}})});console.log('PREVIEW_OFFER_GEOMETRY '+JSON.stringify(geom));}
  const summary={width,scrollWidth:report.scrollWidth,overflow:report.scrollWidth-width,mainClock:report.mainClock,dockClock:report.dockClock,price:report.price,installments:report.installments,discount:report.discount,components:report.items.length};
  results.push(summary);
  if(width===390||width===1440)console.log('CTA_COMPUTED_STYLES '+JSON.stringify({width,items:report.items.map(({sel,text,color,bg,gradient,rect,descendants})=>({sel,text,color,bg,gradient,rect,descendants:descendants.map(x=>({tag:x.tag,text:x.text,color:x.color,fill:x.fill}))}))}));
  if(report.scrollWidth>width+2) failures.push(width+': document horizontal overflow '+report.scrollWidth);
  // The visible hero badge must fit inside its clipping parent. Previous tests missed this
  // because they queried the hidden desktop badge first and only checked document scrollWidth.
  const badgeGeometry=await page.evaluate(()=>{
    const mobile=window.matchMedia('(max-width:720px)').matches;
    const badge=document.querySelector((mobile?'.sm-mobile-hero ':'.sm-desktop-hero ')+'.sm-hero-offer-badge-v3');
    if(!badge)return {missing:true};
    const parent=badge.closest('.sm-mh-copy,.sm-dh-copy')||badge.parentElement;
    const b=badge.getBoundingClientRect(),p=parent.getBoundingClientRect(),cs=getComputedStyle(badge);
    const children=[...badge.children].map(el=>{const r=el.getBoundingClientRect();return {text:el.textContent?.trim(),x:r.x,right:r.right,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth}});
    return {mobile,viewport:innerWidth,badge:{x:b.x,right:b.right,width:b.width},parent:{x:p.x,right:p.right,width:p.width},borderRadius:cs.borderTopRightRadius,children};
  });
  if(badgeGeometry.missing)failures.push(width+': hero badge missing');
  else{
    console.log('HERO_BADGE_GEOMETRY '+JSON.stringify({width,...badgeGeometry}));
    if(badgeGeometry.badge.x<badgeGeometry.parent.x-2 || badgeGeometry.badge.right>badgeGeometry.parent.right+2)
      failures.push(width+': badge clipped by parent '+JSON.stringify(badgeGeometry));
    if(parseFloat(badgeGeometry.borderRadius)<12)failures.push(width+': badge right border not rounded');
    for(const child of badgeGeometry.children){
      if(child.x<badgeGeometry.badge.x-2||child.right>badgeGeometry.badge.right+2)
        failures.push(width+': badge label outside pill '+JSON.stringify(child));
      if(child.clientWidth&&child.scrollWidth>child.clientWidth+3)
        failures.push(width+': badge text clipped '+JSON.stringify(child));
    }
  }
  
  if(width<=820){const geometry=await page.evaluate(()=>{const sels=['.sm-offer-value-list--unified','.sm-offer-value-bridge','.sm-offer-value-checkout','.sm-offer-value-cta','.sm-offer-value-bridge p'];return sels.map(sel=>{const e=document.querySelector(sel);if(!e)return {sel,missing:true};const r=e.getBoundingClientRect();return {sel,x:r.x,right:r.right,w:r.width}})});for(const g of geometry){if(g.missing||g.x< -2||g.right>width+2)failures.push(width+': clipped offer region '+JSON.stringify(g));}}
  if(report.price!=='47') failures.push(width+': price not R$47');
  if(!report.installments?.includes('12x de R$ 4,86')) failures.push(width+': installment mismatch');
  if(report.discount!=='80% OFF') failures.push(width+': discount mismatch');
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
    if(item.sel==='.sm-hero-offer-badge-v3 strong' && fg && bg && contrast(fg,bg)<4.5) failures.push(width+': campaign discount contrast low');
    if(['.sm-dh-header-cta','.sm-dh-primary','.sm-mh-cta','.sm-offer-value-cta'].includes(item.sel)){
      const label=item.descendants.find(d=>d.tag==='SPAN');
      const labelColor=rgb(label?.color||item.color);
      const stops=[...item.gradient.matchAll(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g)].map(m=>[+m[1],+m[2],+m[3]]);
      for(const stop of stops)if(labelColor && contrast(labelColor,stop)<4.5)failures.push(width+': CTA label contrast '+item.sel+' '+contrast(labelColor,stop).toFixed(2));
      if(item.sel==='.sm-offer-value-cta'){
        const arrow=item.descendants.find(d=>d.tag==='B');
        const arrowColor=rgb(arrow?.color||'');
        const arrowBg=rgb(arrow?.bg||'');
        if(arrowColor&&arrowBg&&contrast(arrowColor,arrowBg)<4.5)failures.push(width+': CTA arrow-on-circle contrast '+item.sel);
        for(const stop of stops)if(arrowBg&&contrast(arrowBg,stop)<3)failures.push(width+': CTA arrow-circle contrast '+item.sel);
      }
    }
  }
  if(width===320||width===390||width===1024||width===1440){
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.waitForTimeout(500);
    const name='hero-'+width;
    const buffer=await page.screenshot({path:'visual-artifacts/'+name+'.jpg',type:'jpeg',quality:48});
    console.log('SCREENSHOT_BEGIN '+name);
    console.log(buffer.toString('base64').match(/.{1,140}/g).join('\n'));
    console.log('SCREENSHOT_END '+name);
    await page.locator('#oferta').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const offer='offer-'+width;
    const offerBuffer=await page.screenshot({path:'visual-artifacts/'+offer+'.jpg',type:'jpeg',quality:48});
    console.log('SCREENSHOT_BEGIN '+offer);
    console.log(offerBuffer.toString('base64').match(/.{1,140}/g).join('\n'));
    console.log('SCREENSHOT_END '+offer);
    await page.locator('.sm-offer-value-cta').scrollIntoViewIfNeeded();
    await page.waitForTimeout(350);
    const checkoutShot='checkout-'+width;
    const checkoutBuffer=await page.screenshot({path:'visual-artifacts/'+checkoutShot+'.jpg',type:'jpeg',quality:48});
    console.log('SCREENSHOT_BEGIN '+checkoutShot);
    console.log(checkoutBuffer.toString('base64').match(/.{1,140}/g).join('\n'));
    console.log('SCREENSHOT_END '+checkoutShot);
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
