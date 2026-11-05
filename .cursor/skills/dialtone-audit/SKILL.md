---
name: dialtone-audit
description: >-
  Read-only Dialtone token and variant pass on recent prototype UI. Use after
  a first visual cut, when the user asks for a Dialtone check or token pass,
  or before calling a screen done. Do not install Dialtone packages. Fix only
  if Ted asks after the report.
---

# Dialtone audit

Canonical rules: [AGENTS.md](../../../AGENTS.md) (*Dialtone, locally*). Docs: [dialtone.dialpad.com](https://dialtone.dialpad.com/). Lookup: [DESIGN.md](../../../DESIGN.md).

Stay read-only until Ted asks you to fix. Report findings in chat.

## Scope

Audit the files this task changed, or the prototype folder Ted named. If the diff is empty, say so and stop.

## Checklist

1. **No Dialtone packages.** No `@dialpad/dialtone`, `@dialpad/dialtone-css`, `@dialpad/dialtone-icons`, `@dialpad/dialtone-tokens`, or other `npm.pkg.github.com` imports.
2. **Tokens over raw values.** Flag hex, `oklch()`, or magic `px` for color, space, type, radius, or shadow where a `--dt-*` token or `d-*` class already exists in [`design-tokens.css`](../../../src/assets/design-tokens.css) or [`utilities.css`](../../../src/assets/utilities.css). Chart series colors must use `--dt-color-chart-*` (see [chart](../chart/SKILL.md)).
3. **Type and space.** Headings and body use `d-headline-*`, `d-body-*`, `d-label-*`, or matching `--dt-font-*` / `--dt-space-*` tokens. Prefer padding and gap over margin.
4. **Buttons.** Heights use `--btn-height-*`. Variants match [Dialtone buttons](https://dialtone.dialpad.com/components/button.html#variants). Prefer **clear** over inventing a solid purple stand-in for an outline control unless Ted asked for primary.
5. **Icons.** Shared icons go through `<DtIcon>` from `src/components/icons/`. Nav icons 20px; content and action icons 16px. Missing Dialtone icons: [add-dialtone-icon](../add-dialtone-icon/SKILL.md).
6. **Old Figma chrome.** Do not reintroduce pre-Dialtone borders, button colors, or heavier inputs. Layout and intent stay; visuals match current Dialtone and the live prototype shell.

## Report

1. One short verdict (pass, a few nits, or needs work).
2. Findings as a numbered list: where, what, suggested token or class when obvious.
3. Ask whether to fix. Do not edit until Ted says yes.
