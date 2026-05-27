---
name: skill-006-two-commit-review-pattern
description: >
  A git commit workflow that preserves the audit trail of what a developer
  agent delivered versus what the Tech Lead changed, in exactly two commits
  per phase. Commit 1 (Pre-TL Review) freezes the agent's raw output.
  Commit 2 (TL Reviewed) captures TL fixes and the explicit sign-off. Never
  combining these is the invariant — the separation is the audit trail that
  makes AI-driven development trustworthy and reviewable. Use this skill
  every time a developer agent delivers output for a phase. Covers the exact
  commit message formats, how to recover when both were accidentally combined
  using git reset --soft, and when Commit 2 should say "found no exception"
  versus listing specific exceptions by name. Do not use for TL direct code
  changes where no agent was involved.
license: Proprietary — Efficient Corporates Internal Use Only
metadata:
  skill_id: "SKILL-006"
  euadf_version: "4.0"
  last_validated: "2026-05-20"
  category: Code Review
  deterministic_triggers: |
    Apply this skill if ANY of the following are true:
    - A developer agent has just delivered output for a phase
    - Code is being staged for commit after an agent-generated session
    - The TL is about to commit changes that mix agent output and TL fixes
    - A phase is being closed with a TL Reviewed commit
---

## Key Principles

**Commit 1 — Pre-TL Review (freeze the agent's raw output):**
```bash
git add [specific files only — never git add .]
git commit -m "Pre-TL Review: Phase N - Description"
```
This freezes exactly what the developer agent delivered. Do not include any TL changes in this commit.

**Commit 2 — TL Reviewed (TL fixes + sign-off):**
```bash
git add [only the files changed during review]
git commit -m "Phase N TL reviewed and found [no exception | N exceptions: ...]"
```

If exceptions were found, name them explicitly:
```
"Phase 8 TL reviewed and found 4 exceptions: M7 violation in test_02, missing metrics-data.json, vacuous assertion in test_03, wrong table headers in test_04"
```

If no changes were needed:
```
"Phase 7 TL reviewed and found no exception"
```

**This pattern applies even when the TL made zero changes.** Commit 2 with "found no exception" is the explicit sign-off that the TL ran the tests and confirmed correctness — not just assumed it.

**Recovery — if both were accidentally combined into one commit:**
```bash
git reset --soft HEAD~1   # Undo the commit, keep all changes staged
# Now re-split:
# 1. Unstage TL fixes, stage only original agent output → commit as Pre-TL Review
# 2. Re-apply TL fixes, stage → commit as TL Reviewed
```

## When NOT to Apply

- The TL is writing code directly without agent involvement — one commit is correct.
- Fixing a single typo or one-line correction not from agent output.
- Commits on a personal scratch branch that will be squashed before review.

## Example

**Phase 7** was initially committed as a single combined commit — both Gemini's output and TL verification mixed together. Used `git reset --soft HEAD~1` to undo, then split into:
- `Pre-TL Review: Phase 7 - Pipeline Orchestration` (raw Gemini output, frozen)
- `Phase 7 TL reviewed and found no exception` (after confirming tests passed with no changes needed)

**Phase 8** required:
- `Pre-TL Review: Phase 8 - Integration Tests` (raw Gemini output)
- `Phase 8 TL reviewed and found 4 exceptions: M7 violation x4, missing metrics-data.json, vacuous assertion test_02, wrong table headers test_03`

The Phase 8 TL Reviewed commit message is the permanent record that these 4 exceptions existed and were corrected — visible in `git log` forever.

## Gotchas

- **Committing TL fixes without the Pre-TL Review commit** — the agent's raw output is invisible in history; the audit trail is broken.
- **Using `--amend` on the Pre-TL Review commit** — destroys the baseline record of what the agent delivered.
- **Writing "found no exception" when fixes were made** — misrepresents the audit trail; the sign-off is a factual record, not a formality.
- **`git add .` instead of named files** — accidentally stages `.env`, debug files, or unintended scope.
- **Not naming the specific exceptions in Commit 2** — "found 4 exceptions" without naming them is useless for future readers.
