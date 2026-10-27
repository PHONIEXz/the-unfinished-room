import test from 'node:test';
import assert from 'node:assert/strict';
import {Box3,Vector3} from 'three';
import {buildMemoryRoom} from '../web/room-three.js';
test('3D diorama has finite bounded geometry and five archive anchors',()=>{
 const {root,hotspots}=buildMemoryRoom();root.updateMatrixWorld(true);const bounds=new Box3().setFromObject(root);const size=bounds.getSize(new Vector3());assert(size.toArray().every(v=>Number.isFinite(v)&&v>0&&v<15));assert.deepEqual(Object.keys(hotspots).sort(),['clock','frame','letter','photograph','radio']);for(const anchor of Object.values(hotspots))assert(bounds.clone().expandByScalar(.3).containsPoint(anchor));let triangles=0;root.traverse(o=>{if(o.geometry){const positions=o.geometry.getAttribute('position');assert([...positions.array].every(Number.isFinite));triangles+=(o.geometry.index?.count||positions.count)/3;}});assert(triangles<50000);root.traverse(o=>{o.geometry?.dispose();});
});

test('personal 3D scene replaces demo evidence objects with saved object IDs',()=>{
 const archive={decor:{palette:'cream',floor:'tile',furnishings:false,windows:0},objects:[{id:'own-chair',kind:'chair',title:'A chair',surface:'floor',x:40,y:70,size:100,rotation:15,color:'#875d43'},{id:'own-frame',kind:'frame',title:'A frame',surface:'wall',x:20,y:30,size:100,rotation:0}]};const result=buildMemoryRoom(archive);assert.deepEqual(Object.keys(result.hotspots).sort(),['own-chair','own-frame']);assert.equal(result.root.children.filter(c=>c.userData.objectId).length,2);assert(result.lampLights.every(light=>light.parent===result.root));result.root.traverse(o=>o.geometry?.dispose());
});

test('new room essentials have distinct finite geometry and pendant fixtures hang below the ceiling',()=>{
 const kinds=['bed','dining-table','dining-chair','tv','cabinet','floor-lamp','pendant-lamp'];
 const archive={decor:{palette:'cream',furnishings:false},objects:kinds.map((kind,i)=>({id:kind,kind,title:kind,x:15+i*10,y:50,surface:kind==='pendant-lamp'?'ceiling':'floor',rotation:0,size:100,color:'#806345'}))};
 const model=buildMemoryRoom(archive);model.root.updateMatrixWorld(true);
 for(const kind of kinds){const group=model.root.children.find(c=>c.userData.objectId===kind);assert(group.children.length>=3);const b=new Box3().setFromObject(group);assert(b.min.toArray().concat(b.max.toArray()).every(Number.isFinite));if(kind==='pendant-lamp'){assert(b.min.y>2);assert(b.max.y<3.4);}if(kind==='bed')assert(b.getSize(new Vector3()).z>2);}
 assert(model.lampLights.every(l=>l.parent===model.root));model.root.traverse(o=>o.geometry?.dispose());
});
