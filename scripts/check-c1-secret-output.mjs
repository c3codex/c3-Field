import {readFile,readdir} from "node:fs/promises"
import path from "node:path"
const vars=await readFile(process.argv[2],"utf8")
const names=["SUPABASE_SERVICE_ROLE_KEY","RESEND_API_KEY","C1_VERIFICATION_SIGNING_KEY"]
const secrets=names.map(name=>{
 const line=vars.split(/\r?\n/).find(line=>line.trimStart().startsWith(name+"="))
 if(!line)return {name,value:""}
 const value=line.slice(line.indexOf("=")+1).trim().replace(/^["']|["']$/g,"")
 return {name,value}
})
let checked=0,leak=false
async function scan(folder){
 for(const entry of await readdir(folder,{withFileTypes:true})){
  const file=path.join(folder,entry.name)
  if(entry.isDirectory()){if(![".git","node_modules"].includes(entry.name))await scan(file)}
  else if(/\.(ts|tsx|js|mjs|json|txt|md|sql|html|css)$/.test(entry.name)){
   const content=await readFile(file,"utf8");checked++
   if(secrets.some(secret=>secret.value.length>=16 && content.includes(secret.value)))leak=true
  }
 }
}
for(const folder of process.argv.slice(3))await scan(folder)
console.log(JSON.stringify({secrets:secrets.map(({name,value})=>({name,present:!!value,raw_value:"redacted"})),files_checked:checked,raw_secret_found:leak}))
if(leak)process.exitCode=1
