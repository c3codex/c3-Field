-- Temporary c3 Key + Alternate Payment Route Contract v1
-- Source OAR2: docs/oar/measures_interoperability/oar2_temp_c3_key_alternate_payment_route_contract_v1.meta.md
--
-- This migration prepares bounded temporary c3 Key continuity and alternate
-- payment trace standing. It does not activate payment processing, mint NFTs,
-- create recognition standing, create conversion standing, or bind wallets.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.c3_generate_temp_key()
RETURNS text
LANGUAGE sql
VOLATILE
AS $$
  SELECT 'c3tmp_' || upper(encode(extensions.gen_random_bytes(16), 'hex'));
$$;

CREATE OR REPLACE FUNCTION public.c3_generate_temp_public_ref()
RETURNS text
LANGUAGE sql
VOLATILE
AS $$
  SELECT 'C3-TEMP-' || upper(encode(extensions.gen_random_bytes(3), 'hex'));
$$;

CREATE TABLE IF NOT EXISTS public.c3_key_temp (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  temp_key text NOT NULL UNIQUE DEFAULT public.c3_generate_temp_key(),
  public_ref text NOT NULL UNIQUE DEFAULT public.c3_generate_temp_public_ref(),

  origin_type text NOT NULL,
  institution_key text,
  named_individual_ref text,

  contact_email_hash text,
  contact_email_encrypted text,

  status text NOT NULL DEFAULT 'issued',

  payment_route text,
  payment_provider text,
  payment_reference text,

  payment_status text NOT NULL DEFAULT 'not_required',
  amount_due_cents integer,
  amount_paid_cents integer,
  currency text NOT NULL DEFAULT 'usd',

  assessment_key text,
  assessment_credit_status text NOT NULL DEFAULT 'none',

  wallet_address text,
  wallet_bound_at timestamptz,

  nft_contract_address text,
  nft_token_id text,
  migrated_at timestamptz,

  source_oar_id text NOT NULL DEFAULT 'docs/oar/measures_interoperability/oar2_temp_c3_key_alternate_payment_route_contract_v1.meta.md',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,

  CONSTRAINT c3_key_temp_temp_key_format_check
    CHECK (temp_key ~ '^c3tmp_[A-Z0-9]{26,32}$'),
  CONSTRAINT c3_key_temp_public_ref_format_check
    CHECK (public_ref ~ '^C3-TEMP-[A-Z0-9]{6,12}$'),
  CONSTRAINT c3_key_temp_origin_type_check
    CHECK (origin_type IN ('named_individual', 'institution_in_service')),
  CONSTRAINT c3_key_temp_origin_reference_check
    CHECK (
      (origin_type = 'named_individual' AND named_individual_ref IS NOT NULL)
      OR
      (origin_type = 'institution_in_service' AND institution_key IS NOT NULL)
    ),
  CONSTRAINT c3_key_temp_status_check
    CHECK (
      status IN (
        'issued',
        'acknowledged',
        'held',
        'payment_pending',
        'payment_confirmed',
        'wallet_pending',
        'wallet_bound',
        'migrated_to_nft',
        'revoked',
        'expired'
      )
    ),
  CONSTRAINT c3_key_temp_payment_route_check
    CHECK (
      payment_route IS NULL
      OR payment_route IN (
        'stripe_invoice',
        'stripe_payment_link',
        'bank_transfer',
        'ach',
        'manual_recorded_payment',
        'sponsored_access',
        'operator_grant'
      )
    ),
  CONSTRAINT c3_key_temp_payment_status_check
    CHECK (
      payment_status IN (
        'not_required',
        'pending',
        'submitted',
        'confirmed',
        'failed',
        'refunded',
        'credited',
        'voided'
      )
    ),
  CONSTRAINT c3_key_temp_credit_status_check
    CHECK (
      assessment_credit_status IN (
        'none',
        'eligible',
        'credited_to_conversion',
        'expired',
        'voided'
      )
    ),
  CONSTRAINT c3_key_temp_amount_due_nonnegative_check
    CHECK (amount_due_cents IS NULL OR amount_due_cents >= 0),
  CONSTRAINT c3_key_temp_amount_paid_nonnegative_check
    CHECK (amount_paid_cents IS NULL OR amount_paid_cents >= 0),
  CONSTRAINT c3_key_temp_payment_trace_required_check
    CHECK (
      payment_status IN ('not_required', 'pending', 'voided')
      OR payment_route IS NOT NULL
    ),
  CONSTRAINT c3_key_temp_payment_reference_required_check
    CHECK (
      payment_status NOT IN ('submitted', 'confirmed', 'refunded', 'credited')
      OR payment_reference IS NOT NULL
    ),
  CONSTRAINT c3_key_temp_credit_requires_assessment_check
    CHECK (
      assessment_credit_status IN ('none', 'expired', 'voided')
      OR assessment_key IS NOT NULL
    ),
  CONSTRAINT c3_key_temp_credit_conversion_requires_payment_check
    CHECK (
      assessment_credit_status <> 'credited_to_conversion'
      OR payment_status = 'credited'
    ),
  CONSTRAINT c3_key_temp_wallet_bound_requires_wallet_check
    CHECK (
      status <> 'wallet_bound'
      OR (wallet_address IS NOT NULL AND wallet_bound_at IS NOT NULL)
    ),
  CONSTRAINT c3_key_temp_migrated_requires_nft_trace_check
    CHECK (
      status <> 'migrated_to_nft'
      OR (
        wallet_address IS NOT NULL
        AND wallet_bound_at IS NOT NULL
        AND nft_contract_address IS NOT NULL
        AND nft_token_id IS NOT NULL
        AND migrated_at IS NOT NULL
      )
    ),
  CONSTRAINT c3_key_temp_no_email_identity_check
    CHECK (contact_email_hash IS NULL OR contact_email_hash <> temp_key),
  CONSTRAINT c3_key_temp_metadata_object_check
    CHECK (jsonb_typeof(metadata) = 'object')
);

ALTER TABLE public.c3_key_temp ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS c3_key_temp_origin_idx
  ON public.c3_key_temp (origin_type, institution_key, named_individual_ref);

CREATE INDEX IF NOT EXISTS c3_key_temp_status_idx
  ON public.c3_key_temp (status);

CREATE INDEX IF NOT EXISTS c3_key_temp_payment_idx
  ON public.c3_key_temp (payment_route, payment_status);

CREATE INDEX IF NOT EXISTS c3_key_temp_assessment_idx
  ON public.c3_key_temp (assessment_key, assessment_credit_status);

CREATE INDEX IF NOT EXISTS c3_key_temp_wallet_idx
  ON public.c3_key_temp (wallet_address)
  WHERE wallet_address IS NOT NULL;

CREATE INDEX IF NOT EXISTS c3_key_temp_source_oar_idx
  ON public.c3_key_temp (source_oar_id);

CREATE OR REPLACE FUNCTION public.c3_key_temp_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS c3_key_temp_set_updated_at ON public.c3_key_temp;
CREATE TRIGGER c3_key_temp_set_updated_at
BEFORE UPDATE ON public.c3_key_temp
FOR EACH ROW EXECUTE FUNCTION public.c3_key_temp_set_updated_at();
