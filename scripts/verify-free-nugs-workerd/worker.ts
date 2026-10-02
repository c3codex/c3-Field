import {createFreeNugServerRuntime,type NugRequest} from "../../functions/_lib/free-nugs"
const request:NugRequest={nug_key:"fixture",origin_env_key:"origin",env_key:"target",envpac_key:"pac",current_state_key:"current",executor_ref:"fixture_executor",execution_instance:"fixture_execution",capability_ref:"cap",authority_oar_key:"oar",context_binding_key:"context"}
export default {async fetch(){
  const prepared=await createFreeNugServerRuntime("https://fixture.invalid","fixture-not-a-credential").prepareEffect(request,"workerd-fixture")
  const redirected=await createFreeNugServerRuntime("https://redirect.invalid","fixture-not-a-credential").prepareEffect(request,"workerd-redirect")
  const pass=prepared.standing==="awaiting_effect_receipt"&&redirected.standing==="HLD"&&redirected.reason==="nug_registry_redirect_refused"
  return Response.json({pass,prepared,redirected,external_effects:0},{status:pass?200:500})
}}
