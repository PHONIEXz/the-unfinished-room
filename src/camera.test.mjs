import test from 'node:test';import assert from 'node:assert/strict';import {boundCamera,zoomCamera} from '../web/camera.mjs';
test('camera never pans beyond room edges and resets at overview scale',()=>{assert.deepEqual(boundCamera({scale:1,x:-300,y:300},800,500),{scale:1,x:0,y:0});assert.deepEqual(boundCamera({scale:2,x:-9999,y:30},800,500),{scale:2,x:-800,y:0});});
test('zoom preserves the point under its anchor',()=>{assert.deepEqual(zoomCamera({scale:1,x:0,y:0},2,{x:400,y:250},800,500),{scale:2,x:-400,y:-250});});
test('zoom limits and resize prevent a lost room',()=>{const state=zoomCamera({scale:2,x:-400,y:-250},9,{x:400,y:250},800,500);assert.equal(state.scale,2.4);assert.deepEqual(boundCamera({scale:2,x:-800,y:-500},300,200),{scale:2,x:-300,y:-200});});
