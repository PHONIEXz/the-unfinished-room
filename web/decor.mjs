import {mountInterior,applyInteriorSettings,objectIllustration} from './interior.mjs';
import {kinds,palettes} from './personal.mjs';
export function decoratedObjects(archive){return archive.objects.map((o,i)=>({...o,kind:o.kind|| (Object.hasOwn(kinds,o.id)?o.id:'keepsake'),x:o.x??[42,48,67,26,8][i%5],y:o.y??[14,66,43,43,66][i%5]}));}
export function decorateScene(scene,archive,preview=false){
 const decor=archive.decor||{palette:'midnight',floor:'wood',window:true,shelf:true,lamp:true};
 if(!scene.classList.contains('interior'))mountInterior(scene,{controls:false});
 applyInteriorSettings(scene,decor);
 const colors=palettes[decor.palette];
 scene.classList.add('personal-scene');
 scene.style.setProperty('--wall-top',colors[0]);scene.style.setProperty('--wall-bottom',colors[1]);scene.style.setProperty('--floor-color',colors[2]);
 scene.dataset.floor=decor.floor;
 for(const kind of ['window','shelf','lamp'])scene.querySelector('.'+kind)?.toggleAttribute('hidden',!decor[kind]);
 scene.querySelectorAll('.object').forEach(b=>b.remove());
 for(const o of decoratedObjects(archive)){
  const b=document.createElement('button');b.className='object personal-object';b.dataset.id=o.id;b.type='button';b.style.setProperty('--object-x',o.x+'%');b.style.setProperty('--object-y',o.y+'%');if(preview){b.setAttribute('aria-label','Move '+(o.title||'untitled object')+'. Drag or use arrow keys.');}
  const icon=document.createElement('span');icon.className='object-icon decor-icon icon-'+o.kind;if(['photograph','letter','radio','clock','frame'].includes(o.kind))icon.innerHTML=objectIllustration(o.kind);else icon.textContent=kinds[o.kind];icon.setAttribute('aria-hidden','true');
  const label=document.createElement('span');label.textContent=o.title||'Untitled object';b.append(icon,label);scene.append(b);
 }
}
