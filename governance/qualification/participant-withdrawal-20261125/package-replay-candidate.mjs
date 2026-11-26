import {readFileSync,writeFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
const root=new URL('./',import.meta.url)
const source=readFileSync(new URL('terminate-replay.candidate.sql',root),'utf8')
const sql=`-- Candidate only. No production installation authority or acceptance is created here.
-- Existing function ACL remains unchanged; native original is the rollback definition.
BEGIN;
DO $guard$
BEGIN
 IF encode(extensions.digest(convert_to(pg_get_functiondef('public.terminate_my_env_owner_v1(jsonb)'::regprocedure),'UTF8'),'sha256'),'hex') <> '95b81d207113027b368536235bdaf33a4c0758aa12957d3bfa97c437444de844' THEN
  RAISE EXCEPTION 'held_owner_lifecycle_source_preimage_mismatch';
 END IF;
END $guard$;
${source}
COMMIT;
`
writeFileSync(new URL('terminate-replay.install-candidate.sql',root),sql)
console.log(JSON.stringify({standing:'SOURCE_CANDIDATE_NOT_INSTALLED',sha256:createHash('sha256').update(sql).digest('hex')}))
