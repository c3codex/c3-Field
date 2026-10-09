import assert from "node:assert/strict"
import test from "node:test"
import {startAuthoredIntro, showApprovedCaptions} from "./authoredIntroPlayback"
function fixture(playResult:()=>Promise<void>=()=>Promise.resolve()) {
  const listeners=new Map<string,Set<()=>void>>(), states:string[]=[], failures:string[]=[]
  let completed=0, plays=0, tick=()=>{}, cleared=false
  const video={muted:true,volume:0,currentTime:0,ended:false,paused:false,
    play:()=>{plays++;return playResult()},pause:()=>{video.paused=true},load:()=>{},
    addEventListener:(name:string,fn:()=>void)=>{if(!listeners.has(name))listeners.set(name,new Set());listeners.get(name)!.add(fn)},
    removeEventListener:(name:string,fn:()=>void)=>listeners.get(name)?.delete(fn)}
  const clock={setInterval:(fn:()=>void)=>{tick=fn;return 1},clearInterval:()=>{cleared=true}}
  const start=()=>startAuthoredIntro(video as unknown as HTMLVideoElement,{state:s=>states.push(s),complete:()=>completed++,failure:r=>failures.push(r)},clock)
  const emit=(name:string)=>{for(const fn of listeners.get(name)||[])fn()}
  return {video,states,failures,start,emit,tick:()=>tick(),completed:()=>completed,plays:()=>plays,cleared:()=>cleared}
}
const settled=async()=>{await Promise.resolve();await Promise.resolve()}
test("ordinary automatic attempt includes authored sound and does not advance early",async()=>{
  const f=fixture(),c=f.start();await settled()
  assert.equal(f.video.muted,false);assert.equal(f.video.volume,1);assert.equal(f.plays(),1)
  assert.equal(f.states.at(-1),"playing");assert.equal(f.completed(),0);c.dispose()
})
test("browser refusal keeps intro visible indefinitely until one gesture retries sound",async()=>{
  let allowed=false;const f=fixture(()=>allowed?Promise.resolve():Promise.reject({name:"NotAllowedError"})),c=f.start();await settled()
  assert.equal(f.states.at(-1),"blocked")
  for(let i=0;i<20;i++)f.tick()
  f.emit("canplay");assert.equal(f.plays(),1);assert.equal(f.completed(),0);assert.deepEqual(f.failures,[])
  allowed=true;c.playWithSound();await settled();assert.equal(f.states.at(-1),"playing");assert.equal(f.plays(),2);assert.equal(f.video.muted,false);c.dispose()
})
test("genuine ended progresses exactly once across DOM and clock events",async()=>{
  const f=fixture(),c=f.start();await settled();f.emit("ended");assert.equal(f.completed(),0)
  f.video.ended=true;f.emit("ended");f.tick();f.emit("ended");assert.equal(f.completed(),1);c.dispose()
})
test("source-load abort retries on readiness without inventing completion",async()=>{
  let ready=false;const f=fixture(()=>ready?Promise.resolve():Promise.reject({name:"AbortError"})),c=f.start();await settled()
  assert.equal(f.states.at(-1),"loading");assert.equal(f.completed(),0)
  ready=true;f.emit("loadedmetadata");f.emit("canplay");await settled();assert.equal(f.plays(),2);assert.equal(f.states.at(-1),"playing");c.dispose()
})
test("delayed resolved media can start a fresh binding; stale effect cannot report or advance",async()=>{
  let reject:(value:unknown)=>void=()=>{};const old=fixture(()=>new Promise((_,r)=>{reject=r})),first=old.start();first.dispose()
  const fresh=fixture(),next=fresh.start();await settled();reject({name:"NotAllowedError"});await settled()
  old.video.ended=true;old.emit("ended");old.tick();assert.equal(old.completed(),0);assert.equal(old.states.at(-1),"loading");assert.equal(old.cleared(),true)
  assert.equal(fresh.states.at(-1),"playing");assert.equal(fresh.plays(),1);next.dispose()
})
test("actual media error recovers separately and a successful retry is possible",async()=>{
  const f=fixture(),c=f.start();await settled();f.emit("error");f.emit("error")
  assert.deepEqual(f.failures,["media_error"]);assert.equal(f.completed(),0)
  c.retry();await settled();assert.equal(f.states.at(-1),"playing");f.video.ended=true;f.emit("ended");assert.equal(f.completed(),1);c.dispose()
})
test("15-second playing stall is an exception; progress and deliberate pause prevent false skip",async()=>{
  const f=fixture(),c=f.start();await settled()
  for(let i=0;i<8;i++){f.video.currentTime++;f.tick()}
  f.video.paused=true;for(let i=0;i<8;i++)f.tick();assert.deepEqual(f.failures,[])
  f.video.paused=false;f.tick();f.tick();assert.deepEqual(f.failures,[]);f.tick();assert.deepEqual(f.failures,["stall"]);assert.equal(f.completed(),0);c.dispose()
})
test("unresolved network load has a bounded 30-second exception rather than an ended claim",()=>{
  const f=fixture(()=>new Promise(()=>{})),c=f.start();for(let i=0;i<5;i++)f.tick();assert.deepEqual(f.failures,[])
  f.tick();assert.deepEqual(f.failures,["stall"]);assert.equal(f.completed(),0);c.dispose()
})
test("registered captions can show after track loading, without altering unrelated tracks or words",()=>{
  const tracks=[{kind:"captions",mode:"hidden"},{kind:"metadata",mode:"hidden"}]
  showApprovedCaptions(tracks as TextTrack[],true);assert.equal(tracks[0].mode,"showing");assert.equal(tracks[1].mode,"hidden")
  showApprovedCaptions(tracks as TextTrack[],false);assert.equal(tracks[0].mode,"disabled")
})
