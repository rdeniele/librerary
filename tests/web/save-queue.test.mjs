import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SaveQueue } from '../../apps/launcher/src/save-queue.ts';

test('rapid edits coalesce into one write of the newest snapshot', async () => {
  const written = []; const statuses = [];
  const queue = new SaveQueue(async value => { written.push(value); }, status => statuses.push(status), 60_000);
  queue.update('a'); queue.update('ab'); queue.update('abc');
  assert.equal(queue.pending, true); await queue.flush();
  assert.deepEqual(written, ['abc']); assert.equal(queue.pending, false); assert.equal(statuses.at(-1), 'saved');
});

test('slow writes are serialized while intermediate snapshots are discarded', async () => {
  const written = []; let release;
  const blocked = new Promise(resolve => { release = resolve; });
  const queue = new SaveQueue(async value => { if (value === 1) await blocked; written.push(value); }, () => {}, 60_000);
  queue.update(1); const flushed = queue.flush(); queue.update(2); queue.update(3); release(); await flushed;
  assert.deepEqual(written, [1,3]); assert.equal(queue.pending, false);
});

test('failure remains pending and retry preserves newest edits', async () => {
  const written = []; let failed = true;
  const queue = new SaveQueue(async value => { if (failed) throw new Error('Disk full'); written.push(value); }, () => {}, 60_000);
  queue.update('old'); await assert.rejects(queue.flush(), /Disk full/); assert.equal(queue.pending,true);
  queue.update('newest'); failed=false; await queue.flush();
  assert.deepEqual(written,['newest']); assert.equal(queue.pending,false);
});

test('concurrent close/save flush callers wait for every outstanding edit', async () => {
  let release; const written=[];
  const blocked = new Promise(resolve => { release=resolve; });
  const queue = new SaveQueue(async value => { if (value==='first') await blocked; written.push(value); },()=>{},60_000);
  queue.update('first'); const a=queue.flush(); queue.update('last'); const b=queue.flush(); release(); await Promise.all([a,b]);
  assert.deepEqual(written,['first','last']); assert.equal(queue.pending,false);
});

test('a synchronously throwing adapter does not leave the queue stuck', async () => {
  let fail=true; const written=[];
  const queue=new SaveQueue(value=>{if(fail) throw new Error('Immediate failure'); written.push(value); return Promise.resolve();},()=>{},60_000);
  queue.update('keep'); await assert.rejects(queue.flush(),/Immediate failure/);
  fail=false; await queue.flush(); assert.deepEqual(written,['keep']); assert.equal(queue.pending,false);
});
