# Sizzle Reel

Vue 3 + Vite prototype showcase for Dialpad product films. Published at `/sizzle-reel/`.

## Run locally

```bash
npm install
npm run dev
```

Then open [http://localhost:5173/sizzle-reel/](http://localhost:5173/sizzle-reel/). Leave that terminal tab open; Vite will keep serving until you stop it with Ctrl+C.

Other scripts:

```bash
npm run build    # production build
npm run preview  # serve the production build
```

## Prototypes

Each entry on the homepage is a folder under `src/prototypes/`. Register a new one with `{ name, label }` in `src/router.js`. The `name` must match the folder name.

UI uses Dialtone tokens (`--dt-*`) and `d-*` utility classes from `src/assets/`. Do not add `@dialpad/dialtone*` packages.
