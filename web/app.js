const descriptions = {
  photograph: 'A small note is written on the back. It names the year and the children, but not the photographer.',
  letter: 'The writer cared about a lamp by the window. They never signed their name.',
  radio: 'Two different sources remember this radio: one says it was repaired; another remembers listening before reading aloud.',
  clock: 'The clock stopped at four. The letter does not say when, or why.',
  frame: 'The empty place in the story: who started this room, and who recorded its first day?'
};
const archive = await fetch('/reading-room.json').then(response => {
  if (!response.ok) throw new Error('Could not load the archive.');
  return response.json();
}).catch(() => null);
const buttons = [...document.querySelectorAll('.object')];
const dialog = document.querySelector('#evidence');
const progressKey = 'unfinished-room-demo-v1';
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
  document.querySelector('#scene').style.setProperty('--warmth', discovered.size / buttons.length);
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
      item.textContent = 'The room was a place where children gathered to read. Its lamp signaled that it was open. Who began it remains unknown.';
      list.append(item);
      document.querySelector('.room-bottom span').textContent = 'THE STORY IS RECOVERED · SOME QUESTIONS REMAIN OPEN';
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
  document.querySelector('#object-number').textContent = `OBJECT ${String(buttons.findIndex(button => button.dataset.id === id) + 1).padStart(2, '0')} / 05`;
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
document.querySelector('#reset').addEventListener('click', () => { discovered.clear(); render(); buttons[0].focus(); });
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => restoreFocus?.focus());
if (!archive) {
  document.querySelector('.room-bottom span').textContent = 'ARCHIVE UNAVAILABLE · PLEASE RELOAD';
  buttons.forEach(button => button.disabled = true);
}
render();
