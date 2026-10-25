-- Concordance Authority Execution Package Rollback / Recovery v1
-- REVIEW ARTIFACT ONLY. Do not execute without a separate confirmed correction OAR2.
-- Post-seating recovery should prefer standing changes and supersession over destructive rollback.

-- If seating fails before any rows are inserted, stop and correct the migration draft.

-- If document/version rows exist but seating is incomplete, mark version blocked.
update public.concordance_version
set
  version_standing = 'blocked',
  metadata = metadata || '{"recovery": "blocked_after_partial_seating"}'::jsonb
where version_key = 'seed_concordance_v1'
  and version_standing <> 'superseded';

-- Mark document blocked only if no active version remains valid.
update public.concordance_document
set
  authority_standing = 'blocked',
  metadata = metadata || '{"recovery": "blocked_after_failed_initial_seating"}'::jsonb
where document_key = 'seed_concordance'
  and not exists (
    select 1
    from public.concordance_version
    where document_key = 'seed_concordance'
      and version_standing = 'active'
  );

-- Snapshot correction should append a new snapshot row under a correction OAR2.
-- Do not update or delete existing seeded_source_snapshot rows.
