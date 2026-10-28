import test from 'node:test';import assert from 'node:assert/strict';import handler from './arrange.mjs';
const body={consent:true,roomType:'parlour',description:'A quiet parlour with cream walls and a sofa.',objects:[]};
function response(){return {statusCode:200,setHeader(){},status(n){this.statusCode=n;return this;},json(v){this.body=v;return this;}};}
test('arrangement rejects missing consent, private fields and malformed origins before provider call',async()=>{
 const before=globalThis.fetch;let calls=0;globalThis.fetch=async()=>{calls++;throw Error('must not call');};
 try{for(const [b,headers,code]of [[{...body,consent:false},{},400],[{...body,images:[]},{},400],[body,{origin:'not a url'},400],[body,{origin:'https://other.test',host:'site.test'},403]]){const res=response();await handler({method:'POST',body:b,headers},res);assert.equal(res.statusCode,code);}assert.equal(calls,0);}finally{globalThis.fetch=before;}
});
test('arrangement returns validated provider result and rejects invented memory fields',async()=>{
 const key=process.env.GEMMA_API_KEY,originalFetch=globalThis.fetch;process.env.GEMMA_API_KEY='test-key';let sent;
 const plan={summary:'A quiet parlour.',decor:{palette:'cream',floor:'wood',lamp:true,timeOfDay:'dusk'},objects:[],additions:[{kind:'sofa',surface:'floor',color:'#7f3e44',x:30,y:20,rotation:0,size:100}]};
 globalThis.fetch=async(url,options)=>{sent=JSON.parse(options.body);return {ok:true,json:async()=>({candidates:[{content:{parts:[{text:JSON.stringify(plan)}]}}]})};};
 try{let res=response();await handler({method:'POST',body,headers:{'x-forwarded-for':'test-valid'}},res);assert.equal(res.statusCode,200);assert.deepEqual(res.body.plan,plan);assert.ok(!JSON.stringify(sent).includes('test-key'));plan.additions[0].text='Invented family history';res=response();await handler({method:'POST',body,headers:{'x-forwarded-for':'test-invalid'}},res);assert.equal(res.statusCode,502);assert.match(res.body.error,/unchanged/);}finally{globalThis.fetch=originalFetch;if(key)process.env.GEMMA_API_KEY=key;else delete process.env.GEMMA_API_KEY;}
});
test('Groq selection uses server credentials and returns a validated provider-labelled plan',async()=>{
 const before=globalThis.fetch,key=process.env.GROQ_API_KEY;process.env.GROQ_API_KEY='private-test-key';let sent;
 const plan={summary:'A bright room.',decor:{palette:'cream',floor:'wood',lamp:true,timeOfDay:'day'},objects:[],additions:[{kind:'sofa',surface:'floor',color:'#7f3e44',x:30,y:20,rotation:0,size:100}]};
 globalThis.fetch=async(url,options)=>{sent={url,...options};return {ok:true,json:async()=>({choices:[{message:{content:JSON.stringify(plan)}}]})};};
 try{const res=response();await handler({method:'POST',headers:{'x-forwarded-for':'groq-success'},body:{...body,provider:'groq'}},res);assert.equal(res.statusCode,200);assert.equal(res.body.provider,'groq');assert.equal(res.body.model,'openai/gpt-oss-20b');assert.equal(sent.headers.Authorization,'Bearer private-test-key');assert.match(sent.url,/api.groq.com/);assert.ok(!sent.body.includes('private-test-key'));assert.deepEqual(res.body.plan,plan);}finally{globalThis.fetch=before;if(key)process.env.GROQ_API_KEY=key;else delete process.env.GROQ_API_KEY;}
});
test('Automatic falls back after transient failure but explicit Google never switches',async()=>{
 const before=globalThis.fetch,g=process.env.GROQ_API_KEY,k=process.env.GEMMA_API_KEY;process.env.GROQ_API_KEY='groq';process.env.GEMMA_API_KEY='google';let groqCalls=0;
 const plan={summary:'A bright room.',decor:{palette:'cream',floor:'wood',lamp:true,timeOfDay:'day'},objects:[],additions:[{kind:'sofa',surface:'floor',color:'#7f3e44',x:30,y:20,rotation:0,size:100}]};
 globalThis.fetch=async(url)=>{if(url.includes('googleapis'))throw Object.assign(Error('timeout'),{name:'TimeoutError'});groqCalls++;return {ok:true,json:async()=>({choices:[{message:{content:JSON.stringify(plan)}}]})};};
 try{let res=response();await handler({method:'POST',headers:{'x-forwarded-for':'auto-test'},body:{...body,provider:'auto'}},res);assert.equal(res.statusCode,200);assert.equal(res.body.fallback,true);assert.equal(groqCalls,1);res=response();await handler({method:'POST',headers:{'x-forwarded-for':'explicit-test'},body:{...body,provider:'google'}},res);assert.equal(res.statusCode,503);assert.equal(groqCalls,1);}finally{globalThis.fetch=before;for(const [name,value]of [['GROQ_API_KEY',g],['GEMMA_API_KEY',k]])if(value)process.env[name]=value;else delete process.env[name];}
});
