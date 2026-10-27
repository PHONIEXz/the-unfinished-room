# Complete build roadmap

Created 27 October 2026. Target: a polished small experience with a complete story.

## Product promise

Turn a small collection of memories into an explorable room. Factual answers lead to supporting sources; missing evidence stays visible. Recover a story without pretending to contact someone who has died.

Official challenge: https://dev.to/challenges/hacktoberfest-week4-2026-10-26

Deadline: 31 October 2026 at 11:59 PM PDT, or 1 November at 07:59 WAT. Internal submission target: afternoon of 31 October in Nigeria. Recheck rules and eligibility before publication. Dates below are targets, not completion claims.

## Chunk 1: story and foundation | October 27

Status: foundation shipped. Repository, plan, fictional archive, validator, checks, responsive illustrated shell, five source panels, and discovery journal are live on Vercel at https://unfinishedroom.phoenixreborn.tech. Room interaction is a first pass; the richer journal, progression, and accessibility audit remain in Chunk 2.

- Fictional story: a neighborhood reading room remembered through five objects.
- Stable source IDs, source text, object-source links, explicit fictional status, unresolved questions.
- Visual direction: midnight blue, charcoal, warm amber, aged-paper cream, restrained burgundy. Readable type and generous spacing.
- Shipped stack: vanilla JavaScript modules, layered HTML/CSS room, and a small Node API with server-only provider keys. No full 3D engine.
- Keep archive logic independent of UI and model.
- Exit: valid coherent archive, working app shell, build check, initial visual direction.

## Chunk 2: explore the room | October 27-28

Status: dedicated /room/ page shipped with five object panels, evidence journal, session progress on refresh, an object quick-access list, and focus restoration. Richer story sequencing, final reveal presentation, and a fuller phone accessibility review remain.

- Landing page: Enter the demo and Create a room.
- Five objects: photograph, letter, radio, clock, empty frame.
- Object panels display original evidence and related discoveries.
- Journal, exploration progress, restart, and final story reveal.
- Warm light represents exploration progress, never factual confidence.
- Desktop flashlight is decorative; touch and keyboard users have equally usable controls.
- Readable object-list alternative, focus handling, reduced motion, sound off by default.
- Exit: complete demo exploration on desktop and mobile without waiting for an AI request.

## Chunk 3: evidence-based AI | October 28-29

Status: the five AI reliability chunks are implemented: final response parsing, canonical unknowns, bounded retries, extractive source answers, and a recorded 12-question production evaluation. All 12 checks passed on 27 October; 22 local tests and the build pass. See [AI reliability checks](ai-reliability.md) for raw evidence and limits. This does not complete the whole product roadmap: personal-archive AI, candidate fact extraction, timeline suggestions, broader conflict/injection testing, and full UI review remain.

- Verify available open-weight model access and output quality early, using fictional inputs.
- Target Gemma if reliability checks succeed; provider adapter permits another verified open-weight model. Do not silently forward private material to a second provider.
- Extract candidate facts, uncertain connections, timeline entries, and questions into constrained structured output.
- Every factual answer includes source IDs and supporting excerpts.
- Reject nonexistent sources and altered quotes. Separately evaluate whether evidence actually supports the statement.
- User review before suggested connections become archive facts.
- Unknown names, missing dates, and conflicting recollections remain explicit.
- Bound request duration, retries, and input/output sizes. Show retry/cancel states and preserve previous valid work.
- Treat archive text as untrusted data; escape UI output and resist embedded instructions.
- Test answerable and unanswerable questions, contradictory sources, prompt injection, malformed output, rate limits, and outages.
- Exit: live inference verified, grounding evaluation recorded, provider failure cannot corrupt the archive. Publish model and actual measured latency without fabricated success claims.

## Chunk 4: create and preserve memories | October 29-30

Status: text-only creator and first room decorator implemented at /create/, with browser save, personal room exploration, JSON export/validated restore, and unsaved-change warnings. Automated storage/validation tests pass. Custom objects (up to 12), room palettes, floor style, optional fixtures, position sliders, pointer dragging, arrow-key placement, and a clean preview are implemented with versioned backups. A desktop drag/save/reload check passed; touch-device checks remain pending. Photo uploads and AI-assisted extraction remain later work; production create/save/reload/explore/download/restore/save/reload flow has been verified with a fictional two-object room. Unsupported backups are rejected. Real phone review remains pending.

- Paste letters and memories; attach photographs with user-written descriptions.
- Review and edit sources, uncertain dates, suggested facts, and object assignments.
- Store drafts in browser storage suitable for images. Explain that clearing browser data can delete drafts.
- Versioned JSON archive download and restore provide a portable backup. Reject invalid/oversized imports.
- Consent identifies the provider and exact content sent. Exclude images from inference unless deliberately implemented and disclosed.
- Printable keepsake includes story, sources, timeline, and open questions. Start with browser Save as PDF; direct PDF download is optional.
- Unique safe filenames; no account, public sharing, or collection of private source text in analytics.
- Exit: create -> edit -> save -> reload -> explore -> export -> restore works with no missing evidence.

## Room-builder upgrade sequence | added October 27

These are additions within Chunk 4, not replacements for memory preservation or source-backed AI. Inspired by direct inspection of Lagos Life's signed-in catalogue, Design, Styles, and clean-screen menus. Its 3D view failed in this browser, so actual 3D placement and camera behavior were not verified. Build original visuals and interaction code; do not reuse its assets, branding, descriptions, or game economy.

### 4A: catalogue and focused editor | next

Status: planned. Highest priority visual/usability upgrade.

- Replace the long wall of object forms with a collapsible side catalogue and a selected-object inspector.
- Search by object name; group appearances into Furniture, Personal items, Plants, and Wall memories.
- Add an object, then edit only its name, source text, appearance, and position in the inspector.
- Keep room preview visible on desktop. Use a collapsible sheet on narrow screens, with an obvious return to the room.
- Preserve dragging, arrow keys, sliders, explicit save, and clean preview. Selection must not accidentally drag or open the memory.
- Exit: add -> select -> edit -> move -> save -> reload works without lost source text or inaccessible controls.

### 4B: object sizes and orientation | after 4A

Status: planned. Highest priority room-realism upgrade.

- Give chairs, tables, books, plants, and wall memories different footprints and original drawn appearances.
- Offer small/medium/large size and limited orientation choices before attempting arbitrary 3D rotation.
- Keep objects fully within the room at each supported size. Give overlapping items a way to be selected from the object list.
- Include appearance, size, orientation, and placement in versioned backups. Older backups load safe defaults.
- Exit: differently sized objects remain selectable and readable after resize, save/reload, and export/restore; source links remain unchanged.

### 4C: starter room styles | only after the core flows pass

Status: planned, time permitting before submission.

- Offer a few original starter looks: Family sitting room, Student reading corner, and Memory gallery.
- A style changes decoration and placement only. It never invents personal memories, names, dates, or source text.
- Preview before applying, with Cancel restoring the previous appearance. Preserve existing objects and sources.
- If adding templates with empty objects, clearly label them as blank prompts, not recovered memories.
- Exit: applying/cancelling a style cannot erase or silently replace archive content.

### Later: custom colours, saved looks, and camera choices

Status: deferred until essential contest work is secure.

- Custom wall colours and brightness, plus more original floor textures.
- Named saved looks that store decoration separately from the source archive.
- Zoom/reset, bounded panning, expanded view, keyboard camera controls, and separate object/view modes are implemented. Desktop checks passed for 140% zoom, panning without coordinate changes, zoomed object dragging, reset, Escape from expanded view, and Previous/Next memory navigation. Real-device touch remains pending. Alternative camera angles remain deferred.
- More furniture drawings and photo-backed memory frames after the first release checks.
- Full 3D rooms, avatars, currencies, shopping, daily rewards, multiplayer, and a simulated city are outside this contest build.

### Release gate for this sequence

Do 4A and 4B first. Stop optional decoration work if it threatens personal-memory functionality, data preservation, accessible use, the recorded AI evaluation, or submission preparation. Browser save/restore, photo storage decisions, consented personal AI, and the printable keepsake remain core product work in Chunk 4. Decoration alone does not complete the product.

## Chunk 5: polish and release | October 30

- Already deployed on Vercel. Verify production after each release; do not migrate hosting solely for a sponsor mention.
- Custom domain is live at unfinishedroom.phoenixreborn.tech; verify domain/TLS and all public links before submission.
- Keep secrets server-side, exclude source text from logs, set request limits and abuse controls, document actual retention behavior.
- Add original or licensed ambient audio, opt-in playback, and restrained motion.
- Optional clearly labeled synthetic narration; no real-person voice cloning.
- Check keyboard, touch, narrow layouts, contrast, focus restoration, reduced motion, slow network, refresh, and provider outage.
- Verify source and draft preservation on every generation failure.
- Exit: complete live flow verified; release checklist distinguishes passed, failed, blocked, and untested. Quota-blocked does not mean passed.

## Chunk 6: proof and submission | October 31

- Write around the moment the room lights up and the real problem of losing the context behind memories.
- Explain meaningful open innovation: replaceable models, inspectable source grounding, portable archives, reproducible setup.
- Do not claim local/offline inference unless implemented and tested.
- Actual current tools include Vercel, Google-hosted Gemma, GitHub, and the .tech domain. Verify prize eligibility against the rules before claiming any partner category. Claim Render, ElevenLabs, Copilot, or any other tool only if actually used and evidenced in this project.
- Current screenshots: initial room, source panel, cited answer, honest unknown, final reveal, creator.
- One polished 45-60 second demo; optional separate short technical walkthrough.
- README: setup, model/provider configuration, architecture, asset attribution, tests, evaluation, limitations.
- Use official DEV template and tags. User reviews the concrete final write-up before publication.
- Exit: public links and media work; article describes shipped behavior accurately; submission published before deadline.

## Scope protection

Cut optional narration, extra rooms, OCR/transcription, and direct PDF generation first. Preserve five-object demo, usable creator, evidence-based live AI, accessible controls, honest failures, export/restore, and a strong write-up.

Do not add billing, social feeds, native apps, elaborate 3D, or a complex account system before the contest.

## After the contest

Consider permissioned family collaboration, local inference on suitable hardware, transcription with review, multilingual archives, additional room layouts, and classroom/museum collections.

## Success measures

A new visitor understands the premise without help. The room has a complete beginning, discovery, and payoff. AI evaluation records unsupported claims honestly. Personal archives stay private by default. Existing archives remain readable/exportable during outages. Completion is demonstrated behavior, not a winning percentage.
