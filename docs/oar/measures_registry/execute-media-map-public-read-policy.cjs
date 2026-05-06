require("dotenv").config({ path: ".env" })
const { createClient } = require("@supabase/supabase-js")
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
if (!supabaseUrl || !supabaseKey) throw new Error("Supabase credentials missing")
const supabase = createClient(supabaseUrl, supabaseKey)
async function execSql(sql, label){ const {error}=await supabase.rpc("exec_sql", {sql}); if(error) throw new Error(`${label}: ${error.message}`) }
async function main(){
 await execSql(`
   alter table public.measures_media_map enable row level security;

   drop policy if exists measures_media_map_public_active_read
   on public.measures_media_map;

   create policy measures_media_map_public_active_read
   on public.measures_media_map
   for select
   to anon, authenticated
   using (is_active = true);

   grant select (
     media_role,
     storage_bucket,
     storage_path,
     mime_type,
     is_active,
     campaign_key,
     sort_order
   )
   on public.measures_media_map
   to anon, authenticated;

   notify pgrst, 'reload schema';
 `, "media map public read policy failed")

 const bundle = await fetch('https://www.measuresregistry.com/assets/index-DZREJw0F.js').then(r=>r.text())
 const deployedUrl = bundle.match(/https:\/\/zfihrspxvennjzazxcbj\.supabase\.co/)?.[0]
 const deployedKey = bundle.match(/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/)?.[0]
 if(!deployedUrl || !deployedKey) throw new Error("Could not read deployed public client config")
 const anon = createClient(deployedUrl, deployedKey)
 const roles = ["epigraph_video","hero_image","explainer_video","hero_measured_image","registry_mark"]
 const {data,error}=await anon
   .from("measures_media_map")
   .select("media_role,storage_bucket,storage_path,mime_type,is_active,campaign_key")
   .eq("campaign_key", "agents_of_chaos_integrity_governance")
   .in("media_role", roles)
   .eq("is_active", true)
   .order("media_role")
 if(error) throw new Error(`deployed anon validation failed: ${error.message}`)
 console.log(JSON.stringify({
   dbConnection: "active",
   policy: "measures_media_map_public_active_read",
   deployedAnonCanReadMediaRows: data.length === roles.length,
   expectedRoles: roles,
   returnedRoles: data.map(row => row.media_role),
   rows: data,
 }, null, 2))
}
main().catch(e=>{console.error(e.message);process.exit(1)})
