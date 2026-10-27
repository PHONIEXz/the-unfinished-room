import test from 'node:test';import assert from 'node:assert/strict';
import {dragPosition} from '../web/placement.mjs';
const room={width:500,height:400},object={width:100,height:80};
test('pointer motion converts to room-relative saved coordinates',()=>{assert.deepEqual(dragPosition({x:50,y:40},{x:100,y:80},room,object),{x:30,y:30});});
test('drag clamps at every edge without losing the object',()=>{assert.deepEqual(dragPosition({x:50,y:40},{x:-999,y:-999},room,object),{x:0,y:0});assert.deepEqual(dragPosition({x:50,y:40},{x:999,y:999},room,object),{x:80,y:80});});
test('oversized objects and zero-sized view have safe positions',()=>{assert.deepEqual(dragPosition({x:0,y:0},{x:100,y:100},{width:0,height:0},object),{x:0,y:0});assert.deepEqual(dragPosition({x:20,y:20},{x:20,y:20},room,{width:1000,height:1000}),{x:0,y:0});});
