// Local-only visual fixture. No Registry writes, native ACT receipt or release claim.
import {createServer} from 'node:http'
import {readFileSync} from 'node:fs'
import {renderFieldOfPossibility} from '../../../functions/_lib/field-of-possibility.ts'
const candidate=JSON.parse(readFileSync(new URL('./approved-landing-content.candidate.json',import.meta.url),'utf8'))
const landing=structuredClone(candidate.public_landing)
landing.design.registration_sha256='a'.repeat(64)
landing.seo.image={runtime_uri:'/api/free-media?asset=fixture_unavailable',sha256:'b'.repeat(64),width:1200,height:630}
const html=renderFieldOfPossibility({standing:'ACT',free_call_key:'c3_public_webpac_encounter',snapshot:{canonical_host:'c3field.online',canonical_path:'/',release_state:'public',authority_effect:'none',frontend_invention:false,public_landing:landing}})
if(!html)throw Error('source preview malformed')
const preview=html.replace('<body class="c3-public-landing">','<body class="c3-public-landing"><aside style="padding:1rem;background:#F2EFE6;color:#20251F">SOURCE PREVIEW — NOT REGISTERED OR RELEASED. Media and receiving qualification remain held.</aside>')
createServer((request,response)=>{response.writeHead(request.url==='/'?200:404,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});response.end(request.url==='/'?preview:'Local preview only')}).listen(4177,'127.0.0.1',()=>console.log('Source-only preview http://127.0.0.1:4177'))
