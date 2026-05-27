---
name: skill-004-git-branch-strategy
description: >
  Defines the correct git branching model, tagging strategy, and branch
  cleanup rules for EUDF projects. The critical insight: branches are
  temporary work-in-progress markers; tags are permanent release records.
  "What did v2.0 look like?" is answered by git checkout v2.0 (the tag),
  never by a branch. Use this skill any time a merge, tag, or branch
  deletion decision is being made — when a PR is merging to develop or
  main, when a release is being cut, when a branch deletion is proposed,
  when a new feature or version branch is being created, or when the TL
  asks "can I merge to main?" Apply even when the user does not explicitly
  mention branching — any conversation about release readiness or version
  finalization triggers this skill.
license: Proprietary — Efficient Corporates Internal Use Only
metadata:
  skill_id: "SKILL-004"
  euadf_version: "4.0"
  last_validated: "2026-05-20"
  category: Git/GitHub
  deterministic_triggers: |
    Apply this skill if ANY of the following are true:
    - A PR is being merged to develop or main
    - A release is being cut or a version is being tagged
    - A branch deletion is being proposed
    - The TL asks "can I merge to main?" or "what's the branch status?"
    - A new feature or version branch is being created
---

## Key Principles

**Branch flow:**
```
feature/version branch
    ↓  (PR via SKILL-003)
develop  ← staging sandbox, safe to break
    ↓  (manual promotion after staging validation passes)
main     ← production, protected
```

- `develop` is the sandbox — all PRs target here first.
- `main` is protected — only manually promoted after `develop` validates cleanly.

**Tagging on merge to main:**
```bash
git tag -a v2.0 -m "EfficientDAM v2.0 — full pipeline, 82 tests, R2 upload"
git push origin v2.0
```

**Branch deletion after tagging:**
```bash
# Confirm the tag exists before deleting the branch
git tag | grep v2.0

# Then delete the remote branch
git push origin --delete ver2.0
```

**Never delete a branch before confirming the tag exists.** The tag is the permanent record; the branch is scaffolding.

**Tag on `main`, not on `develop`** — the tag must point to the production state, not the staging state.

## When NOT to Apply

- Routine commits during active development on a personal branch.
- Hotfixes bypassing `develop` via emergency protocol — separate explicit decision required.
- Repository setup before the first commit.

## Example

`ver2.0` branch → PR #2 → `develop`. After sandbox validation passes:
1. `develop` → `main` merge
2. `git tag -a v2.0 -m "EfficientDAM v2.0 — full pipeline, 82 tests, R2 upload"`
3. `git push origin v2.0`
4. `git push origin --delete ver2.0`

The tag `v2.0` permanently records the production release. The branch `ver2.0` was temporary scaffolding — deleted after tagging.

Checking out `git checkout v2.0` six months later reproduces the exact production state. Checking out a deleted branch is impossible. This is why the tag is created before the branch is deleted.

## Gotchas

- **Keeping stale merged branches** — clutters `git branch`, confuses active work from completed work.
- **Forgetting to tag before deleting the release branch** — the release point is permanently lost.
- **Creating the tag on `develop` instead of `main`** — the tag points to staging state, not production.
- **Force-pushing to `main`** — never acceptable; rewrites shared history.
- **Merging directly to `main` without staging validation** — the staging step exists to catch what unit tests miss.
