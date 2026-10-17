# Librerary knowledge base

Read this file and [STATE.md](STATE.md) at task start. Read other notes only as needed to limit context cost.

| Note | Purpose |
| --- | --- |
| [STATE.md](STATE.md) | Current verified status, outstanding work, immediate next step |
| [PRODUCT.md](PRODUCT.md) | Stable product requirements and development sequence |
| [DECISIONS.md](DECISIONS.md) | Durable decisions, rationale, and pending choices |
| [LOG.md](LOG.md) | Dated work and validation history |
| [MASTER_PROMPT.md](MASTER_PROMPT.md) | Verbatim user brief; consult for exact feature requirements |
| [Engineering entry point](../README.md) | Build/run commands; architecture, tests, limitations and roadmap |
| [Artcraft audit](../docs/research/ARTCRAFT_AUDIT.md) | Pinned reference, asset exclusions and AI coupling |
| [Engine feasibility](../docs/research/ENGINE_FEASIBILITY.md) | Official Office/PDF/audio research and adoption gates |
| [Local reference](../docs/research/LOCAL_REFERENCE.md) | WPS metadata and REA/tooling evidence boundaries |

## Evidence rules

- **Requirement:** requested behavior, not necessarily implemented.
- **Proposed:** an option awaiting investigation or selection.
- **Verified:** observed in source, a command result, or a recorded test; include evidence.
- **Unknown:** not inspected or not tested.

Keep current state short and replace obsolete statements. Preserve useful history in LOG and decisions in DECISIONS. For substantial modules, create a focused note with source links, interfaces, limitations, and reproducible checks. Avoid loading the whole knowledge base each turn.
