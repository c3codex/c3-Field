import assert from "node:assert/strict"
import test from "node:test"
import {initialPublicEntryStage as stage} from "./publicEntryStage"
test("MDM cold and returning root both enter dedicated intro/landing stage",()=>{for(let i=0;i<2;i++)assert.equal(stage("/","million_dollar_mission",false),"landing")})
test("MDM referred root does not introduce the unrelated shared film",()=>{assert.equal(stage("/","million_dollar_mission",true),"landing")})
test("deliberate MDM connect entry with or without referral bypasses public film",()=>{for(const via of [false,true]){assert.equal(stage("/connect","million_dollar_mission",via),"connect");assert.equal(stage("/connect/","million_dollar_mission",via),"connect")}})
test("47pct share and generic public intro semantics are preserved",()=>{assert.equal(stage("/","47pct",true),"landing");assert.equal(stage("/",undefined,true),"intro");assert.equal(stage("/",undefined,false),"intro");assert.equal(stage("/connect",undefined,false),"connect")})
test("trailing-route normalization stays confined to the authorized MDM entry",()=>{assert.equal(stage("/connect/","47pct",false),"landing");assert.equal(stage("/connect/",undefined,false),"intro")})
