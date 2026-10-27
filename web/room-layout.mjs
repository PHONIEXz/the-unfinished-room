export const surfaces=['floor','wall','desk','shelf','niche'];
export function defaultSurface(kind){return ['photograph','frame','clock'].includes(kind)?'wall':['letter','radio','cup','notebook','key'].includes(kind)?'desk':'floor';}
const clamp=(n)=>Math.max(0,Math.min(100,n));
export function objectPosition(o){const x=clamp(o.x??50)/100,y=clamp(o.y??50)/100;switch(o.surface||defaultSurface(o.kind)){
 case 'wall':return {x:-3.4+x*6.8,y:3.25-y*2.5,z:-2.78};
 case 'desk':return {x:.65+x*1.55,y:1.14,z:-2.04+y*.6};
 case 'shelf':return {x:-3.74+x*.57,y:.26+(1-y)*1.8,z:.05};
 case 'niche':return {x:2.7+x*.6,y:1.8+(1-y)*.8,z:-2.75};
 default:return {x:-3.35+x*6.7,y:.08,z:-2.3+y*4.7};
}}
export function positionFromWorld(o,p){const surface=o.surface||defaultSurface(o.kind);let x,y;switch(surface){case 'wall':x=(p.x+3.4)/6.8;y=(3.25-p.y)/2.5;break;case 'desk':x=(p.x-.65)/1.55;y=(p.z+2.04)/.6;break;case 'shelf':x=(p.x+3.74)/.57;y=1-(p.y-.26)/1.8;break;case 'niche':x=(p.x-2.7)/.6;y=1-(p.y-1.8)/.8;break;default:x=(p.x+3.35)/6.7;y=(p.z+2.3)/4.7;}return {x:clamp(x*100),y:clamp(y*100)};}
