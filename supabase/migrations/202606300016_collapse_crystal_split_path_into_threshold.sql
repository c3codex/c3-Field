-- Collapse crystal_seat_split_path into crystal_seat_threshold.
-- Source OAR2: docs/oar/measures_registry/oar2_collapse_crystal_split_path_into_threshold_v1.meta.md
--
-- Changes to encounter_structure JSONB on measures_registry_root:
--   1. crystal_seat_threshold.right.next_surface: crystal_seat_orientation_passage -> crystal_seat_orientation
--   2. crystal_seat_threshold.next_surface (default to split_path): REMOVED
--   3. crystal_seat_orientation node: ADDED with next_surface = crystal_seat_encounter
--   4. crystal_seat_split_path node: standing = legacy_alias added
--
-- crystal_seat_split_path surface_assignment: marked legacy_alias in metadata.
-- evaluate_structure_path registry_key is no longer used by any active surface.
-- No DB rows deleted. No active surface broken.

UPDATE public.measures_registry
SET metadata = jsonb_set(
  jsonb_set(
    jsonb_set(
      -- Step 1: remove crystal_seat_threshold.next_surface (was: crystal_seat_split_path)
      (metadata #- '{encounter_structure,crystal_seat_threshold,next_surface}'),
      -- Step 2: update crystal_seat_threshold.right.next_surface
      '{encounter_structure,crystal_seat_threshold,right,next_surface}',
      '"crystal_seat_orientation"'
    ),
    -- Step 3: add crystal_seat_orientation transition node
    '{encounter_structure,crystal_seat_orientation}',
    '{"next_surface": "crystal_seat_encounter", "source_oar2": "docs/oar/measures_registry/oar2_collapse_crystal_split_path_into_threshold_v1.meta.md"}'::jsonb,
    true
  ),
  -- Step 4: mark crystal_seat_split_path as legacy_alias in encounter_structure
  '{encounter_structure,crystal_seat_split_path,standing}',
  '"legacy_alias"',
  true
)
WHERE registry_key = 'measures_registry_root';

-- Mark crystal_seat_split_path surface_assignment as deprecated.
UPDATE public.measures_encounter_surface_assignment
SET metadata = metadata
  || '{"standing": "legacy_alias", "standing_note": "L/R path choice collapsed into crystal_seat_threshold"}'::jsonb
WHERE surface_key = 'crystal_seat_split_path';
