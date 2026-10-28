import {showcaseRoom} from './showcases.mjs';
import {storageKey,readPersonal} from './personal.mjs';
const exampleId=new URLSearchParams(location.search).get('example');
const personal=new URLSearchParams(location.search).get('personal')==='1';const main=document.querySelector('#keepsake');
const el=(tag,text)=>Object.assign(document.createElement(tag),{textContent:text});
try{
 const archive=exampleId?showcaseRoom(exampleId):personal?readPersonal(localStorage.getItem(storageKey)):await fetch('/reading-room.json').then(r=>{if(!r.ok)throw Error();return r.json();});
 document.title=archive.title+' | Memory keepsake';main.replaceChildren(el('p','THE UNFINISHED ROOM · MEMORY KEEPSAKE'),el('h1',archive.title),el('p',archive.fictional?'Fictional archive':'Personal archive · accounts recorded as supplied, not independently verified'));
 main.append(el('p','This keepsake includes all saved memories, source notes and open questions. Decorations have no implied story. Dates are recorded as supplied; approximate dates remain approximate.'));
 const list=document.createElement('ol');list.className='keepsake-list';
 for(const object of archive.objects){const item=document.createElement('li');item.append(el('h2',object.title));if(object.image){const img=document.createElement('img');img.src=object.image;img.alt=object.title;item.append(img);}if(object.date)item.append(el('p','Memory date: '+object.date));if(object.sourceNote)item.append(el('p','Source note: '+object.sourceNote));if(object.decoration)item.append(el('p','Decoration only. No memory attached.'));for(const id of object.sourceIds){const source=archive.sources.find(s=>s.id===id);item.append(el('h3','Source: '+source.title),el('p',source.text));}list.append(item);}main.append(list,el('h2','What remains unknown'));
 if(archive.openQuestions.length){const questions=document.createElement('ul');for(const q of archive.openQuestions)questions.append(el('li',q));main.append(questions);}else main.append(el('p','No open questions were recorded. This does not establish that every detail is known.'));
 main.append(el('p','Created by Paul Ayoade David · The Unfinished Room. Personal archives stay in this browser. Printed and exported copies contain your personal content.'));
 document.querySelector('.print-controls a').href=exampleId?'/room/?example='+encodeURIComponent(exampleId):personal?'/room/?personal=1':'/room/';
}catch{main.replaceChildren(el('h1','Saved room unavailable'),el('p','Save a valid room in the editor before opening its keepsake.'));document.querySelector('#print').disabled=true;}
document.querySelector('#print').onclick=()=>window.print();
