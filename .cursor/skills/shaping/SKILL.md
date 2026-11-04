---
name: shaping
description: >-
  Shape an ambiguous prototype screen or flow before writing Vue. Use when
  there is more than one real approach, the ask is exploratory, or the user
  runs /shaping. Skip for a one-control polish pass.
---

# Shaping

Work in the chat. Do not create a shaping file unless Ted asks to save one next to the prototype.

Skip this skill when the change is one visual variable on a screen that already exists. That stays one change, then stop.

If the input is a transcript, notes, or a critique, start with a few sentences: source, the problem, and the outcome. Then shape.

## Entry

- **Discovery.** The ask is vague. Ask questions and look at the existing prototype. Name it when the problem changes. Move on when a frame can be stated and Ted starts choosing.
- **Requirements first.** The problem is known and the solution is not. Write requirements, then shapes.
- **Shapes first.** A solution was proposed. Pull the requirements out of it, then compare shapes.

## Requirements and shapes

Requirements are `R1`, `R2`, and so on. Each says what is needed, not which shape satisfies it. Keep the top list short enough to scan. Status is one of: core, must-have, nice-to-have, undecided, out.

Shapes are mutually exclusive mechanisms: `A`, `B`, `C`. Give each a short title that says how it works. Parts of a shape are `B1`, `B2`. Alternatives for one part are `B2-A`, `B2-B`. A part whose how is still unknown is marked unknown. An unknown does not pass a fit check.

Show the full table every time, not a summary. Mark rows that changed since the last table.

## Fit check

One table. Requirements are rows. Shapes are columns. Each cell is yes, no, or unknown. Notes explain failures only.

If every cell passes and the shape still feels wrong, the missing constraint is a new requirement. Add it and run the check again.

## Stop

Wait for Ted to pick a shape before writing Vue. If the pick has more than one place, or an interaction that is not obvious, the next step is [breadboard](../breadboard/SKILL.md). Otherwise build.
