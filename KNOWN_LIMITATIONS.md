# Known limitations

- Native debug compilation and process/window launch passed. Native editing, restart persistence, close behavior and export dialogs still need end-to-end tests. Packaging is disabled and no signed installer exists.
- Writer supports managed plain text and TXT export only. No DOCX, formatting, import, document deletion or external-file editing workflow exists.
- Twelve other apps are catalog placeholders; only verified Writer template content packages can be installed/removed; no executable module installer or updater exists.
- Browser preview stores data separately in localStorage and has no native backup/recovery mechanism.
- Native backup retains a previous valid save, not full history. Power-loss behavior remains untested. Native concurrent access is blocked by an OS workspace lock; browser multi-tab writing remains unprotected.
- Edits are coalesced through SaveQueue; each persisted snapshot serializes the entire workspace. Limits: 1,000 documents, 2 MiB content each and 32 MiB serialized state. Titles are limited to 512 UTF-8 bytes; new UI title entry is additionally limited to 200 characters.
- Module catalog identifiers are duplicated in TypeScript and Rust.
- No office/PDF/media/audio engine integration, plugin support or cross-app document model exists.
- No complete startup/memory/audio baseline, completed security audit, complete transitive license audit or overall project license selection exists. A preliminary debug parent-process snapshot does not establish the full process-tree target.
- Bounded REA metadata inspection and a basic WPS Writer Unicode round trip passed; richer Writer and Sheets/Slides/PDF research remain pending.

See [test plan](TEST_PLAN.md) for pending verification and [roadmap](ROADMAP.md) for the next milestones.
