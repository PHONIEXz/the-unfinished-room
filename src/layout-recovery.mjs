// Recover provider bookkeeping errors using only the user's original geometry.
// Never infer identities, invent coordinates, discard excess furniture or relax validation.
export function recoverLayout(raw,input){
 if(Array.isArray(raw)&&raw.length===1)raw=raw[0];
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||!Array.isArray(raw.objects)||!Array.isArray(raw.additions))return {raw,preserved:0,reclassified:0};
 const original=new Map(input.objects.map(o=>[o.id,o])),seen=new Set(),objects=[],additions=[...raw.additions];let preserved=0,reclassified=0;
 for(const object of raw.objects){
  if(object&&typeof object==='object'&&!Array.isArray(object)&&!Object.hasOwn(object,'id')){additions.push(object);reclassified++;}
  else {objects.push(object);if(object&&original.has(object.id))seen.add(object.id);}
 }
 for(const object of input.objects)if(!seen.has(object.id)){objects.push({...object});preserved++;}
 const cleanAdditions=additions.map(object=>{
  if(object&&typeof object==='object'&&!Array.isArray(object)&&typeof object.id==='string'&&!original.has(object.id)){
   const {id,...geometry}=object;reclassified++;return geometry;
  }
  return object;
 });
 return {raw:{...raw,objects,additions:cleanAdditions},preserved,reclassified};
}
// Explicit totals such as "with 6 dining chairs" include existing furniture.
// Never delete an existing object; remove only valid surplus additions.
export function limitRequestedAdditions(plan,description){
 const words={one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12};let trimmed=0;let additions=[...plan.additions];
 for(const match of description.toLowerCase().matchAll(/\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|1[0-2]|[1-9])\s+(dining\s+)?(chairs?|sofas?|beds?|plants?|cabinets?)\b/g)){
  const prefix=description.slice(Math.max(0,match.index-24),match.index).toLowerCase();if(/\b(?:add|additional|another|extra|no|without)\b/.test(prefix)||/\s+more\b/.test(description.slice(match.index+match[0].length,match.index+match[0].length+8)))continue;
  const count=words[match[1]]||Number(match[1]),kind=match[3].replace(/s$/,''),matches=o=>match[2]?o.kind==='dining-chair':o.kind===kind||kind==='chair'&&o.kind==='dining-chair';let available=Math.max(0,count-plan.objects.filter(matches).length);
  additions=additions.filter(o=>{if(!matches(o))return true;if(available-->0)return true;trimmed++;return false;});
 }
 return {plan:{...plan,additions},trimmed};
}
