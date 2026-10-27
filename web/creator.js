import {slots,storageKey,readPersonal,savePersonal} from './personal.mjs';
const $=id=>document.getElementById(id);
let dirty=false;
const status=$('save-status');
function fill(a){$('room-name').value=a.title;$('fictional').checked=a.fictional;$('questions').value=a.openQuestions.join('\n');for(const id of slots){const s=a.sources.find(s=>s.id===id);$(id+'-title').value=s?.title||'';$(id+'-text').value=s?.text||'';}}
function collect(){
 const sources=[],objects=[];
 for(const id of slots){const title=$(id+'-title').value.trim(),text=$(id+'-text').value.trim();if(!title&&!text)continue;if(!title||!text)throw Error('Each included object needs both a memory title and source text.');sources.push({id,type:'text',title,text});objects.push({id,title,sourceIds:[id]});}
 return readPersonal({schemaVersion:1,title:$('room-name').value,fictional:$('fictional').checked,sources,objects,openQuestions:$('questions').value.split('\n').map(q=>q.trim()).filter(Boolean)});
}
try{const saved=localStorage.getItem(storageKey);if(saved){fill(readPersonal(saved));status.textContent='Your saved room is loaded. Changes need saving.';}}catch{status.textContent='Saved data could not be loaded. You can restore a backup; saving a new room will replace the saved data.';}
$('creator-form').addEventListener('input',()=>{dirty=true;status.textContent='Unsaved changes. Save your room or download a backup.';});
function save(){const a=collect();try{savePersonal(localStorage,a);}catch{throw Error('Browser saving failed. Your draft is still here; download a backup to keep it.');}dirty=false;status.textContent='Saved on this browser. Download a backup for safekeeping.';return a;}
$('creator-form').addEventListener('submit',e=>{e.preventDefault();try{save();}catch(error){status.textContent=error.message;}});
$('explore-personal').addEventListener('click',()=>{try{save();location.href='/room/?personal=1';}catch(error){status.textContent=error.message;}});
$('export-room').addEventListener('click',()=>{try{const a=collect();const blob=new Blob([JSON.stringify(a,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`${a.title.replace(/[^a-z0-9]+/gi,'-').slice(0,60)||'memory-room'}-${Date.now()}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Backup download requested. Keep the file somewhere safe.';}catch(error){status.textContent=error.message;}});
$('restore-file').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>100000)throw Error('This file is too large. Choose a room backup under 100 KB.');const a=readPersonal(await file.text());if(dirty&&!confirm('Replace your unsaved editor changes with this backup? Your saved room will stay unchanged.'))return;fill(a);dirty=true;$('restore-status').textContent='Backup loaded into the editor. Review it, then save to replace your saved room.';status.textContent='Restored draft is not saved yet.';}catch(error){$('restore-status').textContent='Could not restore: '+error.message;}finally{e.target.value='';}});
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
