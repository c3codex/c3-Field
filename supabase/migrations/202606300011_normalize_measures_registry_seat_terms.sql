-- Normalize Measures Registry metadata toward the 13-term active SEAT structure.
-- Source OAR2: docs/oar/measures_registry/oar2_normalize_measures_registry_terms_across_db_free_css_v1.meta.md
-- metadata.profile/metadata.standing have zero runtime consumers (confirmed via source
-- audit of registryResolver.ts and all chamber renderers — dispatch is by literal
-- surface_key string match only). This migration is metadata-only and carries no
-- behavior risk. Surface_key/route-level consolidation of duplicate-function rows
-- is reported as a gap in the companion OAR1, not executed here.

-- 1. intro_hook: correct drifted profile term to canonical SEAT term
UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"crystal_seat_threshold"}'::jsonb
WHERE surface_key = 'intro_hook';

-- 2. path_choice: correct drifted profile term to canonical SEAT term
UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"crystal_seat_split_path"}'::jsonb
WHERE surface_key = 'path_choice';

-- 3. intro: already correct (crystal_orientation_surface) — no change required.

-- 4. about_measures_registry: correct drifted profile term to canonical SEAT term
UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"crystal_seat_encounter"}'::jsonb
WHERE surface_key = 'about_measures_registry';

-- 5. structural_drift_dispatches: this is the real /undrifted Lapis Chamber encounter.
-- Replace generic shared term with the exact SEAT term so it no longer hides standing.
UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"lapis_chamber_encounter"}'::jsonb
WHERE surface_key = 'structural_drift_dispatches';

-- 6. structural_coherence_explainer: canonical Obsidian Chamber orientation surface
-- (per OAR2 ALIGNED item 6). eval_passage and obsidian_chamber_orientation_passage
-- render the identical component and are isolated below rather than duplicated here.
UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"obsidian_chamber_orientation"}'::jsonb
WHERE surface_key = 'structural_coherence_explainer';

-- 7. measures_assessment: correct drifted profile term to canonical SEAT term
UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"obsidian_chamber_encounter_assessment"}'::jsonb
WHERE surface_key = 'measures_assessment';

-- 11. map_integrity_governance: correct drifted profile term to canonical SEAT term
UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"marble_chamber_C2_encounter"}'::jsonb
WHERE surface_key = 'map_integrity_governance';

-- Drift isolation: duplicate-function and passage/held surfaces outside the 13-term
-- SEAT structure. Tagged with standing, existing profile fields preserved.

-- eval_passage duplicates structural_coherence_explainer's EvalPassage component.
UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"standing":"legacy_alias","standing_note":"duplicates structural_coherence_explainer EvalPassage component"}'::jsonb
WHERE surface_key = 'eval_passage';

-- obsidian_chamber_orientation_passage duplicates structural_coherence_explainer's EvalPassage component.
UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"standing":"legacy_alias","standing_note":"duplicates structural_coherence_explainer EvalPassage component"}'::jsonb
WHERE surface_key = 'obsidian_chamber_orientation_passage';

-- structure_passage: passage term, held per PASSAGE / ANTECHAMBER HOLD RULE.
UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"standing":"held","standing_note":"passage hold rule — not in 13-term SEAT structure"}'::jsonb
WHERE surface_key = 'structure_passage';

-- crystal_seat_orientation_passage duplicates structure_passage's StructurePassageSeat component.
UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"standing":"held","standing_note":"duplicates structure_passage StructurePassageSeat component"}'::jsonb
WHERE surface_key = 'crystal_seat_orientation_passage';

-- measures_structured_environments: code already returns renderer_gap state.
UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"standing":"held","standing_note":"renderer_gap in code — measures_structured_environments_not_in_encounter_model"}'::jsonb
WHERE surface_key = 'measures_structured_environments';

-- marble_chamber_orientation_passage duplicates map_integrity_governance's component;
-- no distinct "before-the-paths explainer" renderer exists yet (marble_chamber_orientation gap).
UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"standing":"gap","standing_note":"duplicates map_integrity_governance component — no distinct marble_chamber_orientation renderer seated"}'::jsonb
WHERE surface_key = 'marble_chamber_orientation_passage';

-- publication_dispatch: distinct sub-dispatch surface, not yet in encounter model.
-- Generic lapis_publication_surface term retired from the canonical /undrifted row (item 5);
-- this row is isolated as audit_trace rather than sharing the Lapis Chamber encounter term.
UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"standing":"audit_trace","standing_note":"distinct sub-dispatch surface, not yet in encounter model — not the canonical lapis_chamber_encounter"}'::jsonb
WHERE surface_key = 'publication_dispatch';
