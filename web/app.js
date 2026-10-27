import {storageKey,readPersonal} from './personal.mjs';
const personal = new URLSearchParams(location.search).get('personal')==='1';
const descriptions = {
  photograph: 'A small note is written on the back. It names the year and the children, but not the photographer.',
  letter: 'The writer cared about a lamp by the window. They never signed their name.',
  radio: 'Two different sources remember this radio: one says it was repaired; another remembers listening before reading aloud.',
  clock: 'The clock stopped at four. The letter does not say when, or why.',
  frame: 'The empty place in the story: who started this room, and who recorded its first day?'
};
let personalError=false;
const archive = personal ? (()=>{try{return readPersonal(localStorage.getItem(storageKey));}catch{personalError=true;return null;}})() : await fetch('/reading-room.json').then(response => {
  if (!response.ok) throw new Error('Could not load the archive.');
  return response.json();
}).catch(() => null);
if(personal){
 document.querySelector('#ask-title').closest('section').remove();
 document.querySelector('#room-title').textContent=archive?.title || 'Your room is not available';
 document.title=(archive?.title || 'Your room')+' | The Unfinished Room';
 document.querySelector('.section-heading .eyebrow').textContent=archive?.fictional ? 'YOUR ARCHIVE / A FICTIONAL STORY' : 'YOUR PERSONAL ARCHIVE';
 document.querySelector('.room-intro-content .eyebrow').textContent=archive?.fictional ? 'YOUR FICTIONAL ARCHIVE' : 'YOUR PERSONAL ARCHIVE';
 document.querySelector('.room-intro-content p').textContent='Your words, your sources. Open an object to read its memory.';
 document.querySelector('.room-nav').replaceChildren(Object.assign(document.createElement('a'),{href:'/create/',textContent:'Edit your room →'}),Object.assign(document.createElement('a'),{href:'/room/',textContent:'Fictional demo'}));
 document.querySelector('.outro p').textContent='This room is saved on this browser. Return to the editor to update it or download a backup. Your source text has not been sent to AI.';
 document.querySelector('.outro a').href='/create/';document.querySelector('.outro a').textContent='Edit and back up your room →';
 for(const b of document.querySelectorAll('.object')){
  const object=archive?.objects.find(o=>o.id===b.dataset.id);
  if(!object){b.remove();document.querySelector(`[data-open="${b.dataset.id}"]`)?.remove();continue;}
  b.querySelector('span:last-child').textContent=object.title;
  document.querySelector(`[data-open="${object.id}"]`).textContent=object.title;
  descriptions[object.id]='Source text you saved. Dates and identities are recorded as you supplied them.';
 }
}
const buttons = [...document.querySelectorAll('.object')];
const dialog = document.querySelector('#evidence');
const progressKey = personal ? 'unfinished-room-personal-progress-'+JSON.stringify(archive) : 'unfinished-room-demo-v1';
let saved = [];
try { saved = JSON.parse(sessionStorage.getItem(progressKey) || '[]'); } catch { /* Corrupt session data is ignored. */ }
const knownIds = new Set(buttons.map(button => button.dataset.id));
const discovered = new Set(Array.isArray(saved) ? saved.filter(id => knownIds.has(id)) : []);
let current = '';
let restoreFocus = null;
function render() {
  try { sessionStorage.setItem(progressKey, JSON.stringify([...discovered])); } catch { /* The room still works if storage is unavailable. */ }
  document.querySelector('.room-bottom span').textContent = 'SELECT AN OBJECT TO BEGIN';
  document.querySelector('#count').textContent = `${discovered.size} / ${buttons.length}`;
  document.querySelector('#scene').style.setProperty('--warmth', discovered.size / (buttons.length || 1));
  buttons.forEach(button => button.classList.toggle('found', discovered.has(button.dataset.id)));
  const list = document.querySelector('#discovery-list');
  list.replaceChildren();
  if (!discovered.size) {
    const item = document.createElement('li');
    item.className = 'empty';
    item.textContent = 'The pages are still blank. Explore an object to begin.';
    list.append(item);
  } else {
    buttons.filter(button => discovered.has(button.dataset.id)).forEach(button => {
      const item = document.createElement('li');
      const heading = document.createElement('strong');
      heading.textContent = button.querySelector('span:last-child').textContent.trim();
      const copy = document.createElement('span');
      copy.textContent = descriptions[button.dataset.id];
      item.append(heading, copy);
      list.append(item);
    });
    if (discovered.size === buttons.length) {
      const item = document.createElement('li');
      item.className = 'ending';
      item.textContent = personal ? (archive.openQuestions.length ? 'Still open: '+archive.openQuestions.join(' · ') : 'You have explored every saved object. Add any unanswered questions in the editor.') : 'The room was a place where children gathered to read. Its lamp signaled that it was open. Who began it remains unknown.';
      list.append(item);
      document.querySelector('.room-bottom span').textContent = personal ? 'ALL SAVED OBJECTS EXPLORED' : 'THE STORY IS RECOVERED · SOME QUESTIONS REMAIN OPEN';
    }
  }
}
function openObject(id, trigger = null) {
  if (!archive) return;
  const object = archive.objects.find(value => value.id === id);
  if (!object) return;
  current = id;
  restoreFocus = trigger || buttons.find(button => button.dataset.id === id);
  discovered.add(id);
  render();
  document.querySelector('#object-number').textContent = `OBJECT ${String(buttons.findIndex(button => button.dataset.id === id) + 1).padStart(2, '0')} / ${buttons.length}`;
  document.querySelector('#object-title').textContent = object.title;
  document.querySelector('#object-lede').textContent = descriptions[id];
  const sourceContainer = document.querySelector('#sources');
  sourceContainer.replaceChildren();
  object.sourceIds.forEach(sourceId => {
    const source = archive.sources.find(value => value.id === sourceId);
    if (!source) return;
    const article = document.createElement('article');
    const label = document.createElement('span');
    label.className = 'source-label';
    label.textContent = `ARCHIVE SOURCE · ${source.title}`;
    const quote = document.createElement('blockquote');
    quote.textContent = source.text;
    article.append(label, quote);
    sourceContainer.append(article);
  });
  dialog.showModal();
}
buttons.forEach(button => button.addEventListener('click', () => openObject(button.dataset.id, button)));
document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => openObject(button.dataset.open, button)));
document.querySelector('#close').addEventListener('click', () => dialog.close());
document.querySelector('#next-object').addEventListener('click', () => {
  const index = buttons.findIndex(button => button.dataset.id === current);
  dialog.close();
  openObject(buttons[(index + 1) % buttons.length].dataset.id);
});
document.querySelector('#reset').addEventListener('click', () => { discovered.clear(); render(); buttons[0]?.focus(); });
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => restoreFocus?.focus());
render();
if (!archive) {
  document.querySelector('.room-bottom span').textContent = personalError ? 'NO VALID SAVED ROOM · OPEN THE EDITOR TO CREATE OR RESTORE ONE' : 'ARCHIVE UNAVAILABLE · PLEASE RELOAD';
  buttons.forEach(button => button.disabled = true);
}
const askForm = document.querySelector('#ask-form');
if (askForm) {
  fetch('/api/ask').then(response => response.json()).then(status => {
    if (!status.available) {
      const submit = document.querySelector('#ask-submit');
      submit.disabled = true;
      submit.textContent = 'Gemma is not connected yet';
      document.querySelector('#answer').textContent = 'The live model has not been configured for this project. Explore the sources while the connection is prepared.';
    }
  }).catch(() => {
    document.querySelector('#answer').textContent = 'Model availability could not be checked. Your archive discoveries remain available.';
  });
}
askForm?.addEventListener('submit',async event => {
  event.preventDefault();
  if (!askForm.reportValidity()) return;
  const submit = document.querySelector('#ask-submit');
  const answerArea = document.querySelector('#answer');
  if (submit.disabled) return;
  submit.disabled = true;
  answerArea.replaceChildren();
  const waiting = document.createElement('p');
  waiting.textContent = 'Reading the archive…';
  answerArea.append(waiting);
  try {
    const result = await fetch('/api/ask',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:document.querySelector('#question').value})});
    const body = await result.json();
    if (!result.ok) throw new Error(body.error || 'The archive could not answer just now.');
    answerArea.replaceChildren();
    const label = document.createElement('strong');
    label.textContent = body.unknown ? 'NOT ESTABLISHED BY THE ARCHIVE' : 'SOURCE PASSAGE · CHECK RELEVANCE';
    const answer = document.createElement('p');
    answer.textContent = body.answer;
    answerArea.append(label,answer);
    body.evidence.forEach(source => {
      const item = document.createElement('blockquote');
      const title = document.createElement('cite');
      title.textContent = source.title;
      const quote = document.createElement('span');
      quote.textContent = source.quote;
      item.append(title,quote);
      answerArea.append(item);
    });
    const note = document.createElement('small');
    note.textContent = body.unknown
      ? `Classified as unanswered by ${body.model}; no quotation is offered as proof of absence. Fictional demo.`
      : `Selected by ${body.model}. Answer text comes directly from the sources. Check that the passage answers your question. Fictional demo.`;
    answerArea.append(note);
  } catch (error) {
    answerArea.replaceChildren();
    const message = document.createElement('p');
    message.textContent = error.message;
    answerArea.append(message);
  } finally { submit.disabled = false; }
});
