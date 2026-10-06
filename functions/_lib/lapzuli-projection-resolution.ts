import registrarReport from './lapzuli-registrar-report.json'
import type {Row} from './me-environment'

const record=(value:unknown):Row=>value&&typeof value==='object'&&!Array.isArray(value)?value as Row:{}
const owners={
 campaign_identity_owner:'measures_publication_campaign',
 distribution_object_operational_owner:'current_distribution_asset_plus_execution_evidence',
 route_authority_owner:'lapzuli_route',
 outlet_account_owner:'lapzuli_outlet',
 outlet_qualification_owner:'lapzuli_outlet_qualification',
 publication_proof_owner:'distribution_execution_plus_encounter_evidence',
 campaign_rollup_rule:'derived_from_current_assets_routes_outlets_qualification_and_evidence',
 historical_campaign_fields:'evidence_provenance_when_superseded_not_current_operational_truth',
 optics_rule:'consume_registrar_report_and_registered_resolution; observer_only; no_independent_current_interpretation',
}

// This consumes the registered resolution. The report is retained documentary
// evidence; it never supplies a cached campaign, outlet, or execution standing.
export function consumeLapzuliProjectionResolution(authorities:Row[]) {
 const rows=authorities.filter(row=>row.authority_key==='c3_registrar')
 const authority=rows.length===1?rows[0]:null
 const resolution=record(record(authority?.metadata).lapzuli_projection_resolution_v1)
 const holds:string[]=[]
 if(!authority||authority.standing!=='active')holds.push('registrar_authority_unresolved')
 if(resolution.standing!=='registered_effective'||resolution.operator!=='op044'||resolution.scope!=='undrifted_lapzuli_campaign_projection_authority')holds.push('lapzuli_projection_resolution_unresolved')
 for(const[key,value]of Object.entries(owners))if(resolution[key]!==value)holds.push('projection_owner_conflict:'+key)
 return {source:'c3_registrar_publication_authority:c3_registrar/metadata.lapzuli_projection_resolution_v1',standing:holds.length?'HLD':'registered_effective',hold_reasons:holds,resolution,registrar_report:registrarReport,report_role:'historical_registrar_report_evidence; CURRENT owners resolve live',mutation_authority:false}
}

export function resolveCurrentOutletQualification(route:Row|null,outlets:Row[],qualifications:Row[]) {
 const matchedOutlets=outlets.filter(row=>row.outlet_key===route?.outlet_key)
 const outlet=matchedOutlets.length===1?matchedOutlets[0]:null
 const matchedQualifications=qualifications.filter(row=>row.outlet_key===route?.outlet_key&&row.desk_key===route?.desk_key&&row.distribution_mode===route?.distribution_mode)
 const qualification=matchedQualifications.length===1?matchedQualifications[0]:null
 const holds:string[]=[]
 if(!outlet)holds.push('current_outlet_unresolved')
 else if(outlet.account_standing!=='verified'&&outlet.account_standing!=='not_required')holds.push('current_outlet_account_unverified')
 if(!qualification)holds.push('current_desk_outlet_qualification_unresolved')
 else if(!['qualified','qualified_with_constraints'].includes(String(qualification.standing)))holds.push('current_desk_outlet_qualification:'+String(qualification.standing))
 return {outlet,qualification,holds}
}

export function deriveCurrentCampaignStanding(assets:Array<{distribution_state:string}>) {
 if(assets.some(asset=>asset.distribution_state==='distributed'))return 'active_trace'
 if(assets.some(asset=>asset.distribution_state==='accepted_pending_platform_proof'))return 'provider_accepted_pending_platform_proof'
 if(assets.some(asset=>asset.distribution_state==='ready_for_operator_execution'))return 'ready_for_operator_execution'
 if(assets.some(asset=>['ready_for_lapzuli_resolution','awaiting_lapzuli_resolution'].includes(asset.distribution_state)))return 'awaiting_lapzuli_resolution'
 return 'held'
}
