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

## AI format recovery and local spacing
80 tests and production build pass. New tests cover a single bounded format repair, one shared deadline, no repair on provider failures, retry caps, no rejected-response echo, rotated conservative floor footprints, doorway clearance on both sides, intentional rug layering, wall/window conflicts, crowded-room failures and exact preservation of memory metadata. Preview spacing fix runs locally without consent or provider calls; previews require explicit Apply and Save, and unresolved conflicts disable Apply. Live desktop: a local spacing proposal moved the table and chair away from an overlapping sofa, preserved the photograph ID and exact source text, applied/saved/reloaded, and Undo restored the original coordinates. A real shell-only Gemma request returned invalid top-level fields twice and failed safely. The prompt was then shortened and the response parser corrected to recognise layout JSON inside a code fence (its default candidate matcher had been specific to archive answers). Only a sole plan/layout wrapper is unwrapped; nested contents still pass the full strict validator. Logs report only allowlisted shape labels, never rejected response text. Hardware WebGL and touch remain unverified.

Follow-up live production check after simplifying the prompt: Gemma returned a valid four-object plan on the first attempt with cream plaster walls, two centred windows and a right doorway. The app-derived report reflected the returned settings. A photograph intersected a proposed window, so Apply was correctly disabled rather than accepting that conflict. A deliberate local photograph/window conflict also disabled Apply; restoring the saved photograph position allowed the local spacing preview again. This demonstrates one successful generation and the application safeguard, not a general provider reliability rate.

## Direct object selection and docked object editing
82 tests and build pass. Added mesh-ray picking checks for saved object child geometry and identifiers on all five demo memories. Actual 3D object clicks now work with number markers hidden; an orbit drag does not open an object. The creator uses one shared object form/catalogue beside the room in illustrated, 3D and expanded views. It keeps hidden cards for unselected objects so memory/source collection remains complete. Live desktop verification: clicking the chair mesh with all numbers hidden selected Chair and its form; adding a plant through the sidebar selected its new form; editing its name/colour marked the draft dirty; Save and reload retained all five objects and the exact photograph source text. Hardware WebGL and real touch remain unverified.

The creator and explorer now open directly in 3D. The illustrated mode and view switches are removed from the interface. Legacy hidden object data still supports journal navigation; Quick access remains available if the 3D module cannot load. Simplified 3D rendering remains the fallback on devices without WebGL.

## Warm starters and provider update, October 28
85 automated tests and build pass. All five starts (empty, living, dining, bedroom, reading) validate through JSON round trips and pass conservative spacing checks. No fixed background furniture is included. Live production desktop: created dining starter, attached a fictional table memory, saved/reloaded, explored the exact source, downloaded a backup, saved an empty room, and restored the downloaded four-object backup with the source text intact. An empty saved-room initialization issue found during this check was corrected so customized empty rooms are not replaced by defaults. Current screenshots use compatibility rendering. Actual hardware WebGL, real-phone/touch checks and refreshed videos remain pending. Groq produced a real validated proposal; it omitted requested furniture, which the app reported. Automatic fallback is covered by simulated transient failure tests, not an induced live Google outage.

## Prompt completeness follow-up
A real Groq bedroom brief requested a bed and cabinet while preserving the four-object dining room. The response preserved existing objects and changed daylight, but omitted both requested additions. The report exposed both omissions. Generation now uses the same deterministic request checks to attempt one bounded repair for missing supported furniture or quantities when capacity remains. Unsupported visual features still appear as limitations, without triggering this repair. New tests cover this recovery; 86 tests pass. This is a finite keyword-based completeness check, not general natural-language understanding.

Post-change live check: Google Gemma returned a valid bedroom plan preserving all four existing IDs and adding a bed, cabinet and plant, with dawn light and cream walls; the request report showed no missing supported features. Groq failed the same brief twice because existing-object counts were invalid; the server rejected it and the original room stayed unchanged. This comparison does not establish general success rates. Two further regression checks cover unsupported rendering wishes without extra generation, and repeated furniture omissions failing safely. 88 tests pass.

A subsequent real Groq reading-corner request succeeded after one repair: four existing objects retained, one floor lamp and one shelf added. No supported requested features were missing. The shelf intersected the window, so Apply was disabled by the local spacing safeguard. The room remained unchanged. This is a validated proposal with a blocked spatial conflict, not a ready-to-apply success.

## Provider bookkeeping recovery
Latest failure logs showed Groq repeatedly returning wrong existing-object counts and occasional IDs on new additions. A deterministic server recovery now restores omitted original geometry, reclassifies ID-less new furniture and removes provider-generated IDs from additions only. It never guesses existing identities, truncates excess furniture, accepts invalid geometry or strips invented memory fields. A singleton plan array is accepted; larger arrays remain invalid. The full strict validator and completeness/spacing checks still run afterward. Responses disclose restored originals and the creator explains that their positions were kept. Four new regression checks cover recovery and rejection boundaries; 92 tests and build pass.

## Furniture relationship layouts
AI proposals receive local room-type relationship templates before spacing: dining seating faces a scaled table, living seating groups around a coffee table with TV opposite, bedroom furniture groups around the bed, and study/reading/listening corners group chair, light and shelf. Spacing searches translations for each whole group, preserving its relative positions and rotations. It does not scatter grouped chairs. Unresolved collisions still block Apply. Manual Preview spacing fix retains its previous behavior and does not apply room-type templates. Explicit requests to keep current/exact positions skip templates. These are finite rectangular-room patterns, not arbitrary interior-design understanding. Tests cover six dining seats facing inward without overlaps, living/bedroom/study/reading groups, preservation of memory fields and non-floor objects. 95 tests and build pass.

Follow-up: six-chair dining geometry and whole-group translation tests pass. A live Google dining proposal returned eight chairs because it added six on top of two existing ones. Explicit total-count reconciliation now removes only valid surplus additions; existing objects remain untouched. "Add six" skips this total adjustment. Numeric dining-chair requests are included in the request report. 97 tests and production build pass.

## Default dining table settings
Dining tables now render attached plates/cups matched to nearest-table chair counts, plus a central apple bowl and flower vase. Each chair is counted once across multiple tables. Settings are child geometry, follow table transforms, use no external assets or extra memory slots, and have a saved bare-table toggle. Missing preference in older backups defaults to set tables without changing their round-trip schema fields. Tests cover six plates/cups, centrepieces, parent transforms, multi-table assignment, default rendering, saved off state and invalid preference rejection. 100 tests and build pass.

## Dining alignment and duplicate decor polish
Dining relationships now normalize chair size to 100%, align rows and cardinal facing, and tighten table clearance while preserving conservative spacing. Tables never shrink below their requested size. AI preview removes only new vase additions when attached table flowers are active; existing vases and explicit separate/floor-vase requests remain. Bare-table mode retains new vases. The preview explains removed duplicate additions. Tests cover varied AI sizes/angles, row symmetry, no resulting conflicts, immutable memory objects, original input, bare-table mode and explicit floor-vase exceptions. 102 tests and build pass.

## Curated public room gallery
Seven fully local curated examples cover dining, living, parlour, bedroom, reading, study and music, each with three explicitly fictional source texts. Shared viewer, journal and keepsake support URL-selected examples without writing personal-room storage. Gallery has one active 3D renderer, memory buttons as an accessible alternative, public source text, and a copy-to-unsaved-draft path. All seven examples validate on backup round trips, preserve source links and pass conservative spacing checks. 103 tests and build pass. These examples are curated layouts, not a claim that arbitrary AI prompts achieve the same result.

Live gallery verification: dining memory opened in the gallery dialog; bedroom opened in the full room viewer with three linked sources and correct fiction metadata. Copy-to-editor loaded The First Morning as an unsaved draft. A separate normal creator tab still showed the previously saved Dining room, confirming the copy had not overwritten it. Preview selection now focuses/scrolls to the active room, and gallery controls have a wider dock. Bedroom compatibility rendering was visually inspected. Hardware WebGL and real-phone testing remain pending.
