-- Obsidian Chamber Contract Seating — v1
-- Source OAR2: docs/oar/measures_registry/oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md
-- Operator executes through Supabase SQL Editor, CLI, or psql.
-- Run AFTER migration 202606080001 has been applied.
-- Claude does not claim execution of this SQL.

-- ============================================================
-- CONTRACT 1: obsidian_contact_src_capture_contract
-- ============================================================
insert into public.concordance_document (
  document_key,
  title,
  document_scope,
  authority_standing,
  visibility_standing,
  native_order,
  source_alignment,
  metadata
) values (
  'obsidian_contact_src_capture_contract',
  'Obsidian Contact/SRC Capture Contract',
  'obsidian_chamber_contract',
  'active',
  'internal',
  '10',
  '[{"key": "oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1", "type": "source_oar2"}]'::jsonb,
  '{
    "document_type": "chamber_contract",
    "authority_level": "working",
    "status": "seeded",
    "system_key": "measures_registry",
    "chamber": "obsidian",
    "contract_class": "src_capture_contract",
    "sequence_position": "contact_captured → src_opened",
    "standing_boundary": "contact_eval_continuity_opened_only",
    "not": ["SEAT", "MAP_enrollment", "Registry_Certification", "payment", "c3_Key"]
  }'::jsonb
) on conflict (document_key) do nothing;

insert into public.concordance_version (
  version_key,
  document_key,
  version_label,
  version_standing,
  visibility_standing,
  recognized_at,
  source_oar2_path,
  closeout_oar1_path,
  metadata
) values (
  'obsidian_contact_src_capture_contract_v1',
  'obsidian_contact_src_capture_contract',
  'v1',
  'active',
  'internal',
  now(),
  'docs/oar/measures_registry/oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md',
  'docs/oar/measures_registry/oar1_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md',
  '{"status": "seeded", "system_key": "measures_registry", "chamber": "obsidian"}'::jsonb
) on conflict (version_key) do nothing;

insert into public.concordance_relation (
  relation_key,
  version_key,
  source_ref,
  target_ref,
  relation_scope,
  relation_type,
  relation_label,
  relation_standing,
  visibility_standing,
  source_oar2_path,
  metadata
) values (
  'obsidian_src_capture_table_binding',
  'obsidian_contact_src_capture_contract_v1',
  'obsidian_contact_src_capture_contract_v1',
  'obsidian_src_continuity',
  'obsidian',
  'source_alignment',
  'Runtime table: obsidian_src_continuity — SRC/SRC1 continuity intake record',
  'active',
  'internal',
  'docs/oar/measures_registry/oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md',
  '{
    "contract_domain": "src_capture",
    "table": "obsidian_src_continuity",
    "standing_boundary": "contact_eval_continuity_opened_only"
  }'::jsonb
) on conflict (relation_key) do nothing;

-- ============================================================
-- CONTRACT 2: obsidian_oar1_assessment_intake_contract
-- ============================================================
insert into public.concordance_document (
  document_key,
  title,
  document_scope,
  authority_standing,
  visibility_standing,
  native_order,
  source_alignment,
  metadata
) values (
  'obsidian_oar1_assessment_intake_contract',
  'Obsidian OAR1 Assessment Intake Contract',
  'obsidian_chamber_contract',
  'active',
  'internal',
  '11',
  '[{"key": "oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1", "type": "source_oar2"}]'::jsonb,
  '{
    "document_type": "chamber_contract",
    "authority_level": "working",
    "status": "seeded",
    "system_key": "measures_registry",
    "chamber": "obsidian",
    "contract_class": "oar1_intake_contract",
    "sequence_position": "src_opened → oar1_recorded",
    "required_fields": ["assessment_completion_key", "evaluation_result_key", "src_key", "env_key", "contact_email", "email_sequence_key", "marble_carryover_key"],
    "required_body": ["objective", "action", "result"]
  }'::jsonb
) on conflict (document_key) do nothing;

insert into public.concordance_version (
  version_key,
  document_key,
  version_label,
  version_standing,
  visibility_standing,
  recognized_at,
  source_oar2_path,
  closeout_oar1_path,
  metadata
) values (
  'obsidian_oar1_assessment_intake_contract_v1',
  'obsidian_oar1_assessment_intake_contract',
  'v1',
  'active',
  'internal',
  now(),
  'docs/oar/measures_registry/oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md',
  'docs/oar/measures_registry/oar1_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md',
  '{"status": "seeded", "system_key": "measures_registry", "chamber": "obsidian"}'::jsonb
) on conflict (version_key) do nothing;

insert into public.concordance_relation (
  relation_key,
  version_key,
  source_ref,
  target_ref,
  relation_scope,
  relation_type,
  relation_label,
  relation_standing,
  visibility_standing,
  source_oar2_path,
  metadata
) values (
  'obsidian_oar1_intake_table_binding',
  'obsidian_oar1_assessment_intake_contract_v1',
  'obsidian_oar1_assessment_intake_contract_v1',
  'obsidian_oar1_record',
  'obsidian',
  'source_alignment',
  'Runtime table: obsidian_oar1_record — OAR1 intake per contact',
  'active',
  'internal',
  'docs/oar/measures_registry/oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md',
  '{
    "contract_domain": "oar1_intake",
    "table": "obsidian_oar1_record",
    "oar1_body_fields": ["objective", "action", "result"]
  }'::jsonb
) on conflict (relation_key) do nothing;

-- ============================================================
-- CONTRACT 3: obsidian_eval_result_content_contract
-- ============================================================
insert into public.concordance_document (
  document_key,
  title,
  document_scope,
  authority_standing,
  visibility_standing,
  native_order,
  source_alignment,
  metadata
) values (
  'obsidian_eval_result_content_contract',
  'Obsidian Evaluation Result Content Contract',
  'obsidian_chamber_contract',
  'active',
  'internal',
  '12',
  '[{"key": "oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1", "type": "source_oar2"}]'::jsonb,
  '{
    "document_type": "chamber_contract",
    "authority_level": "working",
    "status": "seeded",
    "system_key": "measures_registry",
    "chamber": "obsidian",
    "contract_class": "eval_result_content_contract",
    "sequence_position": "oar1_recorded → eval_result_delivered",
    "result_bands": {
      "eval_result_01": "Foundational Leadership Invitation (1-2 conditions)",
      "eval_result_02": "Environmental Fragmentation (2-4 conditions)",
      "eval_result_03": "Environmental Instability (3-5 conditions)",
      "eval_result_04": "Structural Drift (4-7 conditions)"
    },
    "severity_precedence": "highest applicable band wins",
    "approved_close": "A structured environmental alignment path has been prepared for your review.",
    "prohibited_close": ["Continue to governed pathway", "View your circuit", "Start MAP", "Buy MAP", "Begin certification", "Register now"]
  }'::jsonb
) on conflict (document_key) do nothing;

insert into public.concordance_version (
  version_key,
  document_key,
  version_label,
  version_standing,
  visibility_standing,
  recognized_at,
  source_oar2_path,
  closeout_oar1_path,
  metadata
) values (
  'obsidian_eval_result_content_contract_v1',
  'obsidian_eval_result_content_contract',
  'v1',
  'active',
  'internal',
  now(),
  'docs/oar/measures_registry/oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md',
  'docs/oar/measures_registry/oar1_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md',
  '{"status": "seeded", "system_key": "measures_registry", "chamber": "obsidian"}'::jsonb
) on conflict (version_key) do nothing;

insert into public.concordance_relation (
  relation_key,
  version_key,
  source_ref,
  target_ref,
  relation_scope,
  relation_type,
  relation_label,
  relation_standing,
  visibility_standing,
  source_oar2_path,
  metadata
) values (
  'obsidian_eval_result_def_table_binding',
  'obsidian_eval_result_content_contract_v1',
  'obsidian_eval_result_content_contract_v1',
  'obsidian_eval_result_def',
  'obsidian',
  'source_alignment',
  'Runtime table: obsidian_eval_result_def — 4 seeded result bands',
  'active',
  'internal',
  'docs/oar/measures_registry/oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md',
  '{
    "contract_domain": "eval_result_content",
    "table": "obsidian_eval_result_def",
    "seeded_keys": ["eval_result_01", "eval_result_02", "eval_result_03", "eval_result_04"],
    "matching_logic": "severity_precedence: conditions_4plus → eval_result_04, 3plus → eval_result_03, 2plus → eval_result_02, else → eval_result_01"
  }'::jsonb
) on conflict (relation_key) do nothing;

-- ============================================================
-- CONTRACT 4: obsidian_initial_eval_email_contract
-- ============================================================
insert into public.concordance_document (
  document_key,
  title,
  document_scope,
  authority_standing,
  visibility_standing,
  native_order,
  source_alignment,
  metadata
) values (
  'obsidian_initial_eval_email_contract',
  'Obsidian Initial Evaluation Email Contract',
  'obsidian_chamber_contract',
  'active',
  'internal',
  '13',
  '[{"key": "oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1", "type": "source_oar2"}]'::jsonb,
  '{
    "document_type": "chamber_contract",
    "authority_level": "working",
    "status": "seeded",
    "system_key": "measures_registry",
    "chamber": "obsidian",
    "contract_class": "initial_eval_email_contract",
    "sequence_position": "eval_result_delivered → initial_eval_email_triggered",
    "trigger": "contact_captured + evaluation_result_key_exists OR evaluation_result_delivered",
    "required_fields": ["institution_name", "contact_name", "evaluation_result_title", "summary_finding", "top_3_critical_gaps", "likely_ai_drift_behaviors", "answer_derived_explanation", "prepared_path_statement", "review_path_link_or_token", "envKey"],
    "prohibited_content": ["C1", "C2", "C3", "Direct", "Mapped", "Federated", "MAP pricing", "SEAT status", "Registry Certification", "Registered", "Redacted", "payment", "wallet", "c3 Key", "permission standing"]
  }'::jsonb
) on conflict (document_key) do nothing;

insert into public.concordance_version (
  version_key,
  document_key,
  version_label,
  version_standing,
  visibility_standing,
  recognized_at,
  source_oar2_path,
  closeout_oar1_path,
  metadata
) values (
  'obsidian_initial_eval_email_contract_v1',
  'obsidian_initial_eval_email_contract',
  'v1',
  'active',
  'internal',
  now(),
  'docs/oar/measures_registry/oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md',
  'docs/oar/measures_registry/oar1_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md',
  '{"status": "seeded", "system_key": "measures_registry", "chamber": "obsidian"}'::jsonb
) on conflict (version_key) do nothing;

insert into public.concordance_relation (
  relation_key,
  version_key,
  source_ref,
  target_ref,
  relation_scope,
  relation_type,
  relation_label,
  relation_standing,
  visibility_standing,
  source_oar2_path,
  metadata
) values (
  'obsidian_initial_email_def_binding',
  'obsidian_initial_eval_email_contract_v1',
  'obsidian_initial_eval_email_contract_v1',
  'obsidian_email_contract_def',
  'obsidian',
  'source_alignment',
  'Runtime table: obsidian_email_contract_def — initial eval email definition',
  'active',
  'internal',
  'docs/oar/measures_registry/oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md',
  '{
    "contract_domain": "initial_eval_email",
    "table": "obsidian_email_contract_def",
    "seeded_key": "obsidian_initial_eval_email",
    "email_type": "initial_eval",
    "sequence_position": 0
  }'::jsonb
) on conflict (relation_key) do nothing;

-- ============================================================
-- CONTRACT 5: obsidian_governed_followup_email_contract
-- ============================================================
insert into public.concordance_document (
  document_key,
  title,
  document_scope,
  authority_standing,
  visibility_standing,
  native_order,
  source_alignment,
  metadata
) values (
  'obsidian_governed_followup_email_contract',
  'Obsidian Governed Follow-Up Email Contract',
  'obsidian_chamber_contract',
  'active',
  'internal',
  '14',
  '[{"key": "oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1", "type": "source_oar2"}]'::jsonb,
  '{
    "document_type": "chamber_contract",
    "authority_level": "working",
    "status": "seeded",
    "system_key": "measures_registry",
    "chamber": "obsidian",
    "contract_class": "governed_followup_email_contract",
    "sequence_position": "initial_eval_email_triggered → followup_sequence_registered",
    "followup_keys": ["obsidian_eval_followup_01_structural_risk", "obsidian_eval_followup_02_alignment_path", "obsidian_eval_followup_03_review_prepared_path"],
    "reveal_boundary": "No circuit/MAP/SEAT/certification/payment/c3_Key reveal until Marble Governance passage"
  }'::jsonb
) on conflict (document_key) do nothing;

insert into public.concordance_version (
  version_key,
  document_key,
  version_label,
  version_standing,
  visibility_standing,
  recognized_at,
  source_oar2_path,
  closeout_oar1_path,
  metadata
) values (
  'obsidian_governed_followup_email_contract_v1',
  'obsidian_governed_followup_email_contract',
  'v1',
  'active',
  'internal',
  now(),
  'docs/oar/measures_registry/oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md',
  'docs/oar/measures_registry/oar1_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md',
  '{"status": "seeded", "system_key": "measures_registry", "chamber": "obsidian"}'::jsonb
) on conflict (version_key) do nothing;

insert into public.concordance_relation (
  relation_key,
  version_key,
  source_ref,
  target_ref,
  relation_scope,
  relation_type,
  relation_label,
  relation_standing,
  visibility_standing,
  source_oar2_path,
  metadata
) values
(
  'obsidian_followup_email_def_binding',
  'obsidian_governed_followup_email_contract_v1',
  'obsidian_governed_followup_email_contract_v1',
  'obsidian_email_contract_def',
  'obsidian',
  'source_alignment',
  'Runtime table: obsidian_email_contract_def — 3 governed followup definitions',
  'active',
  'internal',
  'docs/oar/measures_registry/oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md',
  '{
    "contract_domain": "governed_followup_email",
    "table": "obsidian_email_contract_def",
    "seeded_keys": ["obsidian_eval_followup_01_structural_risk", "obsidian_eval_followup_02_alignment_path", "obsidian_eval_followup_03_review_prepared_path"],
    "email_type": "followup"
  }'::jsonb
),
(
  'obsidian_followup_sequence_instance_binding',
  'obsidian_governed_followup_email_contract_v1',
  'obsidian_governed_followup_email_contract_v1',
  'obsidian_email_sequence_instance',
  'obsidian',
  'related_to',
  'Runtime table: obsidian_email_sequence_instance — per-contact sequence tracking',
  'active',
  'internal',
  'docs/oar/measures_registry/oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md',
  '{
    "contract_domain": "governed_followup_email",
    "table": "obsidian_email_sequence_instance"
  }'::jsonb
)
on conflict (relation_key) do nothing;

-- ============================================================
-- CONTRACT 6: obsidian_marble_governance_carryover_contract
-- ============================================================
insert into public.concordance_document (
  document_key,
  title,
  document_scope,
  authority_standing,
  visibility_standing,
  native_order,
  source_alignment,
  metadata
) values (
  'obsidian_marble_governance_carryover_contract',
  'Obsidian Marble Governance Carryover Contract',
  'obsidian_chamber_contract',
  'active',
  'internal',
  '15',
  '[{"key": "oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1", "type": "source_oar2"}]'::jsonb,
  '{
    "document_type": "chamber_contract",
    "authority_level": "working",
    "status": "seeded",
    "system_key": "measures_registry",
    "chamber": "obsidian",
    "contract_class": "marble_governance_carryover_contract",
    "sequence_position": "followup_sequence_registered → marble_carryover_prepared",
    "reveal_condition": {
      "marble_governance_passage_entered": true,
      "evaluation_result_key_exists": true,
      "src_key_exists": true,
      "oar1_key_exists": true,
      "hidden_marble_payload_key_exists": true
    },
    "default_state": "held_until_marble_governance_passage",
    "obsidian_boundary": "Obsidian prepares the Marble payload. Marble Governance Chamber reveals only after valid passage."
  }'::jsonb
) on conflict (document_key) do nothing;

insert into public.concordance_version (
  version_key,
  document_key,
  version_label,
  version_standing,
  visibility_standing,
  recognized_at,
  source_oar2_path,
  closeout_oar1_path,
  metadata
) values (
  'obsidian_marble_governance_carryover_contract_v1',
  'obsidian_marble_governance_carryover_contract',
  'v1',
  'active',
  'internal',
  now(),
  'docs/oar/measures_registry/oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md',
  'docs/oar/measures_registry/oar1_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md',
  '{"status": "seeded", "system_key": "measures_registry", "chamber": "obsidian"}'::jsonb
) on conflict (version_key) do nothing;

insert into public.concordance_relation (
  relation_key,
  version_key,
  source_ref,
  target_ref,
  relation_scope,
  relation_type,
  relation_label,
  relation_standing,
  visibility_standing,
  source_oar2_path,
  metadata
) values
(
  'obsidian_marble_carryover_table_binding',
  'obsidian_marble_governance_carryover_contract_v1',
  'obsidian_marble_governance_carryover_contract_v1',
  'obsidian_marble_carryover',
  'obsidian',
  'source_alignment',
  'Runtime table: obsidian_marble_carryover — per-contact carryover payload held until passage',
  'active',
  'internal',
  'docs/oar/measures_registry/oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md',
  '{
    "contract_domain": "marble_governance_carryover",
    "table": "obsidian_marble_carryover",
    "default_commerce_reveal_state": "held_until_marble_governance_passage",
    "reveal_gate": "marble_governance_passage_entered = true"
  }'::jsonb
),
(
  'obsidian_to_marble_chamber_boundary',
  'obsidian_marble_governance_carryover_contract_v1',
  'obsidian_marble_governance_carryover_contract_v1',
  'marble_governance_chamber',
  'obsidian',
  'related_to',
  'Marble Governance Chamber receives carryover payload and governs reveal after passage',
  'active',
  'internal',
  'docs/oar/measures_registry/oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md',
  '{
    "contract_domain": "marble_governance_carryover",
    "boundary": "Obsidian prepares payload. Marble reveals only after passage. Assessment ≠ MAP. MAP ≠ SEAT. Payment ≠ Permission."
  }'::jsonb
)
on conflict (relation_key) do nothing;

-- ============================================================
-- seeded_source_snapshot — OAR2 source document
-- ============================================================
insert into public.seeded_source_snapshot (
  snapshot_key,
  version_key,
  snapshot_type,
  local_source_path,
  source_sha256,
  byte_size,
  verification_standing,
  visibility_standing,
  verified_at,
  source_oar2_path,
  closeout_oar1_path,
  metadata
) values (
  'obsidian_contracts_oar2_source_v1',
  'obsidian_contact_src_capture_contract_v1',
  'local_source',
  'docs/oar/measures_registry/oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md',
  'operator_verified',
  0,
  'operator_pending',
  'internal',
  now(),
  'docs/oar/measures_registry/oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md',
  'docs/oar/measures_registry/oar1_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md',
  '{"snapshot_note": "OAR2 source document — operator to verify SHA and byte_size after execution"}'::jsonb
) on conflict (snapshot_key) do nothing;
