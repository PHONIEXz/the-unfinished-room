import {validateShell,shellKeys} from './shell.mjs';
import {wallFinishes,floorFinishes,objectFinishes} from './finishes.mjs';
import {surfaces} from './room-layout.mjs';
import {validateImage} from './images.mjs';
export const storageKey='unfinished-room-personal-v1';
export const kinds={photograph:'▧',letter:'✉',radio:'▣',clock:'◷',frame:'◇',book:'▤',plant:'♧',chair:'▱',table:'▰',keepsake:'✧',custom:'○',lamp:'☼',sofa:'▱',rug:'▧',shelf:'▤',cup:'∪',vase:'♧',camera:'▣',suitcase:'▣',record:'◎',guitar:'♬',notebook:'▤',trophy:'♜',key:'⚿',ball:'◉',bed:'▰','dining-table':'▰','dining-chair':'▱',tv:'▣',cabinet:'▤','floor-lamp':'☼','pendant-lamp':'☼'};
export const palettes={midnight:['#24323c','#17252d','#705039'],cream:['#c7bda8','#e5dbc6','#8c624c'],burgundy:['#583e48','#302631','#b48665'],lagoon:['#35625e','#1b393c','#9b7753']};
export const slots=['photograph','letter','radio','clock','frame'];
export function readPersonal(value){
 const a=typeof value==='string'?JSON.parse(value):value;
 if(!a||![1,2,3,4,5,6,7,8,9,10].includes(a.schemaVersion)||typeof a.title!=='string'||!a.title.trim()||a.title.length>120||typeof a.fictional!=='boolean') throw Error('This is not a supported room backup.');
 if(!Array.isArray(a.sources)||a.sources.length>12||!Array.isArray(a.objects)||(a.schemaVersion<10&&!a.objects.length)||a.objects.length>12||(a.schemaVersion<6&&(!a.sources.length||a.objects.length!==a.sources.length))) throw Error('A room supports up to twelve objects.');
 const ids=new Set();
 const sources=a.sources.map(s=>{
  if(!s||(typeof s.id!=='string'||!/^([a-z][a-z0-9-]{0,59})$/.test(s.id))||ids.has(s.id)||s.type!=='text'||typeof s.title!=='string'||!s.title.trim()||s.title.length>120||typeof s.text!=='string'||!s.text.trim()||s.text.length>8000) throw Error('A memory has an invalid title, text, or object.');
  ids.add(s.id);return {id:s.id,type:'text',title:s.title.trim(),text:s.text.trim()};
 });
 const used=new Set();
 const objects=a.objects.map(o=>{
  if(a.schemaVersion>=6&&typeof o?.decoration!=='boolean')throw Error('Choose whether each object holds a memory.');
  const decoration=a.schemaVersion>=6&&o?.decoration===true;
  if(!o||typeof o.id!=='string'||!/^([a-z][a-z0-9-]{0,59})$/.test(o.id)||(!decoration&&!ids.has(o.id))||used.has(o.id)||typeof o.title!=='string'||!o.title.trim()||o.title.length>120||!Array.isArray(o.sourceIds)||(decoration?(o.sourceIds.length!==0||ids.has(o.id)):(o.sourceIds.length!==1||o.sourceIds[0]!==o.id))) throw Error('A room object has an invalid source link.');
  used.add(o.id);
  const base={id:o.id,title:o.title.trim(),sourceIds:decoration?[]:[o.id],...(a.schemaVersion>=6?{decoration}: {})};
  if(a.schemaVersion===1)return base;
  if(!Object.hasOwn(kinds,o.kind)||!Number.isFinite(o.x)||o.x<0||o.x>100||!Number.isFinite(o.y)||o.y<0||o.y>100)throw Error('An object has an invalid appearance or position.');
  const appearance={...base,kind:o.kind,x:o.x,y:o.y};
  if(a.schemaVersion>=4){
   if(!Number.isFinite(o.rotation)||o.rotation < -180||o.rotation>180||!Number.isFinite(o.size)||o.size<60||o.size>140)throw Error('Object size or rotation is invalid.');
   const transformed={...appearance,rotation:o.rotation,size:o.size};
   if(a.schemaVersion>=5){
    if(typeof o.date!=='string'||o.date.length>100||typeof o.sourceNote!=='string'||o.sourceNote.length>500)throw Error('Memory date or source note is too long.');
    const memory={...transformed,date:o.date.trim(),sourceNote:o.sourceNote.trim(),image:validateImage(o.image)};
    if(a.schemaVersion>=8){if(!surfaces.includes(o.surface))throw Error('Object surface is invalid.');memory.surface=o.surface;}
    if(a.schemaVersion>=7){if(!/^#[0-9a-f]{6}$/i.test(o.color)||!['box','round','diamond'].includes(o.shape))throw Error('Object colour or shape is invalid.');Object.assign(memory,{color:o.color,shape:o.shape});}if(a.schemaVersion>=9){if(!objectFinishes.includes(o.finish))throw Error('Object finish is invalid.');memory.finish=o.finish;}return memory;
   }
   return transformed;
  }
  return appearance;
 });
 if(sources.some(s=>!used.has(s.id)))throw Error('A source has no room object.');
 if(objects.reduce((sum,o)=>sum+(o.image?.length||0),0)>2400000)throw Error('Photos exceed the room storage budget. Remove a photo and try again.');
 if(!Array.isArray(a.openQuestions)||a.openQuestions.length>20||a.openQuestions.some(q=>typeof q!=='string'||!q.trim()||q.length>300)) throw Error('Use up to 20 open questions, each under 300 characters.');
 let decor;
 if(a.schemaVersion>=2){
  const d=a.decor;
  if(!d||!Object.hasOwn(palettes,d.palette)||!(a.schemaVersion>=9?floorFinishes:['wood','tile']).includes(d.floor)||['window','shelf','lamp'].some(k=>typeof d[k]!=='boolean'))throw Error('Room decoration is invalid.');
  decor={palette:d.palette,floor:d.floor,window:d.window,shelf:d.shelf,lamp:d.lamp};
  if(a.schemaVersion>=10){const shell=validateShell(Object.fromEntries(shellKeys.map(key=>[key,d[key]])));Object.assign(decor,shell);}
  if(a.schemaVersion>=9){if(!wallFinishes.includes(d.wallFinish)||!/^#[0-9a-f]{6}$/i.test(d.wallColor))throw Error('Wall finish or colour is invalid.');Object.assign(decor,{wallFinish:d.wallFinish,wallColor:d.wallColor});}
  if(a.schemaVersion>=3){
   if(!['compact','medium','wide'].includes(d.size)||!['left','center','right'].includes(d.windowPosition)||!['left','right','none'].includes(d.doorPosition)||!['dawn','day','dusk','night'].includes(d.timeOfDay)||typeof d.alcove!=='boolean'||typeof d.fireplace!=='boolean')throw Error('Room shell or lighting is invalid.');
   if(a.schemaVersion>=7){if(!['plain','stripe','paper'].includes(d.wallpaper)||![0,1,2].includes(d.windows)||typeof d.furnishings!=='boolean')throw Error('Room finishing options are invalid.');Object.assign(decor,{wallpaper:d.wallpaper,windows:d.windows,furnishings:d.furnishings});}
   Object.assign(decor,{size:d.size,windowPosition:d.windowPosition,doorPosition:d.doorPosition,timeOfDay:d.timeOfDay,alcove:d.alcove,fireplace:d.fireplace});
  }
 }
 return {...(decor?{decor}:{}),schemaVersion:a.schemaVersion,title:a.title.trim(),fictional:a.fictional,sources,objects,openQuestions:a.openQuestions.map(q=>q.trim())};
}
export function savePersonal(storage,archive){const clean=readPersonal(archive);storage.setItem(storageKey,JSON.stringify(clean));return clean;}
