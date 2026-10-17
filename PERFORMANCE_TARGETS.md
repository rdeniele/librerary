# Performance targets

No complete benchmark exists yet. On 2026-10-17, an embedded debug smoke reported a responding Librerary window. One parent-process snapshot was 30,777,344 bytes (~29.35 MiB); observed parent-plus-console total was 41,877,504 bytes. WebView2 subprocess coverage was not established, so these figures do **not** measure the required full launcher footprint or pass the 150 MB target. Debug mode and one sample are unsuitable for release acceptance. Raw local evidence: ignored `.runtime/smoke-memory.json`.

| Area | Requirement / measurement plan |
| --- | --- |
| Launcher idle memory | Target below 150 MB; report entire process tree including WebView2 |
| Startup | Record cold/warm time until usable, with toolchain/build mode and storage state |
| Idle CPU | Measure after settling, with no editing activity |
| Persistence | Measure save latency and queue growth at representative project sizes |
| Engine isolation | Verify unlaunched heavy engines contribute no active processes/resources |
| Studio | Measure latency, drift and dropouts under UI load after engine exists |

Record Windows version, CPU, RAM, storage, WebView2 version, commit, release/debug mode and sample size. Use distributions/repeated trials, not one best run. Targets are acceptance goals, not current claims. Large-workspace serialization on each edit may become a bottleneck and requires measurement.
