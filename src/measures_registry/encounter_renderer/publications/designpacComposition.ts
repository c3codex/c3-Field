import { marked } from "marked"
import type { PublicationIssue, PublicationObject, PublicationPresentation } from "@/shared/publicationPresentation"
import { orderedPublicationObjects } from "@/shared/publicationOrdering"

export const PAGE_GRAMMARS = ["issue_cover", "live_contents", "feature_opening_spread", "desk_section_lead_spread", "standard_article_spread", "visual_interstitial_spread", "article_continuation", "closing_back_cover"] as const
export type PageGrammar = typeof PAGE_GRAMMARS[number]
export type MagazinePage = { key: string; grammar: PageGrammar; objectId: string | null; deskId: string | null; body: string | null; part: number; opening: boolean }
export type IssueComposition = { pages: MagazinePage[]; objectPositions: Map<string, number>; deskPositions: Map<string, number>; membership: PublicationObject[] }

// Group complete Markdown blocks; never truncate content or split a semantic block.
// Any lexer normalization falls back to one flowing body with the original bytes.
export function continuationParts(body: string, capacity = 1900): string[] {
  const raw = marked.lexer(body).map(token => token.raw)
  if (raw.join("") !== body) return [body]
  const parts: string[] = []; let current = ""
  for (const block of raw) {
    if (current && current.length + block.length > capacity) { parts.push(current); current = "" }
    current += block
  }
  if (current) parts.push(current)
  return parts.length ? parts : [body]
}

export const orderedObjects = orderedPublicationObjects

export function orderedDeskObjects(issue: PublicationIssue, deskId: string): PublicationObject[] {
  const members = orderedObjects(issue.objects.filter(x => x.deskKey === deskId && x.id !== issue.featureId))
  const leadId = issue.deskLeads?.[deskId]
  if (leadId) {
    const index = members.findIndex(x => x.id === leadId)
    if (index < 0) throw new Error("governed_desk_lead_member_missing")
    members.unshift(...members.splice(index, 1))
  }
  return members
}

export function composeLivingIssue(p: PublicationPresentation, issue: PublicationIssue): IssueComposition {
  if (!issue.active || issue.archived) throw new Error("living_issue_required")
  if (issue.holds.some(x => x.startsWith("desk_lead_relation_conflict:"))) throw new Error("governed_desk_lead_relation_conflict")
  if (issue.holds.some(x => x.startsWith("desk_lead_chronology_"))) throw new Error("governed_desk_lead_chronology_unresolved")
  if (issue.objects.some(x => x.kind === "unresolved")) throw new Error("governed_object_classification_missing")
  const feature = issue.objects.find(x => x.id === issue.featureId)
  if (!feature || new Set(issue.objects.map(x => x.id)).size !== issue.objects.length) throw new Error("eligible_feature_or_membership_missing")
  const pages: MagazinePage[] = []
  const objectPositions = new Map<string, number>(), deskPositions = new Map<string, number>()
  const add = (grammar: PageGrammar, object: PublicationObject | null, deskId: string | null, body: string | null = null, part = 0, opening = true) => {
    pages.push({ key: [issue.id, grammar, object?.id || deskId || "issue", opening ? "opening" : "body", part].join(":"), grammar, objectId: object?.id || null, deskId, body, part, opening })
  }
  const article = (object: PublicationObject, opening: PageGrammar) => {
    objectPositions.set(object.id, pages.length); add(opening, object, object.deskKey)
    if (object.body) continuationParts(object.body).forEach((body, part) => add(part ? "article_continuation" : "standard_article_spread", object, object.deskKey, body, part, false))
  }
  add("issue_cover", null, null); add("live_contents", null, null)
  article(feature, "feature_opening_spread")
  const membership = [feature]
  for (const desk of p.desks) {
    const members = orderedDeskObjects(issue, desk.id)
    if (!members.length && feature.deskKey !== desk.id) continue
    deskPositions.set(desk.id, pages.length)
    if (!members.length) add("desk_section_lead_spread", null, desk.id)
    members.forEach((object, index) => {
      membership.push(object)
      article(object, index === 0 ? "desk_section_lead_spread" : object.kind === "visual" ? "visual_interstitial_spread" : "standard_article_spread")
    })
  }
  if (membership.length !== issue.objects.length) throw new Error("eligible_desk_membership_unresolved")
  add("closing_back_cover", null, null)
  return { pages, objectPositions, deskPositions, membership }
}

export function resolveReaderPosition(composition: IssueComposition, pageKey: string | null, objectId: string | null): number {
  const exact = pageKey ? composition.pages.findIndex(x => x.key === pageKey) : -1
  return exact >= 0 ? exact : objectId ? composition.objectPositions.get(objectId) ?? 0 : 0
}

export function archiveIndex(issue: PublicationIssue): PublicationObject[] | null {
  if (!issue.archived || !issue.finalCover || !issue.finalMembershipIds || issue.holds.length) return null
  if (new Set(issue.finalMembershipIds).size !== issue.finalMembershipIds.length) return null
  const members = issue.finalMembershipIds.map(id => issue.objects.find(x => x.id === id))
  return members.some(x => !x) ? null : members as PublicationObject[]
}
