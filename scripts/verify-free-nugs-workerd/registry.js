// Local synthetic outbound service: never connects to Registry or a provider.
export default {async fetch(request){
  const url=new URL(request.url)
  if(url.hostname==='redirect.invalid')return new Response(null,{status:302,headers:{location:'https://never-follow.invalid/'}})
  if(url.hostname!=='fixture.invalid'||url.pathname!=='/rest/v1/rpc/prepare_c3ops_nug_effect_v1')throw new Error('Unexpected outbound fixture request')
  const body=await request.json()
  return Response.json({standing:'awaiting_effect_receipt',occurrence_key:body.p_occurrence_key,provider_called:false,external_effects:0})
}}
