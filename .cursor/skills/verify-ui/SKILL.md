---
name: verify-ui
description: >-
  Screenshots a sizzle-reel prototype with headless Chrome at one or more
  moments, so timed states (ringing, animating, settled) can be checked
  before reporting done. Use after a UI edit, when the user asks you to
  check, prove, or screenshot a prototype, or when they say they do not see
  a change. Do not keep editing the design until this pass shows the last
  change.
---

# Verify UI

The browser step from [AGENTS.md](../../../AGENTS.md) (*Prove it in the browser*). Needs the server from [dev-server](../dev-server/SKILL.md).

## When Ted does not see it

Stop design edits. Confirm branch, port `5173`, and that Vite is this repo ([dev-server](../dev-server/SKILL.md)). Restart if the route is blank or the server was stale. Then shoot and open the PNGs below before changing anything else.

## Shoot

Set `OUT` to the session scratchpad. Set `TIMES` to the milliseconds worth seeing. Pick them from the prototype's `TIMING` object: one shot before a transition, one during, one after it settles.

```bash
C="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
URL="http://127.0.0.1:5173/sizzle-reel/prototypes/<name>"
OUT="<scratchpad>/shots"; mkdir -p "$OUT"
TIMES="500 3000 12000"
for t in $TIMES; do
  "$C" --headless=new --disable-gpu --hide-scrollbars \
    --window-size=1440,900 --virtual-time-budget=$t \
    --screenshot="$OUT/<name>-$t.png" "$URL" 2>/dev/null
done
ls "$OUT"
```

Each run reloads the page, so every shot starts at time zero.

## Look

Open every PNG with the Read tool. Compare it to what Ted asked for and to the Figma, if there is one. A shot you did not open does not count as proof.

## Limits

Headless shots cover load-time and timer-driven states. A state behind a click (Answer, End call) needs a real browser. Say which states you could not shoot. Do not claim they work.
