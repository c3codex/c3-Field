-- Temporary c3 Key Communication Trace Surface v1
-- Source OAR2: docs/oar/measures_interoperability/oar2_temp_c3_key_communication_trace_surface_v1.meta.md
--
-- This seats a support-safe communication trace surface for temporary c3 Key
-- communications. It does not send email, alter runtime/CSS, open public RLS
-- policies, mint NFTs, bind wallets, activate payments, or create recognition
-- / conversion standing.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.c3_key_communication_trace (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  temp_key_id uuid REFERENCES public.c3_key_temp(id) ON DELETE SET NULL,

  communication_type text NOT NULL CHECK (
    communication_type IN (
      'temp_key_confirmation',
      'agreement_notice',
      'expiration_notice',
      'renewal_notice',
      'wallet_migration_notice',
      'payment_notice',
      'support_notice'
    )
  ),

  delivery_channel text NOT NULL CHECK (
    delivery_channel IN (
      'email',
      'operator_record',
      'manual',
      'system'
    )
  ),

  delivery_status text NOT NULL CHECK (
    delivery_status IN (
      'prepared',
      'sent',
      'delivered_to_provider',
      'held',
      'failed',
      'cancelled'
    )
  ),

  provider text,
  provider_message_id text,

  recipient_ref text,
  sender_ref text,
  reply_to_ref text,

  public_ref text,
  subject text,

  source_oar_id text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT c3_key_communication_trace_metadata_object_check
    CHECK (jsonb_typeof(metadata) = 'object'),
  CONSTRAINT c3_key_communication_trace_source_oar_not_blank_check
    CHECK (length(btrim(source_oar_id)) > 0),
  CONSTRAINT c3_key_communication_trace_provider_message_not_blank_check
    CHECK (provider_message_id IS NULL OR length(btrim(provider_message_id)) > 0),
  CONSTRAINT c3_key_communication_trace_public_ref_not_blank_check
    CHECK (public_ref IS NULL OR length(btrim(public_ref)) > 0)
);

ALTER TABLE public.c3_key_communication_trace ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS c3_key_communication_trace_temp_key_idx
  ON public.c3_key_communication_trace (temp_key_id, created_at);

CREATE INDEX IF NOT EXISTS c3_key_communication_trace_public_ref_idx
  ON public.c3_key_communication_trace (public_ref);

CREATE INDEX IF NOT EXISTS c3_key_communication_trace_type_status_idx
  ON public.c3_key_communication_trace (communication_type, delivery_status);

CREATE INDEX IF NOT EXISTS c3_key_communication_trace_source_oar_idx
  ON public.c3_key_communication_trace (source_oar_id);

CREATE UNIQUE INDEX IF NOT EXISTS c3_key_communication_trace_provider_message_uidx
  ON public.c3_key_communication_trace (provider, provider_message_id)
  WHERE provider IS NOT NULL AND provider_message_id IS NOT NULL;

WITH resolved_temp_key AS (
  SELECT id, public_ref
  FROM public.c3_key_temp
  WHERE public_ref = 'C3-TEMP-1A135A'
  LIMIT 1
), inserted AS (
  INSERT INTO public.c3_key_communication_trace (
    temp_key_id,
    communication_type,
    delivery_channel,
    delivery_status,
    provider,
    provider_message_id,
    recipient_ref,
    sender_ref,
    reply_to_ref,
    public_ref,
    subject,
    source_oar_id,
    metadata,
    sent_at
  )
  SELECT
    resolved_temp_key.id,
    'temp_key_confirmation',
    'email',
    'delivered_to_provider',
    'resend',
    '283da82e-c839-4ba5-b92d-1c0579b79388',
    'connect@measuresregistry.com',
    'Measures Registry <notifications@measuresregistry.com>',
    'connect@measuresregistry.com',
    resolved_temp_key.public_ref,
    'Temporary c3 Key Confirmation - C3-TEMP-1A135A',
    'oar2_temp_c3_key_email_provider_configuration_and_delivery_retry_v1',
    jsonb_build_object(
      'source_oar2', 'docs/oar/measures_interoperability/oar2_temp_c3_key_communication_trace_surface_v1.meta.md',
      'delivery_oar1', 'docs/oar/measures_interoperability/oar1_temp_c3_key_email_provider_configuration_and_delivery_retry_v1.meta.md',
      'support_safe', true,
      'raw_email_body_stored', false,
      'secrets_stored', false,
      'temp_key_stored', false
    ),
    now()
  FROM resolved_temp_key
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.c3_key_communication_trace existing
    WHERE existing.provider = 'resend'
      AND existing.provider_message_id = '283da82e-c839-4ba5-b92d-1c0579b79388'
  )
  RETURNING id
)
SELECT count(*) AS inserted_trace_rows
FROM inserted;
