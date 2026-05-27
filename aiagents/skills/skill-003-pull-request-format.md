---
name: skill-003-pull-request-format
description: >
  Defines the standard format for creating a pull request so reviewers have
  full context without reading every commit. A PR is a structured handoff
  document, not just a merge trigger. Use this skill every time code moves
  from a feature or version branch to a shared branch. Covers the
  conventional-commit-style title under 70 characters, a 3-5 bullet
  summary, a test plan checklist with manual verification steps, issue
  links, and the exact gh pr create command with HEREDOC body. The critical
  rule: always target develop, never main directly. Apply when a branch is
  ready to merge, all tests pass, and staging validation is complete — even
  if the user does not say "pull request." Do not use for direct commits to
  personal branches mid-development or hotfixes on main via emergency
  protocol.
license: Proprietary — Efficient Corporates Internal Use Only
metadata:
  skill_id: "SKILL-003"
  euadf_version: "4.0"
  last_validated: "2026-05-20"
  category: Git/GitHub
  deterministic_triggers: |
    Apply this skill if ANY of the following are true:
    - The TL says "create a PR" or "open a pull request"
    - Code is ready to move from a feature/version branch to develop
    - A phase is complete and has passed all gate checks
    - The gh pr create command is being issued
---

## Key Principles

**Title format:** `type(scope): short description` — under 70 characters
- Types: `feat`, `fix`, `refactor`, `improve`, `chore`, `docs`, `test`
- Example: `feat: EfficientDAM v2.0 — full pipeline implementation (Phases 1–9)`

**CLI command to create a PR:**

```bash
gh pr create \
  --title "feat: EfficientDAM v2.0 — full pipeline implementation (Phases 1-9)" \
  --base develop \
  --body "$(cat <<'EOF'
## Summary
- Implements the full EfficientDAM pipeline: preflight, redaction, conversion, R2 upload, registry generation
- Introduces dist/ as the dedicated output directory for all pipeline-generated files
- All 82 unit tests pass; 4 integration tests pass

## What Changed
- tools/preflight.py: HC-01 through HC-17 gates implemented
- tools/redact.py: 4-level redaction cascade
- tools/convert.py: MD→PDF/DOCX, JSON→XLSX, HTML→PPTX, PY→EXE
- tools/master_pipeline.py: full orchestration with sys.path fix
- dist/ directory introduced; assets/ kept source-only

## Test Plan
- [x] `pytest tests/ -v` — 82/82 pass
- [ ] Reviewer: run `python tools/master_pipeline.py --project ec-prj-001 --dry-run`
- [ ] Reviewer: verify pandoc is on PATH before full run
- [ ] Reviewer: verify .env has real R2 credentials before full run
- [ ] Reviewer: confirm R2 uploads visible in Cloudflare dashboard

Closes #1

🤖 Generated with Claude Sonnet 4.6
EOF
)"
```

**Rules:**
- Always `--base develop` — never target `main` directly.
- Include test count: "82/82 unit tests pass."
- Link issues: `Closes #N` or `See #N`.
- Never force-push to a shared branch after the PR is open.
- If the PR covers multiple phases, list each phase with its gate status.

## When NOT to Apply

- Direct commits to personal branches mid-development — use `git commit` directly.
- Hotfixes on `main` via emergency protocol — separate process.
- Non-code changes committed directly to a personal branch.

## Example

**PR #2 — `feat: EfficientDAM v2.0 — full pipeline implementation (Phases 1–9)`** targeting `develop`.

The description listed all 9 phases with gate status, 82/82 unit tests, manual R2 verification steps, and `Closes #1`. The reviewer had everything needed to validate the PR without reading 50+ individual commits.

Initial mistake: `--base main` was used. Caught before submission. Corrected to `--base develop`. This incident made the "always develop, never main" rule an explicit principle in SKILL-004.

## Gotchas

- **`--base main` instead of `--base develop`** — bypasses staging, violates EUDF gate process.
- **One-line PR description** — reviewer has no context; wastes review time with back-and-forth.
- **Opening a PR before tests pass locally** — wastes reviewer time.
- **Not linking the issue** — PR and issue histories become disconnected; traceability is lost.
- **Forgetting manual verification steps in the test plan** — automated tests do not catch environment issues like missing pandoc or wrong R2 prefix.
