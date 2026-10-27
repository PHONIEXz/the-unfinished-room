export function clampPosition(value,max=100){return Math.min(max,Math.max(0,value));}
export function dragPosition(start,delta,room,object){
 if(room.width<=0||room.height<=0)return {x:0,y:0};
 return {x:clampPosition((start.x+delta.x)/room.width*100,Math.max(0,(room.width-object.width)/room.width*100)),y:clampPosition((start.y+delta.y)/room.height*100,Math.max(0,(room.height-object.height)/room.height*100))};
}
export function enablePlacement(scene,onChange){
 let active=null;
 const roomRect=()=>{const r=scene.getBoundingClientRect();return {left:r.left+scene.clientLeft*r.width/scene.offsetWidth,top:r.top+scene.clientTop*r.height/scene.offsetHeight,width:scene.clientWidth*r.width/scene.offsetWidth,height:scene.clientHeight*r.height/scene.offsetHeight};};
 scene.addEventListener('pointerdown',e=>{
  const target=e.target.closest('.personal-object');if(!target||e.button!==0||active||scene.dataset.cameraMode==='pan')return;
  const room=roomRect(),object=target.getBoundingClientRect();
  active={target,id:target.dataset.id,pointer:e.pointerId,point:{x:e.clientX,y:e.clientY},start:{x:object.left-room.left,y:object.top-room.top},room,object,moved:false};
  target.setPointerCapture(e.pointerId);target.focus();e.preventDefault();
 });
 scene.addEventListener('pointermove',e=>{
  if(!active||e.pointerId!==active.pointer)return;
  const delta={x:e.clientX-active.point.x,y:e.clientY-active.point.y};
  if(Math.hypot(delta.x,delta.y)<4&&!active.moved)return;
  active.moved=true;active.position=dragPosition(active.start,delta,active.room,active.object);
  active.target.style.setProperty('--object-x',active.position.x+'%');active.target.style.setProperty('--object-y',active.position.y+'%');active.target.classList.add('dragging');
 });
 function finish(e,cancel=false){if(!active||e.pointerId!==active.pointer)return;const previous=active;active=null;previous.target.classList.remove('dragging');if(previous.target.hasPointerCapture(e.pointerId))previous.target.releasePointerCapture(e.pointerId);if(previous.moved&&!cancel)onChange(previous.id,previous.position);else if(previous.moved)onChange(previous.id,dragPosition(previous.start,{x:0,y:0},previous.room,previous.object),true);}
 scene.addEventListener('pointerup',e=>finish(e));scene.addEventListener('pointercancel',e=>finish(e,true));
 scene.addEventListener('keydown',e=>{
  const target=e.target.closest('.personal-object');if(scene.dataset.cameraMode==='pan')return;
  if(!target||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;
  e.preventDefault();const room=roomRect(),object=target.getBoundingClientRect(),step=e.shiftKey?30:8;
  const position=dragPosition({x:object.left-room.left,y:object.top-room.top},{x:e.key==='ArrowLeft'?-step:e.key==='ArrowRight'?step:0,y:e.key==='ArrowUp'?-step:e.key==='ArrowDown'?step:0},room,object);
  onChange(target.dataset.id,position);
 });
}
