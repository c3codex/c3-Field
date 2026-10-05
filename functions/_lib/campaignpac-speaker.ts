// WHO belongs to a current, explicitly bound CampaignPac. Account/provider/desk
// identities and PubPac publication authority are never fallback speakers.
type Row = Record<string, unknown>
const obj = (value: unknown): Row => value && typeof value === "object" && !Array.isArray(value) ? value as Row : {}
const str = (value: unknown) => typeof value === "string" && value.trim() ? value.trim() : null

export function campaignPacKeys(route: Row, asset?: Row, callable?: Row) {
  return [...new Set([obj(route.metadata).campaign_pac_key, obj(asset?.metadata).campaign_pac_key,
    callable?.campaign_pac_key].map(str).filter((key): key is string => key !== null))]
}

export function resolveCampaignPacSpeaker(route: Row, asset: Row | undefined, callable: Row | undefined, pacs: Row[], channelKey: string | null) {
  const keys = campaignPacKeys(route, asset, callable)
  const matches = keys.length === 1 ? pacs.filter(pac => pac.pac_key === keys[0]) : []
  const pac = matches.length === 1 ? matches[0] : undefined
  const metadata = obj(pac?.metadata), scope = obj(metadata.scope)
  const speaker = str(metadata.public_speaking_identity)
  const objects = scope.published_objects, destinations = scope.destinations
  const bindingPass = keys.length === 1 && matches.length === 1 && pac?.pac_type === "CampaignPac" && pac.is_effective === true
  const scopePass = bindingPass && (!Array.isArray(objects) || objects.includes(route.publication_object_key)) &&
    (!Array.isArray(destinations) || destinations.includes(channelKey) || destinations.includes(route.outlet_key))
  const reason = !bindingPass ? "governing_campaignpac_binding" : !scopePass ? "campaignpac_route_scope" : !speaker ? "campaignpac_public_speaking_identity" : null
  return {
    campaign_pac_key: keys.length === 1 ? keys[0] : null,
    campaign_pac_binding_keys: keys,
    public_speaking_identity: bindingPass && scopePass ? speaker : null,
    source_pubpac_key: str(metadata.source_pubpac) ?? str(pac?.source_authority),
    responsibility_boundary: str(metadata.responsibility_boundary),
    campaign_pac_standing: pac?.standing ?? null,
    speaker_binding_standing: reason ? "HLD" : "resolved",
    speaker_binding_reason: reason,
    predicates: [
      {predicate:"governing_campaignpac_binding",pass:bindingPass,evidence:{binding_keys:keys,pac_type:pac?.pac_type ?? null,is_effective:pac?.is_effective ?? null}},
      {predicate:"campaignpac_route_scope",pass:scopePass,evidence:{publication_object_key:route.publication_object_key,channel_key:channelKey}},
      {predicate:"campaignpac_public_speaking_identity",pass:bindingPass && scopePass && !!speaker,evidence:{campaign_pac_key:pac?.pac_key ?? null,public_speaking_identity:bindingPass && scopePass ? speaker : null}},
    ],
  }
}
