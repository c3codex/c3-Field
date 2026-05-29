-- Measures Registry Commerce Trace Schema v1
-- OAR2: docs/oar/measures_interoperability/oar2_measures_registry_commerce_trace_schema_logging_contract_v1.meta.md
--
-- OPERATOR: inspect live database standing before executing.
-- Run the inspection query below first. If measures_commerce_trace already
-- exists, do not execute the CREATE TABLE block without a separate migration OAR2.
--
-- INSPECTION QUERY (run first):
--   SELECT table_name FROM information_schema.tables
--   WHERE table_schema = 'public' AND table_name = 'measures_commerce_trace';
--
-- SECURITY: no provider secrets may be stored in this table.
-- No is_active = true, seal, recognition, or conversion activation
-- may be triggered by inserting or updating rows in this table.

-- ─── ENUM TYPES ───────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE public.measures_c3_map_circuit AS ENUM ('C1', 'C2', 'C3');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.measures_payment_status AS ENUM (
    'not_started',
    'invoice_pending',
    'invoice_issued',
    'payment_pending',
    'paid',
    'payment_failed',
    'refunded',
    'held',
    'redacted'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.measures_credit_status AS ENUM (
    'not_eligible',
    'eligible',
    'pending_contract',
    'applied',
    'expired',
    'held',
    'redacted'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.measures_conversion_status AS ENUM (
    'not_started',
    'contract_offered',
    'contract_accepted',
    'in_conversion_review',
    'converted',
    'held',
    'redacted',
    'closed'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─── TABLE ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.measures_commerce_trace (
  id                            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  commerce_trace_key            text        NOT NULL UNIQUE,
  assessment_key                text,
  capture_id                    text,
  institution_key               text,
  institution_name              text,
  contact_email                 text,
  c3_map_commerce_circuit       public.measures_c3_map_circuit   NOT NULL,
  assessment_price              numeric(12, 2) NOT NULL,
  implementation_contract_floor numeric(12, 2) NOT NULL,
  assessment_credit_amount      numeric(12, 2) NOT NULL,
  balance_if_proceeding         numeric(12, 2) NOT NULL,
  payment_status                public.measures_payment_status   NOT NULL DEFAULT 'not_started',
  invoice_status                text,
  provider                      text,
  provider_payment_id           text,
  provider_invoice_id           text,
  credit_status                 public.measures_credit_status    NOT NULL DEFAULT 'not_eligible',
  contract_key                  text,
  conversion_status             public.measures_conversion_status NOT NULL DEFAULT 'not_started',
  operator_key                  text,
  system_key                    text,
  source_oar2                   text        NOT NULL,
  metadata                      jsonb,
  created_at                    timestamptz NOT NULL DEFAULT now(),
  updated_at                    timestamptz NOT NULL DEFAULT now()
);

-- ─── RLS ──────────────────────────────────────────────────────────────────────

ALTER TABLE public.measures_commerce_trace ENABLE ROW LEVEL SECURITY;

-- ─── CONSTRAINTS ──────────────────────────────────────────────────────────────

-- Pricing must match seated pricing contract. Executor verifies on insert.
-- No constraint enforces exact prices here to allow future circuit extensions
-- via a new OAR2 without schema migration. Pricing is governed by contract.

-- credit_status = 'applied' requires contract_key to be non-null.
ALTER TABLE public.measures_commerce_trace
  ADD CONSTRAINT chk_credit_applied_requires_contract
  CHECK (
    credit_status != 'applied' OR contract_key IS NOT NULL
  );

-- ─── INDEXES ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_measures_commerce_trace_assessment_key
  ON public.measures_commerce_trace (assessment_key);

CREATE INDEX IF NOT EXISTS idx_measures_commerce_trace_institution_key
  ON public.measures_commerce_trace (institution_key);

CREATE INDEX IF NOT EXISTS idx_measures_commerce_trace_payment_status
  ON public.measures_commerce_trace (payment_status);

CREATE INDEX IF NOT EXISTS idx_measures_commerce_trace_credit_status
  ON public.measures_commerce_trace (credit_status);

-- ─── UPDATED_AT TRIGGER ───────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_measures_commerce_trace_updated_at
  ON public.measures_commerce_trace;

CREATE TRIGGER trg_measures_commerce_trace_updated_at
  BEFORE UPDATE ON public.measures_commerce_trace
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
