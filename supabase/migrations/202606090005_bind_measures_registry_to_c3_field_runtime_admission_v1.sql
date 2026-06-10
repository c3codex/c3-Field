-- OAR2: docs/oar/c3_field/oar2_bind_measures_registry_to_c3_field_runtime_admission_v1.meta.md

-- ── TABLE: c3_runtime_admission_binding ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.c3_runtime_admission_binding (
  id                           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  binding_key                  text        NOT NULL UNIQUE,
  system_key                   text        NOT NULL,
  admission_key                text        NOT NULL,
  binding_scope                text        NOT NULL DEFAULT 'system',
  binding_target_type          text        NOT NULL,
  binding_target_key           text        NOT NULL,
  passage_key                  text,
  canopy_key                   text,
  contract_readiness_required  boolean     NOT NULL DEFAULT true,
  runtime_admission_required   boolean     NOT NULL DEFAULT true,
  public_route_required        boolean     NOT NULL DEFAULT false,
  payment_required             boolean     NOT NULL DEFAULT false,
  seat_required                boolean     NOT NULL DEFAULT false,
  c3_key_required              boolean     NOT NULL DEFAULT false,
  binding_state                text        NOT NULL DEFAULT 'held',
  release_state                text        NOT NULL DEFAULT 'held',
  access_state                 text        NOT NULL DEFAULT 'held',
  runtime_effect_allowed       boolean     NOT NULL DEFAULT false,
  public_effect_allowed        boolean     NOT NULL DEFAULT false,
  blocker_reason               text,
  source_oar2_path             text        NOT NULL,
  source_oar1_path             text,
  metadata                     jsonb       NOT NULL DEFAULT '{}'::jsonb,
  is_active                    boolean     NOT NULL DEFAULT true,
  created_at                   timestamptz NOT NULL DEFAULT now(),
  updated_at                   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT c3_runtime_admission_binding_scope_check
    CHECK (binding_scope IN ('system', 'encounter', 'chamber', 'pathway', 'assessment', 'runtime_surface')),
  CONSTRAINT c3_runtime_admission_binding_target_type_check
    CHECK (binding_target_type IN ('encounter_key', 'registry_key', 'chamber_key', 'pathway_key', 'assessment_key', 'surface_key')),
  CONSTRAINT c3_runtime_admission_binding_state_check
    CHECK (binding_state IN ('held', 'draft', 'ready', 'bound', 'blocked', 'revoked')),
  CONSTRAINT c3_runtime_admission_binding_release_state_check
    CHECK (release_state IN ('held', 'ready', 'released', 'blocked', 'revoked')),
  CONSTRAINT c3_runtime_admission_binding_access_state_check
    CHECK (access_state IN ('held', 'private', 'public', 'restricted', 'blocked', 'revoked'))
);

-- ── TRIGGER ───────────────────────────────────────────────────────────────────
CREATE TRIGGER c3_runtime_admission_binding_set_updated_at
  BEFORE UPDATE ON public.c3_runtime_admission_binding
  FOR EACH ROW EXECUTE FUNCTION public.c3_oar_set_updated_at();

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE public.c3_runtime_admission_binding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "c3_runtime_admission_binding_public_read"
  ON public.c3_runtime_admission_binding
  FOR SELECT TO anon, authenticated USING (true);

-- ── HELD BINDING ROWS: measures_registry ─────────────────────────────────────
INSERT INTO public.c3_runtime_admission_binding (
  binding_key, system_key, admission_key,
  binding_scope, binding_target_type, binding_target_key,
  passage_key, canopy_key,
  contract_readiness_required, runtime_admission_required,
  public_route_required, payment_required, seat_required, c3_key_required,
  binding_state, release_state, access_state,
  runtime_effect_allowed, public_effect_allowed,
  blocker_reason, source_oar2_path, metadata
) VALUES
(
  'measures_registry_assessment_admission_binding',
  'measures_registry', 'measures_registry_runtime_admission',
  'assessment', 'assessment_key', 'measures_assessment',
  'measures_of_inanna_spine_passage_law', 'c3_field_canopy_law_base',
  true, true, false, false, false, false,
  'held', 'held', 'held',
  false, false,
  'Assessment binding is held until contract readiness and runtime admission are explicitly advanced.',
  'docs/oar/c3_field/oar2_bind_measures_registry_to_c3_field_runtime_admission_v1.meta.md',
  jsonb_build_object(
    'binding_note', 'Binds Measures Registry assessment threshold to c3 Field runtime admission validation.',
    'runtime_admission_state', 'not_seated'
  )
),
(
  'measures_registry_governed_pathway_reveal_admission_binding',
  'measures_registry', 'measures_registry_runtime_admission',
  'pathway', 'pathway_key', 'governed_pathway_reveal',
  'measures_of_inanna_spine_passage_law', 'c3_field_canopy_law_base',
  true, true, false, false, false, false,
  'held', 'held', 'held',
  false, false,
  'Assessment binding is held until contract readiness and runtime admission are explicitly advanced.',
  'docs/oar/c3_field/oar2_bind_measures_registry_to_c3_field_runtime_admission_v1.meta.md',
  jsonb_build_object(
    'binding_note', 'Binds governed pathway reveal to c3 Field runtime admission validation.',
    'runtime_admission_state', 'not_seated'
  )
),
(
  'measures_registry_map_continuation_admission_binding',
  'measures_registry', 'measures_registry_runtime_admission',
  'pathway', 'pathway_key', 'map_continuation',
  'measures_of_inanna_spine_passage_law', 'c3_field_canopy_law_base',
  true, true, false, false, false, false,
  'held', 'held', 'held',
  false, false,
  'Assessment binding is held until contract readiness and runtime admission are explicitly advanced.',
  'docs/oar/c3_field/oar2_bind_measures_registry_to_c3_field_runtime_admission_v1.meta.md',
  jsonb_build_object(
    'binding_note', 'Binds Marble / MAP continuation pathway to c3 Field runtime admission validation.',
    'runtime_admission_state', 'not_seated'
  )
)
ON CONFLICT (binding_key) DO NOTHING;

-- ── VIEW: v_c3_measures_registry_admission_binding_v1 ─────────────────────────
CREATE OR REPLACE VIEW public.v_c3_measures_registry_admission_binding_v1 AS
SELECT
  rab.binding_key,
  rab.system_key,
  rab.binding_scope,
  rab.binding_target_type,
  rab.binding_target_key,
  rab.binding_state,
  rab.release_state,
  rab.access_state,
  rab.runtime_effect_allowed,
  rab.public_effect_allowed,
  ra.admission_state,
  ra.runtime_admission_resolved,
  cr.all_contracts_ready,
  pl.passage_state,
  pl.release_state                   AS passage_release_state,
  pl.access_state                    AS passage_access_state,
  cl.runtime_admission_state         AS canopy_runtime_admission_state,
  (
    rab.binding_state = 'bound'
    AND rab.release_state = 'released'
    AND rab.access_state NOT IN ('held', 'blocked', 'revoked')
    AND (rab.runtime_effect_allowed = true OR rab.public_effect_allowed = true)
    AND ra.runtime_admission_resolved = true
    AND cr.all_contracts_ready = true
    AND pl.passage_state IN ('ready', 'released')
    AND cl.runtime_admission_state IN ('ready', 'admitted')
  )                                  AS binding_resolved,
  rab.blocker_reason                 AS binding_blocked_reason,
  rab.is_active,
  rab.created_at,
  rab.updated_at
FROM public.c3_runtime_admission_binding rab
JOIN public.v_c3_field_runtime_admission_v1 ra
  ON ra.system_key = rab.system_key
JOIN public.v_c3_contract_readiness_v1 cr
  ON cr.system_key = rab.system_key
LEFT JOIN public.c3_passage_law pl
  ON pl.passage_key = rab.passage_key
LEFT JOIN public.c3_canopy_law cl
  ON cl.canopy_key = rab.canopy_key
WHERE rab.system_key = 'measures_registry'
  AND rab.is_active = true
ORDER BY rab.binding_scope, rab.binding_key;
