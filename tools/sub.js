const { chromium } = require('playwright');
const N=process.env.NODE_MODULES_DIR||'./node_modules';
const map={'react.production.min.js':N+'/react/umd/react.production.min.js','react-dom.production.min.js':N+'/react-dom/umd/react-dom.production.min.js','babel.min.js':N+'/@babel/standalone/babel.min.js'};
const jobs=JSON.parse(process.argv[2]); // [[id,[btn texts],outname]]
(async()=>{const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:390,height:900},locale:'fa-IR'});
await ctx.route('**/*',q=>{const u=q.request().url();for(const k in map)if(u.endsWith(k))return q.fulfill({path:map[k],contentType:'application/javascript'});if(u.startsWith('file:'))return q.continue();return q.abort();});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));
await p.goto('file://'+(process.env.PHOENIX_INDEX||process.cwd()+'/index.html')+'');await p.waitForTimeout(12000);
for(const [id,btns,out] of jobs){await p.evaluate((id)=>{document.body.innerHTML='<div id="vt"></div>';ReactDOM.render(React.createElement(VLAB_COMPONENTS[id],{}),document.getElementById('vt'));},id);await p.waitForTimeout(500);
for(const t of btns){await p.locator('#vt button',{hasText:t}).first().click();await p.waitForTimeout(300);}
await p.waitForTimeout(600);await p.locator('#vt').screenshot({path:`vl/${out}.png`});}
console.log(errs);await b.close();})();
