# Decisions

## 2026-10-16 — Project-local, layered memory

Status: adopted for the user's knowledge-base-first request.

Use root `AGENTS.md` as the startup/update instruction, INDEX and STATE as the short reading path, focused notes for durable context, and a preserved master brief for exact requirements. This keeps routine reads small while retaining the full specification.

At memory initialization, no stack had been selected. Subsequent decisions follow below.

## 2026-10-17 — Compact launcher and independent foundation

Status: adopted for the first working increment.

- User selected a compact utility launcher focused on speed.
- Use Tauri 2/Rust with React/TypeScript: available Windows tooling and a successful native debug build support this choice. Heavy engines remain separate future modules.
- Build original launcher code. Artcraft stays reference-only because of asset exclusions and substantial AI coupling; no reuse approved.
- Start with explicitly labeled plain-text Writer projects, not a DOCX claim. Office integration needs a Windows engine spike, license audit and round-trip fixtures.
- Versioned local JSON with atomic replacement/backups is sufficient for the small foundation; SQLite remains an option if measurement requires it. Browser localStorage is separate and lacks native backup.
- Planned modules remain disabled; no simulated installs or package-manager completion claims.

## 2026-10-17 — User-approved visual replacement and WPS priority

- Adopt the explicitly requested Apple-inspired UI and original glass logo; preserve all workflows. System SF Pro on Apple devices; native Segoe UI on Windows, no Apple font redistribution.
- Offline package V1 is data-only Writer templates, trusted by exact build-pinned SHA-256; executable modules/signing/updater remain future work.
- Coalesce pending saves and hold an OS workspace lock to protect data.
- User explicitly authorized main push, still pending. Latest steering prioritizes REA/WPS research and defers further app development.
