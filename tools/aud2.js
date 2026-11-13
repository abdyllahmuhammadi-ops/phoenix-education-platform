const { chromium } = require('playwright');
const N=process.env.NODE_MODULES_DIR||'./node_modules';
const map={'react.production.min.js':N+'/react/umd/react.production.min.js','react-dom.production.min.js':N+'/react-dom/umd/react-dom.production.min.js','babel.min.js':N+'/@babel/standalone/babel.min.js'};
(async()=>{const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:390,height:900},locale:'fa-IR'});
await ctx.route('**/*',q=>{const u=q.request().url();for(const k in map)if(u.endsWith(k))return q.fulfill({path:map[k],contentType:'application/javascript'});if(u.startsWith('file:'))return q.continue();return q.abort();});
const p=await ctx.newPage();
await p.goto('file://'+(process.env.PHOENIX_INDEX||process.cwd()+'/index.html')+'');await p.waitForTimeout(11000);
for(const id of process.argv.slice(2)){
 await p.evaluate((id)=>{document.body.innerHTML='<div id="vt"></div>';ReactDOM.render(React.createElement(VLAB_COMPONENTS[id],{}),document.getElementById('vt'));},id);
 await p.waitForTimeout(300);
 const r=await p.evaluate(()=>{const o=[];document.querySelectorAll('#vt svg').forEach(svg=>{const R=svg.getBoundingClientRect();if(R.width<150)return;const ts=[...svg.querySelectorAll('text')].filter(t=>t.textContent.trim()).map(t=>({t:t.textContent.trim().slice(0,30),r:t.getBoundingClientRect()}));
 ts.forEach(a=>{if(a.r.left<R.left-1||a.r.right>R.right+1||a.r.top<R.top-1||a.r.bottom>R.bottom+1)o.push('CLIP '+a.t+' '+Math.round(a.r.left-R.left)+','+Math.round(a.r.top-R.top)+' w'+Math.round(a.r.width));});
 for(let i=0;i<ts.length;i++)for(let j=i+1;j<ts.length;j++){const a=ts[i].r,c=ts[j].r;const ox=Math.min(a.right,c.right)-Math.max(a.left,c.left),oy=Math.min(a.bottom,c.bottom)-Math.max(a.top,c.top);if(ox>4&&oy>3)o.push('OVL '+ts[i].t+' | '+ts[j].t);}});return o;});
 console.log(id,JSON.stringify(r));}
await b.close();})();
