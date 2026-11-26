import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {execFileSync} from 'node:child_process'
import {fileURLToPath} from 'node:url'
import {relative} from 'node:path'
import assert from 'node:assert/strict'
const here=new URL('./',import.meta.url),repo=new URL('../../../',here)
const manifest=JSON.parse(readFileSync(new URL('SHA256SUMS.json',here)))
for(const [path,expected] of Object.entries(manifest)){
 const relativePath=relative(fileURLToPath(repo),fileURLToPath(new URL(path,here))).replaceAll('\\','/')
 const bytes=execFileSync('git',['show',':'+relativePath],{cwd:repo,maxBuffer:8*1024*1024})
 assert.equal(createHash('sha256').update(bytes).digest('hex'),expected,path)
}
console.log('PASS '+Object.keys(manifest).length+' staged artifact SHA-256 values match exact Git bytes')
