require("dotenv").config({ path: ".env" })
require("dotenv").config({ path: ".env.registry" })

const fs = require("fs")
const path = require("path")
const { createClient } = require("@supabase/supabase-js")

const outDir = process.argv[2] || "dist-undrifted"
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_C3_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY

const WEBPAC_KEY = "undrifted_measuresregistry_c3webpac_v1"
const BRANDPAC_KEY = "undrifted_brandpac_v1"
const OG_MEMBER_KEY = "undrifted_og_v1"

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}

function replaceTag(html, pattern, replacement) {
  return pattern.test(html)
    ? html.replace(pattern, replacement)
    : html.replace("</head>", `    ${replacement}\n  </head>`)
}

function publicStorageUrl(baseUrl, bucket, objectPath) {
  return `${baseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${objectPath
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`
}

async function main() {
  if (!supabaseUrl || !supabaseKey) throw new Error("Supabase URL/key missing for unDrifted host generation")
  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })

  const [{ data: pacs, error: pacError }, { data: manifests, error: manifestError }, { data: landing, error: landingError }] =
    await Promise.all([
      supabase
        .from("c3_pac")
        .select("pac_key,standing,release_state,is_effective")
        .in("pac_key", [WEBPAC_KEY, BRANDPAC_KEY]),
      supabase
        .from("c3_webpac_presentation_manifest")
        .select("manifest_key,pac_key,canonical_host,canonical_path,og_share_presentation")
        .eq("pac_key", WEBPAC_KEY)
        .limit(1),
      supabase
        .from("measures_registry")
        .select("metadata")
        .eq("registry_key", "undrifted_publication_landing")
        .eq("is_active", true)
        .maybeSingle(),
    ])

  if (pacError) throw pacError
  if (manifestError) throw manifestError
  if (landingError) throw landingError

  for (const key of [WEBPAC_KEY, BRANDPAC_KEY]) {
    const pac = (pacs || []).find((row) => row.pac_key === key)
    if (!pac || !pac.is_effective || pac.release_state !== "public" || pac.standing !== "registered_complete_runtime_release_authorized") {
      throw new Error(`${key} is not runtime-release authorized/public`)
    }
  }

  const manifest = manifests?.[0]
  if (!manifest) throw new Error("unDrifted WebPAC presentation manifest missing")
  if (manifest.canonical_host !== "undrifted.measuresregistry.com" || manifest.canonical_path !== "/") {
    throw new Error("unDrifted WebPAC canonical host/path does not match dedicated host contract")
  }
  if (manifest.og_share_presentation?.required !== true || manifest.og_share_presentation?.frontend_invention !== false) {
    throw new Error("unDrifted WebPAC OG contract is not satisfied")
  }

  const { data: member, error: memberError } = await supabase
    .from("c3_pac_member")
    .select("runtime_binding_key")
    .eq("pac_key", BRANDPAC_KEY)
    .eq("member_key", OG_MEMBER_KEY)
    .maybeSingle()
  if (memberError) throw memberError
  if (!member?.runtime_binding_key) throw new Error("registered unDrifted OG member has no runtime binding")

  const { data: binding, error: bindingError } = await supabase
    .from("c3_pac_runtime_binding")
    .select("provider,bucket_name,object_path,standing")
    .eq("binding_key", member.runtime_binding_key)
    .maybeSingle()
  if (bindingError) throw bindingError
  if (!binding || binding.standing !== "active" || binding.provider !== "supabase" || !binding.bucket_name || !binding.object_path) {
    throw new Error("registered unDrifted OG runtime binding is not active/resolvable")
  }

  const seo = landing?.metadata?.seo || {}
  const title = seo.title || seo.og_title
  const description = seo.description || seo.og_description
  if (typeof title !== "string" || !title.trim() || typeof description !== "string" || !description.trim()) {
    throw new Error("resolved unDrifted publication title/description unavailable")
  }

  const canonical = manifest.og_share_presentation.canonical_url
  if (canonical !== "https://undrifted.measuresregistry.com/") {
    throw new Error("WebPAC OG canonical URL does not match canonical host")
  }
  const image = publicStorageUrl(supabaseUrl, binding.bucket_name, binding.object_path)

  const templatePath = path.join(outDir, "index.html")
  let html = fs.readFileSync(templatePath, "utf8")
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`)
  html = replaceTag(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/>/s, `<meta name="description" content="${escapeHtml(description)}" />`)
  html = replaceTag(html, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/s, `<link rel="canonical" href="${canonical}" />`)
  html = replaceTag(html, /<meta\s+property="og:type"\s+content="[^"]*"\s*\/>/s, '<meta property="og:type" content="website" />')
  html = replaceTag(html, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/s, `<meta property="og:title" content="${escapeHtml(title)}" />`)
  html = replaceTag(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/s, `<meta property="og:description" content="${escapeHtml(description)}" />`)
  html = replaceTag(html, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/s, `<meta property="og:url" content="${canonical}" />`)
  html = replaceTag(html, /<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/s, `<meta property="og:image" content="${escapeHtml(image)}" />`)
  html = replaceTag(html, /<meta\s+name="twitter:card"\s+content="[^"]*"\s*\/>/s, '<meta name="twitter:card" content="summary_large_image" />')
  html = replaceTag(html, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/s, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
  html = replaceTag(html, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/s, `<meta name="twitter:description" content="${escapeHtml(description)}" />`)
  html = replaceTag(html, /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/s, `<meta name="twitter:image" content="${escapeHtml(image)}" />`)
  fs.writeFileSync(templatePath, html)

  console.log(`Generated governed unDrifted host head from ${manifest.manifest_key}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
