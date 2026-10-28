# The Unfinished Room

**A room made from what someone left behind.**

Explore a fictional reading room through five objects, inspect the surviving sources, and notice what they do not establish. Or build a personal memory room, saved in your browser.

Created by **Paul Ayoade David (Phoenix / PHONIEXz)**.

- [Live app](https://unfinishedroom.phoenixreborn.tech/)
- [Fictional demo](https://unfinishedroom.phoenixreborn.tech/room/)
- [Create a room](https://unfinishedroom.phoenixreborn.tech/create/)
- [Demo keepsake](https://unfinishedroom.phoenixreborn.tech/keepsake/)

## What works

- Optional original 3D diorama in the fictional demo, with orbit/zoom, five source-linked memory markers, day/lamp controls and an illustrated fallback. Personal rooms also open in 3D, and the creator supports surface placement, object transforms and saving inside the 3D dock. The 3D shell is a fixed-size diorama; richer wallpaper/doorway/alcove choices remain in the illustrated editor.
- Original layered SVG cutaway interior, five source-backed demo objects, journal, discovery progress, quick-access list, next/previous panels and reset.
- Daylight and lamp controls, optional synthesized radio static, reduced-motion support, zoom/pan/expanded view and a responsive controls dock.
- Personal creator: 32 object types across six categories, up to 12 placed objects, decoration-only objects, source memories, optional dates, source notes and photos.
- Drag or use keyboard/sliders to place objects; rotate/resize artwork; duplicate, remove and change front/back order.
- Room palettes, wallpaper, floor types, window position/count, optional doorway/fixtures/background furniture and reversible style presets.
- Custom object colours and box/round/diamond shapes. Uploaded photos take precedence over generated artwork.
- Local save, versioned JSON export/restore, validation before replacing a saved room, and navigation warnings for unsaved changes.
- Printable keepsake with all saved memories, original source text, photos, date notes, decorations and unanswered questions. Use the browser's Print / Save as PDF option.
- Optional 99 KB Meshy radio in the demo detail panel: 8,206 triangles, rotatable, no auto-animation, hardware or software rendering. It is untextured and separate from the illustrated room.

## Run

Node.js 24 or later:

```sh
npm ci
npm test
npm run build
```

Serve `dist` with any static server for the creator/explorer. Vercel also serves `api/ask.mjs`. Build uses esbuild to bundle Three.js only for the optional lazy-loaded radio preview. No runtime CDN dependencies.

## AI and evidence

The fictional demo offers opt-in questions using Google's open-weight `gemma-4-26b-a4b-it` model. Set `GEMMA_API_KEY` server-side on Vercel to enable it. Never commit keys or put them in browser code.

Gemma selects exact excerpts; answers are expanded to complete source sentences. Unknowns use a fixed response, invented citations are rejected, and transient provider errors have bounded retries. This establishes textual provenance, not that a passage is relevant or that an account is true. The UI asks readers to check relevance.

A fixed 12-question live evaluation passed on 27 October 2026. [Raw checks and limits](docs/ai-reliability.md) are available. That is a small recorded evaluation, not a general reliability percentage. Quota and availability still depend on Google. Basic request limiting is per serverless instance.

**Personal photos and memory/source text are never sent to AI.** The personal viewer has no archive-question form. The creator now offers optional AI arrangement: after explicit consent, only the deliberate brief, room purpose and anonymous geometry (types, positions, surfaces, sizes, rotations and colours) are sent to Gemma. An exact payload preview is available before sending. There is no impersonation of deceased people.

## Local storage and privacy

One room is saved in this browser's localStorage. Save replaces the previously saved room; unsaved edits exist only in the open page. This is not encrypted storage, a cloud backup or a private sharing service. Other people using this browser profile can access it. Clearing site data or changing browser/device can remove access.

PNG/JPEG/WebP uploads under 5 MB are resized to at most 800px on the long edge and re-encoded locally as JPEG. Original file metadata is not retained. SVG uploads and remote image URLs are rejected. Embedded photo data and dimensions are bounded; a room has a 2.4M-character photo budget. JSON imports are limited to 3 MB. Older room backups (v1–v9) remain readable; new exports use v10. Each memory is limited to 8,000 characters. Validation failure does not replace the saved room.

**Backups and printed keepsakes include personal content and photos. Keep those files private.** Download a backup before clearing browser data. A keepsake uses the saved room, so save editor changes first. Printing is not an editable backup.

## Verification and limits

Automated tests cover evidence validation, AI parsing/retries, camera bounds, placement maths, storage failures, legacy backups, image validation, decoration-only/mixed rooms, layer ordering and finishing settings. Production desktop checks include create/save/reload/explore, photos/metadata, backup download/restore, catalogue search/duplication, camera controls and the software 3D preview.

Real-phone checks remain pending. The software 3D route was visually verified because the cloud browser has WebGL disabled; hardware rendering is implemented but not visually verified here. There is no pinch-camera gesture, automatic collision avoidance, fully movable room-shell furniture, cloud sync, private share links or personal-memory AI. Background set dressing may be hidden; catalogue objects can be freely arranged.

See [current release checks](docs/RELEASE-CHECKS.md), [submission draft](docs/SUBMISSION.md) and [roadmap](docs/ROADMAP.md). Historical roadmap milestones describe earlier builds; this README and release checks describe the current release.

## Tools and credits

Vanilla HTML/CSS/JavaScript, original inline SVG artwork, Node.js tests, Three.js/OrbitControls/SVGRenderer, esbuild, glTF Transform/meshoptimizer, Google AI Studio/Gemma, GitHub, Vercel and the .tech domain. Meshy generated the optional radio mesh, simplified from 102,622 to 8,206 triangles. Its [CC BY 4.0 notice](web/assets/radio-license.txt) is separate from the code license. Radio static is generated in-browser with Web Audio; no external audio track is used by the app.

## License

MIT for original code, original SVG artwork and fictional text fixtures. The Meshy radio is separately CC BY 4.0 with attribution. Dependencies retain their own licenses. Personal archive content remains the user's content. Do not claim private ownership of the free-plan Meshy asset.

## Describe your room
The creator offers living room, parlour, reading room, study, music room, bedroom and dining room purposes. Gemma returns a constrained furniture and lighting proposal using the supported catalogue. Review its 3D preview, apply to the draft, undo if needed, and save explicitly. Existing object identities, photos, source text and metadata stay local and unchanged. Added furniture is decoration only. Invalid or unavailable model results never overwrite the room. A changed draft invalidates an older proposal. Up to twelve objects; a bounded rectangular shell; floor overlaps and doorway clearance are checked locally, with nearby repositioning in previews. Wall/window conflicts and crowded layouts block proposal application until corrected. Manual visual review is still required. Beds, dining tables/chairs, static televisions, cabinets, floor lamps and ceiling pendants are supported. Curved/multi-room architecture and photorealistic rendering remain outside this version. Undo is temporary within the current page, while JSON backups provide portable copies.

Live arrangement verification: a small study brief produced a real Gemma proposal; Apply, Save and exact Undo were checked in production. Two larger requests timed out without changing the room. Provider availability and layout quality vary. Arrangement requests have a shared 55-second server budget with a 60-second browser limit. One bounded format repair can request a fresh plan from the same consented input; rejected model text is never echoed or logged. Provider failures do not trigger format repair; archive questions retain their shorter budget.

### Expanded room essentials
The catalogue now has 32 object types. New procedural 3D and original SVG objects: bed, dining table, dining chair, static TV, cabinet, floor lamp and ceiling pendant. Pendants default to ceiling placement; overhead movement uses the same saved x/y coordinates and bounded drag plane. These types work as decorations or optional memories, in JSON backups and AI proposals. TV screens are decorative, with no media playback. Lighting is still a shared room mood, not an electrical or architectural simulation.

## Materials and honest AI result summaries
Schema v9 adds wall finish (plaster, brick, wallpaper), wall colour, marble-style flooring and per-object original/wood/fabric/metal finishes. Older room backups remain readable. 3D hardware rendering generates original wood-grain/weave maps locally, with roughness/metal shading; the SVG compatibility view approximates material appearance. There are no downloaded texture assets, mirror reflections or photorealistic exports. Room finishes and selected-object materials can be changed in the 3D dock without another AI request.

AI proposals now show app-derived Created, Substituted and Not available / not included lists. Counts and finish claims come from validated scene settings, not generated narrative. Bounded request checks flag common material mismatches, missing objects/quantities and unsupported rendering/architecture. These checks are explicitly non-exhaustive; preview and walking-space review remain required. The model narrative is not presented as proof of completion.

“Check my current room” runs the same bounded result checks locally, without AI or consent. It checks the current draft against the typed brief; later edits hide that report until it is checked again. This does not generate an arrangement.

## Adjustable room shell
Personal 3D rooms support approximate width 6–12 m, depth 5–10 m and height 3–5 m. Choose zero, one or two back-wall windows; adjust window width/height and left/centre/right position. Move the doorway to the left or right wall, slide it along the wall, or remove it. Window and door holes are actual gaps in the generated wall panels. The right-wall doorway changes the camera side so the interior stays visible. View bounds adapt to room size and viewport.

Shell controls are available in the normal editor and 3D dock. They persist in schema v10 and portable JSON. Existing object identities, text and normalized coordinates are preserved; editable furniture is not stretched. Position margins account for furniture footprint, rotation and size. This prevents floor-edge clipping, not collisions with other objects or openings. Review wall-mounted items and walking space after edits. Background set dressing fits uniformly; desk/shelf slots refer to it. The illustrated view remains schematic, and alcove/fireplace options are still illustrated-only. AI may select only the same validated shell controls; personal source text/photos are never sent.

Use **Preview spacing fix** for a local, reversible draft proposal without an AI request. Rugs may sit under furniture; ceiling and tabletop objects are excluded from floor checks. Conservative rotated bounding boxes reserve a small gap and doorway approach. This is not complete pathfinding or collision simulation, and the checker does not account for fixed background furnishings. Apply hides those background furnishings; Save remains explicit.

### Arrangement providers
Set server-only `GEMMA_API_KEY` and/or `GROQ_API_KEY` in Vercel production, then redeploy. The room creator offers Automatic, Google Gemma only, and Groq only. Groq uses `openai/gpt-oss-20b` through its Chat Completions API. It was introduced to provide an alternative when Google has temporary capacity or quota failures.

Automatic permits the same explicitly consented brief and anonymous room geometry to reach either service. It tries Google first when configured, then Groq on transient errors, timeouts or unusable output. Explicit selections never switch. Each result identifies its provider and model. Changing providers clears consent. Object names, memories, images and source notes are excluded. Both services use the same local schema validation, preview and apply safeguards. Provider failure never applies a layout. The discovery-question feature remains Google-only; this choice controls room arrangement.
