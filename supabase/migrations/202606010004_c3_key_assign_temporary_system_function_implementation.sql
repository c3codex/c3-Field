-- c3 Key Assign Temporary System Function Implementation v1
-- Source OAR2: docs/oar/measures_interoperability/oar2_c3_key_assign_temporary_system_function_implementation_v1.meta.md
--
-- This seats a protected, audit-first, support-safe assignment RPC. It does
-- not grant or activate permissions, wire runtime, open public access, bind
-- wallets, mint NFTs, activate DAO/distribution/payment, or create
-- recognition/conversion standing.

CREATE OR REPLACE FUNCTION public.assign_temp_c3_key(
  p_function_name text,
  p_action_type text,
  p_operator_ref text,
  p_operator_authorization_method text,
  p_source_record_type text,
  p_source_record_id text,
  p_source_oar_id text,
  p_source_oar_path text,
  p_origin_type text,
  p_named_individual_ref text,
  p_institution_key text,
  p_agreement_version text,
  p_agreement_hash text,
  p_agreement_acknowledgment_method text,
  p_expires_at timestamptz,
  p_payment_route text DEFAULT NULL,
  p_payment_status text DEFAULT 'not_required',
  p_assessment_credit_status text DEFAULT 'none',
  p_agreement_title text DEFAULT 'c3 Key Temporary Assignment Agreement',
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE (
  temp_key_id uuid,
  public_ref text,
  status text,
  origin_type text,
  institution_key text,
  agreement_acknowledged boolean,
  agreement_version text,
  created_at timestamptz,
  expires_at timestamptz,
  audit_id uuid,
  communication_trace_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_audit_id uuid;
  v_ack_id uuid;
  v_issued record;
  v_metadata jsonb := coalesce(p_metadata, '{}'::jsonb);
  v_reject_reason text;
  v_status text;
  v_now timestamptz := now();
BEGIN
  IF nullif(btrim(p_operator_ref), '') IS NULL THEN
    RAISE EXCEPTION 'operator_ref is required';
  END IF;

  IF nullif(btrim(p_source_oar_id), '') IS NULL THEN
    RAISE EXCEPTION 'source_oar_id is required';
  END IF;

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
    'assign_temp_c3_key',
    coalesce(nullif(btrim(p_action_type), ''), 'assign'),
    'prepared',
    btrim(p_operator_ref),
    btrim(p_source_oar_id),
    jsonb_build_object(
      'source_record_type', p_source_record_type,
      'source_record_id', p_source_record_id,
      'source_oar_path', p_source_oar_path,
      'origin_type', p_origin_type,
      'named_individual_ref', p_named_individual_ref,
      'institution_key', p_institution_key,
      'agreement_version', p_agreement_version,
      'payment_route', p_payment_route,
      'payment_status', p_payment_status,
      'assessment_credit_status', p_assessment_credit_status
    ),
    '{}'::jsonb,
    true,
    jsonb_build_object(
      'invocation_guard_passed', false,
      'implementation_version', 'v1',
      'source_oar_binding_validation', 'presence_required_current_schema'
    ) || v_metadata
  )
  RETURNING id INTO v_audit_id;

  IF p_function_name <> 'assign_temp_c3_key' THEN
    v_reject_reason := 'function_name mismatch';
  ELSIF p_action_type <> 'assign' THEN
    v_reject_reason := 'action_type mismatch';
  ELSIF p_operator_authorization_method NOT IN (
    'operator_recorded',
    'service_role_admin',
    'governed_internal'
  ) THEN
    v_reject_reason := 'operator authorization method not allowed';
  ELSIF p_source_record_type NOT IN ('SRC', 'SRC1', 'SRC2', 'future_SRC3') THEN
    v_reject_reason := 'source_record_type not allowed';
  ELSIF p_source_record_type = 'future_SRC3' THEN
    v_reject_reason := 'future_SRC3 remains held until seated';
  ELSIF nullif(btrim(p_source_record_id), '') IS NULL THEN
    v_reject_reason := 'source_record_id is required';
  ELSIF nullif(btrim(p_source_oar_path), '') IS NULL THEN
    v_reject_reason := 'source_oar_path is required';
  ELSIF p_origin_type NOT IN ('named_individual', 'institution_in_service') THEN
    v_reject_reason := 'origin_type not allowed';
  ELSIF nullif(btrim(p_named_individual_ref), '') IS NULL THEN
    v_reject_reason := 'named_individual_ref is required';
  ELSIF p_origin_type = 'institution_in_service'
    AND nullif(btrim(p_institution_key), '') IS NULL THEN
    v_reject_reason := 'institution_key is required for institution_in_service';
  ELSIF nullif(btrim(p_agreement_version), '') IS NULL THEN
    v_reject_reason := 'agreement_version is required';
  ELSIF nullif(btrim(p_agreement_hash), '') IS NULL THEN
    v_reject_reason := 'agreement_hash is required';
  ELSIF p_agreement_acknowledgment_method NOT IN (
    'operator_recorded',
    'form_checkbox',
    'signature',
    'email_confirmation'
  ) THEN
    v_reject_reason := 'agreement acknowledgment method not allowed';
  ELSIF p_expires_at IS NULL OR p_expires_at <= now() THEN
    v_reject_reason := 'expires_at must be a future timestamp';
  ELSIF coalesce(p_payment_status, 'not_required') <> 'not_required'
    OR nullif(btrim(p_payment_route), '') IS NOT NULL THEN
    v_reject_reason := 'payment activation is not authorized by this function';
  ELSIF coalesce(p_assessment_credit_status, 'none') <> 'none' THEN
    v_reject_reason := 'assessment credit / conversion activation is not authorized by this function';
  END IF;

  IF v_reject_reason IS NOT NULL THEN
    UPDATE public.c3_key_system_function_audit
    SET
      result_status = CASE
        WHEN p_source_record_type = 'future_SRC3' THEN 'held'
        ELSE 'rejected'
      END,
      output_ref = jsonb_build_object(
        'status', CASE
          WHEN p_source_record_type = 'future_SRC3' THEN 'held'
          ELSE 'rejected'
        END,
        'agreement_acknowledged', false
      ),
      metadata = metadata || jsonb_build_object(
        'invocation_guard_passed', false,
        'hold_reason', CASE
          WHEN p_source_record_type = 'future_SRC3' THEN v_reject_reason
          ELSE ''
        END,
        'reject_reason', CASE
          WHEN p_source_record_type = 'future_SRC3' THEN ''
          ELSE v_reject_reason
        END
      )
    WHERE id = v_audit_id;

    RETURN QUERY
    SELECT
      NULL::uuid,
      NULL::text,
      CASE
        WHEN p_source_record_type = 'future_SRC3' THEN 'held'
        ELSE 'rejected'
      END,
      p_origin_type,
      nullif(btrim(p_institution_key), ''),
      false,
      p_agreement_version,
      v_now,
      p_expires_at,
      v_audit_id,
      NULL::uuid;
    RETURN;
  END IF;

  BEGIN
    INSERT INTO public.c3_key_temp_agreement_ack (
      agreement_version,
      agreement_title,
      agreement_hash,
      acknowledged_by_named_individual_ref,
      institution_key,
      acknowledgment_method,
      source_oar_id,
      metadata,
      acknowledged_at
    )
    VALUES (
      btrim(p_agreement_version),
      coalesce(nullif(btrim(p_agreement_title), ''), 'c3 Key Temporary Assignment Agreement'),
      btrim(p_agreement_hash),
      btrim(p_named_individual_ref),
      nullif(btrim(p_institution_key), ''),
      p_agreement_acknowledgment_method,
      btrim(p_source_oar_id),
      jsonb_build_object(
        'support_safe', true,
        'source_record_type', p_source_record_type,
        'source_record_id', p_source_record_id,
        'source_oar_path', p_source_oar_path,
        'audit_id', v_audit_id
      ),
      now()
    )
    RETURNING id INTO v_ack_id;

    SELECT *
    INTO v_issued
    FROM public.issue_temp_c3_key(
      p_origin_type => p_origin_type,
      p_named_individual_ref => p_named_individual_ref,
      p_source_oar_id => p_source_oar_id,
      p_institution_key => p_institution_key,
      p_contact_email => NULL,
      p_payment_route => NULL,
      p_payment_provider => NULL,
      p_payment_reference => NULL,
      p_payment_status => 'not_required',
      p_amount_due_cents => NULL,
      p_amount_paid_cents => NULL,
      p_currency => 'usd',
      p_assessment_key => NULL,
      p_assessment_credit_status => 'none',
      p_expires_at => p_expires_at,
      p_metadata => jsonb_build_object(
        'source_record_type', p_source_record_type,
        'source_record_id', p_source_record_id,
        'source_oar_path', p_source_oar_path,
        'operator_ref', p_operator_ref,
        'operator_authorization_method', p_operator_authorization_method,
        'support_safe', true,
        'runtime_access', false,
        'permission_granted', false,
        'permission_activated', false,
        'wallet_bound', false,
        'nft_minted', false,
        'recognition', false,
        'conversion', false,
        'system_function_audit_id', v_audit_id
      ) || v_metadata
    );

    UPDATE public.c3_key_temp_agreement_ack
    SET temp_key_id = v_issued.id
    WHERE id = v_ack_id;

    UPDATE public.c3_key_system_function_audit
    SET
      result_status = 'executed',
      temp_key_id = v_issued.id,
      public_ref = v_issued.public_ref,
      output_ref = jsonb_build_object(
        'public_ref', v_issued.public_ref,
        'status', v_issued.status,
        'expires_at', v_issued.expires_at,
        'agreement_acknowledged', true
      ),
      metadata = metadata || jsonb_build_object(
        'invocation_guard_passed', true,
        'hold_reason', '',
        'reject_reason', '',
        'agreement_ack_id', v_ack_id
      )
    WHERE id = v_audit_id;

    v_status := v_issued.status;
  EXCEPTION
    WHEN OTHERS THEN
      UPDATE public.c3_key_system_function_audit
      SET
        result_status = 'failed',
        output_ref = jsonb_build_object(
          'status', 'failed',
          'agreement_acknowledged', false
        ),
        metadata = metadata || jsonb_build_object(
          'invocation_guard_passed', true,
          'hold_reason', '',
          'reject_reason', '',
          'failure_reason', SQLERRM
        )
      WHERE id = v_audit_id;

      RETURN QUERY
      SELECT
        NULL::uuid,
        NULL::text,
        'failed'::text,
        p_origin_type,
        nullif(btrim(p_institution_key), ''),
        false,
        p_agreement_version,
        v_now,
        p_expires_at,
        v_audit_id,
        NULL::uuid;
      RETURN;
  END;

  RETURN QUERY
  SELECT
    v_issued.id::uuid,
    v_issued.public_ref::text,
    v_status::text,
    v_issued.origin_type::text,
    v_issued.institution_key::text,
    true,
    p_agreement_version,
    v_issued.created_at::timestamptz,
    v_issued.expires_at::timestamptz,
    v_audit_id,
    NULL::uuid;
END;
$$;

REVOKE ALL ON FUNCTION public.assign_temp_c3_key(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  timestamptz,
  text,
  text,
  text,
  text,
  jsonb
) FROM PUBLIC;

REVOKE ALL ON FUNCTION public.assign_temp_c3_key(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  timestamptz,
  text,
  text,
  text,
  text,
  jsonb
) FROM anon;

REVOKE ALL ON FUNCTION public.assign_temp_c3_key(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  timestamptz,
  text,
  text,
  text,
  text,
  jsonb
) FROM authenticated;

GRANT EXECUTE ON FUNCTION public.assign_temp_c3_key(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  timestamptz,
  text,
  text,
  text,
  text,
  jsonb
) TO service_role;
