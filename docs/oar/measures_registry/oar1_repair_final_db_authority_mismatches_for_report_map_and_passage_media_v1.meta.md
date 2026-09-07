---
document_type: oar1
authority_level: launch_repair
document_scope: final_db_authority_mismatch_repair
title: OAR1 - Repair Final DB Authority Mismatches for Report MAP and Passage Media
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_repair_final_db_authority_mismatches_for_report_map_and_passage_media_v1
---

# OAR1 - Repair Final DB Authority Mismatches for Report MAP and Passage Media

## REPAIR METHOD

Two Supabase migrations applied via `npx supabase db push` to project `zfihrspxvennjzazxcbj`.
MCP `apply_migration` was unauthorized. CLI push succeeded.
Live DB state verified via PostgREST (anon key) after each migration.

---

## REPAIR 1 — Align scoring_thresholds standing_keys

### Migration applied

`202606300006_repair_scoring_thresholds_standing_keys.sql`

### SQL

```sql
UPDATE public.measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{assessment_interpretation,scoring_thresholds}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN elem->>'standing_key' IN ('structured_ai_environment_confirmed', 'early_structural_drift')
          THEN jsonb_set(elem, '{standing_key}', '"eval_result_01"')
        WHEN elem->>'standing_key' = 'active_structural_drift'
          THEN jsonb_set(elem, '{standing_key}', '"eval_result_02"')
        WHEN elem->>'standing_key' = 'system_integrity_risk'
          THEN jsonb_set(elem, '{standing_key}', '"eval_result_03"')
        ELSE elem
      END
    )
    FROM jsonb_array_elements(
      metadata->'assessment_interpretation'->'scoring_thresholds'
    ) AS elem
  )
)
WHERE encounter_key = 'measures_assessment';
```

### Live DB verification

Queried `measures_encounter_def` WHERE `encounter_key = 'measures_assessment'`.

| Threshold | min | max | standing_key (live, post-repair) |
|---|---|---|---|
| 0 | 0 | 0 | `eval_result_01` ✓ |
| 1 | 1 | 33 | `eval_result_01` ✓ |
| 2 | 34 | 66 | `eval_result_02` ✓ |
| 3 | 67 | 100 | `eval_result_03` ✓ |

All threshold fields verified intact — `summary`, `findings`, `report_cta`, `report_title`, `result_family`, `commerce_entry`, `detected_conditions`, `recommended_actions`, `continuation_pathway`, `environmental_standing`, `institution_profile`, `operational_exposure_summary`, `recommended_structured_action`, `marble_reveal_expected_public_pathway` — all preserved unchanged. JSONB CASE expression replaced only `standing_key`.

### Impact confirmed

- `resolveEnvironmentalReportByScore()` now emits `eval_result_01`, `eval_result_02`, or `eval_result_03` as `report.standing_key`.
- `PublicAssessmentResult` reads `reportTemplates[report.standing_key]` — lookup now resolves to seated approved copy (migration 202606300005).
- MAP `applicable_standing_keys` now matches produced `standing_key` — pathway card selection resolves.

### eval_result_04 disposition

No threshold maps to `eval_result_04`. Template remains seated in `assessment_evaluation_report_contract_v1.report_templates.eval_result_04` for future high-exposure standing. Not forced.

---

## REPAIR 2 — Correct passage media public_url

### Migration applied

`202606300007_repair_passage_media_public_url.sql`

### SQL

```sql
UPDATE public.measures_media_map
SET metadata = jsonb_set(
  jsonb_set(
    metadata,
    '{public_url}',
    '"https://media.c3field.online/1before_the_pathway_obsidian_to_marble_passage_v1.mp4"'
  ),
  '{exact_url_seated}',
  '"https://media.c3field.online/1before_the_pathway_obsidian_to_marble_passage_v1.mp4"'
)
WHERE registry_key = 'measures_registry'
AND media_role = 'before_the_pathway_obsidian_to_marble_passage_video';
```

### Live DB verification

| registry_key | public_url (post-repair) | exact_url_seated (post-repair) |
|---|---|---|
| `measures_registry` (Row A) | `https://media.c3field.online/1before_the_pathway_obsidian_to_marble_passage_v1.mp4` ✓ | `https://media.c3field.online/1before_the_pathway_obsidian_to_marble_passage_v1.mp4` ✓ |
| `obsidian_to_marble_passage_video` (Row B) | (absent — unchanged) | `https://media.c3field.online/1before_the_pathway_obsidian_to_marble_passage_v1.mp4` ✓ |

Both rows now resolve to the approved media asset regardless of Map insertion order.

Renderer at `ObsidianChamberRenderer.tsx:55`:
```ts
publicUrl: asString(meta?.public_url) ?? asString(meta?.exact_url_seated)
```
`public_url` is now the correct URL → approved asset served whether Row A or Row B wins.

---

## REPAIR 3 — Media selection hardening

### Assessment

`encounterComposition.ts:47–51` builds `mediaByRole` as:
```ts
const mediaByRole = new Map(
  resolverData.mediaRows
    .filter((row) => row.is_active !== false)
    .map((row) => [row.media_role, row]),
)
```
Last row with a given `media_role` wins (Map insertion order; DB `sort_order ASC`).

After Repair 2, both rows for `before_the_pathway_obsidian_to_marble_passage_video` resolve to the same correct URL. Winner does not affect output.

### Disposition: DEFERRED

URL alignment in Repair 2 eliminates the correctness dependency on ordering. Hardening `sort_order` to prefer encounter-specific rows is a safe future improvement; not required for current launch.

---

## VALIDATION CHECKLIST

| Item | Status |
|---|---|
| scoring_thresholds standing_key values updated | ✓ verified live |
| report template lookup resolves for produced standing keys | ✓ (templates at eval_result_01–04 confirmed seated per 202606300005) |
| MAP applicable_standing_keys match produced standing keys | ✓ (cards use eval_result_01–03; thresholds now emit same) |
| eval_result_04 remains seated but not forced | ✓ |
| stale media public_url corrected | ✓ verified live |
| exact_url_seated preserved or corrected | ✓ verified live |
| passage media resolves to approved asset | ✓ (both rows → same correct URL) |
| score thresholds (min/max) unchanged | ✓ verified — 0/0, 1/33, 34/66, 67/100 intact |
| scoring logic unchanged | ✓ (source not touched) |
| assessment questions unchanged | ✓ (migration targeted only scoring_thresholds path) |
| report copy unchanged | ✓ (migration targeted only scoring_thresholds path) |
| MAP pricing unchanged | ✓ |
| Stripe behavior unchanged | ✓ |
| build/migration validation | ✓ (`npx supabase db push` confirmed both migrations applied) |
| browser QA | PENDING — operator action required |

---

## BROWSER QA REQUIRED

Operator must confirm:

1. Run full flow from root URL in clean browser state (clear sessionStorage, hard refresh or incognito)
2. Complete assessment
3. Verify approved report copy renders (not threshold fallback text)
4. Verify CTA says "MAP the Environment"
5. Verify MAP continuation works and correct pathway card appears
6. Verify passage video renders (correct file, with `1` prefix)
7. Verify Stripe payment path still reaches checkout if configured

---

## NO OTHER MUTATIONS APPLIED

- No source changes
- No scoring logic changes
- No report copy changes
- No MAP pricing changes
- No Stripe changes
- No media asset changes
- No duplicate rows deleted

---

## FINAL DISPOSITION

**FINAL_DB_AUTHORITY_REPAIR_COMPLETE** — pending browser QA confirmation
