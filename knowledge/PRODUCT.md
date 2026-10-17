# Product requirements summary

Source: user-provided V2 brief, preserved in [MASTER_PROMPT.md](MASTER_PROMPT.md). Everything below describes intended behavior, not delivered features.

## Identity and constraints

**Librerary — Create freely. Work professionally.** Windows 10/11 x64 first; Linux and macOS later. Free, modular, offline-first, lightweight, beginner-friendly, open-source-oriented. No AI integration in the product, paid gates, subscriptions, ads, forced accounts, or artificial export limits. Optional cloud integrations must not be required for core workflows.

Beginner and professional workspaces share the same document model; switching modes must preserve data. Preserve original files, use safe saving and recovery, and disclose lossy conversions. Implement real features incrementally; mockups do not satisfy completion.

## Modules

Launcher manages independently installable applications: Writer, Sheets, Slides, PDF, Design, Photo, Vector, Studio, Video, Motion, Audio, Publish, and optional 3D. Heavy engines load only when their modules launch. Uninstalling modules must preserve user projects. Package manifests need integrity verification, compatibility checks, dependency handling, and safe updates.

Office interoperability prioritizes DOCX/XLSX/PPTX, PDF, ODT/ODS/ODP, CSV, SVG, and common media formats. Native Google documents are not standalone Office files; use exports or optional official APIs.

Studio is a real DAW: audio engine, step sequencer, piano roll, arrangement, mixer, instruments, effects, recording, and project persistence. Easy and Advanced workspaces share data. Use a single transport clock and real-time-safe audio processing. Plugins are optional; base Studio works without them. Use an original versioned project format and legally redistributable sounds.

## Reference boundaries

- Artcraft: `https://github.com/storytold/artcraft.git`; isolate at `references/artcraft`. Audit repository, dependencies, assets, and notices before reuse. Exclude AI workflows from Librerary.
- WPS read-only reference: `C:\Users\ronde\AppData\Local\Kingsoft\WPS Office\12.1.0.29162\office6`. Permitted workflow observation only; no proprietary code/assets extraction, installation modification, or private-file collection.
- FL Studio: official website and manual; workflow inspiration only. No proprietary samples, plugins, branding, interface art, or project-format copying.
- REA skill must be read and actually executed before claiming REA findings.

## Stack candidates, not decisions

Tauri, Rust, React, TypeScript, SQLite; office engines compatible with LibreOffice or ONLYOFFICE; PDFium/PDF.js; FFmpeg/MLT; CPAL/Symphonia/DSP libraries; VST3 SDK; eligible Artcraft components. Verify current feasibility and licenses before selection.

## Sequence and completion gates

0. Research, REA, reference/license audits, architecture and feasibility.
1. Launcher MVP and module/package foundation.
2. Writer MVP, then Sheets, Slides, PDF.
3. Design, raster/vector foundations and shared canvas.
4. Studio MVP.
5. Advanced Studio.
6. Video and Motion.
7. Audio, Publish, optional 3D and cross-app workflows.
8. Optimization, accessibility, security, packaging and release.

Each milestone requires successful compilation and launch, meaningful tests, data preservation, license compliance, reproducible builds, known limitations, and working demonstrations. Launcher idle-memory target: below 150 MB on a defined reference system; measure rather than promise.

Studio MVP must create a project, program/play a stable 16-step beat, add a second instrument, edit MIDI, arrange two patterns, mix and apply an effect, save/reopen without loss, export playable WAV, verify duration/sample format, and pass timing/dropout checks. Consult the full brief for exact acceptance criteria.

The brief requires README, architecture, requirements, license audit, REA findings, office compatibility matrix, Studio/audio design, module system, performance targets, roadmap, test plan, and limitations documents. Produce these as research and implementation provide evidence; label proposals clearly.
