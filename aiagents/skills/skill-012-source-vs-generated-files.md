---
name: skill-012-source-vs-generated-files
description: >
  The architectural principle that source files (git-tracked) and pipeline-
  generated output files (gitignored) must never coexist in the same
  directory. When a pipeline writes outputs to the source directory, git
  treats them as untracked changes, gitignore becomes a patchwork of
  workarounds, and the repo history is polluted with large binaries. Use
  this skill whenever a pipeline writes output files, when untracked binary
  or generated files appear inside a source directory, when gitignore
  contains extension-based patterns like assets/*.exe or assets/*.pdf, or
  when a new output format is being added with no output directory. The
  non-obvious rule: git add -f dist/.gitkeep is required — the dist/* ignore
  pattern covers .gitkeep too, so a normal git add silently does nothing.
license: Proprietary — Efficient Corporates Internal Use Only
metadata:
  skill_id: "SKILL-012"
  euadf_version: "4.0"
  last_validated: "2026-05-20"
  category: Architecture
  deterministic_triggers: |
    Apply this skill if ANY of the following are true:
    - A pipeline is writing output files (PDFs, EXEs, DOCXs) to the source directory
    - .gitignore contains extension-based patterns like assets/*.exe or assets/*.pdf
    - Untracked binary or generated files appear in git status inside assets/
    - A new pipeline output format is being added and no output directory exists
    - git status shows large binary files as untracked in a source directory
---

## Key Principles

**Source directory (`assets/`):** Contains ONLY tracked source files — `.md`, `.py`, `.json`, `.html` input files. Nothing else.

**Output directory (`dist/`):** Contains ALL pipeline-generated files — redacted intermediates, PDFs, EXEs, DOCXs, XLSXs. Gitignored entirely.

**The correct `.gitignore` pattern:**
```
# EfficientDAM — dist folder (all pipeline outputs)
dist/*
!dist/.gitkeep
```

**The gitignore test:** If a `.gitignore` pattern describes a file type (`assets/*.exe`), it is a band-aid for a design problem. The real fix is a separate output directory.

**Force-add `.gitkeep` — this will catch you out:**

The `dist/*` pattern ignores ALL files in `dist/`, including `.gitkeep`. A normal `git add dist/.gitkeep` silently does nothing — git respects the ignore rule.

```bash
# WRONG — silently does nothing
git add dist/.gitkeep

# RIGHT — force overrides the ignore rule for this one file
git add -f dist/.gitkeep
```

**When adding `DIST_DIR` to a pipeline tool:**
```python
DIST_DIR = ROOT_DIR / "dist"

def convert_asset(project_id, ady_id):
    DIST_DIR.mkdir(parents=True, exist_ok=True)  # Create if not exists on fresh clone
    ...
    output_path = DIST_DIR / f"{base_name}-v{version}{ext}"
```

**PyInstaller `--distpath` must point to `dist/`, not the source directory:**
```python
subprocess.run([
    sys.executable, "-m", "PyInstaller",
    "--onefile",
    "--distpath", str(DIST_DIR),  # NOT str(ASSETS_DIR)
    str(source_path)
])
```

## When NOT to Apply

- Projects where outputs are intentionally committed (static site generators, compiled documentation).
- Temporary working files that should stay near source (`.pyc` → use `__pycache__/`).
- Single-file scripts with no build step.

## Example

Initial EfficientDAM pipeline wrote all outputs to `assets/`. After the first staging run, `git status` showed:
- `assets/data-processor-v1.0.exe` (59MB untracked)
- `assets/sample-report-v1.0.docx` (untracked)
- `assets/sample-report-v1.0-raw-redacted.md` (untracked)

Initial band-aid response: added `assets/*-raw-redacted.*` to `.gitignore`.

The human PM asked: "Why are these converted files getting saved inside the assets folder? Should not it be such that these should be created inside a different folder?"

Proper fix:
1. Introduced `dist/` directory
2. Updated `redact.py`, `convert.py`, `master_pipeline.py` to use `DIST_DIR`
3. Updated PyInstaller `--distpath` to point to `dist/`
4. Removed 4 extension-specific gitignore entries
5. Added `dist/*` + `!dist/.gitkeep` to `.gitignore`
6. Force-added: `git add -f dist/.gitkeep`

## Gotchas

- **Patching `.gitignore` with extension-specific patterns** — the underlying design problem remains; the gitignore history reveals it.
- **Not updating `--distpath` in PyInstaller** — EXE is still written to the source directory even after `dist/` is introduced.
- **Forgetting `DIST_DIR.mkdir(parents=True, exist_ok=True)`** — the directory does not exist on a fresh clone; pipeline fails on the first run.
- **`git add dist/.gitkeep` failing silently** — MUST use `git add -f dist/.gitkeep` because `dist/*` covers it.
- **`!dist/.gitkeep` missing from `.gitignore`** — `dist/*` without the exception ignores `.gitkeep` even with `-f`; the exception is required.
