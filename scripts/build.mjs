import {build} from 'esbuild';
import { mkdir, copyFile } from 'node:fs/promises';
import { validateArchive } from '../src/archive.mjs';
import { readFileSync } from 'node:fs';
const archive = JSON.parse(readFileSync(new URL('../fixtures/reading-room.json', import.meta.url)));
const result = validateArchive(archive);
if (!result.valid) throw new Error(result.errors.join('; '));
await mkdir('dist/room', { recursive: true });
await mkdir('dist/keepsake',{recursive:true});
await copyFile('web/keepsake.html','dist/keepsake/index.html');
await copyFile('web/keepsake.js','dist/keepsake.js');
await mkdir('dist/create', { recursive: true });
await copyFile('web/create.html', 'dist/create/index.html');
for (const name of ['index.html', 'styles.css', 'app.js', 'favicon.svg', 'creator.js', 'personal.mjs', 'room-layout.mjs', 'arrangement.mjs', 'finishes.mjs', 'shell.mjs', 'images.mjs', 'decor.mjs', 'placement.mjs', 'camera.mjs', 'interior.mjs']) await copyFile(`web/${name}`, `dist/${name}`);
await copyFile('web/room.html', 'dist/room/index.html');
await copyFile('fixtures/reading-room.json', 'dist/reading-room.json');

await mkdir('dist/assets',{recursive:true});
for(const name of ['vintage-radio.glb','radio-license.txt'])await copyFile('web/assets/'+name,'dist/assets/'+name);
await build({entryPoints:['web/radio-preview.js'],bundle:true,minify:true,format:'esm',outfile:'dist/radio-preview.js',target:'es2022'});

await build({entryPoints:['web/room-three.js'],bundle:true,minify:true,format:'esm',outfile:'dist/room-three.js',target:'es2022'});
