-- Temporary c3 Key Operator Issuance Packet v1
-- Source OAR2: docs/oar/measures_interoperability/oar2_temp_c3_key_operator_issuance_packet_v1.meta.md
--
-- This migration seats the agreement acknowledgment surface required before
-- real temporary c3 Key issuance. It does not issue real temp keys, activate
-- payment processors, mint NFTs, bind wallets, create recognition, create
-- conversion, open public policies, or modify frontend runtime/CSS.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.c3_key_temp_agreement_ack (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  temp_key_id uuid REFERENCES public.c3_key_temp(id) ON DELETE CASCADE,

  agreement_version text NOT NULL,
  agreement_title text NOT NULL,
  agreement_hash text NOT NULL,

  acknowledged_by_named_individual_ref text NOT NULL,
  institution_key text,

  acknowledgment_method text NOT NULL CHECK (
    acknowledgment_method IN (
      'operator_recorded',
      'form_checkbox',
      'signature',
      'email_confirmation'
    )
  ),

  source_oar_id text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

  acknowledged_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT c3_key_temp_agreement_ack_metadata_object_check
    CHECK (jsonb_typeof(metadata) = 'object'),
  CONSTRAINT c3_key_temp_agreement_ack_hash_not_blank_check
    CHECK (length(btrim(agreement_hash)) > 0),
  CONSTRAINT c3_key_temp_agreement_ack_named_individual_not_blank_check
    CHECK (length(btrim(acknowledged_by_named_individual_ref)) > 0),
  CONSTRAINT c3_key_temp_agreement_ack_source_oar_not_blank_check
    CHECK (length(btrim(source_oar_id)) > 0)
);

ALTER TABLE public.c3_key_temp_agreement_ack ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS c3_key_temp_agreement_ack_temp_key_idx
  ON public.c3_key_temp_agreement_ack (temp_key_id);

CREATE INDEX IF NOT EXISTS c3_key_temp_agreement_ack_named_individual_idx
  ON public.c3_key_temp_agreement_ack (acknowledged_by_named_individual_ref);

CREATE INDEX IF NOT EXISTS c3_key_temp_agreement_ack_source_oar_idx
  ON public.c3_key_temp_agreement_ack (source_oar_id);

CREATE INDEX IF NOT EXISTS c3_key_temp_agreement_ack_hash_idx
  ON public.c3_key_temp_agreement_ack (agreement_hash);
