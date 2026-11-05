---
name: autoplay-demo
description: >-
  Builds a self-playing prototype with a fake cursor and scripted clicks.
  Use when the user asks for an autoplay demo, a sizzle reel, or a fake cursor
  clicking through a flow. Follow the scorecards-v3 pattern. Never scroll the
  host page.
---

# Autoplay demo

Reference implementation: [`src/prototypes/scorecards-v3-llm-questions/index.vue`](../../../src/prototypes/scorecards-v3-llm-questions/index.vue).

## Cursor

- Render one cursor element inside the prototype root (`class="autoplay-cursor"`), `position: absolute`, `pointer-events: none`, `aria-hidden="true"`.
- Move it by setting `transform: translate(x, y)` from the target’s `getBoundingClientRect()` minus the prototype root’s rect. **Never** use `window.scrollTo` or `Element.scrollIntoView` — those scroll the host case-study page when the prototype is embedded.
- Aim the cursor at the actual control (the radio dot, the button label), not a nearby row or column.
- A clicking state scales the cursor SVG slightly (`autoplay-cursor--clicking`). A pressed target gets a short class such as `autoplay-pressed`.
- Hide the cursor with a class when it should be off screen. Do not remove it from the DOM mid-run.

## Targets

Mark each control the script acts on with `data-autoplay="<id>"`. The script queries those hooks from the prototype root, then:

1. Move the cursor to the element.
2. Wait for the move transition.
3. Add the clicking / pressed classes.
4. Run the same action a click would (open the view, type into the field, advance the step).
5. Remove the pressed class and continue.

## Scroll

If a target is outside the visible area, scroll only an ancestor **inside** the prototype root whose `overflow-y` is `auto` or `scroll`. The scorecards-v3 helper is `scrollElementIntoView`. Never scroll the host case-study page.

## Timing

Keep the script in the prototype’s root component. Start it on mount. Clear timers on unmount. Put every delay and duration in the prototype’s `TIMING` object (usually in `data.js`). Tune pauses only through `TIMING`. One timing change per polish turn, then stop for review. Use short waits between beats so the cursor reads as a person, not a jump cut. When Ted asks for a slow handoff between places, fade the outgoing view into the next one instead of a hard cut.
