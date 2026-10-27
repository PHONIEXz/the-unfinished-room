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
- Personal creator: 25 object types across six categories, up to 12 placed objects, decoration-only objects, source memories, optional dates, source notes and photos.
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

PNG/JPEG/WebP uploads under 5 MB are resized to at most 800px on the long edge and re-encoded locally as JPEG. Original file metadata is not retained. SVG uploads and remote image URLs are rejected. Embedded photo data and dimensions are bounded; a room has a 2.4M-character photo budget. JSON imports are limited to 3 MB. Older room backups (v1–v7) remain readable; new exports use v8. Each memory is limited to 8,000 characters. Validation failure does not replace the saved room.

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
The creator offers living room, parlour, reading room, study and music room purposes. Gemma returns a constrained furniture and lighting proposal using the supported catalogue. Review its 3D preview, apply to the draft, undo if needed, and save explicitly. Existing object identities, photos, source text and metadata stay local and unchanged. Added furniture is decoration only. Invalid or unavailable model results never overwrite the room. A changed draft invalidates an older proposal. Up to twelve objects; fixed shell; manual review of overlaps is required. Beds, televisions and structural changes are not supported by this first version. Undo is temporary within the current page, while JSON backups provide portable copies.

Live arrangement verification: a small study brief produced a real Gemma proposal; Apply, Save and exact Undo were checked in production. Two larger requests timed out without changing the room. Provider availability and layout quality vary. Arrangement requests have a 55-second server budget with a 60-second browser limit; archive questions retain their shorter budget.
