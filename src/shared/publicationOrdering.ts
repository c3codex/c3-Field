import type { PublicationObject } from "./publicationPresentation"

// Publication order is registered state. Visual component lineage supplies its
// registered sequence; row insertion time and object spelling do not choose a lead.
export function orderedPublicationObjects(objects: PublicationObject[]): PublicationObject[] {
  return [...objects].sort((a, b) => {
    if (a.order !== null || b.order !== null) return (a.order ?? Infinity) - (b.order ?? Infinity) || a.id.localeCompare(b.id)
    if (a.kind === "visual" && b.kind === "visual" && a.lineagePosition != null && b.lineagePosition != null) return b.lineagePosition - a.lineagePosition || a.id.localeCompare(b.id)
    return (b.publishedAt || "").localeCompare(a.publishedAt || "") || a.id.localeCompare(b.id)
  })
}
