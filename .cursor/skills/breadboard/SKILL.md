---
name: breadboard
description: >-
  Map a prototype flow into places, UI affordances, and the state the
  prototype remembers. Use after a shape is chosen, when tracing an existing
  prototype flow, or when the user runs /breadboard. Reply in chat.
---

# Breadboard

Reply in the chat. Save a markdown note only if Ted asks.

Tables are the artifact. A diagram is optional and follows the tables.

## Place

A Place is what the person experiences as the current context. Use the blocking test: if they cannot interact with what is behind it, it is a new Place. A modal, a full-screen overlay, or a confirmation is its own Place. A dropdown or a non-blocking side panel is not.

| # | Place | Description |
| --- | --- | --- |
| P1 | Agent list | Starting screen |

Navigation wires point at a Place (`-> P2`), not at a control inside it.

## UI affordances

Name the real control. Skip wrapper divs.

| # | Place | Control | Affordance | Action | Wires out | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| U1 | P1 | Create button | opens the canvas | click | -> P2 | |
| U2 | P2 | Name field | edits the title | type | | visual-only |

`visual-only` means presentation only: the control can be focused or toggled, and nothing else has to happen.

Every visible result names the control that causes it. A display that shows data names the state row that feeds it.

## State

Only what this prototype actually remembers. No service layer, API, or database unless the wiring is real.

| # | Read by | Name | Holds |
| --- | --- | --- | --- |
| S1 | P2 | draftTitle | Text in the name field |

Keep a store on the Place that reads it. Share it only when two Places read it.

## After it is built

If this chat already breadboarded the flow, compare the built UI to the tables and say where it drifted. Do not start a separate reflection skill.
