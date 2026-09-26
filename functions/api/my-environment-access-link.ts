import {requestEnvironmentAccessLink,type PassageEnv} from "../_lib/c1-passage"

const headers={"content-type":"application/json; charset=utf-8","cache-control":"no-store","referrer-policy":"no-referrer"}

export const onRequestPost:PagesFunction<PassageEnv>=async({request,env})=>{
  if(!request.headers.get("content-type")?.toLowerCase().startsWith("application/json"))
    return new Response(JSON.stringify({standing:"invalid_request",message:"A JSON submission is required."}),{status:415,headers})
  const origin=request.headers.get("origin")
  if(origin && origin!==new URL(request.url).origin)
    return new Response(JSON.stringify({standing:"invalid_request",message:"The request could not be verified."}),{status:403,headers})
  let body:Record<string,unknown>
  try{
    body=await request.json() as Record<string,unknown>
  }catch{
    return new Response(JSON.stringify({standing:"invalid_request",message:"Enter the email address you used to Connect."}),{status:400,headers})
  }
  if(!body || typeof body!=="object" || Array.isArray(body) || Object.keys(body).some(key=>key!=="email"))
    return new Response(JSON.stringify({standing:"invalid_request",message:"Enter the email address you used to Connect."}),{status:400,headers})
  return requestEnvironmentAccessLink(body.email,env)
}

export const onRequest:PagesFunction=async()=>new Response(JSON.stringify({error:"method not allowed"}),{status:405,headers:{...headers,allow:"POST"}})
