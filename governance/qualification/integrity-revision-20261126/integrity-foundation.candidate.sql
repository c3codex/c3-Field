-- UNINSTALLED replacement for reviewed d11939b6dba4c35d40cf30a13493b4c1ad8967e4.
-- Separate effect: persistent state integrity, successor uniqueness, public TRUNCATE containment.
-- Existing #33 / PR114. Independent acceptance and live disposition remain required.
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
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.c3_pac'::regclass
    AND conname='c3_pac_effective_state_consistent_v1')
  THEN RAISE EXCEPTION 'DNR existing_constraint_requires_exact_readback'; END IF;
END $preflight$;
ALTER TABLE public.c3_pac ADD CONSTRAINT c3_pac_effective_state_consistent_v1
  CHECK (NOT is_effective OR superseded_at IS NULL);
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
  IF NOT EXISTS (SELECT 1 FROM pg_constraint
    WHERE conrelid='public.c3_pac'::regclass AND conname='c3_pac_effective_state_consistent_v1'
      AND contype='c' AND convalidated AND NOT connoinherit
      AND pg_get_expr(conbin,conrelid)='((NOT is_effective) OR (superseded_at IS NULL))')
  THEN RAISE EXCEPTION 'DNR effective_state_constraint_not_exact'; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_index
    WHERE indexrelid='public.c3_pac_one_effective_successor_v1'::regclass
      AND indrelid='public.c3_pac'::regclass AND indisunique AND indisvalid AND indisready
      AND indnkeyatts=1 AND indnatts=1
      AND indkey::text=(SELECT attnum::text FROM pg_attribute
        WHERE attrelid='public.c3_pac'::regclass AND attname='supersedes_pac_key')
      AND pg_get_expr(indpred,indrelid)='((supersedes_pac_key IS NOT NULL) AND is_effective AND (superseded_at IS NULL))')
  THEN RAISE EXCEPTION 'DNR successor_index_not_exact'; END IF;
END $verify$;
COMMIT;
