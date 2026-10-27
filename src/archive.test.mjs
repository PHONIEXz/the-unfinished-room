import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateArchive } from './archive.mjs';
const fixture = () => JSON.parse(readFileSync(new URL('../fixtures/reading-room.json', import.meta.url), 'utf8'));

test('fictional demo has five source-backed objects', () => {
  const archive = fixture();
  assert.equal(archive.fictional, true);
  assert.equal(archive.objects.length, 5);
  assert.deepEqual(validateArchive(archive), { valid: true, errors: [] });
});

test('missing sources and duplicate IDs are rejected', () => {
  const archive = fixture();
  archive.sources.push({ ...archive.sources[0] });
  archive.objects[0].sourceIds.push('invented-source');
  archive.objects.push({ ...archive.objects[0] });
  const result = validateArchive(archive);
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('Duplicate source ID.'));
  assert.ok(result.errors.includes('Duplicate object ID.'));
  assert.ok(result.errors.includes('Object references a missing source.'));
});

test('malformed imports fail without throwing', () => {
  for (const value of [null, [], {}, 'text', { ...fixture(), sources: [null], objects: [null] }]) {
    assert.equal(validateArchive(value).valid, false);
  }
});

test('unknowns are preserved and fictional status must be explicit', () => {
  const archive = fixture();
  const original = structuredClone(archive);
  validateArchive(archive);
  assert.deepEqual(archive, original);
  delete archive.fictional;
  assert.equal(validateArchive(archive).valid, false);
});
