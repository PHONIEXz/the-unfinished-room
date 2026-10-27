# AI reliability checks

## Chunk 1: response contract

Status: implemented and live checked on 27 October 2026.

The Gemma request uses minimal thinking for short archive questions. The response reader excludes parts explicitly marked `thought: true`; the final answer parser accepts plain JSON or a complete JSON object wrapped in incidental text. It scans for an object with `answer` and `unknown`, rather than accepting the first example or embedded citation object. The existing validator still requires an exact excerpt from a source for known answers. We do not treat excerpt matching as proof of semantic support.

Live production check on `https://unfinishedroom.phoenixreborn.tech/room/`: asked **“What was the lamp by the window used for?”** three consecutive times after deployment `6370a11e2aaf752ed255d05363b432a0bcb74442`. All three returned a short answer that the lamp signaled the reading room was open, citing the exact sentence **“When it is lit, the children know the reading room is open.”** This is 3/3 for one factual question, not a general reliability score. Twelve prior tests plus the new thought-part test pass locally (13 total).

Before this fix, real responses sometimes contained prose or candidate JSON mixed with other material; one unknown-answer attempt exceeded the response budget and another timed out. These observations motivated the format change. We have not demonstrated that a particular earlier response part was tagged `thought`, so the exact cause of those specific outputs remains unconfirmed.

## Chunk 2: unanswered questions

On 27 October 2026, the first live “Who took the photograph?” attempt returned a model response with `unknown: true` and a quotation, so the strict validator rejected it. The validator now accepts the model's unknown classification after checking the citation shape and exact excerpt. It discards incidental citations and model phrasing, returning one canonical unknown sentence with no evidence. This prevents an unknown answer from carrying an invented identity or implying that an excerpt proves absence. It does not independently determine whether a model has correctly classified every question as unknown.

Production deployment `8aaaab914ca00a9b34dd4de0850b772a459976ee` returned the visible “NOT ESTABLISHED BY THE ARCHIVE” state and a citation-free response for all three open questions: who took the photograph, who wrote the letter, and who first opened the room. Each was a live Gemma request and resolved within the existing 28-second server timeout. We did not instrument precise per-question durations, so there is no measured latency claim. Fourteen local tests passed after adding an API regression for the model's unknown-with-quote shape.

Next: Chunk 3, bounded retries and timeouts for transient provider failures. A generic error does not count as a model-unknown response.

## Chunk 3: bounded retries

Implemented a maximum of three provider attempts within one 28-second deadline, with each attempt capped at 12 seconds (or the remaining budget). HTTP 429, 500, 502, 503, 504 and network/timeout failures can retry. Backoff starts at 500ms then 1000ms, with up to 249ms of jitter. A valid Retry-After seconds value or HTTP date takes precedence; if it cannot fit in the deadline, the request fails rather than retrying early. Permanent HTTP errors and malformed JSON do not retry. Evidence validation still runs once after generation and never relaxes its rules to obtain a result.

Nineteen tests pass, including simulated transient recovery, permanent rejection, invalid JSON, timeout exhaustion, Retry-After, and a shrinking deadline. These simulations verify failure handling; they do not constitute a live provider outage test. Logs contain attempt/status metadata only. No warm-up requests, provider switching, or extra consent are introduced.
