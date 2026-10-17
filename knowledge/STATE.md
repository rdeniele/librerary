# Current state

Last updated: 2026-10-17 (Asia/Singapore).

## Delivered source and verification

- Tauri 2/Rust + React/TypeScript launcher: catalog/search/pins/recent projects, themes, plain-text Writer, autosave/recovery and TXT export.
- Offline Writer starter-template package: three templates; exact SHA-256 release allowlist, schema/API/platform/dependency checks, bounded reads, atomic native install, removal preserving projects. Browser preview uses separate verified localStorage package bytes. Executable app packages/updater are NOT implemented.
- SaveQueue coalesces edits and preserves newest pending state on failure; native file I/O uses blocking worker tasks. Native InstanceGuard prevents concurrent writers to the same workspace.
- User requested Apple-inspired entire UI redesign preserving all workflows. Implemented active apple.css, native system typography (SF Pro through Apple OS; Segoe UI Windows), blue accents, glass navigation, rounded solid working surfaces and responsive layouts. DM Sans removed.
- Original transparent glass document-stack logo generated with built-in Imagegen; assets/brand contains master PNG, exact prompt/provenance. Native icons/favicon/web brand derived; PNG alpha and metadata verified.
- Independent Apple visual reviewer returned full disposition ship; documenter reconciled DESIGN.md, sidecar and regeneration script. All five screens inspected; light/dark and narrow captures in ignored .impeccable/review/apple.
- Latest tests: 17 Rust core and 14 browser tests passed (31 total); package digest check passed. Frontend build and native embedded debug build passed. Executable target/debug/librerary-launcher.exe.
- Native isolated smoke: responding Librerary window and held workspace lock verified. Native editor/export-dialog interaction remains untested. No complete process-tree memory benchmark or 150 MB acceptance.

## Git — IMPORTANT pending work

- main is still unborn: NO commits and NO push have occurred.
- origin: https://github.com/rdeniele/librerary.git. Authorized read-only remote check returned no branch heads.
- User explicitly authorized push to main. Finish engineering-document updates, stage reviewed source/assets (exclude references, node_modules, target, .runtime and review screenshots), commit and push without force.
- Root engineering docs reconciled with templates, coalesced saves, native locking, Apple branding and current validation. DESIGN.md and PRODUCT.md reflect Apple direction.

## Current user priority: REA + WPS; other development deferred

- Latest user: continue, then focus on REA/WPS tools; move development forward later. Do not start the previously proposed TXT import yet.
- REA skill/recovery read; no REA MCP tools exposed and rea absent PATH. Diagnostic agent tried npx doctor; sandbox DNS failed. Escalated acquisition/doctor was still pending when the turn was stopped. No REA Evidence IDs or binary analysis yet. No configuration writes or provider installs.
- Windows Computer Use skill now available through node_repl + @oai/sky; full skill/guidance/API/confirmations read. Initialized helper and launched the specified WPS wps.exe. Selected returned WPS Office window only.
- WPS Home and its New menu observed. Home exposes unified app navigation, document tabs, New/Open, recents and cloud areas. Ctrl+N opened a menu with Docs/Slides/Sheets/PDF and separate online/services groups. These are shell observations only, not editor behavior evidence.
- One coordinate click failed SendInput GetLastError=87; activation followed by Ctrl+N succeeded. No synthetic document was created or edited; no private recent file was opened; no WPS installation files modified or proprietary assets/code extracted.
- User explained the physical Escape came from gaming and explicitly authorized resumption on 2026-10-17. Diagnostic recovery resumed; use fresh UI state before further input.
- WPS raw home captures can expose recent-file metadata; none were saved into the repository. Do not publish recent filenames or private material.

## Next resume

1. Complete documentation checkpoint and authorized main push.
2. Recheck REA diagnostic result/package availability, following the recovery guide. Prefer actual CLI portable PE metadata if supported; never claim REA execution from ordinary shell inspection. Configuration repair requires a concrete reviewed plan before writes.
3. On new authorization, use Windows Computer Use to create only synthetic Writer/Sheets/Slides/PDF probes in the workspace. Observe new/edit/save/reopen/export/shortcuts and record evidence per scenario. Do not access private recent files.
4. Update WPS findings and requirements mapping before returning to application development.

Artcraft remains isolated/partial audit at d4e4ac69bbd93d237eaf5d0260bc6a5ff3a5e373; no reuse approved. No Office engine, DOCX compatibility, Studio/audio engine, full transitive license audit, overall project license or signed installer exists. Phase 0/1 are incomplete.
