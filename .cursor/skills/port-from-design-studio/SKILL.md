---
name: port-from-design-studio
description: >-
  Finds a screen or component in Ted's design-studio source folders under
  ~/Downloads and rebuilds only that piece in sizzle-reel with local Dialtone
  replicas. Use when the user points at design-studio, design-main, or design
  folders, or asks to recreate existing Dialpad app UI.
---

# Port from design-studio

## Where to look

- `~/Downloads/design-studio-master`
- `~/Downloads/design-main`
- `~/Downloads/design`

Search places named "design studio" first. Look at "Beacon" only if Ted points there. The Dialpad app shell lives under `design-studio-master/src/prototypes/dialpad-app/`. Brand images such as connector logos live in `public/img/`.

Search names, then copy text:

```bash
grep -rliE "incoming.?call|transfer" ~/Downloads/design-studio-master/src --include=*.vue | head -20
```

## Report before building

Stop and list what you found: the file paths, what each one is, and which one you think Ted means. Ask a numbered question if there is more than one candidate. These folders hold a lot of prototypes. Port only the pieces Ted named.

## Rebuild

1. Reuse what sizzle-reel already has first: `LeftBar`, `TopBar`, `SidebarNav`, the launchpad shell.
2. Replace each `Dt*` component with the local version from the AGENTS.md table. Do not import `@dialpad/*`.
3. Icons: collect every `DtIcon*` name the source uses. Add the missing ones with [add-dialtone-icon](../add-dialtone-icon/SKILL.md) in one pass.
4. Put the source's fake people and records in the prototype's `data.js`. Put its timers in `TIMING`.
5. Keep the source's spacing and type only when they map to a `--dt-*` token or `d-*` class.

Then check with [verify-ui](../verify-ui/SKILL.md).
