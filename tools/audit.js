const { chromium } = require('playwright');
const N=process.env.NODE_MODULES_DIR||'./node_modules';
const map={'react.production.min.js':N+'/react/umd/react.production.min.js','react-dom.production.min.js':N+'/react-dom/umd/react-dom.production.min.js','babel.min.js':N+'/@babel/standalone/babel.min.js'};
(async()=>{const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:390,height:900},locale:'fa-IR'});
await ctx.route('**/*',q=>{const u=q.request().url();for(const k in map)if(u.endsWith(k))return q.fulfill({path:map[k],contentType:'application/javascript'});if(u.startsWith('file:'))return q.continue();return q.abort();});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,200)));
await p.goto('file://'+(process.env.PHOENIX_INDEX||process.cwd()+'/index.html')+'');await p.waitForTimeout(11000);
const ids=await p.evaluate(()=>Object.keys(VLAB_COMPONENTS));
console.log('labs',ids.length);
const out=[];
for(const id of ids){
 try{
 await p.evaluate((id)=>{document.body.innerHTML='<div id="vt" style="background:#fbf7ec;padding:8px"></div>';ReactDOM.render(React.createElement(VLAB_COMPONENTS[id],{}),document.getElementById('vt'));},id);
 await p.waitForTimeout(250);
 const r=await p.evaluate(()=>{
  const res={clip:[],over:[],ovl:0};
  document.querySelectorAll('#vt svg').forEach((svg,si)=>{
   const R=svg.getBoundingClientRect(); if(R.width<150)return;
   const ts=[...svg.querySelectorAll('text')].filter(t=>t.textContent.trim());
   const bs=ts.map(t=>({t:t.textContent.trim().slice(0,22),r:t.getBoundingClientRect()}));
   bs.forEach(o=>{ if(o.r.width>0&&(o.r.left<R.left-1||o.r.right>R.right+1||o.r.top<R.top-1||o.r.bottom>R.bottom+1)) res.clip.push(o.t);});
   for(let i=0;i<bs.length;i++)for(let j=i+1;j<bs.length;j++){const a=bs[i].r,c=bs[j].r;if(!a.width||!c.width)continue;const ox=Math.min(a.right,c.right)-Math.max(a.left,c.left),oy=Math.min(a.bottom,c.bottom)-Math.max(a.top,c.top);if(ox>4&&oy>3&&ox*oy>0.35*Math.min(a.width*a.height,c.width*c.height))res.ovl++;}
  });
  if(document.documentElement.scrollWidth>392)res.over.push('page '+document.documentElement.scrollWidth);
  return res;});
  if(r.clip.length||r.over.length||r.ovl>0)out.push([id,r.clip.slice(0,4),r.over,r.ovl]);
 }catch(e){out.push([id,'ERR '+e.message.slice(0,80)]);}
}
console.log(JSON.stringify(out,null,0));console.log('ERRS',errs.slice(0,3));await b.close();})();
