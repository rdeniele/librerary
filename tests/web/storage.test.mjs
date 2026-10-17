import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

const memory = new Map();
globalThis.localStorage = { getItem: key => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value) };
const { load, save, defaults } = await import('../../apps/launcher/src/storage.ts');
const key = 'librerary.workspace.v1';
beforeEach(() => memory.clear());

test('browser projects and preferences survive reload with Unicode', async () => {
  const state = defaults();
  state.documents = [{ id: 'test-1', title: 'Café 音楽', content: 'One\n二 🎵', updated_at: 123 }];
  state.settings.theme = 'dark';
  state.settings.pinned.push('studio');
  await save(state);
  assert.deepEqual(await load(), state);
});

test('unsupported versions are refused without changing original data', async () => {
  const original = JSON.stringify({ version: 999, state: defaults() });
  memory.set(key, original);
  await assert.rejects(load(), /version/);
  assert.equal(memory.get(key), original);
});

test('corrupt documents do not overwrite a valid browser workspace', async () => {
  await save(defaults());
  const original = memory.get(key);
  const invalid = defaults();
  invalid.documents = [{ id: '../escape', title: 'Unsafe', content: '', updated_at: 1 }];
  await assert.rejects(save(invalid), /Invalid document/);
  assert.equal(memory.get(key), original);
});

test('storage quota failure remains visible and keeps old workspace', async () => {
  await save(defaults());
  const original = memory.get(key);
  const setter = localStorage.setItem;
  localStorage.setItem = () => { throw new Error('Quota exceeded'); };
  try { await assert.rejects(save(defaults()), /Quota exceeded/); }
  finally { localStorage.setItem = setter; }
  assert.equal(memory.get(key), original);
});

test('malformed JSON is not silently reset', async () => {
  memory.set(key, '{broken');
  await assert.rejects(load());
  assert.equal(memory.get(key), '{broken');
});
