-- UNINSTALLED CANDIDATE. Existing workset #33 / PR #114.
-- Scope: protocol-independent successor uniqueness and public-role TRUNCATE containment.
-- Not a native SRC writer; not a registration protocol migration.
-- Independent qualification and live disposition required before production.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';
LOCK TABLE public.c3_pac, public.c3_pac_member, public.c3_pac_relation IN ACCESS EXCLUSIVE MODE;
DO $preflight$
BEGIN
  IF EXISTS (SELECT 1 FROM public.c3_pac WHERE is_effective AND superseded_at IS NOT NULL)
  THEN RAISE EXCEPTION 'DNR inconsistent_effective_state'; END IF;
  IF EXISTS (SELECT 1 FROM public.c3_pac
    WHERE supersedes_pac_key IS NOT NULL AND is_effective AND superseded_at IS NULL
    GROUP BY supersedes_pac_key HAVING count(*) > 1)
  THEN RAISE EXCEPTION 'DNR competing_effective_successors'; END IF;
  IF to_regclass('public.c3_pac_one_effective_successor_v1') IS NOT NULL
  THEN RAISE EXCEPTION 'DNR existing_index_requires_exact_readback'; END IF;
END $preflight$;
CREATE UNIQUE INDEX c3_pac_one_effective_successor_v1
  ON public.c3_pac(supersedes_pac_key)
  WHERE supersedes_pac_key IS NOT NULL AND is_effective AND superseded_at IS NULL;
REVOKE TRUNCATE ON public.c3_pac, public.c3_pac_member, public.c3_pac_relation
  FROM PUBLIC, anon, authenticated;
DO $verify$
DECLARE r text; t text;
BEGIN
  FOREACH r IN ARRAY ARRAY['anon','authenticated'] LOOP
    FOREACH t IN ARRAY ARRAY['public.c3_pac','public.c3_pac_member','public.c3_pac_relation'] LOOP
      IF has_table_privilege(r,t,'TRUNCATE') THEN
        RAISE EXCEPTION 'DNR inherited_truncate_privilege % %',r,t;
      END IF;
    END LOOP;
  END LOOP;
  IF NOT EXISTS (SELECT 1 FROM pg_index
    WHERE indexrelid='public.c3_pac_one_effective_successor_v1'::regclass
      AND indrelid='public.c3_pac'::regclass AND indisunique AND indisvalid AND indisready)
  THEN RAISE EXCEPTION 'DNR successor_index_not_valid'; END IF;
END $verify$;
COMMIT;
