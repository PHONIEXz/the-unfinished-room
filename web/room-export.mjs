import {readPersonal} from './personal.mjs';
export const exportKey='unfinished-room-print-v1';
export function readRoomExport(raw){
 if(!raw||raw.length>7500000)throw Error('Room export is missing or too large.');
 const value=JSON.parse(raw);
 if(!value||typeof value.mode!=='string'||value.mode.length>100||!/^\/(create|room)\/(\?[^#]*)?$/.test(value.returnUrl))throw Error('Invalid room export.');
 const archive=value.archive===null?null:readPersonal(value.archive);
 if(value.image!==null&&(typeof value.image!=='string'||value.image.length>4500000||!/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(value.image)))throw Error('Invalid room image.');
 return {archive,image:value.image,returnUrl:value.returnUrl,mode:value.mode};
}
export async function openRoomKeepsake({archive=null,capture,returnUrl='/room/',mode='Saved room'}){
 // Open synchronously from the click so browsers can allow the new print tab.
 const tab=window.open('about:blank','_blank');
 if(!tab)throw Error('Allow a new tab for this site, then try exporting again.');
 try{
  const clean=archive===null?null:readPersonal(archive);
  let image=null;try{image=await capture?.()||null;}catch{/* Keepsake retries rendering locally. */}
  const payload=JSON.stringify({archive:clean,image,returnUrl,mode});readRoomExport(payload);
  tab.sessionStorage.setItem(exportKey,payload);tab.opener=null;tab.location.replace('/keepsake/?export=1');
 }catch(error){tab.close();throw Error(error.name==='QuotaExceededError'?'This export exceeds browser space. Remove a large photo or use the saved-room keepsake.':error.message);}
}
