---
name: commit
description: >-
  Proposes a title-only commit subject, then stages this task's files and
  commits. Use when the user asks for a commit message, to stage and commit,
  or to save work locally. Not for push-only or pull-request requests. If they
  ask whether work was already committed, check git status and do not commit
  unless they explicitly ask.
---

# Commit

Canonical git rules: [AGENTS.md](../../../AGENTS.md) (*Git workflow*).

## Subject

- One line only. No body unless the user asks.
- Imperative, present tense (“Add…”, “Fix…”).
- Aim for about 50 characters. Max 72. No trailing period.
- Format: `type(optional-scope): description` with a lowercase description after the colon.

| type | Use when |
|------|----------|
| `feat` | New prototype, screen, or user-facing behavior |
| `fix` | Bugs (layout, interaction, routing) |
| `style` | Visual-only CSS or Dialtone alignment |
| `chore` | Tooling, docs, agent rules, refactors with no UI change |

Path hints: `src/prototypes/` → `feat`, `fix`, or `style`. `.cursor/`, `AGENTS.md`, `CLAUDE.md` → `chore`.

## Workflow

1. If the user is only asking whether something is committed, run `git status` and `git log -1`. Answer from that. Do not commit.
2. Run `git branch --show-current`. On `main` or `master`, stop before staging. Ask for a branch name unless they already named one. After `git checkout -b <name>`, continue.
3. In parallel, run `git status`, `git diff` (staged and unstaged), and `git log -5 --oneline` so the subject matches this repo’s recent style and the files that will be committed.
4. List every modified and untracked path. Stage only this task’s paths (`git add <paths>`). Do not use `git add -A` or `git add .` when unrelated changes exist. If they asked to “commit everything,” confirm first.
5. Commit with a HEREDOC so the subject is literal:

   ```bash
   git commit -m "$(cat <<'EOF'
   type(scope): description

   EOF
   )"
   ```

6. Run `git status` and confirm leftovers are still unstaged.

Do not push. Publishing is [push](../push/SKILL.md). A pull request is [pr-create](../pr-create/SKILL.md).

## Safety

- Commit only when the user asked.
- Never commit on `main` / `master` unless they explicitly override for that turn.
- Do not commit secrets or `.env` files.
- Do not update git config. Do not skip hooks. Do not amend unless they asked and the commit is unpushed and was created in this conversation.
- If a hook rejects the commit, fix the problem and make a new commit. Do not amend a failed commit.
