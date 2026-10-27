import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {SVGRenderer} from 'three/addons/renderers/SVGRenderer.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

// One original, coherent room. Geometry stays independent of archival source text.
export function buildMemoryRoom(){
 const root=new T.Group(),hotspots={},lampLights=[];
 const material=(color)=>new T.MeshLambertMaterial({color});
 const mats={wall:material('#657577'),edge:material('#c4b99e'),wood:material('#806345'),darkwood:material('#443b32'),cream:material('#d9cfb5'),fabric:material('#7f3e44'),blue:material('#496a75'),amber:material('#eabf7e'),green:material('#526752'),black:material('#202c32'),paper:material('#e7d8b6')};
 function box(w,h,d,x,y,z,mat,round=0,parent=root){const geo=round?new RoundedBoxGeometry(w,h,d,1,round,2):new T.BoxGeometry(w,h,d);const mesh=new T.Mesh(geo,mat);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 function cylinder(rt,rb,h,x,y,z,mat,parent=root){const mesh=new T.Mesh(new T.CylinderGeometry(rt,rb,h,16),mat);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 function shadow(x,z,sx,sz,opacity=.14){const m=new T.Mesh(new T.CircleGeometry(1,28),new T.MeshBasicMaterial({color:0x101923,transparent:true,opacity,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,.025,z);m.scale.set(sx,sz,1);root.add(m);}
 // Raised diorama base and separate worn floorboards.
 box(8.35,.24,6.35,0,-.16,0,mats.edge,.04);
 for(let x=0;x<20;x++){const m=material(x%3===0?'#937859':x%3===1?'#876b4d':'#9b8060');box(.394,.06,6,-3.8+x*.4,0,0,m);for(let k=0;k<3;k++)box(.008,.002,1.1,-3.92+x*.4+k*.07,.032,-1.8+k*1.7,mats.wood);}
 // Back wall with an actual window opening, jambs and a deep sill.
 box(3.2,3.7,.14,-2.4,1.86,-3,mats.wall);box(1.6,3.7,.14,3.2,1.86,-3,mats.wall);
 box(3.2,.85,.14,.8,.43,-3,mats.wall);box(3.2,.6,.14,.8,3.42,-3,mats.wall);
 const sky=material('#c6c8b4');box(3.12,2.25,.035,.8,1.97,-3.06,sky);
 for(const x of [-.8,.8,2.4])box(.065,2.35,.14,x,1.97,-2.95,mats.darkwood);
 box(3.25,.065,.14,.8,2.05,-2.95,mats.darkwood);box(3.4,.12,.35,.8,.88,-2.84,mats.cream);
 for(const x of [-1.03,2.65])for(let i=0;i<5;i++)cylinder(.045,.06,2.6,x+i*.055,2.02,-2.7,mats.cream);
 box(3.95,.04,.05,.8,3.38,-2.7,mats.darkwood);
 // Side wall has a doorway, not a painted rectangle.
 box(.14,3.7,2.4,-4,1.86,-1.8,mats.wall);box(.14,3.7,1.7,-4,1.86,2.15,mats.wall);box(.14,.7,1.9,-4,3.35,.35,mats.wall);
 box(.03,2.8,1.62,-4.06,1.43,.35,mats.black);
 for(const z of [-.56,1.26])box(.23,2.9,.09,-3.98,1.45,z,mats.darkwood);box(.23,.11,1.9,-3.98,2.94,.35,mats.darkwood);
 box(.05,.02,1.6,-3.86,.05,.35,mats.amber);
 box(8,.13,.18,0,.12,-2.87,mats.edge);box(.18,.13,2.4,-3.87,.12,-1.8,mats.edge);box(.18,.13,1.7,-3.87,.12,2.15,mats.edge);
 // Low, woven rug with a stitched border.
 box(4.9,.025,3.2,-.05,.055,.35,material('#9d9479'),.02);for(const x of [-2.35,2.25])box(.025,.008,2.95,x,.073,.35,mats.cream);for(const z of [-1.1,1.8])box(4.6,.008,.025,-.05,.073,z,mats.cream);
 // Burgundy sofa: back, two arms, independent seats and cushions.
 shadow(-2.3,-1.5,1.4,.65);
 box(2.9,.48,1.03,-2.25,.44,-1.96,mats.fabric,.12);box(2.9,.85,.22,-2.25,.9,-2.43,mats.fabric,.1);
 for(const x of [-3.62,-.88])box(.23,.65,1.12,x,.7,-1.94,mats.fabric,.09);
 for(const x of [-2.94,-1.57]){box(1.22,.18,.82,x,.75,-1.9,mats.fabric,.08);const cushion=box(.48,.48,.17,x,.99,-2.24,mats.cream,.07);cushion.rotation.z=x< -2?-.12:.13;}
 for(const x of [-3.35,-1.15])for(const z of [-2.28,-1.58])cylinder(.055,.04,.22,x,.17,z,mats.darkwood);
 // Coffee table and cup.
 shadow(-.1,.4,1.1,.55);box(1.8,.13,.95,-.1,.65,.4,mats.wood,.06);for(const x of [-.78,.58])for(const z of [.08,.73])box(.07,.58,.07,x,.31,z,mats.darkwood);
 box(.48,.035,.34,-.23,.74,.32,mats.paper);cylinder(.095,.08,.13,.43,.81,.5,mats.cream);cylinder(.072,.072,.006,.43,.88,.5,mats.darkwood);
 // Reading chair, angled toward the archive table.
 const chair=new T.Group();root.add(chair);chair.position.set(1.65,0,1.85);chair.rotation.y=-.3;
 box(.95,.2,.9,0,.59,0,mats.blue,.07,chair);box(.95,.7,.17,0,.98,.36,mats.blue,.07,chair);
 for(const x of [-.43,.43]){box(.12,.32,.95,x,.72,0,mats.wood,.02,chair);for(const z of [-.32,.32])box(.06,.55,.06,x,.29,z,mats.darkwood,0,chair);}shadow(1.65,1.85,.7,.6);
 // Writing desk at the window, drawer, pulled-back wooden stool.
 box(1.85,.14,.75,1.45,1.05,-1.75,mats.wood,.035);box(1.5,.28,.65,1.45,.87,-1.75,mats.darkwood,.02);
 for(const x of [.7,2.2])for(const z of [-2,-1.5])box(.07,1,.07,x,.52,z,mats.darkwood);
 cylinder(.35,.35,.13,1.32,.57,-.85,mats.wood);for(const x of [1.1,1.55])box(.06,.52,.06,x,.27,-.85,mats.darkwood);
 // Table lamp and a warm pool of light.
 cylinder(.14,.18,.055,2.05,1.16,-1.83,mats.darkwood);cylinder(.025,.025,.45,2.05,1.4,-1.83,mats.amber);cylinder(.12,.27,.32,2.05,1.69,-1.83,mats.amber);
 const lamp=new T.PointLight(0xffc27c,7,5,2);lamp.position.set(2.05,1.55,-1.83);root.add(lamp);lampLights.push(lamp);shadow(1.4,-1.7,.85,.4,.1);
 // Original bookcase, living plants and an empty coat hook.
 box(.8,2.3,.45,-3.45,1.2,-.1,mats.darkwood,.025);
 for(let level=0;level<4;level++){box(.8,.05,.5,-3.45,.21+level*.58,-.1,mats.wood);for(let k=0;k<4;k++){const book=box(.11,.34+(k%2)*.06,.27,-3.7+k*.17,.42+level*.58,-.12,[mats.cream,mats.blue,mats.fabric,mats.green][k]);book.rotation.z=(k%2)*.06;}}
 function plant(x,z,scale=1){cylinder(.2*scale,.14*scale,.38*scale,x,.22*scale,z,mats.cream);for(let i=0;i<7;i++){const a=i/7*Math.PI*2;const leaf=new T.Mesh(new T.SphereGeometry(1,8,6),mats.green);leaf.scale.set(.12*scale,.4*scale,.045*scale);leaf.position.set(x+Math.cos(a)*.16*scale,.65*scale+ i%2*.15*scale,z+Math.sin(a)*.16*scale);leaf.rotation.z=-Math.cos(a)*.5;root.add(leaf);}shadow(x,z,.32*scale,.24*scale);}
 plant(3.15,-2.24,1.35);plant(-3.2,2.2,.8);
 // Memory objects and their projected anchor positions.
 const photo=box(.65,.61,.08,-2.6,2.72,-2.86,mats.wood,.02);box(.52,.48,.02,-2.6,2.72,-2.805,mats.paper);box(.3,.19,.025,-2.6,2.62,-2.785,mats.blue);hotspots.photograph=new T.Vector3(-2.6,2.72,-2.74);
 const letter=box(.45,.025,.3,1.18,1.14,-1.72,mats.paper);letter.rotation.y=.18;box(.09,.008,.07,1.25,1.16,-1.67,mats.fabric);hotspots.letter=new T.Vector3(1.18,1.24,-1.55);
 box(1.2,.13,.65,2.65,.75,.2,mats.wood,.04);for(const x of [2.2,3.1])box(.06,.7,.06,x,.36,.2,mats.darkwood);
 box(.74,.45,.32,2.65,1.04,.2,mats.darkwood,.05);box(.26,.24,.025,2.48,1.06,.375,mats.black);for(let x=0;x<6;x++)box(.012,.2,.025,2.37+x*.043,1.06,.395,mats.wood);box(.25,.06,.02,2.82,1.14,.38,mats.amber);for(const x of [2.76,2.92]){const knob=cylinder(.035,.035,.03,x,.99,.4,mats.cream);knob.rotation.x=Math.PI/2;}hotspots.radio=new T.Vector3(2.65,1.28,.25);
 const clock=cylinder(.27,.27,.09,-3.85,2.7,-1.5,mats.wood);clock.rotation.z=Math.PI/2;const face=cylinder(.225,.225,.015,-3.79,2.7,-1.5,mats.paper);face.rotation.z=Math.PI/2;box(.02,.15,.025,-3.775,2.76,-1.5,mats.black);const hand=box(.025,.02,.14,-3.775,2.7,-1.44,mats.black);hotspots.clock=new T.Vector3(-3.64,2.76,-1.45);
 // A lighter wall patch, four sides of an empty frame; no invented portrait.
 box(.68,.8,.02,-1.5,2.67,-2.91,material('#8d9890'));for(const x of [-1.8,-1.2])box(.055,.75,.065,x,2.67,-2.85,mats.wood);for(const y of [2.32,3.02])box(.65,.055,.065,-1.5,y,-2.85,mats.wood);hotspots.frame=new T.Vector3(-1.5,2.7,-2.73);
 return {root,hotspots,lampLights};
}

export function mountRoom3D(host,onOpen){
 let renderer,software=false,closed=false,controls,observer;
 const world=new T.Scene();world.background=new T.Color('#171f29');const model=buildMemoryRoom();world.add(model.root);
 const hemi=new T.HemisphereLight(0xffefd6,0x303b46,2);world.add(hemi);const sun=new T.DirectionalLight(0xffdfac,2.8);sun.position.set(1,7,3);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-6;sun.shadow.camera.right=6;sun.shadow.camera.top=6;sun.shadow.camera.bottom=-6;sun.shadow.bias=-.001;sun.shadow.normalBias=.03;world.add(sun);
 const camera=new T.OrthographicCamera(-6,6,5,-5,.1,100);camera.position.set(10,8,12);camera.lookAt(0,1,0);
 const view=document.createElement('div');view.className='room3d-view';const overlay=document.createElement('div');overlay.className='room3d-markers';
 const dock=document.createElement('aside');dock.className='room3d-dock';const title=document.createElement('strong');title.textContent='THE MEMORY ROOM · 3D';dock.append(title);
 const status=document.createElement('p');status.setAttribute('role','status');dock.append(status);host.append(view,dock);
 try{try{renderer=new T.WebGLRenderer({antialias:true});renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));}catch{software=true;renderer=new SVGRenderer();renderer.setPrecision(2);hemi.intensity=.8;sun.intensity=.9;for(const light of model.lampLights)light.intensity=.18;}}
 catch{status.textContent='The 3D view could not start. Use the illustrated room.';return ()=>host.replaceChildren();}
 renderer.domElement.setAttribute('aria-hidden','true');view.append(renderer.domElement,overlay);
 status.textContent=software?'Compatibility rendering. Select numbered memories or drag to orbit.':'Select numbered memories. Drag to orbit; scroll or pinch to zoom.';
 controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,1,0);controls.enablePan=false;controls.enableDamping=false;controls.minPolarAngle=.4;controls.maxPolarAngle=1.3;controls.minAzimuthAngle=.15;controls.maxAzimuthAngle=1.45;controls.minZoom=.65;controls.maxZoom=1.8;controls.update();
 const markers=[];const names={photograph:'Photograph',letter:'Letter',radio:'Radio',clock:'Stopped clock',frame:'Empty frame'};
 for(const [id,position]of Object.entries(model.hotspots)){const b=document.createElement('button');b.type='button';b.textContent=String(markers.length+1);b.setAttribute('aria-label','Explore '+names[id]);b.title=names[id];b.onclick=()=>onOpen(id,b);overlay.append(b);markers.push({b,position});}
 function render(){if(closed)return;renderer.render(world,camera);for(const {b,position}of markers){const p=position.clone().project(camera);b.style.left=(p.x+1)*50+'%';b.style.top=(1-p.y)*50+'%';b.hidden=p.z< -1||p.z>1;}}
 controls.addEventListener('change',render);
 const escape=e=>{if(e.key==='Escape'&&host.classList.contains('expanded')){host.classList.remove('expanded');expand.textContent='Expand room';expand.setAttribute('aria-pressed','false');expand.focus();}};host.addEventListener('keydown',escape);
 function button(text,fn){const b=document.createElement('button');b.type='button';b.textContent=text;b.onclick=()=>{fn();controls.update();render();};dock.append(b);return b;}
 const expand=button('Expand room',()=>{const on=host.classList.toggle('expanded');expand.textContent=on?'Close expanded view':'Expand room';expand.setAttribute('aria-pressed',String(on));});expand.setAttribute('aria-pressed','false');
 button('Turn left',()=>camera.position.applyAxisAngle(new T.Vector3(0,1,0),-.15));button('Turn right',()=>camera.position.applyAxisAngle(new T.Vector3(0,1,0),.15));button('Zoom in',()=>{camera.zoom=Math.min(1.8,camera.zoom+.15);camera.updateProjectionMatrix();});button('Zoom out',()=>{camera.zoom=Math.max(.65,camera.zoom-.15);camera.updateProjectionMatrix();});button('Reset view',()=>{camera.position.set(10,8,12);camera.zoom=1;camera.updateProjectionMatrix();});
 const lamp=button('Lamp on',()=>{const on=!model.lampLights[0].visible;for(const light of model.lampLights)light.visible=on;lamp.textContent='Lamp '+(on?'on':'off');lamp.setAttribute('aria-pressed',String(on));});lamp.setAttribute('aria-pressed','true');
 const label=document.createElement('label');label.textContent='Window light';const select=document.createElement('select');for(const name of ['Dawn','Day','Dusk','Night'])select.append(Object.assign(document.createElement('option'),{textContent:name,value:name}));select.value='Dusk';label.append(select);dock.append(label);select.onchange=()=>{const value={Dawn:[1.3,.9],Day:[2.8,2],Dusk:[1.8,1.1],Night:[.25,.4]}[select.value];sun.intensity=value[0]*(software?.5:1);hemi.intensity=value[1];render();};
 observer=new ResizeObserver(()=>{const w=view.clientWidth,h=view.clientHeight||500;renderer.setSize(w,h);const aspect=w/h;camera.left=-5.6*aspect;camera.right=5.6*aspect;camera.top=5.6;camera.bottom=-5.6;camera.updateProjectionMatrix();render();});observer.observe(view);
 const help=document.createElement('p');help.textContent='Original procedural geometry. No people or downloaded room artwork. The same archive sources remain connected below.';dock.append(help);
 return ()=>{closed=true;host.classList.remove('expanded');host.removeEventListener('keydown',escape);observer.disconnect();controls.dispose();model.root.traverse(o=>o.geometry?.dispose());const materials=new Set();world.traverse(o=>{if(o.material)materials.add(o.material);});materials.forEach(m=>m.dispose());renderer.dispose?.();host.replaceChildren();};
}
