// Public, unauthenticated boundary checks; no recipient, session or dispatch.
async function main(){
  const results=[]
  for(const method of ['GET','POST']){
    const response=await fetch('https://my.c3field.online/api/my-environment-cancom-email',{
      method,headers:method==='POST'?{'content-type':'application/json'}:{},
      body:method==='POST'?JSON.stringify({action:'send'}):undefined,redirect:'manual'
    })
    const body=await response.json()
    results.push({method,status:response.status,body})
    if(response.status!==401||body.standing!=='environment_session_required'||body.external_effects!==0)throw new Error('Live session boundary or decision evidence mismatch')
  }
  const response=await fetch('https://my.c3field.online/')
  const html=await response.text()
  results.push({host:'my.c3field.online',status:response.status,entry_asset:html.match(/src="([^"]+\.js)"/)?.[1]})
  console.log(JSON.stringify(results,null,2))
}
main().catch(error=>{console.error(error.message);process.exitCode=1})
