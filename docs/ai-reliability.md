# AI reliability checks

## Chunk 1: response contract

Status: implemented and live checked on 27 October 2026.

The Gemma request uses minimal thinking for short archive questions. The response reader excludes parts explicitly marked `thought: true`; the final answer parser accepts plain JSON or a complete JSON object wrapped in incidental text. It scans for an object with `answer` and `unknown`, rather than accepting the first example or embedded citation object. The existing validator still requires an exact excerpt from a source for known answers. We do not treat excerpt matching as proof of semantic support.

Live production check on `https://unfinishedroom.phoenixreborn.tech/room/`: asked **“What was the lamp by the window used for?”** three consecutive times after deployment `6370a11e2aaf752ed255d05363b432a0bcb74442`. All three returned a short answer that the lamp signaled the reading room was open, citing the exact sentence **“When it is lit, the children know the reading room is open.”** This is 3/3 for one factual question, not a general reliability score. Twelve prior tests plus the new thought-part test pass locally (13 total).

Before this fix, real responses sometimes contained prose or candidate JSON mixed with other material; one unknown-answer attempt exceeded the response budget and another timed out. These observations motivated the format change. We have not demonstrated that a particular earlier response part was tagged `thought`, so the exact cause of those specific outputs remains unconfirmed.

## Next: Chunk 2

Test unanswered questions such as “Who took the photograph?” using the real model, including a bounded completion time and no invented identity. Do not treat a generic error or a deterministic answer as a passed model-unknown check.
