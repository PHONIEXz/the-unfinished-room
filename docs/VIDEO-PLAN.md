# The Unfinished Room: presentation videos

Three separate presentation films, all under one minute. No voice recording is required.

| Film | Length | Job | DEV placement |
| --- | --- | --- | --- |
| Enter the Room | 48 seconds | Introduce the idea, gallery, fictional memories, source notes, journal and keepsake | Under Demo, before the seven-room table |
| Make It Yours | 54 seconds | Explain the actual brief-to-proposal-to-edit-to-save journey | After Six chairs taught me that valid JSON is not interior design |
| Behind the Room | 48 seconds | Explain provider choice/fallback, consent, validation, tests, Copilot/Actions, Vercel and .tech | Beside The tools behind the room, before test results |

## Production approach

1920x1080, 24 fps, H.264 MP4 with AAC audio. Dark ink, cream, burgundy and warm amber match the application. Large on-screen captions, gentle pan/zoom, fade transitions and a guided cursor in the creator walkthrough. Each film has a separate purpose. Matching SRT subtitles are supplied.

These are edited motion presentations using actual captured app screens, with explanatory architecture/evidence graphics. They are not continuous screen recordings or footage of hardware WebGL. Captures use the cloud browser's simplified rendering path. All stories shown are explicitly fictional. No private dashboards, credentials or personal memories are included.

The ambient soundtrack is synthesized specifically for these films using soft chords and chimes, without third-party music. Everything necessary to understand the film is visible without sound.

## Actual demo captured on October 28, 2026

- Started an empty draft and entered a fictional dining-room brief requesting one wooden table and exactly six chairs.
- Used Automatic provider mode with consent.
- Received: Groq proposal ready (openai/gpt-oss-20b) after automatic fallback, seven new decorations.
- Reviewed the rendered proposal and applied it. Local relationship and spacing rules aligned the furniture.
- Attached an original fictional Sunday-table account and source note.
- Saved the demonstration room as Sunday, again, explored its memory and unlocked its journal entry.
- Opened the PDF keepsake, which contained the captured room image, seven objects and one memory.

This records a particular successful run. It does not guarantee provider availability or identical generation results.

## Publishing

Review the first cuts, upload to a supported video host, then embed each real URL at its named article position. Do not reuse the older Flow Point video links. No new video has been uploaded to YouTube or embedded in DEV by this production step.

The source renderer is scripts/render-demo-videos.py. Run it with the asset directory and an output directory; it generates MP4, SRT and a scene manifest. App code is unchanged.
