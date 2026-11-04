---
name: add-dialtone-icon
description: >-
  Adds a Dialtone icon to iconPaths.js from the public jsDelivr CDN, or inlines
  a one-off Lucide/Feather SVG. Use when the user names an icon, pastes a
  Dialtone icon URL, or says not to use Dialtone directly. Do not install
  Dialtone packages.
---

# Add a Dialtone icon

Canonical steps: [AGENTS.md](../../../AGENTS.md) (*Icons*).

## Check first

Look up the name in [`src/components/icons/iconPaths.js`](../../../src/components/icons/iconPaths.js). If it is already there, use `<DtIcon name="…" :size="…" />`. Do not fetch it again.

## Find the name

The name Ted says may not be the file name. Brand icons usually end in `-logo` (Salesforce is `salesforce-logo`). Search the package listing once instead of guessing URLs:

```bash
curl -s "https://data.jsdelivr.com/v1/packages/npm/@dialpad/dialtone-icons@4.52.0?structure=flat" \
  | grep -oiE '"name": *"/dist/svg/icons/[^"]*salesforce[^"]*"'
```

## Dialtone icons

1. Fetch (no auth):

   `https://cdn.jsdelivr.net/npm/@dialpad/dialtone-icons@4.52.0/dist/svg/icons/{name}.svg`

2. Keep the `viewBox` and every `<path>` / `<circle>` that is part of the shape.
3. If a parent `<g fill-rule="evenodd">` wraps the paths, set `"fillRule":"evenodd"` and `"clipRule":"evenodd"` on each extracted element. `iconPaths.js` does not inherit attributes from `<g>`.
4. Drop any path or circle with `fill="#fff"` or `fill="white"`. Those are bounding-box artifacts.
5. Append:

   ```js
   "icon-name": { viewBox: "0 0 12 12", elems: [
     { "d": "M...", "fillRule": "evenodd", "clipRule": "evenodd" }
   ]},
   ```

6. Render with `DtIcon`. Navigation icons are 20px. Content and action icons are 16px.

Do not add `@dialpad/dialtone-icons` or any other Dialtone package.

## Lucide, Feather, and other one-offs

Inline the SVG in the component that uses it. Do not add a shared icon package. If Dialtone has the same icon, prefer the CDN path data in `iconPaths.js` instead.
