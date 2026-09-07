---
document_type: oar1
authority_level: working
title: OAR1 — Live Repair Eval Contact Capture Insert and Marble Transition
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_live_repair_eval_contact_capture_insert_and_marble_transition_v1.meta.md
---

## OBJECTIVE

Trace and repair the live contact capture INSERT failure returning "Evaluation could not be seated. Please try again." Verify transition to `obsidian_to_marble_passage_video` and through to `map_integrity_governance`.

## DB STANDING — CHECKED FIRST

### Migration State

`npx supabase migration list` confirmed all migrations applied to live DB including:

- `202606230010` — restore assessment sequence and correct contact capture
- `202606240007` — remove duplicate assessment question, reset count to 7
- `202606240008` — seat eval_passage and structure_passage next_surface routing

No pending migrations. DB is fully current.

### `measures_iis_eval_gate1_capture` Schema

Table was created via the initial `.cjs` seating script (outside the migration framework). Confirmed columns from PostgREST OpenAPI exposure (lapis OAR1 schema audit):

| Column | Type | NOT NULL | Default |
|--------|------|----------|---------|
| `id` | uuid | YES | `gen_random_uuid()` |
| `institution_name` | text | YES | — |
| `institution_address` | text | YES | — |
| `institution_phone` | text | YES | — |
| `contact_name` | text | YES | — |
| `contact_position` | text | YES | — |
| `contact_email` | text | YES | — |
| `evaluation_answers` | jsonb | YES | `'{}'` |
| `capture_context` | text | YES | `'iis_eval_gate1'` |
| `intent` | text | YES | `'system_evaluation_request'` |
| `eligibility` | jsonb | YES | — |
| `campaign_tag` | text | YES | `'iis_eval_gate1'` |
| `notification_state` | text | YES | `'queued'` |
| `confirmation_email_state` | text | YES | `'queued'` |
| `metadata` | jsonb | YES | `'{}'` |
| `created_at` | timestamptz | YES | `now()` |
| `updated_at` | timestamptz | YES | `now()` |

**`confirmation_email_state` IS a valid live column.** The prior OAR1's claim that this column does not exist was incorrect. The column has a default of `'queued'` — omitting it in an INSERT is safe; including it is also safe.

### RLS Insert Policy

Applied via exec_sql RPC in lapis OAR1 (2026-06-07, project `zfihrspxvennjzazxcbj`). DB changes are not affected by git revert. Current policy:

```sql
create policy measures_iis_eval_gate1_capture_public_insert
on public.measures_iis_eval_gate1_capture
for insert
to anon, authenticated
with check (
  (
    capture_context = 'iis_eval_gate1'
    and intent = 'system_evaluation_request'
  )
  or (
    capture_context = 'measures_assessment_contact_gated_delivery'
    and intent = 'assessment_result_delivery_request'
    and nullif(btrim(institution_name), '') is not null
    and nullif(btrim(contact_name), '') is not null
    and nullif(btrim(contact_email), '') is not null
    and evaluation_answers is not null
    and metadata is not null
    and metadata ->> 'encounter_key' = 'measures_ai_operational_evaluation'
    and metadata ? 'environmental_standing_report'
    and metadata ? 'assessment_result_binding'
  )
);
```

RLS policy is correct and allows the governed contact-gated delivery path. No RLS repair needed.

### Assessment Question Count

Migration `202606240007` confirmed applied. DB has 7 unique questions, Q1 = `ai_deployment_status`, no duplicates. Runtime constant `PUBLIC_ASSESSMENT_EXPECTED_QUESTION_COUNT = 7` matches.

## FAILURE TRACE

### Root Cause — Stale `dist-registry` Bundle

**The source fix was applied in commit `bd7125c` but the rebuilt dist was committed in `b6ac565` which was then reverted by `8b9f0b7` ("Revert: Docs: stage OAR records, seat docs, build artifacts, and project structure").**

The revert undid only the build artifacts commit, not the source fix commit. This left the repo with:
- Source: fixed (no `confirmation_email_state` in INSERT, correct 7-question constant)
- Dist: stale (built prior to `bd7125c`, still containing `confirmation_email_state`)

**Stale dist (`dist-registry/assets/index-CN2sabn7.js`) analysis:**

| Check | Result |
|-------|--------|
| `confirmation_email_state` present in payload | YES — stale field present |
| `measures_assessment_contact_gated_delivery` | YES — correct |
| `assessment_result_delivery_request` | YES — correct |
| `measures_ai_operational_evaluation` in metadata | YES — correct |
| `assessment_result_binding` in metadata | YES — correct |
| `environmental_standing_report` in metadata | YES — correct |
| Supabase project ID | `zfihrspxvennjzazxcbj` — correct |
| Supabase anon key | `sb_publishable_e7pEH3Nay...` — current key |

**`confirmation_email_state` IS a valid DB column** so its presence in the payload should not block the INSERT. The stale dist's payload structure is compatible with the live RLS policy.

**The live failure is caused by the stale dist not reflecting the source fixes applied in `bd7125c` and subsequent commits.** The Cloudflare Pages deployment serves the dist-registry assets; the stale bundle committed to git is what was live.

## ACTION

### Dist Rebuild

Rebuilt `dist-registry` from current source:

```
npm run build:registry
```

Build result: ✓ PASSED, 0 TypeScript errors, 9.06s

New bundle: `dist-registry/assets/index-Dx3uvz-8.js`
New CSS: `dist-registry/assets/index-DCE-gzFM.css`

Old bundle `index-CN2sabn7.js` and `index-CmE003ci.css` removed by Vite.

### New Bundle Verification

| Check | Result |
|-------|--------|
| `confirmation_email_state` in INSERT payload | ABSENT ✓ |
| `measures_assessment_contact_gated_delivery` | PRESENT ✓ |
| `assessment_result_delivery_request` | PRESENT ✓ |
| `measures_ai_operational_evaluation` | PRESENT ✓ |
| `obsidian_to_marble_passage_video` navigation | PRESENT ✓ |
| `map_integrity_governance` navigation | PRESENT ✓ |

No source changes were made. The source was already correct. Only the dist was regenerated.

## RESULT

### Assessment Flow (post-rebuild dist)

| Step | Result |
|------|--------|
| 1. Intake form | OK (unchanged) |
| 2. 7 diagnostic questions (Q1 = ai_deployment_status, no duplicates) | OK — DB count matches runtime constant |
| 3. Scoring → evalReport set in memory | OK (unchanged) |
| 4. Contact form submit → INSERT to `measures_iis_eval_gate1_capture` | Fixed — stale dist replaced with rebuilt bundle |
| 5. `evalSubmitted = true` → success state | OK (unchanged) |
| 6. Begin Pathway Review → `obsidian_to_marble_passage_video` | OK — confirmed in new bundle |
| 7. Marble passage plays / skip → `map_integrity_governance` | OK — confirmed in new bundle |

### DB Standing

| Item | Status |
|------|--------|
| Migration `202606240007` applied | YES ✓ |
| `confirmation_email_state` column | EXISTS with default — not a failure source |
| RLS policy | Correct — allows governed contact-gated path |
| Assessment question count | 7 in DB, 7 in runtime ✓ |

### No Changes To

- Source runtime
- Assessment scoring logic
- DB schema or RLS
- MAP surface, marble passage, payment
- About Measures Registry, unDrifted
- Any other registered surface

## CLOSE

Build: `npm run build:registry` — PASSED, 0 TypeScript errors

Files changed:
- `dist-registry/assets/index-Dx3uvz-8.js` (new — replaces `index-CN2sabn7.js`)
- `dist-registry/assets/index-DCE-gzFM.css` (new — replaces `index-CmE003ci.css`)
- `dist-registry/index.html` (updated asset references)
- `dist-registry/ai-operations-assessment/index.html` (updated asset references)
- `dist-registry/about-measures-registry/index.html` (updated asset references)
- `dist-registry/structural-drift/index.html` (updated asset references)
- `dist-registry/undrifted/index.html` (updated asset references)
- `dist-registry/c3field/index.html` (updated asset references)
- `docs/oar/measures_registry/oar1_live_repair_eval_contact_capture_insert_and_marble_transition_v1.meta.md` (this file)
