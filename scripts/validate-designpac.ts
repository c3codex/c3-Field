import assert from "node:assert/strict"
import fs from "node:fs"
import { resolvePublicationPresentation, type ReadPublicationRows } from "../functions/_lib/publication-presentation"
import { archiveIndex, composeLivingIssue, continuationParts, orderedObjects, resolveReaderPosition, PAGE_GRAMMARS } from "../src/measures_registry/encounter_renderer/publications/designpacComposition"
const snapshot = JSON.parse(fs.readFileSync(process.argv[2] || "evidence/designpac/registry-fixture.json", "utf8"))
export const readFixture = (rows: typeof snapshot): ReadPublicationRows => async (table, _select, filters = {}) => (rows[table] || []).filter((row: Record<string, unknown>) => Object.entries(filters).every(([path, value]) => {
  const keys = path.split(/->>?/); let found: any = row
  for (const key of keys) found = found?.[key]
  return value.startsWith("eq.") ? String(found) === value.slice(3) : value.startsWith("in.(") && value.slice(4, -1).split(",").includes(String(found))
}))
const p = await resolvePublicationPresentation(readFixture(snapshot), "lapis_chamber_encounter", "https://zfihrspxvennjzazxcbj.supabase.co")
const issue = p.issues.find(x => x.active && !x.archived)!
assert.throws(() => composeLivingIssue(p, issue), /governed_desk_lead_relation_conflict/)
const composed = composeLivingIssue(p, { ...issue, holds: [] }) // Controlled normalized-relation fixture; never written to Registry.
assert.equal(new Set(composed.pages.map(x => x.key)).size, composed.pages.length)
assert.equal(issue.objects.length, 8)
assert.equal(composed.membership.length, issue.objects.length)
assert.deepEqual(new Set(composed.membership.map(x => x.id)), new Set(issue.objects.map(x => x.id)))
assert.equal(composed.membership[0].id, issue.featureId)
assert(p.holds.some(x => x.startsWith("published_runtime_body_missing:" + issue.featureId)))
assert(p.holds.some(x => x.startsWith("durable_article_route_missing:" + issue.featureId)))
for (const o of issue.objects.filter(x => x.body)) {
  assert.equal(continuationParts(o.body!).join(""), o.body)
  assert.equal(composed.pages.filter(x => x.objectId === o.id && !x.opening).map(x => x.body).join(""), o.body)
}
const original = structuredClone(p)
const changed = structuredClone(p), current = changed.issues.find(x => x.active && !x.archived)!
current.holds = []
const newArticle = { ...current.objects.find(x => x.body)!, id: "controlled_fixture_new_article", title: "Controlled fixture", order: null, publishedAt: "2099-01-01T00:00:00Z", route: "/controlled-fixture", body: "# Fixture\n\n" + "A complete paragraph.\n\n".repeat(400), holds: [] }
current.objects.push(newArticle)
const recomposed = composeLivingIssue(changed, current)
assert.equal(recomposed.membership.length, 9)
assert.equal(recomposed.pages[recomposed.deskPositions.get(newArticle.deskKey!)!].objectId, newArticle.id)
const oldObject = issue.objects.find(x => x.body)!
assert.equal(recomposed.pages[resolveReaderPosition(recomposed, null, oldObject.id)].objectId, oldObject.id)
assert.equal(continuationParts(newArticle.body).join(""), newArticle.body)
const explicit = [{ ...newArticle, order: 3 }, { ...oldObject, order: 1 }]
assert.equal(orderedObjects(explicit)[0].id, oldObject.id)
const archived = { ...structuredClone(issue), active: false, archived: true, finalCover: p.brand.masthead, finalMembershipIds: issue.objects.map(x => x.id).reverse(), holds: [] }
assert.deepEqual(archiveIndex(archived)?.map(x => x.id), archived.finalMembershipIds)
assert.equal(archiveIndex({ ...archived, finalMembershipIds: ["missing"] }), null)
assert.equal(archiveIndex({ ...archived, finalCover: null }), null)
assert.throws(() => composeLivingIssue(p, archived), /living_issue_required/)
assert.deepEqual(p, original)
const conflict = structuredClone(snapshot)
conflict.measures_publication_issue_page.find((x: any) => x.metadata?.publication_object_key === issue.featureId).metadata.featured_article = false
await assert.rejects(resolvePublicationPresentation(readFixture(conflict), "lapis_chamber_encounter", "https://example.invalid"), /governed_feature_relation_conflict/)
const privateWeb = structuredClone(snapshot); privateWeb.c3_pac.find((x: any) => x.pac_type === "c3WebPac").release_state = "private"
await assert.rejects(resolvePublicationPresentation(readFixture(privateWeb), "lapis_chamber_encounter", "https://example.invalid"), /webpac_public_renderer_held/)
const noBinding = structuredClone(snapshot); delete noBinding.c3_webpac_presentation_manifest[0].composition.designpac_runtime
await assert.rejects(resolvePublicationPresentation(readFixture(noBinding), "lapis_chamber_encounter", "https://example.invalid"), /designpac_runtime_binding_missing/)
let pageReads = 0
const unstable: ReadPublicationRows = async (table, select, filters) => {
  const rows = await readFixture(snapshot)(table, select, filters)
  return table === "measures_publication_issue_page" && ++pageReads > 1 ? rows.slice(1) : rows
}
await assert.rejects(resolvePublicationPresentation(unstable, "lapis_chamber_encounter", "https://example.invalid"), /publication_changed_during_resolution/)
const report = { standing: "PASS", tests: ["live_eligibility_and_exact_membership", "registrar_feature_relation", "missing_private_body_and_route_explicit", "full_body_continuation_exact", "new_eligible_member_recomposition", "object_identity_after_repagination", "explicit_ordering", "archive_frozen_index", "no_fabricated_archive", "no_input_mutation", "conflict_fail_closed", "private_webpac_fail_closed", "missing_binding_fail_closed", "partial_publication_change_fail_closed"], grammar: PAGE_GRAMMARS, livePages: composed.pages.length, currentIssue: issue.id, membership: issue.objects.map(x => x.id), holds: p.holds }
fs.mkdirSync("evidence/designpac", { recursive: true })
fs.writeFileSync("evidence/designpac/resolved-presentation.json", JSON.stringify(p, null, 2) + "\n")
fs.writeFileSync("evidence/designpac/composition-validation.json", JSON.stringify(report, null, 2) + "\n")
console.log(JSON.stringify(report))
