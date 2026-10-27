import test from 'node:test';
import assert from 'node:assert/strict';
import {Box3,Vector3} from 'three';
import {buildMemoryRoom} from '../web/room-three.js';
test('3D diorama has finite bounded geometry and five archive anchors',()=>{
 const {root,hotspots}=buildMemoryRoom();root.updateMatrixWorld(true);const bounds=new Box3().setFromObject(root);const size=bounds.getSize(new Vector3());assert(size.toArray().every(v=>Number.isFinite(v)&&v>0&&v<15));assert.deepEqual(Object.keys(hotspots).sort(),['clock','frame','letter','photograph','radio']);for(const anchor of Object.values(hotspots))assert(bounds.clone().expandByScalar(.3).containsPoint(anchor));let triangles=0;root.traverse(o=>{if(o.geometry){const positions=o.geometry.getAttribute('position');assert([...positions.array].every(Number.isFinite));triangles+=(o.geometry.index?.count||positions.count)/3;}});assert(triangles<50000);root.traverse(o=>{o.geometry?.dispose();});
});

test('personal 3D scene replaces demo evidence objects with saved object IDs',()=>{
 const archive={decor:{palette:'cream',floor:'tile',furnishings:false,windows:0},objects:[{id:'own-chair',kind:'chair',title:'A chair',surface:'floor',x:40,y:70,size:100,rotation:15,color:'#875d43'},{id:'own-frame',kind:'frame',title:'A frame',surface:'wall',x:20,y:30,size:100,rotation:0}]};const result=buildMemoryRoom(archive);assert.deepEqual(Object.keys(result.hotspots).sort(),['own-chair','own-frame']);assert.equal(result.root.children.filter(c=>c.userData.objectId).length,2);result.root.traverse(o=>o.geometry?.dispose());
});
