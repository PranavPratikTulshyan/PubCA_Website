---
name: skill-002-github-issue-format
description: >
  Defines the standard format for raising a GitHub issue so that bugs, tech
  debt, and improvements have a dated, attributed audit trail. An issue is
  not just a bug tracker — it is a record of what was known and when. Use
  this skill every time a defect, tech debt item, or staging issue is
  identified, even if it will not be fixed immediately. Covers the
  conventional-commit-style title format, required body sections (Summary,
  Current Behaviour, Expected Behaviour, Root Cause, Proposed Fix,
  Acceptance Criteria, Metadata), the exact gh CLI command with labels and
  assignee validation, and the full label taxonomy. Apply even if the issue
  seems small — undocumented problems compound into invisible tech debt. Do
  not use for informal exploratory discussion or tasks completed within the
  same session.
license: Proprietary — Efficient Corporates Internal Use Only
metadata:
  skill_id: "SKILL-002"
  euadf_version: "4.0"
  last_validated: "2026-05-20"
  category: Git/GitHub
  deterministic_triggers: |
    Apply this skill if ANY of the following are true:
    - The TL says "raise an issue" or "create a GitHub issue"
    - A bug, tech debt item, or regression is identified during code review or test runs
    - A staging validation run reveals a problem that will not be fixed before the current release
    - A task is being explicitly deferred to a future version
    - The task requires assigning work to a named developer
---

## Key Principles

**Title format:** `type(scope): short description`
- Types: `fix`, `feat`, `refactor`, `test`, `docs`, `chore`, `infra`, `security`
- Example: `fix(tests): brittle positional Path.exists() mocking in test_hc03_fail`

**Required body sections:**

```markdown
## Summary
One paragraph: what is broken, why it matters, who is affected.
Do NOT describe the solution here.

## Current Behaviour
What the code does now. Include exact error output or test failure message.

## Expected Behaviour
What should happen once this issue is resolved.

## Root Cause (if known)
Why this exists. Reference any applicable SKILL-XXX.

## Proposed Fix
Concrete approach with code snippet or file reference.

## Acceptance Criteria
- [ ] Each criterion is independently testable
- [ ] Full test suite passes: `pytest tests/ -v`
- [ ] No new regressions

## Metadata
- Found in version: v2.0
- Severity: Low | Medium | High | Critical
- Type: Bug | Tech Debt | Feature | Security
- Target version: v2.1
- Agent-delegable: Yes | No
```

**CLI command to create an issue:**

```bash
gh issue create \
  --title "fix(tests): brittle positional Path.exists() mocking in test_hc03_fail" \
  --body "$(cat <<'EOF'
## Summary
...

## Acceptance Criteria
- [ ] test_hc03_fail passes after SC-03 removal
- [ ] Adding or removing any Path.exists() call does not break the test
EOF
)" \
  --label "type: bug" \
  --label "priority: normal" \
  --assignee "github-username"
```

**Always validate the assignee username before use:**

```bash
gh api users/github-username --jq '.login' 2>/dev/null || echo "USER NOT FOUND"
```

If the user is not found, raise the issue without the assignee. Do not skip the issue.

**Labels that must exist in the repo before use:**
`type: bug`, `type: feature`, `type: refactor`, `type: test`, `type: docs`, `type: infra`, `type: security`, `priority: critical`, `priority: high`, `priority: normal`, `priority: low`, `agent: ai-delegate`, `agent: human-required`

## When NOT to Apply

- Informal exploratory discussion — wait until the decision to track it is made.
- Tasks completed in the current session within minutes — only raise if the fix outlives the session.
- Duplicate of an existing open issue — run `gh issue list` first; comment on the existing issue instead.

## Example

**Issue #4 — `fix(tests): brittle positional Path.exists() mocking in test_hc03_fail`**

During staging validation, removing SC-03 (alert fatigue gate) caused `test_hc03_fail` to break because its positional `side_effect = [True, True, True, True, True, True, False, True]` had 8 entries but only 7 `.exists()` calls remained after SC-03 removal. The test silently checked the wrong gate.

The human PM identified this as a structural problem, not a one-time fix. Issue #4 was raised with:
- Proposed fix: path-identity mocking (see SKILL-008)
- Acceptance criteria: test still passes after any future gate addition or removal
- Target version: v2.1
- Assignee attempt: `pranav77122` — **FAILED. Username not found.** Issue raised without assignee. This incident created the "validate username before assigning" rule.

## Gotchas

- **`fix: something is broken`** — no scope, no reproducible detail, not actionable.
- **No acceptance criteria** — issue can be closed without actual resolution.
- **Assigning to a non-existent username** — `gh` CLI silently drops the assignee or errors with no warning.
- **Skipping issue creation because "it's a small thing"** — small undocumented problems become invisible tech debt.
- **Not running `gh issue list` first** — raises a duplicate; real issue stays unlinked.
