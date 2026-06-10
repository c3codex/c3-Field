-- OAR2: docs/oar/c3_field/oar2_seat_non_ant_c3_field_passage_and_canopy_law_schema_v1.meta.md

-- ── TABLE: c3_passage_law ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.c3_passage_law (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  passage_key text NOT NULL UNIQUE,
  passage_name text NOT NULL,
  passage_type text NOT NULL,
  source_system_key text,
  target_system_key text,
  source_chamber_key text,
  target_chamber_key text,
  source_registry_key text,
  target_registry_key text,
  passage_state text NOT NULL DEFAULT 'held',
  release_state text NOT NULL DEFAULT 'held',
  access_state text NOT NULL DEFAULT 'held',
  requires_runtime_admission boolean NOT NULL DEFAULT true,
  requires_optics_contract boolean NOT NULL DEFAULT true,
  requires_evidence_contract boolean NOT NULL DEFAULT true,
  requires_trace_contract boolean NOT NULL DEFAULT true,
  requires_correction_contract boolean NOT NULL DEFAULT true,
  source_oar2_path text NOT NULL,
  source_oar1_path text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT c3_passage_law_passage_type_check
    CHECK (passage_type IN ('same_family', 'cross_family', 'secure_external', 'return_state', 'internal_transition')),
  CONSTRAINT c3_passage_law_passage_state_check
    CHECK (passage_state IN ('held', 'draft', 'ready', 'released', 'blocked', 'deprecated'))
);

-- ── TABLE: c3_canopy_law ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.c3_canopy_law (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  canopy_key text NOT NULL UNIQUE,
  canopy_name text NOT NULL,
  canopy_type text NOT NULL,
  system_key text,
  carrier_state text NOT NULL DEFAULT 'held',
  communication_state text NOT NULL DEFAULT 'held',
  encounter_state text NOT NULL DEFAULT 'held',
  visibility_state text NOT NULL DEFAULT 'private_held',
  runtime_admission_state text NOT NULL DEFAULT 'not_seated',
  source_oar2_path text NOT NULL,
  source_oar1_path text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT c3_canopy_law_canopy_type_check
    CHECK (canopy_type IN ('carrier', 'communication', 'encounter', 'signal_surface', 'public_surface', 'private_surface')),
  CONSTRAINT c3_canopy_law_runtime_admission_state_check
    CHECK (runtime_admission_state IN ('not_seated', 'held', 'ready', 'admitted', 'blocked'))
);

-- ── TABLE: c3_signal_law ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.c3_signal_law (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_key text NOT NULL UNIQUE,
  signal_type text NOT NULL,
  source_system_key text,
  target_system_key text,
  source_passage_key text,
  target_passage_key text,
  signal_state text NOT NULL DEFAULT 'held',
  trace_required boolean NOT NULL DEFAULT true,
  evidence_required boolean NOT NULL DEFAULT true,
  redaction_required boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  source_oar2_path text NOT NULL,
  source_oar1_path text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT c3_signal_law_signal_state_check
    CHECK (signal_state IN ('held', 'draft', 'ready', 'released', 'blocked', 'deprecated'))
);

-- ── TABLE: c3_attachment_law ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.c3_attachment_law (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attachment_key text NOT NULL UNIQUE,
  attachment_type text NOT NULL,
  source_system_key text,
  target_system_key text,
  source_signal_key text,
  attachment_state text NOT NULL DEFAULT 'held',
  storage_boundary text NOT NULL DEFAULT 'codex_reference_only',
  sensitive_data_allowed boolean NOT NULL DEFAULT false,
  redaction_required boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  source_oar2_path text NOT NULL,
  source_oar1_path text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT c3_attachment_law_attachment_state_check
    CHECK (attachment_state IN ('held', 'draft', 'ready', 'released', 'blocked', 'deprecated')),
  CONSTRAINT c3_attachment_law_storage_boundary_check
    CHECK (storage_boundary IN ('codex_reference_only', 'public_media_reference', 'private_media_reference', 'external_reference', 'redacted_reference'))
);

-- ── TRIGGERS ──────────────────────────────────────────────────────────────────
CREATE TRIGGER c3_passage_law_set_updated_at
  BEFORE UPDATE ON public.c3_passage_law
  FOR EACH ROW EXECUTE FUNCTION public.c3_oar_set_updated_at();

CREATE TRIGGER c3_canopy_law_set_updated_at
  BEFORE UPDATE ON public.c3_canopy_law
  FOR EACH ROW EXECUTE FUNCTION public.c3_oar_set_updated_at();

CREATE TRIGGER c3_signal_law_set_updated_at
  BEFORE UPDATE ON public.c3_signal_law
  FOR EACH ROW EXECUTE FUNCTION public.c3_oar_set_updated_at();

CREATE TRIGGER c3_attachment_law_set_updated_at
  BEFORE UPDATE ON public.c3_attachment_law
  FOR EACH ROW EXECUTE FUNCTION public.c3_oar_set_updated_at();

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE public.c3_passage_law    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.c3_canopy_law     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.c3_signal_law     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.c3_attachment_law ENABLE ROW LEVEL SECURITY;

CREATE POLICY "c3_passage_law_public_read"
  ON public.c3_passage_law FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "c3_canopy_law_public_read"
  ON public.c3_canopy_law FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "c3_signal_law_public_read"
  ON public.c3_signal_law FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "c3_attachment_law_public_read"
  ON public.c3_attachment_law FOR SELECT TO anon, authenticated USING (true);

-- ── VIEWS ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW public.v_c3_passage_law_v1 AS
SELECT
  passage_key, passage_name, passage_type,
  passage_state, release_state, access_state,
  requires_runtime_admission, is_active, created_at, updated_at
FROM public.c3_passage_law
ORDER BY created_at;

CREATE OR REPLACE VIEW public.v_c3_canopy_law_v1 AS
SELECT
  canopy_key, canopy_name, canopy_type,
  carrier_state, communication_state, encounter_state,
  visibility_state, runtime_admission_state, is_active, created_at, updated_at
FROM public.c3_canopy_law
ORDER BY created_at;

-- ── BASE HELD ROWS ────────────────────────────────────────────────────────────
INSERT INTO public.c3_passage_law (
  passage_key, passage_name, passage_type,
  passage_state, release_state, access_state,
  source_oar2_path, metadata
) VALUES (
  'c3_field_passage_law_base', 'c3 Field Passage Law Base', 'internal_transition',
  'held', 'held', 'held',
  'docs/oar/c3_field/oar2_seat_non_ant_c3_field_passage_and_canopy_law_schema_v1.meta.md',
  jsonb_build_object(
    'ant_replacement', true,
    'runtime_admission_state', 'not_seated',
    'standing_note', 'Base passage law seated; runtime admission not seated.'
  )
) ON CONFLICT (passage_key) DO NOTHING;

INSERT INTO public.c3_canopy_law (
  canopy_key, canopy_name, canopy_type,
  carrier_state, communication_state, encounter_state,
  visibility_state, runtime_admission_state,
  source_oar2_path, metadata
) VALUES (
  'c3_field_canopy_law_base', 'c3 Field Canopy Law Base', 'carrier',
  'held', 'held', 'held',
  'private_held', 'not_seated',
  'docs/oar/c3_field/oar2_seat_non_ant_c3_field_passage_and_canopy_law_schema_v1.meta.md',
  jsonb_build_object(
    'ant_replacement', true,
    'standing_note', 'Base canopy law seated; no runtime admission.'
  )
) ON CONFLICT (canopy_key) DO NOTHING;

-- ── DROP REMAINING LEGACY-HELD ANT OBJECTS ────────────────────────────────────
-- ant_attachment_map and ant_passage_state have FK on ant_envelope — drop dependents first
DROP TABLE IF EXISTS public.ant_attachment_map;
DROP TABLE IF EXISTS public.ant_passage_state;
DROP TABLE IF EXISTS public.ant_envelope;
DROP FUNCTION IF EXISTS public.ensure_ant_passage_state();
