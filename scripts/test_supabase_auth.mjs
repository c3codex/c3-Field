// scripts/test_supabase_auth.mjs
import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

console.log("URL:", url);
console.log("KEY LENGTH:", key?.length);
console.log("KEY START:", key?.slice(0, 12));
console.log("KEY END:", key?.slice(-6));

const supabase = createClient(url, key);

const { data, error } = await supabase.storage.listBuckets();

console.log("BUCKETS:", data);
console.log("ERROR:", error);