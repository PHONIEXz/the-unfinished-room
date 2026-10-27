import { mkdir, copyFile } from 'node:fs/promises';
import { validateArchive } from '../src/archive.mjs';
import { readFileSync } from 'node:fs';
const archive = JSON.parse(readFileSync(new URL('../fixtures/reading-room.json', import.meta.url)));
const result = validateArchive(archive);
if (!result.valid) throw new Error(result.errors.join('; '));
await mkdir('dist', { recursive: true });
for (const name of ['index.html', 'styles.css', 'app.js']) await copyFile(`web/${name}`, `dist/${name}`);
await copyFile('fixtures/reading-room.json', 'dist/reading-room.json');
