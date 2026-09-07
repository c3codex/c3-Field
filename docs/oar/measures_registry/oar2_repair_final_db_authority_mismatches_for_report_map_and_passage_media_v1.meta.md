---
document_type: oar2
authority_level: launch_repair
document_scope: final_db_authority_mismatch_repair
title: OAR2 - Repair Final DB Authority Mismatches for Report MAP and Passage Media
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: docs/oar/measures_registry/oar1_live_db_authority_audit_for_assessment_passage_report_map_v1.meta.md
---

# OAR2 - Repair Final DB Authority Mismatches for Report MAP and Passage Media

## PURPOSE

Repair the two confirmed live DB authority mismatches blocking the public encounter.

This is a focused repair.

Nothing is invented.

## CONFIRMED ROOT CAUSES

### Primary mismatch

`assessment_interpretation.scoring_thresholds[*].standing_key` emits old standing keys.

Approved report templates and MAP cards expect:

- eval_result_01
- eval_result_02
- eval_result_03
- eval_result_04

Because of this mismatch:

- approved report copy does not render
- MAP applicable_standing_keys do not match
- MAP continuation/pathway cannot resolve correctly

### Secondary mismatch

Two media rows exist for:

- before_the_pathway_obsidian_to_marble_passage_video

One row contains stale metadata.public_url without the required filename prefix.

Renderer reads:

public_url before exact_url_seated

Therefore stale public_url may override the corrected media URL.

## REQUIRED REPAIR 1 — ALIGN SCORING STANDING KEYS

Update live DB metadata:

Table:

public.measures_encounter_def

Row:

encounter_key = 'measures_assessment'

Path:

metadata.assessment_interpretation.scoring_thresholds

Approved mapping:

- structured_ai_environment_confirmed -> eval_result_01
- early_structural_drift -> eval_result_01
- active_structural_drift -> eval_result_02
- system_integrity_risk -> eval_result_03

Do not force eval_result_04 unless a distinct high-exposure threshold already exists.

Keep eval_result_04 report template seated for future high-exposure standing.

Do not change:

- min/max score thresholds
- scoring logic
- condition tag scoring
- assessment questions
- report template copy
- MAP card copy
- MAP pricing
- Stripe behavior

## REQUIRED REPAIR 2 — CORRECT PASSAGE MEDIA URL

Update live DB media row:

Table:

public.measures_media_map

Where:

registry_key = 'measures_registry'
AND media_role = 'before_the_pathway_obsidian_to_marble_passage_video'

Correct:

metadata.public_url

from:

https://media.c3field.online/before_the_pathway_obsidian_to_marble_passage_v1.mp4

to:

https://media.c3field.online/1before_the_pathway_obsidian_to_marble_passage_v1.mp4

Also preserve or set:

metadata.exact_url_seated =
https://media.c3field.online/1before_the_pathway_obsidian_to_marble_passage_v1.mp4

Do not delete duplicate rows in this OAR unless deletion is explicitly proven safe.

Preferred behavior is deterministic URL alignment, not row deletion.

## REQUIRED REPAIR 3 — HARDEN MEDIA SELECTION IF SAFE

If low-risk, update media composition ordering so encounter-specific media wins over registry-wide media when duplicate media_role exists.

Preferred priority:

1. exact encounter_key match
2. exact registry_key match
3. active row
4. highest specificity

If this is not low-risk, return HOLD and only apply DB URL correction.

Do not alter approved media asset.

## VALIDATION

Return OAR1 evidence showing:

1. scoring_thresholds standing_key values updated.
2. report template lookup resolves for produced standing keys.
3. MAP pathway applicable_standing_keys match produced standing keys.
4. eval_result_04 remains seated but not forced.
5. stale media public_url corrected.
6. exact_url_seated preserved or corrected.
7. passage media resolves to approved asset.
8. no score thresholds changed.
9. no scoring logic changed.
10. no assessment questions changed.
11. no report copy changed.
12. no MAP pricing changed.
13. no Stripe behavior changed.
14. build/migration validation passes.
15. browser QA confirms:
    - approved report copy renders
    - CTA says MAP the Environment
    - MAP continuation works
    - passage video renders
    - payment path still reaches Stripe if configured

## FINAL DISPOSITION

Return one:

- FINAL_DB_AUTHORITY_REPAIR_COMPLETE
- FINAL_DB_AUTHORITY_REPAIR_HOLD
- FINAL_DB_AUTHORITY_REPAIR_FAIL

## NOTCHAZZ FLAGS

Raise NotChazz if:

- score thresholds are changed
- scoring logic is changed
- eval_result_04 is forced without threshold authority
- report copy is invented or changed
- MAP pricing changes
- Stripe behavior changes
- media is replaced with unapproved asset
- duplicate rows are deleted without proof
- frontend authority is added instead of DB authority repair
- operator is governed instead of the work body

## CLOSE

Align scoring standing keys.

Correct passage media URL.

Then rerun full browser QA.

The system aligns.
