import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateAnswer, buildPrompt, parseModelJson, finalResponseText } from './evidence.mjs';
const sources = JSON.parse(readFileSync(new URL('../fixtures/reading-room.json', import.meta.url))).sources;
test('validates exact source excerpt and source ID', () => {
  const answer = validateAnswer({answer:'The first circle is dated 1998.',unknown:false,evidence:[{sourceId:'photo-note',quote:'Our first Saturday reading circle, 1998.'}]},sources);
  assert.equal(answer.evidence[0].title,'Behind the photograph');
  assert.throws(()=>validateAnswer({answer:'Invented.',unknown:false,evidence:[{sourceId:'photo-note',quote:'A person named Ada built it.'}]},sources));
  assert.throws(()=>validateAnswer({answer:'Invented.',unknown:false,evidence:[]},sources));
});
test('unknown is rendered without an invented detail or proof citation',()=>{
  const expected={answer:'The archive does not establish an answer to that question.',unknown:true,evidence:[]};
  assert.deepEqual(validateAnswer({answer:'The photographer is not named.',unknown:true,evidence:[]},sources),expected);
  assert.deepEqual(validateAnswer({answer:'It was Ada.',unknown:true,evidence:[{sourceId:'photo-note',quote:'The person behind the camera is not named.'}]},sources),expected);
  assert.throws(()=>validateAnswer({answer:'Unknown',unknown:true,evidence:[{sourceId:'photo-note',quote:'Fabricated quote longer than twelve characters.'}]},sources));
  assert.throws(()=>validateAnswer({answer:'It was Ada.',unknown:false,evidence:[]},sources));
});
test('prompt distinguishes instructions from archive text',()=>{
  assert.match(buildPrompt('Who was the photographer?',sources),/UNTRUSTED ARCHIVE/);
  assert.match(buildPrompt('Who was the photographer?',sources),/Never invent/);
});
test('extracts complete JSON surrounded by prose or a code fence',()=>{
  const raw='Here is the answer: ```json\n{"answer":"A { room }","unknown":true,"evidence":[]}\n```';
  assert.equal(parseModelJson(raw).answer,'A { room }');
  assert.equal(parseModelJson('Example: {"sourceId":"letter","quote":"some words"}\nFinal: {"answer":"Unknown","unknown":true,"evidence":[]}').unknown,true);
  assert.throws(()=>parseModelJson('{"answer":'),SyntaxError);
});
test('keeps final answer text separate from thought parts',()=>{
  const parts=[{thought:true,text:'A long private analysis with {bad json}.'},{text:'{"answer":"The room was open.","unknown":false,"evidence":[]}'}];
  assert.equal(finalResponseText(parts),'{"answer":"The room was open.","unknown":false,"evidence":[]}');
  assert.equal(finalResponseText([{thought:true,text:'No final part'}]),'');
});
