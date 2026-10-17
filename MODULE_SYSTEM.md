# Module system

Only the managed plain-text Writer is available among thirteen catalog apps. Pinning does not install an app.

## Implemented content packages

The offline writer-starters package supplies three original templates. It contains data only: no executable code, archives or arbitrary paths. See crates/core/src/packages.rs, apps/launcher/src/templates.ts and packages/offline.

Installation verifies exact whole-file SHA-256 against the bundled release allowlist, then validates schema, host API, platform, dependency versions, identifiers and size limits. Native reads are bounded and reject symlinks/reparse points. Installation uses synced staged atomic replacement; listing re-verifies installed content. Removal preserves projects and exports.

Native content lives under the application data directory's content-packages folder; browser preview uses separate localStorage bytes. Package JSON uses LF for reproducible exact-byte digests. npm run test:packages verifies integrity. scripts/package-hash.mjs --write is an explicit maintainer operation, never an automatic build step.

## Pending executable modules

Independent engine packages, executable activation, remote downloads, updates/rollback, signatures and key rotation are not implemented. Design capabilities, authenticity, compatibility and recovery before accepting executable packages. Keep user projects outside replaceable module files and preserve them during removal.
