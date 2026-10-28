---
title: "I Built a 3D Home for Memories, and Gave the AI Boundaries"
published: false
tags: devchallenge, hf26challenge, ai, javascript
---

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 4: Ghost in the Machine](https://dev.to/challenges/hacktoberfest-week4-2026-10-26).*

## What I Built

**A room can be empty and still be full of someone.**

The chair they always chose. The table that became a classroom after dinner. The lamp they left on while reading “just one more page.”

We can save photographs of those things. But the little stories that give them meaning often live somewhere else: in a conversation, an unnamed file, or somebody’s memory.

I built **The Unfinished Room** to give those stories a place you can enter.

It is an interactive 3D memory-room creator. Start with an empty room, furnish it yourself or ask AI for an arrangement, and attach memories to meaningful objects. Visitors can open those objects, read the original words, and gradually fill a discovery journal.

For **Ghost in the Machine**, I chose the presence that familiar objects can hold. A quiet room, with stories waiting inside it.

The room is called *unfinished* because a memory does not need every detail filled in to deserve keeping.

<!-- MEDIA 1: Insert a current, sharp gallery/room screenshot here. Suggested asset: the furnished living-room gallery preview. -->

## Demo

**Start here: [Explore the seven-room gallery](https://unfinishedroom.phoenixreborn.tech/gallery/).** No account or AI request is needed to browse it.

Every room is furnished using the app’s own tools and includes **three clearly labelled fictional memories**:

| Room | Example | What it remembers |
| --- | --- | --- |
| Dining | The Sunday Table | Family lunches and a place kept for visitors |
| Living | Home at Six | The ordinary ritual of coming home |
| Parlour | The Lagoon Parlour | Neighbours, conversation and weekend visits |
| Bedroom | The First Morning | Finding your feet in a first apartment |
| Reading | One More Page | Books, borrowed stories and evening light |
| Study | Small Desk, Big Plans | First projects and useful failed attempts |
| Music | The Last Record Tonight | Listening rituals and the pause after a song |

Open a preview, turn the room, and select a memory. If a room feels like a useful starting point, **make a copy to edit**. Browsing and copying do not overwrite your saved room; saving a copied draft is a separate action.

One fictional memory in *The Sunday Table* says:

> Nobody remembers who first insisted that there should always be room for one more.

That is the kind of detail I wanted the room to hold.

**Other ways in:**

- [Build your own room](https://unfinishedroom.phoenixreborn.tech/create/).
- [Explore the original five-object archive](https://unfinishedroom.phoenixreborn.tech/room/), including opt-in Gemma questions.

<!-- VIDEO 1: Embed the refreshed gallery-to-memory walkthrough here. Use the real uploaded URL; no placeholder embed has been published. -->
<!-- MEDIA 2: Insert a current memory-detail screenshot showing its fiction/source label. -->

## Code

[View the repository on GitHub](https://github.com/PHONIEXz/the-unfinished-room).

The project’s code is MIT-licensed. The optional Meshy-generated radio asset has its own attribution and licence notice in the repository.

Useful places to inspect:

- [`web/showcases.mjs`](https://github.com/PHONIEXz/the-unfinished-room/blob/main/web/showcases.mjs): the seven example rooms and their fictional source texts.
- [`web/room-planning.mjs`](https://github.com/PHONIEXz/the-unfinished-room/blob/main/web/room-planning.mjs): furniture relationships.
- [`src/arrange-model.mjs`](https://github.com/PHONIEXz/the-unfinished-room/blob/main/src/arrange-model.mjs): generation, validation and bounded repair.
- [`src/layout-recovery.mjs`](https://github.com/PHONIEXz/the-unfinished-room/blob/main/src/layout-recovery.mjs): preserving existing objects when a model gets its lists wrong.

## How I Built It

### AI proposes a room. The app decides what it can safely use.

The creator uses **Google Gemma** and **GPT-OSS 20B through Groq**, both open-weight models, to turn a room brief into structured layout proposals.

A request can be as ordinary as:

> A modern dining room with a big wooden dining table and six dining chairs.

The AI works with a finite furniture catalogue, materials, room dimensions and openings. It returns a plan that the app checks, renders as a preview, and leaves for the user to review.

**Preview → review → apply → save.** Each step has a purpose. Generation never silently replaces the room.

I added Groq after seeing provider failures during development. Users can choose **Google only**, **Groq only**, or **Automatic**. Automatic can try the alternative after a transient failure or unusable result, with consent covering both services. The interface identifies the provider and model that produced the proposal.

This improves the options available when one service has trouble. It does not make hosted inference failure-proof.

### Six chairs taught me that valid JSON is not interior design

An early dining proposal included the requested furniture, but the chairs looked scattered. Our overlap check had found empty spaces for them. It had not understood the table as a gathering point.

So I added local relationship patterns:

- Dining chairs sit in aligned rows and face their table.
- Living-room seating groups around a coffee table.
- Bedroom furniture groups around the bed.
- Study and reading layouts coordinate the chair, desk, shelf and light.

The spacing pass now tries moving a furniture group together. If the group cannot fit, unresolved conflicts remain visible and Apply is blocked.

I also caught a counting mistake: adding six new chairs when two were already present. Explicit totals now count the existing furniture first, trimming only surplus new additions.

Dining tables come set by default: **plates and cups matched to chair count, apples, and a flower vase**. The setting is attached to the table, so it moves and scales with it. It can also be switched off.

These are finite layout rules. They improve common arrangements without claiming to understand every possible design instruction.

<!-- MEDIA 3: Insert the current six-chair dining screenshot with table settings. -->
<!-- VIDEO 2: Embed a refreshed brief-to-preview walkthrough, including the provider label and Apply step. -->

### The model does not get to rewrite your memories

Personal memory text, photos, names, dates and source notes stay in browser storage. AI arrangement receives only the deliberately entered brief and anonymous room geometry. Users can inspect that payload before consenting.

The app keeps the original object identities and memory records when applying a layout.

For example, recovery can restore geometry for an existing object that the model omitted:

```js
for (const object of input.objects) {
  if (!seen.has(object.id)) {
    objects.push({ ...object });
    preserved++;
  }
}
```

This uses the original input rather than guessing what was lost. The resulting plan still has to pass strict validation. Invalid geometry, unsupported fields and attempts to change existing identities remain errors.

### The archive can answer with evidence, or leave the question open

The original fictional reading-room demo has a separate Gemma question feature.

Gemma selects an excerpt from the supplied archive. The server checks its source ID and exact quotation, then displays complete source sentences. Invented quotations are rejected.

If the archive does not establish an answer, the response should say so. Text matching establishes where words came from; it does not prove that a passage is relevant or historically true. The reader still needs to inspect the source.

The personal-room viewer has no archive-question form, keeping its memories out of this hosted question flow.

### The tools behind the room

| Tool | Its actual job |
| --- | --- |
| HTML, CSS and vanilla JavaScript | Pages, editor, controls, gallery and memory interactions |
| Three.js, OrbitControls and SVGRenderer | Procedural 3D rooms, camera navigation and simplified rendering where WebGL is unavailable |
| Google AI Studio / Gemma | Layout proposals and source selection in the fictional archive |
| Groq / GPT-OSS 20B | An alternative provider for layout proposals |
| Node.js and esbuild | Server-side request handling, automated checks and builds |
| GitHub and Vercel | Public source, deployment and server-side API functions |
| `.tech` domain | The public home at `unfinishedroom.phoenixreborn.tech` |
| Meshy | An optional radio-model experiment in the original demo, with separate attribution |

I used Codex during development for implementation, debugging and test work. The gallery stories are original fictional examples prepared for this project.

### What I checked, and what is still pending

At this draft, **103 automated tests pass**, together with the production build. The tests cover source links, layout validation, retries, recovery, spacing, table settings and all seven gallery rooms.

Live desktop checks include opening gallery memories, exploring the full room, saving and reloading, and downloading and restoring backups. I also checked that copying a gallery example into the editor left the previously saved room unchanged.

The latest real-phone and hardware-WebGL checks remain pending. The room visuals shown during cloud-browser verification use simplified rendering.

Practical limits are visible: one room, up to 12 placed objects, a rectangular shell and stylized materials. There is no cloud sync, encrypted memory vault, photorealistic rendering or full walking-route simulation. Browser storage can be cleared, so users should export a JSON backup. The printable keepsake offers another way to carry the words out of the app.

## Why Does Open Innovation Matter?

**I wanted the room to outlast a particular model endpoint.**

Gemma and GPT-OSS are open-weight models. This build accesses them through hosted services, but the model choice and the surrounding validation code are inspectable. Adding Groq put provider choice into the working product rather than leaving it as a future ambition.

The room archive is versioned JSON: objects, settings, source text and links between them. Users can export that data, and developers can inspect how it is read and validated.

A developer could adapt the provider layer for self-hosted inference. That is a possible next step, not something this deployment already does. Hosted AI still needs a network connection and is subject to provider limits.

Keeping personal memories local is an application-design decision. Open weights alone do not provide privacy. The useful combination here is **portable room data, inspectable safeguards, and a model layer that can be changed**.

<!-- OPTIONAL AGENT SESSION: Add a genuine DevRelay link only if a session is exported. Otherwise omit the section. -->

## The Spirit of It

While testing a dining room, I kept returning to a simple idea: a table becomes meaningful because of the people who gathered around it.

The gallery’s Sunday lunch is fictional. A visitor’s version might be a real table, a real chair, and a story they have never written down before.

That is where I hope this project lands: **“I know what I would put in this room.”**

The Unfinished Room gives that thought somewhere to begin. And when a detail is missing, it leaves space for the person who remembers it.

## Prize Categories

- **Best Use of Gemma:** Gemma powers structured room proposals and checked source selection in the fictional archive.
- **Best Use of a .tech Domain:** the live app, gallery and creator are available at [unfinishedroom.phoenixreborn.tech](https://unfinishedroom.phoenixreborn.tech/).

Built by **Paul Ayoade David (Phoenix / PHONIEXz)**.
