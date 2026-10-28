import {recoverLayout,limitRequestedAdditions} from './layout-recovery.mjs';
import {arrangementReport} from '../web/finishes.mjs';
import {requestModel} from './provider.mjs';
import {parseModelJson,finalResponseText} from './evidence.mjs';
import {arrangementPrompt,validateArrangement} from '../web/arrangement.mjs';
export function parseArrangementJson(text){const raw=parseModelJson(text,p=>p&&typeof p==='object'&&['summary','decor','objects','additions'].every(k=>k in p));if(raw&&typeof raw==='object'&&!Array.isArray(raw)&&Object.keys(raw).length===1){for(const key of ['plan','layout'])if(key in raw)return raw[key];}return raw;}
function safeShape(raw){const known=['summary','decor','objects','additions','plan','layout','room','shell','furniture','lighting','materials','style','explanation','notes','answer','unknown','evidence','type','properties','required','roomType','description','consent'];return {type:Array.isArray(raw)?'array':raw===null?'null':typeof raw,knownKeys:raw&&typeof raw==='object'?known.filter(k=>Object.hasOwn(raw,k)):[]};}
// Repair requests contain only the original consented geometry and a controlled validation reason.
// Never send a raw rejected response back to the provider or put it in logs.
export async function generateArrangement(input,{url,key,request=requestModel,now=Date.now,onInvalid=()=>{},provider="google",model="openai/gpt-oss-20b",budgetMs=55000}={}){
 const deadline=now()+budgetMs;let reason='';
 for(let pass=0;pass<2;pass++){
  const remaining=deadline-now();if(remaining<1500)throw Object.assign(Error('Arrangement deadline exceeded'),{name:'TimeoutError'});
  const prompt=arrangementPrompt(input)+(pass?'\nThe previous attempt did not pass local validation: '+reason+' Return a fresh complete JSON object using ONLY the exact schema above. Do not add explanations outside JSON.':'');
  const groq=provider==='groq';
  const options={method:'POST',headers:groq?{'Content-Type':'application/json',Authorization:'Bearer '+key}:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify(groq?{model,messages:[{role:'user',content:prompt}],max_completion_tokens:5000,reasoning_effort:'low',response_format:{type:'json_object'}}:{contents:[{parts:[{text:prompt}]}],generationConfig:{maxOutputTokens:3200,responseMimeType:'application/json',thinkingConfig:{thinkingLevel:'minimal'}}})};
  const payload=await request(url,options,{budgetMs:Math.min(remaining,pass?remaining:Math.min(40000,budgetMs*.75)),attemptTimeoutMs:Math.min(30000,remaining),maxAttempts:pass?1:2});
  let raw;try{raw=parseArrangementJson(groq?payload.choices?.[0]?.message?.content:finalResponseText(payload.candidates?.[0]?.content?.parts));const recovery=recoverLayout(raw,input);const counted=limitRequestedAdditions(validateArrangement(recovery.raw,input),input.description);const plan=counted.plan;const report=arrangementReport(input.description,{decor:plan.decor,objects:[...plan.objects,...plan.additions]});const missing=report.unavailable?.filter(note=>/requested but not included|requested; \d+ included/.test(note))||[];if(missing.length&&plan.objects.length+plan.additions.length<12)throw Error('Missing requested furniture: '+missing.join(' ')+' Include these within the twelve-object limit.');return {plan,repaired:pass===1,recovery:{preserved:recovery.preserved,reclassified:recovery.reclassified,trimmed:counted.trimmed}};}
  catch(error){reason=error instanceof SyntaxError?'invalid_json':error.message;onInvalid({reason,shape:safeShape(raw),finishReason:(groq?payload.choices?.[0]?.finish_reason:payload.candidates?.[0]?.finishReason)||'missing',pass:pass+1});if(pass===1)throw Object.assign(Error(reason.startsWith('Missing requested furniture:')?'The AI left out requested furniture after a retry. Your room is unchanged. Try the other provider or a smaller request.':'The AI could not produce a valid room plan after a retry. Your room is unchanged. Try the other provider or simplify the furniture list.'),{status:502});}
 }
}
