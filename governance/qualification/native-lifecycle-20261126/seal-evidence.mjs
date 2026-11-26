import {readFileSync,writeFileSync,readdirSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {execFileSync} from 'node:child_process'
import assert from 'node:assert/strict'
import {fileURLToPath} from 'node:url'
const root=new URL('./',import.meta.url),repo=new URL('../../../',root)
const pins=[
 ['EXECUTION-PACKAGE.md','a09ea967e54fab247fa8e9cfa182b8b47b68c156','51f128a7780ee5b0acc57537b95e615d987d868f'],
 ['inputs/c3-model-govpac-candidate-v1.md','ead8171e01ba0c645dedc8b659c8995df86ae859','5c2cc715fe84b521334eee5d43e201e1e13cec92'],
 ['inputs/src-environmental-reading-govpac-candidate-v1.md','a67e13928e8f96a4b625c5ea597b0fe7225b5767','40f0516746fcb2b7596a38a129b5d6a6c9f003ff'],
 ['inputs/THIRTEEN-FUNCTION-RECONCILIATION.md','2726954be0c358460c8d8ef3289b60cc897b1dbb','aee0a73f4ee9b984efe793c2a75d4f221464f1c1'],
 ['inputs/NATIVE-LIFECYCLE.md','6952ba7c2ba4c986c9674ce634be5f5041820af7','8023e04d37867ea4ca4ea02bbebd0278b86439ac'],
 ['inputs/integrity-foundation.candidate.sql','3fa19aa1516be4cc80ccf64cd4a23620fb5eb689','d11939b6dba4c35d40cf30a13493b4c1ad8967e4'],
 ['inputs/registrar-source-succession-manifest-20261126.md','d54f065bda9104fbfe0af1c1f50ead462f12d272','b60fb4d74b8161441c3a10f98f5b54f2ba24a3fa']
]
const sources=pins.map(([path,commit,blob])=>{
 const observed=execFileSync('git',['hash-object','--',fileURLToPath(new URL(path,root))],{encoding:'utf8'}).trim()
 assert.equal(observed,blob,path);return {path,repository:'c3codex/measures-of-inanna-governance',commit,blob,exact_readback:'PASS'}
})
const native=JSON.parse(readFileSync(new URL('native-functions.json',root)))
const text=readFileSync(new URL('inputs/THIRTEEN-FUNCTION-RECONCILIATION.md',root),'utf8')
const fingerprints=[...text.matchAll(/^\| (\w+) \| ([a-f0-9]{32}) \|/gm)].map(([,name,md5])=>{
 const row=native.find(x=>x.proname===name);assert.equal(row?.body_md5,md5,name)
 return {name,pg_get_functiondef_md5:md5,readback:'PASS',candidate_changed:name==='free_resolve_my_env_current_state_v1'}
})
assert.equal(fingerprints.length,13)
writeFileSync(new URL('custody-index.json',root),JSON.stringify({implementation_base:'4d681ef387215a4867c6acc7427c41128b44391c',sources,fingerprints,admission_created:false},null,2)+'\n')
const files=[]
function walk(dir,prefix=''){for(const entry of readdirSync(dir,{withFileTypes:true})){const name=prefix+entry.name;if(entry.isDirectory())walk(new URL(entry.name+'/',dir),name+'/');else if(name!=='SHA256SUMS.json')files.push([name,new URL(entry.name,dir)])}}
walk(root)
for(const path of ['functions/_lib/current-state-presentation.ts','functions/_lib/current-state-presentation.test.ts','functions/api/my-environment-profile.ts','functions/api/my-environment-profile.test.ts'])files.push(['../../../'+path,new URL(path,repo)])
writeFileSync(new URL('SHA256SUMS.json',root),JSON.stringify(Object.fromEntries(files.sort(([a],[b])=>a.localeCompare(b)).map(([path,url])=>[path,createHash('sha256').update(readFileSync(url)).digest('hex')])),null,2)+'\n')
console.log('PASS 7 exact source blobs; 13 native drift fingerprints; SHA-256 manifest sealed')
