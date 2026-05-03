const requiredVars = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"]

console.log("[pages-env] CF_PAGES:", process.env.CF_PAGES ? "present" : "missing")
console.log("[pages-env] CF_PAGES_BRANCH:", process.env.CF_PAGES_BRANCH || "missing")

for (const name of requiredVars) {
  console.log(`[pages-env] ${name}:`, process.env[name] ? "present" : "missing")
}
