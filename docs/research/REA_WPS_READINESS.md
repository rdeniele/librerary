# WPS REA readiness

Checked 2026-10-17 (Asia/Singapore). Scope: read-only metadata for the four explicitly selected WPS executables. No target launch, decompilation, resource payload extraction, installation changes, or private document access.

## Observed tooling state and actual execution

- No REA MCP tools are exposed in this session. Initial sandbox npm download failed with `ENOTFOUND registry.npmjs.org`; the authorized escalated retry acquired REA CLI **6.5.0** and successfully executed doctor.
- Doctor reports Codex registration **missing/config_drift** at `C:\Users\ronde\.codex\config.toml`; Node 24.13.1 healthy; Hopper/Ghidra/IDA/JADX unavailable. Missing native engines do not block the portable PE resource parser.
- Actual CLI `--help`, `inspect-pe-resources --help`, and `--schema` were inspected. Executed `inspect-pe-resources <exact-exe-path> --format json --full-output` for all four selected files. Default limits: 67,108,864 artifact bytes and 16,384 entries. Exceeding resource-entry budget fails rather than returning partial success.
- Full JSON Evidence retained in ignored `.runtime/rea/{wps,et,wpp,wpspdf}-pe-resources.json`. Provider `rea-pe-resources`, version 1. No payload blobs exported, no WPS processes started, no native sessions opened.

| File | REA Evidence ID | Resource entries examined | Leaf resources |
| --- | --- | ---: | ---: |
| wps.exe | ev_44a93c2007d3b6a286bec5b1b9d83ae008cbb81c16a6bf24a7f9a1f36d293155 | 26 | 11 |
| et.exe | ev_36781df88df321dba7ee24a7b03fb3df731513261f9efed4647356006f0835fe | 26 | 11 |
| wpp.exe | ev_622fc74ef412c5a8dda280006f2aaa3db9b237c5e7a618d9ca65c231f2a7c8dc | 26 | 11 |
| wpspdf.exe | ev_8bb65139626a2b17ad0afadda6bc54c26f0f4941ba8399f1c2759cda9594b437 | 64 | 30 |

Each reports `coverage.status=complete` **for its static resource inventory only**. Artifact hashes match the independent table below. Resource payloads other than icon-group reference structures remain opaque. Icon references do not observe language fallback, image decoding, or actual shell/window loading. Exact shared byte ranges are retained; nonidentical overlapping structures/payloads are rejected. No tool/workflow/internal architecture claim follows from these inventories.

## Optional MCP repair plan (not applied)

Actual `setup --client codex --dry-run --json` retained at `.runtime/rea/setup-dryrun.json`; `appliedActions=[]`. Proposed changes:

1. Update `C:\Users\ronde\.codex\config.toml` with REA registration, preserving unrelated settings; backup `C:\Users\ronde\.codex\config.toml.rea.backup` (setup rechecks backup choice if the file changes).
2. Launch command: `C:\Program Files\nodejs\node.exe` with `C:\Users\ronde\AppData\Local\npm-cache\_npx\af752b90495482d7\node_modules\rea-agents\scripts\rea.mjs` and `mcp`; no added provider environment variables.
3. Install/update bundled skill and references at `C:\Users\ronde\.agents\skills\reverse-engineer-anything`.

No repair applied: skill requires reviewed approval for these writes, and CLI metadata inspection already works without registration. Restart/reconnect and actual tool discovery would be required after any later approved repair. No engine installation proposed.
## Independently verified target identity

PowerShell `Get-FileHash -Algorithm SHA256` and `FileInfo.VersionInfo` produced the following ordinary shell evidence (not REA Evidence). Root: `C:\Users\ronde\AppData\Local\Kingsoft\WPS Office\12.1.0.29162\office6`.

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| wps.exe | 1360768 | 97EBFCEAC3DBFE894287EC2B5DBE55C1036CDF70F5B4F199FA23AA687EFAA868 |
| et.exe | 1329536 | BD5AA83920DAAF52A89EC9A83B149FE3CD6891EAE72D565239A930B8317797B6 |
| wpp.exe | 1326464 | 214B7DD0153FC9235BA90D4E3254D25BE26DAE6E6825628F4DEE5BD80AC66546 |
| wpspdf.exe | 1653632 | 435FC4A21A16A3892B2B4438A4A00A7EE5784E3045FB4493D8CE254497E53943 |

All four report file version `12,1,0,29162`. Complete shell JSON is retained locally at ignored `.runtime/rea/wps-shell-identity.json`. Hashes identify bytes only; they do not authenticate publishers or establish licensing, execution behavior, internal architecture, tool functions, document fidelity, or UI workflows.

## Remaining questions

Actual REA execution is now verified for a bounded resource inventory. WPS tool/workflow behavior, document fidelity, internal architecture, and native decompilation remain unexamined. Native engine availability and MCP registration are separate limitations; neither prevents this completed portable CLI route. Workflow observation must use an authorized supported surface and explicitly selected scenarios. Metadata evidence does not complete the full Phase 0 research gate.
