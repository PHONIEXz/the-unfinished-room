import {requestModel} from './provider.mjs';
import {parseModelJson,finalResponseText} from './evidence.mjs';
import {arrangementPrompt,validateArrangement} from '../web/arrangement.mjs';
// Repair requests contain only the original consented geometry and a controlled validation reason.
// Never send a raw rejected response back to the provider or put it in logs.
export async function generateArrangement(input,{url,key,request=requestModel,now=Date.now,onInvalid=()=>{}}={}){
 const deadline=now()+55000;let reason='';
 for(let pass=0;pass<2;pass++){
  const remaining=deadline-now();if(remaining<1500)throw Object.assign(Error('Arrangement deadline exceeded'),{name:'TimeoutError'});
  const prompt=arrangementPrompt(input)+(pass?'\nThe previous attempt did not pass local validation: '+reason+' Return a fresh complete JSON object using ONLY the exact schema above. Do not add explanations outside JSON.':'');
  const payload=await request(url,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{maxOutputTokens:3200,responseMimeType:'application/json',thinkingConfig:{thinkingLevel:'minimal'}}})},{budgetMs:Math.min(remaining,pass?remaining:40000),attemptTimeoutMs:30000,maxAttempts:pass?1:2});
  try{return {plan:validateArrangement(parseModelJson(finalResponseText(payload.candidates?.[0]?.content?.parts)),input),repaired:pass===1};}
  catch(error){reason=error instanceof SyntaxError?'invalid_json':error.message;onInvalid({reason,finishReason:payload.candidates?.[0]?.finishReason||'missing',pass:pass+1});if(pass===1)throw Object.assign(Error('The model returned an unusable layout. Your room is unchanged. Please retry.'),{status:502});}
 }
}
