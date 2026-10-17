# Engine feasibility — Phase 0

Research date: 2026-10-16, Asia/Singapore. **Verified** below means checked against the linked upstream documentation, not compiled or integrated locally. **Proposed** means a recommendation awaiting a spike. Upstream branches and pages are moving targets; pin releases, source commits, and dependency inventories before adopting them.

## Launcher and Windows foundation

**Verified:** Tauri 2 requires Microsoft C++ Build Tools with Desktop development with C++, Edge WebView2, and Rust on Windows. MSI packaging additionally requires the VBSCRIPT optional feature. The frontend toolchain is separate. [Official prerequisites](https://v2.tauri.app/start/prerequisites/).

**Proposed:** Tauri/Rust plus a TypeScript frontend is a suitable launcher candidate. Start with local manifests and explicit module states; do not load office/audio engines at launcher startup. Keep filesystem and process privileges in narrow Rust commands. Measure total process-tree working set, including WebView2 children, before accepting the 150 MB target. Offline installation must account for WebView2 availability rather than assume an online bootstrapper can run.

**Unresolved:** local compiler readiness, actual bundle launch, WebView2 distribution strategy, package signing, updater trust root, and idle memory on defined hardware. Documentation does not establish these.

## Office engines

| Candidate | Verified upstream evidence | Practical consequence / proposed next step |
| --- | --- | --- |
| LibreOfficeKit | C/C++ access to LibreOffice functionality; document conversion and an explicitly unstable tiled rendering/editing interface. Editing uses input events and callbacks for invalidated tiles, cursor and selection. Windows tiled-viewer build instructions exist, requiring GTK3. [LOK documentation](https://docs.libreoffice.org/libreofficekit.html). | A real engine candidate, but not a ready React editor component. Spike Windows runtime initialization, render, input/IME, selection, undo, save and reopen before choosing it. The page is dated 2023; validate API behavior against the pinned current source. |
| ONLYOFFICE Desktop Editors | Upstream describes offline local document editing on Windows/Linux/macOS. The repository is AGPL-3.0 and includes multiple component submodules. [Desktop repository](https://github.com/ONLYOFFICE/DesktopEditors). | Evaluate an offline desktop integration/build separately from the server product. Upstream compatibility claims require our fixture tests. Remove/exclude AI integrations from any eligible derivative. |
| ONLYOFFICE Docs API | Official integration architecture includes browser editor, server editing/conversion services and integrator-provided storage/document manager. [Architecture](https://api.onlyoffice.com/docs/docs-api/get-started/how-it-works). | A browser iframe alone does not establish an offline desktop engine. A local service stack would need packaging, lifecycle, security, and resource tests; defer selection until proven. |

**License gate:** LibreOffice identifies MPL-2.0 and asks contributions to be jointly MPL-2.0/LGPL-3.0+; its installed license information also covers other components. This is not a claim that every bundled file has one license. [Official licensing](https://www.libreoffice.org/licenses/). ONLYOFFICE's exact selected submodules, license additions, source-offer obligations, branding notices, fonts, and assets need a component-level audit. Process isolation is an engineering boundary, not automatic permission to ignore copyleft. No engine receives redistribution approval from this report.

**Proposed decision:** keep the Writer engine behind an adapter; do not build a simplistic rich-text editor and call it DOCX-compatible. Run the office spike before committing to Writer implementation.

## PDF foundation

**Verified:** PDF.js is an HTML5 parser/renderer/viewer, Apache-2.0. [Repository](https://github.com/mozilla/pdf.js). PDFium's top-level license contains BSD-style redistribution conditions and additional licensing material; inspect third-party notices in the actual build. [License](https://pdfium.googlesource.com/pdfium/+/refs/heads/main/LICENSE).

**Proposed:** use PDF.js for the initial viewer spike inside WebView2; test worker loading, local-file byte access, text search/selection, printing and large documents. Consider PDFium for native rendering requirements after measuring deployment cost. Neither a rendered page nor basic annotation support establishes arbitrary PDF text editing, OCR, secure redaction or faithful rewriting. Those features need separate engines and acceptance tests. Pin security updates and handle documents as untrusted input.

## Studio workflow and engine boundary

**Verified workflow:** FL Studio's official manual connects instrument channels and step/note patterns, Playlist arrangement, and Mixer routing. A pattern clip can trigger several Channel Rack instruments; Playlist lanes do not inherently equal mixer channels. [Playlist](https://www.image-line.com/fl-studio-learning-content/fl-studio-online-manual/html/playlist.htm), [Mixer routing](https://ww2.image-line.com/fl-studio-learning/fl-studio-online-manual/html/mixer_iorouting.htm), [View menu](https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/menu_view.htm).

**Proposed original model:** project → instruments + patterns of timed notes → arrangement instances → routed mixer graph → master output. Easy and Advanced views edit this same model. Use original names, visuals, sounds and versioned serialization; the manual is workflow evidence only.

**Verified libraries:** CPAL is low-level audio device/stream I/O, Apache-2.0; upstream lists WASAPI as Windows default and ASIO/JACK as optional backends. [CPAL](https://github.com/RustAudio/cpal). Symphonia is an MPL-2.0 demuxing/decoding library, with codecs controlled by features. [Symphonia](https://github.com/pdeljanov/Symphonia). They are building blocks rather than a sequencer, synthesizer, mixer or complete DAW. Optional SDK/backend licenses require separate audit.

**Verified architecture reference:** Ardour separates a GTK application, libraries, headless utilities and session tools in its public source tree. Its COPYING file is GPL text; per-file notices and exact source version must be inspected before reuse. [Source tree](https://github.com/Ardour/ardour), [COPYING](https://raw.githubusercontent.com/Ardour/ardour/master/COPYING). This review establishes structural inspiration only; no Ardour source has been adopted or build tested.

**Proposed Rust engine:** one sample-frame transport drives sequencing and offline rendering. Predecode/cache samples off the callback; preallocate voices and DSP buffers; exchange bounded control messages with the UI; avoid locks, allocation, file/network I/O and logging in the callback. Use the same DSP graph for playback and WAV export. Defer plugins until stock instruments/effects, timing and recovery work. Start with WASAPI; do not make ASIO hardware or plugin SDKs prerequisites for basic Studio.

## Required evidence before implementation claims

1. Launcher: compile and launch a Windows bundle, inspect subprocesses, record idle CPU/memory, and test absent WebView2 behavior.
2. Office: open/edit/save/reopen representative DOCX/XLSX/PPTX and ODF fixtures; compare layout/formulas/notes and retain originals. Test CJK input, clipboard, undo, crash recovery and export warnings. No compatibility score exists yet.
3. PDF: render known fixtures, search/select text, print/export and measure large-file memory; verify worker/CSP configuration offline.
4. Audio: synthesize scheduled impulses, verify sample positions and WAV frame count, then measure loop drift/dropouts on actual hardware under UI load. Test device removal and sample-rate changes.
5. Redistribution: pin every engine, record dependencies/assets/fonts, collect licenses/notices/source offers, and resolve copyleft compatibility for the chosen integration. No blanket legal clearance or measured performance is asserted.
