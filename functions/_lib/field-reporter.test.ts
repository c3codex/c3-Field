import {test} from "node:test"
import assert from "node:assert/strict"
import {resolveFieldReporter,fieldReporterResponse} from "./field-reporter"
function fixture(){
  const rows:Record<string,any[]>={
    c3_registrar_publication_registration:[{registration_key:"registration",publication_object_key:"publication",desk_key:"desk",pubpac_key:"pac",editorial_voice_key:"voice",publication_standing:"approved",distribution_standing:"held",metadata:{article_member_key:"article",required_contract:"registrar_pubpac_free_callable_v1"}}],
    c3ops_publication_object:[{publication_object_key:"publication",publisher_key:"c3_registrar",publication_key:"47pct",title:"Registered title"}],
    c3_registrar_publication_desk:[{standing:"active",native_context_key:"47pct",publication_authority_key:"c3_registrar",desk_label:"4.7% Desk"}],
    c3_registrar_publication_authority:[{standing:"active",authority_key:"c3_registrar",authority_label:"c3 Registrar",public_publication_name:"Field Reporter"}],
    c3_pac:[{pac_type:"PubPac",is_effective:true,metadata:{registrar_registration_key:"registration",publication_authority:"c3_registrar",editorial_voice_key:"voice",series:"Mapped & Measured"}}],
    c3_pac_member:[{source_object_key:"publication",runtime_uri:"https://custody.invalid/article",integrity_value:"a".repeat(64),metadata:{title:"Registered title",body_state:"PERSISTED_EXACT_APPROVED_BODY"}}],
    system_process_registry:[]
  }
  return {rows,read:async(table:string)=>rows[table]||[]}
}
test("ready body cannot bypass absent FREE publication authority",async()=>{
  const f=fixture();const result=await resolveFieldReporter("the-cost-of-a-claim",f.read)
  assert.equal(result.standing,"HLD");assert.equal(result.reason,"registrar_pubpac_free_callable_unresolved")
  assert.equal(result.title,"Registered title");assert.equal(result.publicationLabel,"c3 Registrar — Field Reporter")
  for(const key of ["body","media","canonicalUrl"])assert.equal(key in result,false)
})
test("missing exact body keeps the OAR predicate",async()=>{
  const f=fixture();f.rows.c3_pac_member[0].metadata.body_state="REGISTRY_APPROVED_BODY_NOT_YET_PERSISTED_TO_RUNTIME"
  assert.equal((await resolveFieldReporter("slug",f.read)).reason,"REGISTRY_APPROVED_BODY_NOT_YET_PERSISTED_TO_RUNTIME")
})
test("foreign publisher and ambiguous route fail closed",async()=>{
  const f=fixture();f.rows.c3ops_publication_object[0].publisher_key="other"
  await assert.rejects(resolveFieldReporter("slug",f.read),/publication_authority_mismatch/)
  f.rows.c3_registrar_publication_registration.push(f.rows.c3_registrar_publication_registration[0])
  await assert.rejects(resolveFieldReporter("slug",f.read),/publication_identity_missing_or_ambiguous/)
})
test("future resolver registration does not activate an unverified adapter",async()=>{
  const f=fixture();f.rows.system_process_registry=[{process_key:"registrar_pubpac_free_callable_v1"}]
  assert.equal((await resolveFieldReporter("slug",f.read)).reason,"registrar_pubpac_free_adapter_unresolved")
})
test("wrong host and invalid slug stop before Registry reads",async()=>{
  assert.equal((await fieldReporterResponse(new Request("https://mdm.c3field.online/api/field-reporter?slug=x"),{})).status,404)
  assert.equal((await fieldReporterResponse(new Request("https://47pct.c3field.online/api/field-reporter?slug=../x"),{})).status,400)
})
