-- Temporary c3 Key Operator Packet Execution Wrapper v1
-- OAR2: docs/oar/measures_interoperability/oar2_temp_c3_key_operator_issuance_packet_v1.meta.md
--
-- PLACEHOLDER ONLY. Do not commit real personal data or real production packet
-- values. Copy this file to an ignored local execution surface, replace the
-- placeholders there, inspect the packet, then execute through the approved
-- service-role/admin route.
--
-- Required sequence:
-- 1. Record agreement acknowledgment in public.c3_key_temp_agreement_ack.
-- 2. Call public.issue_temp_c3_key(...).
-- 3. Bind the acknowledgment row to the returned temp_key_id.
-- 4. Return support-safe payload only.
--
-- Real issuance remains held until the operator supplies a completed packet and
-- confirms execution.

BEGIN;

WITH packet AS (
  SELECT
    '<source_oar_id>'::text AS source_oar_id,
    '<origin_type>'::text AS origin_type,
    '<named_individual_ref>'::text AS named_individual_ref,
    NULLIF('<institution_key>', '')::text AS institution_key,
    NULLIF('<contact_email>', '')::text AS contact_email,
    '<agreement_version>'::text AS agreement_version,
    '<agreement_title>'::text AS agreement_title,
    '<agreement_hash>'::text AS agreement_hash,
    '<agreement_acknowledgment_method>'::text AS agreement_acknowledgment_method,
    NULLIF('<agreement_acknowledged_at>', '')::timestamptz AS agreement_acknowledged_at,
    NULLIF('<payment_route>', '')::text AS payment_route,
    NULLIF('<payment_provider>', '')::text AS payment_provider,
    NULLIF('<payment_reference>', '')::text AS payment_reference,
    '<payment_status>'::text AS payment_status,
    NULLIF('<amount_due_cents>', '')::integer AS amount_due_cents,
    NULLIF('<amount_paid_cents>', '')::integer AS amount_paid_cents,
    COALESCE(NULLIF('<currency>', ''), 'usd')::text AS currency,
    NULLIF('<assessment_key>', '')::text AS assessment_key,
    '<assessment_credit_status>'::text AS assessment_credit_status,
    NULLIF('<expires_at>', '')::timestamptz AS expires_at,
    '{}'::jsonb AS metadata
),
agreement_ack AS (
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
  SELECT
    agreement_version,
    agreement_title,
    agreement_hash,
    named_individual_ref,
    institution_key,
    agreement_acknowledgment_method,
    source_oar_id,
    metadata,
    COALESCE(agreement_acknowledged_at, now())
  FROM packet
  WHERE length(btrim(agreement_version)) > 0
    AND length(btrim(agreement_title)) > 0
    AND length(btrim(agreement_hash)) > 0
    AND length(btrim(named_individual_ref)) > 0
    AND length(btrim(source_oar_id)) > 0
  RETURNING id
),
issued AS (
  SELECT issued.*
  FROM packet
  CROSS JOIN agreement_ack
  CROSS JOIN LATERAL public.issue_temp_c3_key(
    p_origin_type => packet.origin_type,
    p_named_individual_ref => packet.named_individual_ref,
    p_source_oar_id => packet.source_oar_id,
    p_institution_key => packet.institution_key,
    p_contact_email => packet.contact_email,
    p_payment_route => packet.payment_route,
    p_payment_provider => packet.payment_provider,
    p_payment_reference => packet.payment_reference,
    p_payment_status => packet.payment_status,
    p_amount_due_cents => packet.amount_due_cents,
    p_amount_paid_cents => packet.amount_paid_cents,
    p_currency => packet.currency,
    p_assessment_key => packet.assessment_key,
    p_assessment_credit_status => packet.assessment_credit_status,
    p_expires_at => packet.expires_at,
    p_metadata => packet.metadata
  ) AS issued
),
bound_ack AS (
  UPDATE public.c3_key_temp_agreement_ack ack
  SET temp_key_id = issued.id
  FROM agreement_ack
  CROSS JOIN issued
  WHERE ack.id = agreement_ack.id
  RETURNING ack.id
)
SELECT
  issued.id AS temp_key_id,
  issued.public_ref,
  issued.status,
  issued.payment_status,
  issued.assessment_credit_status,
  issued.origin_type,
  issued.institution_key,
  true AS agreement_acknowledged,
  packet.agreement_version,
  issued.created_at,
  issued.expires_at
FROM issued
CROSS JOIN packet;

COMMIT;
