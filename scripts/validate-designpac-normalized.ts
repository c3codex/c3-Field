import assert from "node:assert/strict"
import fs from "node:fs"
import { resolvePublicationPresentation, type ReadPublicationRows } from "../functions/_lib/publication-presentation"
import { archiveIndex, composeLivingIssue, continuationParts, resolveReaderPosition, PAGE_GRAMMARS } from "../src/measures_registry/encounter_renderer/publications/designpacComposition"
const snapshot = JSON.parse(fs.readFileSync(process.argv[2], "utf8"))
const output = process.argv[3]
const readFixture = (data: typeof snapshot): ReadPublicationRows => async (table, _select, filters = {}) => (data[table] || []).filter((row: Record<string, unknown>) => Object.entries(filters).every(([path, value]) => {
  let found: any = row; for (const part of path.split(/->>?/)) found = found?.[part]
  return value.startsWith("eq.") ? String(found) === value.slice(3) : value.startsWith("in.(") && value.slice(4, -1).split(",").includes(String(found))
}))
const resolve = (data = snapshot) => resolvePublicationPresentation(readFixture(data), "lapis_chamber_encounter", "https://zfihrspxvennjzazxcbj.supabase.co")
const current = (p: Awaited<ReturnType<typeof resolve>>) => p.issues.find(x => x.active && !x.archived)!
const p = await resolve(), issue = current(p), composed = composeLivingIssue(p, issue)
assert.equal(issue.objects.length, 8)
assert.deepEqual(issue.deskLeads, {
  current: "undrifted_issue003_current_state_persistence_governed_state",
  drift_report: "undrifted_drift_report_006",
  mapped_and_measured: "undrifted_mapped_measured_hole_in_the_map",
  structural_standings: "undrifted_structural_standings_safety_directive_wasnt_authority"
})
assert.equal(issue.holds.filter(x => x.startsWith("desk_lead_")).length, 0)
assert.equal(new Set(composed.pages.map(x => x.key)).size, composed.pages.length)
assert.deepEqual(new Set(composed.membership.map(x => x.id)), new Set(issue.objects.map(x => x.id)))
assert.equal(composed.membership[0].id, issue.featureId)
for (const [desk, id] of Object.entries(issue.deskLeads!)) assert.equal(composed.pages[composed.deskPositions.get(desk)!].objectId, id)
for (const o of issue.objects.filter(x => x.body)) {
  assert.equal(continuationParts(o.body!).join(""), o.body)
  assert.equal(composed.pages.filter(x => x.objectId === o.id && !x.opening).map(x => x.body).join(""), o.body)
}
assert(p.holds.some(x => x === "published_runtime_body_missing:" + issue.featureId))
assert(p.holds.some(x => x === "durable_article_route_missing:" + issue.featureId))
const release = (data: any) => data.measures_publication_release.find((x: any) => x.active_issue && x.archive_state !== "archived")
const cache = structuredClone(snapshot)
release(cache).metadata.current_desk_object_key = "historical_cache_only"
release(cache).metadata.drift_report_desk_object_key = "undrifted_drift_report_005"
for (const page of cache.measures_publication_issue_page) {
  page.metadata.featured_article = false
  page.metadata.desk_lead_candidate = false
  page.metadata.current_issue_member = false
  if (cache.measures_publication_dispatch.some((x: any) => x.dispatch_key === page.dispatch_key)) page.metadata.external_url = "/untrusted-derived-cache"
}
cache.measures_publication_registry[0].metadata.active_issue_key = "historical_cache_only"
const projected = current(await resolve(cache))
assert.equal(projected.featureId, issue.featureId)
assert.deepEqual(projected.deskLeads, issue.deskLeads)
assert(JSON.stringify(projected.objects) === JSON.stringify(issue.objects), "Derived caches changed authoritative object projection")
const featureChange = structuredClone(snapshot)
release(featureChange).metadata.featured_article_object_key = "undrifted_drift_report_006"
const changedFeature = current(await resolve(featureChange))
assert.equal(changedFeature.featureId, "undrifted_drift_report_006")
assert.equal(changedFeature.deskLeads?.drift_report, "undrifted_drift_report_005")
const absentFeature = structuredClone(snapshot); release(absentFeature).metadata.featured_article_object_key = "ineligible"
await assert.rejects(resolve(absentFeature), /governed_feature_relation_conflict/)
const schemaConflict = structuredClone(snapshot); release(schemaConflict).metadata.authority_schema_v1.feature_authority = "legacy_flags"
await assert.rejects(resolve(schemaConflict), /publication_authority_schema_unresolved/)
const unknownRule = structuredClone(snapshot); release(unknownRule).metadata.current_desk_resolution = "unregistered_rule"
await assert.rejects(resolve(unknownRule), /registered_desk_resolution_rule_unsupported/)
const membership = structuredClone(snapshot)
membership.measures_publication_issue_page.find((x: any) => x.metadata?.publication_object_key === "undrifted_drift_report_005" && x.issue_id === issue.id).visibility_state = "hidden"
assert.equal(current(await resolve(membership)).objects.length, 7)
const missingSequence = structuredClone(snapshot)
for (const page of missingSequence.measures_publication_issue_page.filter((x: any) => x.issue_id === issue.id && x.metadata?.desk_key === "current" && x.metadata?.object_format === "current_state_comic")) delete page.metadata.lineage_position
const missingPresentation = await resolve(missingSequence), missingIssue = current(missingPresentation)
assert(missingIssue.holds.includes("desk_lead_chronology_missing:current"))
assert.throws(() => composeLivingIssue(missingPresentation, missingIssue), /governed_desk_lead_chronology_unresolved/)
const ambiguousSequence = structuredClone(snapshot)
for (const page of ambiguousSequence.measures_publication_issue_page.filter((x: any) => x.issue_id === issue.id && x.metadata?.object_format === "current_state_comic")) page.metadata.lineage_position = 1
assert(current(await resolve(ambiguousSequence)).holds.includes("desk_lead_chronology_ambiguous:current"))
const addition = structuredClone(snapshot)
const existing = addition.measures_publication_issue_page.find((x: any) => x.metadata?.publication_object_key === "undrifted_drift_report_006" && x.issue_id === issue.id)
const dispatch = addition.measures_publication_dispatch.find((x: any) => x.dispatch_key === existing.dispatch_key)
addition.measures_publication_issue_page.push({ ...structuredClone(existing), page_key: "controlled_new_page", dispatch_key: "controlled_new_dispatch", title: "Controlled new member", metadata: { ...existing.metadata, publication_object_key: "controlled_new_member" } })
addition.measures_publication_dispatch.push({ ...structuredClone(dispatch), dispatch_key: "controlled_new_dispatch", title: "Controlled new member", published_at: "2099-01-01T00:00:00Z", dispatch_body: "# Controlled fixture\n\n" + "A complete paragraph.\n\n".repeat(400), internal_route: "/controlled-fixture" })
const changed = await resolve(addition), ci = current(changed), recomposed = composeLivingIssue(changed, ci)
assert.equal(ci.objects.length, 9)
assert.equal(ci.deskLeads?.drift_report, "controlled_new_member")
assert.equal(recomposed.pages[recomposed.deskPositions.get("drift_report")!].objectId, "controlled_new_member")
const old = issue.objects.find(x => x.body)!
assert.equal(recomposed.pages[resolveReaderPosition(recomposed, null, old.id)].objectId, old.id)
const long = ci.objects.find(x => x.id === "controlled_new_member")!
assert.equal(continuationParts(long.body!).join(""), long.body)
fs.writeFileSync(output + "/controlled-addition-packet.json", JSON.stringify({ standing: "resolved", presentation: changed }, null, 2) + "\n")
const legacy = JSON.parse(fs.readFileSync("evidence/designpac/registry-fixture.json", "utf8"))
const legacyP = await resolve(legacy)
assert.throws(() => composeLivingIssue(legacyP, current(legacyP)), /governed_desk_lead_relation_conflict/)
const archive = { ...structuredClone(issue), active: false, archived: true, finalCover: p.brand.masthead, finalMembershipIds: issue.objects.map(x => x.id).reverse(), holds: [] }
assert.deepEqual(archiveIndex(archive)?.map(x => x.id), archive.finalMembershipIds)
assert.equal(archiveIndex({ ...archive, finalMembershipIds: ["missing"] }), null)
assert.equal(archiveIndex({ ...archive, finalCover: null }), null)
const privateWeb = structuredClone(snapshot); privateWeb.c3_pac.find((x: any) => x.pac_type === "c3WebPac").release_state = "private"
await assert.rejects(resolve(privateWeb), /webpac_public_renderer_held/)
const noBinding = structuredClone(snapshot); delete noBinding.c3_webpac_presentation_manifest[0].composition.designpac_runtime
await assert.rejects(resolve(noBinding), /designpac_runtime_binding_missing/)
let reads = 0
const unstable: ReadPublicationRows = async (table, select, filters) => { const rows = await readFixture(snapshot)(table, select, filters); return table === "measures_publication_issue_page" && ++reads > 1 ? rows.slice(1) : rows }
await assert.rejects(resolvePublicationPresentation(unstable, "lapis_chamber_encounter", "https://example.invalid"), /publication_changed_during_resolution/)
const report = { standing: "PASS", scope: "Current normalized Registry snapshot; all changed states are in-memory fixtures, zero Registry writes.", tests: ["normalized_authority_schema", "derived_cache_and_flags_non_authoritative", "release_feature_authority", "released_visible_membership", "registered_lineage_current_lead", "published_chronology_drift_lead", "live_cover_contents_positions", "full_body_continuation_exact", "controlled_addition_re_resolution", "identity_after_repagination", "unknown_schema_rule_fail_closed", "missing_ambiguous_chronology_held", "prior_hld_snapshot_preserved", "frozen_archive_fixture", "private_webpac_held", "missing_binding_held", "partial_change_held"], grammar: PAGE_GRAMMARS, currentIssue: issue.id, feature: issue.featureId, deskLeads: issue.deskLeads, members: issue.objects.map(x => x.id), pages: composed.pages.length, remainingHolds: p.holds }
fs.writeFileSync(output + "/resolved-presentation.json", JSON.stringify(p, null, 2) + "\n")
fs.writeFileSync(output + "/composition-validation.json", JSON.stringify(report, null, 2) + "\n")
console.log(JSON.stringify(report))
