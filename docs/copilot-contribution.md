# GitHub Copilot contribution, October 28, 2026

GitHub Copilot Chat was used on GitHub.com with the public repository and issue #1 attached. It inspected creator.js, starters.mjs, showcases.mjs and arrangement.mjs, and recommended a focused room-purpose synchronization fix. This was chat-assisted implementation, not a Copilot coding-agent PR or autonomous commit.

Issue: https://github.com/PHONIEXz/the-unfinished-room/issues/1

## Contribution applied

- Add a starterPurpose map for furnished starters only.
- Add a guarded syncArrangeType helper using the existing roomTypes allowlist.
- Synchronize the selector when choosing a furnished starter or copying a gallery example.
- Use the existing showcase type instead of guessing it from furniture.
- Preserve manual selection and empty-room behavior. Do not change consent, providers, saving or credentials.

The recommendation was inspected and implemented by Codex, then checked with the repository test suite and build. A focused mapping regression test was added; 104 tests pass locally. Live selector checks are recorded in the release notes when complete.

## Automation

The existing GitHub Actions workflow has also been corrected to install locked dependencies before tests and now runs the production build. It retains contents: read permissions and uses no API keys. This improves the repository's check pipeline; it was not authored by Copilot.

## Evidence and limits

The Copilot conversation remains private. No public chat-share link was created. The repository contains the applied source changes, the issue and this factual contribution record. No Copilot coding-agent assignment or formal Copilot PR approval is claimed. GitHub issue assignment was unavailable, so Copilot Chat was used instead.
