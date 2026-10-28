import test from 'node:test';
import assert from 'node:assert/strict';
import {readRoomExport} from '../web/room-export.mjs';
import {showcaseRoom} from '../web/showcases.mjs';
const payload=()=>({archive:showcaseRoom('sunday-table'),image:'data:image/png;base64,aGVsbG8=',returnUrl:'/create/',mode:'Current editor draft'});
test('PDF handoff preserves object stories and distinguishes draft from saved room',()=>{const input=payload(),out=readRoomExport(JSON.stringify(input));assert.deepEqual(out.archive,input.archive);assert.equal(out.mode,'Current editor draft');assert.equal(out.image,input.image);});
test('PDF handoff rejects injected image formats, external return URLs and invalid archives',()=>{for(const patch of [{image:'data:image/svg+xml,<svg onload="alert(1)"/>'},{returnUrl:'https://example.com/'},{returnUrl:'//example.com/'},{archive:{title:'invalid'}}])assert.throws(()=>readRoomExport(JSON.stringify({...payload(),...patch})));});
test('PDF handoff permits image retry and original fictional archive without personal storage',()=>{assert.equal(readRoomExport(JSON.stringify({...payload(),archive:null,image:null,returnUrl:'/room/'})).archive,null);assert.equal(readRoomExport(JSON.stringify({...payload(),returnUrl:'/room/?example=sunday-table'})).returnUrl,'/room/?example=sunday-table');});
test('PDF handoff bounds browser storage and rejects malformed JSON',()=>{assert.throws(()=>readRoomExport('x'.repeat(7500001)));assert.throws(()=>readRoomExport('{'));assert.throws(()=>readRoomExport(JSON.stringify({...payload(),image:'data:image/png;base64,'+'a'.repeat(4500000)})));});
