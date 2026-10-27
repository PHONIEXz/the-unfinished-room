import {defaultSurface} from './room-layout.mjs';
import {objectIllustration} from './interior.mjs';
import {prepareImage} from './images.mjs';
import {enableCamera} from './camera.mjs';
import {enablePlacement} from './placement.mjs';
import {decorateScene,decoratedObjects} from './decor.mjs';
import {slots,kinds,storageKey,readPersonal,savePersonal} from './personal.mjs';
const $=id=>document.getElementById(id);
let dirty=false,selectedId=null,threePreview=null;
const groups={Furniture:['chair','table','sofa','shelf','rug','lamp'],Memories:['photograph','letter','frame','keepsake','custom'],Study:['book','notebook','trophy'],Everyday:['plant','cup','vase','clock','key'],Music:['radio','record','guitar'],Travel:['camera','suitcase','ball']};
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
 const surface=field('3D placement surface','select','surface','');for(const name of ['floor','wall','desk','shelf','niche']){surface.append(Object.assign(document.createElement('option'),{value:name,textContent:name}));}surface.value=o.surface||defaultSurface(o.kind);
 const color=field('Artwork colour','input','color',o.color||'#6c5842');color.type='color';color.value=o.color||'#6c5842';const shape=field('Custom shape','select','shape','');for(const name of ['box','round','diamond']){const option=document.createElement('option');option.value=name;option.textContent=name;shape.append(option);}shape.value=o.shape||'box';
 const date=field('Memory date (optional, uncertain dates welcome)','input','date',o.date||'');date.maxLength=100;date.placeholder='Around 2001, exact date unknown';
 const sourceNote=field('Source note (optional)','textarea','sourceNote',o.sourceNote||'');sourceNote.maxLength=500;sourceNote.rows=2;sourceNote.placeholder='Who supplied this account? Where is the original?';
 card.roomImage=o.image||null;
 const photo=field('Photo (optional, up to 5 MB)','input','photo','');photo.type='file';photo.accept='image/png,image/jpeg,image/webp';
 const photoStatus=document.createElement('p');photoStatus.className='photo-status';photoStatus.setAttribute('role','status');photoStatus.textContent=o.image?'Photo attached. Stored only in this browser.':'PNG, JPEG or WebP. Images are resized and re-encoded locally.';card.append(photoStatus);
 const removePhoto=document.createElement('button');removePhoto.type='button';removePhoto.textContent='Remove photo';removePhoto.className='reset-appearance';removePhoto.hidden=!o.image;removePhoto.onclick=()=>{card.roomImage=null;removePhoto.hidden=true;photoStatus.textContent='Photo removed from this draft.';markDirty();};card.append(removePhoto);
 let photoVersion=0;photo.onchange=async()=>{const file=photo.files[0];if(!file)return;const version=++photoVersion;photoStatus.textContent='Preparing photo locally…';try{const image=await prepareImage(file);if(version!==photoVersion||!card.isConnected)return;card.roomImage=image;removePhoto.hidden=false;photoStatus.textContent='Photo attached. Save the room to keep it.';markDirty();}catch(error){photoStatus.textContent=error.message;}finally{photo.value='';}};
 const memory=field('Attach a memory','input','memory','');memory.type='checkbox';memory.checked=!o.decoration;
 const note=field('Memory or source description','textarea','text',text);note.maxLength=8000;note.rows=4;note.placeholder='What does this object mean to you? Include uncertain details as uncertain.';
 for(const [axis,label,min,max]of [['x','Horizontal position',0,100],['y','Vertical position',0,100]]){const input=field(label,'input',axis,o[axis]);input.type='range';input.min=min;input.max=max;}
 for(const [name,label,min,max,value]of [['rotation','Rotation (degrees)',-180,180,o.rotation??0],['size','Artwork size (%)',60,140,o.size??100]]){
  const input=field(label,'input',name,value);input.type='range';input.min=min;input.max=max;input.step=name==='rotation'?5:10;input.value=value;
  const output=document.createElement('output');output.textContent=String(value)+(name==='rotation'?'°':'%');input.after(output);input.addEventListener('input',()=>output.textContent=input.value+(name==='rotation'?'°':'%'));
 }
 const reset=document.createElement('button');reset.type='button';reset.textContent='Reset appearance';reset.className='reset-appearance';reset.onclick=()=>{for(const [name,value]of [['rotation',0],['size',100]]){const input=card.querySelector(`[data-field="${name}"]`);input.value=value;input.nextElementSibling.textContent=value+(name==='rotation'?'°':'%');}markDirty();};card.append(reset);
 const remove=document.createElement('button');remove.type='button';remove.className='remove-object';remove.textContent='Remove object';remove.onclick=()=>{if((title.value||note.value)&&!confirm('Remove this object from the draft? Your saved room stays unchanged until you save.'))return;card.remove();if(selectedId===o.id)selectedId=null;markDirty();$('add-object').focus();};card.append(remove);cards.append(card);
 preview();return title;
}
function fields(){return [...cards.children].map(card=>{const value=name=>card.querySelector(`[data-field="${name}"]`).value;return {id:card.dataset.id,title:value('title').trim(),text:value('text').trim(),kind:value('kind'),x:Number(value('x')),y:Number(value('y')),rotation:Number(value('rotation')),size:Number(value('size')),decoration:!card.querySelector('[data-field=memory]').checked,date:value('date'),sourceNote:value('sourceNote'),image:card.roomImage,color:value('color'),shape:value('shape'),surface:value('surface')};});}
function decor(){return {wallpaper:$('wallpaper').value,windows:Number($('window-count').value),furnishings:$('fixed-furnishings').checked,palette:$('palette').value,floor:$('floor').value,window:$('decor-window').checked,shelf:$('decor-shelf').checked,lamp:$('decor-lamp').checked,size:$('room-size').value,windowPosition:$('window-position').value,doorPosition:$('door-position').value,timeOfDay:$('time-of-day').value,alcove:$('decor-alcove').checked,fireplace:$('decor-fireplace').checked};}
function preview(){threePreview?.update({decor:decor(),objects:fields()});decorateScene($('room-preview'),{decor:decor(),objects:fields()},true);$('object-count').textContent=cards.children.length+' / 12 objects';$('add-object').disabled=cards.children.length>=12;paintSelection();}
function fill(a){$('room-name').value=a.title;$('fictional').checked=a.fictional;$('questions').value=a.openQuestions.join('\n');cards.replaceChildren();const d=a.decor||{palette:'midnight',floor:'wood',window:true,shelf:true,lamp:true};$('palette').value=d.palette;$('wallpaper').value=d.wallpaper||'plain';$('window-count').value=d.windows??1;$('fixed-furnishings').checked=d.furnishings!==false;$('floor').value=d.floor;$('room-size').value=d.size||'medium';$('window-position').value=d.windowPosition||'left';$('door-position').value=d.doorPosition||'left';$('time-of-day').value=d.timeOfDay||'dusk';$('decor-alcove').checked=d.alcove!==false;$('decor-fireplace').checked=d.fireplace!==false;for(const k of ['window','shelf','lamp'])$('decor-'+k).checked=d[k];for(const o of decoratedObjects(a))addObject(o,a.sources.find(s=>s.id===o.id)?.text||'');preview();}
function collect(){
 const sources=[],objects=[];
 for(const o of fields()){if(!o.title&&!o.text&&!o.image)continue;if(!o.title||(!o.decoration&&!o.text))throw Error('Name every object. Objects with Attach a memory selected also need memory text.');if(!o.decoration)sources.push({id:o.id,type:'text',title:o.title,text:o.text});const {text,...object}=o;objects.push({...object,sourceIds:o.decoration?[]:[o.id]});}
 return readPersonal({schemaVersion:8,decor:decor(),title:$('room-name').value,fictional:$('fictional').checked,sources,objects,openQuestions:$('questions').value.split('\n').map(q=>q.trim()).filter(Boolean)});
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

function paintSelection(){
 const panel=$('selected-object');if(!panel)return;panel.replaceChildren();
 const card=[...cards.children].find(c=>c.dataset.id===selectedId);
 if(!card){panel.textContent='Select an object in the room to edit it.';return;}
 const object=fields().find(o=>o.id===selectedId);const heading=document.createElement('strong');heading.textContent=object.title||'Untitled object';panel.append(heading);
 function action(label,fn){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=fn;panel.append(b);return b;}
 action('Edit object',()=>{const close=$('room-preview').closest('.room-camera').querySelector('button[aria-pressed=true]');if($('room-preview').closest('.room-camera').classList.contains('expanded'))$('room-preview').closest('.room-camera').querySelector('.camera-toolbar button:last-child').click();card.open=true;card.scrollIntoView({behavior:'instant',block:'center'});card.querySelector('[data-field=title]').focus();});
 action('Duplicate',()=>{if(cards.children.length>=12){status.textContent='This room supports up to 12 objects.';return;}const copy={...object,id:'object-'+crypto.randomUUID(),title:(object.title+' copy').slice(0,120),x:Math.min(85,object.x+5),y:Math.min(80,object.y+5)};addObject(copy,object.text);selectedId=copy.id;markDirty();});
 action('Bring forward',()=>{if(card.nextElementSibling)card.nextElementSibling.after(card);markDirty();});action('Send backward',()=>{if(card.previousElementSibling)card.previousElementSibling.before(card);markDirty();});
 action('Remove',()=>card.querySelector('.remove-object').click());
 for(const b of $('room-preview').querySelectorAll('.personal-object'))b.classList.toggle('selected',b.dataset.id===selectedId);
}
const inspector=document.createElement('section');inspector.id='selected-object';inspector.className='selected-object';inspector.setAttribute('aria-label','Selected object controls');$('room-preview').closest('.room-camera').querySelector('.room-controls-dock').append(inspector);paintSelection();
$('room-preview').addEventListener('click',e=>{const object=e.target.closest('.personal-object');if(!object)return;selectedId=object.dataset.id;paintSelection();});
function renderCatalogue(){const area=$('catalogue-items');area.replaceChildren();const query=$('catalogue-search').value.trim().toLowerCase(),category=$('catalogue-category').value;for(const [group,items]of Object.entries(groups)){if(category!=='All'&&category!==group)continue;for(const kind of items){if(!kind.includes(query))continue;const b=document.createElement('button');b.type='button';b.className='catalogue-tile';b.innerHTML=objectIllustration(kind);const label=document.createElement('span');label.textContent='+ '+kind;b.append(label);b.onclick=()=>{const id='object-'+crypto.randomUUID();addObject({id,title:kind[0].toUpperCase()+kind.slice(1),kind,x:35,y:40,decoration:true});selectedId=id;markDirty();};area.append(b);}}if(!area.children.length)area.textContent='No matching objects. Try another search or choose All.';}
$('catalogue-search').oninput=renderCatalogue;$('catalogue-category').onchange=renderCatalogue;renderCatalogue();

let styleBefore=null;
$('apply-style').onclick=()=>{styleBefore=decor();const presets={reading:{palette:'midnight',floor:'wood',wallpaper:'plain',time:'dusk'},warm:{palette:'cream',floor:'wood',wallpaper:'paper',time:'day'},music:{palette:'burgundy',floor:'tile',wallpaper:'stripe',time:'night'}};const preset=presets[$('room-style').value];for(const key of ['palette','floor','wallpaper'])$(key).value=preset[key];$('time-of-day').value=preset.time;$('undo-style').hidden=false;markDirty();};
$('undo-style').onclick=()=>{if(!styleBefore)return;for(const key of ['palette','floor','wallpaper'])$(key).value=styleBefore[key];$('time-of-day').value=styleBefore.timeOfDay;styleBefore=null;$('undo-style').hidden=true;markDirty();};

const illustrated=$('room-preview').closest('.room-camera');const viewChoice=document.createElement('div');viewChoice.className='room-view-choice';const toggle3d=document.createElement('button');toggle3d.type='button';toggle3d.textContent='Arrange in 3D';toggle3d.setAttribute('aria-pressed','false');viewChoice.append(toggle3d);const shellNote=document.createElement('p');shellNote.className='three-shell-note';shellNote.textContent='3D uses a fixed room outline. Use the illustrated editor for wallpaper and doorway changes; those choices stay saved.';viewChoice.append(shellNote);illustrated.before(viewChoice);const threeHost=document.createElement('section');threeHost.className='room3d';threeHost.hidden=true;illustrated.before(threeHost);let opening3d=false;
toggle3d.onclick=async()=>{if(opening3d)return;if(threePreview){threePreview();threePreview=null;threeHost.hidden=true;illustrated.hidden=false;toggle3d.textContent='Arrange in 3D';toggle3d.setAttribute('aria-pressed','false');return;}opening3d=true;toggle3d.disabled=true;try{const {mountRoom3D}=await import('/room-three.js');threeHost.hidden=false;illustrated.hidden=true;threePreview=mountRoom3D(threeHost,()=>{},{archive:{decor:decor(),objects:fields()},editing:true,onMood:patch=>{if('lamp'in patch)$('decor-lamp').checked=patch.lamp;if(patch.timeOfDay)$('time-of-day').value=patch.timeOfDay;markDirty();},onSelect:id=>{selectedId=id;paintSelection();},onChange:(id,patch)=>{const card=[...cards.children].find(c=>c.dataset.id===id);if(!card)return;for(const [key,value]of Object.entries(patch)){const input=card.querySelector(`[data-field="${key}"]`);if(input){input.value=String(value);if(input.nextElementSibling?.tagName==='OUTPUT')input.nextElementSibling.textContent=value+(key==='rotation'?'°':'%');}}markDirty();},onSave:()=>{try{save();return 'Saved on this browser. Download a backup for safekeeping.';}catch(error){status.textContent=error.message;return error.message;}}});toggle3d.textContent='Return to illustrated editor';toggle3d.setAttribute('aria-pressed','true');}catch{threeHost.hidden=true;illustrated.hidden=false;status.textContent='3D editor could not load. Your illustrated editor is available.';}finally{opening3d=false;toggle3d.disabled=false;}};
