---
name: push
description: >-
  Pushes the current feature branch to origin. Use when the user asks to push
  or publish the branch, or when pr-create needs a push step. Not for writing
  commit messages or committing locally.
---

# Push

## Workflow

1. Push only when the user asked to push, or when [pr-create](../pr-create/SKILL.md) is on its push step.
2. Preflight before every `git push`:
   1. `git branch --show-current`. On `main` or `master`, refuse unless they explicitly asked to push that branch this turn. Ask for a feature branch name. After switching, run this preflight again from the top. Never `git push origin main` by default.
   2. Compare to the upstream, or to `origin/main` if there is no upstream. If there are no commits unique to this branch, do not push. Say there is nothing to publish. Do not create an empty remote branch that only matches `main`. Callers such as pr-create treat that as a skipped push, not a failure.
   3. If the tree is dirty and there are no unique commits, stop and ask them to commit first ([commit](../commit/SKILL.md)). If unique commits exist and leftovers remain, leave the leftovers unstaged and push the commits.
3. When there are unique commits: `git push -u origin HEAD` if no upstream is set, otherwise `git push`.

If the remote rejects the push, explain why. Suggest `git pull --rebase` or a merge only after they approve, then push again (preflight first).

## Safety

- Never force-push unless they explicitly request it.
- Never put tokens or passwords in chat or in this file. `git push` uses the machine’s existing GitHub auth.
- Do not open a pull request from this skill. That is [pr-create](../pr-create/SKILL.md).
