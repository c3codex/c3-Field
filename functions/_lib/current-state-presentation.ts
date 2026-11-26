import type {PassageEnv} from "./c1-passage"
import type {EnvironmentSession} from "./env-session"

const backdropSource="current_state_backdrop_src_v1"
const backdropObject="c3-field-media/current-state-backdrop.webp"
const backdropSha="5031c3191d0e8ec0f5730c88a193d5f0e0c78bd592342ee003b2a919a338b87b"

export type CurrentStatePresentation={
  title:string
  tagline:string
  line:string
  backdropUrl:string
  fieldEntryLabel:string
  fieldEntry:string
  fieldNavigation:string[]
  workspaceOverlays:string[]
  inviteConnection:boolean
}

function row(value:unknown):Record<string,unknown>{
  return value!==null&&typeof value==="object"&&!Array.isArray(value)?value as Record<string,unknown>:{}
}

export async function resolveCurrentStatePresentation(
  session:EnvironmentSession,
  env:PassageEnv,
):Promise<CurrentStatePresentation|null>{
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) return null
  try {
    const origin=new URL(env.SUPABASE_URL)
    const token=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(session.token))
    const digest=Array.from(new Uint8Array(token),byte=>byte.toString(16).padStart(2,"0")).join("")
    const response=await fetch(new URL("/rest/v1/rpc/free_resolve_my_env_current_state_v1",origin),{
      method:"POST",redirect:"manual",signal:AbortSignal.timeout(4000),
      headers:{
        apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY,
        "content-type":"application/json",
      },
      body:JSON.stringify({p_session_sha256:digest}),
    })
    if(!response.ok) return null
    const resolved=row(await response.json())
    const design=row(resolved.projection)
    const backdrop=row(design.backdrop)
    if(resolved.standing!=="ACT"||resolved.envpac_key!==session.envpacKey||
       resolved.designpac_key!=="c1me_current_state_connect_app_experience_designpac_v1"||
       backdrop.src_key!==backdropSource||backdrop.sha256!==backdropSha||
       typeof design.title!=="string"||typeof design.tagline!=="string"||typeof design.line!=="string"||
       typeof design.field_entry_label!=="string"||design.field_entry!=="https://c3field.online/") return null
    const names=(value:unknown,allowed:string[])=>Array.isArray(value)?allowed.filter(name=>value.includes(name)):[]
    const project=origin.hostname.split(".")[0]
    if(backdrop.custody_uri!==`supabase://${project}/${backdropObject}`) return null
    return {
      title:design.title,tagline:design.tagline,line:design.line,
      backdropUrl:new URL("/storage/v1/object/public/"+backdropObject,origin).href,
      fieldEntryLabel:design.field_entry_label,fieldEntry:design.field_entry,
      fieldNavigation:names(design.field_navigation,["Connect","Contribute","Create"]),
      workspaceOverlays:names(design.workspace_overlays,["My PACs","My Stash","My Canopy","Connections"]).filter(name=>
        name!=="My Stash"||(Array.isArray(resolved.available_nugs)&&resolved.available_nugs.some(value=>{
          const descriptor=row(value)
          return descriptor.service==="My Stash"&&descriptor.effect_class==="none"&&
            typeof descriptor.nug_key==="string"&&descriptor.nug_key.length>0&&
            typeof descriptor.current_state_key==="string"&&descriptor.current_state_key.length>0
        }))),
      inviteConnection:Array.isArray(design.connections_actions)&&design.connections_actions.some(action=>row(action).capability==="invite_connection"),
    }
  } catch {
    return null
  }
}
