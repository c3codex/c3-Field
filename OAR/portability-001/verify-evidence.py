import json,re,hashlib,difflib
from pathlib import Path
p=Path(__file__).parent
def rows(name):
 r=json.loads((p/(name+'.json')).read_text())
 t=json.loads(r['content'][0]['text'])['result']
 return json.loads(re.search(r'\n<untrusted-data-[^>]+>\n(.*?)\n</untrusted-data-',t,re.S)[1])
x=rows('installed')[0]['definition']
(p/'installed.sql').write_text(x,encoding='utf-8',newline='\n')
b=(p/'baseline.sql').read_text()
body=lambda s: re.sub(r'\s+','',re.split(r'\$(?:function)?\$',s)[1])
assert body(x)==body(b),'installed body drift'
assert rows('pickup')[0]['pickup']['sha256']==hashlib.sha256((p/'OAR2.md').read_bytes()).hexdigest()
(p/'candidate.patch').write_text(''.join(difflib.unified_diff(b.splitlines(True),(p/'candidate.sql').read_text().splitlines(True),fromfile='baseline.sql',tofile='candidate.sql')),encoding='utf-8',newline='\n')
print('PASS installed resolver body matches baseline; exact OAR2 bytes match Registry')
