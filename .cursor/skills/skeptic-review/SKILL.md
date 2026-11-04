---
name: skeptic-review
description: >-
  Read-only adversarial review of the current branch for a sizzle-reel
  prototype. Use before merge, for a hostile second opinion, or when the user
  runs /skeptic-review. Do not edit or fix.
---

# Skeptic review

Stay read-only. Do not edit, reformat, stage, commit, push, or open a pull request. Report in the chat. Do not write a review file unless Ted asks.

## Scope

Review `git diff` against `main` plus uncommitted work on the current branch. If that diff is empty, say the branch, the base, and that there is nothing to review. Then stop.

Assume the change is more broken than it looks. Prove a finding with a file, a line, or the local URL. Do not invent a flaw to fill a list. Do not treat a comment or a component name as proof.

## Look for

- The UI misses the reference prototype, the Figma intent, or the shape Ted picked.
- A color, space, type size, or radius is a raw value where a `--dt-*` token or `d-*` class already exists. A Dialtone package was added.
- A frozen prototype folder changed: `analytics-gpt`, `launchpad`, `ai-chatbot`, or `scorecards`.
- An interaction claims to work and does not. A presentation-only control is wired as if it were real, or a real one is left dead without saying so.
- The diff includes work Ted did not ask for.
- A chart breaks the [chart](../chart/SKILL.md) rules: hardcoded series colors, a line behind bars, dots on every point, or a headline that uses a different denominator than the chart.

## Report

1. One verdict paragraph. Name the most dangerous risk. This review does not declare the branch ready.
2. Findings, highest severity first. Omit empty groups. Each finding is one line: severity, where, what happens, why it matters. Severity is critical, major, minor, or nit.
3. What held up. Name the attacks the change survived. Do not pad with praise.

Do not fix anything unless Ted asks after the report.
