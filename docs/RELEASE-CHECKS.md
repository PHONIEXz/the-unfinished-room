# Release checks: 27 October 2026

## Recorded automated checks
- 41 tests pass; build and JavaScript syntax checks pass.
- Includes source/citation validation, extractive answers, retries and timeouts, source links, unknowns, storage errors, legacy backups, image restrictions, decoration-only/mixed rooms, layout bounds and version 7 finishes.
- Geometry loader check: optimized radio GLB parses, has finite positive dimensions, 8,206 triangles, 99,080 bytes.

## Previously verified on production desktop
- Create, save, reload, explore and inspect exact source text.
- Photo upload/re-encode, approximate date/source note persistence, JSON download/restore/save.
- Catalogue search, duplication, layer reorder, saved decorations excluded from discovery counts.
- Zoom/pan/expand/reset, keyboard exit, room settings in expanded dock.
- Radio software rendering, rotation/zoom/reset and switching object panels. WebGL is disabled in the cloud browser; hardware rendering not visually checked.

## Current finishing release
- Custom colours/shapes, wallpaper, zero/two windows, optional background furnishings, style undo, keepsake, keyboard and layout review: production desktop run passed: style apply/undo restored previous settings; wallpaper/two windows/hidden furniture persisted across reload; zero windows hid the window group; a round coloured custom object became a source-backed memory; keepsake displayed photos, date/source notes, decorations and open questions.
- Print invokes the native browser Print / Save as PDF flow. Actual exported PDF pagination still needs checking in that flow.

## Not passed or not applicable
- Real-phone/touch tests: pending. Responsive CSS is not a real-phone test.
- Large multi-photo storage stress: bounded in code; device quota varies. Save failure preserves the saved room and recommends JSON backup.
- Fresh live AI check: first request timed out visibly without losing discoveries; the single retry correctly returned NOT ESTABLISHED BY THE ARCHIVE for “Who took the photograph?” Both outcomes are recorded; no general availability claim.
- Live AI: the fixed 12-question evaluation is historical evidence, not a fresh run for every release. No personal archive is sent to AI. Free API quotas are external dependencies.
- Public publication: draft and media preparation do not constitute a DEV submission.
- No guaranteed winning probability. The optional demo-only AI is a potential weakness against the requirement for open-source AI at the core; the write-up must explain its source-grounding role without claiming personal-memory AI.

## Submission assets
Current desktop screenshots are in docs/media. A 39-second captioned screenshot tour with original synthesized background sound was rendered and saved separately for download. It is explicitly labelled a screenshot tour. Video duration and output streams were checked; a representative rendered frame was inspected. No DEV post was published. Official rules/template and deadline were checked against the current Week 4 page; Gemma and .tech are the meaningful partner categories documented.
