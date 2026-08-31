import { useEffect } from "react"
import OarOperationsConsole from "../c3_field_convergence/OarOperationsConsole"
import { supabase, supabaseConfigError } from "../integrations/supabase/client"
import Temple from "../measures_of_inanna/Temple"
import MeasuresRegistryRuntime from "../measures_registry/encounter_renderer/MeasuresRegistryOrchestrator"

type PageMetadata = {
  title: string
  description: string
  url: string
  canonicalUrl?: string
  ogUrl?: string
  rss?: {
    title: string
    href: string
  }
  image: string
  type: string
}

const REGISTRY_METADATA: PageMetadata = {
  title: "Measures Registry",
  description: "Computational Systems Governance. Governed Systems. Relational Operations.",
  url: "https://measuresregistry.com",
  image: "https://measuresregistry.com/og.jpeg",
  type: "website",
}

const REGISTRY_ROUTE_METADATA: Record<string, PageMetadata> = {
  "/home": {
    title: "Measures Registry | Computational Systems Governance",
    description: "Computational Systems Governance for governed systems and relational operations.",
    url: "https://measuresregistry.com/home",
    image: "https://measuresregistry.com/og.jpeg",
    type: "website",
  },
  "/connect": {
    title: "Connect | Measures Registry",
    description: "Connect with Measures Registry through questions about Computational Systems Governance, assessment, standing, governed progression, and unDrifted.",
    url: "https://measuresregistry.com/connect",
    image: "https://measuresregistry.com/og.jpeg",
    type: "website",
  },
  "/ai-operations-assessment": {
    title: "Assess the Environment | Measures Registry",
    description: "Assess the environment around AI use. Identify structural conditions affecting authority, review, accountability, and operational stability.",
    url: "https://measuresregistry.com/ai-operations-assessment",
    image: "https://measuresregistry.com/og.jpeg",
    type: "website",
  },
  "/structural-drift": {
    title: "Structural Drift | unDrifted",
    description:
      "Structural Drift is now a diagnostic concept within unDrifted, the Measures Registry publication on structural drift and governed AI operations.",
    url: "https://measuresregistry.com/undrifted",
    canonicalUrl: "https://measuresregistry.com/undrifted",
    ogUrl: "https://measuresregistry.com/structural-drift",
    image: "https://measuresregistry.com/og.jpeg",
    type: "website",
  },
  "/undrifted": {
    title: "unDrifted | Measures Registry",
    description: "Reporting on structural drift in AI systems—examining the authority, operations, environments, and responsibility behind consequential outcomes.",
    url: "https://measuresregistry.com/undrifted",
    rss: {
      title: "unDrifted RSS",
      href: "https://measuresregistry.com/undrifted/rss.xml",
    },
    image: "https://measuresregistry.com/og.jpeg",
    type: "website",
  },
  "/publish-undrifted": {
    title: "publish_undrifted | unDrifted",
    description: "Governed passage surface for env.role_call, Persistence, and unDrifted publication admission.",
    url: "https://measuresregistry.com/publish-undrifted",
    image: "https://measuresregistry.com/og.jpeg",
    type: "website",
  },
  "/undrifted/field-findings-2026-w28": {
    title: "Field Findings 2026-W28 | unDrifted",
    description: "Weekly observations from the Field, July 4-10, 2026.",
    url: "https://measuresregistry.com/undrifted/field-findings-2026-w28",
    image:
      "https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/field_findings_section_banner_2026_w28_v1.webp",
    type: "article",
  },
  "/undrifted/ai-agents-are-not-entering-empty-systems": {
    title: "AI Agents Are Not Entering Empty Systems | unDrifted",
    description: "unDrifted Response 001.",
    url: "https://measuresregistry.com/undrifted/ai-agents-are-not-entering-empty-systems",
    image:
      "https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/undrifted_response_section_banner_2026_w28_v1.webp",
    type: "article",
  },
  "/undrifted/the-pair-over-time": {
    title: "The Pair Over Time | unDrifted",
    description:
      "Mapped & Measured 002 reflects on sustained human-AI collaboration, the pair over time, and the limits of what present evidence can support.",
    url: "https://measuresregistry.com/undrifted/the-pair-over-time",
    image:
      "https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/undrifted/issues/issue-002/mapped-measured-002/paragraph/mapped_measured_002_pair_over_time_banner_2000x1000_v1.webp",
    type: "article",
  },
  "/undrifted/who-ordered-all-this-compute": {
    title: "Who Ordered All This Compute? | unDrifted",
    description:
      "Mapped & Measured 003 compares visible AI adoption with the capital, energy, water, land, and infrastructure commitments being made upstream.",
    url: "https://measuresregistry.com/undrifted/who-ordered-all-this-compute",
    image:
      "https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/undrifted/issues/issue-002/mapped-measured-003/paragraph/mapped_measured_003_paragraph_banner_2000x1000_v1.webp",
    type: "article",
  },
  "/undrifted/the-boundary-problem": {
    title: "The Boundary Problem | unDrifted",
    description:
      "Drift Report 002 examines capability, authority, execution boundaries, and why useful AI needs governed passage before capability becomes consequence.",
    url: "https://measuresregistry.com/undrifted/the-boundary-problem",
    image:
      "https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/undrifted/issues/issue-002/drift-report-002/paragraph/drift_report_002_boundary_problem_banner_2000x1000_v1.webp",
    type: "article",
  },
  "/undrifted/environmentally-enabled": {
    title: "Environmentally Enabled | unDrifted",
    description:
      "Drift Report 003 asks what made the action possible, locating agent behavior inside inherited permissions, monitoring boundaries, and effect-capable environments.",
    url: "https://measuresregistry.com/undrifted/environmentally-enabled",
    image:
      "https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/undrifted/issues/issue-002/drift-report-003/paragraph/drift_report_003_environmentally_enabled_banner_2000x1000_v1.webp",
    type: "article",
  },
  "/about": {
    title: "Connect | Measures Registry",
    description: "Connect with Measures Registry through questions about Computational Systems Governance, assessment, standing, governed progression, and unDrifted.",
    url: "https://measuresregistry.com/connect",
    canonicalUrl: "https://measuresregistry.com/connect",
    ogUrl: "https://measuresregistry.com/about",
    image: "https://measuresregistry.com/og.jpeg",
    type: "website",
  },
  "/about-measures-registry": {
    title: "Connect | Measures Registry",
    description: "Connect with Measures Registry through questions about Computational Systems Governance, assessment, standing, governed progression, and unDrifted.",
    url: "https://measuresregistry.com/connect",
    canonicalUrl: "https://measuresregistry.com/connect",
    ogUrl: "https://measuresregistry.com/about-measures-registry",
    image: "https://measuresregistry.com/og.jpeg",
    type: "website",
  },
  "/privacy": {
    title: "Privacy Policy | Measures Registry",
    description: "How Measures Registry collects, uses, and protects your information.",
    url: "https://measuresregistry.com/privacy",
    image: "https://measuresregistry.com/og.jpeg",
    type: "website",
  },
  "/terms": {
    title: "Terms of Use | Measures Registry",
    description: "Terms governing use of Measures Registry and the services of C3 COMMUNITY PARTNERS DAO LLC.",
    url: "https://measuresregistry.com/terms",
    image: "https://measuresregistry.com/og.jpeg",
    type: "website",
  },
}

const REGISTRY_ROUTE_UNITS: Record<string, string> = {
  "/ai-operations-assessment": "ai_operations_assessment_landing",
  "/structural-drift": "structural_drift_landing",
  "/undrifted": "undrifted_publication_landing",
}

const INANNA_METADATA = {
  title: "Measures of Inanna",
  description: "A ceremonial exhibition of sacred measure & immutable memory.",
  url: "https://www.measuresofinanna.com",
  image: "https://www.measuresofinanna.com/og.png",
  type: "website",
}

const C3_FIELD_METADATA = {
  title: "c3 Field",
  description: "c3 Field Convergence operations spine.",
  url: "https://c3field.online",
  image: "https://c3field.online/og.jpeg",
  type: "website",
}

function isMeasuresRegistryHost(hostname: string) {
  return hostname === "measuresregistry.com" || hostname === "www.measuresregistry.com"
}

function isMeasuresOfInannaHost(hostname: string) {
  return hostname === "measuresofinanna.com" || hostname === "www.measuresofinanna.com"
}

function isC3FieldHost(hostname: string) {
  return hostname === "c3field.online" || hostname === "www.c3field.online"
}

// Cloudflare issues a 308 redirect adding a trailing slash to every non-root route
// (e.g. /about -> /about/), so window.location.pathname never matches the bare keys in
// REGISTRY_ROUTE_UNITS/REGISTRY_ROUTE_METADATA in production. Strip it before lookup,
// mirroring MeasuresRegistryOrchestrator's own normalizePathname().
function normalizePathname(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname
}

function setMeta(selector: string, content: string) {
  const element = document.head.querySelector<HTMLMetaElement>(selector)
  if (element) element.content = content
}

function setCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!element) {
    element = document.createElement("link")
    element.rel = "canonical"
    document.head.appendChild(element)
  }
  element.href = href
}

function setRssAlternate(rss: PageMetadata["rss"] | undefined) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="alternate"][type="application/rss+xml"][data-managed="registry-rss"]')
  if (!rss) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement("link")
    element.rel = "alternate"
    element.type = "application/rss+xml"
    element.setAttribute("data-managed", "registry-rss")
    document.head.appendChild(element)
  }
  element.title = rss.title
  element.href = rss.href
}

function stringFromRecord(record: Record<string, unknown>, key: string) {
  const value = record[key]
  return typeof value === "string" && value.trim() ? value : null
}

function metadataFromGovernedRow(row: { metadata: Record<string, unknown> | null } | null): PageMetadata | null {
  const metadata = row?.metadata
  const seo = metadata?.seo
  if (!metadata || typeof seo !== "object" || Array.isArray(seo)) return null
  if (metadata.route_authority !== "registry" || metadata.frontend_role !== "renderer") return null

  const seoRecord = seo as Record<string, unknown>
  const title = stringFromRecord(seoRecord, "title")
  const description = stringFromRecord(seoRecord, "description")
  const canonicalUrl = stringFromRecord(seoRecord, "canonical_url")
  const ogUrl = stringFromRecord(seoRecord, "og_url")
  const image = stringFromRecord(seoRecord, "og_image") ?? stringFromRecord(seoRecord, "twitter_image")
  const type = stringFromRecord(seoRecord, "og_type")

  if (!title || !description || !canonicalUrl || !image || !type) return null

  return { title, description, url: canonicalUrl, canonicalUrl, ogUrl: ogUrl ?? canonicalUrl, image, type }
}

function missingGovernedRouteMetadata(pathname: string): PageMetadata {
  return {
    title: "Measures Registry Route Metadata Missing",
    description: `Governed route metadata is not seated for ${pathname}.`,
    url: `https://measuresregistry.com${pathname}`,
    image: "https://measuresregistry.com/og.jpeg",
    type: "website",
  }
}

function applyPageMetadata(metadata: PageMetadata) {
  const canonicalUrl = metadata.canonicalUrl ?? metadata.url
  const ogUrl = metadata.ogUrl ?? metadata.url
  document.title = metadata.title
  setMeta('meta[name="description"]', metadata.description)
  setCanonical(canonicalUrl)
  setMeta('meta[property="og:type"]', metadata.type)
  setMeta('meta[property="og:title"]', metadata.title)
  setMeta('meta[property="og:description"]', metadata.description)
  setMeta('meta[property="og:url"]', ogUrl)
  setMeta('meta[property="og:image"]', metadata.image)
  setMeta('meta[name="twitter:card"]', "summary_large_image")
  setMeta('meta[name="twitter:title"]', metadata.title)
  setMeta('meta[name="twitter:description"]', metadata.description)
  setMeta('meta[name="twitter:image"]', metadata.image)
  setRssAlternate(metadata.rss)
}

export default function App() {
  const mode = import.meta.env.MODE
  const hostname = window.location.hostname
  const isRegistryHost = isMeasuresRegistryHost(hostname)
  const isInannaHost = isMeasuresOfInannaHost(hostname)
  const isC3Host = isC3FieldHost(hostname)

  useEffect(() => {
    let cancelled = false

    if (isC3Host || mode === "c3field") {
      applyPageMetadata(C3_FIELD_METADATA)
      return () => { cancelled = true }
    }

    if (isInannaHost || mode === "inanna") {
      applyPageMetadata(INANNA_METADATA)
      return () => { cancelled = true }
    }

    const pathname = normalizePathname(window.location.pathname)
    const routeUnit = REGISTRY_ROUTE_UNITS[pathname]

    if (!routeUnit) {
      applyPageMetadata(REGISTRY_ROUTE_METADATA[pathname] ?? REGISTRY_METADATA)
      return () => { cancelled = true }
    }

    applyPageMetadata(REGISTRY_ROUTE_METADATA[pathname] ?? REGISTRY_METADATA)

    if (supabaseConfigError) return () => { cancelled = true }

    void supabase
      .from("measures_registry")
      .select("metadata")
      .eq("registry_key", routeUnit)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          applyPageMetadata(missingGovernedRouteMetadata(pathname))
          return
        }
        applyPageMetadata(metadataFromGovernedRow(data) ?? missingGovernedRouteMetadata(pathname))
      })

    return () => { cancelled = true }
  }, [isC3Host, isInannaHost, mode])

  if (isRegistryHost) {
    return <MeasuresRegistryRuntime />
  }

  if (isInannaHost) {
    return <Temple />
  }

  if (isC3Host || mode === "c3field") {
    return <OarOperationsConsole />
  }

  if (mode === "inanna") {
    return <Temple />
  }

  return <MeasuresRegistryRuntime />
}
