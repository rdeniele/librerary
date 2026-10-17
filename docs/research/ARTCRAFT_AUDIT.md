# ArtCraft reference audit

Inspected 2026-10-17. Static source inspection only; no ArtCraft build scripts, application, or downloaded dependencies executed. Reference checkout: `references/artcraft`, HEAD `d4e4ac69bbd93d237eaf5d0260bc6a5ff3a5e373` (verified with `git rev-parse HEAD`). Findings apply to this commit, not future releases.

## Architecture observed

- Root `Cargo.toml` defines a Rust workspace; default member is `crates/desktop/artcraft`, a Tauri application. Its manifest directly depends on ArtCraft, Fal, Grok, Midjourney, Sora and World Labs API clients, cookie handling and a modified HTTP plugin.
- `frontend/package.json` identifies React 18, Nx/Vite tooling, Zustand, Konva and Three.js among a much larger dependency set. Version declarations are not installed-version or compatibility verification.
- `artcraft-native/Cargo.toml` defines a separate egui/eframe UI. Its description says no Tauri/webview, but its dependency list also includes `wry` for a Midjourney sign-in window. It is not evidence of a completely webview-free product.
- `frontend/libs/components/` includes drawing, scene, moodboard and video-editor areas. Their existence does not establish production completeness, offline operation, format support or reuse independence.

## AI and account coupling

The repository is an AI provider client, not a ready-made offline creative suite. Beyond API dependencies, `frontend/libs/components/pagedraw/src/lib/PageDraw.tsx` imports `PromptEditor`, `ImageModel`, `GenerationProvider`, pricing UI and `PromptsApi`. Even its drawing entry point needs separation work before an AI-free reuse claim.

Bounded source searches also found credits in `frontend/apps/artcraft/app/src/components/signaled/TopBar/TopBar.tsx`, subscription state in `signals/authentication/`, generation models in `pages/PageAudio/CreateAudio.tsx`, and PostHog imports in `index.tsx` and `root.tsx`. These are static coupling observations; no runtime traffic was observed.

## License and asset boundary

Root `LICENSE-MIT`, `LICENSE-APACHE` and `NOTICE` offer MIT or Apache-2.0 for covered code. MIT requires preserving its copyright and permission notice. Apache use requires evaluating its applicable notice and redistribution terms. The root license is not a blanket asset clearance.

`NOTICE` explicitly excludes ArtCraft branding/trademarks and identifies third-party service trademarks. It states that these resources grant no rights through the root license: Nintendo-derived sound effects, meme images/likenesses, gray/night skybox textures, `pose/Lumine Idle cycle.vmd`, and Mixamo animation renders under `characters_gif/`.

`NOTICE` separately lists ammo.js (zlib), the vendored HTTP plugin (MIT/Apache), normalize.css and three-dots (MIT), Font Awesome icons (CC BY 4.0), and fonts (SIL OFL). Its list is upstream's declaration, not an independently complete dependency/asset audit.

## Recommendation and remaining gates

Use ArtCraft as an isolated architectural reference. Build Librerary's compact launcher independently. No ArtCraft code or assets have been approved for inclusion by this audit. Any later component candidate needs a bounded dependency trace, per-file provenance, exact dependency license inventory, AI/account/telemetry removal, offline tests and maintained notices before incorporation.

No full transitive dependency audit, vulnerability scan, asset-by-asset clearance, application execution, performance measurement or export validation has run. This report is a partial audit, not a distribution approval.
