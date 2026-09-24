type Env={SUPABASE_URL?:string;SUPABASE_SERVICE_ROLE_KEY?:string}

type Row=Record<string,unknown>

const HEADERS={
  "content-type":"application/json; charset=utf-8",
  "cache-control":"no-store",
  "x-content-type-options":"nosniff"
}

function json(body:unknown,status=200){
  return new Response(JSON.stringify(body),{status,headers:HEADERS})
}

function asRecord(value:unknown):Row{
  return value&&typeof value==="object"&&!Array.isArray(value)?value as Row:{}
}

function asString(value:unknown){
  return typeof value==="string"&&value.trim()?value.trim():null
}

function asBoolean(value:unknown){
  return typeof value==="boolean"?value:null
}

async function readMany(env:Env,table:string,params:Record<string,string>){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("server_configuration")
  const url=new URL(env.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/"+table)
  for(const [key,value] of Object.entries(params)) url.searchParams.set(key,value)
  const response=await fetch(url.toString(),{
    headers:{
      apikey:env.SUPABASE_SERVICE_ROLE_KEY,
      authorization:"Bearer "+env.SUPABASE_SERVICE_ROLE_KEY
    },
    signal:AbortSignal.timeout(12000)
  })
  if(!response.ok) throw new Error("registry_read_failed:"+table)
  const rows=await response.json()
  if(!Array.isArray(rows)) throw new Error("registry_shape_invalid:"+table)
  return rows as Row[]
}

function campaignTruth(pac:Row){
  const metadata=asRecord(pac.metadata)
  const activation=asRecord(metadata.activation)
  const distributionScope=asRecord(metadata.distribution_scope)
  return {
    campaignKey:asString(metadata.campaign_key),
    campaignName:asString(metadata.campaign_name),
    objective:asString(metadata.objective),
    canonicalUrl:asString(metadata.canonical_url)??asString(metadata.canonical_route),
    lapzuliReady:asBoolean(metadata.lapzuli_ready),
    activationState:asString(metadata.activation_state)??asString(activation.state),
    distributionAuthorized:asBoolean(metadata.distribution_authorized)??asBoolean(distributionScope.external_distribution_authorized),
    externalExecutionAuthorized:asBoolean(metadata.external_execution_authorized),
  }
}

export const onRequestGet:PagesFunction<Env>=async({request,env})=>{
  const url=new URL(request.url)
  if(url.hostname!=="c3ops.c3field.online") return json({error:"not_found"},404)
  const requestedPac=url.searchParams.get("pac")?.trim()||null
  try{
    const pacParams:Record<string,string>={
      select:"pac_key,envpac_key,pac_type,standing,is_effective,source_authority,metadata",
      pac_type:"eq.CampaignPac",
      is_effective:"eq.true",
      order:"pac_key.asc"
    }
    if(requestedPac) pacParams.pac_key="eq."+requestedPac

    const pacs=await readMany(env,"c3_pac",pacParams)
    if(pacs.length===0) return json({
      standing:requestedPac?"free_pac_not_registered":"free_pac_projection_held",
      reason:"no_effective_registered_campaign_pac"
    },requestedPac?404:409)

    const [relations,campaigns,assets,executions,channels]=await Promise.all([
      readMany(env,"c3_pac_relation",{
        select:"source_pac_key,relation_type,target_kind,target_key,standing",
        order:"source_pac_key.asc,relation_type.asc"
      }),
      readMany(env,"measures_publication_campaign",{
        select:"campaign_key,campaign_name,campaign_objective,status,release_state,review_status,updated_at",
        order:"updated_at.desc"
      }),
      readMany(env,"measures_publication_distribution_asset",{
        select:"distribution_asset_key,campaign_id,platform,distribution_type,status,buffer_export_ready,review_status,updated_at",
        order:"updated_at.desc"
      }),
      readMany(env,"measures_distribution_execution",{
        select:"execution_id,distribution_asset_id,executor_key,channel_key,execution_status,attempt_number,executed_at,published_at,platform_post_id,platform_url,error,created_at",
        order:"created_at.desc",
        limit:"500"
      }),
      readMany(env,"measures_distribution_channel",{
        select:"channel_key,executor_key,platform,account_name,channel_identifier,status,updated_at",
        order:"channel_key.asc"
      })
    ])

    const pacKeys=new Set(pacs.map(row=>asString(row.pac_key)).filter((value):value is string=>Boolean(value)))
    const projected=pacs.map(pac=>{
      const pacKey=asString(pac.pac_key)
      const truth=campaignTruth(pac)
      const campaign=truth.campaignKey
        ? campaigns.find(row=>asString(row.campaign_key)===truth.campaignKey)??null
        : null
      const campaignAssets=truth.campaignKey
        ? assets.filter(row=>asString(row.campaign_id)===truth.campaignKey)
        : []
      const assetKeys=new Set(campaignAssets.map(row=>asString(row.distribution_asset_key)).filter((value):value is string=>Boolean(value)))
      const campaignExecutions=executions.filter(row=>{
        const key=asString(row.distribution_asset_id)
        return key?assetKeys.has(key):false
      })
      const channelKeys=new Set(campaignExecutions.map(row=>asString(row.channel_key)).filter((value):value is string=>Boolean(value)))
      const campaignChannels=channels.filter(row=>{
        const key=asString(row.channel_key)
        return key?channelKeys.has(key):false
      })
      return {
        pacKey,
        envpacKey:asString(pac.envpac_key),
        standing:asString(pac.standing),
        isEffective:pac.is_effective===true,
        sourceAuthority:asString(pac.source_authority),
        truth,
        relations:relations.filter(row=>asString(row.source_pac_key)===pacKey).map(row=>({
          relationType:asString(row.relation_type),
          targetKind:asString(row.target_kind),
          targetKey:asString(row.target_key),
          standing:asString(row.standing)
        })),
        campaign:campaign?{
          campaignKey:asString(campaign.campaign_key),
          campaignName:asString(campaign.campaign_name),
          objective:asString(campaign.campaign_objective),
          status:asString(campaign.status),
          releaseState:asString(campaign.release_state),
          reviewStatus:asString(campaign.review_status),
          updatedAt:asString(campaign.updated_at)
        }:null,
        distributionAssets:campaignAssets.map(row=>({
          distributionAssetKey:asString(row.distribution_asset_key),
          campaignId:asString(row.campaign_id),
          platform:asString(row.platform),
          distributionType:asString(row.distribution_type),
          status:asString(row.status),
          bufferExportReady:row.buffer_export_ready===true,
          reviewStatus:asString(row.review_status),
          updatedAt:asString(row.updated_at)
        })),
        executions:campaignExecutions.map(row=>({
          executionId:asString(row.execution_id),
          distributionAssetId:asString(row.distribution_asset_id),
          executorKey:asString(row.executor_key),
          channelKey:asString(row.channel_key),
          executionStatus:asString(row.execution_status),
          attemptNumber:typeof row.attempt_number==="number"?row.attempt_number:null,
          executedAt:asString(row.executed_at),
          publishedAt:asString(row.published_at),
          platformPostId:asString(row.platform_post_id),
          platformUrl:asString(row.platform_url),
          error:asString(row.error),
          createdAt:asString(row.created_at)
        })),
        channels:campaignChannels.map(row=>({
          channelKey:asString(row.channel_key),
          executorKey:asString(row.executor_key),
          platform:asString(row.platform),
          accountName:asString(row.account_name),
          channelIdentifier:asString(row.channel_identifier),
          status:asString(row.status),
          updatedAt:asString(row.updated_at)
        }))
      }
    })

    if(projected.some(item=>!item.pacKey || !pacKeys.has(item.pacKey))) {
      return json({standing:"free_pac_projection_held",reason:"pac_identity_malformed"},409)
    }

    return json({
      standing:"free_pac_projection",
      projection:"registry_pac_truth",
      authorityCreated:false,
      encounterCreated:false,
      pacs:projected
    })
  }catch(error){
    return json({
      standing:"free_pac_projection_held",
      reason:error instanceof Error?error.message:"registry_unavailable"
    },503)
  }
}

export const onRequest:PagesFunction=async()=>json({error:"method_not_allowed"},405)
