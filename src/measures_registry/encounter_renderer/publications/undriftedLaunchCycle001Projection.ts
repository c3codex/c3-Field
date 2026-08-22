import fieldFindingsMarkdown from "../../../../Assets/Articles/unDrifted/LaunchCycle001/registered/field_findings_2026_w28_public_article_v2.md?raw"
import responseMarkdown from "../../../../Assets/Articles/unDrifted/LaunchCycle001/registered/undrifted_response_001_ai_agents_are_not_entering_empty_systems_article_v1.md?raw"
import boundaryProblemMarkdown from "../../../../Assets/Articles/unDrifted/Issue002/registered/drift_report_002_the_boundary_problem_v1.md?raw"
import environmentallyEnabledMarkdown from "../../../../Assets/Articles/unDrifted/Issue002/registered/drift_report_003_environmentally_enabled_v1.md?raw"
import pairOverTimeMarkdown from "../../../../Assets/Articles/unDrifted/Issue002/registered/mapped_measured_002_the_pair_over_time_v1.md?raw"

export type UndriftedLaunchCycleArticle = {
  publicationId: string
  assetId: string
  title: string
  subtitle: string | null
  issueLabel: string
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
  issueExcerpt: string
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
    assetId: "field_findings_2026_w28_public_article_v2",
    title: "Field Findings 2026-W28",
    subtitle: "Weekly observations from the Field, July 4-10, 2026.",
    issueLabel: "Launch Cycle 001",
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
      "Assets/Articles/unDrifted/LaunchCycle001/registered/field_findings_2026_w28_public_article_v2.md",
    publicationRecordPath: "docs/_source/codex/publications/publication_record_001_field_findings_2026_w28.meta.md",
    sourceOar2:
      "docs/oar/measures_registry/oar2_immediately_contain_codex_governance_leak_and_restore_publication_boundary_v1.meta.md",
    issueExcerpt:
      "unDrifted Field Findings, 2026-W28 (July 4-10). Sweep classification: Convergence. Sources: Carnegie Endowment, The Register, Google Cloud, CSA/Zenity, NIST/CAISI. Central finding: organizations are assigning autonomous capability faster than they're building the operational environments to govern it.",
    bodyMarkdown: stripFrontmatter(fieldFindingsMarkdown),
  },
  {
    publicationId: "publication_002",
    assetId: "undrifted_response_001",
    title: "AI Agents Are Not Entering Empty Systems",
    subtitle: "unDrifted Response 001.",
    issueLabel: "Launch Cycle 001",
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
    issueExcerpt:
      'unDrifted Response 001: "AI Agents Are Not Entering Empty Systems." A response to Field Findings 2026-W28, arguing that agent security failures are, underneath, environmental governance failures - and that the environment has to be measured before autonomous capability is assigned within it.',
    bodyMarkdown: stripFrontmatter(responseMarkdown),
    dependencyRoutePath: "/undrifted/field-findings-2026-w28",
    dependencyLabel: "Field Findings 2026-W28",
  },
  {
    publicationId: "drift_report_002",
    assetId: "drift_report_002_the_boundary_problem_v1",
    title: "The Boundary Problem",
    subtitle: "When capability becomes consequential",
    issueLabel: "Issue 002 / Drift Report",
    routePath: "/undrifted/the-boundary-problem",
    paragraphSlug: "the-boundary-problem",
    paragraphUrl: "https://paragraph.com/@undrifted/the-boundary-problem",
    authorName: "unDrifted Editorial",
    authorSlug: "undrifted-editorial",
    publicationDate: "2026-08-22",
    publicationLabel: "Drift Report 002",
    bannerUrl: `${SUPABASE_PUBLIC_STORAGE}/undrifted/issues/issue-002/drift-report-002/paragraph/drift_report_002_boundary_problem_banner_2000x1000_v1.webp`,
    bannerAlt: "Drift Report 002 - The Boundary Problem",
    canonicalAssetPath: "Assets/Articles/unDrifted/Issue002/registered/drift_report_002_the_boundary_problem_v1.md",
    publicationRecordPath:
      "CanCom/codex/oar2_correct_undrifted_issue002_storage_and_resume_codex_v5",
    sourceOar2:
      "CanCom/codex/oar2_correct_undrifted_issue002_storage_and_resume_codex_v5",
    issueExcerpt:
      "Drift Report 002 examines capability, authority, execution boundaries, and why useful AI needs governed passage before capability becomes consequence.",
    bodyMarkdown: stripFrontmatter(boundaryProblemMarkdown),
  },
  {
    publicationId: "drift_report_003",
    assetId: "drift_report_003_environmentally_enabled_v1",
    title: "Environmentally Enabled",
    subtitle: "When the agent acts, who built the conditions that made the action possible?",
    issueLabel: "Issue 002 / Drift Report",
    routePath: "/undrifted/environmentally-enabled",
    paragraphSlug: "environmentally-enabled",
    paragraphUrl: "https://paragraph.com/@undrifted/environmentally-enabled",
    authorName: "unDrifted Editorial",
    authorSlug: "undrifted-editorial",
    publicationDate: "2026-08-22",
    publicationLabel: "Drift Report 003",
    bannerUrl: `${SUPABASE_PUBLIC_STORAGE}/undrifted/issues/issue-002/drift-report-003/paragraph/drift_report_003_environmentally_enabled_banner_2000x1000_v1.webp`,
    bannerAlt: "Drift Report 003 - Environmentally Enabled",
    canonicalAssetPath: "Assets/Articles/unDrifted/Issue002/registered/drift_report_003_environmentally_enabled_v1.md",
    publicationRecordPath:
      "CanCom/codex/oar2_correct_undrifted_issue002_storage_and_resume_codex_v5",
    sourceOar2:
      "CanCom/codex/oar2_correct_undrifted_issue002_storage_and_resume_codex_v5",
    issueExcerpt:
      "Drift Report 003 asks what made the action possible, locating agent behavior inside inherited permissions, monitoring boundaries, and effect-capable environments.",
    bodyMarkdown: stripFrontmatter(environmentallyEnabledMarkdown),
  },
  {
    publicationId: "mapped_measured_002",
    assetId: "mapped_measured_002_the_pair_over_time_v1",
    title: "The Pair Over Time",
    subtitle: "What one paper about AI scientists made us notice about eighteen months of human-AI work",
    issueLabel: "Issue 002 / Mapped & Measured",
    routePath: "/undrifted/the-pair-over-time",
    paragraphSlug: "the-pair-over-time",
    paragraphUrl: "https://measuresregistry.com/undrifted/the-pair-over-time",
    authorName: "unDrifted Editorial",
    authorSlug: "undrifted-editorial",
    publicationDate: "2026-08-20",
    publicationLabel: "Mapped & Measured 002",
    bannerUrl: `${SUPABASE_PUBLIC_STORAGE}/undrifted/issues/issue-002/mapped-measured-002/paragraph/mapped_measured_002_pair_over_time_banner_2000x1000_v1.webp`,
    bannerAlt: "Mapped & Measured 002 - The Pair Over Time",
    canonicalAssetPath:
      "Assets/Articles/unDrifted/Issue002/registered/mapped_measured_002_the_pair_over_time_v1.md",
    publicationRecordPath:
      "docs/_source/codex/publications/publication_record_mapped_measured_002_the_pair_over_time.meta.md",
    sourceOar2:
      "CanCom/codex/mapped_measured_002_pair_over_time/oar2_register_publish_mapped_measured_002_pair_over_time_codex_v1",
    issueExcerpt:
      "Mapped & Measured 002: an exploratory reflection on the human-agent pair over time, preserving the Method & Scope boundary and treating longitudinal interaction records as hypothesis-generating provenance rather than proof of causation.",
    bodyMarkdown: stripFrontmatter(pairOverTimeMarkdown),
  },
]

export function launchCycleArticleForPath(pathname: string): UndriftedLaunchCycleArticle | null {
  const normalized = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname
  return UNDRIFTED_LAUNCH_CYCLE_001_ARTICLES.find((article) => article.routePath === normalized) ?? null
}
