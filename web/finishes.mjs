import {shellSettings} from './shell.mjs';
// Finite capabilities shared by the renderer, backups, AI boundary and result report.
export const wallFinishes=['plaster','brick','wallpaper'];
export const floorFinishes=['wood','tile','marble'];
export const objectFinishes=['auto','wood','fabric','metal'];
export const wallColours={midnight:'#52636d',cream:'#b6ac98',burgundy:'#72525e',lagoon:'#50736d'};
export function finishProperties(finish){return finish==='metal'?{roughness:.28,metalness:.72}:finish==='fabric'?{roughness:.98,metalness:0}:finish==='wood'?{roughness:.68,metalness:0}:{roughness:.82,metalness:0};}
const label=s=>s==='tv'?'TV':s.replaceAll('-',' ');
export function arrangementReport(description,room){
 const d=room.decor,shell=shellSettings(d),objects=room.objects,created=[],substituted=[],unavailable=[];
 const counts=new Map();for(const o of objects)counts.set(o.kind,(counts.get(o.kind)||0)+1);
 for(const [kind,count]of counts)created.push(`${count} × ${label(kind)}`);
 created.push(`${shell.width} × ${shell.depth} × ${shell.height} m room`,`${shell.windows} back-wall window${shell.windows===1?'':'s'}; ${shell.windowPosition} position`,shell.doorPosition==='none'?'No doorway':`${shell.doorPosition} doorway at ${shell.doorOffset}% along the side wall`);
 created.push(`${d.wallFinish||'plaster'} walls in ${d.wallColor||wallColours[d.palette]||wallColours.midnight}`,`${d.floor==='marble'?'Marble-style':d.floor==='tile'?'Tiled':'Wood'} floor`,`${d.timeOfDay} window light; room lamp ${d.lamp?'on':'off'}`);
 for(const finish of objectFinishes.filter(f=>f!=='auto')){const count=objects.filter(o=>o.finish===finish).length;if(count)created.push(`${finish} finish on ${count} object${count===1?'':'s'}`);}
 const brief=description.toLowerCase();
 const negated=index=>/\b(?:no|without|exclude|avoid|not)(?:\s+(?:any|a|an|new|extra))?\s*$/.test(brief.slice(Math.max(0,index-35),index));
 const excluded=pattern=>[...brief.matchAll(new RegExp(pattern.source,'g'))].some(match=>negated(match.index));
 const finishSummary=[...new Set(objects.map(o=>o.finish||'auto'))].map(f=>f==='auto'?'original':f).join(' / ')+' finishes';
 const requested=pattern=>[...brief.matchAll(new RegExp(pattern.source,'g'))].some(match=>!negated(match.index));
 const checks=[[/\b(?:wood|oak) (?:floor|flooring)\b/,'Wood flooring',d.floor==='wood',`${d.floor} floor`],[/\bplaster\b/,'Plaster walls',(d.wallFinish||'plaster')==='plaster',`${d.wallFinish||'plaster'} walls`],[/\bmarble\b/,'Marble flooring',d.floor==='marble',`${d.floor} floor`],[/\b(?:brick|brickwork)\b/,'Brick walls',d.wallFinish==='brick',`${d.wallFinish||'plaster'} walls`],[/\bwallpaper\b/,'Wallpaper',d.wallFinish==='wallpaper',`${d.wallFinish||'plaster'} walls`],[/\b(?:velvet|fabric|textile)\b/,'Fabric upholstery',objects.some(o=>o.finish==='fabric'),finishSummary],[/\b(?:metal|gold|chrome|steel)\b/,'Metal finish',objects.some(o=>o.finish==='metal'),finishSummary]];
 for(const [pattern,wanted,matched,actual]of checks)if(requested(pattern)&&!matched)substituted.push(`${wanted} requested; room uses ${actual}. You can change this with the finish controls.`);
 if(requested(/\bvelvet\b/)&&objects.some(o=>o.finish==='fabric'))substituted.push('Velvet is approximated by the fabric finish; individual fibres are not simulated.');
 if(requested(/\b(?:chrome|gold)\b/)&&objects.some(o=>o.finish==='metal'))substituted.push('Gold/chrome is approximated by tinted metal shading, without mirror reflections.');
 const quantities=[...brief.matchAll(/\b(one|two|three|four|five|six|[1-9]|1[0-2])\s+(?:dining\s+)?(sofas?|chairs?|beds?|plants?|cabinets?)\b/g)].filter(match=>!negated(match.index));
 const requestedObjects=[[/\b(?:reading lamp|floor lamp)\b/,'floor lamp',['floor-lamp','lamp']],[/\bbookshel(?:f|ves)\b/,'bookshelf',['shelf']],[/\bbeds?\b/,'bed',['bed']],[/\bsofas?\b/,'sofa',['sofa']],[/\bdining (?:table|set)\b/,'dining table',['dining-table']],[/\bchairs?\b/,'chair',['chair','dining-chair']],[/\b(?:tv|television)\b/,'TV',['tv']],[/\bcabinets?\b/,'cabinet',['cabinet']],[/\bplants?\b/,'plant',['plant']],[/\bpendant\b/,'pendant lamp',['pendant-lamp']]];
 for(const [pattern,wanted,kinds]of requestedObjects){if(excluded(pattern)&&objects.some(o=>kinds.includes(o.kind)))unavailable.push(`${wanted} excluded in the brief but still present. Remove it manually if appropriate; AI preserves existing objects.`);if(requested(pattern)&&!objects.some(o=>kinds.includes(o.kind))&&!quantities.some(match=>match[2].replace(/s$/,'')===wanted.toLowerCase()))unavailable.push(`${wanted} requested but not included in this room. It is available in the catalogue.`);}
 const numbers={one:1,two:2,three:3,four:4,five:5,six:6};for(const match of quantities){const wanted=numbers[match[1]]||Number(match[1]),kind=match[2].replace(/s$/,''),actual=objects.filter(o=>o.kind===kind||kind==='chair'&&o.kind==='dining-chair').length;if(!negated(match.index)&&actual<wanted)unavailable.push(`${wanted} ${match[2]} requested; ${actual} included. Adjust the catalogue objects before saving.`);}
 const limits=[[/\b(?:photorealistic|ultra.realistic|8k|ray.trac\w*|global illumination)\b/,'Photorealistic/8K output, ray tracing and global illumination are not available.'],[/\b(?:tatami|hologra\w*|neon|floating furniture)\b/,'Tatami, holograms, neon effects and floating furniture are not available.'],[/\b(?:bay window|floor.to.ceiling|panoramic|city view|curved architecture|steel beams|multi.room|multiple rooms)\b/,'Bay/floor-to-ceiling windows, exterior views, curved walls, beams and multi-room layouts are not available.'],[/\b(?:volumetric|dust particles)\b/,'Volumetric light and animated dust are not available in the 3D viewer.']];
 for(const [pattern,message]of limits)if(requested(pattern))unavailable.push(message);
 return {created,substituted,unavailable,note:'Created using this website’s catalogue, finish and lighting controls. Materials are stylized approximations. Request checks cover common listed features, not every possible instruction. Review the preview and walking space.'};
}
