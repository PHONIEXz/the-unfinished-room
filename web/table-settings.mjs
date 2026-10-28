import * as T from 'three';
import {objectPosition} from './room-layout.mjs';
export function diningSeatCounts(archive){
 const tables=archive.objects.filter(o=>o.kind==='dining-table'),counts=new Map(tables.map(o=>[o.id,0]));
 for(const chair of archive.objects.filter(o=>o.kind==='dining-chair'||o.kind==='chair')){
  const p=objectPosition(chair,archive.decor);let nearest=null,distance=Infinity;for(const table of tables){const q=objectPosition(table,archive.decor),d=(p.x-q.x)**2+(p.z-q.z)**2;if(d<distance){distance=d;nearest=table.id;}}if(nearest!==null)counts.set(nearest,counts.get(nearest)+1);
 }return counts;
}
export function buildTableSettings(seats){
 const root=new T.Group();root.name='Dining table setting';root.userData.tableSettings=true;root.userData.seats=seats;
 const ceramic=new T.MeshLambertMaterial({color:'#f4ead9'}),cupMat=new T.MeshLambertMaterial({color:'#f7f0e4'}),red=new T.MeshLambertMaterial({color:'#ab3638'}),green=new T.MeshLambertMaterial({color:'#4e7447'}),wood=new T.MeshLambertMaterial({color:'#62412d'}),flower=new T.MeshLambertMaterial({color:'#dfa2a8'}),tea=new T.MeshLambertMaterial({color:'#654333'});
 const cylinder=(r,rb,h,x,y,z,m)=>{const mesh=new T.Mesh(new T.CylinderGeometry(r,rb,h,16),m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);return mesh;};
 const sphere=(r,x,y,z,m)=>{const mesh=new T.Mesh(new T.SphereGeometry(r,10,8),m);mesh.position.set(x,y,z);mesh.castShadow=true;root.add(mesh);return mesh;};
 const slots=[];if(seats<=2){for(let i=0;i<seats;i++)slots.push([0,i? .34:-.34]);}else{const top=Math.ceil((seats-2)/2),bottom=Math.floor((seats-2)/2);for(const [n,z]of [[top,-.34],[bottom,.34]])for(let k=0;k<n;k++)slots.push([(k-(n-1)/2)*Math.min(.5,1.3/Math.max(1,n-1)),z]);slots.push([-.73,0],[.73,0]);}
 for(const [x,z]of slots){const plate=cylinder(.115,.11,.018,x,.904,z,ceramic);plate.userData.setting='plate';cylinder(.09,.09,.004,x,.916,z,cupMat);const cx=x+(x>.55?-.1:.1),cz=z*.62;const cup=cylinder(.046,.037,.09,cx,.948,cz,cupMat);cup.userData.setting='cup';cylinder(.036,.036,.004,cx,.995,cz,tea);const handle=new T.Mesh(new T.TorusGeometry(.031,.009,6,10),cupMat);handle.position.set(cx+.048,.952,cz);root.add(handle);}
 const bowl=cylinder(.17,.11,.045,-.25,.925,0,ceramic);bowl.userData.setting='apple-bowl';for(const [x,z,y]of [[-.07,0,0],[.04,-.06,0],[.05,.06,0],[0,0,.06]]){sphere(.054,-.25+x,.98+y,z,red);cylinder(.006,.006,.033,-.25+x,1.04+y,z,wood);}
 const vase=cylinder(.065,.085,.17,.25,.98,0,ceramic);vase.userData.setting='flower-vase';for(let i=0;i<5;i++){const a=i*Math.PI*2/5,x=.25+Math.cos(a)*.055,z=Math.sin(a)*.055,h=1.2+(i%2)*.035;cylinder(.006,.006,h-1.02,x,(h+1.02)/2,z,green);for(let j=0;j<5;j++)sphere(.025,x+Math.cos(j*1.256)*.027,h,z+Math.sin(j*1.256)*.027,flower);sphere(.015,x,h+.01,z,ceramic);}
 return root;
}
