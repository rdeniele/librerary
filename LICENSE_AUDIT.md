# License audit

Status: provisional inventory, not redistribution approval. No overall Librerary project license has been selected. Lockfiles record dependency resolutions; a complete transitive license/notice inventory and vulnerability review remain required.

| Component | Declared license / evidence boundary |
| --- | --- |
| React, TypeScript, Vite | MIT declarations; verify exact distributed dependency notices |
| Tauri Rust/API/CLI | MIT or Apache-2.0 declarations; audit selected transitive/runtime components |
| serde, serde_json | MIT or Apache-2.0 declarations |
| tempfile | MIT or Apache-2.0 declarations |
| lucide-react | ISC icons/package; retain applicable notice |
| System fonts | Resolved from the operating system; no SF Pro or DM Sans font files bundled |
| Original logo | Generated master and exact prompt/provenance in assets/brand; derived native/web icons |
| WebView2 | Microsoft runtime; deployment terms and offline availability unresolved |
| ArtCraft reference | Covered code MIT or Apache-2.0; explicit asset/branding exclusions; no reuse approved |
| Office, PDF and audio candidates | Not adopted; see engine feasibility research |

ArtCraft is isolated under `references/artcraft`; no ArtCraft code/assets have been approved for incorporation. Its root license does not clear its third-party assets. Details: [ArtCraft audit](docs/research/ARTCRAFT_AUDIT.md).

Before release: select project license; enumerate production/runtime/build components and assets by exact version; collect notices and source offers where applicable; review engine licensing and font/sample redistribution; exclude reference checkout from deliverables.
