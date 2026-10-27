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

test('v4 artwork transforms survive backup and reject unsafe values',()=>{
 const f=fixture();f.schemaVersion=4;f.decor={palette:'midnight',floor:'wood',window:true,shelf:true,lamp:true,size:'medium',windowPosition:'left',doorPosition:'left',timeOfDay:'dusk',alcove:true,fireplace:true};f.objects[0]={...f.objects[0],kind:'letter',x:40,y:50,rotation:-30,size:140};
 assert.deepEqual(readPersonal(JSON.stringify(f)),f);
 for(const [key,value]of [['rotation',181],['rotation',NaN],['size',59],['size',141],['size','100']]){const bad=structuredClone(f);bad.objects[0][key]=value;assert.throws(()=>readPersonal(bad));}
});


test('v5 photos and memory metadata survive backup while active content is rejected',()=>{
 const f=fixture();f.schemaVersion=5;f.decor={palette:'midnight',floor:'wood',window:true,shelf:true,lamp:true,size:'medium',windowPosition:'left',doorPosition:'left',timeOfDay:'dusk',alcove:true,fireplace:true};f.objects[0]={...f.objects[0],kind:'photograph',x:40,y:50,rotation:15,size:100,date:'Around 2001',sourceNote:'A family recollection, not independently verified.',image:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAQABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzWFIvIlkkRn2sqgBsdc+3tSlrcdbWQfWX/wCtSQtF5Escjsm5lIIXPTP+NHl2/wDz9N/36/8Ar1p1MugTLF5EUsaMm5mUgtu6Y9veiiZohBFFG7PtZmJK7euP8KKa2Ez/2Q=='};
 assert.deepEqual(readPersonal(JSON.stringify(f)),f);
 for(const image of ['https://example.com/photo.jpg','data:image/svg+xml;base64,PHN2Zz4=','data:image/jpeg;base64,PHN2Zz4=', 'data:image/jpeg;base64,'+'a'.repeat(260001)]){const invalid=structuredClone(f);invalid.objects[0].image=image;assert.throws(()=>readPersonal(invalid));}
 const invalid=structuredClone(f);invalid.objects[0].sourceNote='a'.repeat(501);assert.throws(()=>readPersonal(invalid));
});

test('v6 decoration-only rooms and mixed memories preserve order and source integrity',()=>{
 const decor={palette:'midnight',floor:'wood',window:true,shelf:true,lamp:true,size:'medium',windowPosition:'left',doorPosition:'left',timeOfDay:'dusk',alcove:true,fireplace:true};
 const object={id:'guitar',title:'My guitar',sourceIds:[],decoration:true,kind:'guitar',x:40,y:50,rotation:0,size:100,date:'',sourceNote:'',image:null};
 const room={schemaVersion:6,title:'Music corner',fictional:true,decor,sources:[],objects:[object],openQuestions:[]};assert.deepEqual(readPersonal(JSON.stringify(room)),room);
 const mixed=structuredClone(room);mixed.sources=[{id:'book',title:'School book',text:'A memory.',type:'text'}];mixed.objects.push({...object,id:'book',kind:'book',title:'School book',decoration:false,sourceIds:['book']});assert.deepEqual(readPersonal(mixed),mixed);
 for(const mutate of [r=>r.objects[0].sourceIds.push('book'),r=>r.objects[1].sourceIds=[],r=>r.objects[1].decoration=true,r=>r.objects.reverse().push(r.objects[0])]){const bad=structuredClone(mixed);mutate(bad);assert.throws(()=>readPersonal(bad));}
});

test('v7 finishes and custom shapes round-trip and reject unsafe styles',()=>{
 const f={schemaVersion:7,title:'A quiet corner',fictional:true,decor:{palette:'midnight',floor:'wood',window:true,shelf:true,lamp:true,size:'medium',windowPosition:'left',doorPosition:'left',timeOfDay:'dusk',alcove:true,fireplace:true,wallpaper:'paper',windows:2,furnishings:false},sources:[],objects:[{id:'box',title:'Keepsake box',sourceIds:[],decoration:true,kind:'custom',x:45,y:60,rotation:15,size:100,date:'',sourceNote:'',image:null,color:'#abc123',shape:'round'}],openQuestions:[]};
 assert.deepEqual(readPersonal(JSON.stringify(f)),f);
 for(const mutate of [a=>a.objects[0].color='url(x)',a=>a.objects[0].shape='script',a=>a.decor.windows=3,a=>a.decor.wallpaper='url(x)',a=>a.decor.furnishings='false']){const bad=structuredClone(f);mutate(bad);assert.throws(()=>readPersonal(bad));}
});
