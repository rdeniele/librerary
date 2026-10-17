# Architecture

## Implemented foundation

- `apps/launcher/src/main.tsx`: React launcher, catalog/search/pins, preferences, managed text editing, serialized saves and pending-save close handling.
- `apps/launcher/src/storage.ts`: typed storage boundary; Tauri commands in desktop mode and a separate localStorage envelope in browser preview.
- `apps/launcher/src-tauri/src/main.rs`: native state commands, save-dialog TXT export, local application-data directory.
- `crates/core/src/lib.rs`: versioned state, validation, backup recovery and atomic file replacement.
- `apps/launcher/src/catalog.ts`: presentation catalog. Rust also defines module identifiers; keeping these synchronized is currently manual.

`save-queue.ts` coalesces edits, serializes writes and preserves newest pending state on failure. `crates/core/src/instance.rs` holds an OS workspace lock for the native app lifetime. Native filesystem commands use blocking worker tasks.

`templates.ts` and `crates/core/src/packages.rs` implement bounded, hash-allowlisted Writer content packages. Active presentation lives in `apple.css`; original icon provenance lives in `assets/brand`.

The native Store is protected by a mutex. Export paths originate in a Rust native save dialog, not an arbitrary webview path argument. The configured CSP restricts content; this is not a completed security audit.

## Proposed evolution

Introduce an explicit versioned module manifest and independently loaded engines. Keep office rendering/editing behind an adapter and Studio timing/DSP in a native engine. No engine integration or independent module process exists yet.

See [module system](MODULE_SYSTEM.md), [office compatibility](OFFICE_COMPATIBILITY_MATRIX.md) and [Studio architecture](STUDIO_ARCHITECTURE.md).
