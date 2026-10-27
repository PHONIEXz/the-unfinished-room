import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {SVGRenderer} from 'three/addons/renderers/SVGRenderer.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
export async function showRadio(host){
 let renderer,controls,observer,model,disposed=false,software=false;const scene=new THREE.Scene();
 const status=document.createElement('p');status.setAttribute('role','status');status.textContent='Loading 3D radio…';host.append(status);
 const disposeModel=object=>object?.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();});
 const clean=()=>{disposed=true;observer?.disconnect();controls?.dispose();disposeModel(model);renderer?.dispose?.();host.replaceChildren();};
 try{
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch{renderer=new SVGRenderer();renderer.setPrecision(2);software=true;}renderer.setPixelRatio?.(Math.min(devicePixelRatio,1.5));renderer.setClearColor(new THREE.Color(0x172530),1);
  renderer.domElement.setAttribute('aria-label','3D radio. Drag to rotate or use the controls below.');renderer.domElement.setAttribute('role','img');
  const camera=new THREE.PerspectiveCamera(40,1,.01,100);camera.position.set(0,.3,3.3);
  controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.minDistance=1.5;controls.maxDistance=6;controls.enableDamping=false;
  const render=()=>{if(!disposed)renderer.render(scene,camera);};controls.addEventListener('change',render);
  scene.add(new THREE.HemisphereLight(0xffe3b1,0x344558,3));const key=new THREE.DirectionalLight(0xffd399,4);key.position.set(3,4,5);scene.add(key);
  host.append(renderer.domElement);const toolbar=document.createElement('div');toolbar.className='preview-tools';
  const button=(label,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>{fn();controls.update();render();};toolbar.append(b);};
  button('Rotate left',()=>controls.object.position.applyAxisAngle(new THREE.Vector3(0,1,0),-.3));button('Rotate right',()=>controls.object.position.applyAxisAngle(new THREE.Vector3(0,1,0),.3));button('Zoom in',()=>camera.position.multiplyScalar(Math.max(.8,1.5/camera.position.length())));button('Zoom out',()=>camera.position.multiplyScalar(Math.min(1.2,6/camera.position.length())));button('Reset view',()=>{camera.position.set(0,.3,3.3);controls.target.set(0,0,0);});host.append(toolbar);
  observer=new ResizeObserver(()=>{if(disposed)return;const w=host.clientWidth||300;renderer.setSize(w,260);camera.aspect=w/260;camera.updateProjectionMatrix();render();});observer.observe(host);
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();status.textContent='3D unavailable. The illustration and archive text remain below.';});
  const gltf=await new GLTFLoader().loadAsync('/assets/vintage-radio.glb');if(disposed){disposeModel(gltf.scene);return clean;}model=gltf.scene;
  const box=new THREE.Box3().setFromObject(model);const size=box.getSize(new THREE.Vector3());const center=box.getCenter(new THREE.Vector3());const scale=2/Math.max(size.x,size.y,size.z);model.position.copy(center).multiplyScalar(-scale);model.scale.setScalar(scale);scene.add(model);
  // One deliberately neutral material: this free export has no texture maps.
  model.traverse(o=>{if(o.isMesh){for(const m of Array.isArray(o.material)?o.material:[o.material])m?.dispose();o.material=software?new THREE.MeshLambertMaterial({color:0x987956}):new THREE.MeshStandardMaterial({color:0x987956,roughness:.85,metalness:.05});}});
  status.textContent='Drag to rotate. Untextured Meshy model.'+(software?' Compatibility rendering is active.':'');render();
  const credit=document.createElement('p');credit.className='model-credit';const link=document.createElement('a');link.href='/assets/radio-license.txt';link.textContent='Generated with Meshy · CC BY 4.0 · simplified geometry';credit.append(link);host.append(credit);
 }catch{if(!disposed){observer?.disconnect();controls?.dispose();disposeModel(model);renderer?.dispose?.();host.replaceChildren(status);status.textContent='3D preview unavailable on this device. The illustration and sources remain available.';}}
 return clean;
}
