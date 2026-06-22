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

function patchRootHead(html) {
  let out = html
  out = replaceTag(out, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/s, `<meta property="og:url" content="${REGISTRY_BASE_URL}/" />`)
  out = replaceTag(out, /<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/s, `<meta property="og:image" content="${REGISTRY_OG_IMAGE}" />`)
  out = replaceTag(out, /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/s, `<meta name="twitter:image" content="${REGISTRY_OG_IMAGE}" />`)
  if (!/<link\s+rel="canonical"/.test(out)) {
    out = out.replace("</head>", `    <link rel="canonical" href="${REGISTRY_BASE_URL}/" />\n  </head>`)
  }
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

function writeAboutRouteHead(outDir, template) {
  const routeDir = path.join(outDir, "about-measures-registry")
  fs.mkdirSync(routeDir, { recursive: true })
  let html = template
  html = html.replace(/<title>.*?<\/title>/s, "<title>About Measures Registry</title>")
  html = replaceTag(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/>/s, `<meta name="description" content="Measures Registry is a media-first guided encounter for AI operations governance." />`)
  html = replaceTag(html, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/s, `<meta property="og:title" content="About Measures Registry" />`)
  html = replaceTag(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/s, `<meta property="og:description" content="Measures Registry is a media-first guided encounter for AI operations governance." />`)
  html = replaceTag(html, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/s, `<meta property="og:url" content="${REGISTRY_BASE_URL}/about-measures-registry" />`)
  html = replaceTag(html, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/s, `<link rel="canonical" href="${REGISTRY_BASE_URL}/about-measures-registry" />`)
  fs.writeFileSync(path.join(routeDir, "index.html"), html)
}

async function main() {
  if (!supabaseUrl || !supabaseKey) throw new Error("Supabase URL/key missing for registry route head generation")

  patchRedirects(outDir)

  const templatePath = path.join(outDir, "index.html")
  const rawTemplate = fs.readFileSync(templatePath, "utf8")
  const template = patchRootHead(rawTemplate)
  fs.writeFileSync(templatePath, template)

  writeC3FieldRouteHead(outDir, template)
  writeAboutRouteHead(outDir, template)

  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })

  const { data, error } = await supabase
    .from("measures_registry")
    .select("registry_key, metadata")
    .in("registry_key", routeUnits.map((unit) => unit.unitKey))
    .eq("is_active", true)

  if (error) throw error

  for (const unit of routeUnits) {
    const row = data.find((item) => item.registry_key === unit.unitKey)
    const seo = routeSeo(row, unit.routePath)
    const routeDir = path.join(outDir, unit.routePath.replace(/^\//, ""))
    fs.mkdirSync(routeDir, { recursive: true })
    fs.writeFileSync(path.join(routeDir, "index.html"), applyRouteHead(template, seo))
  }

  console.log(`Generated governed registry route heads: ${routeUnits.map((unit) => unit.routePath).join(", ")}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
