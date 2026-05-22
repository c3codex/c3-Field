require("dotenv").config({ path: ".env" })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) throw new Error("Supabase credentials missing")

const supabase = createClient(supabaseUrl, supabaseKey)

const encounterKey = "educational_diagnostic_passage"
const source = "correct_educational_diagnostic_passage_institutional_eyebrow_v1"

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function run() {
  const existing = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, encounter_key, metadata")
      .eq("encounter_key", encounterKey)
      .limit(1),
    `${encounterKey} lookup failed`,
  )

  if (!existing || existing.length === 0) {
    throw new Error(`${encounterKey} row not found in measures_encounter_def — cannot proceed`)
  }

  const row = existing[0]
  const currentMetadata = row.metadata ?? {}

  const updatedMetadata = {
    ...currentMetadata,
    eyebrow: "Assessment Readiness",
  }

  await assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({ metadata: updatedMetadata })
      .eq("id", row.id),
    `${encounterKey} metadata update failed`,
  )

  const verified = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, encounter_key, metadata")
      .eq("id", row.id)
      .limit(1),
    `${encounterKey} post-update verification failed`,
  )

  const verifiedMetadata = verified[0]?.metadata ?? {}

  console.log(
    JSON.stringify(
      {
        source,
        encounterKey,
        operation: "updated",
        eyebrow: verifiedMetadata.eyebrow ?? null,
        metadata_after_update: verifiedMetadata,
      },
      null,
      2,
    ),
  )
}

run().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
