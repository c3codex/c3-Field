// Temporary diagnostic for send.card 012. Never accepts request bodies or credentials.
export function createCaptureDiagnostic() {
  const correlation_id = crypto.randomUUID()
  function emit(branch: string, rpc_http_status: number | null = null, postgres_code: string | null = null, error_class: string | null = null) {
    console.log(JSON.stringify({marker:"c1_diagnostic_012",correlation_id,timestamp:new Date().toISOString(),route:"/api/c3-community-connect-capture",env_key:"env_c3_community_connect",encounter_key:"c3_community_connect",branch,rpc_http_status,postgres_code,error_class,message:error_class}))
  }
  return {correlation_id,emit,async rpcFailure(name: string, response: Response) {
    let code: string | null = null, kind = "backend_error_message_withheld"
    try {
      const reader=response.body?.getReader();let text="",size=0
      if(reader) {for (;;) {const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>4096){await reader.cancel();break}text+=new TextDecoder().decode(value)} }
      const b=JSON.parse(text)
      if(typeof b.code==="string" && /^(?:[0-9A-Z]{5}|PGRST[0-9]{3})$/.test(b.code))code=b.code
      const known=["Invalid API key","invalid_primary_email","relationship_reuse_not_eligible","canonical_active_environment_not_found","registered_c1_connect_encounter_not_found"]
      if(known.includes(b.message))kind=b.message
      else if(typeof b.message==="string" && b.message.startsWith("permission denied"))kind="permission_denied"
    } catch {kind="backend_error_unreadable"}
    emit(name+"_http_failure",response.status,code,kind)
  }}
}
export type CaptureDiagnostic = ReturnType<typeof createCaptureDiagnostic>
