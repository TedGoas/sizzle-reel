# Studio Demo

Native rebuild of Agentic Studio with local Dialtone (`sd-*` classes in `sections.css`, `--dt-*` tokens). Navigation is a `scene` ref in `index.vue`, not Vue Router. **Do not edit `src/prototypes/studio`.** It's the old port and serves only as a reference.

## Scenes (`index.vue`)

`list` (AgentListScreen) → `agent` (AgentDetailScreen, `section` = overview | testing | analytics | history) → `editor` (AgentCreationScreen with `start-on-canvas`). `creation` is the new-agent flow.

## Overview: skill mining

Lives in `components/overview/OverviewSection.vue`, below the dashboard grid under "Improve and expand".

States (`mining` ref): `idle` → `running` → `done`
- **idle:** illustration card. "Start skill mining" opens the setup drawer. "Learn more" is inert.
- **setup drawer** (`MiningSetupDrawer.vue`): call sources (checkboxes, first two on), call purposes (chips, max 5), date range (radios), email toggle. Presentation only. "Mine for skills" is disabled with no source.
- **running:** the star in the illustration bounces, with a spinner and "Reading 1,542 conversations". Cancel returns to idle.
- **done:** results card. `GapDonut.vue` (chart.js doughnut, glass tooltip, click a slice to open it) plus a list of gap rows. "Mine again" reopens setup.
- **gap drawer** (`MiningGapDrawer.vue`): stats, three customer quotes, numbered steps. "Create skill" only closes the drawer for now.

`drawer` ref: `null | 'setup' | 'gap'`. Mining drawers **overlay** the page at `DRAWER_WIDTH` (480). They don't push content, because pushing crushed the 12-column grid. State resets when you leave Overview (the component unmounts).

## Timing and data

- `mock/miningData.js` is the single source: `TIMING.miningRun` (4000ms), `DRAWER_WIDTH`, form options, `miningSummary`, `miningGaps`, `gapShare()`, `uncoveredShare`.
- Gap topics fit the home-goods store in `mock/historyData.js` and don't overlap `skillUsage` in `mock/overviewData.js`.
- `miningSummary.analyzed` (1542) matches `totalConversations.total`, and the gap `calls` sum to `uncovered` (278).
- Gap colors are `--dt-color-chart-categorical-01…05`. The handled remainder is `--dt-color-chart-neutral`.

## Shared drawer shell

`components/SideDrawer.vue`: fixed right panel, full height, resizable from the left edge, with an × close.
- Slots: `meta` (under the title), `nav` (tabs), default (scrolling body), `footer`.
- Props: `title`, `titleId`, `defaultWidth` (empty means `preferredDrawerWidth()` from historyData).
- `history/ConversationDrawer.vue` uses it with the tabs in `nav`. `HistorySection` pushes content by the emitted `resize` width. Overview doesn't.

## Drawer motion

- `components/DrawerTransition.vue` wraps every docked drawer: History, Testing scenario, and both mining drawers. Put `v-if` on the drawer **inside** the wrapper, not on the drawer's own root, or the exit won't play.
- Enter: 280ms `cubic-bezier(0.32, 0.72, 0, 1)`. Exit: 200ms `cubic-bezier(0.4, 0, 1, 1)`. Both are `transform` only. Tune them with `--side-drawer-enter` and `--side-drawer-leave`.
  - No overshoot: these drawers sit flush to the right edge, so a bounce would flash a gap.
  - Reduced motion gets a 150ms fade.
- Switching records while a drawer is open (another History row, another gap) swaps the content in place and scrolls to the top (`contentKey`). It doesn't slide again.
- History's `margin-right` push animates with the enter curve and turns off while you drag to resize (`resizing` emit).
- `composables/useDrawerDismiss.js`: focuses the panel on open (`preventScroll`) and closes on Escape. SideDrawer and ScenarioDrawer use it.
- The Agent Editor's floating drawers (`SkillDrawer`, `CreateSkillDrawer`) have their own slide-in with an overshoot curve and no exit animation.

## Gotchas

- `design-tokens.css` resets `list-style: none` globally. Set `list-style: decimal` on any `ol` that should show numbers. (History's "Action items" list has no numbers because of this.)
- Scoped styles on slotted content belong to the parent that passes it, so put the `.dot` and tab styles in the parent drawer, not in SideDrawer.
- Headless Chrome can't reach click states with plain `--screenshot`. Drive it over CDP (a remote-debugging port plus Node's built-in WebSocket) to click through flows.
