require("dotenv").config({ path: ".env" })

const requiredVars = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_ANON_KEY",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "VITE_C3FIELD_R2_PUBLIC_BASE_URL",
  "VITE_R2_PUBLIC_BASE_URL",
]

console.log("[pages-env] CF_PAGES:", process.env.CF_PAGES ? "present" : "missing")
console.log("[pages-env] CF_PAGES_BRANCH:", process.env.CF_PAGES_BRANCH || "missing")

for (const name of requiredVars) {
  console.log(`[pages-env] ${name}:`, process.env[name] ? "present" : "missing")
}

console.log(
  "[pages-env] RESOLVED_SUPABASE_URL:",
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    ? "env"
    : "public-fallback",
)
