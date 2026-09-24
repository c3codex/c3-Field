import test from "node:test"
import assert from "node:assert/strict"
import {parseByteRange,r2BindingKey} from "./free-media"

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
