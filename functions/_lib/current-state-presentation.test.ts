import test from "node:test"
import assert from "node:assert/strict"
import {createHash} from "node:crypto"
import {resolveCurrentStatePresentation} from "./current-state-presentation"
import type {EnvironmentSession} from "./env-session"

const session:EnvironmentSession={
  token:"a".repeat(64),envKey:"owner-env",envpacKey:"owner-envpac",subjectType:"individual",
  subjectKey:"owner",expiresAt:"2026-12-01T00:00:00Z",
}
const env={SUPABASE_URL:"https://fixture.supabase.co",SUPABASE_SERVICE_ROLE_KEY:"fixture-key"}
const backdrop={
  src_key:"current_state_backdrop_src_v1",
  sha256:"5031c3191d0e8ec0f5730c88a193d5f0e0c78bd592342ee003b2a919a338b87b",
  custody_uri:"supabase://fixture/c3-field-media/current-state-backdrop.webp",
}
const fixture={
  standing:"ACT",envpac_key:session.envpacKey,designpac_key:"c1me_current_state_connect_app_experience_designpac_v1",
  projection:{
    title:"Current State",tagline:"A field of possibility",line:"Change what is possible.",
    field_entry_label:"Enter c3 Field",field_entry:"https://c3field.online/",
    field_navigation:["Connect","Contribute","Create","External"],
    workspace_overlays:["My Stash","Connections","Injected"],
    connections_actions:[{capability:"invite_connection"}],backdrop,
  },
}
test("owner presentation uses a session hash and exposes only recognized controls",async t=>{
  t.mock.method(globalThis,"fetch",async (url:URL,init:RequestInit)=>{
    assert.equal(url.pathname,"/rest/v1/rpc/free_resolve_my_env_current_state_v1")
    assert.deepEqual(JSON.parse(String(init.body)),{p_session_sha256:createHash("sha256").update(session.token).digest("hex")})
    return Response.json(fixture)
  })
  const design=await resolveCurrentStatePresentation(session,env)
  assert.ok(design)
  assert.deepEqual(design.workspaceOverlays,["My Stash","Connections"])
  assert.deepEqual(design.fieldNavigation,["Connect","Contribute","Create"])
  assert.equal(design.inviteConnection,true)
  assert.equal(design.backdropUrl,"https://fixture.supabase.co/storage/v1/object/public/c3-field-media/current-state-backdrop.webp")
})
test("refuses a hold, a different owner, unregistered media, and an unavailable RPC",async t=>{
  let response:Response
  t.mock.method(globalThis,"fetch",async()=>response)
  for(const result of [
    {...fixture,standing:"DNR"},
    {...fixture,envpac_key:"different-owner"},
    {...fixture,projection:{...fixture.projection,backdrop:{...backdrop,custody_uri:"supabase://other/c3-field-media/current-state-backdrop.webp"}}},
  ]){
    response=Response.json(result)
    assert.equal(await resolveCurrentStatePresentation(session,env),null)
  }
  response=new Response(null,{status:503})
  assert.equal(await resolveCurrentStatePresentation(session,env),null)
})
