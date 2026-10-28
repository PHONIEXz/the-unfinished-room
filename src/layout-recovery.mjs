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
