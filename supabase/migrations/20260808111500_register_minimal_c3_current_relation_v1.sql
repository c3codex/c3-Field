-- c3 Current — minimal governed present-state relation
-- Operator-confirmed implementation model from c3_ledger_0005.
-- Scope: state identity, evidence references, immutable lineage, safe resolve, governed advance.
-- This migration does NOT bind an environment, mint/modify a token, or alter CCC contract behavior.

BEGIN;

CREATE TABLE IF NOT EXISTS public.c3_current_state (
    current_state_key text PRIMARY KEY,
    env_key text NOT NULL,
    state_version integer NOT NULL,
    standing text NOT NULL,
    effective_at timestamptz NOT NULL DEFAULT now(),
    superseded_at timestamptz,
    formation_authority_ref text NOT NULL,
    advance_disposition_ref text,
    predecessor_current_state_key text REFERENCES public.c3_current_state(current_state_key) ON DELETE RESTRICT,
    is_current boolean NOT NULL DEFAULT false,
    source_grammar_key text NOT NULL DEFAULT 'codexstone_source_spark_weave_field_form',
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_by text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT c3_current_state_version_positive CHECK (state_version >= 1),
    CONSTRAINT c3_current_state_env_key_nonblank CHECK (btrim(env_key) <> ''),
    CONSTRAINT c3_current_state_standing_nonblank CHECK (btrim(standing) <> ''),
    CONSTRAINT c3_current_state_formation_authority_nonblank CHECK (btrim(formation_authority_ref) <> ''),
    CONSTRAINT c3_current_state_env_version_unique UNIQUE (env_key, state_version),
    CONSTRAINT c3_current_state_initial_or_successor CHECK (
        (
            state_version = 1
            AND predecessor_current_state_key IS NULL
            AND advance_disposition_ref IS NULL
        )
        OR
        (
            state_version > 1
            AND predecessor_current_state_key IS NOT NULL
            AND advance_disposition_ref IS NOT NULL
            AND btrim(advance_disposition_ref) <> ''
        )
    )
);

CREATE UNIQUE INDEX IF NOT EXISTS c3_current_state_one_current_per_env
    ON public.c3_current_state (env_key)
    WHERE is_current = true;

CREATE INDEX IF NOT EXISTS c3_current_state_predecessor_idx
    ON public.c3_current_state (predecessor_current_state_key);

CREATE TABLE IF NOT EXISTS public.c3_current_evidence_ref (
    current_evidence_ref_key text PRIMARY KEY,
    current_state_key text NOT NULL REFERENCES public.c3_current_state(current_state_key) ON DELETE RESTRICT,
    evidence_key text NOT NULL,
    evidence_class text NOT NULL,
    asset_key text,
    content_hash text NOT NULL,
    hash_algorithm text NOT NULL DEFAULT 'sha256',
    authoritative_custody_type text NOT NULL,
    authoritative_custody_provider text,
    authoritative_custody_identifier text,
    authoritative_custody_location text,
    evidence_standing text NOT NULL,
    source_execution_instance_id text,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT c3_current_evidence_key_nonblank CHECK (btrim(evidence_key) <> ''),
    CONSTRAINT c3_current_evidence_class_nonblank CHECK (btrim(evidence_class) <> ''),
    CONSTRAINT c3_current_evidence_hash_nonblank CHECK (btrim(content_hash) <> ''),
    CONSTRAINT c3_current_evidence_custody_nonblank CHECK (btrim(authoritative_custody_type) <> ''),
    CONSTRAINT c3_current_evidence_standing_nonblank CHECK (btrim(evidence_standing) <> ''),
    CONSTRAINT c3_current_evidence_identity_unique UNIQUE (current_state_key, evidence_key, content_hash)
);

CREATE INDEX IF NOT EXISTS c3_current_evidence_state_idx
    ON public.c3_current_evidence_ref (current_state_key);

CREATE OR REPLACE FUNCTION public.c3_current_validate_lineage()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    predecessor public.c3_current_state%ROWTYPE;
BEGIN
    IF NEW.predecessor_current_state_key IS NULL THEN
        IF NEW.state_version <> 1 THEN
            RAISE EXCEPTION 'initial Current state must use state_version 1';
        END IF;
        RETURN NEW;
    END IF;

    IF NEW.predecessor_current_state_key = NEW.current_state_key THEN
        RAISE EXCEPTION 'Current state cannot be its own predecessor';
    END IF;

    SELECT *
      INTO predecessor
      FROM public.c3_current_state
     WHERE current_state_key = NEW.predecessor_current_state_key;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'predecessor Current state not found: %', NEW.predecessor_current_state_key;
    END IF;

    IF predecessor.env_key <> NEW.env_key THEN
        RAISE EXCEPTION 'Current predecessor env_key mismatch';
    END IF;

    IF NEW.state_version <> predecessor.state_version + 1 THEN
        RAISE EXCEPTION 'Current successor state_version must equal predecessor + 1';
    END IF;

    IF NEW.advance_disposition_ref IS NULL OR btrim(NEW.advance_disposition_ref) = '' THEN
        RAISE EXCEPTION 'Current successor requires governed advance_disposition_ref';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_c3_current_validate_lineage ON public.c3_current_state;
CREATE TRIGGER trg_c3_current_validate_lineage
BEFORE INSERT OR UPDATE OF env_key, state_version, predecessor_current_state_key, advance_disposition_ref
ON public.c3_current_state
FOR EACH ROW
EXECUTE FUNCTION public.c3_current_validate_lineage();

-- Safe resolver-facing projection. It exposes Current identity/standing and hash-bound evidence
-- without exposing evidence content or full custody location details.
CREATE OR REPLACE FUNCTION public.resolve_c3_current(p_env_key text)
RETURNS TABLE (
    current_state_key text,
    env_key text,
    state_version integer,
    standing text,
    effective_at timestamptz,
    predecessor_current_state_key text,
    source_grammar_key text,
    evidence_refs jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT
        s.current_state_key,
        s.env_key,
        s.state_version,
        s.standing,
        s.effective_at,
        s.predecessor_current_state_key,
        s.source_grammar_key,
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'evidence_key', e.evidence_key,
                    'evidence_class', e.evidence_class,
                    'asset_key', e.asset_key,
                    'content_hash', e.content_hash,
                    'hash_algorithm', e.hash_algorithm,
                    'custody_type', e.authoritative_custody_type,
                    'evidence_standing', e.evidence_standing,
                    'source_execution_instance_id', e.source_execution_instance_id
                )
                ORDER BY e.created_at, e.current_evidence_ref_key
            ) FILTER (WHERE e.current_evidence_ref_key IS NOT NULL),
            '[]'::jsonb
        ) AS evidence_refs
    FROM public.c3_current_state s
    LEFT JOIN public.c3_current_evidence_ref e
      ON e.current_state_key = s.current_state_key
    WHERE s.env_key = p_env_key
      AND s.is_current = true
    GROUP BY
        s.current_state_key,
        s.env_key,
        s.state_version,
        s.standing,
        s.effective_at,
        s.predecessor_current_state_key,
        s.source_grammar_key;
$$;

-- Atomic governed successor operation. New evidence alone cannot advance Current;
-- a nonblank governed disposition reference is mandatory.
CREATE OR REPLACE FUNCTION public.advance_c3_current(
    p_env_key text,
    p_expected_current_state_key text,
    p_new_current_state_key text,
    p_new_standing text,
    p_formation_authority_ref text,
    p_advance_disposition_ref text,
    p_created_by text,
    p_effective_at timestamptz DEFAULT now(),
    p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS public.c3_current_state
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    prior_state public.c3_current_state%ROWTYPE;
    new_state public.c3_current_state%ROWTYPE;
BEGIN
    IF p_advance_disposition_ref IS NULL OR btrim(p_advance_disposition_ref) = '' THEN
        RAISE EXCEPTION 'advance_c3_current requires governed disposition reference';
    END IF;

    IF p_formation_authority_ref IS NULL OR btrim(p_formation_authority_ref) = '' THEN
        RAISE EXCEPTION 'advance_c3_current requires formation authority reference';
    END IF;

    SELECT *
      INTO prior_state
      FROM public.c3_current_state
     WHERE env_key = p_env_key
       AND current_state_key = p_expected_current_state_key
       AND is_current = true
     FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'expected current state not found for env_key %', p_env_key;
    END IF;

    UPDATE public.c3_current_state
       SET is_current = false,
           superseded_at = p_effective_at,
           updated_at = now()
     WHERE current_state_key = prior_state.current_state_key;

    INSERT INTO public.c3_current_state (
        current_state_key,
        env_key,
        state_version,
        standing,
        effective_at,
        formation_authority_ref,
        advance_disposition_ref,
        predecessor_current_state_key,
        is_current,
        source_grammar_key,
        metadata,
        created_by
    ) VALUES (
        p_new_current_state_key,
        p_env_key,
        prior_state.state_version + 1,
        p_new_standing,
        p_effective_at,
        p_formation_authority_ref,
        p_advance_disposition_ref,
        prior_state.current_state_key,
        true,
        prior_state.source_grammar_key,
        COALESCE(p_metadata, '{}'::jsonb),
        p_created_by
    )
    RETURNING * INTO new_state;

    RETURN new_state;
END;
$$;

COMMENT ON TABLE public.c3_current_state IS
'c3 Current governed present-state relation. Preserves which state presently governs an env_key and immutable predecessor lineage. It is not the evidence artifact or token contract.';

COMMENT ON TABLE public.c3_current_evidence_ref IS
'Hash-bound evidence references supporting a c3 Current state. Evidence remains in governed custody; this table does not store evidence content.';

COMMENT ON COLUMN public.c3_current_state.source_grammar_key IS
'Provenance link to Source: Spark / Weave / Field / Form from the Codexstone inscription. Does not canonize provisional 3x3 expansion cells.';

ALTER TABLE public.c3_current_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.c3_current_evidence_ref ENABLE ROW LEVEL SECURITY;

-- Base authority tables are not browser-write surfaces.
REVOKE ALL ON TABLE public.c3_current_state FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.c3_current_evidence_ref FROM PUBLIC, anon, authenticated;

-- Resolve is the only browser-consumable Current read surface in this minimal registration.
REVOKE ALL ON FUNCTION public.resolve_c3_current(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.resolve_c3_current(text) TO anon, authenticated, service_role;

-- Advance is operationally restricted; no public or ordinary authenticated execution.
REVOKE ALL ON FUNCTION public.advance_c3_current(text, text, text, text, text, text, text, timestamptz, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.advance_c3_current(text, text, text, text, text, text, text, timestamptz, jsonb) TO service_role;

-- Lineage validator is trigger-only.
REVOKE ALL ON FUNCTION public.c3_current_validate_lineage() FROM PUBLIC, anon, authenticated;

COMMIT;
