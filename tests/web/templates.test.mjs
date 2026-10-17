import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const memory = new Map();
globalThis.localStorage = {getItem:key=>memory.get(key)??null,setItem:(key,value)=>memory.set(key,value),removeItem:key=>memory.delete(key)};
const { installBrowserPackage, listPackages, removePackage } = await import('../../apps/launcher/src/templates.ts');
const { save, load, defaults } = await import('../../apps/launcher/src/storage.ts');
const raw = await readFile(new URL('../../packages/offline/writer-starters.librerary.json',import.meta.url),'utf8');
beforeEach(()=>memory.clear());

test('verified package installs and reopens in browser with its three templates',async()=>{
  assert.equal((await listPackages()).length,0);
  assert.equal((await installBrowserPackage(raw))[0].templates.length,3);
  assert.equal((await listPackages())[0].id,'writer-starters');
});
test('modified package is refused without replacing an installed release',async()=>{
  await installBrowserPackage(raw);
  await assert.rejects(installBrowserPackage(raw+' '),/unknown or modified/);
  assert.equal((await listPackages())[0].templates.length,3);
});
test('uninstall retains projects copied from templates',async()=>{
  const [pack]=await installBrowserPackage(raw); const state=defaults();
  state.documents=[{id:'project-1',title:pack.templates[0].title,content:pack.templates[0].content+'User edits 音楽',updated_at:1}];
  await save(state); await removePackage(pack.id);
  assert.equal((await listPackages()).length,0); assert.deepEqual(await load(),state);
});
test('tampered persisted package cannot be rendered as trusted templates',async()=>{
  memory.set('librerary.content-packages.v1',raw.replace('Meeting notes','Tampered'));
  await assert.rejects(listPackages(),/unknown or modified/);
});
