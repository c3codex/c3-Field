-- c3 Key System Function Audit Surface v1
-- Source OAR2: docs/oar/measures_interoperability/oar2_c3_key_system_function_audit_surface_v1.meta.md
--
-- This seats an audit table for future protected c3 Key system-function
-- invocations. It does not implement callable c3 Key functions, wire runtime,
-- open public access, bind wallets, mint NFTs, activate payments, or create
-- recognition/conversion standing.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.c3_key_system_function_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  function_name text NOT NULL CHECK (
    function_name IN (
      'assign_temp_c3_key',
      'resolve_c3_key_standing',
      'read_c3_key_support_trace',
      'record_c3_key_agreement_ack',
      'record_c3_key_communication_trace',
      'prepare_wallet_migration',
      'complete_wallet_migration',
      'hold_c3_key_standing',
      'expire_c3_key_standing',
      'revoke_c3_key_standing'
    )
  ),

  action_type text NOT NULL,

  result_status text NOT NULL CHECK (
    result_status IN (
      'prepared',
      'executed',
      'held',
      'failed',
      'rejected',
      'cancelled'
    )
  ),

  operator_ref text NOT NULL,
  source_oar_id text NOT NULL,

  temp_key_id uuid REFERENCES public.c3_key_temp(id) ON DELETE SET NULL,
  public_ref text,

  input_ref jsonb NOT NULL DEFAULT '{}'::jsonb,
  output_ref jsonb NOT NULL DEFAULT '{}'::jsonb,

  support_safe boolean NOT NULL DEFAULT true,

  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT c3_key_system_function_audit_action_type_not_blank_check
    CHECK (length(btrim(action_type)) > 0),
  CONSTRAINT c3_key_system_function_audit_operator_ref_not_blank_check
    CHECK (length(btrim(operator_ref)) > 0),
  CONSTRAINT c3_key_system_function_audit_source_oar_not_blank_check
    CHECK (length(btrim(source_oar_id)) > 0),
  CONSTRAINT c3_key_system_function_audit_public_ref_not_blank_check
    CHECK (public_ref IS NULL OR length(btrim(public_ref)) > 0),
  CONSTRAINT c3_key_system_function_audit_input_ref_object_check
    CHECK (jsonb_typeof(input_ref) = 'object'),
  CONSTRAINT c3_key_system_function_audit_output_ref_object_check
    CHECK (jsonb_typeof(output_ref) = 'object'),
  CONSTRAINT c3_key_system_function_audit_metadata_object_check
    CHECK (jsonb_typeof(metadata) = 'object'),
  CONSTRAINT c3_key_system_function_audit_support_safe_required_check
    CHECK (support_safe IS TRUE)
);

ALTER TABLE public.c3_key_system_function_audit ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS c3_key_system_function_audit_function_idx
  ON public.c3_key_system_function_audit (function_name, action_type, result_status);

CREATE INDEX IF NOT EXISTS c3_key_system_function_audit_operator_idx
  ON public.c3_key_system_function_audit (operator_ref, created_at);

CREATE INDEX IF NOT EXISTS c3_key_system_function_audit_source_oar_idx
  ON public.c3_key_system_function_audit (source_oar_id);

CREATE INDEX IF NOT EXISTS c3_key_system_function_audit_temp_key_idx
  ON public.c3_key_system_function_audit (temp_key_id, created_at);

CREATE INDEX IF NOT EXISTS c3_key_system_function_audit_public_ref_idx
  ON public.c3_key_system_function_audit (public_ref);
