-- Read-only catalog verification. No Registry formation or authority mutation.
-- Use after applying the preserved migration in an isolated verification DB,
-- or against a separately authorized read-only Registry inspection surface.
select function_ref,
       expected_sha256,
       encode(sha256(convert_to(pg_get_functiondef(function_ref::regprocedure), 'UTF8')), 'hex') as observed_sha256,
       encode(sha256(convert_to(pg_get_functiondef(function_ref::regprocedure), 'UTF8')), 'hex') = expected_sha256 as exact_hash_pass
from (values
  ('public.resolve_c3ops_my_stash_v1(jsonb)', 'bb797b51ccf956248b0166aed60e498bc2021092e38896919690a2f79c9e561d'),
  ('public.call_c3ops_nug_native_v1(jsonb,text)', 'da3d7694b04aa3e51807abc2720c6fd4bebf3cfee0fda71831349f350379e4ab')
) expected(function_ref, expected_sha256);
