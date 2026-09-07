// Governed DB sync path: registered assets -> Publication Release -> measures_encounter_def.
//
// This is the ONLY script permitted to write unDrifted article/banner content into
// measures_encounter_def.metadata. It refuses to write anything unless the target
// release row in measures_publication_release has publication_state = 'approved',
// set by an explicit operator decision (see Assets/Releases/unDrifted/**).
//
// Usage: node scripts/sync-undrifted-publication-release.cjs [release_id]
// Defaults to release_id = "undrifted_issue01_release01" if omitted.

require("dotenv").config({ path: ".env" })

const fs = require("fs")
const path = require("path")
const matter = require("gray-matter")
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase credentials missing (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)")
}

const supabase = createClient(supabaseUrl, supabaseKey)

const ARTICLES_DIR = path.join(
  __dirname,
  "..",
  "Assets",
  "Articles",
  "unDrifted",
  "Issue01",
  "registered",
)
const BANNERS_DIR = path.join(__dirname, "..", "Assets", "Banners", "unDrifted", "Issue01")

function loadArticleAsset(assetId) {
  const filePath = path.join(ARTICLES_DIR, `${assetId}.md`)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Article asset not found: ${filePath}`)
  }
  const { data } = matter(fs.readFileSync(filePath, "utf8"))
  return data
}

function loadBannerAsset(assetId) {
  const filePath = path.join(BANNERS_DIR, `${assetId}.meta.md`)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Banner sidecar not found: ${filePath}`)
  }
  const { data } = matter(fs.readFileSync(filePath, "utf8"))
  return data
}

async function assertOk(result, label) {
  if (result.error) {
    throw new Error(`${label}: ${result.error.message}`)
  }
  return result.data
}

async function run() {
  const releaseId = process.argv[2] || "undrifted_issue01_release01"

  const releaseRows = await assertOk(
    await supabase
      .from("measures_publication_release")
      .select("*")
      .eq("release_id", releaseId)
      .limit(1),
    "Release lookup failed",
  )

  const release = releaseRows[0]
  if (!release) {
    console.log(JSON.stringify({ synced: false, reason: `No release found for release_id "${releaseId}"` }, null, 2))
    return
  }

  if (release.publication_state !== "approved") {
    console.log(
      JSON.stringify(
        {
          synced: false,
          release_id: releaseId,
          publication_state: release.publication_state,
          reason:
            "Refusing to sync: publication_state is not 'approved'. An operator must record a decision " +
            "in the release's issue content-authority decision file, then update the release row " +
            "(approved_article_asset_ids, approved_banner_asset_ids, publication_state: 'approved') " +
            "before this script will write anything to measures_encounter_def.",
        },
        null,
        2,
      ),
    )
    return
  }

  const articleAssetIds = release.approved_article_asset_ids || []
  const bannerAssetIds = release.approved_banner_asset_ids || []

  if (articleAssetIds.length === 0) {
    console.log(
      JSON.stringify(
        {
          synced: false,
          release_id: releaseId,
          reason: "publication_state is 'approved' but approved_article_asset_ids is empty — nothing to sync.",
        },
        null,
        2,
      ),
    )
    return
  }

  const bannerByAssetId = new Map(
    bannerAssetIds.map((id) => [id, loadBannerAsset(id)]),
  )

  const skipped = []
  const featuredArticleSet = []

  for (const articleId of articleAssetIds) {
    const article = loadArticleAsset(articleId)
    const banner = bannerByAssetId.get(article.banner_asset_id)

    if (!article.notes || !article.title) {
      skipped.push({ articleId, reason: "missing required frontmatter (title/notes)" })
      continue
    }

    // Refuse to invent an external URL. Only include if the asset (or its
    // sidecar) already carries a real publish target.
    const articleUrl = article.article_url || article.paragraph_url || null
    if (!articleUrl) {
      skipped.push({
        articleId,
        reason:
          "no article_url/paragraph_url on the registered asset — this script does not invent " +
          "publish URLs. Publish the article externally (or confirm an internal route) and set " +
          "article_url in its frontmatter before syncing.",
      })
      continue
    }

    featuredArticleSet.push({
      title: article.title,
      teaser: article.teaser || null,
      subtitle: article.subtitle || null,
      media_role: banner ? banner.asset_id : null,
      article_url: articleUrl,
      feature_label: "FEATURE ARTICLE",
      publication_state: "published",
    })
  }

  if (featuredArticleSet.length === 0) {
    console.log(
      JSON.stringify(
        {
          synced: false,
          release_id: releaseId,
          reason: "All approved article assets were skipped — see 'skipped' for why.",
          skipped,
        },
        null,
        2,
      ),
    )
    return
  }

  const existing = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("metadata")
      .eq("encounter_key", "undrifted")
      .limit(1),
    "Read of measures_encounter_def failed",
  )

  const currentMetadata = existing[0]?.metadata || {}
  const nextMetadata = {
    ...currentMetadata,
    featured_article_set: featuredArticleSet,
  }

  await assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({ metadata: nextMetadata })
      .eq("encounter_key", "undrifted"),
    "Write to measures_encounter_def failed",
  )

  await assertOk(
    await supabase
      .from("measures_publication_release")
      .update({
        publication_state: "synced",
        db_sync_status: "synced",
        renderer_eligibility: true,
      })
      .eq("release_id", releaseId),
    "Release status update failed",
  )

  console.log(
    JSON.stringify(
      {
        synced: true,
        release_id: releaseId,
        featured_article_count: featuredArticleSet.length,
        skipped,
      },
      null,
      2,
    ),
  )
}

run().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
