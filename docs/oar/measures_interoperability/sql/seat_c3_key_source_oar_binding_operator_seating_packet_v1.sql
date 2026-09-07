-- c3 Key Source OAR Binding Operator Seating Packet v1
-- Source OAR2: docs/oar/measures_interoperability/oar2_c3_key_source_oar_binding_operator_seating_packet_v1.meta.md
--
-- This seats a protected operator RPC for source / OAR binding rows. It does
-- not issue temporary c3 Keys, call assign_temp_c3_key, grant permissions,
-- wire runtime, open public access, bind wallets, mint NFTs, activate
-- DAO/distribution/payment, or create recognition/conversion standing.

ALTER TABLE public.c3_key_system_function_audit
  DROP CONSTRAINT IF EXISTS c3_key_system_function_audit_function_name_check;

ALTER TABLE public.c3_key_system_function_audit
  ADD CONSTRAINT c3_key_system_function_audit_function_name_check
  CHECK (
    function_name IN (
      'assign_temp_c3_key',
      'seat_c3_key_source_oar_binding',
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
  );

CREATE OR REPLACE FUNCTION public.seat_c3_key_source_oar_binding(
  p_source_record_type text,
  p_source_record_id text,
  p_source_oar_id text,
  p_source_oar_path text,
  p_operator_ref text,
  p_operator_authorization_method text,
  p_binding_status text DEFAULT 'active',
  p_support_safe boolean DEFAULT true,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE (
  binding_id uuid,
  source_record_type text,
  source_record_id text,
  source_oar_id text,
  binding_status text,
  has_active_binding boolean,
  audit_id uuid,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_audit_id uuid;
  v_binding public.c3_key_source_oar_binding%rowtype;
  v_metadata jsonb := coalesce(p_metadata, '{}'::jsonb);
  v_reject_reason text;
  v_hold_reason text;
  v_operator_ref text := coalesce(nullif(btrim(p_operator_ref), ''), '_missing_operator_ref');
  v_source_oar_id text := coalesce(nullif(btrim(p_source_oar_id), ''), '_missing_source_oar_id');
  v_status text := coalesce(nullif(btrim(p_binding_status), ''), 'active');
BEGIN
  v_metadata := v_metadata
    - 'temp_key'
    - 'contact_email'
    - 'contact_email_hash'
    - 'contact_email_encrypted'
    - 'provider_api_key'
    - 'service_role_key'
    - 'raw_email_body'
    - 'raw_agreement_metadata'
    - 'private_payment_data'
    - 'wallet_private_key'
    - 'seed_phrase';

  INSERT INTO public.c3_key_system_function_audit (
    function_name,
    action_type,
    result_status,
    operator_ref,
    source_oar_id,
    input_ref,
    output_ref,
    support_safe,
    metadata
  )
  VALUES (
    'seat_c3_key_source_oar_binding',
    'source_binding',
    'prepared',
    v_operator_ref,
    v_source_oar_id,
    jsonb_build_object(
      'source_record_type', p_source_record_type,
      'source_record_id', p_source_record_id,
      'source_oar_path', p_source_oar_path,
      'binding_status', v_status,
      'support_safe', p_support_safe
    ),
    '{}'::jsonb,
    true,
    jsonb_build_object(
      'source_binding_packet_version', 'v1',
      'operator_seating_packet', true,
      'invocation_guard_passed', false
    ) || v_metadata
  )
  RETURNING id INTO v_audit_id;

  IF nullif(btrim(p_operator_ref), '') IS NULL THEN
    v_reject_reason := 'operator_ref is required';
  ELSIF nullif(btrim(p_source_oar_id), '') IS NULL THEN
    v_reject_reason := 'source_oar_id is required';
  ELSIF p_operator_authorization_method NOT IN (
    'operator_recorded',
    'service_role_admin',
    'governed_internal'
  ) THEN
    v_reject_reason := 'operator authorization method not allowed';
  ELSIF p_source_record_type = 'future_SRC3' THEN
    v_hold_reason := 'future_SRC3 remains held until seated';
  ELSIF p_source_record_type NOT IN ('SRC', 'SRC1', 'SRC2') THEN
    v_reject_reason := 'source_record_type not allowed';
  ELSIF nullif(btrim(p_source_record_id), '') IS NULL THEN
    v_reject_reason := 'source_record_id is required';
  ELSIF nullif(btrim(p_source_oar_path), '') IS NULL THEN
    v_reject_reason := 'source_oar_path is required';
  ELSIF v_status NOT IN ('active', 'held', 'revoked', 'rejected') THEN
    v_reject_reason := 'binding_status not allowed';
  ELSIF p_support_safe IS DISTINCT FROM true THEN
    v_reject_reason := 'support_safe must be true';
  END IF;

  IF v_reject_reason IS NOT NULL OR v_hold_reason IS NOT NULL THEN
    UPDATE public.c3_key_system_function_audit
    SET
      result_status = CASE
        WHEN v_hold_reason IS NOT NULL THEN 'held'
        ELSE 'rejected'
      END,
      output_ref = jsonb_build_object(
        'binding_id', NULL,
        'has_active_binding', false,
        'binding_status', CASE
          WHEN v_hold_reason IS NOT NULL THEN 'held'
          ELSE 'rejected'
        END
      ),
      metadata = metadata || jsonb_build_object(
        'invocation_guard_passed', false,
        'hold_reason', coalesce(v_hold_reason, ''),
        'reject_reason', coalesce(v_reject_reason, '')
      )
    WHERE id = v_audit_id;

    RETURN QUERY
    SELECT
      NULL::uuid,
      p_source_record_type,
      p_source_record_id,
      p_source_oar_id,
      CASE
        WHEN v_hold_reason IS NOT NULL THEN 'held'
        ELSE 'rejected'
      END,
      false,
      v_audit_id,
      NULL::timestamptz,
      NULL::timestamptz;
    RETURN;
  END IF;

  INSERT INTO public.c3_key_source_oar_binding (
    source_record_type,
    source_record_id,
    source_oar_id,
    source_oar_path,
    binding_status,
    operator_ref,
    audit_id,
    support_safe,
    metadata
  )
  VALUES (
    p_source_record_type,
    btrim(p_source_record_id),
    btrim(p_source_oar_id),
    btrim(p_source_oar_path),
    v_status,
    btrim(p_operator_ref),
    v_audit_id,
    true,
    jsonb_build_object(
      'packet_version', 'v1',
      'source_binding_packet_version', 'v1',
      'support_safe', true
    ) || v_metadata
  )
  ON CONFLICT ON CONSTRAINT c3_key_source_oar_binding_unique_source_oar
  DO UPDATE SET
    source_oar_path = EXCLUDED.source_oar_path,
    binding_status = EXCLUDED.binding_status,
    operator_ref = EXCLUDED.operator_ref,
    audit_id = EXCLUDED.audit_id,
    support_safe = true,
    metadata = EXCLUDED.metadata,
    updated_at = now()
  RETURNING *
  INTO v_binding;

  UPDATE public.c3_key_system_function_audit
  SET
    result_status = 'executed',
    output_ref = jsonb_build_object(
      'binding_id', v_binding.id,
      'has_active_binding', v_binding.binding_status = 'active',
      'binding_status', v_binding.binding_status
    ),
    metadata = metadata || jsonb_build_object(
      'invocation_guard_passed', true,
      'binding_id', v_binding.id,
      'has_active_binding', v_binding.binding_status = 'active',
      'binding_status', v_binding.binding_status,
      'hold_reason', '',
      'reject_reason', ''
    )
  WHERE id = v_audit_id;

  RETURN QUERY
  SELECT
    v_binding.id,
    v_binding.source_record_type,
    v_binding.source_record_id,
    v_binding.source_oar_id,
    v_binding.binding_status,
    v_binding.binding_status = 'active',
    v_audit_id,
    v_binding.created_at,
    v_binding.updated_at;
END;
$$;

REVOKE ALL ON FUNCTION public.seat_c3_key_source_oar_binding(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  boolean,
  jsonb
) FROM PUBLIC;

REVOKE ALL ON FUNCTION public.seat_c3_key_source_oar_binding(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  boolean,
  jsonb
) FROM anon;

REVOKE ALL ON FUNCTION public.seat_c3_key_source_oar_binding(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  boolean,
  jsonb
) FROM authenticated;

GRANT EXECUTE ON FUNCTION public.seat_c3_key_source_oar_binding(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  boolean,
  jsonb
) TO service_role;
