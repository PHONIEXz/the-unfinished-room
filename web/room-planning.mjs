import {objectBounds,objectPosition,positionFromWorld} from './room-layout.mjs';
// Local relationship templates use the same furniture geometry as manual editing.
export function planRoom(objects,decor,roomType,brief=''){
 const result=objects.map(o=>({...o})),group=[],notes=[];
 if(/\b(?:keep|preserve) (?:the )?(?:exact |current )?(?:positions|layout)\b/i.test(brief))return {objects:result,groups:[],notes:['Kept requested object positions.']};
 const ids=kind=>result.map((o,i)=>({o,i})).filter(({o})=>o.kind===kind&&(o.surface||'floor')==='floor').map(({i})=>i);
 function put(i,x,z,rotation=0,size){if(i===undefined)return;const o=result[i];Object.assign(o,{rotation,...(size?{size}:{})});Object.assign(o,positionFromWorld(o,{x,z},decor));group.push(i);}
 function aim(i,x,z,tx,tz){put(i,x,z,Math.atan2(tx-x,tz-z)*180/Math.PI);}
 if(roomType==='dining room'){
  const table=ids('dining-table')[0]??ids('table')[0],chairs=[...ids('dining-chair'),...ids('chair')];
  if(table!==undefined&&chairs.length){const size=chairs.length>=6?140:chairs.length>=4?120:100;put(table,0,0,0,size);const b=objectBounds(result[table],decor);const count=chairs.length;
   if(count<=2)chairs.forEach((i,n)=>aim(i,0,(n?1:-1)*(b.pz+.62),0,0));
   else {const sides=count-2,top=Math.ceil(sides/2),bottom=Math.floor(sides/2);let next=0;for(const [n,sign]of [[top,-1],[bottom,1]])for(let k=0;k<n;k++)aim(chairs[next++],(k-(n-1)/2)*1.12,sign*(b.pz+.62),(k-(n-1)/2)*1.12,0);aim(chairs[next++],-b.px-.62,0,0,0);aim(chairs[next],b.px+.62,0,0,0);}
   notes.push('Dining chairs face the table; the table scales for the seating count.');
  }
 }else if(['living room','parlour'].includes(roomType)){
  const sofa=ids('sofa')[0],table=ids('table')[0];if(sofa!==undefined){put(sofa,0,-1.6);put(table,0,0);ids('chair').slice(0,2).forEach((i,n)=>aim(i,n?1.85:-1.85,.45,0,0));const tv=ids('tv')[0];put(tv,0,2,180);notes.push('Seating faces the coffee-table area, with the TV opposite the sofa.');}
 }else if(roomType==='bedroom'){
  const bed=ids('bed')[0];if(bed!==undefined){put(bed,0,-.6,0);put(ids('cabinet')[0],2,-.7);put(ids('floor-lamp')[0],-1.7,-1);notes.push('Bed headboard faces the back wall; storage sits beside the bed with a clear foot area.');}
 }else if(['reading room','study','music room'].includes(roomType)){
  const chair=ids('chair')[0];if(chair!==undefined){put(chair,0,.5,roomType==='study'?180:0);put(ids('floor-lamp')[0],-1.35,.1);put(ids('shelf')[0],1.5,-1);if(roomType==='study')put(ids('table')[0],0,-.85);notes.push(roomType==='study'?'Chair faces the desk; shelf and task light sit to the sides.':'Chair, shelf and lamp form a reading or listening corner.');}
 }
 return {objects:result,groups:group.length?[group]:[],notes};
}
