-- Persist operator-confirmed current-state clarification for The 21 of Coherence.
-- Preserves the canonical 7 Constraints, 7 Agreements, and 7 Resolutions unchanged.
-- Clarifies participant scope: Named Individuals, Institutions in Service,
-- Computational Intelligence (CI). Prior `AI` wording remains historical provenance.

insert into public.codex_source_record (
  record_key,
  title,
  record_type,
  authority_level,
  source_scope,
  version,
  status,
  content,
  metadata,
  is_active
)
values (
  'twenty_one_of_coherence_ci_participant_clarification_v1',
  'The 21 of Coherence — CI Participant Clarification',
  'foundational_source_clarification',
  'system',
  'coherence',
  'v1',
  'readonly',
  'repo:c3codex/c3-Field@2471d36be0e0d19c1f8201e388c7d29317ac071f:docs/_source/seed/source_21_of_coherence_ci_participant_clarification_v1.meta.md',
  jsonb_build_object(
    'operator', 'op044',
    'operator_confirmed', true,
    'clarifies_record_key', 'twenty_one_of_coherence',
    'canonical_21_unchanged', true,
    'current_participant_classes', jsonb_build_array('Named Individual', 'Institution in Service', 'Computational Intelligence (CI)'),
    'prior_ai_label_preserved_as_provenance', true,
    'ci_is_participant', true,
    'ci_is_person', false,
    'ci_is_system', false,
    'operator_is_participant_class', false,
    'notchazz_is_participant', false,
    'repo', 'c3codex/c3-Field',
    'repo_branch', 'c3field',
    'repo_path', 'docs/_source/seed/source_21_of_coherence_ci_participant_clarification_v1.meta.md',
    'repo_commit', '2471d36be0e0d19c1f8201e388c7d29317ac071f'
  ),
  true
)
on conflict (record_key) do nothing;
