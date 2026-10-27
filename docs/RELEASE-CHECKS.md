# Release checks: 27 October 2026

## Recorded automated checks
- 42 tests pass; build and JavaScript syntax checks pass.
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

## 3D room prototype
Finite geometry and five anchor checks pass. First live compatibility-rendered room loaded; its letter marker opened the exact existing source. Hardware WebGL shading/shadow quality and mobile performance remain unverified. The viewer now also loads personal archives.

## Personal 3D creator verification
- 46 automated tests and production build pass.
- Live desktop: fictional keepsake and guitar loaded into 3D; position, rotation and size edits persisted after Save room and reload.
- Object dropdown supports selection when markers overlap. Lamp and time-of-day changes are saved with the room.
- Compatibility rendering uses photo thumbnails on memory markers; textured photo surfaces and hardware shadows require WebGL.
- 3D uses a fixed shell. Wallpaper, proportions and doorway choices remain saved and are shown in the illustrated editor.
- Hardware WebGL, real touch dragging and native PDF pagination remain unverified.

## AI arrangement implementation
54 tests and production build pass. Tests cover consent and privacy field boundaries, same-origin rejection, supported geometry, preservation of existing IDs/kinds, twelve-object limits, and rejection of invented memory fields in model output. UI offers payload review, proposal preview, Apply, Try again, Discard and one-level Undo. Live desktop verification: consent blocked an unapproved request; outbound payload showed anonymous geometry without names or memory text; a real Gemma study proposal added two decorations and retained both existing objects; Apply and Save worked; Undo restored the original IDs, text and geometry exactly; saving and reloading retained that restoration. Two earlier larger requests timed out safely. Availability for more complex briefs remains variable.

## Room essentials expansion
Seven new object types (32 total): bed, dining table/chair, static TV, cabinet, floor lamp, ceiling pendant. Shared ceiling placement supports bounded movement and backup validation. Bedroom/dining purposes are available to AI planning. 56 tests and build pass; geometry tests cover distinct bounded meshes and ceiling pendant height. Live desktop: a real Gemma bedroom proposal added a burgundy bed while preserving both existing objects; Apply opened the 3D editor. All seven types were added, saved and reloaded. Keyboard positioning persisted, including a wall TV and ceiling pendant. Compatibility renderer visually inspected; hardware WebGL and touch remain unverified.

## Finish controls and app-derived result report
62 tests and build pass. New checks cover v9 save/restore, unsafe material rejection, supported AI finish fields, deterministic report counts/substitutions/limits and bounded brick/marble geometry. Manual controls and AI share finite finish enums. Live desktop: brick walls, marble-style floor and a fabric bed survived Save/reload from the previous v8 room. The 3D dock changed wall/object finishes directly, with form state updated correctly. Local result checks identified actual finishes, missing requested sofas, velvet approximation, unsupported gold/architecture/render features; no AI consent was needed. Editing the brief hid the old local report. Checks distinguish plainly excluded items from missing requested items. Two live nine-object material-generation requests timed out safely, so this release does not claim live AI finish generation passed. Hardware shading and real-phone checks remain unverified.

## Adjustable rectangular shell
68 tests and build pass. New checks verify real window/door holes, both doorway sides, safe dimension extremes, footprint-aware floor bounds, normalized coordinate round trips, unchanged furniture mesh sizes, v10 memory-preserving save/restore and validated anonymous AI shell controls. Older backups remain covered. Live desktop: created a 10×8×4.2 m room with two centred 1.8×1.6 m windows and right doorway at 65%; saved/reloaded. Resized through the 3D dock to 6×5×3.2 m; removed/restored windows; changed doorway none/left/right; saved/reloaded. All five objects remained and the source object ID/title/text were exact. The resized room reopened in the personal explorer and its 3D photograph marker opened the exact source text. One live AI shell request returned unsupported fields and was rejected without changing the room. Simplified rendering was adjusted to keep the right-wall interior lit. Furniture-to-furniture/opening collisions are not automatically resolved; hardware/touch remain unverified.
