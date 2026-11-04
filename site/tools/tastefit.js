const M={sweet:{e:-1,c:-.5,i:2,x:-.5},sour:{e:1.5,c:2,i:-.5,x:1.5},salty:{e:0,c:2,i:0,x:-2},bitter:{e:-.5,c:-2,i:-2,x:1},umami:{e:-.5,c:1,i:2,x:-1.5},spicy:{e:2.5,c:-.5,i:.5,x:2}};
const fs=require('fs');const s=fs.readFileSync('live/stripped.html','utf8');
const a=s.indexOf('window.PCP.ingredients = [');const b=s.indexOf('</script>',a);global.window={PCP:{}};eval(s.slice(a,b));
const T=JSON.parse(fs.readFileSync('tools/tastes.json','utf8'));
let err=0;
for(const ing of window.PCP.ingredients){const t=T[ing.id];if(!t){console.log('MISSING',ing.id);continue}
 const d={e:0,c:0,i:0,x:0};for(const k in t)for(const ax in d)d[ax]+=M[k][ax]*t[k];
 for(const ax in d)d[ax]=Math.max(-25,Math.min(25,Math.round(d[ax])));
 const o=ing.d;const diff=Math.sqrt(['e','c','i','x'].reduce((s,k)=>s+(o[k]-d[k])**2,0));err+=diff;
 console.log(ing.id.padEnd(20),JSON.stringify(t).padEnd(42),'orig',[o.e,o.c,o.i,o.x].join(','),'new',[d.e,d.c,d.i,d.x].join(','),diff.toFixed(0));}
console.log('mean diff',(err/28).toFixed(1));
