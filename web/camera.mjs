export function boundCamera({scale,x,y},width,height){
 scale=Math.max(1,Math.min(2.4,scale));return {scale,x:Math.max(width*(1-scale),Math.min(0,x)),y:Math.max(height*(1-scale),Math.min(0,y))};
}
export function zoomCamera(state,scale,anchor,width,height){
 scale=Math.max(1,Math.min(2.4,scale));const ratio=scale/state.scale;
 return boundCamera({scale,x:anchor.x-(anchor.x-state.x)*ratio,y:anchor.y-(anchor.y-state.y)*ratio},width,height);
}
export function enableCamera(scene,{editing=false}={}){
 const stage=document.createElement('section');stage.className='room-camera';stage.setAttribute('aria-label','Room view controls');
 const toolbar=document.createElement('div');toolbar.className='camera-toolbar';
 const viewport=document.createElement('div');viewport.className='camera-viewport';viewport.tabIndex=0;viewport.setAttribute('aria-label','Room view. Plus and minus zoom, arrow keys pan, Home resets.');
 scene.before(stage);stage.append(toolbar,viewport);viewport.append(scene);
 let state={scale:1,x:0,y:0},pan=!editing,gesture=null,suppressClick=false,expanded=false;
 const size=()=>({width:viewport.clientWidth,height:viewport.clientHeight});
 function paint(smooth=false){const {width,height}=size();state=boundCamera(state,width,height);scene.style.transform=`translate(${state.x}px,${state.y}px) scale(${state.scale})`;scene.classList.toggle('camera-smooth',smooth);scene.dataset.cameraMode=pan?'pan':'objects';viewport.classList.toggle('pan-mode',pan);zoomLabel.textContent=Math.round(state.scale*100)+'%';}
 function button(label,action){const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',action);toolbar.append(b);return b;}
 const mode=editing?button('Move view',()=>{pan=!pan;mode.textContent=pan?'Move objects':'Move view';mode.setAttribute('aria-pressed',String(pan));paint();}):null;
 mode?.setAttribute('aria-pressed','false');
 const out=button('−',()=>zoom(state.scale-.2));out.setAttribute('aria-label','Zoom out');
 const zoomLabel=document.createElement('output');zoomLabel.setAttribute('aria-label','Zoom level');toolbar.append(zoomLabel);
 const plus=button('+',()=>zoom(state.scale+.2));plus.setAttribute('aria-label','Zoom in');
 button('Reset view',()=>{state={scale:1,x:0,y:0};paint(true);});
 const expand=button('Expand room',()=>{expanded=!expanded;stage.classList.toggle('expanded',expanded);expand.textContent=expanded?'Close expanded view':'Expand room';expand.setAttribute('aria-pressed',String(expanded));paint();});expand.setAttribute('aria-pressed','false');
 const help=document.createElement('p');help.className='camera-help';help.textContent=editing?'Drag objects to arrange. Choose Move view to pan after zooming.':'Select an object to read its memory. Zoom in, then drag the room background to look around.';stage.append(help);
 function zoom(scale){const {width,height}=size();state=zoomCamera(state,scale,{x:width/2,y:height/2},width,height);paint(true);}
 viewport.addEventListener('pointerdown',e=>{
  suppressClick=false;
  if(!pan||e.button!==0||gesture)return;
  if(!editing&&e.target.closest('button'))return;
  gesture={id:e.pointerId,x:e.clientX,y:e.clientY,original:{...state},moved:false};viewport.setPointerCapture(e.pointerId);viewport.classList.add('panning');e.preventDefault();e.stopPropagation();
 },true);
 viewport.addEventListener('pointermove',e=>{if(!gesture||gesture.id!==e.pointerId)return;const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;if(Math.hypot(dx,dy)>4)gesture.moved=true;state={...state,x:gesture.original.x+dx,y:gesture.original.y+dy};paint();});
 function finish(e,cancel=false){if(!gesture||gesture.id!==e.pointerId)return;const g=gesture;gesture=null;if(cancel){state=g.original;paint();}if(viewport.hasPointerCapture(e.pointerId))viewport.releasePointerCapture(e.pointerId);viewport.classList.remove('panning');suppressClick=g.moved;}
 viewport.addEventListener('pointerup',e=>finish(e));viewport.addEventListener('pointercancel',e=>finish(e,true));
 viewport.addEventListener('click',e=>{if(suppressClick){e.preventDefault();e.stopPropagation();suppressClick=false;}},true);
 viewport.addEventListener('keydown',e=>{
  if(e.target!==viewport&&!(pan&&editing))return;
  if(['+','=','-','Home','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();e.stopPropagation();const step=e.shiftKey?100:40;
   if(e.key==='+'||e.key==='=')zoom(state.scale+.2);else if(e.key==='-')zoom(state.scale-.2);else if(e.key==='Home'){state={scale:1,x:0,y:0};paint(true);}else{state.x+=e.key==='ArrowLeft'?step:e.key==='ArrowRight'?-step:0;state.y+=e.key==='ArrowUp'?step:e.key==='ArrowDown'?-step:0;paint(true);}
  }
 },true);
 stage.addEventListener('keydown',e=>{if(e.key==='Escape'&&expanded){expanded=false;stage.classList.remove('expanded');expand.textContent='Expand room';expand.setAttribute('aria-pressed','false');expand.focus();paint();}});
 new ResizeObserver(()=>paint()).observe(viewport);
 paint();return {reset:()=>{state={scale:1,x:0,y:0};paint(true);}};
}
