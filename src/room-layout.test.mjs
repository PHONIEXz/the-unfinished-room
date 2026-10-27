import test from 'node:test';import assert from 'node:assert/strict';
import {surfaces,objectPosition,positionFromWorld} from '../web/room-layout.mjs';
test('3D placement surfaces round-trip normalized coordinates without drift',()=>{for(const surface of surfaces)for(const x of [0,35,100])for(const y of [0,60,100]){const o={surface,x,y};const p=positionFromWorld(o,objectPosition(o));assert(Math.abs(p.x-x)<1e-9);assert(Math.abs(p.y-y)<1e-9);}});
test('dragging out of a surface clamps coordinates to its finite bounds',()=>{for(const surface of surfaces){const p=positionFromWorld({surface},{x:999,y:-999,z:999});assert(Object.values(p).every(n=>Number.isFinite(n)&&n>=0&&n<=100));}});
