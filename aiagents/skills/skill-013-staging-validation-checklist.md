---
name: skill-013-staging-validation-checklist
description: >
  The ordered, non-negotiable checklist for validating a feature or version
  branch on develop before promoting to main. Staging validation exists
  because unit tests prove code correctness in isolation but cannot prove
  the environment is configured correctly, credentials are working, R2
  uploads are visible, or the pipeline produces correct output on real
  assets. Every item on this checklist caught a real issue in EfficientDAM
  v2.0 staging that all 82 unit tests missed. Use this skill before any
  develop to main promotion, when the TL asks "can I merge to main?" or
  "is staging complete?", or when the pipeline is being run on develop for
  the first time after a merge. Do not skip steps because unit tests passed
  — unit tests and staging validation catch completely different classes
  of failure.
license: Proprietary — Efficient Corporates Internal Use Only
metadata:
  skill_id: "SKILL-013"
  euadf_version: "4.0"
  last_validated: "2026-05-20"
  category: Deployment
  deterministic_triggers: |
    Apply this skill if ANY of the following are true:
    - The TL asks "can I merge to main?" or "is staging complete?"
    - A develop → main promotion is being prepared
    - The pipeline is being run on develop for the first time after a feature branch merge
    - A full end-to-end pipeline run is being initiated
---

## Staged Validation Checklist

**Step 1 — Environment setup:**
```powershell
# Activate venv
.\venv\Scripts\Activate.ps1

# Verify pip packages
python -c "import boto3, openpyxl, python_dotenv; print('pip packages OK')"

# Verify system tools
pandoc --version
pyinstaller --version
```
If any of these fail, resolve with SKILL-011 before continuing.

**Step 2 — Verify `.env` is present with real credentials (not PLACEHOLDER):**
```powershell
# Check .env exists
Test-Path .env

# Check it does NOT contain PLACEHOLDER values
Select-String "PLACEHOLDER" .env  # Should return nothing
```

**Step 3 — Full test suite:**
```bash
pytest tests/ -v
# Expected: all tests pass, zero failures
```

**Step 4 — Dry run:**
```bash
python tools/master_pipeline.py --project ec-prj-001 --dry-run
# Expected: no HC-XX errors; all assets appear; any SC gates reviewed and documented
```

**Step 5 — Full pipeline run:**
```bash
python tools/master_pipeline.py --project ec-prj-001
# Expected: no ERROR or FAILED lines in terminal output
```

**Step 6 — Verify no export files in `assets/`:**
```bash
pytest tests/integration/test_e2e.py::test_no_export_files_written_to_assets_dir -v
```

**Step 7 — Verify R2 uploads in Cloudflare dashboard:**
- Log in to Cloudflare → R2 → EfficientDAM bucket
- Confirm new objects appear under the `ec-prj-001/` prefix
- Open one signed URL and confirm the file is accessible

**Step 8 — Verify registries:**
- Open `registry/nonbinary-assets.md` — all ADY IDs present, correct row count
- Open `registry/binary-assets.md` — all AST IDs present with upload timestamps
- Open `registry/asset-mapping.md` — ADY↔AST relationships complete

**Step 9 — Inspect one redacted file in `dist/`:**
- Open a `*-raw-redacted.*` file — confirm PII UUID tokens replaced, sensitive fields masked

**Step 10 — Review pipeline run report:**
- Open latest file in `pipeline-runs/` — no error entries, sensible duration per asset

**Step 11 — Human TL sign-off:**
All 10 steps confirmed → Human TL approves → `develop` → `main` promotion proceeds.

## When NOT to Apply

- Routine commits during active development — only for `develop` → `main` promotions.
- Hotfixes with minimal validation per emergency protocol.

## Example

Staging validation for EfficientDAM v2.0 found **6 issues** that 82 unit tests did not catch:

| Issue | Root Cause | Skill |
|-------|-----------|-------|
| Pandoc not found on PATH | PowerShell PATH not refreshed after winget install | SKILL-011 |
| HC-08 (no boto3) after PATH refresh | venv not reactivated after PATH refresh | SKILL-011 |
| SC-03 firing on every run | Alert fatigue — ABORT was never correct | SKILL-009 |
| EXE and DOCX in `assets/` | Pipeline writing outputs to source directory | SKILL-012 |
| `invalid_name.md` failing HC-05 | Underscore in filename violates kebab-case rule | SKILL-001 |
| `test_hc03_fail` broke after SC-03 removal | Positional `side_effect` list had wrong count | SKILL-008 |

None of these would have been caught by unit tests alone. All were found and fixed before `main` promotion.

## Gotchas

- **Merging to `main` as soon as unit tests pass** — staging catches environment and integration failures that tests cannot.
- **Not verifying R2 uploads manually** — pipeline logs "UPLOAD: success" but objects may be in the wrong prefix or inaccessible.
- **Running the pipeline without real `.env`** — conversions succeed but no R2 uploads happen; success is silently incomplete.
- **Not checking the pipeline run report** — it surfaces per-asset errors not visible in the console output.
- **Skipping Step 1** — HC-08 fires mid-run after partially processing assets; environment must be verified first.
