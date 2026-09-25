import test from "node:test"
import assert from "node:assert/strict"
import {projectMdmMediaRoles} from "./mdm-media-roles"
const row=(role:string,asset:string,standing="active")=>({media_role:role,standing,metadata:{source_asset_key:asset},runtime_uri:"/api/free-media?asset="+asset})
test("intro resolves independently while story is held",()=>{
  assert.deepEqual(projectMdmMediaRoles([row("entry_intro","intro"),row("feature_film","story","held")]),{entry_intro:"/api/free-media?asset=intro"})
})
test("separate roles remain separate",()=>{
  assert.deepEqual(projectMdmMediaRoles([row("entry_intro","intro"),row("feature_film","story")]),{entry_intro:"/api/free-media?asset=intro",feature_film:"/api/free-media?asset=story"})
})
test("rejects duplicate roles, direct custody URLs and conflated identities",()=>{
  assert.deepEqual(projectMdmMediaRoles([row("entry_intro","intro"),row("entry_intro","other")]),{})
  assert.deepEqual(projectMdmMediaRoles([{...row("entry_intro","intro"),runtime_uri:"https://example.org/intro.mp4"}]),{})
  assert.deepEqual(projectMdmMediaRoles([row("entry_intro","same"),row("feature_film","same")]),{})
})
