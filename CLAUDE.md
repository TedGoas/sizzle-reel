# sizzle-reel — Claude Code Guide

## Project Overview

Vue 3 + Vite prototype showcase. Published publicly at `/sizzle-reel/` base path. All dependencies must be publicly installable — no private registry access, no auth tokens.

## Critical Rule: No Auth-Gated Dependencies

`npm install` must work without `NODE_AUTH_TOKEN` or any private GitHub Packages token.

**Never add:**
- `@dialpad/dialtone` (GitHub Packages — private)
- `@dialpad/dialtone-icons` (GitHub Packages — private)
- `@dialpad/dialtone-tokens` (GitHub Packages — private)
- Any package from `npm.pkg.github.com`

All Dialtone design assets have been replicated locally. Use those instead.

## Local Replacements for Dialtone

### CSS Tokens
Use `--dt-*` custom properties defined in `src/assets/design-tokens.css`. Dialtone naming is preserved for familiarity — they're just sourced locally.

```css
/* ✅ Correct — use local --dt-* tokens */
gap: var(--dt-space-400);
font-size: var(--dt-font-size-200);

/* ❌ Never do this */
@import '@dialpad/dialtone/css';
```

### Utility Classes
Local replacements for common Dialtone utilities live in `src/assets/utilities.css`:
- `d-headline-*`, `d-body-*`, `d-label-*` — typography
- `d-stack`, `d-stack--row`, `d-stack--gap-*` — layout
- `d-p24`, `d-ta-center`, `d-link` — misc
- `.skeleton`, `.skeleton--circle`, `.skeleton--text` — loading states
- `.custom-select`, `.custom-select--sm` — select menus

### Replacing Any Dialtone Component

When you encounter any `Dt*` component (e.g. `DtTooltip`, `DtModal`, `DtBadge`), **do not import it from `@dialpad/dialtone`**. Instead:

1. **Inspect the original** — open the Dialtone docs or source to understand what the component renders (HTML structure, key visual traits, props).
2. **Build the local equivalent** using native HTML + scoped CSS that matches the visual output. Reuse `--dt-*` tokens for colors, spacing, and typography.
3. **Decide where it lives:**
   - Used only once → inline HTML + scoped `<style>` in that component
   - Used in 2+ places → add a CSS class to `src/assets/utilities.css` and document it there
   - Complex enough to warrant its own file → create a new shared component in `src/components/`
4. **Document it** — add a row to the "Already replaced" table below so future sessions don't repeat the work.

The goal is always: same visual output, zero dependency on the private Dialtone package.

### Already Replaced

| Dialtone Component | Local Replacement |
|---|---|
| `DtIcon*` (e.g. `DtIconSearch`) | `<DtIcon name="search" :size="20" />` from `src/components/icons/` |
| `DtSelectMenu` | `<select class="custom-select">` — styles in `utilities.css` |
| `DtSkeletonText` | `<div class="skeleton skeleton--text">` — styles in `utilities.css` |
| `DtSkeletonShape` | `<div class="skeleton skeleton--circle">` — styles in `utilities.css` |
| `DtSkeletonParagraph` | Multiple `.skeleton.skeleton--text` divs |

## Icons

### Using Icons
Import and use `DtIcon.vue` from `src/components/icons/`:

```vue
<script setup>
import DtIcon from '@/components/icons/DtIcon.vue'
</script>

<template>
  <DtIcon name="search" :size="20" />
</template>
```

All 51 icons are pre-loaded in `src/components/icons/iconPaths.js`. Check there before fetching a new one.

### Adding a New Icon
When an icon isn't in `iconPaths.js`:

1. Fetch the SVG from the public Dialtone CDN (no auth needed):
   ```
   https://cdn.jsdelivr.net/npm/@dialpad/dialtone-icons@4.52.0/dist/svg/icons/{name}.svg
   ```

2. Extract the `viewBox` and all `<path>`/`<circle>` elements.

3. **Critical — check for group-level fill-rule:** If the SVG has `<g fill-rule="evenodd">` wrapping the paths, each extracted path element needs `"fillRule":"evenodd","clipRule":"evenodd"` added. The generator only captures per-element attributes, not inherited ones from `<g>`.

4. Skip any path/circle with `fill="#fff"` or `fill="white"` — these are bounding box artifacts, not part of the icon shape.

5. Add the entry to `iconPaths.js`:
   ```js
   "icon-name": { viewBox: "0 0 12 12", elems: [
     { "d": "M...", "fillRule": "evenodd", "clipRule": "evenodd" }
   ]},
   ```

### When to Use Inline SVG Instead
For prototype-specific one-off icons (not shared across components), inline SVG directly in the component is fine. Use the Dialtone CDN path data for visual consistency.

## Sizing Standards

### Navigation Icons (left bar, top bar, sidebar)
- Icon SVG: `20px`
- Button container: `var(--btn-height-nav)` (left bar) / `var(--btn-height-icon)` (top bar)

### Content/Action Icons
- Icon SVG: `16px`
- Button container: `var(--btn-height-icon)` for square icon-only, `var(--btn-height-md)` for text+icon

### Button Height Tokens
Never hardcode button heights. Use these tokens from `src/assets/design-tokens.css`:

| Token | Value | Use for |
|---|---|---|
| `--btn-height-sm` | `28px` | compact / small buttons |
| `--btn-height-md` | `32px` | standard text buttons |
| `--btn-height-icon` | `32px` | square icon-only buttons |
| `--btn-height-nav` | `36px` | nav icon buttons (left bar) |

```css
/* ✅ Token-based — single source of truth */
.my-btn {
  height: var(--btn-height-md);
  padding: 0 12px;
}

.my-icon-btn {
  width: var(--btn-height-icon);
  height: var(--btn-height-icon);
  padding: 0;
}

/* ❌ Hardcoded — change requires finding all instances */
.my-btn {
  height: 32px;
  padding: 0 12px;
}

/* ❌ Padding-based — drifts with font-size changes */
.my-btn {
  padding: 8px 12px;
}
```

## Project Structure

```
src/
├── assets/
│   ├── design-tokens.css   # All --dt-* custom properties (replaces @dialpad/dialtone)
│   └── utilities.css       # Dialtone utility class replacements + skeleton + custom-select
├── components/
│   ├── icons/
│   │   ├── DtIcon.vue      # Icon wrapper — accepts name + size props
│   │   └── iconPaths.js    # 51 icon SVG path data extracted from Dialtone CDN
│   ├── DialpadLogo.vue     # Dialpad logo SVG (gradient, multi-path)
│   ├── LeftBar.vue         # Global left navigation
│   ├── TopBar.vue          # Global top bar
│   └── SidebarNav.vue      # Secondary sidebar navigation
├── prototypes/             # Individual prototype components
└── main.js                 # Imports design-tokens.css and utilities.css
```

## Dependencies

Intentionally minimal — all public packages:
- `vue` `^3`
- `vite` + `@vitejs/plugin-vue`
- `vue-router`
- `chart.js` + `vue-chartjs`
