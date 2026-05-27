---
name: skill-005-agent-prompt-engineering
description: >
  Defines how to write a task prompt for a developer agent (Gemini,
  GPT-4o, Claude in dev mode) that produces correct, reviewable,
  merge-ready output without requiring clarification rounds. A
  well-engineered prompt front-loads all decisions the agent would otherwise
  invent: naming conventions, security constraints, what already exists,
  exact output format, and the acceptance test. Use this skill every time a
  task is delegated to a developer agent, even if the task seems simple.
  Covers the full phase prompt template with nine required sections. Do not
  use for exploratory conversations where the output is a plan rather than
  code, or for tasks where the TL is working through an approach rather than
  delegating execution.
license: Proprietary — Efficient Corporates Internal Use Only
metadata:
  skill_id: "SKILL-005"
  euadf_version: "4.0"
  last_validated: "2026-05-20"
  category: Agent Collaboration
  deterministic_triggers: |
    Apply this skill if ANY of the following are true:
    - A task is being delegated to a developer agent (Gemini, GPT-4o, Claude in dev mode)
    - A Phase N prompt is being written
    - The prompt will result in files being created or modified
    - The prompt involves security-sensitive code (credentials, redaction, gates)
---

## Key Principles

- **State what already exists:** List files already written, their exact function signatures, constants, and conventions. The agent must not reinvent them.
- **State exact naming conventions with examples:** kebab-case filenames, ID formats (`ec-ady-NNNNNN`), module names.
- **State the security constraints verbatim** — copy the exact policy text, do not paraphrase.
- **State the output format explicitly:** which files to create, which to modify, exact function signatures, return types.
- **State what NOT to do:** list known mistakes from previous phases explicitly.
- **Include the acceptance test:** the exact command that must pass.
- **Include upstream context:** data structures passed in, what the downstream caller expects, exact Markdown table formats.
- **Include required skills:** list SKILL-XXX IDs the agent must consult before starting.

**Phase Prompt Template:**

```markdown
## Phase {N} — {Phase Name}

### Your Role
You are a developer agent implementing Phase {N} of the EfficientDAM pipeline.
Read all required skills before writing any code.

### Required Skills
Consult these skills before beginning:
- SKILL-001 (Phase Decomposition) — governs how you scope your output
- SKILL-008 (Test Design + M1–M7 Rules) — governs all test writing
- SKILL-014 (Security Practices) — governs all credential handling
- [Add others as applicable]

### Context from Previous Phases
The following files already exist and MUST NOT be reimplemented:
- tools/preflight.py — contains run_preflight(project_id: str) -> bool
  Constants: TEMP_DIR, CONFIG_DIR, REDACTION_FILE, SPECS_FILE, REGISTRY_DIR
- tools/redact.py — contains redact_asset(project_id, ady_id) -> Path | None
  Output is written to DIST_DIR = ROOT_DIR / "dist"

### Security Constraints (NON-NEGOTIABLE — copy verbatim into your code)
- Credentials in .env ONLY. Never in Python files, config JSON, or committed files.
- secrets.py is PROHIBITED and is in .gitignore.
- Load credentials via: load_dotenv(); value = os.getenv("KEY_NAME")
- No credentials in test files — use MagicMock() for credential-dependent objects.

### Naming Conventions
- File names: kebab-case only (e.g., valid-name.md, not valid_name.md)
- ADY IDs: ec-ady-NNNNNN (6 digits, zero-padded)
- AST IDs: ec-ast-NNNNNN (6 digits, zero-padded)
- Function names: snake_case
- Constants: UPPER_SNAKE_CASE

### What To Create/Modify
Create the following files:
1. tools/{module}.py
   - Function: {function_name}(param: type) -> ReturnType
   - Must import: [list]
   - Must NOT import: [list]

### The Exact Table Format (if registry-related)
The nonbinary registry table has these exact column headers:
| ADY ID | Filename | Type | Version | Redaction Required | Export Formats |
Any deviation in headers will break the downstream parser.

### What NOT To Do
- Do NOT use direct module mutation in tests: module.CONSTANT = value (M7 violation)
- Do NOT use positional side_effect lists for Path.exists() (brittle — see SKILL-008)
- Do NOT write to assets/ — all pipeline outputs go to dist/
- Do NOT use relative imports in entry-point scripts

### Acceptance Test
Your output is complete when this command passes with zero failures:
pytest tests/unit/dev_tests/test_{module}.py -v
Expected: all N tests pass, no errors, no warnings about missing files.
```

## When NOT to Apply

- Exploratory tasks ("explain how this works", "what are the options?") — conversational, not delegation.
- The TL is working through an approach — this skill is for delegating TO another agent.
- Short isolated fixes where all context is already in the conversation.

## Example

The Phase 8 (integration tests) prompt included: exact Markdown table column headers the registry generators produce, the M1–M7 mocking rules verbatim, the two-commit pattern requirement, and an explicit line: `pipeline_mod.REGISTRY_DIR = tmp_path is FORBIDDEN — this is an M7 violation.`

This prevented 3 of the 4 exceptions that still appeared in Gemini's raw output. The 4th appeared because the fixture format differed slightly from the real generator output — caught during TL review (SKILL-007).

The lesson: even a highly detailed prompt cannot prevent all errors. The phase prompt reduces errors; TL review (SKILL-007) catches the rest.

## Gotchas

- **"Write the integration tests"** — agent makes structural decisions that conflict with existing code.
- **Not stating the mocking rules** — agent uses direct module mutation (M7) on every delegation without fail.
- **Not specifying the exact table format** — agent invents column headers the downstream parser cannot read.
- **Not telling the agent which test framework is in use** — agent defaults to `unittest` when the project uses `pytest`.
- **Not stating what already exists** — agent reimplements Phase 1 work with different function names.
- **Paraphrasing security constraints** — agent interprets paraphrased rules loosely; verbatim copy is non-negotiable.
