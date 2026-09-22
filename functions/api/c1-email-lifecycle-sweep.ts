import {json,sendDueVerificationReminders,type PassageEnv} from "../_lib/c1-passage"

export const onRequestPost:PagesFunction<PassageEnv>=async({env})=>{
  try{
    const results=await sendDueVerificationReminders(env)
    return json({standing:"email_lifecycle_sweep_complete",processed:results.length,results})
  }catch{
    return json({standing:"email_lifecycle_sweep_unavailable"},503)
  }
}
export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
