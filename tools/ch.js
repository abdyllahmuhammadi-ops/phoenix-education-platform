const { chromium } = require('playwright');
const N=process.env.NODE_MODULES_DIR||'./node_modules';
const map={'react.production.min.js':N+'/react/umd/react.production.min.js','react-dom.production.min.js':N+'/react-dom/umd/react-dom.production.min.js','babel.min.js':N+'/@babel/standalone/babel.min.js'};
(async()=>{const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:390,height:900},locale:'fa-IR',deviceScaleFactor:2});
await ctx.route('**/*',q=>{const u=q.request().url();for(const k in map)if(u.endsWith(k))return q.fulfill({path:map[k],contentType:'application/javascript'});if(u.startsWith('file:'))return q.continue();return q.abort();});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,300)));
await p.goto('file://'+(process.env.PHOENIX_INDEX||process.cwd()+'/index.html')+'');await p.waitForTimeout(12000);
const ids=process.argv.slice(2);
for(const id of ids){await p.evaluate((id)=>{document.body.innerHTML='<div id="vt"></div>';ReactDOM.render(React.createElement(VLAB_COMPONENTS[id],{}),document.getElementById('vt'));},id);await p.waitForTimeout(700);await p.locator('#vt svg').first().screenshot({path:`vl/ch_${id}.png`});}
console.log(errs);await b.close();})();
