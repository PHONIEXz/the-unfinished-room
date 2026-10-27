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

The response checker verifies that a source ID exists and an excerpt appears verbatim; it cannot establish that the model's interpretation is logically supported. The UI calls it a model interpretation and invites human review. A three-run factual live check is recorded in [AI reliability checks](docs/ai-reliability.md). Unknown-answer reliability and measured latency across a wider set remain unverified. The short in-memory request limit is a basic abuse guard, not a durable quota across serverless instances.

## License

MIT for code and original fictional text fixtures. Models, fonts, artwork, audio, and other third-party materials retain their own licenses and require attribution before release.
