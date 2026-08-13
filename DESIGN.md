# Dialtone — local design index

Source of truth for names and values: **[Dialtone docs](https://dialtone.dialpad.com/)** (what’s live now is enough). This repo cannot install Dialtone packages, so tokens and utilities are replicated locally. Look up the docs, then use or add the local equivalent.

## How to look something up

When styling UI, fetch the relevant Dialtone page. Do not guess class or token names.

| Need | Docs |
|---|---|
| Overview | https://dialtone.dialpad.com/ |
| Getting started / utility-first | https://dialtone.dialpad.com/guides/getting-started/ |
| Design tokens (search) | https://dialtone.dialpad.com/tokens/ |
| Space vs size | https://dialtone.dialpad.com/design/space/ |
| Color | https://dialtone.dialpad.com/design/colors/ |
| CSS utilities | https://dialtone.dialpad.com/utilities/ |
| Padding | https://dialtone.dialpad.com/utilities/spacing/padding.html |
| Typography styles | https://dialtone.dialpad.com/utilities/typography/styles.html |
| Font color | https://dialtone.dialpad.com/utilities/typography/font-color.html |
| Font weight | https://dialtone.dialpad.com/utilities/typography/font-weight.html |
| Background color | https://dialtone.dialpad.com/utilities/backgrounds/color.html |
| Border radius | https://dialtone.dialpad.com/utilities/borders/radius.html |

Components (buttons, badges, inputs, etc.): browse CSS or Vue on the Dialtone site, then rebuild with native HTML + local tokens/utilities. Do not import Dialtone Vue/CSS packages.

## Local files

| File | Role |
|---|---|
| [`src/assets/design-tokens.css`](src/assets/design-tokens.css) | `--dt-*` custom properties (Dialpad light theme) |
| [`src/assets/utilities.css`](src/assets/utilities.css) | Local `d-*` utility classes |

If a token or class from the docs is not in those files, **add it** using the Dialtone name and the documented `--dt-*` value. Then use it.

## Tokens (already local)

Spacing — use `--dt-space-*` for padding, gap, and margin (not `--dt-size-*`):

| Token | px |
|---|---|
| `--dt-space-200` | 2px |
| `--dt-space-300` | 4px |
| `--dt-space-400` | 8px |
| `--dt-space-450` | 12px |
| `--dt-space-500` | 16px |
| `--dt-space-550` | 24px |
| `--dt-space-600` | 32px |

In-box gaps: `--dt-space-0` through `--dt-space-550`. Between page sections: `--dt-space-600` and up.

Color — `--dt-color-surface-*`, `--dt-color-foreground-*`, `--dt-color-border-*`, `--dt-color-link-*`.

Type — `--dt-typography-headline-*`, `--dt-typography-body-*`, `--dt-typography-label-*`, or `--dt-font-size-*`.

## Utility naming (Dialtone)

Prefer official Dialtone class names in **new** markup:

| Kind | Pattern | Examples |
|---|---|---|
| Padding | `d-p{n}`, `d-p{t\|r\|b\|l\|x\|y}{n}` | `d-p8`, `d-px12`, `d-py4` |
| Background | `d-bgc-{color}` | `d-bgc-primary`, `d-bgc-critical-strong` |
| Font color | `d-fc-{color}` | `d-fc-primary`, `d-fc-secondary` |
| Type style | `d-headline--*`, `d-body--*`, `d-label--*` | `d-body--md`, `d-label--sm` |
| Radius | `d-bar{n}` | `d-bar4`, `d-bar8` |
| Font weight | `d-fw-{n}` | `d-fw-medium`, `d-fw-semibold` |

Existing local aliases (`d-headline-large`, `d-body-base`, `d-stack`, …) may stay. Do not rename them in frozen prototypes. New work should use official Dialtone names and add the class to `utilities.css` if it is missing.

## Custom CSS

When utilities are not enough, write scoped BEM and bind values to tokens:

```css
.card {
  padding: var(--dt-space-500);
  background-color: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-default);
  border-radius: var(--dt-space-300);
}
```

Avoid `margin`; use gap on a flex/stack parent and padding on the element.

## Scorecards Figma scope

For Scorecards designs, implement **only** `.builder-main` (in `src/prototypes/scorecards-v1-mvp/components/BuilderView.vue`). Leave `LeftBar`, `.builder-admin-nav`, and other chrome as they are — Figma may show outdated artwork for those. Ask only if a chrome difference looks major.
