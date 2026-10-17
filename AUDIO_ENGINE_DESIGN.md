# Audio engine design proposal

No audio engine, CPAL integration, decoder, DSP graph or WAV exporter is implemented.

Proposed rules:
- One sample-frame transport drives sequencing, playback and offline export.
- Predecode samples and allocate voices/buffers outside the audio callback.
- Avoid locks, allocation, logging and file/network I/O in the callback.
- Pass bounded control messages from UI; publish meter snapshots without blocking audio.
- Begin with WASAPI through a pinned, audited CPAL release; optional backends/plugins must not be prerequisites.
- Share DSP graph behavior between real-time and offline rendering.

CPAL provides device I/O; Symphonia provides decoding. Neither supplies a DAW. Exact versions/licenses and an implementation spike are pending.

Test scheduled impulses against expected frame indices, export frame count/sample format, loop drift, UI-load dropouts, device removal and sample-rate changes. Latency/buffer targets require reference hardware and measured results.
