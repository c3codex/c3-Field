import test from "node:test"
import assert from "node:assert/strict"
import {createRequire} from "node:module"
import {resolve} from "node:path"
const require=createRequire(import.meta.url)
const React=require("C:/c3-lapzuli-012-testtools/node_modules/react")
const renderer=require("C:/c3-lapzuli-012-testtools/node_modules/react-test-renderer")
const built=require("esbuild").buildSync({entryPoints:["src/c3_field_connect/C3FieldRoot.tsx"],bundle:true,write:false,platform:"node",format:"cjs",jsx:"automatic",packages:"external",loader:{".css":"empty"}}).outputFiles[0].text
const Module=require("node:module"),compiled=new Module("root-invite.cjs")
compiled.paths=["C:/c3-lapzuli-012-testtools/node_modules",...Module._nodeModulePaths(process.cwd())]
compiled._compile(built,"root-invite.cjs")
const via="90c495d0-3588-4d2b-a5bc-bd919b10513b"
async function setup(search:string,reduced=false){
 const originalFetch=globalThis.fetch,originalWindow=(globalThis as any).window,assigned:string[]=[]
 const player={currentTime:0,ended:false,muted:true,play:async()=>{}}
 ;(globalThis as any).window={location:{search,assign:(url:string)=>assigned.push(url)},matchMedia:()=>({matches:reduced}),setInterval:()=>1,clearInterval:()=>{}}
 globalThis.fetch=async()=>new Response(JSON.stringify({standing:"bounded_public_runtime",manifest:{composition:{sections:[{key:"field",title:"Public Field"}]}},runtimeMedia:{opening:{runtime_uri:"https://field-media.c3field.online/c1/c3_field_tree_intro_c1me.mp4"},backdrop:{runtime_uri:"/api/free-media?asset=c3_field_c1me_live_backdrop_v1"}},publicIdentity:{}}))
 let ui:any
 await renderer.act(async()=>{ui=renderer.create(React.createElement(compiled.exports.default),{createNodeMock:(element:any)=>element.type==="video"?player:null})})
 return {ui,assigned,player,close:()=>{ui.unmount();globalThis.fetch=originalFetch;(globalThis as any).window=originalWindow}}
}
test("accepted media and sound preserved; end plus skip transitions at most once carrying exact via",async()=>{
 const f=await setup("?via="+via)
 try{
  assert.equal(f.ui.root.findByType("video").props.src,"https://field-media.c3field.online/c1/c3_field_tree_intro_c1me.mp4")
  const ended=f.ui.root.findByType("video").props.onEnded
  const buttons=f.ui.root.findAllByType("button")
  await renderer.act(async()=>buttons[0].props.onClick());assert.equal(f.player.muted,false)
  await renderer.act(async()=>{ended();buttons[1].props.onClick();ended()})
  assert.deepEqual(f.assigned,["/connect?via="+via+"&intro=complete"])
 }finally{f.close()}
})
test("public root remains Field with independent Current State doorway",async()=>{
 const f=await setup("")
 try{await renderer.act(async()=>f.ui.root.findByType("video").props.onEnded());assert.equal(f.assigned.length,0)
 assert.ok(f.ui.root.findAllByType("a").some((a:any)=>a.props.href==="/connect"))
 assert.match(JSON.stringify(f.ui.toJSON()),/Public Field/)
 }finally{f.close()}
})
test("malformed invitation never transitions or grants entry",async()=>{
 const f=await setup("?via=malformed")
 try{await renderer.act(async()=>f.ui.root.findByType("video").props.onEnded());assert.equal(f.assigned.length,0);assert.match(JSON.stringify(f.ui.toJSON()),/could not be verified/)}
 finally{f.close()}
})
test("reduced-motion referred arrival skips playback without a second intro",async()=>{
 const f=await setup("?via="+via,true)
 try{assert.equal(f.assigned.length,1);assert.equal(f.ui.root.findAllByType("video").length,0)}finally{f.close()}
})
