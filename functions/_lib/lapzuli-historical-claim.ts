// Source-only candidate for OAR003. A shared operator key is not an actor proof.
export const HISTORICAL_ASSET = "undrifted_hole_map_bluesky_dist_v1"
export const HISTORICAL_ROUTE = "lapzuli_route_undrifted_hole_map_bluesky_dist_v1"
export const HISTORICAL_INSTANCE = "registrar_lapzuli_native_occurrence_claim_binder_codex_003"
export const HISTORICAL_OAR2 = "oar2_registrar_lapzuli_native_occurrence_claim_binder_chazz_20261012_003"
export const HISTORICAL_PASSAGE = "myenv_lapzuli_historical_v1"
type Row = Record<string, unknown>
export type HistoricalClaim = {executionId:string;attemptNumber:number|null;occurrenceKey:string;binding:Row}
export class HistoricalClaimHold extends Error {
  constructor(readonly reason:string) { super(reason) }
}

// My Env resolves its host-only cookie and forwards the token privately over
// HTTPS server-to-server. No copied browser cookie is accepted on c3Ops.
// The transport contract/shared access key is NOT identity; SQL verifies the
// secret against the existing session and governed owner/operator relations.
export function historicalOperatorToken(request:Request):string|null {
  if(new URL(request.url).origin!=="https://c3ops.c3field.online"||request.method!=="POST"||
    request.headers.has("origin")||request.headers.get("x-c3-contract")!==HISTORICAL_PASSAGE||
    request.headers.get("x-c3-source-origin")!=="https://my.c3field.online"||
    request.headers.get("x-c3-execution-instance")!==HISTORICAL_INSTANCE)return null
  const token=request.headers.get("x-c3-private-owner-session")??""
  return /^[0-9a-f]{64}$/.test(token)?token:null
}

export async function claimHistoricalAsset(
  rpc:(name:string,args:Row)=>Promise<unknown>,token:string|null,preflight:Row,
):Promise<HistoricalClaim> {
  if(!token)throw new HistoricalClaimHold("native_individual_operator_session_required")
  if(preflight.standing!=="EXECUTABLE"||preflight.distribution_asset_key!==HISTORICAL_ASSET||
    preflight.route_key!==HISTORICAL_ROUTE||preflight.executor_key!=="bluesky_api"||
    preflight.channel_key!=="bluesky_undrifted"||preflight.public_speaking_identity!=="unDrifted"||
    preflight.destination_account_identifier!=="undrifted.bsky.social")
    throw new HistoricalClaimHold("historical_preflight_binding_mismatch")
  let result:unknown
  try {
    result=await rpc("claim_lapzuli_historical_occurrence_v1",{
      p_operator_session_token:token,p_execution_instance:HISTORICAL_INSTANCE,p_preflight:preflight,
    })
  } catch {
    // No provider has been called. Do not fall back to the unbound five-arg claim.
    throw new HistoricalClaimHold("historical_native_claim_unavailable_or_unverified")
  }
  const rows=Array.isArray(result)?result:[]
  const row=rows.length===1&&rows[0]&&typeof rows[0]==="object"?rows[0] as Row:{}
  if(row.claimed!==true)throw new HistoricalClaimHold(
    typeof row.reason==="string"?row.reason:"historical_native_claim_not_acquired")
  const evidence=row.binding&&typeof row.binding==="object"&&!Array.isArray(row.binding)?row.binding as Row:{}
  if(typeof row.execution_id!=="string"||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(row.execution_id)||
    typeof row.occurrence_key!=="string"||!/^historical_manual_distribution_v1:[0-9a-f]{64}$/.test(row.occurrence_key)||
    evidence.occurrence_key!==row.occurrence_key||evidence.execution_instance!==HISTORICAL_INSTANCE||
    evidence.source_oar2!==HISTORICAL_OAR2||evidence.distribution_asset_key!==HISTORICAL_ASSET||
    evidence.route_key!==HISTORICAL_ROUTE||evidence.destination_account_identifier!=="undrifted.bsky.social"||
    evidence.operator_ref!=="op044"||evidence.individual_authenticated!==true)
    throw new HistoricalClaimHold("historical_native_claim_binding_unverified")
  return {executionId:row.execution_id,attemptNumber:typeof row.attempt_number==="number"?row.attempt_number:null,
    occurrenceKey:row.occurrence_key,binding:evidence}
}
