// Structural integrity only. This does not establish historical truth or AI grounding.
const isText = value => typeof value === 'string' && value.trim().length > 0;

export function validateArchive(archive) {
  const errors = [];
  if (!archive || typeof archive !== 'object' || Array.isArray(archive)) {
    return { valid: false, errors: ['Archive must be an object.'] };
  }
  if (archive.schemaVersion !== 1) errors.push('Unsupported schema version.');
  if (!isText(archive.title)) errors.push('Archive title is required.');
  if (typeof archive.fictional !== 'boolean') errors.push('Fictional status must be explicit.');
  const sources = Array.isArray(archive.sources) ? archive.sources : [];
  const objects = Array.isArray(archive.objects) ? archive.objects : [];
  if (!sources.length) errors.push('At least one source is required.');
  if (!objects.length) errors.push('At least one object is required.');
  const sourceIds = new Set();
  for (const source of sources) {
    if (!source || !isText(source.id) || !isText(source.title) || !isText(source.text) || source.type !== 'text') {
      errors.push('Each source needs an ID, title, text, and supported type.');
      continue;
    }
    if (sourceIds.has(source.id)) errors.push('Duplicate source ID.');
    sourceIds.add(source.id);
  }
  const objectIds = new Set();
  for (const object of objects) {
    if (!object || !isText(object.id) || !isText(object.title)) {
      errors.push('Each object needs an ID and title.');
      continue;
    }
    if (objectIds.has(object.id)) errors.push('Duplicate object ID.');
    objectIds.add(object.id);
    if (!Array.isArray(object.sourceIds) || !object.sourceIds.length) {
      errors.push('Object needs sources.');
    } else {
      for (const id of object.sourceIds) {
        if (!sourceIds.has(id)) errors.push('Object references a missing source.');
      }
    }
  }
  if (!Array.isArray(archive.openQuestions) || !archive.openQuestions.every(isText)) {
    errors.push('Open questions must be an array of nonempty strings.');
  }
  return { valid: errors.length === 0, errors };
}
