export const storageKey='unfinished-room-personal-v1';
export const kinds={photograph:'▧',letter:'✉',radio:'▣',clock:'◷',frame:'◇',book:'▤',plant:'♧',chair:'▱',table:'▰',keepsake:'✧',custom:'○'};
export const palettes={midnight:['#24323c','#17252d','#705039'],cream:['#c7bda8','#e5dbc6','#8c624c'],burgundy:['#583e48','#302631','#b48665'],lagoon:['#35625e','#1b393c','#9b7753']};
export const slots=['photograph','letter','radio','clock','frame'];
export function readPersonal(value){
 const a=typeof value==='string'?JSON.parse(value):value;
 if(!a||![1,2].includes(a.schemaVersion)||typeof a.title!=='string'||!a.title.trim()||a.title.length>120||typeof a.fictional!=='boolean') throw Error('This is not a supported room backup.');
 if(!Array.isArray(a.sources)||!a.sources.length||a.sources.length>12||!Array.isArray(a.objects)||a.objects.length!==a.sources.length) throw Error('A room needs one to twelve memories.');
 const ids=new Set();
 const sources=a.sources.map(s=>{
  if(!s||(typeof s.id!=='string'||!/^([a-z][a-z0-9-]{0,59})$/.test(s.id))||ids.has(s.id)||s.type!=='text'||typeof s.title!=='string'||!s.title.trim()||s.title.length>120||typeof s.text!=='string'||!s.text.trim()||s.text.length>8000) throw Error('A memory has an invalid title, text, or object.');
  ids.add(s.id);return {id:s.id,type:'text',title:s.title.trim(),text:s.text.trim()};
 });
 const used=new Set();
 const objects=a.objects.map(o=>{
  if(!o||!ids.has(o.id)||used.has(o.id)||typeof o.title!=='string'||!o.title.trim()||o.title.length>120||!Array.isArray(o.sourceIds)||o.sourceIds.length!==1||o.sourceIds[0]!==o.id) throw Error('A room object has an invalid source link.');
  used.add(o.id);
  const base={id:o.id,title:o.title.trim(),sourceIds:[o.id]};
  if(a.schemaVersion===1)return base;
  if(!Object.hasOwn(kinds,o.kind)||!Number.isFinite(o.x)||o.x<0||o.x>100||!Number.isFinite(o.y)||o.y<0||o.y>100)throw Error('An object has an invalid appearance or position.');
  return {...base,kind:o.kind,x:o.x,y:o.y};
 });
 if(!Array.isArray(a.openQuestions)||a.openQuestions.length>20||a.openQuestions.some(q=>typeof q!=='string'||!q.trim()||q.length>300)) throw Error('Use up to 20 open questions, each under 300 characters.');
 let decor;
 if(a.schemaVersion===2){
  const d=a.decor;
  if(!d||!Object.hasOwn(palettes,d.palette)||!['wood','tile'].includes(d.floor)||['window','shelf','lamp'].some(k=>typeof d[k]!=='boolean'))throw Error('Room decoration is invalid.');
  decor={palette:d.palette,floor:d.floor,window:d.window,shelf:d.shelf,lamp:d.lamp};
 }
 return {...(decor?{decor}:{}),schemaVersion:a.schemaVersion,title:a.title.trim(),fictional:a.fictional,sources,objects,openQuestions:a.openQuestions.map(q=>q.trim())};
}
export function savePersonal(storage,archive){const clean=readPersonal(archive);storage.setItem(storageKey,JSON.stringify(clean));return clean;}
