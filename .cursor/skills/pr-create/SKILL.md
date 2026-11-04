---
name: pr-create
description: >-
  Pushes existing local commits and opens a GitHub pull request with a short
  summary and a test checklist. Use when the user asks to create a PR, open a
  pull request, or runs /pr-create. Not for commit-only or push-only requests.
---

# Create pull request

## When to use

The user asked to create a PR, open a pull request, or ran `/pr-create`.

Commit-only work uses [commit](../commit/SKILL.md). Push-only uses [push](../push/SKILL.md).

## Workflow

1. **Preflight.** Run `git status` and `git branch --show-current`.
   - On `main` or `master`: stop. Do not push and do not open a PR. Ask for a feature branch name unless they already named one. After the branch checkout, resume.
   - Dirty tree and no commits ahead of `origin/main`: stop. Ask them to commit first. Do not commit inside this skill.
   - Commits exist and leftover files look unrelated: leave them unstaged, say they stay local, and continue.
   - Branch already matches origin: say so. If a PR already exists, report its URL.
2. **Goal.** From the chat and `git log` against the merge-base with `origin/main`, write a one-line goal. If the goal is ambiguous, ask one question before pushing.
3. **Push.** Follow [push](../push/SKILL.md). Run the push as its own command, not chained with `gh pr create`, so a blocked step is easy to see. Never force-push. If push has nothing new to publish, continue when the remote branch already has the commits.
4. **Title and body.**
   - Title: plain English, about 50 characters, max 72, no trailing period, no Conventional Commit prefix.
   - Body: a short summary and a test checklist.
5. **Open the PR** against `main` with `gh pr create`. Ready for review unless they asked for a draft. If a PR for this branch exists, report that URL instead of opening another.
6. **Report** the PR URL.

```bash
gh pr create --title "the pr title" --body "$(cat <<'EOF'
## Summary
- …

## Test plan
- [ ] …

EOF
)"
```

## Safety

- Run only when they asked for a PR.
- Never commit inside this skill.
- Never push `main` or open a PR whose head is `main`.
- Never force-push unless they explicitly request it.
- Do not invent a goal. Ask when it is unclear.

## Example

**Title:** Add shared agent docs

**Body:**

```markdown
## Summary
- Added AGENTS.md as the shared Cursor and Claude Code contract
- Added prototype, icon, voice, and git skills

## Test plan
- [ ] Open a prototype chat and confirm the new-prototype skill is available
- [ ] Confirm .claude/skills points at .cursor/skills
```
