import assert from "node:assert/strict"
import test from "node:test"
import {startIntroPlayback} from "./introPlayback"
import {navigationAtPaths} from "./registeredNavigation"

function fixture(play:()=>Promise<void> = ()=>Promise.resolve()) {
  let tick=()=>{}, cleared=false, advances=0
  const video={play,currentTime:0,ended:false}
  const stop=startIntroPlayback(video,()=>advances++,{setInterval:callback=>{tick=callback;return 1},clearInterval:()=>{cleared=true}})
  return {video,tick:()=>tick(),stop,advances:()=>advances,cleared:()=>cleared}
}
test("blocked autoplay exposes the existing destination",async()=>{
  const f=fixture(()=>Promise.reject(new Error("NotAllowedError")))
  await Promise.resolve()
  assert.equal(f.advances(),1)
  f.stop()
})
test("playback stall fails forward while active progress does not",()=>{
  const f=fixture()
  for(let i=1;i<=10;i++){f.video.currentTime=i;f.tick()}
  assert.equal(f.advances(),0)
  f.tick();f.tick();assert.equal(f.advances(),0)
  f.tick();assert.equal(f.advances(),1)
  f.stop();assert.equal(f.cleared(),true)
})
test("end and cleanup preserve local-only advancement",async()=>{
  const f=fixture();f.video.ended=true;f.tick();assert.equal(f.advances(),1);f.stop();f.tick();assert.equal(f.advances(),1)
  const rejected=fixture(()=>Promise.reject(new Error("late")));rejected.stop();await Promise.resolve();assert.equal(rejected.advances(),0)
})
test("projected absolute navigation retains the registered href and label",()=>{
  const relative={route:"/community-potential",label:"Community Potential"}
  const absolute={route:"https://c3field.online/community-potential",label:"Community Potential"}
  const rows=navigationAtPaths([relative,absolute,{route:"/",label:"Home"}],["/community-potential"])
  assert.deepEqual(rows,[relative,absolute]);assert.equal(rows[1],absolute)
})
