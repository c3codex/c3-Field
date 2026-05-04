require("dotenv").config({ path: ".env" })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase credentials missing")
}

const supabase = createClient(supabaseUrl, supabaseKey)

const testEmail = "contibute2c3communitypartners@gmail.com"

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function main() {
  await assertOk(
    await supabase.from("measures_seat_hold_capture").select("id").limit(1),
    "DB connection failed",
  )

  const inserted = await assertOk(
    await supabase
      .from("measures_seat_hold_capture")
      .insert({
        registry_key: "measures_registry",
        encounter_key: "foundation_seat_hold",
        email: testEmail,
        capture_context: "measures_registry_seat_hold",
        notification_state: "queued",
        source_encounter_key: "foundation_seat_hold",
        offering_key: "foundation_seat",
        metadata: {
          test: true,
          source: "seed_test_capture_row_v1",
          purpose: "provider_dispatch_validation",
        },
      })
      .select(
        "id, email, offering_key, source_encounter_key, notification_state, metadata, created_at",
      )
      .single(),
    "Test capture row insert failed",
  )

  const validation = {
    dbConnection: "active",
    oneTestRowCreated: Boolean(inserted.id),
    capture_id: inserted.id,
    email: inserted.email,
    notification_state: inserted.notification_state,
    offering_key: inserted.offering_key,
    source_encounter_key: inserted.source_encounter_key,
    metadataTest: inserted.metadata?.test === true,
    metadataSource: inserted.metadata?.source,
    metadataPurpose: inserted.metadata?.purpose,
    created_at: inserted.created_at,
    emailSentByThisOar: false,
  }

  console.log(JSON.stringify(validation, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
