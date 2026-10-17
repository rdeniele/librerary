# LIBRERARY — COMPLETE MASTER DEVELOPMENT PROMPT V2
## REA Reverse Engineering + Artcraft + WPS Office + FL Studio + Adobe + Canva

You are the lead software architect, reverse-engineering specialist, UI/UX designer, desktop application engineer, multimedia systems engineer, digital audio workstation developer, and performance optimization specialist.

Your mission is to build **Librerary**, a real, free, open-source-oriented, modular desktop ecosystem combining professional productivity, graphic design, multimedia editing, music production, and creative tools.

Do not build a mockup and call it finished.

Build a functional, tested application suite incrementally.

# 1. PRODUCT IDENTITY

Name: Librerary

Tagline: Create freely. Work professionally.

Primary platform: Windows 10/11 x64.

Future platforms: Linux and macOS.

Librerary should combine functional capabilities inspired by:

- WPS Office
- Microsoft Office
- Google Docs, Sheets, and Slides
- Adobe Photoshop
- Adobe Illustrator
- Adobe Premiere Pro
- Adobe After Effects
- Adobe Acrobat
- Adobe InDesign
- Canva
- FL Studio
- Audacity
- DaVinci Resolve
- LibreOffice
- ONLYOFFICE
- Artcraft
- Other suitable open-source software

The goal is not to copy proprietary products, branding, or source code.

Independently implement comparable functionality using permitted observation, original engineering, and appropriately licensed open-source components.

Librerary must be free, modular, offline-first, lightweight, beginner-friendly, and capable of scaling toward advanced professional work.

There must be no AI integration, paid feature gates, subscriptions, advertising, forced accounts, or artificial export limitations.

# 2. REQUIRED RESOURCES

## A. Artcraft GitHub repository

https://github.com/storytold/artcraft.git

Clone into an isolated reference directory:

```bash
git clone https://github.com/storytold/artcraft.git references/artcraft
```

Inspect:

- Repository architecture
- Rust components
- Frontend architecture
- Canvas systems
- Rendering
- 2D and 3D scene management
- Image compositing
- Layer systems
- Media handling
- Timeline workflows
- Project persistence
- Asset management
- Export pipelines
- Reusable UI components

Audit the repository license, third-party assets, dependencies, and notices before reuse.

Remove AI-related dependencies and replace AI workflows with conventional editing features where practical.

Do not assume that every component is independently reusable.

## B. Local WPS Office reference

```text
C:\Users\ronde\AppData\Local\Kingsoft\WPS Office\12.1.0.29162\office6
```

Use this installation as a read-only reference for permitted functional and UI observation.

Study:

- Application launching
- Office navigation
- Document workflows
- Spreadsheet editing
- Presentation editing
- PDF workflows
- Tabbed documents
- Ribbon organization
- Templates
- File opening and saving
- Export and printing
- Document recovery
- Shortcut behavior
- Performance characteristics

Do not modify the WPS installation, extract proprietary code or assets, bypass license protections, or collect private files.

## C. FL Studio reference

Official website:

https://www.image-line.com/fl-studio/

Official documentation:

https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/

Study publicly documented and lawfully observable workflows involving:

- Channel Rack
- Step Sequencer
- Piano Roll
- Playlist
- Mixer
- Browser
- Patterns
- Instruments
- Effects
- Automation
- Recording
- Audio clips
- MIDI
- Plugin management
- Project organization
- Rendering
- Export
- Audio routing

Use FL Studio as a functional and workflow reference, not a source of proprietary code, samples, plugins, branding, or interface artwork.

Build an original DAW experience.

## D. REA — Reverse Engineer Anything skill

Locate the installed REA skill.

Read its full instructions.

Use it to investigate permitted application behavior, architecture, feature relationships, interaction flows, and performance characteristics.

If the skill is unavailable, report this and use a structured functional-analysis process instead.

Never claim to have used REA unless it was actually available and executed.

# 3. LIBRERARY LAUNCHER

Create a lightweight, modern launcher that manages independently installable applications.

Features:

- Home dashboard
- App catalog
- Install and uninstall
- Updates
- Recent files
- Project library
- Templates
- Search
- Pinned applications
- Favorites
- File associations
- Unified settings
- Light and dark themes
- Keyboard shortcuts
- Offline installation
- Optional cloud integrations
- Recovery and backups

The launcher must not load heavy application engines into memory until needed.

Applications should be installable and removable without deleting user documents or projects.

Implement signed or integrity-verified package manifests, version compatibility, dependency management, and safe updates.

# 4. APPLICATION CATALOG

Develop the following applications as separate modules.

## Librerary Writer

Professional word processor.

Support:

- DOCX, ODT, RTF, TXT
- Rich text formatting
- Styles
- Tables
- Headers and footers
- Page numbering
- Footnotes
- Comments
- Track changes
- Page layouts
- Templates
- Find and replace
- Print preview
- PDF export
- Autosave and recovery

## Librerary Sheets

Professional spreadsheet editor.

Support:

- XLSX, ODS, CSV
- Formulas
- Dependency calculation
- Multiple worksheets
- Formatting
- Charts
- Sorting and filtering
- Conditional formatting
- Data validation
- Named ranges
- Pivot tables in a later milestone
- Import/export
- Large worksheet optimization

## Librerary Slides

Presentation editor.

Support:

- PPTX and ODP
- Slide templates
- Master slides
- Themes
- Text, images, and shapes
- Charts and tables
- Animations
- Transitions
- Speaker notes
- Presenter mode
- PDF export

## Librerary PDF

PDF viewer and editor.

Support:

- PDF rendering
- Text search
- Annotations
- Highlighting
- Forms
- Merge and split
- Page reordering
- Rotation
- Watermarks
- Compression
- Export
- Printing
- Digital signing workflows where supported
- Advanced content editing in later milestones

## Librerary Design

Canva-inspired general design editor.

Support:

- Templates
- Drag-and-drop editing
- Layers
- Text and typography
- Shapes
- Alignment
- Grids
- Masks
- Image placement
- Presets
- Social media graphics
- Posters
- Business cards
- Thumbnails
- Export formats

## Librerary Photo

Photoshop-inspired raster editor.

Support:

- Raster layers
- Masks
- Selection tools
- Brushes
- Blend modes
- Curves
- Levels
- Color adjustments
- Clone and healing tools
- Non-destructive editing
- Filters
- Batch processing

## Librerary Vector

Illustrator-inspired vector editor.

Support:

- SVG
- Pen and Bézier tools
- Paths
- Node editing
- Boolean operations
- Gradients
- Typography
- Artboards
- Symbols
- Precision controls
- SVG/PDF/PNG export

## Librerary Video

Professional video editor with beginner-friendly workflows.

Support:

- Multitrack timeline
- Video and audio clips
- Trim and split
- Transitions
- Keyframes
- Titles
- Masks
- Chroma key
- Speed controls
- Color correction
- Proxy editing
- Preview caching
- Export presets
- Vertical video
- FFmpeg-based media workflows

## Librerary Motion

Motion graphics application.

Support:

- Keyframes
- Text animation
- Shape animation
- Compositions
- Easing
- Graph editor
- Motion paths
- Effects
- Rendering

## Librerary Audio

Waveform and multitrack audio editor.

Support:

- Recording
- Cutting and trimming
- Fades
- Equalization
- Compression
- Noise reduction
- Mixing
- Export
- Integration with Video and Studio

## Librerary Publish

Desktop publishing and page-layout application.

Support:

- Multipage layouts
- Master pages
- Typography
- Text frames
- Image frames
- Print layouts
- Brochures
- Magazines
- PDF export

## Librerary 3D

Optional 3D workspace.

Explore appropriate Artcraft components and other suitable engines for:

- Scene navigation
- Object transforms
- Cameras
- Materials
- Lighting
- Basic mesh editing
- Rendering
- 2D/3D compositing

Do not bundle heavy 3D dependencies with the base launcher.

# 5. LIBRERARY STUDIO — FL STUDIO-INSPIRED MUSIC PRODUCTION

This is a major product module.

Build **Librerary Studio**, an original digital audio workstation (DAW) designed to be easier for beginners than traditional professional music production software while retaining advanced capabilities.

It must not be a simple audio player or soundboard.

It must contain a real-time audio engine, pattern sequencer, MIDI editing, arrangement timeline, mixer, instruments, effects, recording, and project saving.

## A. Beginner mode — Easy Studio

Create a welcoming interface that allows a beginner to make a beat without needing to understand complex audio routing.

Features:

- New song wizard
- Genre-neutral starter templates
- Drag-and-drop sound browser
- 16-step drum sequencer
- Adjustable pattern length
- Tempo control
- Time signature
- Basic piano roll
- Quantization
- Instrument presets
- Loop playback
- Pattern duplication
- Song arrangement
- Simple effects
- Master volume
- Export to WAV

Provide friendly labels and contextual explanations.

Examples:

- "Make a Beat" instead of a complicated setup workflow
- "Add Instrument"
- "Add Drum Pattern"
- "Record Voice"
- "Add Effect"
- "Mix Your Song"
- "Export Song"

Avoid hiding functionality behind arbitrary paid tiers.

## B. Professional mode — Advanced Studio

Expose professional music production tools.

Features:

- Multitrack arrangement
- Advanced piano roll
- MIDI note editing
- Velocity editing
- Pitch bend
- MIDI controller support
- Audio recording
- Clip stretching
- Sample editing
- Automation clips
- Mixer channels
- Sends and buses
- Sidechain routing
- Plugin chains
- Equalizers
- Compressors
- Limiters
- Reverb
- Delay
- Distortion
- Chorus
- Stereo tools
- Spectrum analysis
- Mastering controls
- Audio rendering
- MIDI import/export
- VST3 hosting where technically and legally feasible

Track counts should be limited by available resources, not artificial product tiers.

## C. Channel Rack and Step Sequencer

Implement an original step-sequencing interface.

Required:

- Multiple instrument channels
- Step toggles
- Pattern length controls
- Velocity
- Swing
- Per-channel mute/solo
- Channel volume and pan
- Pattern copy/paste
- Pattern organization
- Playback synchronization

Provide visual feedback while the pattern plays.

## D. Piano Roll

Implement a professional MIDI piano roll.

Required:

- Horizontal timeline
- Vertical pitch keyboard
- Note drawing
- Note deletion
- Note resizing
- Note dragging
- Multi-selection
- Quantization
- Velocity editing
- Snap settings
- Zoom
- MIDI playback
- Undo/redo
- Pattern looping

Advanced additions:

- Scale highlighting
- Chord tools
- Arpeggiation
- Note humanization
- Ghost notes
- MIDI expression
- Custom note snapping

All music creation should work without AI generation.

## E. Playlist and Arrangement

Implement:

- Timeline ruler
- Pattern clips
- Audio clips
- MIDI clips
- Multiple tracks
- Clip duplication
- Clip trimming
- Loop regions
- Markers
- Tempo automation
- Arrangement sections
- Snap and grid controls
- Zoom
- Drag-and-drop editing

Use a single transport clock to synchronize playback.

## F. Mixer

Build a real mixer with:

- Channel faders
- Pan
- Mute
- Solo
- Peak meters
- Insert effects
- Send effects
- Bus routing
- Master channel
- Effect bypass
- Channel naming
- Routing visualization

Support efficient audio processing.

## G. Instruments and Synthesizers

Include legally redistributable, lightweight instruments.

Initial targets:

- Basic subtractive synthesizer
- Drum sampler
- Sample player
- Simple piano-like instrument
- Bass synthesizer
- Basic pad synthesizer

Future targets:

- Wavetable synthesis
- FM synthesis
- More advanced samplers
- Modulation matrices
- Envelope editors
- LFO controls

Do not bundle proprietary FL Studio instruments or sample libraries.

## H. Audio Effects

Provide built-in effects:

- EQ
- Compressor
- Limiter
- Reverb
- Delay
- Chorus
- Distortion
- Saturation
- Noise gate
- High-pass filter
- Low-pass filter

Use established DSP libraries when appropriate.

## I. VST3 Plugin Support

Investigate lawful and technically feasible VST3 hosting.

Implement:

- Plugin scanning
- Plugin validation
- Plugin loading
- Preset management
- Plugin UI hosting
- Crash containment where feasible
- Plugin compatibility reporting

Third-party plugins must be supplied and licensed by their respective users or redistributed only when permitted.

Plugin support must be optional.

The base Studio application must function without external plugins.

## J. Audio Engine Requirements

Prioritize:

- Low-latency playback
- Stable transport synchronization
- Real-time-safe processing
- No blocking operations in audio callbacks
- No unnecessary heap allocation in audio callbacks
- Background sample loading
- Efficient DSP
- Configurable sample rate
- Configurable audio buffer size
- WASAPI support
- ASIO support only through properly licensed and permitted integration
- Audio device selection
- Dropout monitoring
- Offline rendering

Evaluate Rust audio libraries such as CPAL, Symphonia, and suitable DSP frameworks.

Do not assume they collectively provide a complete DAW engine.

## K. Studio Project Format

Create an original versioned project format.

Preserve:

- Tracks
- Patterns
- MIDI notes
- Audio clip references
- Instrument settings
- Mixer routing
- Effects
- Automation
- Tempo
- Time signature
- Markers
- Plugin references
- Project metadata

Support project portability with a collect-and-package workflow.

Do not copy FL Studio's proprietary project format.

## L. Studio MVP Acceptance Tests

The first Studio release must demonstrate:

1. Create a new project.
2. Add a drum instrument.
3. Program a 16-step beat.
4. Play the beat with stable timing.
5. Add a second instrument.
6. Edit MIDI notes in the piano roll.
7. Arrange two patterns.
8. Adjust mixer levels.
9. Apply an effect.
10. Save the project.
11. Close and reopen it without losing data.
12. Export a playable WAV file.
13. Verify exported duration and sample format.
14. Run playback and audio-dropout tests.

Do not call the Studio module complete until these tests pass.

# 6. USER EXPERIENCE PHILOSOPHY

All applications must follow one principle:

**Easy to start. Powerful to master.**

Provide beginner and professional workspaces sharing the same underlying document or project model.

Beginner mode should offer:

- Plain-language tools
- Templates
- Guided workflows
- Drag-and-drop interaction
- Clear defaults
- Contextual help
- Easy export

Professional mode should expose:

- Advanced panels
- Detailed properties
- Customizable shortcuts
- Precision controls
- Automation
- Complex editing tools
- Batch operations
- Professional export options

Switching modes must never discard project data.

# 7. OFFICE AND GOOGLE WORKSPACE COMPATIBILITY

Prioritize:

- DOCX
- XLSX
- PPTX
- PDF
- ODT
- ODS
- ODP
- CSV
- SVG
- Common image and media formats

Support Google Workspace interoperability through standard exported file formats and optional official Google APIs.

Do not claim native Google Docs, Sheets, or Slides files are ordinary standalone Office files.

Implement:

- Compatibility testing
- Layout preservation
- Font substitution warnings
- Formula preservation
- Chart preservation
- Embedded media handling
- Round-trip import/export tests
- Lossy conversion warnings
- Safe saving
- Original-file preservation

Never silently corrupt documents.

# 8. RECOMMENDED TECHNICAL STACK

Evaluate:

- Tauri
- Rust
- React
- TypeScript
- SQLite
- LibreOffice-compatible engines
- ONLYOFFICE technology
- PDFium
- PDF.js
- FFmpeg
- MLT
- CPAL
- Symphonia
- Suitable open-source DSP libraries
- VST3 SDK subject to current license requirements
- Artcraft components

Select technologies based on verified feasibility, compatibility, performance, and licensing.

Do not assume that all referenced engines can be embedded into one application without restrictions.

# 9. PERFORMANCE REQUIREMENTS

The launcher must remain lightweight.

Heavy office, video, 3D, and audio engines must load only when their respective modules are launched.

Implement:

- Lazy loading
- Background task scheduling
- Memory-aware caching
- Incremental saving
- Virtualized rendering
- Hardware acceleration where supported
- CPU fallback
- Configurable preview quality
- Low-spec performance profiles
- Crash recovery
- Efficient resource cleanup

Target a launcher idle memory footprint below 150 MB on a defined reference system, but measure and report actual results.

For Librerary Studio, prioritize audio stability over visual effects.

A professional DAW may require more resources than the launcher.

Do not promise that all professional workloads will run smoothly on every computer.

# 10. LICENSING, SECURITY, AND PRIVACY

Audit all reused components.

Respect:

- Copyright
- Open-source licenses
- Attribution
- Third-party notices
- Redistribution restrictions
- Plugin licensing
- Codec licensing
- Sample library licensing

Never copy proprietary application binaries, private assets, protected sample packs, or closed-source code.

Never bypass payment systems or licensing controls in existing products.

Instead, independently develop free functionality.

Keep local files private.

Do not require accounts or cloud services for core workflows.

Implement safe package installation and updates.

# 11. DEVELOPMENT PLAN

## Phase 0 — Research and REA analysis

- Locate and read REA skill.
- Inspect local environment.
- Verify WPS folder.
- Study permitted WPS workflows.
- Clone and inspect Artcraft.
- Audit Artcraft licensing.
- Study FL Studio documentation.
- Examine open-source DAW alternatives.
- Evaluate office document engines.
- Produce architecture and feasibility reports.

## Phase 1 — Launcher MVP

- Tauri desktop shell
- App catalog
- Module manifests
- Install/uninstall
- Recent files
- Settings
- Themes
- Project storage
- Package validation

## Phase 2 — Office MVP

- Writer
- DOCX import/export
- Basic formatting
- Save and recovery
- Compatibility tests

Then expand to Sheets, Slides, and PDF.

## Phase 3 — Creative MVP

- Design editor
- Raster image editing foundation
- Vector editing foundation
- Shared canvas components

## Phase 4 — Studio MVP

- Audio engine
- Step sequencer
- Piano roll
- Arrangement timeline
- Mixer
- Basic instruments
- WAV export
- Project save/load

## Phase 5 — Advanced Studio

- Recording
- Automation
- Advanced DSP
- VST3 hosting
- MIDI devices
- Advanced routing
- Mastering workflows

## Phase 6 — Video and Motion

- Video timeline
- Media import
- Playback
- Effects
- Keyframes
- Rendering
- Motion graphics

## Phase 7 — Additional applications

- Audio waveform editor
- Publishing
- Optional 3D
- Shared cross-application workflows

## Phase 8 — Optimization and release

- Low-spec testing
- Crash recovery
- Accessibility
- Performance benchmarks
- Security testing
- Windows installer
- Portable packaging
- Offline app modules
- Release documentation

# 12. PROJECT DIRECTORY STRUCTURE

Use a modular monorepo, initially resembling:

```text
librerary/
  apps/
    launcher/
    writer/
    sheets/
    slides/
    pdf/
    design/
    photo/
    vector/
    video/
    motion/
    studio/
    audio/
    publish/
    three-d/
  packages/
    ui/
    design-system/
    app-sdk/
    project-format/
    office-interop/
    media-interop/
  crates/
    core/
    package-manager/
    file-system/
    audio-engine/
    midi-engine/
    dsp/
    rendering/
    project-storage/
  references/
    artcraft/
  tests/
    unit/
    integration/
    compatibility/
    audio/
    performance/
  docs/
  installers/
  scripts/
```

Keep reference repositories separate from production code until licensing and integration are approved.

Never copy the WPS installation into the project.

# 13. REQUIRED DOCUMENTATION

Create:

- README.md
- ARCHITECTURE.md
- REQUIREMENTS.md
- LICENSE_AUDIT.md
- REA_FINDINGS.md
- OFFICE_COMPATIBILITY_MATRIX.md
- STUDIO_ARCHITECTURE.md
- AUDIO_ENGINE_DESIGN.md
- MODULE_SYSTEM.md
- PERFORMANCE_TARGETS.md
- ROADMAP.md
- TEST_PLAN.md
- KNOWN_LIMITATIONS.md

Documentation must reflect implemented behavior, not imagined functionality.

# 14. QUALITY GATES

Every completed milestone must:

- Compile successfully.
- Launch successfully.
- Have meaningful automated tests.
- Preserve user data.
- Avoid unauthorized system changes.
- Respect licenses.
- Include reproducible build instructions.
- Report known limitations.
- Demonstrate real working features.

For Studio, additionally verify playback timing, export correctness, project persistence, and real-time audio stability.

# 15. EXECUTION DIRECTIVE

Begin immediately with Phase 0.

Do not stop after writing documentation.

Once resource inspection and legal feasibility checks are complete, proceed to building the actual launcher and first functional module.

Work incrementally.

At each milestone, report:

- What was implemented
- Files changed
- Tests run
- Build results
- Performance measurements
- Remaining issues
- Next tasks

Make reasonable, reversible technical decisions autonomously.

Ask for permission before destructive actions, privileged installations, or accessing private user files.

If REA is unavailable, report that honestly and continue with permitted functional analysis.

If a requested feature is infeasible in the current milestone, document the limitation and implement the strongest practical foundation.

The long-term goal is to make Librerary a free, professional-grade creative and productivity suite that is significantly easier to learn than traditional professional applications.

**Start by locating REA, auditing Artcraft, inspecting the permitted WPS reference, researching DAW architecture, and creating a working Librerary launcher foundation.**