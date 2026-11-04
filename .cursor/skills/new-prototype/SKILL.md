---
name: new-prototype
description: >-
  Creates a new sizzle-reel prototype folder, registers it in router.js, and
  leaves frozen originals untouched. Use when the user asks for a new
  prototype, a demo fork, or a branch to build a new screen. Branch off main
  first when the current branch is main.
---

# New prototype

Canonical rules: [AGENTS.md](../../../AGENTS.md) (*Adding prototypes*).

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

## Reference and check

Match behavior from `https://tedgoas.github.io/sizzle-reel/prototypes/<source>` or the source folder before inventing UI.

If `src/prototypes/<name>/CLAUDE.md` exists, read it before editing.

After the route exists, open `http://127.0.0.1:5173/sizzle-reel/prototypes/<name>`. Restart Vite if the page is blank and the server was started before the route was added.

A self-playing demo uses [autoplay-demo](../autoplay-demo/SKILL.md).
