import {readFileSync,writeFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
const root=new URL('./',import.meta.url)
const candidate=readFileSync(new URL('legacy-succession.candidate.sql',root),'utf8')
const guard=`-- Installation candidate only. Independent Registrar acceptance of these exact bytes is unresolved.
-- Target: zfihrspxvennjzazxcbj. No PAC, consent, accrual, permission-membership or release mutation.
-- Atomic rollback on failure; explicit rollback-validator.sql restores the prior validator.
BEGIN;
DO $guard$
BEGIN
 IF encode(extensions.digest(convert_to(pg_get_functiondef('public.c3_validate_pac_supersession_v1(jsonb,boolean)'::regprocedure),'UTF8'),'sha256'),'hex') <> 'f28c9a11e3ffa035135e520f6fdcbb190dabef3e51d19647fddbf3b09f586861' THEN
  RAISE EXCEPTION 'held_source_preimage_mismatch';
 END IF;
 IF to_regprocedure('public.c3field_legacy_predecessor_snapshot_v1()') IS NOT NULL THEN
  RAISE EXCEPTION 'held_existing_helper_requires_independent_reconciliation';
 END IF;
END $guard$;
`
writeFileSync(new URL('install.candidate.sql',root),guard+candidate+'\nCOMMIT;\n')
console.log(JSON.stringify({standing:'SOURCE_INSTALLATION_CANDIDATE_NOT_INSTALLED',sha256:createHash('sha256').update(guard+candidate+'\nCOMMIT;\n').digest('hex')}))
