import pathlib,json
p=pathlib.Path(__file__).parent;tables=json.loads((p/'catalog-source/connections-gate-tables.json').read_text());q=lambda s:'"'+s.replace('"','""')+'"';out=[];omitted=[]
parents={'crs_relationship','system_process_registry','measures_registry'}|{x['relname'] for x in tables}
for t in tables:out.append('create table public.'+q(t['relname'])+'('+','.join(q(x['column'])+' '+x['type']+(' default '+x['default'] if x['default'] else '')+(' not null' if x['notnull'] else '') for x in t['columns'])+');')
for t in tables:
 for c in t['constraints'] or []:
  if c['type'] in ('c','p','u') or (c['type']=='f' and c['parent'].removeprefix('public.') in parents):out.append('alter table public.'+q(t['relname'])+' add constraint '+q(c['name'])+' '+c['definition']+';')
  else:omitted.append(c)
 out.append('alter table public.'+q(t['relname'])+' enable row level security;grant select,insert,update,delete on public.'+q(t['relname'])+' to service_role;')
(p/'connections-gate-bootstrap.sql').write_bytes('\n'.join(out).encode());(p/'connections-gate-fixture-omissions.json').write_text(json.dumps({'basis':'Captured current metadata only; no production row data copied. Synthetic service-role fixtures, no claim of complete trigger or MGS runtime clone','omitted_constraints':omitted,'qualified_source_checks':['supabase/migrations/20260917062800_register_c1me_mgs_and_create_current_binding_v0_1.sql','supabase/migrations/20260917064200_persist_c1me_mgs_evaluation_v0_1.sql'],'production_evidence_read':False},indent=2)+'\n')
