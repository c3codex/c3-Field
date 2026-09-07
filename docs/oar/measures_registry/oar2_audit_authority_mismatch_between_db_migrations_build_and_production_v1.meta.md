---
document_type: oar2
authority_level: launch_repair
document_scope: authority_mismatch_audit
title: OAR2 - Audit Authority Mismatch Between DB Migrations Build and Production
status: closed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Audit Authority Mismatch Between DB Migrations Build and Production

## PURPOSE

Audit why completed OAR repairs are not appearing in production.

Do not apply new repairs until authority mismatch is identified.

Nothing is invented.

## OBSERVED

Operator browser QA after latest push shows:

- wrong assessment results still render
- no continuation to MAP the Environment
- passage media changes have not taken hold
- prior report/passage/MAP repairs do not appear active
- footer/runtime cleanup changes may have deployed, but encounter authority remains misplaced

This indicates possible mismatch among:

- DB migrations
- production Supabase project
- Cloudflare build
- cached frontend bundle
- active branch/commit
- active data source
- active renderer path
- sessionStorage stale report payload
- transition authority

## REQUIRED AUDIT

### 1. Production commit audit

Identify:

- current local commit
- pushed commit
- Cloudflare deployed commit
- build timestamp
- branch deployed
- whether latest deployment includes latest source changes

Return exact commit hashes.

### 2. Supabase project audit

Verify production frontend is connected to the intended Supabase project.

Check:

- VITE_SUPABASE_URL used in Cloudflare production build
- Supabase project URL expected by local env
- whether migrations were applied to the same project production uses

Do not print secret values.

### 3. Migration application audit

Confirm production DB contains these migrations/effects:

- 202606300001 passage media row
- 202606300002 report informational notice and indicators
- 202606300003 Question 1 rewrite
- 202606300004 passage exact_url/footer/scroll-related DB changes
- 202606300005 approved report templates

For each, query live DB state and return:

- present / missing
- table
- key
- expected value
- actual value

### 4. Active encounter def audit

Query live DB for `measures_assessment` metadata:

- assessment_mechanics.questions[0]
- assessment_evaluation_report_contract_v1.report_header
- assessment_evaluation_report_contract_v1.report_templates
- assessment_evaluation_report_contract_v1.report_cta
- assessment_evaluation_report_contract_v1.recommendation
- assessment_evaluation_report_contract_v1.condition_indicator_map
- assessment_evaluation_report_contract_v1.environmental_indicator_map
- assessment_interpretation.scoring_thresholds
- assessment_interpretation.finding_map

Return whether approved copy is actually present.

### 5. Active transition audit

Query live DB for transition authority:

- measures_assessment.next_surface
- obsidian_to_marble_passage_video.next_surface
- intro_hook.left.next_surface
- intro_hook.right.next_surface
- path_choice.left.next_surface
- path_choice.right.next_surface

Return expected vs actual.

### 6. Passage media audit

Query live DB and production URL for:

- media_role = before_the_pathway_obsidian_to_marble_passage_video
- registry_key
- encounter_key
- storage_bucket
- storage_path
- metadata.exact_url_seated
- is_active

Verify URL returns reachable video.

### 7. Active renderer audit

Verify production bundle is using:

- MeasuresRegistryOrchestrator
- EncounterEntry
- EncounterBoundary
- ChamberRouter
- ObsidianToMarblePassage report-after-passage branch
- PublicAssessmentResult approved template read path

Confirm `MeasuresRegistryRuntimeRegistered` is not active route authority.

### 8. Session storage audit

Wrong assessment report may persist if old `__mreg_pending_report` is stored.

Add QA instruction:

- clear sessionStorage/localStorage
- hard refresh
- rerun assessment
- verify whether issue persists

Return whether stale browser state was contributing.

### 9. Cache audit

Check Cloudflare/browser caching:

- hard refresh result
- incognito result
- cache-bypass query result
- deployment cache purge if needed

Do not claim fixed until browser confirms.

## NO MUTATION RULE

Do not repair during this OAR unless the cause is purely stale browser/session cache.

If DB/prod mismatch is found, return exact recommended repair OAR.

If Cloudflare build mismatch is found, return exact deployment action.

If wrong Supabase project is found, stop and return HOLD.

## VALIDATION OUTPUT

Return OAR1 evidence with:

- production commit
- Cloudflare deployed commit
- Supabase production project match
- migration/effect inventory
- live encounter metadata inventory
- live transition inventory
- live media row inventory
- renderer authority inventory
- session/cache result
- root cause classification

## FINAL DISPOSITION

Return one:

- AUTHORITY_MISMATCH_IDENTIFIED
- PRODUCTION_CACHE_STALE
- WRONG_SUPABASE_PROJECT
- DEPLOYMENT_COMMIT_STALE
- MIGRATIONS_NOT_APPLIED
- RENDERER_AUTHORITY_DRIFT
- AUDIT_INCONCLUSIVE

## NOTCHAZZ FLAGS

Raise NotChazz if:

- repairs continue without audit
- migration success is assumed without live query
- local DB is treated as production DB
- deployed commit is assumed without Cloudflare evidence
- stale sessionStorage is ignored
- registered_runtime is claimed inactive without bundle/import evidence
- operator is governed instead of the work body

## CLOSE

Audit authority mismatch.

Find where standing is misplaced before further repair.
