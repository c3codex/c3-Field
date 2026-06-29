-- Register nine roles and role_call standing before FREE repair.
-- OAR2: docs/oar/measures_registry/oar2_register_nine_roles_and_role_call_standing_before_free_repair_v1.meta.md
--
-- Seats in measures_registry_root.metadata:
--   role_call_standing      — authorization rules: chambers assemble, roles authorize
--   native_role_registry    — nine roles across three material families (3x3)
--   contract_term_restriction — contract reserved for smart_contract only
--   legacy_implementation_field_mapping — five legacy fields classified, not renamed
--
-- No new tables. No frontend mutation. No FREE repair. No styling mutation.
-- No role names invented beyond the nine defined in the OAR.

-- ============================================================
-- Seat role_call standing and native role registry
-- in measures_registry_root
-- ============================================================

UPDATE measures_registry
SET metadata = metadata || jsonb_build_object(

  'role_call_standing', jsonb_build_object(
    'rule', 'chambers_assemble_roles_authorize',
    'chamber_rule', 'A chamber assembles. A chamber does not own the roles it calls. A chamber may not invent a role. A chamber may not bypass role_call when the encounter requires role authorization.',
    'role_call_rule', 'A role_call is the act of bringing a role into encounter. role_call determines what passages may occur, what agreements may be encountered, what resolutions may be carried, what media may be revealed, what transitions may be authorized, what copy may be public, what submission may be recorded, what completion state may be reached.',
    'absence_consequence', jsonb_build_object(
      'copy',       'may fall back',
      'transitions','may drift',
      'passages',   'may disappear',
      'media',      'may lose context',
      'encounters', 'may render without authority'
    ),
    'required_order', jsonb_build_array(
      'EncounterBoundary',
      'role_call',
      'Chamber assembles',
      'Role authorizes',
      'Passage moves',
      'Renderer manifests',
      'Optics proves'
    ),
    'chamber_callable_families', jsonb_build_array('obsidian', 'lapis', 'marble'),
    'source_oar2', 'docs/oar/measures_registry/oar2_register_nine_roles_and_role_call_standing_before_free_repair_v1.meta.md'
  ),

  'native_role_registry', jsonb_build_object(
    'total_roles',       9,
    'material_families', jsonb_build_array('obsidian', 'lapis', 'marble'),
    'roles_per_family',  3,
    'roles', jsonb_build_object(

      'obsidian', jsonb_build_array(
        jsonb_build_object(
          'role_key',       'obsidian_gatekeeper',
          'role_name',      'Obsidian Gatekeeper',
          'material_family','obsidian',
          'authority',      jsonb_build_array('constraints', 'eligibility', 'safe entry', 'gate conditions'),
          'function',       'Authorizes whether an encounter may enter, continue, or remain held.'
        ),
        jsonb_build_object(
          'role_key',       'obsidian_examiner',
          'role_name',      'Obsidian Examiner',
          'material_family','obsidian',
          'authority',      jsonb_build_array('assessment', 'evaluation', 'condition tracing', 'exposure detection'),
          'function',       'Authorizes assessment mechanics and evaluation passage.'
        ),
        jsonb_build_object(
          'role_key',       'obsidian_witness',
          'role_name',      'Obsidian Witness',
          'material_family','obsidian',
          'authority',      jsonb_build_array('recorded encounter evidence', 'boundary acknowledgment', 'submission standing', 'trace preservation'),
          'function',       'Authorizes what is recorded as encounter evidence.'
        )
      ),

      'lapis', jsonb_build_array(
        jsonb_build_object(
          'role_key',       'lapis_guide',
          'role_name',      'Lapis Guide',
          'material_family','lapis',
          'authority',      jsonb_build_array('relational passage', 'orientation', 'human-touch movement', 'participant-facing guidance'),
          'function',       'Authorizes guided movement between encounter states.'
        ),
        jsonb_build_object(
          'role_key',       'lapis_scribe',
          'role_name',      'Lapis Scribe',
          'material_family','lapis',
          'authority',      jsonb_build_array('visible language', 'publication copy', 'dispatch language', 'public wording'),
          'function',       'Authorizes copy, text, publication surfaces, and dispatch language.'
        ),
        jsonb_build_object(
          'role_key',       'lapis_steward',
          'role_name',      'Lapis Steward',
          'material_family','lapis',
          'authority',      jsonb_build_array('integration handling', 'contact capture', 'secure passage', 'communication handoff'),
          'function',       'Authorizes secure participant handoff and contact passage.'
        )
      ),

      'marble', jsonb_build_array(
        jsonb_build_object(
          'role_key',       'marble_resolver',
          'role_name',      'Marble Resolver',
          'material_family','marble',
          'authority',      jsonb_build_array('findings', 'result standing', 'resolution', 'carried-forward outcome'),
          'function',       'Authorizes result state and what may be carried forward.'
        ),
        jsonb_build_object(
          'role_key',       'marble_cartographer',
          'role_name',      'Marble Cartographer',
          'material_family','marble',
          'authority',      jsonb_build_array('MAP routing', 'pathway mapping', 'next-step structure', 'transition destination'),
          'function',       'Authorizes mapped pathway and next encounter direction.'
        ),
        jsonb_build_object(
          'role_key',       'marble_sealkeeper',
          'role_name',      'Marble Sealkeeper',
          'material_family','marble',
          'authority',      jsonb_build_array('registry standing', 'Codexstone relationship', 'held or active state', 'standing confirmation'),
          'function',       'Authorizes whether standing is held, active, registered, or sealed.'
        )
      )

    ),
    'source_oar2', 'docs/oar/measures_registry/oar2_register_nine_roles_and_role_call_standing_before_free_repair_v1.meta.md'
  ),

  'contract_term_restriction', jsonb_build_object(
    'rule',                'contract_reserved_for_smart_contract_only',
    'reserved_term',       'contract',
    'reserved_for',        'smart_contract',
    'permitted_alternatives', jsonb_build_array(
      'agreement', 'resolution', 'boundary', 'requirement', 'role_call', 'passage'
    ),
    'source_oar2', 'docs/oar/measures_registry/oar2_register_nine_roles_and_role_call_standing_before_free_repair_v1.meta.md'
  ),

  'legacy_implementation_field_mapping', jsonb_build_object(
    'classification', 'legacy_implementation_terminology_pending_normalization',
    'fields', jsonb_build_object(
      'src_intake_contract', jsonb_build_object(
        'native_standing', 'secure passage intake requirement',
        'status',          'legacy_implementation_field'
      ),
      'assessment_contact_capture_oar1_binding_contract_v1', jsonb_build_object(
        'native_standing', 'Lapis Steward contact passage requirement',
        'status',          'legacy_implementation_field'
      ),
      'assessment_evaluation_report_contract_v1', jsonb_build_object(
        'native_standing', 'Marble Resolver result requirement',
        'status',          'legacy_implementation_field'
      ),
      'active_contract_key_reconciliation', jsonb_build_object(
        'native_standing', 'active agreement reconciliation',
        'status',          'legacy_implementation_field'
      ),
      'measures_registry_public_runtime_boundary_v1', jsonb_build_object(
        'native_standing', 'public encounter boundary',
        'status',          'legacy_implementation_field'
      )
    ),
    'source_oar2', 'docs/oar/measures_registry/oar2_register_nine_roles_and_role_call_standing_before_free_repair_v1.meta.md'
  )

),
updated_at = now()
WHERE registry_key = 'measures_registry_root';

-- ============================================================
-- VALIDATION
-- ============================================================

DO $$
DECLARE
  v_total_roles int;
  v_obsidian_count int;
  v_lapis_count int;
  v_marble_count int;
BEGIN

  -- role_call_standing rule seated
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #>> '{role_call_standing,rule}' = 'chambers_assemble_roles_authorize'
  ) THEN
    RAISE EXCEPTION 'Validation failed: role_call_standing.rule not seated';
  END IF;

  -- chamber_callable_families includes all three
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #> '{role_call_standing,chamber_callable_families}' @> '["obsidian","lapis","marble"]'::jsonb
  ) THEN
    RAISE EXCEPTION 'Validation failed: role_call_standing.chamber_callable_families missing a family';
  END IF;

  -- total_roles = 9
  SELECT (metadata #>> '{native_role_registry,total_roles}')::int
  INTO v_total_roles
  FROM measures_registry
  WHERE registry_key = 'measures_registry_root';

  IF v_total_roles != 9 THEN
    RAISE EXCEPTION 'Validation failed: native_role_registry.total_roles = % (expected 9)', v_total_roles;
  END IF;

  -- obsidian has exactly 3 roles
  SELECT jsonb_array_length(metadata #> '{native_role_registry,roles,obsidian}')
  INTO v_obsidian_count
  FROM measures_registry
  WHERE registry_key = 'measures_registry_root';

  IF v_obsidian_count != 3 THEN
    RAISE EXCEPTION 'Validation failed: obsidian role count = % (expected 3)', v_obsidian_count;
  END IF;

  -- lapis has exactly 3 roles
  SELECT jsonb_array_length(metadata #> '{native_role_registry,roles,lapis}')
  INTO v_lapis_count
  FROM measures_registry
  WHERE registry_key = 'measures_registry_root';

  IF v_lapis_count != 3 THEN
    RAISE EXCEPTION 'Validation failed: lapis role count = % (expected 3)', v_lapis_count;
  END IF;

  -- marble has exactly 3 roles
  SELECT jsonb_array_length(metadata #> '{native_role_registry,roles,marble}')
  INTO v_marble_count
  FROM measures_registry
  WHERE registry_key = 'measures_registry_root';

  IF v_marble_count != 3 THEN
    RAISE EXCEPTION 'Validation failed: marble role count = % (expected 3)', v_marble_count;
  END IF;

  -- spot-check nine role_keys are present
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #> '{native_role_registry,roles,obsidian}' @>
          '[{"role_key":"obsidian_gatekeeper"},{"role_key":"obsidian_examiner"},{"role_key":"obsidian_witness"}]'::jsonb
  ) THEN
    RAISE EXCEPTION 'Validation failed: obsidian role_keys not seated correctly';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #> '{native_role_registry,roles,lapis}' @>
          '[{"role_key":"lapis_guide"},{"role_key":"lapis_scribe"},{"role_key":"lapis_steward"}]'::jsonb
  ) THEN
    RAISE EXCEPTION 'Validation failed: lapis role_keys not seated correctly';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #> '{native_role_registry,roles,marble}' @>
          '[{"role_key":"marble_resolver"},{"role_key":"marble_cartographer"},{"role_key":"marble_sealkeeper"}]'::jsonb
  ) THEN
    RAISE EXCEPTION 'Validation failed: marble role_keys not seated correctly';
  END IF;

  -- contract_term_restriction reserved for smart_contract
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #>> '{contract_term_restriction,reserved_for}' = 'smart_contract'
      AND metadata #>> '{contract_term_restriction,reserved_term}' = 'contract'
  ) THEN
    RAISE EXCEPTION 'Validation failed: contract_term_restriction not seated';
  END IF;

  -- legacy fields classified
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #>> '{legacy_implementation_field_mapping,fields,src_intake_contract,status}' = 'legacy_implementation_field'
      AND metadata #>> '{legacy_implementation_field_mapping,fields,assessment_contact_capture_oar1_binding_contract_v1,status}' = 'legacy_implementation_field'
      AND metadata #>> '{legacy_implementation_field_mapping,fields,assessment_evaluation_report_contract_v1,status}' = 'legacy_implementation_field'
      AND metadata #>> '{legacy_implementation_field_mapping,fields,active_contract_key_reconciliation,status}' = 'legacy_implementation_field'
      AND metadata #>> '{legacy_implementation_field_mapping,fields,measures_registry_public_runtime_boundary_v1,status}' = 'legacy_implementation_field'
  ) THEN
    RAISE EXCEPTION 'Validation failed: legacy implementation fields not fully classified';
  END IF;

  -- prior routing nodes preserved (encounter_structure not disturbed)
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #>> '{encounter_structure,intro_hook,next_surface}' = 'path_choice'
      AND metadata #>> '{encounter_structure,path_choice,left,next_surface}' = 'eval_passage'
      AND metadata #>> '{encounter_structure,path_choice,right,next_surface}' = 'crystal_seat_orientation_passage'
  ) THEN
    RAISE EXCEPTION 'Validation failed: prior encounter_structure routing nodes were disturbed';
  END IF;

END $$;
