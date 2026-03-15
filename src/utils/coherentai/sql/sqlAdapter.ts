import { supabase } from "@/lib/supabaseClient";

export async function runSQL(query: string, params: any[] = []) {
  const allowed = validateQuery(query);

  if (!allowed) {
    throw new Error("SQL rejected by policy.");
  }

  const { data, error } = await supabase.rpc("coherent_sql_exec", {
    query_text: query,
    query_params: params
  });

  if (error) throw error;

  return data;
}

function validateQuery(query: string) {
  const forbidden = [
    "drop table",
    "truncate",
    "alter system",
    "grant ",
    "revoke ",
  ];

  const q = query.toLowerCase();

  for (const f of forbidden) {
    if (q.includes(f)) return false;
  }

  return true;
}