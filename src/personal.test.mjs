import test from 'node:test';
import assert from 'node:assert/strict';
import {readPersonal,savePersonal,storageKey} from '../web/personal.mjs';
const fixture=()=>({schemaVersion:1,title:'Grandma’s room',fictional:false,sources:[{id:'letter',title:'Her letter',type:'text',text:'A memory from 1988. The exact date is uncertain.'}],objects:[{id:'letter',title:'Her letter',sourceIds:['letter']}],openQuestions:['Who kept the original?']});
test('personal room survives save and JSON restore with exact source text',()=>{let stored;const store={setItem:(key,value)=>{assert.equal(key,storageKey);stored=value;}};assert.deepEqual(savePersonal(store,fixture()),fixture());assert.deepEqual(readPersonal(stored),fixture());});
test('malformed backups and broken source links are rejected',()=>{for(const value of [null,{},'not json',{...fixture(),objects:[{id:'letter',title:'Letter',sourceIds:['missing']}]},{...fixture(),sources:[...fixture().sources,...fixture().sources]}])assert.throws(()=>readPersonal(value));});
test('oversized entries and unknown slots are rejected',()=>{const f=fixture();f.sources[0].text='a'.repeat(8001);assert.throws(()=>readPersonal(f));f.sources[0].text='A memory';f.sources[0].id='__proto__';assert.throws(()=>readPersonal(f));});
test('failed save reports an error and invalid restore cannot overwrite storage',()=>{let calls=0;assert.throws(()=>savePersonal({setItem:()=>calls++},{}));assert.equal(calls,0);assert.throws(()=>savePersonal({setItem:()=>{throw Error('quota');}},fixture()));});
test('text resembling markup stays text and unknown extra fields are discarded',()=>{const f=fixture();f.sources[0].text='<img src=x onerror=alert(1)>';f.apiKey='discard';const clean=readPersonal(f);assert.equal(clean.sources[0].text,f.sources[0].text);assert.equal(clean.apiKey,undefined);});

test('custom objects and room decoration round-trip through backup',()=>{
 const f=fixture();f.schemaVersion=2;f.decor={palette:'lagoon',floor:'tile',window:false,shelf:false,lamp:true};f.sources[0].id='object-chair';f.objects=[{id:'object-chair',title:'My reading chair',sourceIds:['object-chair'],kind:'chair',x:12,y:60}];
 assert.deepEqual(readPersonal(JSON.stringify(f)),f);
});
test('unsafe style values and off-canvas coordinates are rejected',()=>{
 const f=fixture();f.schemaVersion=2;f.decor={palette:'midnight',floor:'wood',window:true,shelf:true,lamp:true};f.objects[0]={...f.objects[0],kind:'book',x:20,y:30};
 for(const bad of [NaN,Infinity,-1,101]){const copy=structuredClone(f);copy.objects[0].x=bad;assert.throws(()=>readPersonal(copy));}
 f.decor.palette='url(https://example.com)';assert.throws(()=>readPersonal(f));
});
test('room supports twelve unique objects but rejects a thirteenth',()=>{
 const f=fixture();f.sources=[];f.objects=[];
 for(let i=0;i<12;i++){const id='item-'+i;f.sources.push({id,title:'Book '+i,type:'text',text:'My memory.'});f.objects.push({id,title:'Book '+i,sourceIds:[id]});}
 assert.equal(readPersonal(f).objects.length,12);
 f.sources.push({id:'extra',title:'Extra',type:'text',text:'Memory'});assert.throws(()=>readPersonal(f));
});

test('v3 shell and mood survive browser save and JSON restore without changing memories',()=>{
 const f=fixture();f.schemaVersion=3;f.objects[0]={...f.objects[0],kind:'letter',x:42,y:59};
 f.decor={palette:'cream',floor:'tile',window:true,shelf:false,lamp:false,size:'wide',windowPosition:'right',doorPosition:'none',timeOfDay:'night',alcove:false,fireplace:true};
 let backup;savePersonal({setItem:(_,value)=>backup=value},f);
 assert.deepEqual(readPersonal(backup),f);
 for(const [key,value]of Object.entries({size:'huge',windowPosition:'url(x)',doorPosition:'roof',timeOfDay:'unknown',alcove:'false',fireplace:1})){
  const invalid=structuredClone(f);invalid.decor[key]=value;assert.throws(()=>readPersonal(invalid));
 }
});
