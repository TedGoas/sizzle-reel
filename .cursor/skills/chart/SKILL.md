---
name: chart
description: >-
  Build or restyle a prototype chart so it matches the other sizzle-reel
  charts. Use for line, bar, combo, or donut charts. Uses local
  --dt-color-chart-* tokens and the installed chart.js. Do not add D3 or a
  Dialtone package.
---

# Chart

Draw charts with the installed `chart.js` and `vue-chartjs`. Do not add D3 or any Dialtone package.

Visual reference: [`src/prototypes/scorecards-v3-llm-questions/components/ComboChart.vue`](../../../src/prototypes/scorecards-v3-llm-questions/components/ComboChart.vue).

## Look

- The line sits above the bars (`order` on the datasets).
- Points are hidden. A point appears only on the hovered index.
- The tooltip is a frosted card: `background: var(--dt-color-surface-glass)`, a subtle border, and one row per series with a color chip, a label, and the value.
- First load animates in place. A later tab or filter morphs from the current shape. Do not replay a blank-then-draw entrance.
- A part-of-whole series (contained, transferred) is fainter than the total, about 60 to 70 percent opacity.
- Gridlines, axis labels, and captions use foreground and border tokens, not chart colors.

## Color

Read colors with the computed token, the way `ComboChart` uses `dtColor('--dt-color-chart-…')`. Never put a hex or `oklch()` in the component.

Tokens live in [`src/assets/design-tokens.css`](../../../src/assets/design-tokens.css). They were copied from the light theme on [Dialtone chart colors](https://dialtone.dialpad.com/foundations/colors/chart-colors/).

| Job | Tokens |
| --- | --- |
| One series against a neutral field | `--dt-color-chart-positive`, `--dt-color-chart-neutral` |
| Unrelated categories, in order | `--dt-color-chart-categorical-01` through `05` |
| Steps of one series | `--dt-color-chart-sequential-01` through `06`, and `10` |

Use categorical or sequential colors for a neutral split (contained vs transferred). Use `--dt-color-chart-positive` or `--dt-color-chart-critical` only when the number is actually good or bad. The same series keeps the same token on every sibling chart. Prefer six or fewer colors. Labels or line weight carry the meaning too. Color is not the only cue.

If a chart needs a token that is not in the file, copy that token's light-theme value from the Dialtone chart-colors page into `design-tokens.css` under the same `--dt-color-chart-*` name. Do not invent a value.

## Data

The headline number and the chart share a denominator. Do not put two unrelated measures on one axis. A dual axis is only for a combo that is already one story, such as a count behind a rate, matching `ComboChart`.
