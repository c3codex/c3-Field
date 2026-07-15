-- Restore Inanna Foundational Public Encounter Standing
-- Authorizing OAR2: docs/oar/measures_of_inanna/oar2_restore_inanna_foundational_public_encounter_standing_v1.meta.md
-- Executed directly against DATABASE_URL (Supabase MCP management tools unauthorized in this session).
--
-- Root cause: a shared measures_registry public-read RLS policy change now requires
-- is_active = true AND release_state IN ('released','active'). Three foundational spine rows
-- still used the legacy release_state value 'open', making their child encounter definitions
-- unresolvable to anonymous visitors even though the encounters, transitions, and media mappings
-- were all still active. This restores exactly those three rows' release_state to 'released' —
-- the value already used, without exception, by every other currently-visible spine row.
--
-- Before state (captured live prior to this migration):
--   crystal_temple_home      | release_state=open | access_state=visible | is_active=true
--   temple_antechamber       | release_state=open | access_state=visible | is_active=true
--   temple_harrumuk_passage  | release_state=open | access_state=visible | is_active=true
--
-- This migration does not touch access_state, is_active, encounter definitions, transition
-- rules, media mappings, or any other registry row. It does not broaden the shared RLS policy.

update measures_registry
set release_state = 'released', updated_at = now()
where registry_key in ('crystal_temple_home', 'temple_harrumuk_passage', 'temple_antechamber')
  and release_state = 'open'
  and is_active = true;
