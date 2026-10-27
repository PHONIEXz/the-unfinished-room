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
- Planned stack: React/TypeScript frontend, layered HTML/SVG/CSS room, small Node API with server-only provider keys. No full 3D engine.
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

Status: the five AI reliability chunks are implemented: final response parsing, canonical unknowns, bounded retries, extractive source answers, and a recorded 12-question production evaluation. All 12 checks passed on 27 October; 22 local tests and the build pass. See [AI reliability checks](ai-reliability.md) for raw evidence and limits. This does not complete the whole product roadmap: personal archive creation, candidate fact extraction, timeline suggestions, broader conflict/injection testing, and full UI review remain.

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

Status: first text-only creator implemented at /create/, with browser save, personal room exploration, JSON export/validated restore, and unsaved-change warnings. Automated storage/validation tests pass. Photo uploads and AI-assisted extraction remain later work; browser end-to-end verification follows deployment.

- Paste letters and memories; attach photographs with user-written descriptions.
- Review and edit sources, uncertain dates, suggested facts, and object assignments.
- Store drafts in browser storage suitable for images. Explain that clearing browser data can delete drafts.
- Versioned JSON archive download and restore provide a portable backup. Reject invalid/oversized imports.
- Consent identifies the provider and exact content sent. Exclude images from inference unless deliberately implemented and disclosed.
- Printable keepsake includes story, sources, timeline, and open questions. Start with browser Save as PDF; direct PDF download is optional.
- Unique safe filenames; no account, public sharing, or collection of private source text in analytics.
- Exit: create -> edit -> save -> reload -> explore -> export -> restore works with no missing evidence.

## Chunk 5: polish and release | October 30

- Deploy an early preview before final polish; planned hosting is Render.
- Connect an available subdomain of phoenixreborn.tech after DNS verification.
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
- Candidate partner fits: Render, Gemma, .tech, optional ElevenLabs. Claim Copilot or any other tool only if actually used and evidenced.
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
