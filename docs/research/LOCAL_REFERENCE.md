# Local reference and REA status

Inspected 2026-10-17. Initial scope: metadata of the user-specified WPS installation. Subsequent portable REA inspection and synthetic Writer workflow observation are linked below; no proprietary payload extraction, decompilation, installation modification or private document inspection.

## WPS identity

The exact directory exists: `C:\Users\ronde\AppData\Local\Kingsoft\WPS Office\12.1.0.29162\office6`.

PowerShell `Get-ChildItem` and each file's `VersionInfo` returned:

| File | Bytes | File version | Product name |
| --- | ---: | --- | --- |
| `wps.exe` | 1,360,768 | 12,1,0,29162 | WPS Office |
| `et.exe` | 1,329,536 | 12,1,0,29162 | WPS Office |
| `wpp.exe` | 1,326,464 | 12,1,0,29162 | WPS Office |
| `wpspdf.exe` | 1,653,632 | 12,1,0,29162 | WPS Office |

These are file metadata claims only. They do not establish authenticity, installed licensing, running state, UI workflows, document compatibility or internal architecture. No WPS functionality or engine is licensed for incorporation into Librerary by this inspection.

## REA evidence boundary

Read the installed `C:/Users/ronde/.codex/skills/reverse-engineer-anything/SKILL.md`. The skill distinguishes ordinary source analysis from shipped-binary analysis and requires actual engine evidence before reporting REA findings.

Actual REA CLI portable inspection succeeded; see [Evidence and tooling status](REA_WPS_READINESS.md). Synthetic Writer create/save/reopen succeeded; see [workflow findings](WPS_WORKFLOWS.md). Static metadata does not establish runtime behavior. No REA configuration changes were applied.
