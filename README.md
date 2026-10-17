# Librerary

A compact, local creative workspace for Windows. This foundation provides a searchable 13-app catalog, pinned apps, recent text projects, themes, and a plain-text Writer with TXT export. Twelve catalog entries are planned, unavailable modules.

Writer is currently a managed text editor, not a DOCX editor. Verified offline Writer template packages are available; executable module installation, office engines and audio engines remain future work.

The Apple-inspired interface uses native system typography, restrained blue accents and responsive light/dark surfaces. The original glass document-stack identity and provenance are in `assets/brand`.

## Develop

Use Node.js/npm, Rust, Microsoft C++ Build Tools and WebView2. See [Tauri Windows prerequisites](https://v2.tauri.app/start/prerequisites/).

From the repository root:

```powershell
npm ci
npm run build
cargo test -p librerary-core
npm run dev
```

Open the local Vite URL for browser preview. Browser projects use localStorage and are separate from desktop projects. Run native development with `npm run desktop`. Build an embedded Windows executable with `npm run desktop:build -- --debug`; omit `--debug` for a release build (not yet verified). The verified executable is `target/debug/librerary-launcher.exe`. No installer is produced yet. Use `npm run test:web` for browser tests and `npm run test:packages` for package integrity verification. Initial dependency downloads require network; the built application requires no account or online service.

## Data

Native state is versioned JSON in Tauri's local application-data directory. `LIBRERARY_DATA_DIR` can override it for isolated testing. A previous valid save is retained as `state.json.bak`; writes use temporary files and atomic replacement. These mechanisms are not a substitute for external backups. TXT export uses a native save dialog in desktop mode.

Browser data can disappear when browser storage is cleared. Export important text.

## Status and documentation

Verified 2026-10-17: frontend production build, native check and embedded debug build passed; 17 Rust and 14 browser tests passed, and package digest verification passed. Browser editing/reload/Unicode/TXT export and search/pinning/themes were exercised. Native process smoke found a responding Librerary window and verified its workspace lock; native editor/dialog workflows and full process-tree benchmarks remain pending. See [architecture](ARCHITECTURE.md), [test plan](TEST_PLAN.md), [limitations](KNOWN_LIMITATIONS.md), [roadmap](ROADMAP.md) and [license audit](LICENSE_AUDIT.md).

Start future repository tasks with [knowledge/INDEX.md](knowledge/INDEX.md) and [knowledge/STATE.md](knowledge/STATE.md). The complete user brief is retained in [knowledge/MASTER_PROMPT.md](knowledge/MASTER_PROMPT.md).
