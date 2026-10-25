import pathlib,json,hashlib,re
p=pathlib.Path(__file__).parent;e=p/'catalog-source';q=lambda x:'"'+x.replace('"','""')+'"'
tables=json.loads((e/'live-w02-tables-full.json').read_text());present={x['relname'] for x in tables}|{'c3_environment','c3_envpac'};sql=[];omissions=[]
base=(p.parent/'integration/bootstrap.sql').read_bytes().decode()
existing=set(re.findall(r'alter table public\."?(\w+)"? add constraint "?(\w+)"?',base,re.I))
for x in tables:
 cols=','.join(q(c['column'])+' '+c['type']+(' default '+c['default'] if c['default'] else '')+(' not null' if c['notnull'] else '') for c in x['columns'])
 if x['relname']!='c3_pac':sql.append('create table public.'+q(x['relname'])+'('+cols+');')
for x in tables:
 for c in x['constraints'] or []:
  if c['type'] in ('c','p','u','x') and (x['relname'],c['name']) not in existing:sql.append('alter table public.'+q(x['relname'])+' add constraint '+q(c['name'])+' '+c['definition']+';')
for x in tables:
 for c in x['constraints'] or []:
  if c['type']=='f':
   if (x['relname'],c['name']) in existing:continue
   if c['parent'].removeprefix('public.') in present:sql.append('alter table public.'+q(x['relname'])+' add constraint '+q(c['name'])+' '+c['definition']+';')
   else:omissions.append({'table':x['relname'],'constraint':c,'standing':'HLD_EXTERNAL_PARENT_OMITTED'})
 if x['relrowsecurity']:sql.append('alter table public.'+q(x['relname'])+' enable row level security;')
 if x['relforcerowsecurity']:sql.append('alter table public.'+q(x['relname'])+' force row level security;')
 # Exact captured ACL role set; all captured entries use all table privileges.
 acl=x['relacl'] or ''
 for role in ['anon','authenticated','service_role']:
  m=re.search(r'(?:\{|,)'+role+r'=([^/]+)/',acl)
  if m:
   perms={'a':'INSERT','r':'SELECT','w':'UPDATE','d':'DELETE','D':'TRUNCATE','x':'REFERENCES','t':'TRIGGER','m':'MAINTAIN'}
   sql.append('grant '+','.join(perms[k] for k in m[1] if k in perms)+' on public.'+q(x['relname'])+' to '+role+';')
idxtrig=json.loads((e/'live-w02-indexes-triggers.json').read_text())
existing_indexes={c['name'] for x in tables for c in x['constraints'] or [] if c['type'] in ('p','u','x')}|set(re.findall(r'create (?:unique )?index (?:if not exists )?(\w+)',base,re.I))
for item in idxtrig:
 if item['kind']=='index' and item['object']['indexname'] not in existing_indexes:sql.append(item['object']['indexdef']+';')
 if item['kind']=='trigger':omissions.append({'table':item['object']['table'],'trigger':item['object']['name'],'standing':'HLD_ANCILLARY_TRIGGER_NOT_INSTALLED','definition':item['object']['definition'],'function_sha256':hashlib.sha256(item['object']['function_definition'].encode()).hexdigest()})
policies=json.loads((e/'live-w02-policies.json').read_text());assert not policies,'Review nonempty captured policies before composing source'
fs=[]
for file in ['live-w02-payload.json','live-w02-functions.json','live-pac-functions.json']:fs+=json.loads((e/file).read_text())
order=['c3_pac_public_payload_v1','c3_pac_review_payload_v1','c3_pac_review_sha256_v1','c3_pac_review_candidate_v1','c3_pac_set_personal_review_v1','c3_pac_set_personal_disposition_v1','c3_pac_set_personal_encounter_projection_v1','resolve_c1me_current_internal','resolve_c1me_envpac_primitives_internal','resolve_cancom_connection_devices_internal']
for name in order:
 for f in fs:
  if not f['signature'].startswith(name+'('):continue
  if name=='c3_pac_set_personal_encounter_projection_v1' and f['signature'].count(',')!=4:continue
  sql.append(f['definition']+';');sql.append('revoke all on function public.'+f['signature']+' from public,anon,authenticated,service_role;')
  acl=f['proacl']
  if acl is None:sql.append('grant execute on function public.'+f['signature']+' to public;')
  else:
   for role in ['anon','authenticated','service_role']:
    if role+'=X/' in acl:sql.append('grant execute on function public.'+f['signature']+' to '+role+';')
   if re.search(r'(?:\{|,)=X/',acl):sql.append('grant execute on function public.'+f['signature']+' to public;')
(p/'w02-bootstrap.sql').write_bytes('\n'.join(sql).encode());(p/'w02-schema-metadata.json').write_text(json.dumps(tables,indent=2)+'\n');(p/'w02-fixture-omissions.json').write_text(json.dumps({'tables':len(tables),'policy_count':len(policies),'omitted_foreign_keys':omissions,'ancillary_triggers':'not copied; exact runtime source functions and included constraints only','captured_function_sources':[{'signature':f['signature'],'sha256':hashlib.sha256(f['definition'].encode()).hexdigest()} for f in fs]},indent=2)+'\n');print('Captured shapes and exact runtime functions composed; omitted external parents explicitly indexed')
