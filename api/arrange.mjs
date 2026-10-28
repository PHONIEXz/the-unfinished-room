import {generateArrangement} from '../src/arrange-model.mjs';
import {arrangementInput} from '../web/arrangement.mjs';
const model='gemma-4-26b-a4b-it',groqModel='openai/gpt-oss-20b',buckets=new Map();
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json; charset=utf-8');
 if(req.method==='GET')return res.status(200).json({available:Boolean(process.env.GEMMA_API_KEY||process.env.GROQ_API_KEY),model,providers:{google:Boolean(process.env.GEMMA_API_KEY),groq:Boolean(process.env.GROQ_API_KEY)}});
 if(req.method!=='POST')return res.status(405).json({error:'Use POST.'});
 try{if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)return res.status(403).json({error:'Use this site to request a layout.'});}catch{return res.status(400).json({error:'Invalid request origin.'});}
 if(Number(req.headers['content-length'])>12000)return res.status(413).json({error:'Room brief is too large.'});
 const choice=req.body?.provider||'google';if(!['auto','google','groq'].includes(choice))return res.status(400).json({error:'Choose Automatic, Google Gemma or Groq.'});
 let input;try{const {provider,...brief}=req.body||{};input=arrangementInput(brief);}catch(e){return res.status(400).json({error:e.message});}
 const providers=(choice==='auto'?['google','groq']:[choice]).filter(p=>p==='google'?process.env.GEMMA_API_KEY:process.env.GROQ_API_KEY);
 if(!providers.length)return res.status(503).json({error:'AI arrangement is not configured. You can still arrange your room manually.'});
 const now=Date.now(),identity=req.headers['x-forwarded-for']?.split(',')[0]?.trim()||'anonymous';for(const [id,b]of buckets)if(now-b.at>60000)buckets.delete(id);const bucket=buckets.get(identity)||{at:now,count:0};buckets.set(identity,bucket);if(++bucket.count>3)return res.status(429).json({error:'Please wait a minute before requesting another layout.'});
 try{
  for(let i=0;i<providers.length;i++){
   const provider=providers[i],selectedModel=provider==='google'?model:groqModel;
   try{
    const {plan,repaired}=await generateArrangement(input,{provider,model:selectedModel,budgetMs:providers.length>1?26000:55000,url:provider==='google'?`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`:'https://api.groq.com/openai/v1/chat/completions',key:provider==='google'?process.env.GEMMA_API_KEY:process.env.GROQ_API_KEY,onInvalid:detail=>console.warn('room_arrangement_invalid',JSON.stringify({provider,...detail}))});
    return res.status(200).json({plan,model:selectedModel,provider,repaired,fallback:i>0});
   }catch(error){
    const retryable=[429,500,502,503,504].includes(error.status)||['TimeoutError','AbortError','TypeError'].includes(error.name);
    if(choice!=='auto'||!retryable||i===providers.length-1)throw error;
    console.warn('room_arrangement_fallback',JSON.stringify({provider,status:error.status||error.name}));
   }
  }
 }catch(error){console.warn('room_arrangement_failed',JSON.stringify({name:error?.name,status:error?.status||null}));return res.status(error?.status===502?502:503).json({error:error?.status===502?error.message:'The model did not finish the arrangement. Your room is unchanged. Please retry.'});}
}
