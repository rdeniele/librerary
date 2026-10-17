# WPS workflow findings

Observed 2026-10-17 using the installed WPS 12.1.0.29162 and supported Windows Computer Use. These are runtime UI observations, separate from static REA Evidence.

## WR-01: local Unicode document round trip — passed within scope

1. Home Ctrl+N opened a choice of Docs, Slides, Sheets and PDF. Docs opened a template chooser; Blank opened Document1.
2. Clicked the blank editing surface and verified its caret. Accessibility returned no focus/tree; screenshot-backed input was used.
3. Entered exactly: `Librerary synthetic Writer probe — café Ω 2026`.
4. Ctrl+S opened Save As. Default format was Word Documents (*.docx); the first line supplied a suggested filename. Selected a new absolute local path under ignored `.runtime/wps/probes/writer-unicode-20261017.docx`.
5. Save returned a File saved notice. Ctrl+W closed the saved tab without a save prompt. The synthetic document appeared in Recent.
6. After closing, ordinary ZIP/XML inspection of our own output found the exact text in word/document.xml. File size was 10,145 bytes. Initial inspection while open failed due to WPS file locking; closing released it.
7. Reopened only that synthetic Recent entry and visually verified its text. Document left saved, without further edits.

The screenshot makes the em dash difficult to distinguish, so XML—not visual appearance—is the evidence for exact punctuation. Full file formatting, external Office rendering, multiparagraph text, tables, images, PDF export and offline-only operation were not tested.

## Tool surface observed, not functionally verified

Writer exposed Home, Insert, Page Layout, References, Review, View and Tools tabs, with font/size, emphasis, paragraph, styles and Find controls. Status showed page count, words, view controls and zoom. WPS also displayed AI, upgrade and sharing controls; none were invoked. No account or cloud change was made. Shell observations do not establish how these tools work internally.

## Librerary implications — proposals

- Make Blank a direct local creation action; keep templates available alongside it.
- Preserve familiar create/save/close/reopen shortcuts and clearly show save state.
- Treat exact Unicode persistence as the first interoperability fixture, then add styles, lists, tables, images and pagination fixtures before selecting an Office engine.
- Keep product AI, promotions and required cloud services excluded per Librerary requirements.

## Next scenarios

WR-02: formatting/list/table and PDF export; SH-01: formula/recalculation and XLSX round trip; SL-01: text/shape slides and PPTX round trip; PD-01: open/search our synthetic PDF. All remain pending. No private recent-file names or raw home captures are retained in repository notes.
