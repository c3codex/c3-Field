import assert from "node:assert/strict"
import test from "node:test"
import {invitationFromSearch,invitationConnectUrl,initialPublicEntryStage,afterPublicIntro} from "./publicEntryStage"
const via="90c495d0-3588-4d2b-a5bc-bd919b10513b"
test("known opaque reference is preserved through intro to C1, never a personal claim",()=>{
 const invite=invitationFromSearch("?via="+via);assert.equal(invite.kind,"valid")
 const target=new URL(invitationConnectUrl(invite.via!),"https://c3field.online")
 assert.equal(target.pathname,"/connect");assert.equal(target.searchParams.get("via"),via);assert.equal(target.hash,"")
 assert.equal(initialPublicEntryStage(target.pathname,undefined,true,target.searchParams.get("intro")==="complete"),"connect")
 assert.equal(afterPublicIntro(undefined,true),"connect")
})
for(const bad of ["?via=bad","?via=","?via="+via+"&via="+via,"?via="+encodeURIComponent("https://my.c3field.online/#claim=x")])
 test("malformed/colliding token stays invalid "+bad,()=>assert.equal(invitationFromSearch(bad).kind,"invalid"))
test("presentation marker alone cannot claim or resolve an environment",()=>{
 assert.equal(invitationFromSearch("?intro=complete").kind,"none")
 assert.equal(initialPublicEntryStage("/",undefined,false,true),"intro")
 assert.equal(initialPublicEntryStage("/connect",undefined,true,false),"intro")
 assert.equal(afterPublicIntro(undefined,false),"landing")
 for(const initiative of ["47pct","million_dollar_mission"])assert.equal(afterPublicIntro(initiative,true),"landing")
})
