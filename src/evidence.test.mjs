import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateAnswer, buildPrompt, parseModelJson } from './evidence.mjs';
const sources = JSON.parse(readFileSync(new URL('../fixtures/reading-room.json', import.meta.url))).sources;
test('validates exact source excerpt and source ID', () => {
  const answer = validateAnswer({answer:'The first circle is dated 1998.',unknown:false,evidence:[{sourceId:'photo-note',quote:'Our first Saturday reading circle, 1998.'}]},sources);
  assert.equal(answer.evidence[0].title,'Behind the photograph');
  assert.throws(()=>validateAnswer({answer:'Invented.',unknown:false,evidence:[{sourceId:'photo-note',quote:'A person named Ada built it.'}]},sources));
  assert.throws(()=>validateAnswer({answer:'Invented.',unknown:false,evidence:[]},sources));
});
test('unknown must have no proof citations and cannot become a known answer',()=>{
  assert.equal(validateAnswer({answer:'The photographer is not named.',unknown:true,evidence:[]},sources).unknown,true);
  assert.throws(()=>validateAnswer({answer:'Unknown',unknown:true,evidence:[{sourceId:'photo-note',quote:'Our first Saturday reading circle, 1998.'}]},sources));
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
