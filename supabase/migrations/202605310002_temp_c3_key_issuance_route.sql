-- Temporary c3 Key Issuance Route v1
-- Source OAR2: docs/oar/measures_interoperability/oar2_temp_c3_key_issuance_route_v1.meta.md
--
-- This migration seats the governed server-side/admin issuance route for
-- public.c3_key_temp. It does not open public RLS policies, activate payment
-- processing, mint NFTs, bind wallets, create recognition, create conversion,
-- or modify frontend runtime/CSS.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE public.c3_key_temp
  DROP CONSTRAINT IF EXISTS c3_key_temp_origin_reference_check,
  ADD CONSTRAINT c3_key_temp_origin_reference_check
    CHECK (
      named_individual_ref IS NOT NULL
      AND (
        origin_type = 'named_individual'
        OR (
          origin_type = 'institution_in_service'
          AND institution_key IS NOT NULL
        )
      )
    );

CREATE TABLE IF NOT EXISTS public.c3_key_temp_continuity_event (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  temp_key_id uuid NOT NULL REFERENCES public.c3_key_temp(id) ON DELETE CASCADE,

  event_type text NOT NULL CHECK (
    event_type IN (
      'issued',
      'acknowledged',
      'payment_submitted',
      'payment_confirmed',
      'access_used',
      'renewed',
      'held',
      'expired',
      'revoked',
      'wallet_bound',
      'migrated_to_nft'
    )
  ),

  action_ref text,
  source_oar_id text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT c3_key_temp_continuity_event_metadata_object_check
    CHECK (jsonb_typeof(metadata) = 'object')
);

ALTER TABLE public.c3_key_temp_continuity_event ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS c3_key_temp_continuity_event_temp_key_idx
  ON public.c3_key_temp_continuity_event (temp_key_id, created_at);

CREATE INDEX IF NOT EXISTS c3_key_temp_continuity_event_type_idx
  ON public.c3_key_temp_continuity_event (event_type);

CREATE INDEX IF NOT EXISTS c3_key_temp_continuity_event_source_oar_idx
  ON public.c3_key_temp_continuity_event (source_oar_id);

CREATE OR REPLACE FUNCTION public.issue_temp_c3_key(
  p_origin_type text,
  p_named_individual_ref text,
  p_source_oar_id text,
  p_institution_key text DEFAULT NULL,
  p_contact_email text DEFAULT NULL,
  p_payment_route text DEFAULT NULL,
  p_payment_provider text DEFAULT NULL,
  p_payment_reference text DEFAULT NULL,
  p_payment_status text DEFAULT 'not_required',
  p_amount_due_cents integer DEFAULT NULL,
  p_amount_paid_cents integer DEFAULT NULL,
  p_currency text DEFAULT 'usd',
  p_assessment_key text DEFAULT NULL,
  p_assessment_credit_status text DEFAULT 'none',
  p_expires_at timestamptz DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE (
  id uuid,
  public_ref text,
  status text,
  payment_status text,
  assessment_credit_status text,
  origin_type text,
  institution_key text,
  created_at timestamptz,
  expires_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_attempt integer := 0;
  v_contact_email_hash text;
  v_metadata jsonb := coalesce(p_metadata, '{}'::jsonb);
  v_row public.c3_key_temp%rowtype;
  v_status text;
  v_event_type text := 'issued';
  v_expires_at timestamptz;
BEGIN
  IF p_origin_type NOT IN ('named_individual', 'institution_in_service') THEN
    RAISE EXCEPTION 'invalid origin_type: %', p_origin_type;
  END IF;

  IF nullif(btrim(p_named_individual_ref), '') IS NULL THEN
    RAISE EXCEPTION 'named_individual_ref is required';
  END IF;

  IF nullif(btrim(p_source_oar_id), '') IS NULL THEN
    RAISE EXCEPTION 'source_oar_id is required';
  END IF;

  IF p_origin_type = 'institution_in_service'
    AND nullif(btrim(p_institution_key), '') IS NULL THEN
    RAISE EXCEPTION 'institution_key is required for institution_in_service';
  END IF;

  IF coalesce(p_payment_status, 'not_required') IN ('submitted', 'confirmed', 'refunded', 'credited') THEN
    IF nullif(btrim(p_payment_route), '') IS NULL THEN
      RAISE EXCEPTION 'payment_route is required for payment_status %', p_payment_status;
    END IF;

    IF nullif(btrim(p_payment_provider), '') IS NULL THEN
      RAISE EXCEPTION 'payment_provider is required for payment_status %', p_payment_status;
    END IF;

    IF nullif(btrim(p_payment_reference), '') IS NULL THEN
      RAISE EXCEPTION 'payment_reference is required for payment_status %', p_payment_status;
    END IF;
  END IF;

  IF coalesce(p_payment_status, 'not_required') = 'pending'
    AND nullif(btrim(p_payment_route), '') IS NULL THEN
    RAISE EXCEPTION 'payment_route is required for pending payment_status';
  END IF;

  IF p_payment_route IN ('operator_grant', 'sponsored_access', 'manual_recorded_payment')
    AND nullif(btrim(p_source_oar_id), '') IS NULL THEN
    RAISE EXCEPTION 'source_oar_id approval trace is required for %', p_payment_route;
  END IF;

  IF coalesce(p_assessment_credit_status, 'none') = 'eligible' THEN
    IF nullif(btrim(p_assessment_key), '') IS NULL THEN
      RAISE EXCEPTION 'assessment_key is required for eligible assessment credit';
    END IF;

    IF coalesce(p_payment_status, 'not_required') NOT IN ('confirmed', 'credited') THEN
      RAISE EXCEPTION 'eligible assessment credit requires confirmed or credited payment_status';
    END IF;
  END IF;

  IF coalesce(p_assessment_credit_status, 'none') = 'credited_to_conversion'
    AND coalesce(p_payment_status, 'not_required') <> 'credited' THEN
    RAISE EXCEPTION 'credited_to_conversion requires credited payment_status';
  END IF;

  IF p_contact_email IS NOT NULL AND nullif(btrim(p_contact_email), '') IS NOT NULL THEN
    v_contact_email_hash := encode(extensions.digest(lower(btrim(p_contact_email)), 'sha256'), 'hex');
  END IF;

  v_metadata := v_metadata - 'email' - 'contact_email' - 'raw_email';

  v_status := CASE
    WHEN coalesce(p_payment_status, 'not_required') IN ('confirmed', 'credited') THEN 'payment_confirmed'
    WHEN coalesce(p_payment_status, 'not_required') IN ('pending', 'submitted') THEN 'payment_pending'
    ELSE 'issued'
  END;

  v_event_type := CASE
    WHEN coalesce(p_payment_status, 'not_required') IN ('confirmed', 'credited') THEN 'payment_confirmed'
    WHEN coalesce(p_payment_status, 'not_required') = 'submitted' THEN 'payment_submitted'
    ELSE 'issued'
  END;

  v_expires_at := coalesce(
    p_expires_at,
    CASE
      WHEN v_status IN ('issued', 'payment_pending') THEN now() + interval '14 days'
      WHEN v_status IN ('acknowledged', 'payment_confirmed', 'wallet_pending') THEN now() + interval '90 days'
      WHEN v_status = 'held' THEN now()
      ELSE now() + interval '14 days'
    END
  );

  LOOP
    v_attempt := v_attempt + 1;

    BEGIN
      INSERT INTO public.c3_key_temp (
        origin_type,
        institution_key,
        named_individual_ref,
        contact_email_hash,
        contact_email_encrypted,
        status,
        payment_route,
        payment_provider,
        payment_reference,
        payment_status,
        amount_due_cents,
        amount_paid_cents,
        currency,
        assessment_key,
        assessment_credit_status,
        source_oar_id,
        metadata,
        expires_at
      )
      VALUES (
        p_origin_type,
        nullif(btrim(p_institution_key), ''),
        btrim(p_named_individual_ref),
        v_contact_email_hash,
        NULL,
        v_status,
        nullif(btrim(p_payment_route), ''),
        nullif(btrim(p_payment_provider), ''),
        nullif(btrim(p_payment_reference), ''),
        coalesce(p_payment_status, 'not_required'),
        p_amount_due_cents,
        p_amount_paid_cents,
        coalesce(nullif(btrim(p_currency), ''), 'usd'),
        nullif(btrim(p_assessment_key), ''),
        coalesce(p_assessment_credit_status, 'none'),
        btrim(p_source_oar_id),
        v_metadata,
        v_expires_at
      )
      RETURNING *
      INTO v_row;

      INSERT INTO public.c3_key_temp_continuity_event (
        temp_key_id,
        event_type,
        action_ref,
        source_oar_id,
        metadata
      )
      VALUES (
        v_row.id,
        v_event_type,
        nullif(btrim(p_payment_reference), ''),
        btrim(p_source_oar_id),
        jsonb_build_object(
          'origin_type', v_row.origin_type,
          'payment_status', v_row.payment_status,
          'assessment_credit_status', v_row.assessment_credit_status
        )
      );

      RETURN QUERY
      SELECT
        v_row.id,
        v_row.public_ref,
        v_row.status,
        v_row.payment_status,
        v_row.assessment_credit_status,
        v_row.origin_type,
        v_row.institution_key,
        v_row.created_at,
        v_row.expires_at;

      RETURN;
    EXCEPTION
      WHEN unique_violation THEN
        IF v_attempt >= 3 THEN
          RAISE EXCEPTION 'collision_error: temp c3 key identifier collision after 3 attempts';
        END IF;
    END;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.issue_temp_c3_key(
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
  timestamptz,
  jsonb
) FROM PUBLIC;

REVOKE ALL ON FUNCTION public.issue_temp_c3_key(
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
  timestamptz,
  jsonb
) FROM anon;

REVOKE ALL ON FUNCTION public.issue_temp_c3_key(
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
  timestamptz,
  jsonb
) FROM authenticated;

GRANT EXECUTE ON FUNCTION public.issue_temp_c3_key(
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
  timestamptz,
  jsonb
) TO service_role;
