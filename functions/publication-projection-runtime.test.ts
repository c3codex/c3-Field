import test from "node:test"
import assert from "node:assert/strict"
import {onRequest} from "./_middleware"
const projection={status:"available",presentation:{projection_type:"registered_publication_projection",publication_key:"undrifted",canonical_host:"undrifted.measuresregistry.com",canonical_path:"/",renderer_identity:"c2me.publication_encounter",source_pubpac_key:"approved_pubpac",presentation_manifest_key:"approved_manifest",native_publication_route:"/undrifted",native_publication_environment:"env_undrifted_publication",frontend_invention:false,authority_effect:"none",release_state:"public"}}
const packet={standing:"resolved",presentation:{version:"designpac_v1",publication:{id:"undrifted"},authority:{pubpac:"approved_pubpac"}},socialMetadataSource:"undrifted_publication_landing",socialMetadata:{og_title:"Approved unDrifted",og_description:"Exact registered description",og_image:"https://media.example/approved.png",og_type:"website",canonical_url:"https://undrifted.measuresregistry.com/",og_url:"https://undrifted.measuresregistry.com/"}}
async function call(envelope:any=projection,result:any=packet){
 const original=fetch
 globalThis.fetch=async input=>new URL(String(input)).pathname==="/api/public-surface"?Response.json(envelope):Response.json(result)
 try{return await onRequest({env:{},request:new Request("https://undrifted.measuresregistry.com/"),next:async()=>new Response('<html><head><title>Measures Registry</title><meta name="description" content="Measures Registry"/><link rel="canonical" href="https://measuresregistry.com/"/><meta property="og:title" content="Measures Registry"/><meta property="og:description" content="Measures Registry"/><meta property="og:image" content="https://measuresregistry.com/og.jpeg"/></head><body></body></html>',{headers:{"content-type":"text/html"}})} as never)}finally{globalThis.fetch=original}
}
test("registered publication root receives the existing governed publication identity and head",async()=>{
 const r=await call();assert.equal(r.status,200);const body=await r.text();assert(body.includes(packet.socialMetadata.og_title));assert(body.includes(packet.socialMetadata.og_image));assert(!body.includes("Measures Registry"));assert.equal(r.headers.get("x-c3-social-head"),"registered-undrifted-publication-projected")
})
test("publication host, source custody or social authority drift holds instead of rendering generic home",async()=>{
 const held=structuredClone(projection);held.presentation.release_state="held";assert.equal((await call(held)).status,503)
 const foreign=structuredClone(packet);foreign.presentation.authority.pubpac="foreign_custody";assert.equal((await call(projection,foreign)).status,503)
 const wrong=structuredClone(packet);wrong.socialMetadata.canonical_url="https://measuresregistry.com/";assert.equal((await call(projection,wrong)).status,503)
})
