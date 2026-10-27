import { readFileSync } from 'node:fs';
import { buildPrompt, validateAnswer } from '../src/evidence.mjs';
const archive = JSON.parse(readFileSync(new URL('../fixtures/reading-room.json', import.meta.url), 'utf8'));
const model = 'gemma-4-26b-a4b-it';
const buckets = new Map();
export default async function handler(request, response) {
  response.setHeader('Cache-Control','no-store');
  response.setHeader('Content-Type','application/json; charset=utf-8');
  if (request.method === 'GET') return response.status(200).json({available:Boolean(process.env.GEMMA_API_KEY),model});
  if (request.method !== 'POST') return response.status(405).json({error:'Use POST.'});
  const key = process.env.GEMMA_API_KEY;
  if (!key) return response.status(503).json({error:'Live AI is not configured yet. The archive remains available.'});
  const question = request.body?.question;
  if (typeof question !== 'string' || question.trim().length < 3 || question.length > 300) return response.status(400).json({error:'Enter a question between 3 and 300 characters.'});
  const origin = request.headers.origin;
  const host = request.headers.host;
  if (origin && new URL(origin).host !== host) return response.status(403).json({error:'This request must come from this site.'});
  const identity = request.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'anonymous';
  const now = Date.now();
  for (const [id, state] of buckets) if (now - state.at > 60000) buckets.delete(id);
  const bucket = buckets.get(identity) || {at:now,count:0};
  if (now - bucket.at > 60000) { bucket.at=now; bucket.count=0; }
  if (++bucket.count > 6) return response.status(429).json({error:'Please wait a minute before asking more questions.'});
  buckets.set(identity,bucket);
  try {
    const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method:'POST',
      headers:{'Content-Type':'application/json','x-goog-api-key':key},
      body:JSON.stringify({contents:[{parts:[{text:buildPrompt(question.trim(),archive.sources)}]}],generationConfig:{maxOutputTokens:700,responseMimeType:'application/json'}}),
      signal:AbortSignal.timeout(28000)
    });
    if (!upstream.ok) {
      console.error('room_ai_upstream_error',upstream.status);
      return response.status(503).json({error:'The model is unavailable. Your discoveries are safe; please try later.'});
    }
    const payload = await upstream.json();
    const text = payload.candidates?.[0]?.content?.parts?.map(part=>part.text || '').join('') || '';
    let answer;
    try { answer = validateAnswer(JSON.parse(text),archive.sources); }
    catch { return response.status(502).json({error:'The model did not return a verifiable answer. Try another question.'}); }
    return response.status(200).json({...answer,model,fictional:true});
  } catch(error) {
    console.error('room_ai_request_failed',error?.name);
    return response.status(503).json({error:'The model did not finish. Your discoveries are safe; please retry.'});
  }
}
