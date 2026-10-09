// Public projection types. Every content identity and relationship is supplied by Registry.
export type PublicationMedia = { url: string; role: string; alt: string; assetKey: string | null }
export type PublicationObject = {
  id: string; title: string; deskKey: string | null; kind: "article" | "visual" | "unresolved";
  route: string | null; body: string | null; excerpt: string | null;
  publishedAt: string | null; order: number | null; media: PublicationMedia[];
  lineagePosition?: number | null;
  holds: string[];
}
export type PublicationIssue = {
  id: string; label: string; date: string | null; active: boolean; archived: boolean;
  featureId: string | null; objects: PublicationObject[];
  deskLeads?: Record<string, string>;
  authoritySchema?: { featureAuthority: string; deskLeadAuthority: string; legacyPointerDisposition: string };
  finalCover: PublicationMedia | null; finalMembershipIds: string[] | null;
  holds: string[];
}
export type PublicationPresentation = {
  version: "designpac_v1"; observedAt: string; rendererIdentity: string;
  publication: { id: string; title: string; homeRoute: string; canonicalUrl: string; slogan: string | null; principles: string | null; footer: string[] };
  authority: { webpac: string; pubpac: string; brandpac: string; designpac: string; pubpacStanding: string; designComponents: string[] };
  brand: { masthead: PublicationMedia; tokens: Record<string, string> };
  desks: { id: string; title: string }[]; issues: PublicationIssue[]; holds: string[];
}
