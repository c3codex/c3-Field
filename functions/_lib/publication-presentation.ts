import type { PublicationPresentation, PublicationIssue, PublicationObject, PublicationMedia } from "../../src/shared/publicationPresentation"
import { orderedPublicationObjects } from "../../src/shared/publicationOrdering"
export type Row = Record<string, any>
export type ReadPublicationRows = (table: string, select: string, filters?: Record<string, string>) => Promise<Row[]>
const record = (v: unknown): Row => v && typeof v === "object" && !Array.isArray(v) ? v as Row : {}
const string = (v: unknown): string | null => typeof v === "string" && v.trim() ? v.trim() : null
const one = (rows: Row[], predicate: string): Row => { if (rows.length !== 1) throw new Error(predicate); return rows[0] }
function key(v: unknown): string { const s = string(v); if (!s || !/^[a-z0-9_.:-]+$/i.test(s)) throw new Error("registered_identifier_missing"); return s }
function publicHref(v: unknown): string | null {
  const s = string(v); if (!s) return null
  if (s.startsWith("/") && !s.startsWith("//")) return s
  try { return new URL(s).protocol === "https:" ? s : null } catch { return null }
}
function media(url: unknown, role: string, title: string, assetKey: unknown): PublicationMedia | null {
  const href = publicHref(url); return href ? { url: href, role, alt: title, assetKey: string(assetKey) } : null
}

// Resolves only explicitly public WebPACs and already released members. No source custody
// text is fetched, no release standing is created, and no provider call writes state.
export async function resolvePublicationPresentation(read: ReadPublicationRows, surface: string, storageBase: string): Promise<PublicationPresentation> {
  const assignment = one(await read("measures_encounter_surface_assignment", "registry_key,public_routes,metadata", { surface_key: "eq." + key(surface) }), "publication_surface_missing")
  if (record(assignment.metadata).deprecated_surface === true) throw new Error("publication_surface_deprecated")
  const publicationKey = key(assignment.registry_key)
  const manifest = one(await read("c3_webpac_presentation_manifest", "*", { "composition->>publication_key": "eq." + publicationKey }), "webpac_manifest_ambiguous")
  const contract = record(record(manifest.composition).designpac_runtime)
  if (contract.version !== "designpac_v1") throw new Error("designpac_runtime_binding_missing")
  const [web, brand, design, pub, publication, pages, releases, dispatches, members, bindings] = await Promise.all([
    read("c3_pac", "pac_key,pac_type,is_effective,release_state,execution_authority_state,standing,source_authority,metadata", { pac_key: "eq." + key(manifest.pac_key) }),
    read("c3_pac", "pac_key,pac_type,is_effective,release_state,standing", { pac_key: "eq." + key(contract.brandpac_key) }),
    read("c3_pac", "pac_key,pac_type,is_effective,standing,metadata", { pac_key: "eq." + key(contract.designpac_key) }),
    read("c3_pac", "pac_key,pac_type,is_effective,standing", { pac_key: "eq." + key(contract.pubpac_key) }),
    read("measures_publication_registry", "publication_key,title,status,metadata", { publication_key: "eq." + publicationKey }),
    read("measures_publication_issue_page", "*", { publication_key: "eq." + publicationKey }),
    read("measures_publication_release", "*", { is_active: "eq.true" }),
    read("measures_publication_dispatch", "dispatch_key,title,dispatch_body,excerpt,internal_route,external_url,article_url,published_at,status,media_manifest,metadata", { publication_key: "eq." + publicationKey, status: "eq.published" }),
    read("c3_pac_member", "member_key,member_role,standing,runtime_binding_key", { pac_key: "eq." + key(contract.brandpac_key), standing: "eq.active" }),
    read("c3_pac_runtime_binding", "binding_key,standing,runtime_uri,bucket_name,object_path", { pac_key: "eq." + key(contract.brandpac_key), standing: "eq.active" }),
  ])
  const w = one(web, "webpac_missing"), b = one(brand, "brandpac_missing"), d = one(design, "designpac_missing"), p = one(pub, "pubpac_missing"), pr = one(publication, "publication_identity_missing")
  const wm=record(w.metadata)
  const registeredProjectionRelease=w.release_state==="public_release_authorized"&&w.source_authority==="registry://c3_webpac_presentation_manifest/"+manifest.manifest_key&&wm.presentation_manifest_key===manifest.manifest_key&&wm.publication_key===publicationKey&&wm.renderer_identity===contract.renderer_identity&&wm.source_pubpac_key===p.pac_key&&wm.native_environment==="env_undrifted_publication"&&wm.native_publication_route==="/undrifted"
  if (w.pac_type !== "c3WebPac" || w.is_effective !== true || (w.release_state !== "public"&&!registeredProjectionRelease) || w.execution_authority_state !== "bounded_renderer") throw new Error("webpac_public_renderer_held")
  if (b.pac_type !== "BrandPac" || b.is_effective !== true || b.release_state !== "public") throw new Error("brandpac_public_visual_held")
  if (d.pac_type !== "DesignPac" || d.is_effective !== true || d.standing !== "registered_complete" || record(d.metadata).component_count !== 8) throw new Error("designpac_authority_held")
  if (p.pac_type !== "PubPac" || p.is_effective !== true) throw new Error("pubpac_source_held")
  const sourceRelation = one(await read("c3_pac_relation", "target_key", { source_pac_key: "eq." + key(w.pac_key), relation_type: "eq.source_package", standing: "eq.active" }), "pubpac_relation_missing")
  if (sourceRelation.target_key !== p.pac_key) throw new Error("pubpac_source_mismatch")
  const title = string(pr.title), routes = Array.isArray(assignment.public_routes) ? assignment.public_routes : []
  if (pr.status !== "published" || !title || routes.length !== 1 || !publicHref(routes[0])) throw new Error("publication_identity_or_route_missing")
  const homeRoute = routes[0] as string, pm = record(pr.metadata), copy = record(pm.brand_copy)
  const desks = (Array.isArray(pm.editorial_sections) ? pm.editorial_sections : []).map((x: Row) => ({ id: key(x.key), title: string(x.title) }))
  if (!desks.length || desks.some(x => !x.title) || new Set(desks.map(x => x.id)).size !== desks.length) throw new Error("registered_desk_identity_missing")
  const mastheadMember = one(members.filter(x => x.member_key === contract.masthead_member_key && x.member_role === "primary_visual_identity"), "brandpac_masthead_missing")
  const mastheadBinding = one(bindings.filter(x => x.binding_key === mastheadMember.runtime_binding_key), "brandpac_masthead_runtime_missing")
  const storageUrl = (x: Row) => x.runtime_uri || (x.bucket_name && x.object_path ? storageBase + "/storage/v1/object/public/" + encodeURIComponent(x.bucket_name) + "/" + x.object_path.split("/").map(encodeURIComponent).join("/") : null)
  const masthead = media(storageUrl(mastheadBinding), "primary_visual_identity", title, mastheadMember.member_key)
  if (!masthead) throw new Error("brandpac_masthead_runtime_missing")
  const issueIds = new Set(pages.map(x => x.issue_id))
  const assetKeys = [...new Set(pages.filter(x => x.asset_id).map(x => key(x.asset_id)))]
  const classifications = assetKeys.length ? await read("c3ops_asset_record", "asset_key,asset_type,asset_class", { asset_key: "in.(" + assetKeys.join(",") + ")" }) : []
  const eligibleReleases = releases.filter(x => issueIds.has(x.issue_id) && x.renderer_eligibility === true && x.publication_state !== "pending_content_authority_decision")
  const active = eligibleReleases.filter(x => x.active_issue === true && x.archive_state !== "archived")
  if (active.length !== 1) throw new Error("current_issue_ambiguous")
  const issues: PublicationIssue[] = eligibleReleases.map(release => {
    const rm = record(release.metadata), eligible = pages.filter(x => x.issue_id === release.issue_id && x.release_state === "released" && x.visibility_state === "visible")
    const schema = record(rm.authority_schema_v1)
    const normalized = Object.keys(schema).length > 0
    if (normalized && (schema.feature_authority !== "featured_article_object_key" || schema.desk_lead_authority !== "desk_resolution_rule" || schema.issue_membership_authority !== "released_visible_issue_page_relations" || schema.legacy_pointer_disposition !== "derived_cache_evidence_only")) throw new Error("publication_authority_schema_unresolved")
    const objects: PublicationObject[] = eligible.flatMap(page => {
      const m = record(page.metadata), dispatch = dispatches.find(x => x.dispatch_key === page.dispatch_key)
      // Cover/contents/navigation slots are grammar, not extra editorial objects.
      if (!page.asset_id && !page.dispatch_key && !m.publication_object_key) return []
      const id = string(m.publication_object_key) || string(record(dispatch?.metadata).publication_object_key) || string(page.dispatch_key) || string(page.asset_id)
      if (!id || !string(page.title)) throw new Error("publication_object_identity_missing")
      const visual = m.object_format === "current_state_comic"
      const classification = classifications.find(x => x.asset_key === page.asset_id)
      const kind: PublicationObject["kind"] = visual ? "visual" : dispatch || classification?.asset_type === "publication_article" ? "article" : "unresolved"
      const body = typeof dispatch?.dispatch_body === "string" && dispatch.dispatch_body.trim() ? dispatch.dispatch_body as string : null
      const dispatchRoute = publicHref(dispatch?.internal_route) || publicHref(dispatch?.article_url) || publicHref(dispatch?.external_url)
      const route = dispatch && normalized ? dispatchRoute : dispatchRoute || publicHref(m.external_url)
      const objectMedia = [media(m.media_url, "publication_media", page.title, page.banner_asset_id), media(m.mapped_media_url, "mapped_media", page.title, m.mapped_media_asset_key)].filter((x): x is PublicationMedia => !!x)
      const holds: string[] = []
      if (kind === "unresolved") holds.push("governed_object_classification_missing:" + id)
      if (!visual && !body) holds.push("published_runtime_body_missing:" + id)
      if (!visual && (!route || route.replace(/\/$/, "") === homeRoute.replace(/\/$/, ""))) holds.push("durable_article_route_missing:" + id)
      const deskKey = string(m.desk_key)
      if (release.active_issue && (!deskKey || !desks.some(x => x.id === deskKey))) throw new Error("object_desk_relation_missing")
      return [{ id, title: page.title, deskKey, kind, route: visual ? null : route, body, excerpt: string(dispatch?.excerpt) || string(page.subtitle), publishedAt: string(dispatch?.published_at) || (normalized ? null : string(page.created_at)), order: typeof m.publication_order === "number" ? m.publication_order : null, lineagePosition: typeof m.lineage_position === "number" ? m.lineage_position : null, media: objectMedia, holds }]
    })
    if (new Set(objects.map(x => x.id)).size !== objects.length) throw new Error("publication_object_duplicate")
    const featureId = string(rm.featured_article_object_key)
    if (release.active_issue) {
      const flags = eligible.filter(x => record(x.metadata).featured_article === true).map(x => string(record(x.metadata).publication_object_key))
      if (!featureId || !objects.some(x => x.id === featureId) || (!normalized && (flags.length !== 1 || flags[0] !== featureId))) throw new Error("governed_feature_relation_conflict")
    }
    const frozen = record(rm.archival_final_state)
    const finalIds = Array.isArray(frozen.membership_ids) && frozen.membership_ids.every((x: unknown) => typeof x === "string") ? frozen.membership_ids as string[] : null
    const finalCover = media(frozen.cover_url, "frozen_issue_cover", string(rm.issue_label) || release.issue_id, frozen.cover_asset_key)
    const issueHolds = release.archive_state === "archived" && (!finalIds || !finalCover) ? ["frozen_archive_cover_or_membership_missing:" + release.issue_id] : []
    const deskLeads: Record<string, string> = {}
    if (release.active_issue) for (const desk of desks) {
      if (normalized) {
        const rule = rm[desk.id + "_desk_resolution"] || rm.desk_resolution_rule
        if (!["newest_eligible_current_issue_article_excluding_featured_relation", "newest_eligible_current_issue_object"].includes(rule)) throw new Error("registered_desk_resolution_rule_unsupported")
        const pool = objects.filter(x => x.deskKey === desk.id && x.id !== featureId && (rule === "newest_eligible_current_issue_object" || x.kind === "article"))
        const ordered = orderedPublicationObjects(pool)
        const missingChronology = pool.some(x => x.order === null && !x.publishedAt && !(x.kind === "visual" && x.lineagePosition != null))
        const first = ordered[0], second = ordered[1]
        const ambiguous = first && second && (first.order !== null || second.order !== null ? first.order === second.order : first.kind === "visual" && second.kind === "visual" && first.lineagePosition != null && second.lineagePosition != null ? first.lineagePosition === second.lineagePosition : first.publishedAt === second.publishedAt)
        if (missingChronology) issueHolds.push("desk_lead_chronology_missing:" + desk.id)
        else if (ambiguous) issueHolds.push("desk_lead_chronology_ambiguous:" + desk.id)
        else if (first) deskLeads[desk.id] = first.id
        continue
      }
      const registeredLead = string(rm[desk.id + "_desk_object_key"])
      const ordinary = objects.filter(x => x.deskKey === desk.id && x.id !== featureId)
      const explicitOrder = ordinary.some(x => x.order !== null)
      const newest = [...ordinary].sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || "") || a.id.localeCompare(b.id))[0]
      if (registeredLead && (!ordinary.some(x => x.id === registeredLead) || (!explicitOrder && newest?.id !== registeredLead))) issueHolds.push("desk_lead_relation_conflict:" + desk.id)
    }
    if (finalIds && (new Set(finalIds).size !== finalIds.length || finalIds.some(id => !objects.some(x => x.id === id)))) issueHolds.push("frozen_archive_member_unresolved:" + release.issue_id)
    return { id: release.issue_id, label: string(rm.issue_label) || (string(rm.issue_number) ? "Issue " + rm.issue_number : release.issue_id), date: string(rm.issue_date), active: release.active_issue === true, archived: release.archive_state === "archived", featureId, objects, ...(normalized ? { deskLeads, authoritySchema: { featureAuthority: schema.feature_authority, deskLeadAuthority: schema.desk_lead_authority, legacyPointerDisposition: schema.legacy_pointer_disposition } } : {}), finalCover, finalMembershipIds: finalIds, holds: issueHolds }
  })
  // Recheck the governing relation after the parallel reads. Partial changes fail closed.
  const releaseAfter = one(await read("measures_publication_release", "metadata,updated_at", { release_id: "eq." + key(active[0].release_id) }), "current_release_missing")
  if (JSON.stringify(releaseAfter.metadata) !== JSON.stringify(active[0].metadata) || releaseAfter.updated_at !== active[0].updated_at) throw new Error("publication_changed_during_resolution")
  const pagesAfter = await read("measures_publication_issue_page", "*", { publication_key: "eq." + publicationKey })
  const stablePages = (rows: Row[]) => JSON.stringify([...rows].sort((a, b) => String(a.page_key).localeCompare(String(b.page_key))))
  if (stablePages(pagesAfter) !== stablePages(pages)) throw new Error("publication_changed_during_resolution")
  const tokens = record(record(pm.style_contract).tokens)
  if (!Object.keys(tokens).length || Object.keys(tokens).some(x => !/^--undrifted-[a-z-]+$/.test(x) || typeof tokens[x] !== "string")) throw new Error("registered_visual_tokens_missing")
  return { version: "designpac_v1", observedAt: new Date().toISOString(), rendererIdentity: key(contract.renderer_identity), publication: { id: publicationKey, title, homeRoute, canonicalUrl: "https://" + manifest.canonical_host + manifest.canonical_path, slogan: string(copy.primary_line), principles: string(copy.principles_line), footer: [string(record(pm.footer_record).footer_line_1), string(record(pm.footer_record).footer_line_2)].filter((x): x is string => !!x) }, authority: { webpac: w.pac_key, pubpac: p.pac_key, brandpac: b.pac_key, designpac: d.pac_key, pubpacStanding: p.standing, designComponents: record(d.metadata).drive_component_ids }, brand: { masthead, tokens }, desks: desks as { id: string; title: string }[], issues, holds: issues.flatMap(x => [...x.holds, ...x.objects.flatMap(o => o.holds)]) }
}
