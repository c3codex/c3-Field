-- c3 Key Permission Map Support Read Model v1
-- Source OAR2: docs/oar/measures_interoperability/oar2_c3_key_permission_map_support_read_model_v1.meta.md
--
-- This seats a service-role/admin support-safe read RPC. It does not grant
-- permissions, activate permission standing, open public access, wire runtime,
-- mutate records, bind wallets, mint NFTs, or create recognition/conversion.

CREATE OR REPLACE FUNCTION public.get_c3_key_permission_map_support_read(
  p_public_ref text DEFAULT NULL,
  p_permission_class text DEFAULT NULL
)
RETURNS TABLE (
  permission_id uuid,
  temp_key_id uuid,
  public_ref text,
  key_form text,
  origin_type text,
  source_record_type text,
  source_record_id text,
  source_oar_id text,
  source_oar_path text,
  permission_class text,
  permission_status text,
  branch_key text,
  branch_scope text,
  role_key text,
  role_nft_contract text,
  role_nft_token_id text,
  audit_id uuid,
  expires_at timestamptz,
  revoked_at timestamptz,
  support_safe boolean,
  created_at timestamptz,
  updated_at timestamptz,
  has_audit_link boolean,
  is_expired boolean,
  has_branch_scope boolean,
  has_role_reference boolean
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    pm.id AS permission_id,
    pm.temp_key_id,
    pm.public_ref,
    pm.key_form,
    pm.origin_type,
    pm.source_record_type,
    pm.source_record_id,
    pm.source_oar_id,
    pm.source_oar_path,
    pm.permission_class,
    pm.permission_status,
    pm.branch_key,
    pm.branch_scope,
    pm.role_key,
    pm.role_nft_contract,
    pm.role_nft_token_id,
    pm.audit_id,
    pm.expires_at,
    pm.revoked_at,
    pm.support_safe,
    pm.created_at,
    pm.updated_at,
    pm.audit_id IS NOT NULL AS has_audit_link,
    pm.expires_at IS NOT NULL AND pm.expires_at <= now() AS is_expired,
    pm.branch_key IS NOT NULL OR pm.branch_scope IS NOT NULL AS has_branch_scope,
    pm.role_key IS NOT NULL
      OR pm.role_nft_contract IS NOT NULL
      OR pm.role_nft_token_id IS NOT NULL AS has_role_reference
  FROM public.c3_key_permission_map pm
  WHERE (p_public_ref IS NULL OR pm.public_ref = p_public_ref)
    AND (
      p_permission_class IS NULL
      OR pm.permission_class = p_permission_class
    )
  ORDER BY pm.created_at DESC;
$$;

REVOKE ALL ON FUNCTION public.get_c3_key_permission_map_support_read(
  text,
  text
) FROM PUBLIC;

REVOKE ALL ON FUNCTION public.get_c3_key_permission_map_support_read(
  text,
  text
) FROM anon;

REVOKE ALL ON FUNCTION public.get_c3_key_permission_map_support_read(
  text,
  text
) FROM authenticated;

GRANT EXECUTE ON FUNCTION public.get_c3_key_permission_map_support_read(
  text,
  text
) TO service_role;
