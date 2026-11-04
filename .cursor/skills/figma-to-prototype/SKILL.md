---
name: figma-to-prototype
description: >-
  Builds a sizzle-reel screen or state from a Figma link: read the node,
  ask numbered questions, then build inside the existing prototype chrome
  with local Dialtone. Use when the user pastes a figma.com link for a
  prototype.
---

# Figma to prototype

Figma is layout and intent. See [AGENTS.md](../../../AGENTS.md) (*Working with Ted*, and *Scorecards builder: prefer `.builder-main`* for Scorecards builder UI).

## Read

1. Parse the link: `fileKey` from the path, `node-id` with `-` changed to `:`.
2. `create_session` for the file, then `get_screenshot` and `get_design_context` for each node Ted linked.
3. Open the screenshot. Note what is new compared with the current prototype. Ignore chrome that differs from the live shell.

## Ask

Send one numbered list in chat. Do not use question popups. Cover only what blocks the build:

- Which Figma content to copy and which data to make up. The default is made-up data that fits the prototype's story.
- How many rows or items to show.
- Labels that differ from the current prototype.
- Pieces to skip.
- What happens after the state, if the Figma does not show it.

## Build

- Add data to the prototype's `data.js`, not into components.
- Restyle old controls to current Dialtone. Icons come from [add-dialtone-icon](../add-dialtone-icon/SKILL.md).
- Write strings in [ted-voice](../ted-voice/SKILL.md).
- Update the prototype's `CLAUDE.md` if the flow or states changed.

Check with [verify-ui](../verify-ui/SKILL.md) and compare the screenshots to the Figma screenshot.
