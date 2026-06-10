-- OAR2: docs/oar/c3_field/oar2_seat_c3_field_optics_evidence_trace_correction_contracts_v1.meta.md

-- ── TABLE: c3_optics_contract ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.c3_optics_contract (
  id                        uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  optics_key                text        NOT NULL UNIQUE,
  system_key                text        NOT NULL,
  optics_scope              text        NOT NULL DEFAULT 'system',
  optics_state              text        NOT NULL DEFAULT 'held',
  display_allowed           boolean     NOT NULL DEFAULT false,
  interpretation_allowed    boolean     NOT NULL DEFAULT false,
  public_surface_allowed    boolean     NOT NULL DEFAULT false,
  requires_evidence         boolean     NOT NULL DEFAULT true,
  requires_trace            boolean     NOT NULL DEFAULT true,
  requires_correction_path  boolean     NOT NULL DEFAULT true,
  source_oar2_path          text        NOT NULL,
  source_oar1_path          text,
  metadata                  jsonb       NOT NULL DEFAULT '{}'::jsonb,
  is_active                 boolean     NOT NULL DEFAULT true,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT c3_optics_contract_scope_check
    CHECK (optics_scope IN ('system', 'passage', 'canopy', 'encounter', 'field')),
  CONSTRAINT c3_optics_contract_state_check
    CHECK (optics_state IN ('held', 'draft', 'ready', 'released', 'blocked', 'revoked'))
);

-- ── TABLE: c3_evidence_contract ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.c3_evidence_contract (
  id                              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_key                    text        NOT NULL UNIQUE,
  system_key                      text        NOT NULL,
  evidence_scope                  text        NOT NULL DEFAULT 'system',
  evidence_state                  text        NOT NULL DEFAULT 'held',
  evidence_required               boolean     NOT NULL DEFAULT true,
  source_required                 boolean     NOT NULL DEFAULT true,
  operator_attestation_required   boolean     NOT NULL DEFAULT true,
  execution_artifact_required     boolean     NOT NULL DEFAULT true,
  public_claim_allowed            boolean     NOT NULL DEFAULT false,
  source_oar2_path                text        NOT NULL,
  source_oar1_path                text,
  metadata                        jsonb       NOT NULL DEFAULT '{}'::jsonb,
  is_active                       boolean     NOT NULL DEFAULT true,
  created_at                      timestamptz NOT NULL DEFAULT now(),
  updated_at                      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT c3_evidence_contract_scope_check
    CHECK (evidence_scope IN ('system', 'passage', 'canopy', 'encounter', 'runtime_admission', 'correction', 'public_claim')),
  CONSTRAINT c3_evidence_contract_state_check
    CHECK (evidence_state IN ('held', 'draft', 'ready', 'accepted', 'blocked', 'revoked'))
);

-- ── TABLE: c3_trace_contract ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.c3_trace_contract (
  id                        uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  trace_key                 text        NOT NULL UNIQUE,
  system_key                text        NOT NULL,
  trace_scope               text        NOT NULL DEFAULT 'system',
  trace_state               text        NOT NULL DEFAULT 'held',
  oar_required              boolean     NOT NULL DEFAULT true,
  execution_log_required    boolean     NOT NULL DEFAULT true,
  actor_required            boolean     NOT NULL DEFAULT true,
  timestamp_required        boolean     NOT NULL DEFAULT true,
  source_diff_required      boolean     NOT NULL DEFAULT true,
  ai_assist_trace_required  boolean     NOT NULL DEFAULT true,
  source_oar2_path          text        NOT NULL,
  source_oar1_path          text,
  metadata                  jsonb       NOT NULL DEFAULT '{}'::jsonb,
  is_active                 boolean     NOT NULL DEFAULT true,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT c3_trace_contract_scope_check
    CHECK (trace_scope IN ('system', 'runtime_admission', 'schema', 'source', 'public_route', 'ai_action', 'correction')),
  CONSTRAINT c3_trace_contract_state_check
    CHECK (trace_state IN ('held', 'draft', 'ready', 'active', 'blocked', 'revoked'))
);

-- ── TABLE: c3_correction_contract ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.c3_correction_contract (
  id                          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  correction_key              text        NOT NULL UNIQUE,
  system_key                  text        NOT NULL,
  correction_scope            text        NOT NULL DEFAULT 'system',
  correction_state            text        NOT NULL DEFAULT 'held',
  revocation_allowed          boolean     NOT NULL DEFAULT true,
  rollback_required           boolean     NOT NULL DEFAULT true,
  operator_review_required    boolean     NOT NULL DEFAULT true,
  evidence_required           boolean     NOT NULL DEFAULT true,
  trace_required              boolean     NOT NULL DEFAULT true,
  public_notice_required      boolean     NOT NULL DEFAULT false,
  source_oar2_path            text        NOT NULL,
  source_oar1_path            text,
  metadata                    jsonb       NOT NULL DEFAULT '{}'::jsonb,
  is_active                   boolean     NOT NULL DEFAULT true,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT c3_correction_contract_scope_check
    CHECK (correction_scope IN ('system', 'runtime_admission', 'public_route', 'assessment', 'ai_action', 'contract', 'source')),
  CONSTRAINT c3_correction_contract_state_check
    CHECK (correction_state IN ('held', 'draft', 'ready', 'active', 'blocked', 'revoked'))
);

-- ── TABLE: c3_ai_action_boundary ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.c3_ai_action_boundary (
  id                               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  boundary_key                     text        NOT NULL UNIQUE,
  system_key                       text        NOT NULL,
  boundary_scope                   text        NOT NULL DEFAULT 'system',
  boundary_state                   text        NOT NULL DEFAULT 'held',
  ai_role                          text        NOT NULL DEFAULT 'assistant_executor_support',
  authority_allowed                boolean     NOT NULL DEFAULT false,
  mutation_allowed                 boolean     NOT NULL DEFAULT false,
  proposal_allowed                 boolean     NOT NULL DEFAULT true,
  execution_allowed                boolean     NOT NULL DEFAULT false,
  requires_oar                     boolean     NOT NULL DEFAULT true,
  requires_operator_confirmation   boolean     NOT NULL DEFAULT true,
  requires_evidence                boolean     NOT NULL DEFAULT true,
  requires_trace                   boolean     NOT NULL DEFAULT true,
  public_claim_allowed             boolean     NOT NULL DEFAULT false,
  source_oar2_path                 text        NOT NULL,
  source_oar1_path                 text,
  metadata                         jsonb       NOT NULL DEFAULT '{}'::jsonb,
  is_active                        boolean     NOT NULL DEFAULT true,
  created_at                       timestamptz NOT NULL DEFAULT now(),
  updated_at                       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT c3_ai_action_boundary_scope_check
    CHECK (boundary_scope IN ('system', 'runtime_admission', 'source', 'public_route', 'assessment', 'communication', 'correction')),
  CONSTRAINT c3_ai_action_boundary_state_check
    CHECK (boundary_state IN ('held', 'draft', 'ready', 'active', 'blocked', 'revoked'))
);

-- ── TABLE: c3_role_contract ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.c3_role_contract (
  id                              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  role_key                        text        NOT NULL UNIQUE,
  system_key                      text        NOT NULL,
  role_scope                      text        NOT NULL DEFAULT 'system',
  role_name                       text        NOT NULL,
  role_state                      text        NOT NULL DEFAULT 'held',
  runtime_authority_allowed       boolean     NOT NULL DEFAULT false,
  mutation_authority_allowed      boolean     NOT NULL DEFAULT false,
  review_authority_allowed        boolean     NOT NULL DEFAULT false,
  operator_confirmation_required  boolean     NOT NULL DEFAULT true,
  source_oar2_path                text        NOT NULL,
  source_oar1_path                text,
  metadata                        jsonb       NOT NULL DEFAULT '{}'::jsonb,
  is_active                       boolean     NOT NULL DEFAULT true,
  created_at                      timestamptz NOT NULL DEFAULT now(),
  updated_at                      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT c3_role_contract_scope_check
    CHECK (role_scope IN ('system', 'runtime_admission', 'source', 'public_route', 'assessment', 'correction')),
  CONSTRAINT c3_role_contract_state_check
    CHECK (role_state IN ('held', 'draft', 'ready', 'active', 'blocked', 'revoked'))
);

-- ── TRIGGERS ──────────────────────────────────────────────────────────────────
CREATE TRIGGER c3_optics_contract_set_updated_at
  BEFORE UPDATE ON public.c3_optics_contract
  FOR EACH ROW EXECUTE FUNCTION public.c3_oar_set_updated_at();

CREATE TRIGGER c3_evidence_contract_set_updated_at
  BEFORE UPDATE ON public.c3_evidence_contract
  FOR EACH ROW EXECUTE FUNCTION public.c3_oar_set_updated_at();

CREATE TRIGGER c3_trace_contract_set_updated_at
  BEFORE UPDATE ON public.c3_trace_contract
  FOR EACH ROW EXECUTE FUNCTION public.c3_oar_set_updated_at();

CREATE TRIGGER c3_correction_contract_set_updated_at
  BEFORE UPDATE ON public.c3_correction_contract
  FOR EACH ROW EXECUTE FUNCTION public.c3_oar_set_updated_at();

CREATE TRIGGER c3_ai_action_boundary_set_updated_at
  BEFORE UPDATE ON public.c3_ai_action_boundary
  FOR EACH ROW EXECUTE FUNCTION public.c3_oar_set_updated_at();

CREATE TRIGGER c3_role_contract_set_updated_at
  BEFORE UPDATE ON public.c3_role_contract
  FOR EACH ROW EXECUTE FUNCTION public.c3_oar_set_updated_at();

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE public.c3_optics_contract      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.c3_evidence_contract    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.c3_trace_contract       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.c3_correction_contract  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.c3_ai_action_boundary   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.c3_role_contract        ENABLE ROW LEVEL SECURITY;

CREATE POLICY "c3_optics_contract_public_read"
  ON public.c3_optics_contract FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "c3_evidence_contract_public_read"
  ON public.c3_evidence_contract FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "c3_trace_contract_public_read"
  ON public.c3_trace_contract FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "c3_correction_contract_public_read"
  ON public.c3_correction_contract FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "c3_ai_action_boundary_public_read"
  ON public.c3_ai_action_boundary FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "c3_role_contract_public_read"
  ON public.c3_role_contract FOR SELECT TO anon, authenticated USING (true);

-- ── BASE HELD ROWS: measures_registry ─────────────────────────────────────────
INSERT INTO public.c3_optics_contract (
  optics_key, system_key, optics_scope, optics_state,
  display_allowed, interpretation_allowed, public_surface_allowed,
  requires_evidence, requires_trace, requires_correction_path,
  source_oar2_path, metadata
) VALUES (
  'measures_registry_optics_contract', 'measures_registry', 'system', 'held',
  false, false, false, true, true, true,
  'docs/oar/c3_field/oar2_seat_c3_field_optics_evidence_trace_correction_contracts_v1.meta.md',
  jsonb_build_object('standing_note', 'Measures Registry optics contract seated as held; no display or interpretation permitted.')
) ON CONFLICT (optics_key) DO NOTHING;

INSERT INTO public.c3_evidence_contract (
  evidence_key, system_key, evidence_scope, evidence_state,
  evidence_required, source_required, operator_attestation_required,
  execution_artifact_required, public_claim_allowed,
  source_oar2_path, metadata
) VALUES (
  'measures_registry_evidence_contract', 'measures_registry', 'system', 'held',
  true, true, true, true, false,
  'docs/oar/c3_field/oar2_seat_c3_field_optics_evidence_trace_correction_contracts_v1.meta.md',
  jsonb_build_object('standing_note', 'Measures Registry evidence contract seated as held; public claim not permitted.')
) ON CONFLICT (evidence_key) DO NOTHING;

INSERT INTO public.c3_trace_contract (
  trace_key, system_key, trace_scope, trace_state,
  oar_required, execution_log_required, actor_required,
  timestamp_required, source_diff_required, ai_assist_trace_required,
  source_oar2_path, metadata
) VALUES (
  'measures_registry_trace_contract', 'measures_registry', 'system', 'held',
  true, true, true, true, true, true,
  'docs/oar/c3_field/oar2_seat_c3_field_optics_evidence_trace_correction_contracts_v1.meta.md',
  jsonb_build_object('standing_note', 'Measures Registry trace contract seated as held.')
) ON CONFLICT (trace_key) DO NOTHING;

INSERT INTO public.c3_correction_contract (
  correction_key, system_key, correction_scope, correction_state,
  revocation_allowed, rollback_required, operator_review_required,
  evidence_required, trace_required, public_notice_required,
  source_oar2_path, metadata
) VALUES (
  'measures_registry_correction_contract', 'measures_registry', 'system', 'held',
  true, true, true, true, true, false,
  'docs/oar/c3_field/oar2_seat_c3_field_optics_evidence_trace_correction_contracts_v1.meta.md',
  jsonb_build_object('standing_note', 'Measures Registry correction contract seated as held.')
) ON CONFLICT (correction_key) DO NOTHING;

INSERT INTO public.c3_ai_action_boundary (
  boundary_key, system_key, boundary_scope, boundary_state, ai_role,
  authority_allowed, mutation_allowed, proposal_allowed, execution_allowed,
  requires_oar, requires_operator_confirmation, requires_evidence, requires_trace,
  public_claim_allowed,
  source_oar2_path, metadata
) VALUES (
  'measures_registry_ai_action_boundary', 'measures_registry', 'system', 'held',
  'assistant_executor_support',
  false, false, true, false,
  true, true, true, true, false,
  'docs/oar/c3_field/oar2_seat_c3_field_optics_evidence_trace_correction_contracts_v1.meta.md',
  jsonb_build_object('standing_note', 'AI may not be authority; mutation and execution not permitted.')
) ON CONFLICT (boundary_key) DO NOTHING;

INSERT INTO public.c3_role_contract (
  role_key, system_key, role_scope, role_name, role_state,
  runtime_authority_allowed, mutation_authority_allowed, review_authority_allowed,
  operator_confirmation_required,
  source_oar2_path, metadata
) VALUES (
  'measures_registry_role_contract', 'measures_registry', 'system',
  'Measures Registry Role Contract', 'held',
  false, false, false, true,
  'docs/oar/c3_field/oar2_seat_c3_field_optics_evidence_trace_correction_contracts_v1.meta.md',
  jsonb_build_object('standing_note', 'Measures Registry role contract seated as held; no authority granted.')
) ON CONFLICT (role_key) DO NOTHING;

-- ── BASE HELD ROWS: measures_of_inanna ────────────────────────────────────────
INSERT INTO public.c3_optics_contract (
  optics_key, system_key, optics_scope, optics_state,
  display_allowed, interpretation_allowed, public_surface_allowed,
  requires_evidence, requires_trace, requires_correction_path,
  source_oar2_path, metadata
) VALUES (
  'measures_of_inanna_optics_contract', 'measures_of_inanna', 'system', 'held',
  false, false, false, true, true, true,
  'docs/oar/c3_field/oar2_seat_c3_field_optics_evidence_trace_correction_contracts_v1.meta.md',
  jsonb_build_object('standing_note', 'Measures of Inanna optics contract seated as held; no display or interpretation permitted.')
) ON CONFLICT (optics_key) DO NOTHING;

INSERT INTO public.c3_evidence_contract (
  evidence_key, system_key, evidence_scope, evidence_state,
  evidence_required, source_required, operator_attestation_required,
  execution_artifact_required, public_claim_allowed,
  source_oar2_path, metadata
) VALUES (
  'measures_of_inanna_evidence_contract', 'measures_of_inanna', 'system', 'held',
  true, true, true, true, false,
  'docs/oar/c3_field/oar2_seat_c3_field_optics_evidence_trace_correction_contracts_v1.meta.md',
  jsonb_build_object('standing_note', 'Measures of Inanna evidence contract seated as held; public claim not permitted.')
) ON CONFLICT (evidence_key) DO NOTHING;

INSERT INTO public.c3_trace_contract (
  trace_key, system_key, trace_scope, trace_state,
  oar_required, execution_log_required, actor_required,
  timestamp_required, source_diff_required, ai_assist_trace_required,
  source_oar2_path, metadata
) VALUES (
  'measures_of_inanna_trace_contract', 'measures_of_inanna', 'system', 'held',
  true, true, true, true, true, true,
  'docs/oar/c3_field/oar2_seat_c3_field_optics_evidence_trace_correction_contracts_v1.meta.md',
  jsonb_build_object('standing_note', 'Measures of Inanna trace contract seated as held.')
) ON CONFLICT (trace_key) DO NOTHING;

INSERT INTO public.c3_correction_contract (
  correction_key, system_key, correction_scope, correction_state,
  revocation_allowed, rollback_required, operator_review_required,
  evidence_required, trace_required, public_notice_required,
  source_oar2_path, metadata
) VALUES (
  'measures_of_inanna_correction_contract', 'measures_of_inanna', 'system', 'held',
  true, true, true, true, true, false,
  'docs/oar/c3_field/oar2_seat_c3_field_optics_evidence_trace_correction_contracts_v1.meta.md',
  jsonb_build_object('standing_note', 'Measures of Inanna correction contract seated as held.')
) ON CONFLICT (correction_key) DO NOTHING;

INSERT INTO public.c3_ai_action_boundary (
  boundary_key, system_key, boundary_scope, boundary_state, ai_role,
  authority_allowed, mutation_allowed, proposal_allowed, execution_allowed,
  requires_oar, requires_operator_confirmation, requires_evidence, requires_trace,
  public_claim_allowed,
  source_oar2_path, metadata
) VALUES (
  'measures_of_inanna_ai_action_boundary', 'measures_of_inanna', 'system', 'held',
  'assistant_executor_support',
  false, false, true, false,
  true, true, true, true, false,
  'docs/oar/c3_field/oar2_seat_c3_field_optics_evidence_trace_correction_contracts_v1.meta.md',
  jsonb_build_object('standing_note', 'AI may not be authority over Inanna spine; mutation and execution not permitted.')
) ON CONFLICT (boundary_key) DO NOTHING;

INSERT INTO public.c3_role_contract (
  role_key, system_key, role_scope, role_name, role_state,
  runtime_authority_allowed, mutation_authority_allowed, review_authority_allowed,
  operator_confirmation_required,
  source_oar2_path, metadata
) VALUES (
  'measures_of_inanna_role_contract', 'measures_of_inanna', 'system',
  'Measures of Inanna Role Contract', 'held',
  false, false, false, true,
  'docs/oar/c3_field/oar2_seat_c3_field_optics_evidence_trace_correction_contracts_v1.meta.md',
  jsonb_build_object('standing_note', 'Measures of Inanna role contract seated as held; no authority granted.')
) ON CONFLICT (role_key) DO NOTHING;

-- ── VIEW: v_c3_contract_readiness_v1 ─────────────────────────────────────────
CREATE OR REPLACE VIEW public.v_c3_contract_readiness_v1 AS
SELECT
  rs.system_key,
  rs.system_name,
  COALESCE(oc.optics_state,     'not_seated') AS optics_state,
  COALESCE(ec.evidence_state,   'not_seated') AS evidence_state,
  COALESCE(tc.trace_state,      'not_seated') AS trace_state,
  COALESCE(cc.correction_state, 'not_seated') AS correction_state,
  COALESCE(rc.role_state,       'not_seated') AS role_state,
  (
    COALESCE(oc.optics_state,     'not_seated') IN ('ready', 'released')
    AND COALESCE(ec.evidence_state,   'not_seated') IN ('ready', 'accepted')
    AND COALESCE(tc.trace_state,      'not_seated') IN ('ready', 'active')
    AND COALESCE(cc.correction_state, 'not_seated') IN ('ready', 'active')
    AND COALESCE(rc.role_state,       'not_seated') IN ('ready', 'active')
  ) AS all_contracts_ready,
  CASE
    WHEN COALESCE(oc.optics_state, 'not_seated') NOT IN ('ready', 'released')
      THEN 'optics_contract not ready'
    WHEN COALESCE(ec.evidence_state, 'not_seated') NOT IN ('ready', 'accepted')
      THEN 'evidence_contract not ready'
    WHEN COALESCE(tc.trace_state, 'not_seated') NOT IN ('ready', 'active')
      THEN 'trace_contract not ready'
    WHEN COALESCE(cc.correction_state, 'not_seated') NOT IN ('ready', 'active')
      THEN 'correction_contract not ready'
    WHEN COALESCE(rc.role_state, 'not_seated') NOT IN ('ready', 'active')
      THEN 'role_contract not ready'
    ELSE NULL
  END AS contract_blocked_reason
FROM public.c3_registered_system rs
LEFT JOIN public.c3_optics_contract oc
  ON oc.system_key = rs.system_key AND oc.is_active = true
LEFT JOIN public.c3_evidence_contract ec
  ON ec.system_key = rs.system_key AND ec.is_active = true
LEFT JOIN public.c3_trace_contract tc
  ON tc.system_key = rs.system_key AND tc.is_active = true
LEFT JOIN public.c3_correction_contract cc
  ON cc.system_key = rs.system_key AND cc.is_active = true
LEFT JOIN public.c3_role_contract rc
  ON rc.system_key = rs.system_key AND rc.is_active = true
WHERE rs.is_active = true
ORDER BY rs.system_key;

-- ── VIEW: v_c3_ai_action_boundary_v1 ─────────────────────────────────────────
CREATE OR REPLACE VIEW public.v_c3_ai_action_boundary_v1 AS
SELECT
  boundary_key,
  system_key,
  boundary_scope,
  boundary_state,
  ai_role,
  authority_allowed,
  mutation_allowed,
  proposal_allowed,
  execution_allowed,
  requires_oar,
  requires_operator_confirmation,
  public_claim_allowed,
  is_active,
  created_at,
  updated_at
FROM public.c3_ai_action_boundary
WHERE is_active = true
ORDER BY system_key, boundary_scope;
