import assert from "node:assert/strict"
import test from "node:test"

import {
  REGISTERED_C3_NATIVE_INITIATIVE_PROJECTION,
  resolveRegisteredInitiativeProjection,
} from "./registeredInitiativeProjection"

const valid={
  status:"available",
  presentation:{
    projection_type:REGISTERED_C3_NATIVE_INITIATIVE_PROJECTION,
    initiative_key:"million_dollar_mission",
    initiative_process_key:"million_dollar_mission_c2me_initiative_v1",
    surface_key:"mdm_c1me_surface",
    webpac_key:"mdm_projection_v1",
    canonical_host:"mdm.c3field.online",
    canonical_path:"/",
    canonical_environment:"env_c3_community_connect",
    canonical_url:"https://mdm.c3field.online/",
    route:"/",
    connect_route:"/connect",
    release_state:"public",
    authority_effect:"none",
    frontend_invention:false,
    creates_standing:false,
  }
}

test("accepts an exact registered c3-native initiative projection",()=>{
  const surface=resolveRegisteredInitiativeProjection(valid,"mdm.c3field.online")
  assert.equal(surface?.initiativeKey,"million_dollar_mission")
  assert.equal(surface?.canonicalEnvironment,"env_c3_community_connect")
  assert.equal(surface?.createsStanding,false)
})

test("rejects host, environment, or authority drift",()=>{
  assert.equal(resolveRegisteredInitiativeProjection(valid,"other.c3field.online"),null)
  assert.equal(resolveRegisteredInitiativeProjection({
    ...valid,presentation:{...valid.presentation,canonical_environment:"env_c3_community_contribute"}
  },"mdm.c3field.online"),null)
  assert.equal(resolveRegisteredInitiativeProjection({
    ...valid,presentation:{...valid.presentation,frontend_invention:true}
  },"mdm.c3field.online"),null)
  assert.equal(resolveRegisteredInitiativeProjection({
    ...valid,presentation:{...valid.presentation,creates_standing:true}
  },"mdm.c3field.online"),null)
})

test("does not coerce a non-initiative registered PAC snapshot",()=>{
  assert.equal(resolveRegisteredInitiativeProjection({
    status:"available",
    presentation:{
      ...valid.presentation,
      projection_type:"registered_owner_custodied_pac_projection"
    }
  },"mdm.c3field.online"),null)
})
