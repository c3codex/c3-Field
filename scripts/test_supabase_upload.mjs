import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

const supabase = createClient(url, key);

const content = Buffer.from("# test\nhello canon\n", "utf8");

const { data, error } = await supabase.storage
  .from("canon-docs")
  .upload("test-upload.md", content, {
    contentType: "text/markdown; charset=utf-8",
    upsert: true,
  });

console.log("DATA:", data);
console.log("ERROR:", error);
