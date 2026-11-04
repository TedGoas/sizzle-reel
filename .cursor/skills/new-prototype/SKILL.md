---
name: new-prototype
description: >-
  Creates a new sizzle-reel prototype folder from scratch, registers it in
  router.js, and leaves frozen originals untouched. Use when the user asks for
  a greenfield prototype or a branch to build a new screen with no source
  folder. When they say to copy or fork an existing prototype (like V2 as the
  foundation), use fork-prototype instead. Branch off main first when the
  current branch is main.
---

# New prototype

Canonical rules: [AGENTS.md](../../../AGENTS.md) (*Adding prototypes*).

When Ted wants a copy of an existing film or folder (“use V2 as the foundation,” “fork that demo”), use [fork-prototype](../fork-prototype/SKILL.md) instead of scaffolding from scratch.

## Branch

Run `git branch --show-current`. If it is `main` or `master`, create a feature branch before editing (`git checkout -b <name>`). Use a name Ted already gave. If he did not name one, ask. Do not invent a branch name.

Stay on the current feature branch when already off `main`.

## Folder

1. Add `src/prototypes/<name>/index.vue`. `<name>` is the URL slug.
2. Add one entry to the `prototypes` array in [`src/router.js`](../../../src/router.js):

   ```js
   { name: '<name>', label: 'Human label' },
   ```

   `name` must match the folder. The homepage reads this list.
3. Do not modify these folders unless Ted explicitly allows it:
   - `src/prototypes/analytics-gpt/`
   - `src/prototypes/launchpad/`
   - `src/prototypes/ai-chatbot/`
   - `src/prototypes/scorecards/`

   Scorecards iteration belongs in a copy such as `scorecards-v1-mvp`, not in `scorecards/`.
4. Add `src/prototypes/<name>/data.js` for every fake person, number, email, and record. Export a `TIMING` object for delays and durations. Components import from it.

   ```js
   export const TIMING = { ringDelayMs: 1000, ringDurationMs: 10000 }
   export const caller = { name: 'Ben Carter', phone: '(415) 123-4567', email: 'ben@example.com' }
   ```

## Reference and check

Match behavior from `https://tedgoas.github.io/sizzle-reel/prototypes/<source>` or the source folder before inventing UI.

If `src/prototypes/<name>/CLAUDE.md` exists, read it before editing.

After the route exists, open `http://127.0.0.1:5173/sizzle-reel/prototypes/<name>`. Restart Vite if the page is blank and the server was started before the route was added. Use [dev-server](../dev-server/SKILL.md) and [verify-ui](../verify-ui/SKILL.md).

## Prototype map

After the first working build, write `src/prototypes/<name>/CLAUDE.md`: what the prototype shows, its states in order, the timers in `TIMING`, a file map, and where the data lives. See `src/prototypes/studio/CLAUDE.md`. Keep it current when the flow changes.

A self-playing demo uses [autoplay-demo](../autoplay-demo/SKILL.md). A Dialtone token pass after the first cut uses [dialtone-audit](../dialtone-audit/SKILL.md).
