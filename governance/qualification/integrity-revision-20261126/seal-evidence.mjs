import {readFileSync,writeFileSync,readdirSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {execFileSync} from 'node:child_process'
import {fileURLToPath} from 'node:url'
import assert from 'node:assert/strict'
const root=new URL('./',import.meta.url),repo=new URL('../../../',root)
const blob=path=>execFileSync('git',['hash-object','--',fileURLToPath(new URL(path,root))],{encoding:'utf8'}).trim()
const review='32ac0425769e99e9541c2158d23929868cfc6e5a';assert.equal(blob('INTEGRITY-INDEPENDENT-REVIEW.md'),review)
const candidate=readFileSync(new URL('integrity-foundation.candidate.sql',root))
writeFileSync(new URL('effect-custody.json',root),JSON.stringify({review_repository:'c3codex/measures-of-inanna-governance',review_commit:'74f4b9dc3596ec36ad6ec2dfe686b5b898f89080',review_blob:review,implementation_base:'f0ddbd49eb0985a508307116f604152d866b416b',candidate_path:'integrity-foundation.candidate.sql',candidate_blob:blob('integrity-foundation.candidate.sql'),candidate_sha256:createHash('sha256').update(candidate).digest('hex'),independently_accepted:false,production_installed:false},null,2)+'\n')
const files=[]
function walk(dir,prefix=''){for(const f of readdirSync(dir,{withFileTypes:true})){if(f.isDirectory())walk(new URL(f.name+'/',dir),prefix+f.name+'/');else if(f.name!=='SHA256SUMS.json')files.push([prefix+f.name,new URL(f.name,dir)])}}
walk(root)
const changed=execFileSync('git',['diff','--name-only','f0ddbd49eb0985a508307116f604152d866b416b','--','functions','src','tsconfig.app.json','docs/governance/c3-tree-purpose.json'],{cwd:repo,encoding:'utf8'}).trim().split('\n').filter(Boolean)
for(const path of changed){const url=new URL(path,repo);writeFileSync(url,readFileSync(url,'utf8').replaceAll('\r\n','\n'));files.push(['../../../'+path,url])}
writeFileSync(new URL('SHA256SUMS.json',root),JSON.stringify(Object.fromEntries(files.sort(([a],[b])=>a.localeCompare(b)).map(([path,url])=>[path,createHash('sha256').update(readFileSync(url)).digest('hex')])),null,2)+'\n')
console.log('PASS exact independent review; revised effect blob/SHA-256 and source manifest sealed')
