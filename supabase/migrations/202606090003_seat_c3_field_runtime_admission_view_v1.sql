-- OAR2: docs/oar/c3_field/oar2_seat_c3_field_runtime_admission_view_v1.meta.md

-- ── TABLE: c3_runtime_admission_contract ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.c3_runtime_admission_contract (
  id                           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  admission_key                text        NOT NULL UNIQUE,
  system_key                   text        NOT NULL,
  admission_scope              text        NOT NULL DEFAULT 'system',
  admission_state              text        NOT NULL DEFAULT 'not_seated',
  registered_system_required   boolean     NOT NULL DEFAULT true,
  passage_law_required         boolean     NOT NULL DEFAULT true,
  canopy_law_required          boolean     NOT NULL DEFAULT true,
  optics_contract_required     boolean     NOT NULL DEFAULT true,
  evidence_contract_required   boolean     NOT NULL DEFAULT true,
  trace_contract_required      boolean     NOT NULL DEFAULT true,
  correction_contract_required boolean     NOT NULL DEFAULT true,
  ai_action_boundary_required  boolean     NOT NULL DEFAULT true,
  role_contract_required       boolean     NOT NULL DEFAULT true,
  external_contract_required   boolean     NOT NULL DEFAULT false,
  payment_contract_required    boolean     NOT NULL DEFAULT false,
  public_runtime_allowed       boolean     NOT NULL DEFAULT false,
  runtime_activation_allowed   boolean     NOT NULL DEFAULT false,
  release_state                text        NOT NULL DEFAULT 'held',
  access_state                 text        NOT NULL DEFAULT 'held',
  blocker_reason               text,
  source_oar2_path             text        NOT NULL,
  source_oar1_path             text,
  metadata                     jsonb       NOT NULL DEFAULT '{}'::jsonb,
  is_active                    boolean     NOT NULL DEFAULT true,
  created_at                   timestamptz NOT NULL DEFAULT now(),
  updated_at                   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT c3_runtime_admission_contract_scope_check
    CHECK (admission_scope IN ('system', 'passage', 'canopy', 'encounter', 'external_boundary')),
  CONSTRAINT c3_runtime_admission_contract_admission_state_check
    CHECK (admission_state IN ('not_seated', 'held', 'ready', 'admitted', 'blocked', 'revoked')),
  CONSTRAINT c3_runtime_admission_contract_release_state_check
    CHECK (release_state IN ('held', 'ready', 'released', 'blocked', 'revoked')),
  CONSTRAINT c3_runtime_admission_contract_access_state_check
    CHECK (access_state IN ('held', 'private', 'public', 'restricted', 'blocked', 'revoked'))
);

-- ── TRIGGER ───────────────────────────────────────────────────────────────────
CREATE TRIGGER c3_runtime_admission_contract_set_updated_at
  BEFORE UPDATE ON public.c3_runtime_admission_contract
  FOR EACH ROW EXECUTE FUNCTION public.c3_oar_set_updated_at();

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE public.c3_runtime_admission_contract ENABLE ROW LEVEL SECURITY;

CREATE POLICY "c3_runtime_admission_contract_public_read"
  ON public.c3_runtime_admission_contract
  FOR SELECT TO anon, authenticated USING (true);

-- ── BASE HELD ROWS ────────────────────────────────────────────────────────────
INSERT INTO public.c3_runtime_admission_contract (
  admission_key, system_key, admission_scope, admission_state,
  registered_system_required, passage_law_required, canopy_law_required,
  optics_contract_required, evidence_contract_required, trace_contract_required,
  correction_contract_required, ai_action_boundary_required, role_contract_required,
  external_contract_required, payment_contract_required,
  public_runtime_allowed, runtime_activation_allowed,
  release_state, access_state,
  blocker_reason, source_oar2_path, metadata
) VALUES (
  'measures_registry_runtime_admission',
  'measures_registry',
  'system',
  'not_seated',
  true, true, true, true, true, true, true, true, true,
  false, false,
  false, false,
  'held', 'held',
  'Runtime admission cannot be granted until optics, evidence, trace, correction, AI action boundary, and role contracts are seated.',
  'docs/oar/c3_field/oar2_seat_c3_field_runtime_admission_view_v1.meta.md',
  jsonb_build_object(
    'depends_on_spine', 'measures_of_inanna',
    'spine_passage_key', 'measures_of_inanna_spine_passage_law',
    'runtime_admission_state', 'not_seated',
    'standing_note', 'Measures Registry is registered but not runtime-admitted.'
  )
) ON CONFLICT (admission_key) DO NOTHING;

INSERT INTO public.c3_runtime_admission_contract (
  admission_key, system_key, admission_scope, admission_state,
  registered_system_required, passage_law_required, canopy_law_required,
  optics_contract_required, evidence_contract_required, trace_contract_required,
  correction_contract_required, ai_action_boundary_required, role_contract_required,
  external_contract_required, payment_contract_required,
  public_runtime_allowed, runtime_activation_allowed,
  release_state, access_state,
  blocker_reason, source_oar2_path, metadata
) VALUES (
  'measures_of_inanna_runtime_admission',
  'measures_of_inanna',
  'system',
  'not_seated',
  true, true, true, true, true, true, true, true, true,
  false, false,
  false, false,
  'held', 'held',
  'Spine standing is registered and held; runtime admission requires optics, evidence, trace, correction, AI action boundary, and role contracts.',
  'docs/oar/c3_field/oar2_seat_c3_field_runtime_admission_view_v1.meta.md',
  jsonb_build_object(
    'registered_role', 'spine',
    'spine_role', 'immutable_passage_pattern',
    'runtime_admission_state', 'not_seated',
    'standing_note', 'Measures of Inanna is registered spine standing but not runtime-admitted.'
  )
) ON CONFLICT (admission_key) DO NOTHING;

-- ── VIEW: v_c3_field_runtime_admission_v1 ────────────────────────────────────
CREATE OR REPLACE VIEW public.v_c3_field_runtime_admission_v1 AS
SELECT
  rs.system_key,
  rs.system_name,
  rs.standing                                AS registration_standing,
  rs.registration_state,
  rs.implementation_pattern,
  rs.system_scope,
  rac.admission_key,
  rac.admission_scope,
  rac.admission_state,
  rac.release_state,
  rac.access_state,
  rac.public_runtime_allowed,
  rac.runtime_activation_allowed,
  (rs.standing = 'registered')               AS registered_system_valid,
  rac.passage_law_required,
  rac.canopy_law_required,
  rac.optics_contract_required,
  rac.evidence_contract_required,
  rac.trace_contract_required,
  rac.correction_contract_required,
  rac.ai_action_boundary_required,
  rac.role_contract_required,
  rac.external_contract_required,
  rac.payment_contract_required,
  (
    rs.standing = 'registered'
    AND rac.admission_state = 'admitted'
    AND rac.release_state = 'released'
    AND rac.access_state NOT IN ('held', 'blocked', 'revoked')
    AND (rac.public_runtime_allowed = true OR rac.runtime_activation_allowed = true)
  )                                          AS runtime_admission_resolved,
  rac.blocker_reason                         AS runtime_blocked_reason,
  rac.is_active,
  rac.created_at,
  rac.updated_at
FROM public.c3_registered_system rs
JOIN public.c3_runtime_admission_contract rac ON rac.system_key = rs.system_key
WHERE rs.is_active = true AND rac.is_active = true
ORDER BY rs.system_key;
