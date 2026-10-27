# The Unfinished Room

**Five objects. One forgotten story. Some questions still unanswered.**

An interactive memory room where letters, photographs, and recollections reveal a story through surviving evidence. Planned open-weight AI connects sources and answers questions while preserving uncertainty.

Created by **Paul Ayoade David (Phoenix / PHONIEXz)** for the Hacktoberfest 2026 Ghost in the Machine challenge.

## Status

Foundation deployed at [unfinishedroom.phoenixreborn.tech](https://unfinishedroom.phoenixreborn.tech): home introduction and a separate [interactive room](https://unfinishedroom.phoenixreborn.tech/room/) with five source panels, session discovery journal, fictional demonstration archive, and structural checks. Personal archive creation and connected AI are not built yet.

## Run

Requires Node.js 24 or later. These foundation checks need no dependencies or API key.

```sh
npm test
npm run build
```

## Experience

Explore a photograph, letter, radio, clock, and empty frame. The room warms as discoveries accumulate. Ask questions, inspect evidence, and preserve a keepsake including unanswered questions.

The current foundation supports the five-object demo and discovery journal. Question answering and keepsake export are planned later chunks.

See [the complete roadmap](docs/ROADMAP.md) for chunks, acceptance criteria, architecture, and release gates.

## Principles

- Public demo material is explicitly fictional.
- User archives are local by default. Sending source content to an AI provider requires a clear choice.
- Sources are data, never instructions. No invented quotes or identities.
- Exact quote matching alone does not prove an interpretation is correct.
- Exploration remains available when AI is unavailable. Cached results are labeled.
- Touch, keyboard, readable list view, reduced motion, and opt-in sound are essential.
- No impersonation of deceased people.

## Live AI configuration

The room includes an opt-in Gemma question form. To activate it, set `GEMMA_API_KEY` in this Vercel project's server environment and redeploy. It uses `gemma-4-26b-a4b-it` via Google's generateContent endpoint. No user archive is sent in this version: only the user's question and the three explicitly fictional fixture texts. Without a key, the API returns a clear unavailable message. Do not put keys in browser code, GitHub, or screenshots.

Known answers use complete source sentences around Gemma's selected exact excerpt, rather than displaying unchecked model prose. The UI asks readers to check passage relevance. This ensures source provenance, not that the passage answers the question or that the archive is true. Narrow factual and unknown live checks are recorded in [AI reliability checks](docs/ai-reliability.md); a fixed 12-question production evaluation passed on 27 October 2026. See the linked raw responses and scope limits; this is not a general reliability percentage. The short in-memory request limit is a basic abuse guard, not a durable quota across serverless instances.

## License

MIT for code and original fictional text fixtures. Models, fonts, artwork, audio, and other third-party materials retain their own licenses and require attribution before release.

## Personal room editor

Open `/create/` to write a room title, up to twelve titled memories, and unanswered questions. Save stores one room in this browser's localStorage, replacing its previous saved room. Save & explore opens those sources in the illustrated room, with separate discovery progress. No personal source text is sent to the server or AI. The AI form remains exclusive to the fictional demo. Browser storage is not an encrypted vault or cloud backup; clearing site data can erase it.

Download backup exports the current valid editor contents as portable JSON. Restore validates version, size, text bounds, IDs and source links before populating the editor; saving is a separate step. Invalid imports leave the saved room unchanged. This first creator supports written photo descriptions, not image uploads or AI fact extraction. Unsaved drafts remain in the open editor only, with a navigation warning. Use a backup for portability.

Creator verification (27 October 2026): on production, created a fictional two-object room, saved, reloaded, explored both source panels, downloaded its JSON backup, changed and saved its title, restored the downloaded backup, saved and reloaded it. An unsupported-version backup was rejected without replacing the visible editor contents. Automated tests additionally cover broken links, oversized text, duplicate IDs, storage failure and markup-like source text. Real phone testing is still pending.

### Decorating a personal room

The editor supports up to 12 named memory objects, with selectable appearances (including books, plants, chairs and custom keepsakes), horizontal/vertical position controls and a live preview. Choose midnight, cream, burgundy or lagoon walls; wood or tiled flooring; and show/hide the window, shelf and lamp. Personal rooms use those settings during exploration. Version 2 backups include decoration and positions; version 1 text-room backups remain readable and acquire default positions when edited. The editor exports version 2. Backups are limited to 600 KB; each memory remains limited to 8,000 characters. This is an illustrated room builder, not a game or a full 3D furniture simulator. Image uploads and personal AI are still pending.

Decorator live verification (27 October): an existing version 1 room loaded into the new editor. Added a reading chair, set its position to 12/60, selected lagoon walls and tiles, hid the shelf, saved and explored. All three objects appeared, the chair opened its exact memory, and reload retained the room and exploration progress. Automated tests cover version 2 backup round-trips, twelve-object bounds, invalid palettes and coordinates; full phone/decorated-file restore testing remains pending.

Room placement now supports pointer dragging in the creator preview, plus arrow-key movement (Shift for larger steps) and sliders. Drag positions are bounded to keep objects inside the scene and are saved/exported with the room. Save is explicit; pointer cancellation rolls back the move. Hide editing controls gives a larger preview while keeping save/export actions available. Wall edges and floor perspective add illustrated depth, without requiring WebGL. Actual touch-device checks remain pending.
