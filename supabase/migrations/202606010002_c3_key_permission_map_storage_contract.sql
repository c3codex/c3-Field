-- c3 Key Permission Map Storage Contract v1
-- Source OAR2: docs/oar/measures_interoperability/oar2_c3_key_permission_map_storage_contract_v1.meta.md
--
-- This seats the permission-map storage surface only. It does not grant
-- permissions, activate runtime, open public access, bind wallets, mint NFTs,
-- activate DAO/distribution/payment standing, or create recognition/conversion.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.c3_key_permission_map (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  temp_key_id uuid REFERENCES public.c3_key_temp(id) ON DELETE SET NULL,
  public_ref text,

  key_form text NOT NULL CHECK (
    key_form IN (
      'temporary',
      'wallet_held'
    )
  ),

  origin_type text NOT NULL CHECK (
    origin_type IN (
      'named_individual',
      'institution_in_service'
    )
  ),

  source_record_type text NOT NULL CHECK (
    source_record_type IN (
      'SRC',
      'SRC1',
      'SRC2',
      'future_SRC3'
    )
  ),

  source_record_id text NOT NULL,
  source_oar_id text NOT NULL,
  source_oar_path text,

  permission_class text NOT NULL CHECK (
    permission_class IN (
      'measures_registry_participation',
      'c3_map_access',
      'c3_map_c1_access',
      'c3_map_c2_access',
      'c3_map_c3_access',
      'assessment_access',
      'conversion_intake_access',
      'agreement_acknowledgment_access',
      'communication_trace_support',
      'course_access',
      'cohort_access',
      'operator_support_read',
      'event_access',
      'commons_access',
      'branch_access',
      'role_based_access',
      'contribution_submission',
      'distribution_eligibility',
      'dao_voting',
      'wallet_migration'
    )
  ),

  permission_status text NOT NULL CHECK (
    permission_status IN (
      'pending',
      'active',
      'held',
      'expired',
      'revoked',
      'rejected',
      'migrated'
    )
  ),

  branch_key text,
  branch_scope text,

  role_nft_contract text,
  role_nft_token_id text,
  role_key text,

  audit_id uuid REFERENCES public.c3_key_system_function_audit(id) ON DELETE SET NULL,

  expires_at timestamptz,
  revoked_at timestamptz,

  support_safe boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT c3_key_permission_map_public_ref_or_temp_key_check
    CHECK (public_ref IS NOT NULL OR temp_key_id IS NOT NULL),
  CONSTRAINT c3_key_permission_map_public_ref_not_blank_check
    CHECK (public_ref IS NULL OR length(btrim(public_ref)) > 0),
  CONSTRAINT c3_key_permission_map_source_record_id_not_blank_check
    CHECK (length(btrim(source_record_id)) > 0),
  CONSTRAINT c3_key_permission_map_source_oar_id_not_blank_check
    CHECK (length(btrim(source_oar_id)) > 0),
  CONSTRAINT c3_key_permission_map_source_oar_path_not_blank_check
    CHECK (source_oar_path IS NULL OR length(btrim(source_oar_path)) > 0),
  CONSTRAINT c3_key_permission_map_branch_scope_required_check
    CHECK (
      permission_class <> 'branch_access'
      OR (
        branch_key IS NOT NULL
        AND length(btrim(branch_key)) > 0
        AND branch_scope IS NOT NULL
        AND length(btrim(branch_scope)) > 0
      )
    ),
  CONSTRAINT c3_key_permission_map_role_key_not_blank_check
    CHECK (role_key IS NULL OR length(btrim(role_key)) > 0),
  CONSTRAINT c3_key_permission_map_role_contract_not_blank_check
    CHECK (role_nft_contract IS NULL OR length(btrim(role_nft_contract)) > 0),
  CONSTRAINT c3_key_permission_map_role_token_not_blank_check
    CHECK (role_nft_token_id IS NULL OR length(btrim(role_nft_token_id)) > 0),
  CONSTRAINT c3_key_permission_map_role_reference_required_check
    CHECK (
      permission_class <> 'role_based_access'
      OR permission_status <> 'active'
      OR role_key IS NOT NULL
    ),
  CONSTRAINT c3_key_permission_map_active_audit_required_check
    CHECK (permission_status <> 'active' OR audit_id IS NOT NULL),
  CONSTRAINT c3_key_permission_map_revoked_at_required_check
    CHECK (permission_status <> 'revoked' OR revoked_at IS NOT NULL),
  CONSTRAINT c3_key_permission_map_expired_expires_at_required_check
    CHECK (permission_status <> 'expired' OR expires_at IS NOT NULL),
  CONSTRAINT c3_key_permission_map_metadata_object_check
    CHECK (jsonb_typeof(metadata) = 'object'),
  CONSTRAINT c3_key_permission_map_support_safe_required_check
    CHECK (support_safe IS TRUE)
);

ALTER TABLE public.c3_key_permission_map ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS c3_key_permission_map_temp_key_idx
  ON public.c3_key_permission_map (temp_key_id, permission_class, permission_status);

CREATE INDEX IF NOT EXISTS c3_key_permission_map_public_ref_idx
  ON public.c3_key_permission_map (public_ref, permission_class, permission_status);

CREATE INDEX IF NOT EXISTS c3_key_permission_map_source_idx
  ON public.c3_key_permission_map (source_record_type, source_record_id);

CREATE INDEX IF NOT EXISTS c3_key_permission_map_source_oar_idx
  ON public.c3_key_permission_map (source_oar_id);

CREATE INDEX IF NOT EXISTS c3_key_permission_map_permission_idx
  ON public.c3_key_permission_map (permission_class, permission_status, expires_at);

CREATE INDEX IF NOT EXISTS c3_key_permission_map_branch_idx
  ON public.c3_key_permission_map (branch_key, branch_scope)
  WHERE permission_class = 'branch_access';

CREATE INDEX IF NOT EXISTS c3_key_permission_map_role_idx
  ON public.c3_key_permission_map (role_key)
  WHERE role_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS c3_key_permission_map_audit_idx
  ON public.c3_key_permission_map (audit_id)
  WHERE audit_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.c3_key_permission_map_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS c3_key_permission_map_set_updated_at ON public.c3_key_permission_map;
CREATE TRIGGER c3_key_permission_map_set_updated_at
BEFORE UPDATE ON public.c3_key_permission_map
FOR EACH ROW EXECUTE FUNCTION public.c3_key_permission_map_set_updated_at();
