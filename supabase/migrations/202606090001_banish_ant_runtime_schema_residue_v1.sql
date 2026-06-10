-- OAR2: docs/oar/c3_field/oar2_banish_ant_runtime_schema_residue_v1.meta.md

-- Step 1: Drop ANT-only view (fully ANT-derived; no non-ANT replacement in this OAR)
DROP VIEW IF EXISTS public.v_envelope_access_by_c3key_v1;

-- Step 2: Drop FK from measures_registry to ant_envelope
-- Column retained as legacy nullable; FK removed to unblock ant_envelope drop in future OAR
ALTER TABLE public.measures_registry
  DROP CONSTRAINT IF EXISTS measures_registry_envelope_id_fkey;

-- Step 3: Rewrite v_measures_registry_state_v1 without ant_envelope JOIN
-- envkey and envelope_state preserved as NULL columns to maintain view shape
CREATE OR REPLACE VIEW public.v_measures_registry_state_v1 AS
SELECT
  mr.id AS registry_id,
  mr.registry_key,
  mr.display_title,
  mr.registry_family,
  mr.encounter_type,
  mr.material_family,
  mr.sequence_order,
  mr.release_state AS registry_release_state,
  mr.access_state AS registry_access_state,
  mr.phase_label AS registry_phase_label,
  mr.parent_registry_id,
  parent.registry_key AS parent_registry_key,
  mr.depends_on_registry_id,
  dep.registry_key AS depends_on_registry_key,
  mr.envelope_id,
  NULL::text AS envkey,
  NULL::text AS envelope_state,
  mrs.release_state AS effective_release_state,
  mrs.access_state AS effective_access_state,
  mrs.release_reason,
  mrs.access_reason,
  mrs.release_at,
  mrs.sealed_at,
  med.id AS encounter_id,
  med.encounter_key,
  med.encounter_type AS encounter_def_type,
  med.surface_type,
  med.pause_allowed,
  med.is_entry_surface,
  mr.is_active
FROM ((((public.measures_registry mr
  LEFT JOIN public.measures_registry parent ON parent.id = mr.parent_registry_id)
  LEFT JOIN public.measures_registry dep ON dep.id = mr.depends_on_registry_id)
  LEFT JOIN public.measures_release_state mrs ON mrs.registry_id = mr.id)
  LEFT JOIN public.measures_encounter_def med ON med.registry_id = mr.id)
WHERE mr.is_active = true
ORDER BY mr.registry_family, mr.sequence_order, mr.display_title;

-- Step 4: Rewrite v_field_relation_graph_v1 without ant_envelope node label
-- envelope node type returns NULL label until non-ANT carrier table is seated
CREATE OR REPLACE VIEW public.v_field_relation_graph_v1 AS
SELECT
  fre.id AS relation_id,
  fre.from_node_type,
  fre.from_node_id,
  fre.relation_type,
  fre.to_node_type,
  fre.to_node_id,
  fre.relation_state,
  fre.sort_order,
  fre.created_at,
  CASE
    WHEN fre.from_node_type = 'origin'   THEN (SELECT fo.origin_ref    FROM public.field_origin fo       WHERE fo.id = fre.from_node_id)
    WHEN fre.from_node_type = 'envelope' THEN NULL
    WHEN fre.from_node_type = 'registry' THEN (SELECT mr.registry_key  FROM public.measures_registry mr  WHERE mr.id = fre.from_node_id)
    ELSE NULL
  END AS from_node_label,
  CASE
    WHEN fre.to_node_type = 'origin'     THEN (SELECT fo.origin_ref    FROM public.field_origin fo       WHERE fo.id = fre.to_node_id)
    WHEN fre.to_node_type = 'envelope'   THEN NULL
    WHEN fre.to_node_type = 'registry'   THEN (SELECT mr.registry_key  FROM public.measures_registry mr  WHERE mr.id = fre.to_node_id)
    ELSE NULL
  END AS to_node_label
FROM public.field_relation_edge fre
ORDER BY fre.created_at DESC, fre.sort_order;

-- Step 5: Drop broken/orphaned ANT functions
-- refresh_ant_passage_state references dropped ant_oar_log — broken on any call
-- prevent_ant_oar_log_mutation is orphaned — ant_oar_log was removed in prior OAR
DROP FUNCTION IF EXISTS public.refresh_ant_passage_state(text);
DROP FUNCTION IF EXISTS public.prevent_ant_oar_log_mutation();

-- Step 6: Drop deprecated ANT tables with no live dependencies (0 rows confirmed)
-- ant_signal_record has FK on ant_inbox — drop signal_record first
-- Triggers on these tables are dropped automatically
DROP TABLE IF EXISTS public.ant_signal_record;
DROP TABLE IF EXISTS public.ant_inbox;
