import type {EnvironmentSession} from "./env-session"
import type {NugRequest} from "./free-nugs"

type Row=Record<string,unknown>
export const MY_STASH_NUG_KEY="my_stash_op044_v1"
const fields=["origin_env_key","env_key","envpac_key","current_state_key","executor_ref",
  "execution_instance","capability_ref","authority_oar_key","context_binding_key"] as const

// Session ownership is observed by the existing environment-session resolver.
// Registry NUG preflight still independently resolves capability and OAR authority.
export function myStashRequest(binding:Row,session:Pick<EnvironmentSession,"envKey"|"envpacKey"|"subjectKey">,
  participantInput:Row):NugRequest {
  const spec=binding.spec as Row|undefined
  const input=spec?.native_input as Row|undefined
  if(binding.nug_key!==MY_STASH_NUG_KEY||binding.standing!=="active"||!spec||
    spec.native_process_key!=="c3ops_nug_my_stash_v1"||
    spec.native_function_ref!=="public.resolve_c3ops_my_stash_v1(jsonb)"||
    spec.adapter_class!=="direct_native"||spec.effect_class!=="none"||
    spec.env_key!==session.envKey||spec.envpac_key!==session.envpacKey||
    input?.env_key!==session.envKey||input.envpac_key!==session.envpacKey||
    input.owner_subject_key!==session.subjectKey||input.current_state_key!==spec.current_state_key||
    input.default_visibility!=="private"||input.event_contract!=="my_stash_private_reference_v1")
    throw new Error("my_stash_session_binding_mismatch")
  const actions:Record<string,string[]>={
    retain:["action","asset_key","label","folder","tags"],list:["action"],
    retrieve:["action","reference_key"],organize:["action","reference_key","label","folder","tags"],
    remove:["action","reference_key"],surface_intent:["action","reference_key","target_surface"],
  }
  const action=participantInput.action
  if(typeof action!=="string"||!Object.hasOwn(actions,action)||
    Object.keys(participantInput).some(key=>!actions[action].includes(key)))
    throw new Error("my_stash_participant_request_boundary")
  const out:Row={nug_key:MY_STASH_NUG_KEY,participant_input:participantInput}
  for(const field of fields){
    if(typeof spec[field]!=="string"||!spec[field].trim())throw new Error("my_stash_authority_incomplete")
    out[field]=spec[field]
  }
  return out as NugRequest
}
