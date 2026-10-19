import test from "node:test"
import assert from "node:assert/strict"
import {signedOwnerClaim,readOwnerClaim,myEnvironmentClaimUrl} from "../../functions/_lib/c1-passage"
const env={C1_VERIFICATION_SIGNING_KEY:"isolated-invite-signing-key-never-production"}
const now=Date.UTC(2026,9,19,12)
const owner={relationshipKey:"crs_"+"a".repeat(32),envKey:"env_person_"+"b".repeat(24),envpacKey:"c3envpac_person_"+"b".repeat(24)+"_v0_1"}
test("native signed entry resolves recipient-owned environment and fixed personal host",async()=>{
 const claim=await signedOwnerClaim(owner.relationshipKey,owner.envKey,owner.envpacKey,env,now)
 const read=await readOwnerClaim(claim,env,now)
 assert.equal(read.relationshipKey,owner.relationshipKey);assert.equal(read.envKey,owner.envKey)
 const url=new URL(myEnvironmentClaimUrl(claim));assert.equal(url.origin,"https://my.c3field.online")
 assert.equal(url.pathname,"/my-environment");assert.equal(url.search,"");assert.ok(url.hash.startsWith("#claim="))
})
test("share provenance alone cannot become an owner claim",async()=>{
 await assert.rejects(()=>readOwnerClaim("90c495d0-3588-4d2b-a5bc-bd919b10513b",env,now))
})
test("tampered expired or wrong-key proof cannot enter another owner's environment",async()=>{
 const claim=await signedOwnerClaim(owner.relationshipKey,owner.envKey,owner.envpacKey,env,now)
 await assert.rejects(()=>readOwnerClaim(claim,{C1_VERIFICATION_SIGNING_KEY:"different-isolated-key"},now))
 await assert.rejects(()=>readOwnerClaim(claim,env,now+9*3600000))
 const [payload,signature]=claim.split(".")
 const forged=btoa(JSON.stringify({...JSON.parse(atob(payload)),envKey:"env_person_"+"c".repeat(24)}))
 await assert.rejects(()=>readOwnerClaim(forged+"."+signature,env,now))
})
