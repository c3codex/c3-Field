import fs from "node:fs"
import path from "node:path"
import dotenv from "dotenv"
import {preflightLapzuliRoute} from "../functions/api/c3ops/lapzuli"
// Existing server credentials stay in process memory; output is bounded evidence only.
const root=process.env.C3FIELD_EVIDENCE_CONFIG_ROOT ?? process.cwd()
const env={...dotenv.parse(fs.readFileSync(path.join(root,".dev.vars"))),...process.env}
const routes=[
 "lapzuli_route_undrifted_drift_report_005_paragraph_codex_014",
 "lapzuli_route_undrifted_drift_report_005_bluesky_thread_001",
 "lapzuli_candidate_dr006_facebook_undrifted_v1",
 "lapzuli_route_undrifted_drift_report_005_medium_thread_001",
 "lapzuli_route_undrifted_drift_report_005_dev_codex_010",
]
const results=[]
for(const route of routes){
 try{results.push(await preflightLapzuliRoute(env,route))}
 catch{results.push({route_key:route,standing:"HLD",reason:"current_runtime_read_unavailable",external_publication_effects:0})}
}
const output={execution_instance:"audit_bind_lapzuli_free_runtime_codex_003",observed_at:new Date().toISOString(),results,external_publication_effects:0,registry_mutations:0}
fs.mkdirSync("evidence/lapzuli_free_runtime_codex_003",{recursive:true})
fs.writeFileSync("evidence/lapzuli_free_runtime_codex_003/runtime-preflight.json",JSON.stringify(output,null,2))
console.log(JSON.stringify(results.map(r=>({route_key:r.route_key,standing:r.standing,reason:r.reason})),null,2))
