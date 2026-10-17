import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
const path = new URL('../packages/offline/writer-starters.librerary.json', import.meta.url);
const bytes = readFileSync(path);
const pack = JSON.parse(bytes);
const trusted = [{ id: pack.id, version: pack.version, sha256: createHash('sha256').update(bytes).digest('hex') }];
if (process.argv.includes('--write')) {
  writeFileSync(new URL('../packages/offline/trusted.json', import.meta.url), JSON.stringify(trusted, null, 2) + '\n');
} else {
  const recorded = JSON.parse(readFileSync(new URL('../packages/offline/trusted.json', import.meta.url)));
  if (JSON.stringify(recorded) !== JSON.stringify(trusted)) throw new Error('Pinned offline package digest does not match release bytes');
  console.log('PASS: offline package SHA-256 matches pinned release');
}
