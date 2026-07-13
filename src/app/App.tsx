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
  image: string
  type: string
}

const REGISTRY_METADATA: PageMetadata = {
  title: "Measures Registry",
  description: "Integrity Governance for AI Systems",
  url: "https://measuresregistry.com",
  image: "https://measuresregistry.com/og.jpeg",
  type: "website",
}

const REGISTRY_ROUTE_METADATA: Record<string, PageMetadata> = {
  "/ai-operations-assessment": {
    title: "AI Operations Assessment | Measures Registry",
    description: "Identify structural drift in AI operations and begin where drift becomes visible.",
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
    description: "Structural drift is detectable. Collapse is not the default.",
    url: "https://measuresregistry.com/undrifted",
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
  "/about": {
    title: "About Measures Registry",
    description: "Integrity governance for AI-accelerated systems. The Codexstone Seal. Objective. Action. Result.",
    url: "https://measuresregistry.com/about",
    image: "https://measuresregistry.com/og.jpeg",
    type: "website",
  },
  "/about-measures-registry": {
    title: "About Measures Registry",
    description: "Integrity governance for AI-accelerated systems. The Codexstone Seal. Objective. Action. Result.",
    url: "https://measuresregistry.com/about",
    canonicalUrl: "https://measuresregistry.com/about",
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
