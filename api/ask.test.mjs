import test from 'node:test';
import assert from 'node:assert/strict';
import handler from './ask.mjs';

function response() {
  return {
    statusCode:200,headers:{},
    setHeader(name,value){this.headers[name]=value;return this;},
    status(code){this.statusCode=code;return this;},
    json(body){this.body=body;return this;}
  };
}
test('without a key, a question fails transparently without model call',async()=>{
  const before = process.env.GEMMA_API_KEY;
  delete process.env.GEMMA_API_KEY;
  const out = response();
  await handler({method:'POST',body:{question:'Who wrote the letter?'},headers:{host:'example.test'}},out);
  assert.equal(out.statusCode,503);
  assert.match(out.body.error,/not configured/);
  if(before) process.env.GEMMA_API_KEY=before;
});
test('availability endpoint reveals only configuration status',async()=>{
  const before=process.env.GEMMA_API_KEY;
  delete process.env.GEMMA_API_KEY;
  const out=response();
  await handler({method:'GET',headers:{}},out);
  assert.deepEqual(out.body,{available:false,model:'gemma-4-26b-a4b-it'});
  if(before) process.env.GEMMA_API_KEY=before;
});
test('valid model answer is returned with checked excerpt',async()=>{
  const before=process.env.GEMMA_API_KEY;
  const originalFetch=globalThis.fetch;
  process.env.GEMMA_API_KEY='test-key';
  globalThis.fetch=async()=>({ok:true,json:async()=>({candidates:[{content:{parts:[{text:JSON.stringify({answer:'The reading circle first met in 1998.',unknown:false,evidence:[{sourceId:'photo-note',quote:'Our first Saturday reading circle, 1998.'}]})}]}}]})});
  try{
    const out=response();
    await handler({method:'POST',body:{question:'When did the circle begin?'},headers:{host:'example.test',origin:'https://example.test','x-forwarded-for':'198.51.100.2'}},out);
    assert.equal(out.statusCode,200);
    assert.equal(out.body.evidence[0].sourceId,'photo-note');
  }finally{globalThis.fetch=originalFetch;if(before)process.env.GEMMA_API_KEY=before;else delete process.env.GEMMA_API_KEY;}
});
test('model unknown with an incidental exact quote becomes a clean unknown',async()=>{
  const before=process.env.GEMMA_API_KEY;
  const originalFetch=globalThis.fetch;
  process.env.GEMMA_API_KEY='test-key';
  globalThis.fetch=async()=>({ok:true,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[
    {thought:true,text:'internal reasoning'},
    {text:JSON.stringify({answer:'Ada took the photograph.',unknown:true,evidence:[{sourceId:'photo-note',quote:'The person behind the camera is not named.'}]})}
  ]}}]})});
  try{
    const out=response();
    await handler({method:'POST',body:{question:'Who took the photograph?'},headers:{host:'example.test','x-forwarded-for':'198.51.100.4'}},out);
    assert.equal(out.statusCode,200);
    assert.deepEqual(out.body.evidence,[]);
    assert.equal(out.body.answer,'The archive does not establish an answer to that question.');
    assert.equal(out.body.unknown,true);
  }finally{globalThis.fetch=originalFetch;if(before)process.env.GEMMA_API_KEY=before;else delete process.env.GEMMA_API_KEY;}
});
test('invented evidence is rejected',async()=>{
  const before=process.env.GEMMA_API_KEY;
  const originalFetch=globalThis.fetch;
  process.env.GEMMA_API_KEY='test-key';
  globalThis.fetch=async()=>({ok:true,json:async()=>({candidates:[{content:{parts:[{text:JSON.stringify({answer:'Ada wrote it.',unknown:false,evidence:[{sourceId:'letter',quote:'Ada wrote the letter.'}]})}]}}]})});
  try{
    const out=response();
    await handler({method:'POST',body:{question:'Who wrote the letter?'},headers:{host:'example.test','x-forwarded-for':'198.51.100.3'}},out);
    assert.equal(out.statusCode,502);
  }finally{globalThis.fetch=originalFetch;if(before)process.env.GEMMA_API_KEY=before;else delete process.env.GEMMA_API_KEY;}
});
