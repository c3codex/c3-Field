-- Register role_key security boundary and AI role profile boundary.
-- OAR2 Addendum: docs/oar/measures_registry/oar2_addendum_role_key_security_boundary_before_free_role_call_repair_v1.meta.md
--
-- Nine native roles are structural encounter authorities only.
-- They are not login roles, not permission groups, not secure credentials.
-- If role_key is used for login/gating/access control → separate OAR required.
-- AI role profiles are separate from the nine native roles.
--
-- No frontend mutation. No FREE repair. No login/gating implementation.

UPDATE measures_registry
SET metadata = jsonb_set(
  jsonb_set(
    metadata,
    '{role_call_standing,native_role_authority_boundary}',
    jsonb_build_object(
      'rule',        'native_roles_are_structural_encounter_authorities_only',
      'not_roles',   jsonb_build_array('login_roles', 'permission_groups', 'ai_role_profiles', 'human_user_profiles', 'authentication_credentials', 'secure_access_tokens'),
      'are_roles',   'structural authorities used by role_call to determine encounter standing, passage requirements, passage modes, and renderer authorization',
      'public_identifiers', jsonb_build_array(
        'obsidian_gatekeeper','obsidian_examiner','obsidian_witness',
        'lapis_guide','lapis_scribe','lapis_steward',
        'marble_resolver','marble_cartographer','marble_sealkeeper'
      ),
      'public_identifier_note', 'Native role identifiers are public architectural identifiers. They are not authentication credentials, not secure access tokens, not login keys.',
      'source_oar2', 'docs/oar/measures_registry/oar2_addendum_role_key_security_boundary_before_free_role_call_repair_v1.meta.md'
    ),
    true
  ),
  '{role_call_standing,role_key_security_boundary}',
  jsonb_build_object(
    'rule', 'secure_role_key_must_not_derive_from_native_role_names',
    'applies_when', jsonb_build_array('login', 'gating', 'permission', 'access_control', 'authorization_of_protected_actions', 'secure_passage', 'role_bound_private_state'),
    'requirements', jsonb_build_object(
      'system_generated',        true,
      'non_guessable',           true,
      'non_public',              true,
      'stored_securely',         true,
      'never_inferred_from_display_copy',    true,
      'never_inferred_from_native_role_names', true,
      'never_hand_authored_in_public_source', true,
      'never_exposed_to_frontend_as_authority', true
    ),
    'free_repair_scope', 'FREE may only use native roles to determine encounter standing, passage requirements, passage modes, and renderer authorization. Secure login/gating role_keys require a separate OAR and secure generation path.',
    'source_oar2', 'docs/oar/measures_registry/oar2_addendum_role_key_security_boundary_before_free_role_call_repair_v1.meta.md'
  ),
  true
),
updated_at = now()
WHERE registry_key = 'measures_registry_root';

-- Also seat ai_role_profile_boundary at root level
UPDATE measures_registry
SET metadata = jsonb_set(
  metadata,
  '{ai_role_profile_boundary}',
  jsonb_build_object(
    'rule', 'ai_role_profiles_are_separate_from_nine_native_roles',
    'description', 'An AI role profile may support a task, voice, workflow, or assisted behavior. It is not one of the nine native roles unless a future OAR explicitly registers that relationship.',
    'constraint', 'No AI role profile may be treated as a secure role_key.',
    'registration_path', 'Relationship between AI role profiles and native roles requires explicit OAR registration.',
    'source_oar2', 'docs/oar/measures_registry/oar2_addendum_role_key_security_boundary_before_free_role_call_repair_v1.meta.md'
  ),
  true
),
updated_at = now()
WHERE registry_key = 'measures_registry_root';

-- ============================================================
-- VALIDATION
-- ============================================================

DO $$
BEGIN

  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #>> '{role_call_standing,native_role_authority_boundary,rule}'
          = 'native_roles_are_structural_encounter_authorities_only'
  ) THEN
    RAISE EXCEPTION 'Validation failed: native_role_authority_boundary not seated';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #>> '{role_call_standing,role_key_security_boundary,rule}'
          = 'secure_role_key_must_not_derive_from_native_role_names'
      AND (metadata #> '{role_call_standing,role_key_security_boundary,requirements,system_generated}')::boolean = true
      AND (metadata #> '{role_call_standing,role_key_security_boundary,requirements,non_public}')::boolean = true
  ) THEN
    RAISE EXCEPTION 'Validation failed: role_key_security_boundary not seated correctly';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #>> '{ai_role_profile_boundary,rule}'
          = 'ai_role_profiles_are_separate_from_nine_native_roles'
  ) THEN
    RAISE EXCEPTION 'Validation failed: ai_role_profile_boundary not seated';
  END IF;

  -- Prior role_call_standing structure preserved
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #>> '{role_call_standing,rule}' = 'chambers_assemble_roles_authorize'
      AND metadata #>> '{native_role_registry,total_roles}' = '9'
  ) THEN
    RAISE EXCEPTION 'Validation failed: prior role_call_standing or native_role_registry disturbed';
  END IF;

END $$;
