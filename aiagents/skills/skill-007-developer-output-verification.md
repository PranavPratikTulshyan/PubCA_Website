---
name: skill-007-developer-output-verification
description: >
  The systematic process a Tech Lead uses to verify that a developer agent
  actually completed a task correctly, not just claimed to. An agent's
  self-assessment ("all tests pass", "all files created") is frequently
  wrong — plausible-looking code can have broken imports, wrong paths, or
  silently incorrect logic. Use this skill every time a developer agent
  delivers output, before staging any files for commit. The six-step
  verification sequence: run tests first, check for missing files, grep for
  forbidden patterns, verify function signatures, check test quality for
  vacuous assertions, read the diff before git add. Apply even when the
  agent's summary sounds complete and confident. Do not use for code the TL
  wrote directly.
license: Proprietary — Efficient Corporates Internal Use Only
metadata:
  skill_id: "SKILL-007"
  euadf_version: "4.0"
  last_validated: "2026-05-20"
  category: Code Review
  deterministic_triggers: |
    Apply this skill if ANY of the following are true:
    - A developer agent has just delivered output and claimed completion
    - The TL is reviewing code before creating the "TL Reviewed" commit
    - Tests are being run for the first time after a phase delivery
    - The TL is about to sign off on a phase
---

## Key Principles

**Step 1 — Run the tests first. Do not read the code first.**
```bash
pytest tests/unit/dev_tests/test_{module}.py -v
```
Tests reveal whether output is functional. Reading code for logical correctness first creates confirmation bias — you see what you expect to see.

**Step 2 — Check for missing files.**
Agents frequently reference files they never created:
- A test imports a fixture file that was never written
- A module references a constants file that does not exist
- Example: `metrics-data.json` referenced in Phase 8 tests but never created by Gemini

**Step 3 — Check for forbidden patterns.**
```bash
# M7 violation — direct module mutation
grep -rn "pipeline_mod\." tests/
grep -rn "\.CONSTANT\s*=" tests/

# Credentials in code
grep -rn "r2.cloudflarestorage" tools/
grep -rn "access_key_id\s*=" tools/

# Wrong output directory (outputs should use DIST_DIR)
grep -rn "ASSETS_DIR" tools/
```

**Step 4 — Check function signatures.**
Verify that what the agent wrote matches what the upstream caller from a previous phase expects. Argument order and types matter — a wrong order compiles and runs silently until it produces wrong output.

**Step 5 — Check test quality.**
- Is every assertion falsifiable? (Can you make it fail by breaking the production code it tests?)
- Is `assert True` or a vacuous condition present? (See SKILL-008 for the vacuous assertion anti-pattern)
- Are positional `side_effect` lists used for `Path.exists()`? (Brittle — see SKILL-008 M3)

**Step 6 — Read the diff before staging.**
```bash
git diff --staged
```
Never `git add .` — always review the diff first. Look for: debug statements left in, unintended file changes, wrong scope of changes.

## When NOT to Apply

- The TL wrote the code directly — self-review is different; running tests is sufficient.
- A small isolated change where the test suite comprehensively covers it.
- Exploratory scratch code not being committed.

## Example

Phase 8 (integration tests) delivered by Gemini — four issues invisible from Gemini's summary, all found by this verification sequence:

1. **`metrics-data.json` missing** — referenced in a test fixture but never created by Gemini. Found at Step 2.
2. **M7 violation in 4 tests** — `pipeline_mod.REGISTRY_DIR = tmp_path` used directly in every test. Found at Step 3.
3. **Vacuous assertion** — `assert "ec-ast-NNNNNN" in data_rows[0]` checked a literal string in the header row which always contained it. Found at Step 5.
4. **Wrong table headers** — fixture used `| ID | Name | Version |` instead of the real generator's `| ADY ID | Filename | Type | Version | ...`. Found at Step 5.

None of these were mentioned in Gemini's summary. All were caught before the Pre-TL Review commit.

## Gotchas

- **Trusting "all tests pass" without running them locally** — the agent may have run stale or cached tests.
- **Reading the code for logical correctness before running tests** — logical analysis creates confirmation bias; runtime behaviour is the ground truth.
- **Not checking that newly created files have content** — agents sometimes create placeholder files with no actual implementation.
- **`git add .` without reviewing the diff** — accidentally stages `.env`, debug files, or wrong-scope changes.
- **Checking only the test count, not test quality** — 82 passing tests can include vacuous assertions that never actually test anything.
