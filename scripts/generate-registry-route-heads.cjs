require("dotenv").config({ path: ".env" })
require("dotenv").config({ path: ".env.registry" })

const fs = require("fs")
const path = require("path")
const { createClient } = require("@supabase/supabase-js")

const outDir = process.argv[2] || "dist-registry"
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_C3_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY

const REGISTRY_BASE_URL = "https://measuresregistry.com"
const REGISTRY_OG_IMAGE = "https://measuresregistry.com/og.jpeg"

const REGISTRY_REDIRECT_RULES = [
  "/c3field https://c3field.online 301",
  "/c3field/ https://c3field.online 301",
  "/undrifted/field-findings-2026-w28 /undrifted/field-findings-2026-w28/index.html 200",
  "/undrifted/field-findings-2026-w28/ /undrifted/field-findings-2026-w28/index.html 200",
  "/undrifted/ai-agents-are-not-entering-empty-systems /undrifted/ai-agents-are-not-entering-empty-systems/index.html 200",
  "/undrifted/ai-agents-are-not-entering-empty-systems/ /undrifted/ai-agents-are-not-entering-empty-systems/index.html 200",
  "/undrifted/the-pair-over-time /undrifted/the-pair-over-time/index.html 200",
  "/undrifted/the-pair-over-time/ /undrifted/the-pair-over-time/index.html 200",
]

const routeUnits = [
  {
    routePath: "/ai-operations-assessment",
    unitKey: "ai_operations_assessment_landing",
  },
  {
    routePath: "/structural-drift",
    unitKey: "structural_drift_landing",
  },
  {
    routePath: "/undrifted",
    unitKey: "undrifted_publication_landing",
  },
]

const launchCycleArticleRoutes = [
  {
    routePath: "/undrifted/field-findings-2026-w28",
    title: "Field Findings 2026-W28 | unDrifted",
    description: "Weekly observations from the Field, July 4-10, 2026.",
    canonical_url: "https://measuresregistry.com/undrifted/field-findings-2026-w28",
    image:
      "https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/field_findings_section_banner_2026_w28_v1.webp",
  },
  {
    routePath: "/undrifted/ai-agents-are-not-entering-empty-systems",
    title: "AI Agents Are Not Entering Empty Systems | unDrifted",
    description: "unDrifted Response 001.",
    canonical_url: "https://measuresregistry.com/undrifted/ai-agents-are-not-entering-empty-systems",
    image:
      "https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/undrifted_response_section_banner_2026_w28_v1.webp",
  },
  {
    routePath: "/undrifted/the-pair-over-time",
    title: "The Pair Over Time | unDrifted",
    description:
      "Mapped & Measured 002 reflects on sustained human-AI collaboration, the pair over time, and the limits of what present evidence can support.",
    canonical_url: "https://measuresregistry.com/undrifted/the-pair-over-time",
    image: "https://measuresregistry.com/undrifted/issue-002/mapped_measured_002_pair_over_time_banner.webp",
  },
]

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}

function replaceTag(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace("</head>", `    ${replacement}\n  </head>`)
}

function applyRouteHead(template, seo) {
  let html = template
  const title = escapeHtml(seo.title)
  const description = escapeHtml(seo.description)
  const canonical = escapeHtml(seo.canonical_url)
  const ogType = escapeHtml(seo.og_type)
  const ogTitle = escapeHtml(seo.og_title)
  const ogDescription = escapeHtml(seo.og_description)
  const ogUrl = escapeHtml(seo.og_url)
  const ogImage = escapeHtml(seo.og_image)
  const twitterCard = escapeHtml(seo.twitter_card)
  const twitterTitle = escapeHtml(seo.twitter_title)
  const twitterDescription = escapeHtml(seo.twitter_description)
  const twitterImage = escapeHtml(seo.twitter_image)

  html = html.replace(/<title>.*?<\/title>/s, `<title>${title}</title>`)
  html = replaceTag(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/>/s, `<meta name="description" content="${description}" />`)
  html = replaceTag(html, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/s, `<link rel="canonical" href="${canonical}" />`)
  html = replaceTag(html, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/s, `<meta property="og:title" content="${ogTitle}" />`)
  html = replaceTag(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/s, `<meta property="og:description" content="${ogDescription}" />`)
  html = replaceTag(html, /<meta\s+property="og:type"\s+content="[^"]*"\s*\/>/s, `<meta property="og:type" content="${ogType}" />`)
  html = replaceTag(html, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/s, `<meta property="og:url" content="${ogUrl}" />`)
  html = replaceTag(html, /<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/s, `<meta property="og:image" content="${ogImage}" />`)
  html = replaceTag(html, /<meta\s+name="twitter:card"\s+content="[^"]*"\s*\/>/s, `<meta name="twitter:card" content="${twitterCard}" />`)
  html = replaceTag(html, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/s, `<meta name="twitter:title" content="${twitterTitle}" />`)
  html = replaceTag(html, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/s, `<meta name="twitter:description" content="${twitterDescription}" />`)
  html = replaceTag(html, /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/s, `<meta name="twitter:image" content="${twitterImage}" />`)
  return html
}

function routeSeo(row, routePath) {
  const metadata = row?.metadata || {}
  const seo = metadata.seo || {}
  const required = [
    "title",
    "description",
    "canonical_url",
    "og_type",
    "og_title",
    "og_description",
    "og_url",
    "og_image",
    "twitter_card",
    "twitter_title",
    "twitter_description",
    "twitter_image",
  ]
  for (const key of required) {
    if (typeof seo[key] !== "string" || !seo[key].trim()) {
      throw new Error(`${row?.registry_key || routePath} missing seo.${key}`)
    }
  }
  if (metadata.route_path !== routePath || metadata.route_authority !== "registry") {
    throw new Error(`${row.registry_key} is not governed authority for ${routePath}`)
  }
  return seo
}

const REGISTRY_ORGANIZATION_ID = `${REGISTRY_BASE_URL}/#organization`
const REGISTRY_WEBSITE_ID = `${REGISTRY_BASE_URL}/#website`
const REGISTRY_FOUNDER_ID = `${REGISTRY_BASE_URL}/#founder`

function injectJsonLd(html, graph) {
  const script = `<script type="application/ld+json">${JSON.stringify(graph)}</script>`
  return html.replace("</head>", `    ${script}\n  </head>`)
}

// OAR2 "Seat Institutional Metadata Authority": sameAs now resolves only from
// measures_registry.undrifted_publication_landing.metadata.social_links entries with
// standing === "active" — DB-seeded, not hardcoded. Paragraph/unDrifted is not in that
// list (no active social_links row exists for it yet), so it is intentionally omitted
// from both Organization and Person sameAs rather than assumed, per the OAR2 rule that
// public profile links must be seated before being rendered into JSON-LD.
function activeSameAsUrls(socialLinks) {
  if (!Array.isArray(socialLinks)) return []
  return socialLinks
    .filter((link) => link && link.standing === "active" && typeof link.url === "string" && link.url)
    .map((link) => link.url)
}

function buildRootJsonLdGraph({ founder, sameAs }) {
  const founderName = typeof founder?.founder_name === "string" ? founder.founder_name : null
  const founderTitle = typeof founder?.founder_title === "string" ? founder.founder_title : null
  const founderDescription = typeof founder?.founder_description === "string" ? founder.founder_description : null

  const graph = [
    {
      "@type": "Organization",
      "@id": REGISTRY_ORGANIZATION_ID,
      name: "Measures Registry",
      url: `${REGISTRY_BASE_URL}/`,
      description: "Computational Systems Governance. Governed Systems. Relational Operations.",
      sameAs,
    },
    {
      "@type": "WebSite",
      "@id": REGISTRY_WEBSITE_ID,
      name: "Measures Registry",
      url: `${REGISTRY_BASE_URL}/`,
      publisher: { "@id": REGISTRY_ORGANIZATION_ID },
    },
  ]

  // Founder Person entity only emitted once seated — no invented name/title fallback.
  if (founderName) {
    graph.push({
      "@type": "Person",
      "@id": REGISTRY_FOUNDER_ID,
      name: founderName,
      ...(founderTitle ? { jobTitle: founderTitle } : {}),
      ...(founderDescription ? { description: founderDescription } : {}),
      affiliation: { "@id": REGISTRY_ORGANIZATION_ID },
      sameAs,
    })
  }

  return { "@context": "https://schema.org", "@graph": graph }
}

// OAR2 "Seat Institutional Metadata Authority" §5/§8: BlogPosting schema per unDrifted
// article, generated only from seated fields. No Article schema is emitted for an entry
// missing date_published or author_name — no invented dates or authors.
function buildUndriftedArticleJsonLd(articles) {
  const eligible = (Array.isArray(articles) ? articles : []).filter(
    (article) =>
      article &&
      typeof article.title === "string" &&
      typeof article.article_url === "string" &&
      typeof article.date_published === "string" &&
      typeof article.author_name === "string",
  )
  if (eligible.length === 0) return null
  return {
    "@context": "https://schema.org",
    "@graph": eligible.map((article) => ({
      "@type": "BlogPosting",
      headline: article.title,
      url: article.article_url,
      datePublished: article.date_published,
      ...(typeof article.date_modified === "string" ? { dateModified: article.date_modified } : {}),
      ...(typeof article.description === "string" ? { description: article.description } : {}),
      author: { "@type": "Organization", name: article.author_name },
      publisher: { "@id": REGISTRY_ORGANIZATION_ID },
    })),
  }
}

function patchRootHead(html, { founder, sameAs }) {
  let out = html
  out = replaceTag(out, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/s, `<meta property="og:url" content="${REGISTRY_BASE_URL}/" />`)
  out = replaceTag(out, /<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/s, `<meta property="og:image" content="${REGISTRY_OG_IMAGE}" />`)
  out = replaceTag(out, /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/s, `<meta name="twitter:image" content="${REGISTRY_OG_IMAGE}" />`)
  if (!/<link\s+rel="canonical"/.test(out)) {
    out = out.replace("</head>", `    <link rel="canonical" href="${REGISTRY_BASE_URL}/" />\n  </head>`)
  }
  out = injectJsonLd(out, buildRootJsonLdGraph({ founder, sameAs }))
  return out
}

function patchRedirects(outDir) {
  const redirectsPath = path.join(outDir, "_redirects")
  const existing = fs.existsSync(redirectsPath) ? fs.readFileSync(redirectsPath, "utf8") : ""
  const lines = existing.split("\n").filter((l) => l.trim() && !REGISTRY_REDIRECT_RULES.some((r) => l.startsWith(r.split(" ")[0])))
  fs.writeFileSync(redirectsPath, [...REGISTRY_REDIRECT_RULES, ...lines].join("\n") + "\n")
}

function writeC3FieldRouteHead(outDir, template) {
  const routeDir = path.join(outDir, "c3field")
  fs.mkdirSync(routeDir, { recursive: true })
  let html = template
  html = html.replace(/<title>.*?<\/title>/s, "<title>c3 Field — Measures Registry</title>")
  html = replaceTag(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/>/s, `<meta name="description" content="Measures Registry is a registered branch of c3 Field." />`)
  html = replaceTag(html, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/s, `<meta property="og:title" content="c3 Field" />`)
  html = replaceTag(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/s, `<meta property="og:description" content="Measures Registry is a registered branch of c3 Field." />`)
  html = replaceTag(html, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/s, `<meta property="og:url" content="https://c3field.online" />`)
  html = replaceTag(html, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/s, `<link rel="canonical" href="https://c3field.online" />`)
  if (!/<meta\s+http-equiv="refresh"/.test(html)) {
    html = html.replace("</head>", `    <meta http-equiv="refresh" content="0; url=https://c3field.online" />\n  </head>`)
  }
  fs.writeFileSync(path.join(routeDir, "index.html"), html)
}

function writeWebsiteRouteHead(outDir, template, routePath, title, description) {
  const routeDir = path.join(outDir, routePath.replace(/^\//, ""))
  fs.mkdirSync(routeDir, { recursive: true })
  const canonical = `${REGISTRY_BASE_URL}${routePath}`
  const seo = {
    title,
    description,
    canonical_url: canonical,
    og_type: "website",
    og_title: title,
    og_description: description,
    og_url: canonical,
    og_image: REGISTRY_OG_IMAGE,
    twitter_card: "summary_large_image",
    twitter_title: title,
    twitter_description: description,
    twitter_image: REGISTRY_OG_IMAGE,
  }
  fs.writeFileSync(path.join(routeDir, "index.html"), applyRouteHead(template, seo))
}

function writePrivacyRouteHead(outDir, template) {
  const routeDir = path.join(outDir, "privacy")
  fs.mkdirSync(routeDir, { recursive: true })
  let html = template
  html = html.replace(/<title>.*?<\/title>/s, "<title>Privacy Policy | Measures Registry</title>")
  html = replaceTag(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/>/s, `<meta name="description" content="How Measures Registry collects, uses, and protects your information." />`)
  html = replaceTag(html, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/s, `<meta property="og:title" content="Privacy Policy | Measures Registry" />`)
  html = replaceTag(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/s, `<meta property="og:description" content="How Measures Registry collects, uses, and protects your information." />`)
  html = replaceTag(html, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/s, `<meta property="og:url" content="${REGISTRY_BASE_URL}/privacy" />`)
  html = replaceTag(html, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/s, `<link rel="canonical" href="${REGISTRY_BASE_URL}/privacy" />`)
  fs.writeFileSync(path.join(routeDir, "index.html"), html)
}

function writeTermsRouteHead(outDir, template) {
  const routeDir = path.join(outDir, "terms")
  fs.mkdirSync(routeDir, { recursive: true })
  let html = template
  html = html.replace(/<title>.*?<\/title>/s, "<title>Terms of Use | Measures Registry</title>")
  html = replaceTag(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/>/s, `<meta name="description" content="Terms governing use of Measures Registry and the services of C3 COMMUNITY PARTNERS DAO LLC." />`)
  html = replaceTag(html, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/s, `<meta property="og:title" content="Terms of Use | Measures Registry" />`)
  html = replaceTag(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/s, `<meta property="og:description" content="Terms governing use of Measures Registry and the services of C3 COMMUNITY PARTNERS DAO LLC." />`)
  html = replaceTag(html, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/s, `<meta property="og:url" content="${REGISTRY_BASE_URL}/terms" />`)
  html = replaceTag(html, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/s, `<link rel="canonical" href="${REGISTRY_BASE_URL}/terms" />`)
  fs.writeFileSync(path.join(routeDir, "index.html"), html)
}

function writeStaticRouteHead(outDir, template, route) {
  const routeDir = path.join(outDir, route.routePath.replace(/^\//, ""))
  fs.mkdirSync(routeDir, { recursive: true })
  const seo = {
    title: route.title,
    description: route.description,
    canonical_url: route.canonical_url,
    og_type: "article",
    og_title: route.title,
    og_description: route.description,
    og_url: route.canonical_url,
    og_image: route.image,
    twitter_card: "summary_large_image",
    twitter_title: route.title,
    twitter_description: route.description,
    twitter_image: route.image,
  }
  fs.writeFileSync(path.join(routeDir, "index.html"), applyRouteHead(template, seo))
}

async function main() {
  if (!supabaseUrl || !supabaseKey) throw new Error("Supabase URL/key missing for registry route head generation")

  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })

  const registryKeys = [...routeUnits.map((unit) => unit.unitKey), "founder_authority"]
  const { data, error } = await supabase
    .from("measures_registry")
    .select("registry_key, metadata")
    .in("registry_key", registryKeys)
    .eq("is_active", true)

  if (error) throw error

  const founderRow = data.find((item) => item.registry_key === "founder_authority")
  const undriftedRow = data.find((item) => item.registry_key === "undrifted_publication_landing")
  const founder = founderRow?.metadata ?? null
  const sameAs = activeSameAsUrls(undriftedRow?.metadata?.social_links)
  const articles = undriftedRow?.metadata?.featured_article_set ?? []

  patchRedirects(outDir)

  const templatePath = path.join(outDir, "index.html")
  const rawTemplate = fs.readFileSync(templatePath, "utf8")
  const template = patchRootHead(rawTemplate, { founder, sameAs })
  fs.writeFileSync(templatePath, template)

  writeC3FieldRouteHead(outDir, template)
  writeWebsiteRouteHead(
    outDir,
    template,
    "/home",
    "Measures Registry | Computational Systems Governance",
    "Computational Systems Governance for governed systems and relational operations.",
  )
  writeWebsiteRouteHead(
    outDir,
    template,
    "/connect",
    "Connect | Measures Registry",
    "Connect with Measures Registry through questions about Computational Systems Governance, assessment, standing, governed progression, and unDrifted.",
  )
  writePrivacyRouteHead(outDir, template)
  writeTermsRouteHead(outDir, template)

  for (const unit of routeUnits) {
    const row = data.find((item) => item.registry_key === unit.unitKey)
    const seo = routeSeo(row, unit.routePath)
    const routeDir = path.join(outDir, unit.routePath.replace(/^\//, ""))
    fs.mkdirSync(routeDir, { recursive: true })
    let html = applyRouteHead(template, seo)
    if (unit.unitKey === "undrifted_publication_landing") {
      const articleGraph = buildUndriftedArticleJsonLd(articles)
      if (articleGraph) html = injectJsonLd(html, articleGraph)
    }
    fs.writeFileSync(path.join(routeDir, "index.html"), html)
  }

  for (const route of launchCycleArticleRoutes) {
    writeStaticRouteHead(outDir, template, route)
  }

  console.log(
    `Generated governed registry route heads: ${[
      "/home",
      "/connect",
      ...routeUnits.map((unit) => unit.routePath),
      ...launchCycleArticleRoutes.map((route) => route.routePath),
    ].join(", ")}`,
  )
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
