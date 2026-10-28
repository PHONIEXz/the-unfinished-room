import {defaultSurface,objectBounds,objectPosition} from './room-layout.mjs';
import {doorOpening,shellSettings,windowOpenings} from './shell.mjs';
const floorObject=o=>(o.surface||defaultSurface(o.kind))==='floor'&&o.kind!=='rug';
const box=(o,decor)=>{const p=objectPosition(o,decor),b=objectBounds(o,decor);return {x:p.x,z:p.z,px:b.px,pz:b.pz,y:p.y,h:b.objectHeight};};
const intersects=(a,b)=>Math.abs(a.x-b.x)<a.px+b.px-.001&&Math.abs(a.z-b.z)<a.pz+b.pz-.001;
function doorwayBox(decor){const s=shellSettings(decor),d=doorOpening(decor);return d?{x:(d.side==='left'?-1:1)*(s.width/2-.45),z:d.u,px:.55,pz:d.width/2+.15}:null;}
// Conservative axis-aligned footprints include a small gap. This is not a pathfinding simulation.
export function spacingIssues(objects,decor={}){
 const issues=[],door=doorwayBox(decor),floor=objects.map((o,index)=>({o,index})).filter(({o})=>floorObject(o));
 for(let i=0;i<floor.length;i++){const a=floor[i],ab=box(a.o,decor);if(door&&intersects(ab,door))issues.push({type:'doorway',indices:[a.index]});for(let j=0;j<i;j++){const b=floor[j];if(intersects(ab,box(b.o,decor)))issues.push({type:'overlap',indices:[b.index,a.index]});}}
 for(let i=0;i<objects.length;i++){const a=objects[i];if((a.surface||defaultSurface(a.kind))!=='wall')continue;const ab=box(a,decor);for(const w of windowOpenings(decor))if(Math.abs(ab.x-w.u)<ab.px+w.width/2&&ab.y<w.bottom+w.height&&ab.y+ab.h>w.bottom){issues.push({type:'window',indices:[i]});break;}for(let j=0;j<i;j++){const b=objects[j];if((b.surface||defaultSurface(b.kind))!=='wall')continue;const bb=box(b,decor);if(Math.abs(ab.x-bb.x)<ab.px+bb.px&&ab.y<bb.y+bb.h&&ab.y+ab.h>bb.y)issues.push({type:'wall-overlap',indices:[j,i]});}}
 return issues;
}
export function spaceFurniture(objects,decor={}){
 const result=objects.map(o=>({...o})),placed=[],door=doorwayBox(decor),moved=[];
 const order=result.map((o,i)=>({o,i})).filter(({o})=>floorObject(o)).sort((a,b)=>{const x=box(a.o,decor),y=box(b.o,decor);return y.px*y.pz-x.px*x.pz||a.i-b.i;});
 for(const {o,i}of order){const fits=c=>{const b=box(c,decor);return (!door||!intersects(b,door))&&placed.every(p=>!intersects(b,p));};let next=o;if(!fits(o)){const candidates=[];for(let x=0;x<=100;x+=5)for(let y=0;y<=100;y+=5)candidates.push({...o,x,y});const original=objectPosition(o,decor);candidates.sort((a,b)=>{const p=objectPosition(a,decor),q=objectPosition(b,decor);return (p.x-original.x)**2+(p.z-original.z)**2-((q.x-original.x)**2+(q.z-original.z)**2);});next=candidates.find(fits)||o;if(next!==o){result[i]=next;moved.push(i);}}placed.push(box(next,decor));}
 return {objects:result,moved,issues:spacingIssues(result,decor)};
}
export function spacingMessages(issues,objects){const name=i=>objects[i].title||objects[i].kind.replaceAll('-',' ');return issues.map(issue=>issue.type==='doorway'?`${name(issue.indices[0])} blocks the doorway clearance.`:issue.type==='window'?`${name(issue.indices[0])} crosses a window opening.`:`${issue.indices.map(name).join(' and ')} overlap${issue.type==='wall-overlap'?' on the wall':''}.`);}
