import {requestModel} from '../src/provider.mjs';
import {parseModelJson,finalResponseText} from '../src/evidence.mjs';
import {arrangementInput,arrangementPrompt,validateArrangement} from '../web/arrangement.mjs';
const model='gemma-4-26b-a4b-it',buckets=new Map();
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json; charset=utf-8');
 if(req.method==='GET')return res.status(200).json({available:Boolean(process.env.GEMMA_API_KEY),model});
 if(req.method!=='POST')return res.status(405).json({error:'Use POST.'});
 try{if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)return res.status(403).json({error:'Use this site to request a layout.'});}catch{return res.status(400).json({error:'Invalid request origin.'});}
 if(Number(req.headers['content-length'])>12000)return res.status(413).json({error:'Room brief is too large.'});
 let input;try{input=arrangementInput(req.body);}catch(e){return res.status(400).json({error:e.message});}
 if(!process.env.GEMMA_API_KEY)return res.status(503).json({error:'AI arrangement is not configured. You can still arrange your room manually.'});
 const now=Date.now(),identity=req.headers['x-forwarded-for']?.split(',')[0]?.trim()||'anonymous';for(const [id,b]of buckets)if(now-b.at>60000)buckets.delete(id);const bucket=buckets.get(identity)||{at:now,count:0};buckets.set(identity,bucket);if(++bucket.count>3)return res.status(429).json({error:'Please wait a minute before requesting another layout.'});
 try{
  const payload=await requestModel(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':process.env.GEMMA_API_KEY},body:JSON.stringify({contents:[{parts:[{text:arrangementPrompt(input)}]}],generationConfig:{maxOutputTokens:2600,responseMimeType:'application/json',thinkingConfig:{thinkingLevel:'minimal'}}})},{budgetMs:55000,attemptTimeoutMs:45000});
  let plan;try{plan=validateArrangement(parseModelJson(finalResponseText(payload.candidates?.[0]?.content?.parts)),input);}catch(error){console.warn('room_arrangement_invalid',JSON.stringify({reason:error instanceof SyntaxError?'invalid_json':error.message,finishReason:payload.candidates?.[0]?.finishReason||'missing'}));return res.status(502).json({error:'The model returned an unusable layout. Your room is unchanged. Try again with a clearer brief.'});}
  return res.status(200).json({plan,model});
 }catch(error){console.warn('room_arrangement_failed',JSON.stringify({name:error?.name,status:error?.status||null}));return res.status(503).json({error:'The model did not finish the arrangement. Your room is unchanged. Please retry.'});}
}
