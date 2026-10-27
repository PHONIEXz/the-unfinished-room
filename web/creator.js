import {prepareImage} from './images.mjs';
import {enableCamera} from './camera.mjs';
import {enablePlacement} from './placement.mjs';
import {decorateScene,decoratedObjects} from './decor.mjs';
import {slots,kinds,storageKey,readPersonal,savePersonal} from './personal.mjs';
const $=id=>document.getElementById(id);
let dirty=false;
const status=$('save-status');
const cards=$('memory-cards');
function markDirty(){dirty=true;status.textContent='Unsaved changes. Save your room or download a backup.';preview();}
function addObject(o={id:'object-'+crypto.randomUUID(),title:'',kind:'keepsake',x:35,y:35},text=''){
 if(cards.children.length>=12){status.textContent='This room supports up to 12 objects.';return;}
 const card=document.createElement('details');card.open=!o.title;card.className='memory-card';card.dataset.id=o.id;
 const legend=document.createElement('summary');legend.textContent=o.title||'New object';card.append(legend);
 function field(label,tag,name,value){const l=document.createElement('label');l.textContent=label;const input=document.createElement(tag);input.dataset.field=name;input.value=value;l.append(input);card.append(l);return input;}
 const title=field('Object name','input','title',o.title);title.maxLength=120;title.placeholder='Your chair, a festival outfit, a favourite book…';
 title.addEventListener('input',()=>legend.textContent=title.value.trim()||'New object');
 const kind=field('Appearance','select','kind','');for(const [key,icon]of Object.entries(kinds)){const option=document.createElement('option');option.value=key;option.textContent=icon+' '+key;kind.append(option);}kind.value=o.kind;
 const date=field('Memory date (optional, uncertain dates welcome)','input','date',o.date||'');date.maxLength=100;date.placeholder='Around 2001, exact date unknown';
 const sourceNote=field('Source note (optional)','textarea','sourceNote',o.sourceNote||'');sourceNote.maxLength=500;sourceNote.rows=2;sourceNote.placeholder='Who supplied this account? Where is the original?';
 card.roomImage=o.image||null;
 const photo=field('Photo (optional, up to 5 MB)','input','photo','');photo.type='file';photo.accept='image/png,image/jpeg,image/webp';
 const photoStatus=document.createElement('p');photoStatus.className='photo-status';photoStatus.setAttribute('role','status');photoStatus.textContent=o.image?'Photo attached. Stored only in this browser.':'PNG, JPEG or WebP. Images are resized and re-encoded locally.';card.append(photoStatus);
 const removePhoto=document.createElement('button');removePhoto.type='button';removePhoto.textContent='Remove photo';removePhoto.className='reset-appearance';removePhoto.hidden=!o.image;removePhoto.onclick=()=>{card.roomImage=null;removePhoto.hidden=true;photoStatus.textContent='Photo removed from this draft.';markDirty();};card.append(removePhoto);
 let photoVersion=0;photo.onchange=async()=>{const file=photo.files[0];if(!file)return;const version=++photoVersion;photoStatus.textContent='Preparing photo locally…';try{const image=await prepareImage(file);if(version!==photoVersion||!card.isConnected)return;card.roomImage=image;removePhoto.hidden=false;photoStatus.textContent='Photo attached. Save the room to keep it.';markDirty();}catch(error){photoStatus.textContent=error.message;}finally{photo.value='';}};
 const note=field('Memory or source description','textarea','text',text);note.maxLength=8000;note.rows=4;note.placeholder='What does this object mean to you? Include uncertain details as uncertain.';
 for(const [axis,label,min,max]of [['x','Horizontal position',0,100],['y','Vertical position',0,100]]){const input=field(label,'input',axis,o[axis]);input.type='range';input.min=min;input.max=max;}
 for(const [name,label,min,max,value]of [['rotation','Rotation (degrees)',-180,180,o.rotation??0],['size','Artwork size (%)',60,140,o.size??100]]){
  const input=field(label,'input',name,value);input.type='range';input.min=min;input.max=max;input.step=name==='rotation'?5:10;input.value=value;
  const output=document.createElement('output');output.textContent=String(value)+(name==='rotation'?'°':'%');input.after(output);input.addEventListener('input',()=>output.textContent=input.value+(name==='rotation'?'°':'%'));
 }
 const reset=document.createElement('button');reset.type='button';reset.textContent='Reset appearance';reset.className='reset-appearance';reset.onclick=()=>{for(const [name,value]of [['rotation',0],['size',100]]){const input=card.querySelector(`[data-field="${name}"]`);input.value=value;input.nextElementSibling.textContent=value+(name==='rotation'?'°':'%');}markDirty();};card.append(reset);
 const remove=document.createElement('button');remove.type='button';remove.className='remove-object';remove.textContent='Remove object';remove.onclick=()=>{if((title.value||note.value)&&!confirm('Remove this object from the draft? Your saved room stays unchanged until you save.'))return;card.remove();markDirty();$('add-object').focus();};card.append(remove);cards.append(card);
 preview();return title;
}
function fields(){return [...cards.children].map(card=>{const value=name=>card.querySelector(`[data-field="${name}"]`).value;return {id:card.dataset.id,title:value('title').trim(),text:value('text').trim(),kind:value('kind'),x:Number(value('x')),y:Number(value('y')),rotation:Number(value('rotation')),size:Number(value('size')),date:value('date'),sourceNote:value('sourceNote'),image:card.roomImage};});}
function decor(){return {palette:$('palette').value,floor:$('floor').value,window:$('decor-window').checked,shelf:$('decor-shelf').checked,lamp:$('decor-lamp').checked,size:$('room-size').value,windowPosition:$('window-position').value,doorPosition:$('door-position').value,timeOfDay:$('time-of-day').value,alcove:$('decor-alcove').checked,fireplace:$('decor-fireplace').checked};}
function preview(){decorateScene($('room-preview'),{decor:decor(),objects:fields()},true);$('object-count').textContent=cards.children.length+' / 12 objects';$('add-object').disabled=cards.children.length>=12;}
function fill(a){$('room-name').value=a.title;$('fictional').checked=a.fictional;$('questions').value=a.openQuestions.join('\n');cards.replaceChildren();const d=a.decor||{palette:'midnight',floor:'wood',window:true,shelf:true,lamp:true};$('palette').value=d.palette;$('floor').value=d.floor;$('room-size').value=d.size||'medium';$('window-position').value=d.windowPosition||'left';$('door-position').value=d.doorPosition||'left';$('time-of-day').value=d.timeOfDay||'dusk';$('decor-alcove').checked=d.alcove!==false;$('decor-fireplace').checked=d.fireplace!==false;for(const k of ['window','shelf','lamp'])$('decor-'+k).checked=d[k];for(const o of decoratedObjects(a))addObject(o,a.sources.find(s=>s.id===o.id)?.text||'');preview();}
function collect(){
 const sources=[],objects=[];
 for(const o of fields()){if(!o.title&&!o.text)continue;if(!o.title||!o.text)throw Error('Each included object needs a name and a memory or source description.');sources.push({id:o.id,type:'text',title:o.title,text:o.text});const {text,...object}=o;objects.push({...object,sourceIds:[o.id]});}
 return readPersonal({schemaVersion:5,decor:decor(),title:$('room-name').value,fictional:$('fictional').checked,sources,objects,openQuestions:$('questions').value.split('\n').map(q=>q.trim()).filter(Boolean)});
}
enablePlacement($('room-preview'),(id,position,cancelled)=>{
 const card=[...cards.children].find(c=>c.dataset.id===id);if(!card)return;
 for(const axis of ['x','y'])card.querySelector(`[data-field="${axis}"]`).value=String(Math.round(position[axis]));
 if(!cancelled)markDirty();else preview();
 [...$('room-preview').querySelectorAll('.personal-object')].find(b=>b.dataset.id===id)?.focus();
});
$('clean-preview').onclick=()=>{const panel=$('room-preview').closest('.room-meta');const clean=panel.classList.toggle('clean-preview');$('creator').classList.toggle('preview-only',clean);$('clean-preview').textContent=clean?'Show editing controls':'Hide editing controls';$('clean-preview').setAttribute('aria-pressed',String(clean));};
$('expand-objects').onclick=()=>{for(const c of cards.children)c.open=true;};
$('collapse-objects').onclick=()=>{for(const c of cards.children)c.open=false;};
$('add-object').onclick=()=>{const input=addObject();markDirty();input?.focus();};
try{const saved=localStorage.getItem(storageKey);if(saved){fill(readPersonal(saved));status.textContent='Your saved room is loaded. Changes need saving.';}}catch{status.textContent='Saved data could not be loaded. You can restore a backup; saving a new room will replace the saved data.';}
if(!cards.children.length)addObject();
enableCamera($('room-preview'),{editing:true});
$('creator-form').addEventListener('input',markDirty);
function save(){const a=collect();try{savePersonal(localStorage,a);}catch{throw Error('Browser saving failed. Your draft is still here; download a backup to keep it.');}dirty=false;status.textContent='Saved on this browser. Download a backup for safekeeping.';return a;}
$('creator-form').addEventListener('submit',e=>{e.preventDefault();try{save();}catch(error){status.textContent=error.message;}});
$('explore-personal').addEventListener('click',()=>{try{save();location.href='/room/?personal=1';}catch(error){status.textContent=error.message;}});
$('export-room').addEventListener('click',()=>{try{const a=collect();const blob=new Blob([JSON.stringify(a,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`${a.title.replace(/[^a-z0-9]+/gi,'-').slice(0,60)||'memory-room'}-${Date.now()}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Backup download requested. Keep the file somewhere safe.';}catch(error){status.textContent=error.message;}});
$('restore-file').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>3000000)throw Error('This file is too large. Choose a room backup under 3 MB.');const a=readPersonal(await file.text());if(dirty&&!confirm('Replace your unsaved editor changes with this backup? Your saved room will stay unchanged.'))return;fill(a);dirty=true;$('restore-status').textContent='Backup loaded into the editor. Review it, then save to replace your saved room.';status.textContent='Restored draft is not saved yet.';}catch(error){$('restore-status').textContent='Could not restore: '+error.message;}finally{e.target.value='';}});
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
