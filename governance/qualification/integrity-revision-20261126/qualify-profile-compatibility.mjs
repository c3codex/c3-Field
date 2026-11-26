import {readFileSync,writeFileSync} from 'node:fs'
const here=new URL('./',import.meta.url),old=new URL('../native-lifecycle-20261126/',here)
let fixture=readFileSync(new URL('qualify-profile-session.mjs',old),'utf8')
const replace=(before,after)=>{if(!fixture.includes(before))throw Error('profile fixture preimage missing');fixture=fixture.replace(before,after)}
replace("from 'pg'",'from '+JSON.stringify(import.meta.resolve('pg')))
replace("const root=new URL('./',import.meta.url)",`const root=new URL(${JSON.stringify(old.href)})`)
replace("try{\n await c.query('drop schema public cascade;", "try{\n assert.equal((await c.query('show data_directory')).rows[0].data_directory.replaceAll('\\\\','/').toLowerCase(),'c:/c3-field-succession-test-20261125')\n await c.query('drop schema public cascade;")
replace("await c.query(readFileSync(new URL('profile-owner-session.candidate.sql',root),'utf8'))",`await c.query(readFileSync(new URL('profile-owner-session.candidate.sql',root),'utf8'))
 await c.query(readFileSync(new URL(${JSON.stringify(new URL('integrity-foundation.candidate.sql',here).href)}),'utf8'))`)
replace("new URL('profile-session-results.json',root)",`new URL('profile-compatibility-results.json',${JSON.stringify(here.href)})`)
replace('full SRC/NotChazz pipeline and all production triggers not installed or claimed','persistent effective-state CHECK and successor uniqueness installed; full SRC/NotChazz pipeline and all production triggers not claimed')
writeFileSync(new URL('profile-compatibility.executed-fixture.mjs',here),fixture)
await import(new URL('profile-compatibility.executed-fixture.mjs',here))
