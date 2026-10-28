import {showcaseRoom} from './showcases.mjs';
import {storageKey,readPersonal} from './personal.mjs';
import {exportKey,readRoomExport} from './room-export.mjs';
const params=new URLSearchParams(location.search),exampleId=params.get('example');
const personal=params.get('personal')==='1',main=document.querySelector('#keepsake'),print=document.querySelector('#print');
const el=(tag,text)=>Object.assign(document.createElement(tag),{textContent:text});
print.disabled=true;
try{
 const transfer=params.get('export')==='1'?readRoomExport(sessionStorage.getItem(exportKey)):null;
 const archive=transfer?.archive||(exampleId?showcaseRoom(exampleId):personal?readPersonal(localStorage.getItem(storageKey)):await fetch('/reading-room.json').then(r=>{if(!r.ok)throw Error();return r.json();}));
 document.title=archive.title+' - Room keepsake';
 const cover=el('section','');cover.className='keepsake-cover';
 cover.append(el('p','THE UNFINISHED ROOM · ROOM KEEPSAKE'),el('h1',archive.title),el('p',archive.fictional?'Fictional archive':'Personal archive · accounts recorded as supplied, not independently verified'));
 cover.append(el('p',(transfer?.mode||'Saved room')+' · '+new Date().toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'})));
 const figure=el('figure','');figure.className='keepsake-room-image';const image=el('img','');image.alt='3D view of '+archive.title;const caption=el('figcaption','Preparing a room image locally…');caption.setAttribute('role','status');figure.append(image,caption);cover.append(figure);
 const count=archive.objects.length,memories=archive.objects.filter(o=>!o.decoration).length;
 cover.append(el('p',`${count} objects · ${memories} with memories · ${count-memories} decorations · ${archive.openQuestions.length} open questions`));
 if(archive.decor){const d=archive.decor;cover.append(el('p',`Room: ${d.width||8} × ${d.depth||6} m · ${d.wallFinish||'plaster'} walls · ${d.floor||'wood'} floor · ${d.timeOfDay||'dusk'} lighting`));}
 main.replaceChildren(cover);
 main.append(el('h2','Inside this room'),el('p','All recorded objects are listed below. Decorations have no implied story. Dates are recorded as supplied; approximate dates remain approximate.'));
 const list=el('ol','');list.className='keepsake-list';
 for(const object of archive.objects){
  const item=el('li','');item.append(el('h2',object.title));
  if(object.kind)item.append(el('p',[object.kind.replaceAll('-',' '),object.surface?object.surface+' placement':null,object.finish&&object.finish!=='auto'?object.finish+' finish':null].filter(Boolean).join(' · ')));
  if(object.image){const photo=el('img','');photo.src=object.image;photo.alt=object.title;item.append(photo);}
  if(object.date)item.append(el('p','Memory date: '+object.date));if(object.sourceNote)item.append(el('p','Source note: '+object.sourceNote));
  if(object.decoration)item.append(el('p','Decoration only. No memory attached.'));
  for(const id of object.sourceIds){const source=archive.sources.find(s=>s.id===id);if(source)item.append(el('h3','Source: '+source.title),el('p',source.text));}
  list.append(item);
 }
 main.append(list,el('h2','What remains unknown'));
 if(archive.openQuestions.length){const questions=el('ul','');for(const q of archive.openQuestions)questions.append(el('li',q));main.append(questions);}else main.append(el('p','No open questions were recorded. This does not establish that every detail is known.'));
 main.append(el('p','Created by Paul Ayoade David · The Unfinished Room. Personal archives stay in this browser. Printed and exported copies contain your personal content. A PDF is a viewing copy; use a JSON backup to restore an editable room.'));
 document.querySelector('.print-controls a').href=transfer?.returnUrl||(exampleId?'/room/?example='+encodeURIComponent(exampleId):personal?'/room/?personal=1':'/room/');
 async function prepareImage(){
  let host=null,dispose=null;
  try{
   let data=transfer?.image;
   if(!data){const {mountRoom3D}=await import('/room-three.js');host=el('div','');host.className='room3d keepsake-capture-stage';host.setAttribute('aria-hidden','true');document.body.append(host);dispose=mountRoom3D(host,()=>{},{archive:archive.decor?archive:null});await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));if(!dispose.captureImage)throw Error();data=await dispose.captureImage();}
   image.src=data;await image.decode();caption.textContent=transfer?.image?'Captured from the room view at export. Controls and markers are omitted.':'Room overview, generated from this archive. Controls and markers are omitted.';
  }catch{image.hidden=true;caption.textContent='Room image could not be prepared on this device. Return to the room and retry, or print the details below.';}
  finally{dispose?.();host?.remove();await Promise.all([...main.querySelectorAll('img')].map(img=>img.decode().catch(()=>{})));print.disabled=false;}
 }
 await prepareImage();
}catch{main.replaceChildren(el('h1','Room unavailable'),el('p','Open a room and export again, or save a valid room in the editor before opening its keepsake.'));}
print.onclick=()=>window.print();
