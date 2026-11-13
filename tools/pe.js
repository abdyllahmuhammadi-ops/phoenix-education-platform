const { chromium } = require('playwright');
const N=process.env.NODE_MODULES_DIR||'./node_modules';
const map={'react.production.min.js':N+'/react/umd/react.production.min.js','react-dom.production.min.js':N+'/react-dom/umd/react-dom.production.min.js','babel.min.js':N+'/@babel/standalone/babel.min.js'};
(async()=>{const b=await chromium.launch();const ctx=await b.newContext();
await ctx.route('**/*',q=>{const u=q.request().url();for(const k in map)if(u.endsWith(k))return q.fulfill({path:map[k],contentType:'application/javascript'});if(u.startsWith('file:'))return q.continue();return q.abort();});
const p=await ctx.newPage();p.on('pageerror',e=>console.log(e.message.slice(0,400)));p.on('console',m=>{if(m.type()=='error')console.log(m.text().slice(0,400))});
await p.goto('file://'+(process.env.PHOENIX_INDEX||process.cwd()+'/index.html')+'');await p.waitForTimeout(12000);await b.close();})();
