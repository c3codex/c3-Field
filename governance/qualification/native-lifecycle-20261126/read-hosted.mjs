import {writeFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
const rows=[]
for(const url of ['https://c3field.online/','https://c3field.online/api/c3-public-presentation','https://my.c3field.online/']){
 try{
  const response=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(15000)})
  const bytes=Buffer.from(await response.arrayBuffer())
  rows.push({url,status:response.status,content_type:response.headers.get('content-type'),location:response.headers.get('location'),sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length})
 }catch(e){rows.push({url,error:e.message})}
}
writeFileSync(new URL('hosted-readback.json',import.meta.url),JSON.stringify({observed_at:new Date().toISOString(),scope:'anonymous GET only; not authenticated enrollment, visual acceptance or candidate deployment',rows},null,2)+'\n')
console.log(JSON.stringify(rows,null,2))
