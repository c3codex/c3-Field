---
document_type: oar2_amendment
authority_level: working
document_scope: source_authority
title: OAR2 Amendment — Source Reference Extension UPSERT Guard Correction v1
status: proposed
version: v1
operator: op044
system: source_authority
source_oar2: docs/oar/measures_interoperability/oar2_amendment_source_reference_extension_upsert_correction_v1.meta.md
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
  - upsert-guard-correction
  - seeded-skip
  - append-only-trigger
  - codex-source-reference
  - measures-interoperability
source_alignment:
  - OAR2 Amendment — Source Reference Extension UPSERT Correction v1
  - OAR2 — Source Reference Existing Schema Extension Execution v1
  - OAR1 — Source Reference Existing Schema Extension v1
  - Seeded Reference Control
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 Amendment — Source Reference Extension UPSERT Guard Correction v1

## OBSERVED

Operator-mediated UPSERT execution attempted the corrected extension SQL.

Execution failed on seeded rows despite CASE-based source_status preservation.

Root cause:

The `codex_source_reference` table has an append-only trigger on seeded rows.

The trigger fires on any `UPDATE` to a seeded row **before** the CASE statement evaluates.

CASE-based preservation is insufficient — the trigger blocks the entire UPDATE operation
before the CASE can return the existing seeded value.

Affected rows: `seed_concordance`, `system_concordance` (both already seeded).

## ALIGNED

Seeded rows must not be touched by this route.

Not preserved-through-update. Not updated with CASE protection. Skipped entirely.

The correct guard is a `WHERE` predicate on the `ON CONFLICT ... DO UPDATE` clause:

    where public.codex_source_reference.source_status <> 'seeded'

When the predicate is false (existing row is seeded), PostgreSQL treats the conflict
as a no-op and leaves the row untouched. The trigger is never invoked.

Non-seeded conflicts remain subject to:
- `source_path` coalesce (preserve verified paths)
- `metadata` merge via `||` (extend, not replace)
- `aliases` conditional (apply c3 7s aliases if provided, else preserve existing)

No Codex seating is declared.

No runtime, CSS, or deprecation work is authorized.

## ROUTED

Prepare corrected SQL for operator-mediated execution.

Corrected SQL must:

1. Retain `ALTER TABLE add column if not exists aliases jsonb`.
2. Retain all 19-row VALUES clause unchanged.
3. Replace prior `ON CONFLICT` block with WHERE-guarded version:
   - Remove CASE statement for source_status.
   - Use `source_status = excluded.source_status` (only reached for non-seeded rows).
   - Retain `source_path = coalesce(...)`.
   - Retain `aliases` conditional.
   - Retain `metadata = ... || excluded.metadata`.
   - Add `where public.codex_source_reference.source_status <> 'seeded'` after closing
     the SET clause, before the semicolon.
4. Retain all 9 validation queries unchanged.
5. Update header comment to reflect guard correction.

## SEED-SKIP RULE

Seeded rows are untouched by this route.

The WHERE predicate silences the UPDATE for any row where `source_status = 'seeded'`.

The append-only trigger is never reached.

Seeded standing is preserved by absence of action, not by conditional logic.

## REQUIRED ON CONFLICT LOGIC

    on conflict (source_key) do update set
      source_type = excluded.source_type,
      authority_level = excluded.authority_level,
      source_scope = excluded.source_scope,
      version_label = excluded.version_label,
      source_status = excluded.source_status,
      source_path =
        coalesce(public.codex_source_reference.source_path, excluded.source_path),
      aliases =
        case
          when excluded.aliases != '[]'::jsonb
            then excluded.aliases
          else public.codex_source_reference.aliases
        end,
      metadata =
        public.codex_source_reference.metadata || excluded.metadata,
      updated_at = now()
    where public.codex_source_reference.source_status <> 'seeded';

## VALIDATION REQUIRED

After execution, return unchanged:

1. `aliases` column exists.
2. All 19 intended keys exist or are already present.
3. `seed_concordance` remains seeded (untouched by this route).
4. `system_concordance` remains seeded (untouched by this route).
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

This amendment succeeds when the source-reference extension executes without triggering
the append-only guard, all 19 rows are present or confirmed, seeded rows remain untouched,
and validation query output is returned.

## CLOSE

Map what is known.
Hold what is unresolved.
Verify before recognition.
Do not duplicate authority.
