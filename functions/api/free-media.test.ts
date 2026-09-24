import test from "node:test"
import assert from "node:assert/strict"
import {normalizedProvider,pacBindingCustodyMismatch,parseByteRange,r2BindingKey} from "./free-media"

test("parses open-ended byte ranges",()=>{
  assert.deepEqual(parseByteRange("bytes=0-",1000),{kind:"range",offset:0,length:1000,end:999})
  assert.deepEqual(parseByteRange("bytes=500-",1000),{kind:"range",offset:500,length:500,end:999})
})

test("parses bounded byte ranges",()=>{
  assert.deepEqual(parseByteRange("bytes=100-199",1000),{kind:"range",offset:100,length:100,end:199})
  assert.deepEqual(parseByteRange("bytes=900-1200",1000),{kind:"range",offset:900,length:100,end:999})
})

test("parses suffix ranges",()=>{
  assert.deepEqual(parseByteRange("bytes=-250",1000),{kind:"range",offset:750,length:250,end:999})
  assert.deepEqual(parseByteRange("bytes=-2000",1000),{kind:"range",offset:0,length:1000,end:999})
})

test("rejects malformed and unsatisfiable ranges",()=>{
  assert.deepEqual(parseByteRange("bytes=1000-",1000),{kind:"invalid"})
  assert.deepEqual(parseByteRange("bytes=200-100",1000),{kind:"invalid"})
  assert.deepEqual(parseByteRange("bytes=0-1,4-5",1000),{kind:"invalid"})
  assert.deepEqual(parseByteRange("items=0-10",1000),{kind:"invalid"})
})

test("maps governed R2 custody identifiers to exact Pages bindings",()=>{
  assert.equal(r2BindingKey("c3-field-media"),"C3_FIELD_MEDIA")
  assert.equal(r2BindingKey("c1ME.env_ready"),"C1ME_ENV_READY")
  assert.equal(r2BindingKey("other"),null)
})

test("normalizes provider spelling without changing provider identity",()=>{
  assert.equal(normalizedProvider("Cloudflare R2"),"cloudflare_r2")
  assert.equal(normalizedProvider("cloudflare_r2"),"cloudflare_r2")
  assert.equal(normalizedProvider("supabase"),"supabase")
})

test("accepts a PAC binding only when it matches the constituent asset custody",()=>{
  const binding={
    provider:"cloudflare_r2",
    bucket_name:"c3-field-media",
    object_path:"c1/current_intro.mp4",
    runtime_uri:"/api/free-media?asset=intro",
    metadata:{source_asset_key:"intro"},
  }
  const asset={
    authoritative_custody_provider:"Cloudflare R2",
    authoritative_custody_identifier:"c3-field-media",
    authoritative_custody_location:"c1/current_intro.mp4",
    current_free_binding:"/api/free-media?asset=intro",
  }
  assert.equal(pacBindingCustodyMismatch(binding,"intro",asset),null)
})

test("refuses PAC binding drift from current constituent custody",()=>{
  const asset={
    authoritative_custody_provider:"Cloudflare R2",
    authoritative_custody_identifier:"c3-field-media",
    authoritative_custody_location:"c1/current_intro.mp4",
    current_free_binding:"/api/free-media?asset=intro",
  }
  assert.equal(pacBindingCustodyMismatch({
    provider:"cloudflare_r2",
    bucket_name:"other",
    object_path:"c1/current_intro.mp4",
    runtime_uri:"/api/free-media?asset=intro",
    metadata:{source_asset_key:"intro"},
  },"intro",asset),"pac_media_bucket_mismatch")
  assert.equal(pacBindingCustodyMismatch({
    provider:"supabase",
    bucket_name:"c3-field-media",
    object_path:"c1/current_intro.mp4",
    runtime_uri:"/api/free-media?asset=intro",
    metadata:{source_asset_key:"intro"},
  },"intro",asset),"pac_media_provider_mismatch")
  assert.equal(pacBindingCustodyMismatch({
    provider:"cloudflare_r2",
    bucket_name:"c3-field-media",
    object_path:"c1/old_intro.mp4",
    runtime_uri:"/api/free-media?asset=intro",
    metadata:{source_asset_key:"intro"},
  },"intro",asset),"pac_media_object_mismatch")
})
