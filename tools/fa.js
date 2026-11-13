const { chromium } = require('playwright');
const N=process.env.NODE_MODULES_DIR||'./node_modules';
const map={'react.production.min.js':N+'/react/umd/react.production.min.js','react-dom.production.min.js':N+'/react-dom/umd/react-dom.production.min.js','babel.min.js':N+'/@babel/standalone/babel.min.js'};
(async()=>{const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:390,height:900},locale:'fa-IR'});
await ctx.route('**/*',q=>{const u=q.request().url();for(const k in map)if(u.endsWith(k))return q.fulfill({path:map[k],contentType:'application/javascript'});if(u.startsWith('file:'))return q.continue();return q.abort();});
const p=await ctx.newPage();
await p.goto('file://'+(process.env.PHOENIX_INDEX||process.cwd()+'/index.html')+'');await p.waitForTimeout(12000);
const ids=await p.evaluate(()=>VLAB_EXPERIMENTS.map(e=>e.id));
const res=await p.evaluate(()=>{window.__log=[];const O=window.VlabFormulaCheck;if(typeof O!=='function')return 'noVFC';window.VlabFormulaCheck=function(props){window.__log.push({s:props.subst,a:props.answer,t:props.title,u:props.unit});return O(props);};return 'patched';});
console.log(res);
const out=[];let okc=0,seenAll=new Set();
function ev(sub){
  sub=sub.replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/٫/g,'.').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g,m=>{const mp={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-'};const n=[...m].map(c=>mp[c]).join('');return '**('+n+')';}).replace(/\babs\(/g,'Math.abs(').replace(/\bmin\(/g,'Math.min(').replace(/\barctan\(/g,'ARCTAN(').replace(/2π/g,'2*Math.PI');
  let mm=sub.match(/^\s*([0-9.]+)\s*×\s*([0-9.]+)\s*=\s*m₂\s*×\s*([0-9.]+)/);if(mm)return (+mm[1]*+mm[2])/(+mm[3]);
  sub=sub.replace(/\(([^()]*?)=\s*([0-9.eE-]+)\s*[A-Za-zµΩ]*\)/g,'($2)');
  let parts=sub.split('=');
  // آخرین قطعه "?" یا حاوی ?
  let k=parts.length-1; while(k>0 && !/[0-9]/.test(parts[k]) ) k--; // آخرین قطعه حاوی عدد (معمولاً قبل از ?)
  let expr=parts[k];
  if(/\?/.test(parts[parts.length-1]) && parts.length>=2){ expr=parts[parts.length-2]; }
  expr=expr.split(/[⇒→]/)[0].trim();
  expr=expr.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/\^/g,'**').replace(/√/g,'Math.sqrt').replace(/²/g,'**2').replace(/³/g,'**3');
  expr=expr.replace(/sin²\s*([0-9.]+)°/g,'(Math.sin($1*Math.PI/180)**2)').replace(/cos²\s*([0-9.]+)°/g,'(Math.cos($1*Math.PI/180)**2)');
  expr=expr.replace(/sin\s*\(([^)]*)°\)/g,'Math.sin(($1)*Math.PI/180)').replace(/cos\s*\(([^)]*)°\)/g,'Math.cos(($1)*Math.PI/180)').replace(/tan\s*\(([^)]*)°\)/g,'Math.tan(($1)*Math.PI/180)');
  expr=expr.replace(/sin\s*([0-9.]+)°/g,'Math.sin($1*Math.PI/180)').replace(/cos\s*([0-9.]+)°/g,'Math.cos($1*Math.PI/180)').replace(/tan\s*([0-9.]+)°/g,'Math.tan($1*Math.PI/180)');
  expr=expr.replace(/\blog₁₀|\blog/g,'Math.log10').replace(/\bln\b/g,'Math.log').replace(/\be\*\*\(/g,'Math.exp(').replace(/\be\*\*/g,'Math.exp(').replace(/π/g,'Math.PI');
  // حذف واحدها بعد از عدد
  expr=expr.replace(/(?<=[0-9)])\s*[A-Za-zΩµ°%]+(?![A-Za-z(])/g,(m)=>/^\s*E[0-9-]/.test(m)?m:'');
  expr=expr.replace(/\s+/g,' ');
  expr=expr.replace(/ARCTAN\(/g,'(180/Math.PI)*Math.atan(');
  if(/[^0-9+\-*\/().,\sEMathsqrtincogxpPIlgbAN]/.test(expr))return null;
  try{const v=Function('"use strict";return ('+expr+')')();return typeof v==='number'&&isFinite(v)?v:null;}catch(e){return null;}
}
for(const id of ids){
  for(let pass=0;pass<3;pass++){
    await p.evaluate(({id,pass})=>{try{ReactDOM.unmountComponentAtNode(document.getElementById('vt'));}catch(e){}window.__log=[];document.body.innerHTML='<div id="vt"></div>';ReactDOM.render(React.createElement(VLAB_COMPONENTS[id],{}),document.getElementById('vt'));},{id,pass});
    await p.waitForTimeout(120);
    if(pass>0){await p.evaluate((pass)=>{window.__log=[];const rs=[...document.querySelectorAll('#vt input[type=range]')];rs.forEach((r,i)=>{const mn=+r.min,mx=+r.max,st=+r.step||1;let t=(((i*37+pass*53)%100)/100);let v=mn+(mx-mn)*t;v=Math.round(v/st)*st;const ns=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;ns.call(r,String(v));r.dispatchEvent(new Event('input',{bubbles:true}));r.dispatchEvent(new Event('change',{bubbles:true}));});},pass);await p.waitForTimeout(150);}
    const log=await p.evaluate(()=>window.__log.slice(-30));
    const seen=new Set();
    for(const e of log){const k=e.s;if(seen.has(k))continue;seen.add(k);const v=ev(e.s);if(v===null){out.push({id,pass,t:e.t,s:e.s,a:e.a,st:'unparsed'});continue;}
      const a=e.a;const tol=Math.max(0.02*Math.abs(a),0.006);
      if(Math.abs(v-a)>tol)out.push({id,pass,t:e.t,s:e.s,a,v,st:'MISMATCH'});else {okc++;}}
  }
}
const mm=out.filter(x=>x.st==='MISMATCH'),un=out.filter(x=>x.st==='unparsed');
console.log('ok',okc,'mismatch',mm.length,'unparsed',un.length);
require('fs').writeFileSync('fa_out.json',JSON.stringify(out,null,1));
mm.slice(0,60).forEach(x=>console.log(x.id,'|',x.t,'|',x.s,'| ans',x.a,'| expr',x.v));
await b.close();})();
