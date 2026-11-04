# sizzle-reel

Vue 3 + Vite prototype showcase. Published at `/sizzle-reel/`. Every dependency must install from the public npm registry with no token.

**Dialtone** is the design system. Tokens and `d-*` utility classes are required. Dialtone Vue and CSS packages are not. Lookup index: [DESIGN.md](DESIGN.md). Live docs: [dialtone.dialpad.com](https://dialtone.dialpad.com/).

Cursor rules in [`.cursor/rules/`](.cursor/rules/) are the short always-on constraints. This file is the longer contract for Cursor and Claude Code. Task workflows live in [`.cursor/skills/`](.cursor/skills/) (Claude Code loads the same files via `.claude/skills`).

## Working with Ted

- **Reference before inventing.** Match the published prototype at `https://tedgoas.github.io/sizzle-reel/prototypes/<name>` or the source folder under `src/prototypes/`. Then polish.
- **New work is a new folder.** Register it in [`src/router.js`](src/router.js). Leave the frozen originals alone (see *Adding prototypes*).
- **One visual change per polish turn.** Change one thing (spacing, color, motion, copy) and stop for review.
- **Questions go in chat as a numbered list.** Do not use question popups. Ted answers by number (“1. Yes 2. Four rows”).
- **Fuzzy or repeated ask.** Restate in one line (“I’ll change X on `/prototypes/studio`”) or ask one question before editing. A re-ask means the last edit missed. Re-read, confirm, then act.
- **Presentation only.** When Ted says presentation only, controls can be focused, toggled, and typed in. They do not need real behavior unless he says so.
- **Figma is layout and intent.** Old files often show outdated chrome and pre-Dialtone controls. Keep the layout. Restyle controls to current Dialtone. Ask if a chrome difference is major (a missing nav, a different product shell) or if a faithful copy would look meaningfully older. Fabricate data that fits the prototype's story unless Ted says to copy the Figma content. Workflow: [figma-to-prototype](.cursor/skills/figma-to-prototype/SKILL.md).
- **One source for fake data.** People, phone numbers, emails, IDs, and records live in one `src/prototypes/<name>/data.js`. Components import them. Never retype a name or number in a second file.
- **One source for timing.** Delays and durations (ring time, autoplay steps, AI fill) live in one `TIMING` object in `data.js` or at the top of `index.vue`. Ted tunes these often.
- **Prove it in the browser.** After UI edits, give the full URL `http://127.0.0.1:5173/sizzle-reel/prototypes/<name>` and exercise the interaction. A blank page after a new route usually means Vite was started before that route existed. Restart the dev server, then check branch and port before changing the design again. Start or reuse the server with [dev-server](.cursor/skills/dev-server/SKILL.md). Screenshot timed states with [verify-ui](.cursor/skills/verify-ui/SKILL.md).
- **“I don’t see it.”** Stop editing. Check branch, port `5173`, and that the server is this repo. Restart with [dev-server](.cursor/skills/dev-server/SKILL.md), then [verify-ui](.cursor/skills/verify-ui/SKILL.md). Do not change the design again until the last change is visible.
- **Two failed approaches.** After two misses on the same problem, name the pivot (“abandon A; do B”). Do not invent a third custom path.
- **One deliverable per branch.** If `git status` shows unrelated prototype dirt (Studio vs Scorecards, two films, docs vs UI), surface it and split before commit or PR.
- **Reuse the shared shell.** Prefer `LeftBar`, `TopBar`, `SidebarNav`, and existing Scorecards chrome before rebuilding nav or product chrome.
- **Prototype map.** If `src/prototypes/<name>/CLAUDE.md` exists, read it before editing that prototype. After the first working build of a new prototype, write one: states, timers, component map, data file. Update it when the flow changes. Long sessions run out of context, and the map is how the next one starts warm.
- **Porting from design-studio.** Source code in `~/Downloads/design-studio*` follows [port-from-design-studio](.cursor/skills/port-from-design-studio/SKILL.md). Prefer the **light** theme. Dialtone’s rem root is **10px** — rem gaps from source look about 1.6× too large if treated as 16px. Report what you found before building.
- **Dialtone check.** After a first visual cut of a new screen, or when Ted asks for a token pass, use [dialtone-audit](.cursor/skills/dialtone-audit/SKILL.md).
- **Forking a prototype.** Copy an existing folder rather than starting from scratch when Ted says “like V2” or “use that as the foundation”: [fork-prototype](.cursor/skills/fork-prototype/SKILL.md).
- **Microcopy.** UI strings, empty states, toasts, and helper text use the [ted-voice](.cursor/skills/ted-voice/SKILL.md) skill.
- **Ambiguous flow.** Use [shaping](.cursor/skills/shaping/SKILL.md) before building when there is more than one real approach. A one-control polish pass skips it.
- **Several places.** After a shape is chosen, use [breadboard](.cursor/skills/breadboard/SKILL.md) to list places, controls, and the state the prototype remembers.
- **Before merge.** [skeptic-review](.cursor/skills/skeptic-review/SKILL.md) is a read-only pass on the branch diff. It reports in chat and does not fix.
- **Charts.** New and restyled charts follow [chart](.cursor/skills/chart/SKILL.md).

## Git workflow

Default branch is `main` (treat `master` the same).

- Never commit, amend, or push on `main` / `master`. If files need to change while on that branch, create a feature branch first so the working tree comes along.
- Stay on the current feature branch when already off `main`.
- Never commit unless Ted asks. Never push unless he asks. “Commit and push” means both. “Commit” does not mean push.
- When Ted asks whether work was already committed, answer from `git status` and `git log` only. Do not commit unless he explicitly asks.
- Stop after editing so he can verify before commit.
- Commit, push, and pull request steps: [commit](.cursor/skills/commit/SKILL.md), [push](.cursor/skills/push/SKILL.md), [pr-create](.cursor/skills/pr-create/SKILL.md).

## No auth-gated dependencies

`npm install` must work without `NODE_AUTH_TOKEN` or any private GitHub Packages token.

Never add:

- `@dialpad/dialtone`
- `@dialpad/dialtone-css`
- `@dialpad/dialtone-icons`
- `@dialpad/dialtone-tokens`
- Any package from `npm.pkg.github.com`

Dialtone assets in this repo are local replicas. `chart.js` and `vue-chartjs` are already approved.

## Dialtone, locally

Use tokens and utility classes so prototypes look like Dialtone. Native HTML plus local `--dt-*` tokens plus `d-*` classes is the default. If a token or utility from the Dialtone docs is missing, add it to the files below. Do not invent spacing, color, or type values.

Button variants follow [Dialtone buttons](https://dialtone.dialpad.com/components/button.html#variants). Prefer the documented **clear** (or other named) variant over inventing “outline → solid purple” unless Ted asks for primary. After a first cut, [dialtone-audit](.cursor/skills/dialtone-audit/SKILL.md) catches token and variant drift.

### CSS tokens

`--dt-*` custom properties live in [`src/assets/design-tokens.css`](src/assets/design-tokens.css).

```css
/* Correct */
gap: var(--dt-space-400);
font-size: var(--dt-font-size-200);

/* Never */
@import '@dialpad/dialtone/css';
```

### Utility classes

Local replacements live in [`src/assets/utilities.css`](src/assets/utilities.css):

- `d-headline-*`, `d-body-*`, `d-label-*` — typography
- `d-stack`, `d-stack--row`, `d-stack--gap-*` — layout
- `d-p24`, `d-ta-center`, `d-link` — misc
- `.skeleton`, `.skeleton--circle`, `.skeleton--text` — loading states
- `.custom-select`, `.custom-select--sm` — select menus

Prefer official Dialtone class names from [DESIGN.md](DESIGN.md) in new markup. Leave existing aliases in frozen prototypes.

### Replacing a Dialtone component

When you encounter a `Dt*` component (`DtTooltip`, `DtModal`, `DtBadge`), do not import it from `@dialpad/dialtone`.

1. Inspect the Dialtone docs for structure and visual traits.
2. Build the local equivalent with native HTML and scoped CSS. Use `--dt-*` tokens.
3. Decide where it lives:
   - Used once → inline HTML and scoped `<style>` in that component
   - Used in two or more places → a class in `src/assets/utilities.css`, documented there
   - Complex enough for its own file → `src/components/`
4. Add a row to the table below.

| Dialtone component | Local replacement |
|---|---|
| `DtIcon*` (e.g. `DtIconSearch`) | `<DtIcon name="search" :size="20" />` from `src/components/icons/` |
| `DtSelectMenu` | `<select class="custom-select">` — styles in `utilities.css` |
| `DtSkeletonText` | `<div class="skeleton skeleton--text">` — styles in `utilities.css` |
| `DtSkeletonShape` | `<div class="skeleton skeleton--circle">` — styles in `utilities.css` |
| `DtSkeletonParagraph` | Multiple `.skeleton.skeleton--text` divs |

### Chart colors

Match [Dialtone chart colors](https://dialtone.dialpad.com/foundations/colors/chart-colors/) with local `--dt-color-chart-*` variables. Draw charts with the installed `chart.js` / `vue-chartjs`. Do not import Dialtone or use D3 in a new chart.

How a chart should look and behave: [chart](.cursor/skills/chart/SKILL.md). Reference implementation: [`src/prototypes/scorecards-v3-llm-questions/components/ComboChart.vue`](src/prototypes/scorecards-v3-llm-questions/components/ComboChart.vue).

Seeded in [`src/assets/design-tokens.css`](src/assets/design-tokens.css): `--dt-color-chart-positive`, `--dt-color-chart-neutral`, `--dt-color-chart-critical`, categorical `01` through `05`, sequential `01` through `06` and `10`. Copy any other ramp from the Dialtone page under the same token name. Do not invent a color.

## Icons

Check [`src/components/icons/iconPaths.js`](src/components/icons/iconPaths.js) before fetching a new icon.

```vue
<script setup>
import DtIcon from '@/components/icons/DtIcon.vue'
</script>

<template>
  <DtIcon name="search" :size="20" />
</template>
```

### Adding an icon

Full checklist: [add-dialtone-icon](.cursor/skills/add-dialtone-icon/SKILL.md).

1. Fetch the SVG from the public CDN (no auth):

   `https://cdn.jsdelivr.net/npm/@dialpad/dialtone-icons@4.52.0/dist/svg/icons/{name}.svg`

2. Extract the `viewBox` and all `<path>` / `<circle>` elements.
3. If a parent `<g fill-rule="evenodd">` wraps the paths, add `"fillRule":"evenodd","clipRule":"evenodd"` on each extracted element. Group-level attributes are not inherited in `iconPaths.js`.
4. Skip any path or circle with `fill="#fff"` or `fill="white"`. Those are bounding-box artifacts.
5. Append the entry:

   ```js
   "icon-name": { viewBox: "0 0 12 12", elems: [
     { "d": "M...", "fillRule": "evenodd", "clipRule": "evenodd" }
   ]},
   ```

Prototype-specific one-off icons (including Lucide or Feather) can be inline SVG in that component. Still do not install Dialtone. Prefer CDN path data when the icon exists in Dialtone.

### Icon and button sizes

Navigation (left bar, top bar, sidebar): icon SVG `20px`. Button container `var(--btn-height-nav)` (left bar) or `var(--btn-height-icon)` (top bar).

Content and action icons: icon SVG `16px`. Button container `var(--btn-height-icon)` for square icon-only, `var(--btn-height-md)` for text plus icon.

Never hardcode button heights. Tokens in `src/assets/design-tokens.css`:

| Token | Value | Use for |
|---|---|---|
| `--btn-height-sm` | `28px` | compact / small buttons |
| `--btn-height-md` | `32px` | standard text buttons |
| `--btn-height-icon` | `32px` | square icon-only buttons |
| `--btn-height-nav` | `36px` | nav icon buttons (left bar) |

```css
.my-btn {
  height: var(--btn-height-md);
  padding: 0 12px;
}

.my-icon-btn {
  width: var(--btn-height-icon);
  height: var(--btn-height-icon);
  padding: 0;
}
```

## Adding prototypes

New work lives in a new folder under `src/prototypes/`. Do not modify these four original folders unless Ted explicitly allows it:

- `src/prototypes/analytics-gpt/`
- `src/prototypes/launchpad/`
- `src/prototypes/ai-chatbot/`
- `src/prototypes/scorecards/`

Register a prototype with one `{ name, label }` entry in the `prototypes` array in [`src/router.js`](src/router.js). The homepage reads that list. `name` must match the folder (`src/prototypes/<name>/index.vue`).

Workflow: [new-prototype](.cursor/skills/new-prototype/SKILL.md) for greenfield, [fork-prototype](.cursor/skills/fork-prototype/SKILL.md) when copying an existing folder.

Self-playing demos (fake cursor, scripted clicks) follow [autoplay-demo](.cursor/skills/autoplay-demo/SKILL.md). Scroll stays inside the prototype. Do not scroll the host page.

**Scorecards V1 - MVP** (`src/prototypes/scorecards-v1-mvp/`) is the Scorecards copy for iteration. Do not change the original `scorecards` folder when working on a copy.

### Scorecards builder: prefer `.builder-main`

When implementing **builder UI** from Figma (or similar) in a Scorecards copy, put the design in `.builder-main` inside that copy’s `BuilderView.vue` (page body: breadcrumbs, title, actions, question list, detail). Prefer that over rewriting chrome. Do not hardcode `scorecards-v1-mvp` — use the folder Ted named.

This does **not** constrain autoplay films, cursor scripts, timing, or other non-builder work in `index.vue`. Those follow [autoplay-demo](.cursor/skills/autoplay-demo/SKILL.md) and the prototype’s `CLAUDE.md`.

Leave chrome alone unless Ted asks:

- Global left nav (`LeftBar`)
- Admin sidebar (`.builder-admin-nav`)
- Call Review and Analytics views

Figma may show an older sidebar, left menu, or shell. Ignore those differences. The live chrome in that prototype is the source of truth.

Inside `.builder-main`, keep layout and intent. Restyle controls to current Dialtone using the live Scorecards prototype and [dialtone.dialpad.com](https://dialtone.dialpad.com/). Ask first if a control would look meaningfully older.

## Project structure

```
AGENTS.md                    # This contract (Cursor + Claude Code)
CLAUDE.md                    # Imports AGENTS.md for Claude Code
DESIGN.md                    # Dialtone lookup index
.cursor/rules/               # Short always-on Cursor rules
.cursor/skills/              # Task skills (canonical)
.claude/skills               # Symlink to .cursor/skills
src/
├── assets/
│   ├── design-tokens.css    # --dt-* custom properties
│   └── utilities.css        # d-* utilities, skeleton, custom-select
├── components/
│   ├── icons/
│   │   ├── DtIcon.vue
│   │   └── iconPaths.js
│   ├── DialpadLogo.vue
│   ├── LeftBar.vue
│   ├── TopBar.vue
│   └── SidebarNav.vue
├── prototypes/              # One folder per prototype
└── router.js                # Homepage prototype list
```

## Dependencies

Public packages only:

- `vue` `^3`
- `vite` + `@vitejs/plugin-vue`
- `vue-router`
- `chart.js` + `vue-chartjs`
- `d3` and `markdown-it`. Used only by `studio`. New charts still use `chart.js`, not D3.

Ask before adding anything else.
