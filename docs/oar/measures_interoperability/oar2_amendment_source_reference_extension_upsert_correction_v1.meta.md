---
document_type: oar2_amendment
authority_level: working
document_scope: source_authority
title: OAR2 Amendment — Source Reference Extension UPSERT Correction v1
status: proposed
version: v1
operator: op044
system: source_authority
source_oar2: docs/oar/measures_interoperability/oar2_source_reference_existing_schema_extension_execution_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - oar2-amendment
  - source-authority
  - upsert-correction
  - seeded-preservation
  - codex-source-reference
  - measures-interoperability
source_alignment:
  - OAR2 — Source Reference Existing Schema Extension Execution v1
  - OAR1 — Source Reference Existing Schema Extension v1
  - Seeded Reference Control
  - OAR Lifecycle — Execution and Handoff
  - Active Session Transfer Surface Rule
---

# OAR2 Amendment — Source Reference Extension UPSERT Correction v1

## OBSERVED

Operator-mediated SQL execution attempted the existing-schema extension.

Execution failed on duplicate `source_key`:

`seed_concordance already exists`

A follow-up diagnostic confirmed these live DB rows already exist and are already seeded:

- `seed_concordance` → `source_status = seeded`
- `system_concordance` → `source_status = seeded`

The prior executable SQL used plain `INSERT`, which is unsafe against existing source records.

The diagnostic also showed the `aliases` column does not yet exist.

## ALIGNED

This amendment corrects execution from `INSERT` to `UPSERT`.

Seeded records must not be demoted.

Existing verified `source_path` values must not be overwritten.

No Codex seating is newly declared.

No runtime, CSS, or deprecation work is authorized.

## ROUTED

Prepare corrected SQL for operator-mediated execution.

Corrected SQL must:

1. Add `aliases jsonb` if absent.
2. Use `INSERT ... ON CONFLICT (source_key) DO UPDATE`.
3. Preserve existing `source_status = seeded`.
4. Preserve existing `source_path` when already present.
5. Merge metadata instead of replacing it.
6. Apply c3 7s aliases to `source_21_of_coherence_v1`.
7. Preserve `seed_concordance` and `system_concordance` as seeded if already seeded.
8. Keep unresolved or new rows as written with `metadata.review_status = operator_required`.
9. Return validation query output after execution.

## SEED-PRESERVATION RULE

Known seeded records stay seeded.

Do not demote seeded standing.

Do not overwrite verified source_path.

Extend only what is missing.

## REQUIRED UPSERT LOGIC

The `ON CONFLICT` update must use this preservation pattern:

    source_status =
      case
        when public.codex_source_reference.source_status = 'seeded'
          then public.codex_source_reference.source_status
        else excluded.source_status
      end,

    source_path =
      coalesce(public.codex_source_reference.source_path, excluded.source_path),

    metadata =
      public.codex_source_reference.metadata || excluded.metadata

## VALIDATION REQUIRED

After execution, return:

1. `aliases` column exists.
2. All 19 intended keys exist or are already present.
3. `seed_concordance` remains seeded.
4. `system_concordance` remains seeded.
5. `source_21_of_coherence_v1` has c3 7s aliases.
6. D6–D8 remain written unless already seeded by prior verified DB state.
7. No duplicate `source_key`.
8. No unresolved row is promoted to seeded by this route.
9. No DB/runtime/CSS/deprecation work occurred outside this route.

## BOUNDARY

Operator executes exact corrected SQL block only.

No edits during paste.

Claude may write OAR1 only after returned DB validation evidence confirms execution.

## SUCCESS CONDITION

This amendment succeeds when the source-reference extension executes by UPSERT without demoting seeded rows or duplicating authority.

## CLOSE

Map what is known.
Hold what is unresolved.
Verify before recognition.
Do not duplicate authority.
