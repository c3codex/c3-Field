import test from "node:test"
import assert from "node:assert/strict"
import {isLocalC1Review, parseC1ReviewPackage} from "./c1EnvironmentPackage"
import {c1ReviewPackage, verifyRegistrySnapshot} from "../../scripts/c1-review-package"
import {readFileSync} from "node:fs"

test("review requires dev build, explicit enablement and loopback", () => {
  assert.equal(isLocalC1Review(true,"1","127.0.0.1"),true)
  assert.equal(isLocalC1Review(false,"1","127.0.0.1"),false)
  assert.equal(isLocalC1Review(true,undefined,"127.0.0.1"),false)
  for (const host of ["c3field.online","example.com","127.0.0.1.evil.invalid"]) assert.equal(isLocalC1Review(true,"1",host),false)
})
test("missing copy, unexpected media and invented initiative fail closed", () => {
  assert.equal(parseC1ReviewPackage(c1ReviewPackage).available,true)
  for (const value of [null,{}, {...c1ReviewPackage,reviewOnly:false}, {...c1ReviewPackage,copy:{}},
    {...c1ReviewPackage,initiatives:[{key:"invented",label:"Invented"}]},
    {...c1ReviewPackage,assets:{...c1ReviewPackage.assets,emblem:{src:"https://elsewhere.invalid/logo.png",alt:"logo"}}}])
    assert.throws(() => parseC1ReviewPackage(value))
})
test("snapshot must retain package identity, protected terms and release holds", () => {
  const rows = JSON.parse(readFileSync("../evidence/registry-rows.json","utf8"))
  assert.equal(verifyRegistrySnapshot(rows),true)
  for (const mutate of [
    (r:any[]) => {r.find(x=>x.evidence==="environment").record.metadata.env_pac_drive_id="wrong"},
    (r:any[]) => {r.find(x=>x.evidence==="environment").record.metadata.runtime_activation_state="active"},
    (r:any[]) => {r.find(x=>x.evidence==="registry").record.release_state="released"},
    (r:any[]) => {r.find(x=>x.evidence==="term").record.term_standing="retired"},
  ]) { const copy=structuredClone(rows);mutate(copy);assert.equal(verifyRegistrySnapshot(copy),false) }
})
