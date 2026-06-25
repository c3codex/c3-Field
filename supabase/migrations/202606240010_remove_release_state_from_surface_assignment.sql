-- Remove release authority duplication from measures_encounter_surface_assignment.
-- is_active, release_state, and access_state duplicated measures_registry standing.
-- Surface assignment defines what a surface belongs to.
-- Registry standing defines whether it may render.

ALTER TABLE measures_encounter_surface_assignment
  DROP COLUMN IF EXISTS is_active,
  DROP COLUMN IF EXISTS release_state,
  DROP COLUMN IF EXISTS access_state;
