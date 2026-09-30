import {json,sendDueVerificationReminders,sendPendingConnectionWelcomes,type PassageEnv} from "../_lib/c1-passage"

export const onRequestPost:PagesFunction<PassageEnv>=async({env})=>{
  try{
    const [verificationResults,welcomeResults]=await Promise.all([
      sendDueVerificationReminders(env),
      sendPendingConnectionWelcomes(env)
    ])
    return json({standing:"email_lifecycle_sweep_complete",processed:verificationResults.length+welcomeResults.length,verification_results:verificationResults,welcome_results:welcomeResults})
  }catch{
    return json({standing:"email_lifecycle_sweep_unavailable"},503)
  }
}
export const onRequest:PagesFunction=async()=>json({error:"method not allowed"},405)
