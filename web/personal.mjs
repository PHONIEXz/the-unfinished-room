export const storageKey='unfinished-room-personal-v1';
export const slots=['photograph','letter','radio','clock','frame'];
export function readPersonal(value){
 const a=typeof value==='string'?JSON.parse(value):value;
 if(!a||a.schemaVersion!==1||typeof a.title!=='string'||!a.title.trim()||a.title.length>120||typeof a.fictional!=='boolean') throw Error('This is not a supported room backup.');
 if(!Array.isArray(a.sources)||!a.sources.length||a.sources.length>5||!Array.isArray(a.objects)||a.objects.length!==a.sources.length) throw Error('A room needs one to five memories.');
 const ids=new Set();
 const sources=a.sources.map(s=>{
  if(!s||!slots.includes(s.id)||ids.has(s.id)||s.type!=='text'||typeof s.title!=='string'||!s.title.trim()||s.title.length>120||typeof s.text!=='string'||!s.text.trim()||s.text.length>8000) throw Error('A memory has an invalid title, text, or object.');
  ids.add(s.id);return {id:s.id,type:'text',title:s.title.trim(),text:s.text.trim()};
 });
 const used=new Set();
 const objects=a.objects.map(o=>{
  if(!o||!ids.has(o.id)||used.has(o.id)||typeof o.title!=='string'||!o.title.trim()||o.title.length>120||!Array.isArray(o.sourceIds)||o.sourceIds.length!==1||o.sourceIds[0]!==o.id) throw Error('A room object has an invalid source link.');
  used.add(o.id);return {id:o.id,title:o.title.trim(),sourceIds:[o.id]};
 });
 if(!Array.isArray(a.openQuestions)||a.openQuestions.length>20||a.openQuestions.some(q=>typeof q!=='string'||!q.trim()||q.length>300)) throw Error('Use up to 20 open questions, each under 300 characters.');
 return {schemaVersion:1,title:a.title.trim(),fictional:a.fictional,sources,objects,openQuestions:a.openQuestions.map(q=>q.trim())};
}
export function savePersonal(storage,archive){const clean=readPersonal(archive);storage.setItem(storageKey,JSON.stringify(clean));return clean;}
