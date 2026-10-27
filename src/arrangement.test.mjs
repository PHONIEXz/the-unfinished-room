import test from 'node:test';import assert from 'node:assert/strict';
import {arrangementInput,arrangementPrompt,validateArrangement} from '../web/arrangement.mjs';
const object={id:'item-1',kind:'photograph',surface:'wall',color:'#806345',x:25,y:35,rotation:0,size:100};
const input={consent:true,roomType:'parlour',description:'Cream walls and burgundy seating with a clear walkway.',objects:[object]};
const plan=()=>({summary:'Seating around a low table.',decor:{palette:'cream',floor:'wood',lamp:true,timeOfDay:'dusk'},objects:[{...object}],additions:[{kind:'sofa',surface:'floor',color:'#7f3e44',x:25,y:20,rotation:0,size:100}]});
test('arrangement requires explicit consent and accepts only anonymous layout fields',()=>{
 assert.throws(()=>arrangementInput({...input,consent:false}),/Agree/);
 for(const field of ['text','image','title','date','sourceNote'])assert.throws(()=>arrangementInput({...input,objects:[{...object,[field]:'private'}]}),/Unsupported/);
 assert.throws(()=>arrangementInput({...input,sources:[]}),/Unsupported/);
 const clean=arrangementInput(input);assert.equal(clean.description,input.description);assert.ok(!('consent'in clean));assert.match(arrangementPrompt(clean),/Preserve EVERY/);
});
test('valid arrangement preserves IDs and accepts bounded supported furniture',()=>{assert.deepEqual(validateArrangement(plan(),arrangementInput(input)),plan());});
test('invalid model plans cannot delete, duplicate or change existing objects',()=>{
 for(const mutate of [p=>p.objects=[],p=>p.objects[0].id='unknown',p=>p.objects[0].kind='sofa',p=>p.objects.push({...object}),p=>p.objects[0].x=101,p=>p.objects[0].image='https://evil.test',p=>p.additions[0].kind='bed',p=>p.decor.palette='url(foo)']){const p=plan();mutate(p);assert.throws(()=>validateArrangement(p,arrangementInput(input)));}
});
test('arrangements respect twelve-object budget and empty-room input',()=>{const p=plan();p.additions=Array.from({length:12},()=>({...p.additions[0]}));assert.throws(()=>validateArrangement(p,arrangementInput(input)),/twelve/);p.objects=[];p.additions=p.additions.slice(0,2);assert.equal(validateArrangement(p,arrangementInput({...input,objects:[]})).additions.length,2);});
