-- Seat encounter surface assignment in registry.
-- Surfaces (intro_hook, path_choice, etc.) map to registry keys, material identity,
-- and chamber assignment. Renderer reads this table; no assignment authority in TypeScript.
-- Release authority remains in measures_registry (is_active, release_state).

CREATE TABLE measures_encounter_surface_assignment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  surface_key TEXT NOT NULL UNIQUE,
  registry_key TEXT NOT NULL,
  encounter_key TEXT,
  material_identity TEXT NOT NULL,
  chamber_assignment TEXT NOT NULL,
  public_routes TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT false,
  release_state TEXT NOT NULL DEFAULT 'held',
  access_state TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Anon reads all assignment rows (held included).
-- Release authority comes from measures_registry, not this table.
ALTER TABLE measures_encounter_surface_assignment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_surface_assignments"
  ON measures_encounter_surface_assignment
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "service_role_full_access"
  ON measures_encounter_surface_assignment
  FOR ALL TO service_role
  USING (true);

-- Crystal: entry + path
INSERT INTO measures_encounter_surface_assignment
  (surface_key, registry_key, encounter_key, material_identity, chamber_assignment, public_routes, is_active, release_state, access_state)
VALUES
  ('intro_hook',  'ai_isnt_broken_intro',   'ai_isnt_broken_intro',   'crystal', 'CrystalSeatRenderer',    ARRAY['/'],                       true,  'released', 'public'),
  ('intro',       'ai_isnt_broken_intro',   'ai_isnt_broken_intro',   'crystal', 'CrystalSeatRenderer',    ARRAY['/'],                       true,  'released', 'public'),
  ('path_choice', 'evaluate_structure_path','evaluate_structure_path', 'crystal', 'CrystalSeatRenderer',    ARRAY[]::TEXT[],                  true,  'released', 'public'),

-- Crystal: held surfaces (release gate blocks rendering; assignment still seated)
  ('structure_passage',              'structure_passage',    'structure_passage',    'crystal', 'CrystalSeatRenderer', ARRAY[]::TEXT[], false, 'held', 'encounterable'),
  ('measures_structured_environments','structure_passage',   'structure_passage',    'crystal', 'CrystalSeatRenderer', ARRAY[]::TEXT[], false, 'held', 'encounterable'),
  ('about_measures_registry',        'about_measures_registry','about_measures_registry','crystal','CrystalSeatRenderer',ARRAY['/about','/about-measures-registry'], false, 'held', 'encounterable'),

-- Obsidian: assessment path
  ('eval_passage',                   'eval_passage',                   'eval_passage',                   'obsidian', 'ObsidianChamberRenderer', ARRAY[]::TEXT[],                   true, 'released', 'public'),
  ('structural_coherence_explainer', 'eval_passage',                   'eval_passage',                   'obsidian', 'ObsidianChamberRenderer', ARRAY[]::TEXT[],                   true, 'released', 'public'),
  ('measures_assessment',            'measures_assessment',            'measures_assessment',            'obsidian', 'ObsidianChamberRenderer', ARRAY['/ai-operations-assessment'], true, 'released', 'public'),
  ('obsidian_to_marble_passage_video','obsidian_to_marble_passage_video','obsidian_to_marble_passage_video','obsidian','ObsidianChamberRenderer',ARRAY[]::TEXT[],                  true, 'released', 'public'),

-- Marble: MAP
  ('map_integrity_governance', 'map_integrity_governance', 'map_integrity_governance', 'marble', 'MarbleChamberRenderer', ARRAY['/map-integrity-governance'], true, 'released', 'public'),

-- Lapis: publications
  ('structural_drift_dispatches', 'structural_drift_publication', 'structural_drift_publication', 'lapis', 'LapisChamberRenderer', ARRAY['/undrifted'],                          true, 'released', 'public'),
  ('publication_dispatch',        'structural_drift_publication', 'structural_drift_publication', 'lapis', 'LapisChamberRenderer', ARRAY['/publication/structural_drift'],        true, 'released', 'public');
