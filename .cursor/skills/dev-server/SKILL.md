---
name: dev-server
description: >-
  Starts or reuses the sizzle-reel Vite dev server at
  http://127.0.0.1:5173/sizzle-reel/. Use when the user asks to start,
  restart, or reuse the server, wants to see a prototype in the browser, or a
  new route renders blank.
---

# Dev server

One URL every time: `http://127.0.0.1:5173/sizzle-reel/`. `npm run dev` pins host, port, and `--strictPort`. Do not start Vite on another port.

## Reuse first

```bash
lsof -nP -iTCP:5173 -sTCP:LISTEN
for p in $(lsof -tiTCP:5173 -sTCP:LISTEN); do lsof -a -p $p -d cwd -Fn | tail -1; done
```

- Something listens and its cwd is this repo: reuse it. Confirm with `curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:5173/sizzle-reel/`.
- Something listens from another folder (a worktree, another repo): tell Ted which folder. Ask before you stop it.
- Two PIDs listen (one on `127.0.0.1`, one on `[::1]`): two servers are running. Tell Ted, then keep the `127.0.0.1` one and stop the other.
- Nothing listens: start it.

## Start

Run `npm run dev` in the background from the repo root. Wait for `200` from the curl above.

## Restart

Ted asks for a restart, or a route added after the server started renders blank:

```bash
kill $(lsof -tiTCP:5173 -sTCP:LISTEN)
```

Then start again. Before you change the design over a blank page, check `git branch --show-current`.

## Report

Give the full prototype URL, for example `http://127.0.0.1:5173/sizzle-reel/prototypes/<name>`.
