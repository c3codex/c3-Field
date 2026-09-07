-- Normalize obsidian_chamber_orientation surface to canonical registry_key.
-- Source OAR2: docs/oar/measures_registry/oar2_normalize_orientation_surfaces_and_hold_passage_carryover_v1.meta.md
--
-- SCOPE OF THIS MIGRATION:
--   obsidian_chamber_orientation — decoupled from obsidian_chamber_orientation_passage; new canonical row seeded.
--
-- BLOCKED / GAP (not executed here):
--   crystal_seat_orientation — already on non-passage registry_key (ai_isnt_broken_intro);
--     canonical normalization requires dedicated content seeding OAR (encounter_def metadata
--     has stale internal key references that cannot be copied without updating them).
--   marble_chamber_orientation — no surface_key row in measures_encounter_surface_assignment;
--     gap surface requiring separate OAR to create surface assignment, renderer component, and registry.

-- Step 1: Create canonical measures_registry row for obsidian_chamber_orientation.
INSERT INTO measures_registry (
  registry_key,
  display_title,
  registry_family,
  release_state,
  access_state,
  is_active,
  metadata
) VALUES (
  'obsidian_chamber_orientation',
  'Obsidian Chamber Orientation',
  'spine',
  'released',
  'encounterable',
  true,
  '{
    "native_architecture": true,
    "supersedes": "obsidian_chamber_orientation_passage",
    "orientation_role": "obsidian_chamber_entry"
  }'::jsonb
);

-- Step 2: Create canonical encounter_def for obsidian_chamber_orientation.
INSERT INTO measures_encounter_def (
  registry_id,
  encounter_key,
  display_title,
  encounter_type,
  material_family,
  surface_type,
  is_active,
  metadata
)
SELECT
  r.id,
  'obsidian_chamber_orientation',
  'Obsidian Chamber Orientation',
  'view',
  'obsidian',
  'threshold',
  true,
  '{
    "native_key": "obsidian_chamber_orientation",
    "chamber_assignment": "obsidian",
    "orientation_role": "obsidian_chamber_entry",
    "legacy_replaces": "obsidian_chamber_orientation_passage",
    "renderer_contract": "EvalPassage",
    "governance_note": "Canonical Obsidian Chamber orientation surface. Supersedes obsidian_chamber_orientation_passage carryover naming.",
    "status_note": "Seated as canonical orientation key. Content and renderer inherited from prior passage key."
  }'::jsonb
FROM measures_registry r
WHERE r.registry_key = 'obsidian_chamber_orientation';

-- Step 3: Update surface_assignment to use canonical registry_key and encounter_key.
-- Only obsidian_chamber_orientation surface — not the passage surface_key row.
UPDATE public.measures_encounter_surface_assignment
SET
  registry_key = 'obsidian_chamber_orientation',
  encounter_key = 'obsidian_chamber_orientation'
WHERE surface_key = 'obsidian_chamber_orientation';

-- Step 4: Hold carryover passage registry key now that no active surface depends on it.
UPDATE public.measures_registry
SET
  is_active = false,
  release_state = 'held'
WHERE registry_key = 'obsidian_chamber_orientation_passage';
