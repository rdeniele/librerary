# Local reference and REA status

Inspected 2026-10-17. Scope: metadata of the user-specified WPS installation only; no application launch, extraction, decompilation, modification or private document inspection.

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

The parent session reported no registered REA tools. No REA engine was executed, no evidence IDs were generated, and no REA findings are claimed here. REA setup/configuration has not been changed. The master brief's actual REA execution gate remains unmet; normal source inspection and WPS metadata inventory do not satisfy it.

Next bounded work is authorized workflow observation against an explicitly selected app/scenario when a supported observation surface is available. Any REA connection repair must follow the skill's recovery process; configuration changes require its explicit reviewed approval. Proprietary code/assets extraction remains outside scope.
