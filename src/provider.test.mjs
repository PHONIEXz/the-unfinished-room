import test from 'node:test';
import assert from 'node:assert/strict';
import { requestModel } from './provider.mjs';
function setup(sequence) {
  let time=0,calls=0; const waits=[],timeouts=[];
  return {waits,timeouts,get calls(){return calls;}, options:{
    fetchImpl:async()=>{const value=sequence[calls++]; if(value instanceof Error) throw value; return {ok:value===200,status:value,headers:{get:()=>null},json:async()=>({ok:true})};},
    now:()=>time,sleep:async ms=>{waits.push(ms);time+=ms;},random:()=>0,timeoutSignal:ms=>{timeouts.push(ms);return undefined;}
  }};
}
test('transient failures recover with bounded exponential delays',async()=>{
 const s=setup([500,503,200]); assert.deepEqual(await requestModel('url',{},s.options),{ok:true}); assert.equal(s.calls,3); assert.deepEqual(s.waits,[500,1000]);
});
test('permanent failures and invalid JSON do not retry',async()=>{
 const s=setup([401]); await assert.rejects(requestModel('url',{},s.options)); assert.equal(s.calls,1);
 const j=setup([200]); j.options.fetchImpl=async()=>({ok:true,json:async()=>{throw new SyntaxError('bad JSON');}}); await assert.rejects(requestModel('url',{},j.options),SyntaxError); assert.deepEqual(j.waits,[]);
});
test('timeouts retry but never exceed three attempts',async()=>{
 const s=setup(Array(3).fill(new DOMException('timeout','TimeoutError'))); await assert.rejects(requestModel('url',{},s.options)); assert.equal(s.calls,3); assert.ok(s.timeouts.every(ms=>ms<=12000));
});
test('Retry-After is respected or fails without an early retry',async()=>{
 for(const seconds of [2,60]) { const s=setup([200]); let calls=0;
 s.options.fetchImpl=async()=>++calls===1 ? {ok:false,status:429,headers:{get:()=>String(seconds)}} : {ok:true,json:async()=>({ok:true})};
 if(seconds===2){await requestModel('url',{},s.options); assert.deepEqual(s.waits,[2000]);assert.equal(calls,2);}
 else {await assert.rejects(requestModel('url',{},s.options));assert.equal(calls,1);assert.deepEqual(s.waits,[]);}
 }
});
test('elapsed attempt time reduces the next timeout and stops at deadline',async()=>{
 const s=setup([200]);let time=0,calls=0;s.options.now=()=>time;
 s.options.sleep=async ms=>{time+=ms;};
 s.options.fetchImpl=async()=>{calls++;time+=12000;throw new DOMException('timeout','TimeoutError');};
 await assert.rejects(requestModel('url',{},s.options));assert.equal(calls,3);assert.deepEqual(s.timeouts,[12000,12000,2500]);
});

test('larger layout requests can use a separate deadline without changing question defaults',async()=>{
 let allotted;
 await requestModel('https://example.test',{}, {budgetMs:55000,attemptTimeoutMs:45000,now:()=>0,timeoutSignal:ms=>{allotted=ms;return undefined;},fetchImpl:async()=>({ok:true,json:async()=>({ok:true})})});
 assert.equal(allotted,45000);
});

test('a caller can cap retries to reserve time for a validated format repair',async()=>{let calls=0;await assert.rejects(requestModel('https://provider.test',{}, {maxAttempts:1,fetchImpl:async()=>{calls++;return {ok:false,status:503,headers:new Headers()};}}));assert.equal(calls,1);});
