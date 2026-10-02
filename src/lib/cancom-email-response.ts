export async function readCanComEmailResponse(response:Response,requestKey:string):Promise<Record<string,unknown>>{
  const body=await response.json().catch(()=>null)
  if(body&&typeof body==="object"&&!Array.isArray(body))return body
  // A missing API response cannot establish whether dispatch occurred.
  return {
    ok:false,standing:"HLD",disposition:"dispatch_unverified",
    reason_code:"cancom_api_response_unverified",
    request_identity:{request_key:requestKey,occurrence_key:"myenv-email-"+requestKey},
    provider_preflight:{standing:"unverified",dispatch_attempted:"unverified"},
    external_effects:"unverified",response_status:response.status,
    response_content_type:response.headers.get("content-type")||"unverified",
    message:"CanCom did not return a verified receipt. Keep this draft and check the email outcome before sending again."
  }
}
