---
document_type: oar2
authority_level: launch_repair
document_scope: live_db_authority_audit
title: OAR2 - Live DB Authority Audit for Assessment Passage Report MAP
status: closed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Live DB Authority Audit for Assessment Passage Report MAP

## PURPOSE

Audit live production DB authority for the assessment → contact → passage → report → MAP flow.

Production build is current. Deployment URL and custom domain show same behavior. Cache/custom-domain mismatch ruled out.

Do not repair until live DB values are queried.

## REQUIRED LIVE DB QUERIES

Query the same Supabase project used by production.

Do not rely only on migration list.

### 1. measures_assessment encounter def

Return full relevant metadata for:

public.measures_encounter_def
WHERE encounter_key IN (
  'measures_assessment',
  'obsidian_to_marble_passage_video',
  'map_integrity_governance',
  'ai_isnt_broken_intro'
)

For measures_assessment return:

- assessment_mechanics.questions[0]
- assessment_evaluation_report_contract_v1.report_header
- assessment_evaluation_report_contract_v1.report_templates
- assessment_evaluation_report_contract_v1.report_cta
- assessment_evaluation_report_contract_v1.recommendation
- assessment_evaluation_report_contract_v1.informational_notice
- assessment_evaluation_report_contract_v1.condition_indicator_map
- assessment_evaluation_report_contract_v1.environmental_indicator_map
- assessment_interpretation
- footer_contract if present

### 2. transition authority

Return current transition nodes from root metadata:

- intro_hook.left.next_surface
- intro_hook.right.next_surface
- path_choice.left.next_surface
- path_choice.right.next_surface
- measures_assessment.next_surface
- obsidian_to_marble_passage_video.next_surface

### 3. surface assignments

Return rows from:

public.measures_encounter_surface_assignment

for:

- measures_assessment
- obsidian_to_marble_passage_video
- map_integrity_governance
- ai_isnt_broken_intro
- crystal_seat_orientation_passage

Include:

- registry_key
- encounter_key
- chamber_assignment
- renderer_key
- release_state
- access_level

### 4. media row

Return row from:

public.measures_media_map

WHERE media_role = 'before_the_pathway_obsidian_to_marble_passage_video'

Include:

- registry_key
- encounter_key
- media_role
- storage_bucket
- storage_path
- metadata
- is_active

### 5. active renderer expectation

Compare live DB values against current renderer expectations:

- ObsidianChamberRenderer expects media_role:
  before_the_pathway_obsidian_to_marble_passage_video

- PublicAssessmentResult expects report templates at:
  assessment_evaluation_report_contract_v1.report_templates[standing_key]

- passage report branch expects sessionStorage key:
  __mreg_pending_report

- MAP expects standing_key from pending report

Return any mismatches.

## ROOT CAUSE CLASSIFICATION

Return one:

- LIVE_DB_MISSING_REPORT_TEMPLATES
- LIVE_DB_TRANSITION_MISMATCH
- LIVE_DB_MEDIA_ROW_MISMATCH
- SURFACE_ASSIGNMENT_MISMATCH
- RENDERER_DB_KEY_MISMATCH
- SESSION_STORAGE_ONLY
- AUDIT_INCONCLUSIVE

## NO MUTATION RULE

No source changes.

No migrations.

No repairs.

This is live DB authority audit only.

## NOTCHAZZ FLAGS

Raise NotChazz if:

- migration list is treated as proof of live row values
- repair is applied before query evidence
- local DB is treated as production DB
- renderer expectations are not compared to live DB keys
- operator is governed instead of the work body

## CLOSE

Find exact live DB mismatch before another repair.
