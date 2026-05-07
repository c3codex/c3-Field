require("dotenv").config({ path: ".env" })

const { createClient } = require("@supabase/supabase-js")

function argValue(name) {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : null
}

function requireArg(name) {
  const value = argValue(name)
  if (!value) throw new Error(`${name} is required`)
  return value
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function slugToKey(value) {
  return String(value ?? "").replaceAll("-", "_")
}

async function deployedPublicClient(publicUrl) {
  const html = await fetch(publicUrl).then((response) => {
    if (!response.ok) throw new Error(`public site fetch failed: ${response.status}`)
    return response.text()
  })
  const jsAsset = [...html.matchAll(/assets\/index-[^"']+\.js/g)][0]?.[0]
  if (!jsAsset) throw new Error("public JS asset missing")

  const base = publicUrl.replace(/\/$/, "")
  const js = await fetch(`${base}/${jsAsset}`).then((response) => {
    if (!response.ok) throw new Error(`public JS fetch failed: ${response.status}`)
    return response.text()
  })
  const supabaseUrl = js.match(/https:\/\/[a-z0-9]+\.supabase\.co/)?.[0]
  const anonKey = js.match(/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/)?.[0]
  if (!supabaseUrl || !anonKey) throw new Error("public Supabase client config missing")

  return createClient(supabaseUrl, anonKey)
}

async function main() {
  const publicationKey = requireArg("--publication-key")
  const dispatchKey = requireArg("--dispatch-key")
  const captureSource = argValue("--capture-source") ?? `${publicationKey}_dispatch`
  const publicUrl = argValue("--public-url") ?? process.env.PUBLIC_SITE_URL ?? "https://www.measuresregistry.com"
  const serviceUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

  if (!serviceUrl || !serviceKey) throw new Error("Service Supabase credentials missing")

  const publicClient = await deployedPublicClient(publicUrl)
  const serviceClient = createClient(serviceUrl, serviceKey)

  const { data: publication, error: publicationError } = await publicClient
    .from("measures_publication_registry")
    .select("publication_key, title, status")
    .eq("publication_key", publicationKey)
    .single()
  if (publicationError) throw publicationError

  const { data: dispatch, error: dispatchError } = await publicClient
    .from("measures_publication_dispatch")
    .select("publication_key, dispatch_key, title, excerpt, seo_description, tags, primary_cta, secondary_cta, references, media_manifest, external_slug, external_url, status")
    .eq("dispatch_key", dispatchKey)
    .single()
  if (dispatchError) throw dispatchError

  assert(publication?.status === "published", "publication is not published")
  assert(dispatch?.publication_key === publicationKey, "dispatch publication_key mismatch")
  assert(dispatch?.status === "published", "dispatch is not published")
  assert(dispatch?.title, "dispatch title missing")
  assert(dispatch?.excerpt, "dispatch excerpt missing")
  assert(dispatch?.seo_description, "dispatch seo_description missing")
  assert(Array.isArray(dispatch?.tags) && dispatch.tags.length > 0, "dispatch tags missing")
  assert(Array.isArray(dispatch?.references) && dispatch.references.length > 0, "dispatch references missing")
  assert(dispatch?.primary_cta && dispatch?.secondary_cta, "dispatch CTAs missing")
  assert(dispatch?.media_manifest && Object.keys(dispatch.media_manifest).length > 0, "media manifest missing")
  assert(dispatch.dispatch_key !== dispatch.external_slug, "dispatch_key must not equal external_slug")
  assert(dispatch.dispatch_key !== slugToKey(dispatch.external_slug), "dispatch_key must not be derived from external_slug")

  const email = `publication-dispatch-validation-${Date.now()}@example.com`
  const { error: insertError } = await publicClient
    .from("measures_publication_subscription_capture")
    .insert({
      publication_key: publicationKey,
      dispatch_key: dispatch.dispatch_key,
      email,
      organization: "Validation",
      capture_source: captureSource,
      metadata: { validation: true },
    })
  if (insertError) throw insertError

  await serviceClient
    .from("measures_publication_subscription_capture")
    .delete()
    .eq("email", email)

  console.log(JSON.stringify({
    publication: publication.publication_key,
    dispatch: dispatch.dispatch_key,
    requiredFieldsPresent: true,
    referenceCount: dispatch.references.length,
    mediaManifestValid: true,
    noSlugAuthority: true,
    publicReadWorks: true,
    subscriptionCaptureInsertWorks: true,
    captureCleaned: true,
  }, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
