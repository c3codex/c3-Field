// Reuse prior isolated tests; change only the new system-owner transition and its evidence predicate.
import {readFileSync,writeFileSync} from 'node:fs'
const old=new URL('../field-legacy-succession-20261125/qualify-succession.mjs',import.meta.url)
let fixture=readFileSync(old,'utf8')
fixture=fixture.replace("from 'pg'",'from '+JSON.stringify(import.meta.resolve('pg')))
fixture=fixture.replace(" await client.query(await readFile(new URL('./legacy-succession.candidate.sql',import.meta.url),'utf8'))",` await client.query(\`alter table c3_envpac add owner_subject_type text default 'system';alter table c3_envpac add owner_subject_key text default 'c3_field';create table codex_source_reference(source_key text,source_status text,source_hash text,metadata jsonb);insert into codex_source_reference values('c3field_public_identity_authority_v1_0','committed','819102c92167a77895671bd2b31bd29abeb571696274b1072de33e1ccccf61cf','{"legal_entity":"c3 Community Partners DAO, LLC"}');\`)
 await client.query(await readFile(${JSON.stringify(new URL('./system-succession.candidate.sql',import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1'))},'utf8'))`)
fixture=fixture.replace("owner_subject_type:'institution',owner_subject_key:'c3_community_partners_dao_llc'","owner_subject_type:'system',owner_subject_key:'c3_field'")
 .replace("'owner_subject_type','institution','owner_subject_key','c3_community_partners_dao_llc'","'owner_subject_type','system','owner_subject_key','c3_field'")
 .replaceAll('fixture_institution_environment','env_c3_field')
 .replace("update fixture_seat set qualified=false","update codex_source_reference set source_status='withdrawn'")
 .replace("update fixture_seat set qualified=true","update codex_source_reference set source_status='committed'")
 .replace('institutional eligibility preserved','registered system/legal-parent evidence required')
 .replace('HLD_INSTITUTIONAL_SEAT_REQUIRED','system_parent_formation_evidence_required')
const output=[];const original=console.log;console.log=(...values)=>{output.push(values.join(' '));original(...values)}
fixture=fixture.replace("check('exact evidence-qualified transition',await resolve(),'PASS')","check('exact evidence-qualified transition',await resolve(),'PASS'); const exact=await resolve();assert.equal(exact.owner_subject_type,'system');assert.equal(exact.owner_subject_key,'c3_field');console.log('PASS returned owner is the qualified system');count++")
try{await import('data:text/javascript,'+encodeURIComponent(fixture));writeFileSync(new URL('./system-succession-qualification.json',import.meta.url),JSON.stringify({scope:'isolated system succession fixture; no native registration',checks:output},null,2)+'\n')}finally{console.log=original}
