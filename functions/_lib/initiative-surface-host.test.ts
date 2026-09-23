import assert from "node:assert/strict"
import test from "node:test"
import {InitiativeSurfaceResolutionError,isInitiativeSurfaceHostname,normalizeInitiativeSurfaceHostname,selectInitiativeSurfaceBinding} from "./initiative-surface-host"

test("normalizes initiative hostnames",()=>{
  assert.equal(normalizeInitiativeSurfaceHostname(" MDM.C3FIELD.ONLINE. "),"mdm.c3field.online")
  assert.equal(isInitiativeSurfaceHostname("47pct.c3field.online"),true)
  assert.equal(isInitiativeSurfaceHostname("c3field.online"),false)
  assert.equal(isInitiativeSurfaceHostname("c3ops.c3field.online"),false)
})

test("selects exactly one active released canonical public binding",()=>{
  const row={process_key:"mdm",status:"active",process_status:"active",metadata:{active:true,canonical:true,binding_state:"active",release_state:"released",access_state:"public",system_key:"c3_field",env_key:"env_c3_community_connect"}}
  assert.equal(selectInitiativeSurfaceBinding([row]).row.process_key,"mdm")
})

test("refuses duplicate bindings",()=>{
  const row={status:"active",process_status:"active",metadata:{active:true,canonical:true,binding_state:"active",release_state:"released",access_state:"public",system_key:"c3_field",env_key:"env_c3_community_connect"}}
  assert.throws(()=>selectInitiativeSurfaceBinding([row,row]),(error:unknown)=>error instanceof InitiativeSurfaceResolutionError&&error.reasonCode==="initiative_surface_collision")
})

test("refuses held bindings",()=>{
  const row={status:"active",process_status:"active",metadata:{active:true,canonical:true,binding_state:"active",release_state:"held",access_state:"public",system_key:"c3_field",env_key:"env_c3_community_connect"}}
  assert.throws(()=>selectInitiativeSurfaceBinding([row]),(error:unknown)=>error instanceof InitiativeSurfaceResolutionError&&error.status===423)
})
