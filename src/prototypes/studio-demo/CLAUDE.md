# Studio Demo

Native rebuild of Agentic Studio with local Dialtone (`sd-*` classes in `sections.css`, `--dt-*` tokens). Navigation is a `scene` ref in `index.vue`, not Vue Router. **Do not edit `src/prototypes/studio`.** It's the old port and serves only as a reference.

## Scenes (`index.vue`)

`list` (AgentListScreen) → `agent` (AgentDetailScreen, `section` = overview | testing | analytics | history) → `editor` (AgentCreationScreen with `start-on-canvas`). `creation` is the new-agent flow.

### Start screen (creation)

- The prompt is a real `<textarea>`: `typedText` overrides the chip sentence, and picking a chip clears it. Hovering a chip shows its sentence as the placeholder.
- Presentation only: Enter or Send with typed text and no chip builds the **AI Receptionist** (`selectedChip = 0`). A picked chip still builds that chip's agent. The chat's user bubble shows whatever is in the field.

## Overview: skill mining

Lives in `components/overview/OverviewSection.vue`, below the dashboard grid under "Improve and expand".

States (`mining` ref): `idle` → `running` → `done`
- **idle:** illustration card. "Start skill mining" opens the setup drawer. "Learn more" is inert.
- **setup drawer** (`MiningSetupDrawer.vue`): call sources (checkboxes, first two on), call purposes (chips, max 5), date range (radios), email toggle. Presentation only. "Mine for skills" is disabled with no source.
- **running:** the star in the illustration bounces, with a spinner and "Reading 1,542 conversations". Cancel returns to idle.
- **done:** results card. `GapDonut.vue` is a 240px chart.js doughnut. The center is the uncovered share. A frosted tooltip shows the slice count and its share of all calls. The handled remainder is fainter and not clickable. Hovering a slice or a row highlights both, and the open gap stays pulled out. Click a slice or row to open it. "Mine again" reopens setup.
- **gap drawer** (`MiningGapDrawer.vue`): stats, three customer quotes, numbered steps. "Create skill" only closes the drawer for now.

`drawer` ref: `null | 'setup' | 'gap'`. Mining drawers **overlay** the page at `DRAWER_WIDTH` (480). They don't push content, because pushing crushed the 12-column grid. State resets when you leave Overview (the component unmounts).

## Timing and data

- `mock/miningData.js` is the single source: `TIMING.miningRun` (4000ms), `DRAWER_WIDTH`, form options, `miningSummary`, `miningGaps`, `gapShare()`, `uncoveredShare`.
- Gap topics fit the home-goods store in `mock/historyData.js` and don't overlap `skillUsage` in `mock/overviewData.js`.
- `miningSummary.analyzed` (1542) matches `totalConversations.total`, and the gap `calls` sum to `uncovered` (278).
- Gap colors are `--dt-color-chart-categorical-01…05`. The handled remainder is `--dt-color-chart-neutral`.

## History drawer

`history/ConversationDrawer.vue` opens from a conversation row. Tabs: Recap, Flow run, Traces, Logs, Transcript, Metadata.

- Recap, Traces, Logs, Transcript, and Metadata each have a Copy button in the upper right. It is a plain button with a gray hover, the same height as the search field. It is visual only: the label becomes Copied and the icon becomes a check for `TIMING.copyReset`, then it returns to Copy. Nothing is written to the clipboard. Flow run has no Copy button. On Traces and Logs the search field is half the row, with Copy at the right.
- Recap adds a "What happened" list from `moments`.
- Traces keeps the recording timeline. Transport is three icon buttons: back 10 seconds, play/pause, and forward 10 seconds. A five-bar waveform sits beside the Recording title only while playback is running. Hover or focus on a timeline dot shows a dark tooltip with the same type and summary as the table. Each call has a full event list (about 18 to 24 rows) spread across the recording. The event list is a time, type, and summary table. Search and sort carets do nothing. Clicking a row still seeks the playhead.
- Logs is a tool-call table from `logs`, at least five rows. The search field does nothing.
- Transcript lines have a time. Each call is at least eight customer lines and eight agent lines, plus a few System tool lines. System lines are tool results.
- Metadata keeps the id fields in one list. The Session group sits under that list, full width: audio, participants, tools, and transfer when there is one. The section uses class `details`, not `meta`, so it does not pick up the header meta row style.
- All of that copy lives on each record in `mock/historyData.js`.

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

## Agent Editor: AI Agent drawer

- Click the **AI Agent** node on the canvas (`AgentCanvas` emits `open-agent`) and `AgentDrawer.vue` opens. It uses the same floating shell and styles as `SkillDrawer`. `AgentCreationScreen` keeps one drawer open at a time: `agentDrawerOpen` and `openSkillName` clear each other. While the drawer is open, the agent node shows the `is-selected` outline.
- Fields follow Studio's `AgentPanel`: company name, company description, agent name (the canvas `agentName`), tasks editor, tone and voice select with a play button, greeting, knowledge base select, transfer instructions editor, and fallback radios. Presentation only: Cancel and Save just close the drawer.
- Play button: the icon flips to `pause` for `TIMING.voicePreview` (2000ms), then back. There's no audio. Dialtone has no `stop` icon.
- Data: `mock/agentData.js` holds `company` (**Hearth & Home**, the home-goods store; reuse it anywhere that needs a company), `voiceOptions` (flag + name + tone; US, UK, Spain), `knowledgeOptions` (document sources), `agentSettings`, `fallbackOptions`, `TIMING`.

## Agent Editor: publish flow

- On both canvases (Edit agent, and Create once `phase === 'canvas'`), the toolbar Publish is a purple primary button that toggles `PublishPopover.vue`. Save is covered in the next section.
- Popover buttons use the shared `sd-btn sd-btn--outlined` and `sd-btn--primary` from `sections.css`, so they match the rest of the prototype.
- Popover: the agent name, "Saved 2 min ago · by Nora Kim", "Never published" (or "Published just now · v1.2" after publishing), "Version history", "Share link", and "Publish v1.2". Only "Publish v1.2" does anything. Outside click and Escape close the popover, except while it's working.
- Working: a spinner and "Publishing…" sit over the label for `TIMING.publishWorking` (1500ms). This uses the shared `.sd-busy` pattern in `sections.css`: the label stays in the layout with `visibility: hidden`, so the button never changes size.
- Then the popover closes, `published` flips the Draft badge to a green "Published", and `SuccessToast.vue` shows "<agent> v1.2 is live." fixed at the top center (`top: 44px`, teleported to body). The toast copies Dialtone's `.d-toast--success`: `--dt-color-surface-success` background, `--dt-color-foreground-success` check, an inset `border-subtle` ring, and `--dt-shadow-medium`. It goes away after `TIMING.successToast` (3000ms) or on ×.
- All of this is in-memory only and resets on refresh or when you leave the editor. Data is `publishInfo` and `TIMING` in `mock/agentData.js`.

## Agent Editor: Save opens Overview

- Toolbar Save (`.save-btn`, enabled once `phase === 'canvas'`) shows a dark `.sd-busy` spinner for `TIMING.saveWorking` (800ms). Then it emits `saved` with `{ name, published }`.
- `index.vue` `onSaved()`:
  - **Create** flow: builds the agent from `receptionistAgent` in `agents.js` (id 5, the name from the canvas, status `Draft`, or `Published` if you published first). It goes at the top of `agentList` and opens its Overview.
  - **Edit** flow: goes back to that agent's Overview and flips its status to Published if you published.
- Either way, `index.vue` shows the shared `SuccessToast` saying "<agent> is saved." `AgentListScreen` takes an `agents` prop (`agentList`), so a saved agent stays in the list until refresh.
- `AgentDetailScreen` shows a gray `.badge--draft` for Draft and green for everything else. Overview data is the same mock for every agent.
- The toast `<Transition name="toast">` CSS lives in `sections.css` (shared by the editor and `index.vue`).

## Agent Editor: skill Update

- In any `SkillDrawer` (including Reschedule Appointments), Update shows a spinner for `TIMING.skillUpdateWorking` (1000ms) using the same `.sd-busy` pattern. The button is too narrow for "Updating…", so the text is screen-reader only (`.sd-busy__sr`).
- Then the drawer emits `updated`, `AgentCreationScreen` closes it, and `showToast()` shows "<skill> is updated." in the same `SuccessToast`. Nothing is saved, so slash-command edits disappear when the drawer closes.
- `showToast(message)` is the single entry point for editor toasts. It re-mounts the toast so the timer restarts.
- Copilot guardrails ("Add guardrails…" in the Assistant, on Reschedule Appointments): while `generating` is on, the Guardrails editor gets `.is-thinking`, the same pink and purple gradient sweep as `CreateSkillDrawer`'s summary and the canvas skill nodes. The sweep runs from the start of the copilot's thinking until the last guardrail line is written. The old spinner bar is gone.

## Gotchas

- `design-tokens.css` resets `list-style: none` globally. Set `list-style: decimal` on any `ol` that should show numbers. (History's "Action items" list has no numbers because of this.)
- Scoped styles on slotted content belong to the parent that passes it, so put the `.dot` and tab styles in the parent drawer, not in SideDrawer.
- Headless Chrome can't reach click states with plain `--screenshot`. Drive it over CDP (a remote-debugging port plus Node's built-in WebSocket) to click through flows.
