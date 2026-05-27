---
name: skill-001-phase-decomposition
description: >
  Breaks a large, ambiguous engineering project into atomic, independently
  deliverable phases so a developer agent can execute one phase at a time
  without holding the full system in context. Each phase has a single
  objective, a concrete verifiable output, and a gate that must pass before
  the next phase begins. Use this skill when a task involves more than 3
  files, spans multiple modules or concerns, includes words like "pipeline",
  "system", "full implementation", or "all of it", requires a staging or
  deployment step, or is described as "Phase N" or "next step". Apply even
  if the user does not say "phase" or "decompose." Do not use for
  single-file fixes, single-function additions, or tasks completable in one
  prompt.
license: Proprietary — Efficient Corporates Internal Use Only
metadata:
  skill_id: "SKILL-001"
  euadf_version: "4.0"
  last_validated: "2026-05-20"
  category: Planning
  deterministic_triggers: |
    Apply this skill if ANY of the following are true:
    - The task involves creating or modifying more than 3 files
    - The task spans more than one module, tool, or concern (e.g., config + logic + tests)
    - The words "pipeline", "system", "full implementation", or "all of it" appear in the task
    - The task requires a staging or deployment step in addition to code changes
    - A previous phase exists and this task is described as "Phase N" or "next step"
---

## Key Principles

- Each phase must have a **single, clearly stated objective** — one thing to build or fix.
- Phases must be **sequenced by dependency** — a phase must not assume work from a later phase.
- Each phase ends with a **concrete, verifiable output**: a specific file path, a passing test command, or a working terminal command.
- **Phase size:** ~3–5 files maximum. Beyond that, the agent loses coherence and begins inventing structure.
- Every phase prompt must include ALL of the following — missing any one causes agent drift:
  - (a) Context from previous phases: exact files already written, their function signatures, and constants they define
  - (b) Exact files to create or modify
  - (c) Naming conventions with examples (e.g., kebab-case filenames, ID formats like `ec-ady-NNNNNN`)
  - (d) Security constraints copied verbatim — do not paraphrase
  - (e) Output format with exact function signatures and return types
  - (f) An explicit list of what NOT to do — lessons from prior phase mistakes
  - (g) The acceptance test: the exact command that must pass for the phase to be complete
- **Never mix concerns:** building a feature AND writing its tests is two phases, not one.
- **Define gate checkpoints** — tests must pass before the next phase begins.
- Phase deliverables must be **testable in isolation** — a phase that only makes sense when combined with the next is too tightly coupled.

## When NOT to Apply

- Single-file bug fixes or isolated function changes — overhead with no benefit.
- Interactive TL + agent sessions with immediate back-and-forth feedback — phase structure is for async batch delegation.
- Refactors that touch many files but have a single coherent objective (rename a constant everywhere) — one phase regardless of file count.
- Tasks where the full implementation fits within one prompt without losing coherence.

## Example

EfficientDAM v2.0 — a local Windows Python pipeline for digital asset processing — was decomposed into 9 sequential phases, each delivered to Gemini independently:

| Phase | Objective |
|-------|-----------|
| 1 | Config schema and `file-format-specs.json` |
| 2 | Preflight validation (HC-01 through HC-17 gates) |
| 3 | Redaction engine (4-level cascade) |
| 4 | Conversion tool (MD→PDF, MD→DOCX, JSON→XLSX, HTML→PPTX, PY→EXE) |
| 5 | R2 upload (`push_to_r2.py`) |
| 6 | Registry generators (nonbinary, binary, mapping) |
| 7 | Convert-to-Excel wrapper |
| 8 | Master pipeline orchestrator |
| 9 | Integration tests + production hardening |

Without decomposition, a single "build the whole pipeline" prompt would have produced structurally inconsistent code by Phase 3 — the agent would have invented naming conventions and function signatures that conflicted with what Phases 1 and 2 already defined.

## Gotchas

- **"Build the whole pipeline" in one prompt** — the agent invents structure that conflicts by Phase 3.
- **Not specifying the output format** — the agent guesses function signatures; downstream callers break.
- **Not stating what already exists** — the agent reimplements Phase 1 work with different function names.
- **"Phase 3 — all registry generators"** — too large; split into one generator per phase.
- **No acceptance test defined** — the agent marks complete when code runs, not when it is correct.
- **Mixing feature code and test code in one phase** — tests come out shallow or skipped.
