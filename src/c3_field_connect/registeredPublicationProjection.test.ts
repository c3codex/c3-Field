import assert from "node:assert/strict"
import test from "node:test"

import {
  UND_FIELD_PROJECTION_HOST,
  isRegisteredPublicationProjectionHost,
  resolveRegisteredUndriftedProjection,
} from "./registeredPublicationProjection"

const valid={
  status:"available",
  presentation:{
    release_state:"public",
    canonical_host:UND_FIELD_PROJECTION_HOST,
    canonical_path:"/",
    projection_type:"registered_publication_projection",
    publication_key:"undrifted",
    authority_effect:"none",
    renderer_identity:"c2me.publication_encounter",
    source_pubpac_key:"undrifted_issue003_pubpac_current_package",
    frontend_invention:false,
    native_publication_route:"/undrifted",
    presentation_manifest_key:"undrifted_measuresregistry_magazine_manifest_v1",
    native_publication_environment:"env_undrifted_publication",
  },
}

test("recognizes only the registered unDrifted Field projection host",()=>{
  assert.equal(isRegisteredPublicationProjectionHost("undrifted.measuresregistry.com"),true)
  assert.equal(isRegisteredPublicationProjectionHost("measuresregistry.com"),false)
  assert.equal(isRegisteredPublicationProjectionHost("other.measuresregistry.com"),false)
})

test("accepts the exact registered publication projection envelope",()=>{
  const projection=resolveRegisteredUndriftedProjection(valid,UND_FIELD_PROJECTION_HOST)
  assert.equal(projection?.publication_key,"undrifted")
  assert.equal(projection?.frontend_invention,false)
})

test("holds projection data for the wrong host or invented frontend authority",()=>{
  assert.equal(resolveRegisteredUndriftedProjection(valid,"other.measuresregistry.com"),null)
  assert.equal(resolveRegisteredUndriftedProjection({
    ...valid,
    presentation:{...valid.presentation,frontend_invention:true},
  },UND_FIELD_PROJECTION_HOST),null)
})
