require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_C3_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) throw new Error("Supabase credentials missing")

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function main() {
  const roles = [
    "structural_drift_cover",
    "structural_drift_cover_photo",
    "structural_drift_publication_cover",
    "publication_structural_drift_cover",
    "structural_drift_feature_image",
    "structural_drift_featured_image",
    "registry_mark",
    "watermark",
    "registry_watermark",
    "marble_accent_reference",
  ]

  const mediaRows = assertOk(
    await supabase
      .from("measures_media_map")
      .select("campaign_key, media_role, storage_bucket, storage_path, mime_type, is_active, metadata")
      .in("media_role", roles)
      .order("media_role", { ascending: true }),
    "media role lookup",
  )

  const encounterRows = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, display_title, material_family, metadata")
      .in("encounter_key", ["crystal_chamber", "structural_drift_publication", "measures_assessment", "structure_passage"]),
    "encounter lookup",
  )

  console.log(JSON.stringify({ mediaRows, encounterRows }, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
