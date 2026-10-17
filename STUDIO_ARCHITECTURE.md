# Studio architecture proposal

Studio is not implemented. Its catalog entry is unavailable.

Proposed original model: project owns instruments, timed-note patterns, arrangement instances, mixer routing and master output. Easy and Advanced workspaces edit the same model. Arrangement lanes and mixer channels should be distinct concepts.

A native audio engine owns transport and DSP. UI sends bounded commands; engine exposes snapshots/meter data. Use a versioned project format with migrations and external-media references with missing-file handling. No project schema has been committed.

MVP gate: create and play a 16-step beat, add a second instrument, edit MIDI, arrange two patterns, mix/apply an effect, save/reopen without loss and export verified WAV. Stock sounds must be redistributable. Plugins follow a working stock engine.

Workflow research: [engine feasibility](docs/research/ENGINE_FEASIBILITY.md). DSP requirements: [audio design](AUDIO_ENGINE_DESIGN.md).
