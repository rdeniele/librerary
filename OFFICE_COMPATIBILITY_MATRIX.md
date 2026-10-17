# Office compatibility matrix

No Office engine is integrated and no document compatibility fixture suite has run.

| Format | Current application support | Required next validation |
| --- | --- | --- |
| TXT | Managed plain-text projects; UTF-8 export implemented | Native export/reopen byte comparison, Unicode, newline behavior |
| DOCX / ODT | None | Open/edit/save/reopen layout, styles, tables, images, CJK/IME |
| XLSX / ODS / CSV | None | Formulas, types, formatting, recalculation, encoding |
| PPTX / ODP | None | Layout, fonts, notes, media, transitions |
| PDF | None | Render/search/select/print; editing and redaction separate |
| Native Google documents | None | Exported Office/ODF files or optional official API integration |

LibreOfficeKit and ONLYOFFICE are candidates, not selected engines. See [engine feasibility](docs/research/ENGINE_FEASIBILITY.md). Preserve originals and warn about verified conversion losses. A text area and TXT export do not establish DOCX compatibility.
