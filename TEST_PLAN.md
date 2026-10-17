# Test plan

## Recorded checks

Verified 2026-10-17: frontend build, native check and `npm run desktop:build -- --debug` passed. 17 Rust core tests and 14 browser tests passed; package digest verification passed. Formatting passed.

Browser UI: create/edit Unicode multiline text, reload/reopen, TXT export bytes, pinning/search/themes and Sound-category→Workspace Writer-search regression passed. Independent Apple visual review returned ship after desktop/narrow and light/dark checks. Native smoke with isolated test data/profile found a responding window titled Librerary; test instance closed. The held native workspace lock was verified. Template install/create/edit/remove/reload preservation and modified-package rejection were exercised in browser preview. Native editor/dialog interactions remain untested.

Core tests cover fresh/Unicode round trip, previous-save recovery, corrupt-file preservation, missing-primary recovery, future-version refusal, identifier/title/duplicate validation, size/settings constraints and catalog uniqueness/availability.

## Reproduce

```powershell
npm ci
npm run build
cargo test -p librerary-core
cargo check -p librerary-launcher
npm run test:web
npm run test:packages
npm run desktop:build -- --debug
```

## Required runtime acceptance

- Native: create/edit project, wait for saved status, restart and compare Unicode/multiline text; confirm data in an isolated `LIBRERARY_DATA_DIR`.
- Pin/unpin, search/filter, reopen recent documents, persist each theme and verify keyboard navigation.
- TXT export: cancel, create and overwrite selected destination; compare UTF-8 bytes.
- Delay/fail saves: retain dirty status, retry without older-save overwrite, close only after successful pending save.
- Corrupt/unsupported state: display useful error, preserve originals and verify backup recovery behavior.
- Browser preview: persistence/reload and separate storage; quota/storage-disabled error.
- Offline native run, CSP behavior, accessibility and process-tree performance measurements.

Native close/dialog, crash/power-loss safety and browser behavior require runtime evidence beyond core tests. Office/audio fixture suites follow their engine spikes.
