import fieldFindingsMarkdown from "../../../../Assets/Articles/unDrifted/LaunchCycle001/registered/undrifted_field_findings_2026_w28_article_v1.md?raw"
import responseMarkdown from "../../../../Assets/Articles/unDrifted/LaunchCycle001/registered/undrifted_response_001_ai_agents_are_not_entering_empty_systems_article_v1.md?raw"

export type UndriftedLaunchCycleArticle = {
  publicationId: "publication_001" | "publication_002"
  assetId: string
  title: string
  subtitle: string | null
  routePath: string
  paragraphSlug: string
  paragraphUrl: string
  authorName: string
  authorSlug: string
  publicationDate: string
  publicationLabel: string
  bannerUrl: string
  bannerAlt: string
  canonicalAssetPath: string
  publicationRecordPath: string
  sourceOar2: string
  bodyMarkdown: string
  dependencyRoutePath?: string
  dependencyLabel?: string
}

const SUPABASE_PUBLIC_STORAGE =
  "https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry"

function stripFrontmatter(markdown: string): string {
  if (!markdown.startsWith("---")) return markdown.trim()
  const end = markdown.indexOf("\n---", 3)
  if (end === -1) return markdown.trim()
  return markdown.slice(end + 4).trim()
}

// Launch bridge projection only. Canonical text remains in the registered article
// files imported above; routes and metadata mirror the seated publication records.
export const UNDRIFTED_LAUNCH_CYCLE_001_ARTICLES: UndriftedLaunchCycleArticle[] = [
  {
    publicationId: "publication_001",
    assetId: "undrifted_field_findings_2026_w28",
    title: "Field Findings 2026-W28",
    subtitle: "Weekly observations from the Field, July 4-10, 2026.",
    routePath: "/undrifted/field-findings-2026-w28",
    paragraphSlug: "field-findings-2026-w28",
    paragraphUrl: "https://paragraph.com/@undrifted/field-findings-2026-w28",
    authorName: "unDrifted Editorial",
    authorSlug: "undrifted-editorial",
    publicationDate: "2026-07-13",
    publicationLabel: "Publication Record 001",
    bannerUrl: `${SUPABASE_PUBLIC_STORAGE}/field_findings_section_banner_2026_w28_v1.webp`,
    bannerAlt: "Field Findings Section Banner",
    canonicalAssetPath:
      "Assets/Articles/unDrifted/LaunchCycle001/registered/undrifted_field_findings_2026_w28_article_v1.md",
    publicationRecordPath: "docs/_source/codex/publications/publication_record_001_field_findings_2026_w28.meta.md",
    sourceOar2:
      "docs/oar/measures_registry/oar2_publish_launch_cycle_001_articles_and_project_undrifted_release_v1.meta.md",
    bodyMarkdown: stripFrontmatter(fieldFindingsMarkdown),
  },
  {
    publicationId: "publication_002",
    assetId: "undrifted_response_001",
    title: "AI Agents Are Not Entering Empty Systems",
    subtitle: "unDrifted Response 001.",
    routePath: "/undrifted/ai-agents-are-not-entering-empty-systems",
    paragraphSlug: "ai-agents-are-not-entering-empty-systems",
    paragraphUrl: "https://paragraph.com/@undrifted/ai-agents-are-not-entering-empty-systems",
    authorName: "unDrifted Editorial",
    authorSlug: "undrifted-editorial",
    publicationDate: "2026-07-13",
    publicationLabel: "Publication Record 002",
    bannerUrl: `${SUPABASE_PUBLIC_STORAGE}/undrifted_response_section_banner_2026_w28_v1.webp`,
    bannerAlt: "unDrifted Response Section Banner",
    canonicalAssetPath:
      "Assets/Articles/unDrifted/LaunchCycle001/registered/undrifted_response_001_ai_agents_are_not_entering_empty_systems_article_v1.md",
    publicationRecordPath: "docs/_source/codex/publications/publication_record_002_undrifted_response_001.meta.md",
    sourceOar2:
      "docs/oar/measures_registry/oar2_publish_launch_cycle_001_articles_and_project_undrifted_release_v1.meta.md",
    bodyMarkdown: stripFrontmatter(responseMarkdown),
    dependencyRoutePath: "/undrifted/field-findings-2026-w28",
    dependencyLabel: "Field Findings 2026-W28",
  },
]

export function launchCycleArticleForPath(pathname: string): UndriftedLaunchCycleArticle | null {
  const normalized = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname
  return UNDRIFTED_LAUNCH_CYCLE_001_ARTICLES.find((article) => article.routePath === normalized) ?? null
}
