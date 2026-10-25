import pathlib,subprocess,json,hashlib,zipfile
p=pathlib.Path(__file__).parent;root=p.parents[2];e=pathlib.Path('C:/Users/c3DAO/OneDrive/Apps/c3Field/evidence/c3field-cw02-20261024');base='729012c179d73682cac7e95c94c4d2607939dbe8'
sha=lambda b:hashlib.sha256(b).hexdigest()
def git(*a):return subprocess.check_output(['git','-C',str(root),*a])
files=['oar2_concordance_authority_migration_execution_authorization_v1.meta.md','oar1_concordance_authority_migration_execution_authorization_v1.meta.md','concordance_authority_execution_package_migration_v1.sql','concordance_authority_execution_package_preflight_v1.sql','concordance_authority_execution_package_seed_concordance_v1_seating.sql','concordance_authority_execution_package_post_validation_v1.sql','concordance_authority_execution_package_rollback_recovery_v1.sql','concordance_authority_execution_package_order_notes_v1.md']
(p/'origin').mkdir(parents=True,exist_ok=True);manifest=[]
for name in files:
 path='docs/oar/c3_field/'+name;b=git('show',base+':'+path);blob=git('rev-parse',base+':'+path).decode().strip()
 if name.endswith('migration_v1.sql'):assert blob=='5a5ccfeda5f026db9cf0a078afce7117090b8bce'
 (p/'origin'/name).write_bytes(b);manifest.append({'path':path,'commit':base,'blob':blob,'bytes':len(b),'sha256':sha(b),'local':'origin/'+name})
spec=(e/'isolation-test-spec.json').read_bytes();assert len(spec)==9273 and sha(spec)=='3810eb7c108c8cc3e423450cb48ffda6f4913e74ed3f872d6b27e6de5ce3fbc6'
embedded=json.loads((e/'native-sha256-manifest.json').read_text());item=next(x for x in embedded['entries'] if x['path']=='w02/isolation-test-spec.json');assert item['bytes']==len(spec) and item['sha256']==sha(spec)
(p/'isolation-test-spec.json').write_bytes(spec)
# Exact preflight support DDL, extracted without redefining its columns.
spine='supabase/migrations/202605140001_c3_field_oar_spine_persistence.sql';b=git('show',base+':'+spine);s=b.decode();start=s.index('create table if not exists public.c3_oar_seeded_reference');ddl=s[start:s.index(';',start)+1]
fixture='scripts/fixtures/r01/bootstrap.sql';b2=git('show','1dfcbdd3fb6f6ec76c1f06dd60592da8f570e260:'+fixture);s2=b2.decode();start2=s2.index('create table public.measures_registry(');ddl2=s2[start2:s2.index(';',start2)+1]
(p/'preflight-support.sql').write_bytes((ddl+'\n'+ddl2).encode())
manifest.extend([{'path':spine,'commit':base,'sha256':sha(b),'selection':'exact c3_oar_seeded_reference CREATE TABLE statement','selected_sha256':sha(ddl.encode())},{'path':fixture,'commit':'1dfcbdd3fb6f6ec76c1f06dd60592da8f570e260','sha256':sha(b2),'selection':'exact measures_registry captured column-shape CREATE TABLE statement; no Registry data or completeness claimed','selected_sha256':sha(ddl2.encode())}])
(p/'provenance.json').write_text(json.dumps({'execution_instance':'c3field_concordance_lineage_w02_local_acceptance_20261024_001','package_type':'historically authorized RPC execution package, NOT migration ledger entry','historical_date':'UNVERIFIED','sources':manifest,'w02_spec':item},indent=2)+'\n');print('Pinned package, original authority/return, support DDL and native spec/manifest verified')
