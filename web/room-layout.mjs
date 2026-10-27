import {shellSettings} from './shell.mjs';
export const surfaces=['floor','wall','desk','shelf','niche','ceiling'];
export function defaultSurface(kind){return kind==='pendant-lamp'?'ceiling':['photograph','frame','clock'].includes(kind)?'wall':['letter','radio','cup','notebook','key'].includes(kind)?'desk':'floor';}
const clamp=n=>Math.max(0,Math.min(100,n));
export function objectBounds(o,decor={}){const s=shellSettings(decor),dimensions={bed:[1.72,2.25,1.1],sofa:[1.85,.85,1.2],chair:[.9,.9,1.2],'dining-chair':[.8,.8,1.2],table:[1.2,.8,.8],'dining-table':[1.8,1.05,.9],cabinet:[1.4,.5,1.1],shelf:[.8,.4,1.8],tv:[1.35,.3,.8],rug:[1.8,1.2,.04],'floor-lamp':[.7,.7,1.95]}[o.kind]||[.7,.7,.75],scale=(o.size??100)/100,a=(o.rotation||0)*Math.PI/180;const px=(Math.abs(Math.cos(a))*dimensions[0]+Math.abs(Math.sin(a))*dimensions[1])*scale/2+.12,pz=(Math.abs(Math.sin(a))*dimensions[0]+Math.abs(Math.cos(a))*dimensions[1])*scale/2+.12;return {s,px,pz,objectHeight:dimensions[2]*scale,fit:Math.min(s.width/8,s.depth/6,1)};}
export function objectPosition(o,decor={}){const x=clamp(o.x??50)/100,y=clamp(o.y??50)/100,{s,px,pz,objectHeight,fit}=objectBounds(o,decor);switch(o.surface||defaultSurface(o.kind)){
 case 'ceiling':return {x:-s.width/2+px+x*(s.width-2*px),y:s.height-.35,z:-s.depth/2+pz+y*(s.depth-2*pz)};
 case 'wall':return {x:-s.width/2+px+x*(s.width-2*px),y:s.height-objectHeight-.12-y*Math.max(.02,s.height-objectHeight-.2),z:-s.depth/2+.22};
 case 'desk':return {x:(.65+x*1.55)*fit,y:1.14*fit,z:(-2.04+y*.6)*fit};
 case 'shelf':return {x:(-3.74+x*.57)*fit,y:(.26+(1-y)*1.8)*fit,z:.05*fit};
 case 'niche':return {x:(2.7+x*.6)*fit,y:Math.min(1.8,Math.min(s.height-objectHeight-.15,2.6)-.1)+(1-y)*Math.max(.1,Math.min(s.height-objectHeight-.15,2.6)-Math.min(1.8,Math.min(s.height-objectHeight-.15,2.6)-.1)),z:-s.depth/2+.25};
 default:return {x:-s.width/2+px+x*(s.width-2*px),y:.08,z:-s.depth/2+pz+y*(s.depth-2*pz)};
}}
export function positionFromWorld(o,p,decor={}){const surface=o.surface||defaultSurface(o.kind),{s,px,pz,objectHeight,fit}=objectBounds(o,decor);let x,y;switch(surface){case 'wall':x=(p.x+s.width/2-px)/(s.width-2*px);y=(s.height-objectHeight-.12-p.y)/Math.max(.02,s.height-objectHeight-.2);break;case 'desk':x=(p.x/fit-.65)/1.55;y=(p.z/fit+2.04)/.6;break;case 'shelf':x=(p.x/fit+3.74)/.57;y=1-(p.y/fit-.26)/1.8;break;case 'niche':x=(p.x/fit-2.7)/.6;y=1-(p.y-Math.min(1.8,Math.min(s.height-objectHeight-.15,2.6)-.1))/Math.max(.1,Math.min(s.height-objectHeight-.15,2.6)-Math.min(1.8,Math.min(s.height-objectHeight-.15,2.6)-.1));break;default:x=(p.x+s.width/2-px)/(s.width-2*px);y=(p.z+s.depth/2-pz)/(s.depth-2*pz);}return {x:clamp(x*100),y:clamp(y*100)};}
