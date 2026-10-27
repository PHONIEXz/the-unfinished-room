import test from 'node:test';
import assert from 'node:assert/strict';
import {Box3,Vector3} from 'three';
import {buildMemoryRoom} from '../web/room-three.js';
test('3D diorama has finite bounded geometry and five archive anchors',()=>{
 const {root,hotspots}=buildMemoryRoom();root.updateMatrixWorld(true);const bounds=new Box3().setFromObject(root);const size=bounds.getSize(new Vector3());assert(size.toArray().every(v=>Number.isFinite(v)&&v>0&&v<15));assert.deepEqual(Object.keys(hotspots).sort(),['clock','frame','letter','photograph','radio']);for(const anchor of Object.values(hotspots))assert(bounds.clone().expandByScalar(.3).containsPoint(anchor));let triangles=0;root.traverse(o=>{if(o.geometry){const positions=o.geometry.getAttribute('position');assert([...positions.array].every(Number.isFinite));triangles+=(o.geometry.index?.count||positions.count)/3;}});assert(triangles<50000);root.traverse(o=>{o.geometry?.dispose();});
});
