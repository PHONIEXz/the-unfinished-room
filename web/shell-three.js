import * as T from 'three';
import {shellSettings,windowOpenings,doorOpening,wallPanels} from './shell.mjs';
import {wallColours} from './finishes.mjs';
export function buildRoomShell(decor={}){
 const root=new T.Group(),s=shellSettings(decor),windows=windowOpenings(decor),door=doorOpening(decor),side=door?.side==='right'?1:-1;
 const mat=color=>new T.MeshLambertMaterial({color}),wall=mat(decor.wallColor||wallColours[decor.palette]||wallColours.midnight),wood=mat('#65513c'),trim=mat('#c4b99e'),dark=mat('#101923');
 function box(w,h,d,x,y,z,material,feature,order=-110){const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);mesh.receiveShadow=true;mesh.castShadow=true;mesh.renderOrder=feature==='window-pane'||feature==='door-hall'?-107:feature.startsWith('window-')||feature==='curtain'||feature==='door-frame'?-106:order;mesh.userData.shellFeature=feature;root.add(mesh);return mesh;}
 const backPanels=wallPanels(s.width,s.height,windows),sidePanels=wallPanels(s.depth,s.height,door?[door]:[]);
 for(const p of backPanels)box(p.width,p.height,.14,p.u,p.y,-s.depth/2,wall,'back-wall');
 for(const p of sidePanels)box(.14,p.height,p.width,side*s.width/2,p.y,p.u,wall,'side-wall');
 box(s.width+.35,.24,s.depth+.35,0,-.16,0,trim,'base',-100);
 const count=Math.ceil(s.width/.4),plank=s.width/count;
 for(let i=0;i<count;i++){const x=-s.width/2+plank*(i+.5);box(plank-.008,.06,s.depth,x,0,0,mat(i%2?'#876b4d':'#9b8060'),'wood-floor',-100);for(let k=0;k<3;k++)box(.006,.002,Math.min(1.1,s.depth/4),x-plank*.3+k*.08,.032,-s.depth*.3+k*s.depth*.28,wood,'wood-grain',-99);}
 if(['tile','marble'].includes(decor.floor)){const nx=Math.ceil(s.width),nz=Math.ceil(s.depth),tw=s.width/nx,td=s.depth/nz;for(let x=0;x<nx;x++)for(let z=0;z<nz;z++){const cx=-s.width/2+(x+.5)*tw,cz=-s.depth/2+(z+.5)*td;box(tw-.018,.025,td-.018,cx,.06,cz,mat(decor.floor==='marble'?((x+z)%2?'#c5c4b9':'#deddd3'):((x+z)%2?'#7a827a':'#a1a08e')),'tile',-95);if(decor.floor==='marble')for(let k=0;k<3;k++){const vein=box(.008,.003,Math.min(.36,td*.5),cx-tw*.2+k*tw*.18,.076,cz-td*.1+k*td*.18,mat('#9daca7'),'vein',-94);vein.rotation.y=.4+k*.35;}}}
 for(const opening of windows){const x=opening.u,y=opening.bottom+opening.height/2,z=-s.depth/2;
  box(opening.width-.08,opening.height-.08,.025,x,y,z-.07,mat('#bcc5be'),'window-pane');
  for(const edge of [-1,1]){box(.065,opening.height+.12,.17,x+edge*opening.width/2,y,z+.04,wood,'window-frame');box(opening.width+.16,.065,.17,x,y+edge*opening.height/2,z+.04,wood,'window-frame');}
  box(.045,opening.height,.16,x,y,z+.05,wood,'window-frame');box(opening.width,.04,.16,x,y,z+.05,wood,'window-frame');box(opening.width+.24,.1,.32,x,opening.bottom-.04,z+.14,trim,'window-sill');
  for(let i=0;i<4;i++){const curtain=box(.07,opening.height+.2,.075,x-opening.width/2-.1+i*.07,y,z+.2,trim,'curtain');curtain.rotation.z=(i%2?1:-1)*.008;}
 }
 if(door){const x=side*s.width/2,z=door.u;box(.025,door.height,door.width,x+side*.09,door.height/2,z,dark,'door-hall');for(const edge of [-1,1])box(.22,door.height+.06,.075,x,door.height/2,z+edge*door.width/2,wood,'door-frame');box(.22,.1,door.width+.16,x,door.height+.03,z,wood,'door-frame');box(.04,.018,door.width-.1,x-side*.12,.025,z,mat('#eabf7e'),'door-light');}
 box(s.width,.13,.15,0,.12,-s.depth/2+.08,trim,'skirting');for(const p of sidePanels.filter(p=>p.y<.2))box(.15,.13,p.width,side*(s.width/2-.08),.12,p.u,trim,'skirting');
 if(['brick','wallpaper'].includes(decor.wallFinish)){const colour=wall.color.clone().offsetHSL(0,0,decor.wallFinish==='brick'?-.08:.08),pattern=mat(colour),brick=decor.wallFinish==='brick';for(const [length,holes,isSide]of [[s.width,windows,false],[s.depth,door?[door]:[],true]])for(let row=0;row<Math.floor(s.height/.26);row++)for(let col=0;col<Math.ceil(length/.45);col++){const u=-length/2+.23+col*.45+(row%2)*.22,y=.15+row*.26;if(u>length/2-.23||holes.some(h=>Math.abs(u-h.u)<h.width/2+.24&&y>h.bottom-.15&&y<h.bottom+h.height+.15))continue;const w=brick?.41:decor.wallpaper==='stripe'?.018:.08,h=brick?.22:decor.wallpaper==='stripe'?.26:.08;const mesh=isSide?box(.012,h,w,side*(s.width/2-.08),y,u,pattern,'wall-pattern',-109):box(w,h,.012,u,y,-s.depth/2+.08,pattern,'wall-pattern',-109);if(!brick&&decor.wallpaper!=='stripe'){if(isSide)mesh.rotation.x=Math.PI/4;else mesh.rotation.z=Math.PI/4;}}}
 root.userData={shell:s,windows,door,backPanels,sidePanels,cameraSide:side};return root;
}
