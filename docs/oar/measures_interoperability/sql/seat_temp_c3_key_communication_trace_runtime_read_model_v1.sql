-- Temporary c3 Key Communication Trace Runtime Read Model v1
-- Source OAR2: docs/oar/measures_interoperability/oar2_temp_c3_key_communication_trace_runtime_read_model_v1.meta.md
--
-- This seats an admin/service-role support-safe read RPC. It does not open
-- public RLS policies, wire frontend runtime, mutate records, send email,
-- activate payment, mint NFTs, bind wallets, or create recognition/conversion.

CREATE OR REPLACE FUNCTION public.get_c3_key_communication_trace_support_read(
  p_public_ref text DEFAULT NULL,
  p_provider_message_id text DEFAULT NULL
)
RETURNS TABLE (
  trace_id uuid,
  temp_key_id uuid,
  public_ref text,
  communication_type text,
  delivery_channel text,
  delivery_status text,
  provider text,
  provider_message_id text,
  recipient_ref text,
  sender_ref text,
  reply_to_ref text,
  subject text,
  source_oar_id text,
  sent_at timestamptz,
  created_at timestamptz,
  has_temp_key_binding boolean,
  support_metadata jsonb
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    ct.id AS trace_id,
    ct.temp_key_id,
    ct.public_ref,
    ct.communication_type,
    ct.delivery_channel,
    ct.delivery_status,
    ct.provider,
    ct.provider_message_id,
    ct.recipient_ref,
    ct.sender_ref,
    ct.reply_to_ref,
    ct.subject,
    ct.source_oar_id,
    ct.sent_at,
    ct.created_at,
    ct.temp_key_id IS NOT NULL AS has_temp_key_binding,
    jsonb_build_object(
      'support_safe', ct.metadata -> 'support_safe',
      'raw_email_body_stored', ct.metadata -> 'raw_email_body_stored',
      'secrets_stored', ct.metadata -> 'secrets_stored',
      'temp_key_stored', ct.metadata -> 'temp_key_stored'
    ) AS support_metadata
  FROM public.c3_key_communication_trace ct
  WHERE (p_public_ref IS NULL OR ct.public_ref = p_public_ref)
    AND (
      p_provider_message_id IS NULL
      OR ct.provider_message_id = p_provider_message_id
    )
  ORDER BY ct.created_at DESC;
$$;

REVOKE ALL ON FUNCTION public.get_c3_key_communication_trace_support_read(
  text,
  text
) FROM PUBLIC;

REVOKE ALL ON FUNCTION public.get_c3_key_communication_trace_support_read(
  text,
  text
) FROM anon;

REVOKE ALL ON FUNCTION public.get_c3_key_communication_trace_support_read(
  text,
  text
) FROM authenticated;

GRANT EXECUTE ON FUNCTION public.get_c3_key_communication_trace_support_read(
  text,
  text
) TO service_role;
