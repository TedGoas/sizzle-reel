---
name: fork-prototype
description: >-
  Copies an existing sizzle-reel prototype folder into a new named prototype,
  registers it in router.js, and leaves frozen originals untouched. Use when
  the user says to use V2 as the foundation, fork a demo, or build something
  like an existing film. Prefer this over greenfield new-prototype when a
  source folder already exists.
---

# Fork a prototype

Canonical rules: [AGENTS.md](../../../AGENTS.md) (*Adding prototypes*). Greenfield (no source folder): [new-prototype](../new-prototype/SKILL.md).

## Branch

Run `git branch --show-current`. If it is `main` or `master`, create a feature branch before copying (`git checkout -b <name>`). Use a name Ted already gave. If he did not name one, ask. Do not invent a branch name.

Stay on the current feature branch when already off `main`.

## Copy

1. Confirm source and destination with Ted if either name is unclear. Source is an existing folder under `src/prototypes/<source>/`. Destination is `src/prototypes/<name>/`.
2. Do not copy onto or modify these frozen originals unless Ted explicitly allows it:
   - `src/prototypes/analytics-gpt/`
   - `src/prototypes/launchpad/`
   - `src/prototypes/ai-chatbot/`
   - `src/prototypes/scorecards/`

   Scorecards iteration copies *from* `scorecards` (or a later variant) *into* a new folder such as `scorecards-v1-mvp`. Never edit `scorecards/` as the fork target.
3. Copy the whole source tree:

   ```bash
   cp -R src/prototypes/<source> src/prototypes/<name>
   ```

4. Add one entry to the `prototypes` array in [`src/router.js`](../../../src/router.js):

   ```js
   { name: '<name>', label: 'Human label' },
   ```

   `name` must match the new folder. The homepage reads this list.
5. Keep fake people and records in the new folder’s `data.js`. Keep delays in one `TIMING` object. Do not retype either into a second file. Update values for the new story as needed.
6. Rewrite `src/prototypes/<name>/CLAUDE.md` for the new film: what it shows, states in order, timers, file map, data location. Do not leave the source prototype’s story as-is.

## After the copy

Match behavior from the source at `https://tedgoas.github.io/sizzle-reel/prototypes/<source>` or the source folder, then apply Ted’s deltas.

If the source is a self-playing demo, follow [autoplay-demo](../autoplay-demo/SKILL.md).

Open `http://127.0.0.1:5173/sizzle-reel/prototypes/<name>`. Restart Vite if the page is blank and the server was started before the route was added. Use [dev-server](../dev-server/SKILL.md) and [verify-ui](../verify-ui/SKILL.md).
