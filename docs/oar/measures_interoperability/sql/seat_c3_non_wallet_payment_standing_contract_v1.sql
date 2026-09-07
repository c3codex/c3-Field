-- c3 Non-Wallet Payment Standing Contract v1
-- Source OAR2: docs/oar/measures_interoperability/oar2_c3_non_wallet_payment_standing_contract_v1.meta.md
--
-- This seats support-safe, source / OAR-bound non-wallet payment standing.
-- It does not process payments, integrate a payment processor, store card or
-- bank data, issue temporary c3 Keys, grant permissions, wire runtime, bind
-- wallets, mint NFTs, activate DAO/distribution, or create recognition /
-- conversion standing.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE public.c3_key_system_function_audit
  DROP CONSTRAINT IF EXISTS c3_key_system_function_audit_function_name_check;

ALTER TABLE public.c3_key_system_function_audit
  ADD CONSTRAINT c3_key_system_function_audit_function_name_check
  CHECK (
    function_name IN (
      'assign_temp_c3_key',
      'seat_c3_key_source_oar_binding',
      'seat_c3_payment_standing',
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

CREATE TABLE IF NOT EXISTS public.c3_payment_standing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  source_record_type text NOT NULL CHECK (
    source_record_type IN ('SRC', 'SRC1', 'SRC2')
  ),
  source_record_id text NOT NULL,
  source_oar_id text NOT NULL,
  source_oar_path text,

  source_oar_binding_id uuid REFERENCES public.c3_key_source_oar_binding(id) ON DELETE SET NULL,

  operator_ref text NOT NULL,

  payment_route text NOT NULL CHECK (
    payment_route IN (
      'invoice',
      'manual',
      'bank_transfer',
      'card_processor',
      'grant_credit',
      'waived',
      'onchain_future'
    )
  ),
  payment_status text NOT NULL CHECK (
    payment_status IN (
      'pending',
      'invoiced',
      'paid',
      'waived',
      'held',
      'failed',
      'refunded',
      'cancelled',
      'not_required'
    )
  ),
  payment_provider text,
  payment_reference text,

  amount_due_cents integer NOT NULL DEFAULT 0,
  amount_paid_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'usd',

  payer_type text NOT NULL CHECK (
    payer_type IN ('named_individual', 'institution_in_service')
  ),
  institution_key text,
  named_individual_ref text NOT NULL,

  payment_confirmed_at timestamptz,

  audit_id uuid REFERENCES public.c3_key_system_function_audit(id) ON DELETE SET NULL,

  support_safe boolean NOT NULL DEFAULT true CHECK (support_safe IS TRUE),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT c3_payment_standing_source_record_id_not_blank_check
    CHECK (length(btrim(source_record_id)) > 0),
  CONSTRAINT c3_payment_standing_source_oar_id_not_blank_check
    CHECK (length(btrim(source_oar_id)) > 0),
  CONSTRAINT c3_payment_standing_source_oar_path_not_blank_check
    CHECK (source_oar_path IS NULL OR length(btrim(source_oar_path)) > 0),
  CONSTRAINT c3_payment_standing_operator_ref_not_blank_check
    CHECK (length(btrim(operator_ref)) > 0),
  CONSTRAINT c3_payment_standing_provider_not_blank_check
    CHECK (payment_provider IS NULL OR length(btrim(payment_provider)) > 0),
  CONSTRAINT c3_payment_standing_reference_not_blank_check
    CHECK (payment_reference IS NULL OR length(btrim(payment_reference)) > 0),
  CONSTRAINT c3_payment_standing_amount_due_nonnegative_check
    CHECK (amount_due_cents >= 0),
  CONSTRAINT c3_payment_standing_amount_paid_nonnegative_check
    CHECK (amount_paid_cents >= 0),
  CONSTRAINT c3_payment_standing_currency_check
    CHECK (currency ~ '^[a-z]{3}$'),
  CONSTRAINT c3_payment_standing_named_individual_not_blank_check
    CHECK (length(btrim(named_individual_ref)) > 0),
  CONSTRAINT c3_payment_standing_institution_required_check
    CHECK (
      payer_type <> 'institution_in_service'
      OR nullif(btrim(institution_key), '') IS NOT NULL
    ),
  CONSTRAINT c3_payment_standing_confirmed_at_status_check
    CHECK (
      payment_confirmed_at IS NULL
      OR payment_status IN ('paid', 'waived', 'not_required')
    ),
  CONSTRAINT c3_payment_standing_metadata_object_check
    CHECK (jsonb_typeof(metadata) = 'object'),
  CONSTRAINT c3_payment_standing_metadata_support_safe_check
    CHECK (
      NOT (
        metadata ?| ARRAY[
          'card_number',
          'cvv',
          'bank_account_number',
          'routing_number',
          'processor_api_key',
          'service_role_key',
          'raw_receipt',
          'raw_invoice',
          'private_payment_data',
          'wallet_private_key',
          'seed_phrase',
          'contact_email_hash',
          'contact_email_encrypted',
          'contact_email'
        ]
      )
    ),
  CONSTRAINT c3_payment_standing_unique_source_route_ref
    UNIQUE (
      source_record_type,
      source_record_id,
      source_oar_id,
      payment_route,
      payment_reference
    )
);

ALTER TABLE public.c3_payment_standing ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.c3_payment_standing FROM PUBLIC;
REVOKE ALL ON TABLE public.c3_payment_standing FROM anon;
REVOKE ALL ON TABLE public.c3_payment_standing FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.c3_payment_standing TO service_role;

CREATE INDEX IF NOT EXISTS c3_payment_standing_source_idx
  ON public.c3_payment_standing (source_record_type, source_record_id);

CREATE INDEX IF NOT EXISTS c3_payment_standing_oar_idx
  ON public.c3_payment_standing (source_oar_id);

CREATE INDEX IF NOT EXISTS c3_payment_standing_status_idx
  ON public.c3_payment_standing (payment_route, payment_status);

CREATE INDEX IF NOT EXISTS c3_payment_standing_binding_idx
  ON public.c3_payment_standing (source_oar_binding_id);

CREATE OR REPLACE FUNCTION public.touch_c3_payment_standing_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_touch_c3_payment_standing_updated_at
ON public.c3_payment_standing;

CREATE TRIGGER trg_touch_c3_payment_standing_updated_at
BEFORE UPDATE ON public.c3_payment_standing
FOR EACH ROW
EXECUTE FUNCTION public.touch_c3_payment_standing_updated_at();

CREATE OR REPLACE FUNCTION public.seat_c3_payment_standing(
  p_source_record_type text,
  p_source_record_id text,
  p_source_oar_id text,
  p_source_oar_path text,
  p_operator_ref text,
  p_operator_authorization_method text,
  p_payment_route text,
  p_payment_status text,
  p_payment_provider text DEFAULT NULL,
  p_payment_reference text DEFAULT NULL,
  p_amount_due_cents integer DEFAULT 0,
  p_amount_paid_cents integer DEFAULT 0,
  p_currency text DEFAULT 'usd',
  p_payer_type text DEFAULT 'named_individual',
  p_institution_key text DEFAULT NULL,
  p_named_individual_ref text DEFAULT NULL,
  p_payment_confirmed_at timestamptz DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE (
  payment_standing_id uuid,
  source_record_type text,
  source_record_id text,
  source_oar_id text,
  payment_route text,
  payment_status text,
  eligible_payment_standing boolean,
  source_oar_binding_id uuid,
  audit_id uuid,
  payment_confirmed_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_audit_id uuid;
  v_payment public.c3_payment_standing%rowtype;
  v_binding_id uuid;
  v_metadata jsonb := coalesce(p_metadata, '{}'::jsonb);
  v_reject_reason text;
  v_hold_reason text;
  v_operator_ref text := coalesce(nullif(btrim(p_operator_ref), ''), '_missing_operator_ref');
  v_source_oar_id text := coalesce(nullif(btrim(p_source_oar_id), ''), '_missing_source_oar_id');
  v_route text := coalesce(nullif(btrim(p_payment_route), ''), '_missing_payment_route');
  v_status text := coalesce(nullif(btrim(p_payment_status), ''), '_missing_payment_status');
  v_reference text := nullif(btrim(p_payment_reference), '');
  v_confirmed_at timestamptz := p_payment_confirmed_at;
BEGIN
  v_metadata := v_metadata
    - 'card_number'
    - 'cvv'
    - 'bank_account_number'
    - 'routing_number'
    - 'processor_api_key'
    - 'service_role_key'
    - 'raw_receipt'
    - 'raw_invoice'
    - 'private_payment_data'
    - 'wallet_private_key'
    - 'seed_phrase'
    - 'contact_email_hash'
    - 'contact_email_encrypted'
    - 'contact_email';

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
    'seat_c3_payment_standing',
    'payment_standing',
    'prepared',
    v_operator_ref,
    v_source_oar_id,
    jsonb_build_object(
      'source_record_type', p_source_record_type,
      'source_record_id', p_source_record_id,
      'payment_route', p_payment_route,
      'requested_payment_status', p_payment_status,
      'payment_provider', p_payment_provider,
      'payment_reference_present', v_reference IS NOT NULL,
      'amount_due_cents', p_amount_due_cents,
      'amount_paid_cents', p_amount_paid_cents,
      'currency', p_currency,
      'payer_type', p_payer_type
    ),
    '{}'::jsonb,
    true,
    jsonb_build_object(
      'payment_standing_contract_version', 'v1',
      'invocation_guard_passed', false,
      'processor_execution', false,
      'wallet_implication', false
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
  ELSIF v_route NOT IN (
    'invoice',
    'manual',
    'bank_transfer',
    'card_processor',
    'grant_credit',
    'waived',
    'onchain_future'
  ) THEN
    v_reject_reason := 'payment_route not allowed';
  ELSIF v_status NOT IN (
    'pending',
    'invoiced',
    'paid',
    'waived',
    'held',
    'failed',
    'refunded',
    'cancelled',
    'not_required'
  ) THEN
    v_reject_reason := 'payment_status not allowed';
  ELSIF v_route = 'onchain_future' THEN
    v_hold_reason := 'onchain_future payment route remains held';
  ELSIF p_amount_due_cents IS NULL OR p_amount_due_cents < 0 THEN
    v_reject_reason := 'amount_due_cents must be nonnegative';
  ELSIF p_amount_paid_cents IS NULL OR p_amount_paid_cents < 0 THEN
    v_reject_reason := 'amount_paid_cents must be nonnegative';
  ELSIF coalesce(nullif(btrim(p_currency), ''), '') !~ '^[a-z]{3}$' THEN
    v_reject_reason := 'currency must be a three-letter lowercase code';
  ELSIF p_payer_type NOT IN ('named_individual', 'institution_in_service') THEN
    v_reject_reason := 'payer_type not allowed';
  ELSIF nullif(btrim(p_named_individual_ref), '') IS NULL THEN
    v_reject_reason := 'named_individual_ref is required';
  ELSIF p_payer_type = 'institution_in_service'
    AND nullif(btrim(p_institution_key), '') IS NULL THEN
    v_reject_reason := 'institution_key is required for institution_in_service';
  ELSIF v_status IN ('paid', 'waived')
    AND v_confirmed_at IS NULL THEN
    v_confirmed_at := now();
  END IF;

  IF v_reject_reason IS NULL
    AND v_hold_reason IS NULL
    AND p_source_record_type IN ('SRC', 'SRC1', 'SRC2') THEN
    SELECT b.id
    INTO v_binding_id
    FROM public.c3_key_source_oar_binding b
    WHERE b.source_record_type = p_source_record_type
      AND b.source_record_id = btrim(p_source_record_id)
      AND b.source_oar_id = btrim(p_source_oar_id)
      AND b.binding_status = 'active'
      AND b.support_safe IS TRUE
      AND (
        b.source_oar_path IS NULL
        OR b.source_oar_path = btrim(p_source_oar_path)
      )
    ORDER BY b.created_at DESC
    LIMIT 1;
  END IF;

  IF v_reject_reason IS NOT NULL OR v_hold_reason IS NOT NULL THEN
    UPDATE public.c3_key_system_function_audit
    SET
      result_status = CASE
        WHEN v_hold_reason IS NOT NULL THEN 'held'
        ELSE 'rejected'
      END,
      output_ref = jsonb_build_object(
        'payment_standing_id', NULL,
        'payment_status', CASE
          WHEN v_hold_reason IS NOT NULL THEN 'held'
          ELSE 'rejected'
        END,
        'eligible_payment_standing', false,
        'payment_confirmed_at', NULL
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
      p_payment_route,
      CASE
        WHEN v_hold_reason IS NOT NULL THEN 'held'
        ELSE 'rejected'
      END,
      false,
      NULL::uuid,
      v_audit_id,
      NULL::timestamptz,
      NULL::timestamptz,
      NULL::timestamptz;
    RETURN;
  END IF;

  INSERT INTO public.c3_payment_standing (
    source_record_type,
    source_record_id,
    source_oar_id,
    source_oar_path,
    source_oar_binding_id,
    operator_ref,
    payment_route,
    payment_status,
    payment_provider,
    payment_reference,
    amount_due_cents,
    amount_paid_cents,
    currency,
    payer_type,
    institution_key,
    named_individual_ref,
    payment_confirmed_at,
    audit_id,
    support_safe,
    metadata
  )
  VALUES (
    p_source_record_type,
    btrim(p_source_record_id),
    btrim(p_source_oar_id),
    btrim(p_source_oar_path),
    v_binding_id,
    btrim(p_operator_ref),
    v_route,
    v_status,
    nullif(btrim(p_payment_provider), ''),
    v_reference,
    p_amount_due_cents,
    p_amount_paid_cents,
    btrim(p_currency),
    p_payer_type,
    nullif(btrim(p_institution_key), ''),
    btrim(p_named_individual_ref),
    v_confirmed_at,
    v_audit_id,
    true,
    jsonb_build_object(
      'payment_standing_contract_version', 'v1',
      'support_safe', true,
      'processor_execution', false,
      'wallet_implication', false,
      'source_oar_binding_id', v_binding_id
    ) || v_metadata
  )
  ON CONFLICT ON CONSTRAINT c3_payment_standing_unique_source_route_ref
  DO UPDATE SET
    source_oar_path = EXCLUDED.source_oar_path,
    source_oar_binding_id = EXCLUDED.source_oar_binding_id,
    operator_ref = EXCLUDED.operator_ref,
    payment_status = EXCLUDED.payment_status,
    payment_provider = EXCLUDED.payment_provider,
    amount_due_cents = EXCLUDED.amount_due_cents,
    amount_paid_cents = EXCLUDED.amount_paid_cents,
    currency = EXCLUDED.currency,
    payer_type = EXCLUDED.payer_type,
    institution_key = EXCLUDED.institution_key,
    named_individual_ref = EXCLUDED.named_individual_ref,
    payment_confirmed_at = EXCLUDED.payment_confirmed_at,
    audit_id = EXCLUDED.audit_id,
    support_safe = true,
    metadata = EXCLUDED.metadata,
    updated_at = now()
  RETURNING *
  INTO v_payment;

  UPDATE public.c3_key_system_function_audit
  SET
    result_status = 'executed',
    output_ref = jsonb_build_object(
      'payment_standing_id', v_payment.id,
      'payment_status', v_payment.payment_status,
      'eligible_payment_standing', v_payment.payment_status IN ('paid', 'waived', 'not_required'),
      'payment_confirmed_at', v_payment.payment_confirmed_at
    ),
    metadata = metadata || jsonb_build_object(
      'invocation_guard_passed', true,
      'payment_standing_id', v_payment.id,
      'payment_status', v_payment.payment_status,
      'eligible_payment_standing', v_payment.payment_status IN ('paid', 'waived', 'not_required'),
      'source_oar_binding_id', v_payment.source_oar_binding_id,
      'hold_reason', '',
      'reject_reason', ''
    )
  WHERE id = v_audit_id;

  RETURN QUERY
  SELECT
    v_payment.id,
    v_payment.source_record_type,
    v_payment.source_record_id,
    v_payment.source_oar_id,
    v_payment.payment_route,
    v_payment.payment_status,
    v_payment.payment_status IN ('paid', 'waived', 'not_required'),
    v_payment.source_oar_binding_id,
    v_audit_id,
    v_payment.payment_confirmed_at,
    v_payment.created_at,
    v_payment.updated_at;
END;
$$;

REVOKE ALL ON FUNCTION public.seat_c3_payment_standing(
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
  integer,
  integer,
  text,
  text,
  text,
  text,
  timestamptz,
  jsonb
) FROM PUBLIC;

REVOKE ALL ON FUNCTION public.seat_c3_payment_standing(
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
  integer,
  integer,
  text,
  text,
  text,
  text,
  timestamptz,
  jsonb
) FROM anon;

REVOKE ALL ON FUNCTION public.seat_c3_payment_standing(
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
  integer,
  integer,
  text,
  text,
  text,
  text,
  timestamptz,
  jsonb
) FROM authenticated;

GRANT EXECUTE ON FUNCTION public.seat_c3_payment_standing(
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
  integer,
  integer,
  text,
  text,
  text,
  text,
  timestamptz,
  jsonb
) TO service_role;
