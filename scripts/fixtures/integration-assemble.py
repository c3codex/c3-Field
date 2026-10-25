"""Compose exact captured synthetic bootstraps; never production migration history."""
import pathlib,re,json,hashlib
p=pathlib.Path(__file__).parent
def split(s):
 out=[];start=0;i=0;quote=None
 while i<len(s):
  if quote:
   if s.startswith(quote,i):
    if quote=="'" and s.startswith("''",i):i+=2;continue
    i+=len(quote);quote=None;continue
   i+=1;continue
  if s.startswith('--',i):
   j=s.find('\n',i);i=len(s) if j<0 else j+1;continue
  if s[i]=="'":quote="'";i+=1;continue
  if s[i]=='$':
   m=re.match(r'\$[A-Za-z_0-9]*\$',s[i:])
   if m:quote=m[0];i+=len(quote);continue
  if s[i]==';':out.append(s[start:i+1]);start=i+1
  i+=1
 if s[start:].strip():out.append(s[start:])
 return out
a=(p/'r02/bootstrap.sql').read_bytes().decode();b=(p/'r01/bootstrap.sql').read_bytes().decode()
def clean(s):return re.sub(r'--[^\n]*','',s).strip()
seen={};out=[];skips=[]
for origin,src in [('r02',a),('r01',b)]:
 for raw in split(src):
  q=clean(raw);m=re.match(r'create (?:table|schema|role|extension) (?:public\.)?([\w]+)',q,re.I)
  if not m:m=re.match(r'alter table (?:public\.)?(\w+) add constraint "?(\w+)"?',q,re.I)
  key=(m[0].lower().split()[0:2],m.groups()) if m else None
  key=str(key) if key else None
  if key and key in seen:
   skips.append({'object':key,'prior':seen[key][0],'omitted':origin,'identical':clean(seen[key][1])==q,'sha256':hashlib.sha256(raw.encode()).hexdigest()});continue
  if key:seen[key]=(origin,raw)
  out.append(raw)
(p/'integration').mkdir(exist_ok=True)
# Prior R02 harness omitted the preexisting Optics view. Recover its exact
# captured rollback definition and ACL before measuring whole-catalog rollback.
rollback=(p/'r02/rollback.sql').read_bytes().decode()
view_start=rollback.index('create view public.c3ops_oar_lifecycle_optics_resolution_v1')
view_end=rollback.index('grant select on public.c3ops_oar_lifecycle_optics_resolution_v1 to service_role;')+len('grant select on public.c3ops_oar_lifecycle_optics_resolution_v1 to service_role;')
out.append(rollback[view_start:view_end])
out.append('revoke all on function public.register_cancom_oar_delivery_v1(jsonb,jsonb,text),public.register_cancom_oar_return_v1(text,text,text,text,text,text,jsonb),public.resolve_cancom_oar_pickup_v1(text,text,text) from public,anon,authenticated; grant execute on function public.register_cancom_oar_delivery_v1(jsonb,jsonb,text),public.register_cancom_oar_return_v1(text,text,text,text,text,text,jsonb),public.resolve_cancom_oar_pickup_v1(text,text,text) to service_role;')
(p/'integration/bootstrap.sql').write_bytes(('\n'.join(out)).encode())
(p/'integration/composition.json').write_text(json.dumps({'basis':'R02 bootstrap then nonduplicate R01 definitions; synthetic fixtures only','skipped':skips},indent=2))
print(json.dumps({'statements':len(out),'duplicate_definitions':len(skips),'different_definitions':[x for x in skips if not x['identical']]},indent=2))

