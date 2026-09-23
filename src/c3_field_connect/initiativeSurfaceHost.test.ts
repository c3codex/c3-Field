import assert from "node:assert/strict"
import test from "node:test"
import {isC3FieldInitiativeHostCandidate,isC3FieldParentHost,isC3FieldPersonalEnvironmentHost,isInitiativeSurfacePathAllowed,normalizeC3Hostname} from "./initiativeSurfaceHost"

test("classifies c3 Field hosts without treating ops as an initiative surface",()=>{
  assert.equal(normalizeC3Hostname("MDM.C3FIELD.ONLINE."),"mdm.c3field.online")
  assert.equal(isC3FieldParentHost("www.c3field.online"),true)
  assert.equal(isC3FieldInitiativeHostCandidate("mdm.c3field.online"),true)
  assert.equal(isC3FieldInitiativeHostCandidate("47pct.c3field.online"),true)
  assert.equal(isC3FieldPersonalEnvironmentHost("MY.C3FIELD.ONLINE."),true)
  assert.equal(isC3FieldInitiativeHostCandidate("my.c3field.online"),false)
  assert.equal(isC3FieldInitiativeHostCandidate("c3ops.c3field.online"),false)
  assert.equal(isC3FieldInitiativeHostCandidate("measuresregistry.com"),false)
})

test("initiative surface doors only admit root and Connect",()=>{
  assert.equal(isInitiativeSurfacePathAllowed("/"),true)
  assert.equal(isInitiativeSurfacePathAllowed("/connect/"),true)
  assert.equal(isInitiativeSurfacePathAllowed("/my-environment"),false)
  assert.equal(isInitiativeSurfacePathAllowed("/c2"),false)
  assert.equal(isInitiativeSurfacePathAllowed("/c3ops"),false)
})
