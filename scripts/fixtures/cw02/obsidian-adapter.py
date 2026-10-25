"""Qualified test-only six-row semantic mapping. Original migration stays intact."""
import pathlib,subprocess,json,hashlib,re
p=pathlib.Path(__file__).parent;root=p.parents[2];base='729012c179d73682cac7e95c94c4d2607939dbe8';sha=lambda b:hashlib.sha256(b).hexdigest()
path='supabase/migrations/202606080002_obsidian_contract_seating.sql';original=subprocess.check_output(['git','-C',str(root),'show',base+':'+path]);text=original.decode()
assert sha(original)=='1eba9e21262f504037c0dc048bc31ca820a0b6fecfb85036af3424cef4ebf45b'
def split(s,delimiter=';'):
 out=[];start=0;i=0;quote=False;depth=0
 while i<len(s):
  if s[i]=="'":
   if quote and i+1<len(s) and s[i+1]=="'":i+=2;continue
   quote=not quote
  elif not quote:
   if s.startswith('--',i):
    j=s.find('\n',i);i=len(s) if j<0 else j;continue
   if s[i]=='(':depth+=1
   if s[i]==')':depth-=1
   if s[i]==delimiter and (delimiter==';' or depth==0):out.append(s[start:i+1] if delimiter==';' else s[start:i]);start=i+1
  i+=1
 if s[start:].strip():out.append(s[start:])
 return out
expected={'obsidian_src_capture_table_binding','obsidian_oar1_intake_table_binding','obsidian_eval_result_def_table_binding','obsidian_initial_email_def_binding','obsidian_followup_email_def_binding','obsidian_marble_carryover_table_binding'}
changes=[];out=[];snapshot=None;qualified=[];unmapped=[]
for statement in split(text):
 if 'insert into public.seeded_source_snapshot' in statement:
  source_path='docs/oar/measures_registry/oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md'
  source=subprocess.check_output(['git','-C',str(root),'show',base+':'+source_path]);assert len(source)>0
  (p/'origin/obsidian-source-oar2.meta.md').write_bytes(source)
  assert statement.count("'operator_verified'")==1 and statement.count("'operator_pending'")==1
  repaired=statement.replace("'operator_verified'","'"+sha(source)+"'").replace("'operator_pending'","'verified'")
  assert re.search(r"\n\s*0,\s*\n\s*'verified'",repaired)
  repaired=re.sub(r"(\n\s*)0,(\s*\n\s*'verified')",lambda m:m[1]+str(len(source))+','+m[2],repaired,count=1)
  snapshot={'standing':'VERIFIED_SYNTHETIC_REPLAY_ONLY','original_statement_sha256':sha(statement.encode()),'source_path':source_path,'source_commit':base,'source_sha256':sha(source),'source_bytes':len(source),'source_custody_ref':'github_file:c3codex/c3-Field@'+base+':'+source_path,'verification_time':'now() after actual source measurement; not historical verification date'}
  out.append(repaired);qualified.append(repaired);continue
 if not re.search(r'insert into public\.concordance_relation\s*\(',statement,re.I):out.append(statement);qualified.append(statement);continue
 match=re.search(r'insert into public\.concordance_relation\s*\((.*?)\)\s*values\s*',statement,re.S|re.I);assert match
 columns=[x.strip() for x in match[1].split(',')];start=match.end();tail=statement[start:];boundary=tail.lower().rindex('on conflict');values=tail[:boundary].strip();rows=split(values,',');repaired=[]
 for row in rows:
  r=row.strip().rstrip(',').strip();assert r[0]=='(' and r[-1]==')';tokens=split(r[1:-1],',');values2=[x.strip() for x in tokens];assert len(values2)==len(columns)
  fields=dict(zip(columns,values2));key=fields['relation_key'].strip("'")
  if fields['relation_scope']=="'obsidian'" and fields['relation_type']=="'source_alignment'":
   assert key in expected and fields['relation_type']=="'source_alignment'",key
   old=dict(fields);fields['relation_scope']="'system'";metadata=json.loads(fields['metadata'].removesuffix('::jsonb').strip().strip("'"));metadata['chamber']='obsidian';fields['metadata']="'"+json.dumps(metadata,ensure_ascii=False).replace("'","''")+"'::jsonb"
   assert all(fields[k]==old[k] for k in fields if k not in ['relation_scope','metadata'])
   changes.append({'relation_key':key,'old_scope':'obsidian','new_scope':'system','relation_type':'source_alignment','old_metadata':old['metadata'],'new_metadata':metadata,'unchanged_fields':{k:v for k,v in fields.items() if k not in ['relation_scope','metadata']}})
   repaired.append('(\n  '+',\n  '.join(fields[k] for k in columns)+'\n)')
   qualified.append('insert into public.concordance_relation('+','.join(columns)+') values ('+','.join(fields[k] for k in columns)+') on conflict(relation_key) do nothing;')
  else:
   repaired.append(r)
   if fields['relation_scope']=="'obsidian'":unmapped.append({'relation_key':key,'relation_type':fields['relation_type'],'scope':'obsidian','standing':'HLD_OUTSIDE_SIX_SOURCE_ALIGNMENT_MAPPING'})
 out.append(statement[:start]+',\n'.join(repaired)+'\n'+tail[boundary:])
assert {x['relation_key'] for x in changes}==expected and len(changes)==6 and snapshot
adapted='\n'.join(out);(p/'obsidian-adapted.sql').write_bytes(adapted.encode());(p/'obsidian-qualified-six.sql').write_bytes('\n'.join(qualified).encode())
(p/'obsidian-adapter-manifest.json').write_text(json.dumps({'authority_oar2_sha256':'11ed397b7d25fe013699b9af0364146605e2e39d78b6981fa02463c76cd6103b','original_commit':base,'original_path':path,'original_sha256':sha(original),'adapted_sha256':sha(adapted.encode()),'changes':changes,'snapshot':snapshot,'unmapped':unmapped,'qualified_slice':'Diagnostic six mapped relations plus their original document/version prerequisites and measured source snapshot; remaining rows are not represented as passed','original_source_unchanged':subprocess.check_output(['git','-C',str(root),'show','HEAD:'+path])==original},indent=2)+'\n');print('Six exact bindings mapped; synthetic snapshot source verified; unmapped rows held; original unchanged')
