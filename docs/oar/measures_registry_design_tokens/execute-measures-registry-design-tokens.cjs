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

const registryKey = "measures_registry"

const tokens = [
  ["color", "color", "text_primary", "#E8E6DF", null],
  ["color", "color", "text_secondary", "rgba(232,230,223,0.72)", null],
  ["color", "color", "text_muted", "rgba(232,230,223,0.52)", null],
  ["color", "color", "background_obsidian", "#050607", null],
  ["color", "color", "panel_obsidian", "rgba(8,10,14,0.72)", null],
  ["color", "color", "border_subtle", "rgba(232,230,223,0.14)", null],
  ["color", "color", "accent_warm", "rgba(214,132,62,0.82)", null],
  ["color", "color", "accent_cool", "rgba(108,154,208,0.82)", null],
  ["typography", "font_size", "entry_label", "13px", null],
  ["typography", "font_size", "entry_headline", "clamp(36px, 4.5vw, 48px)", null],
  ["typography", "font_size", "entry_sub", "17px", null],
  ["typography", "font_size", "body", "16px", null],
  ["typography", "font_size", "section_headline", "24px", null],
  ["typography", "font_size", "plaque_title", "24px", null],
  ["typography", "font_size", "plaque_body", "16px", null],
  ["typography", "font_size", "entry_headline", "clamp(26px, 9vw, 32px)", "(max-width: 768px)"],
  ["typography", "font_size", "entry_sub", "15px", "(max-width: 768px)"],
  ["typography", "font_size", "body", "15px", "(max-width: 768px)"],
  ["typography", "font_size", "plaque_title", "21px", "(max-width: 768px)"],
  ["typography", "font_size", "plaque_body", "15px", "(max-width: 768px)"],
  ["spacing", "spacing", "section_spacing_desktop", "72px", null],
  ["spacing", "spacing", "section_spacing_mobile", "44px", null],
  ["spacing", "spacing", "page_padding_desktop", "48px", null],
  ["spacing", "spacing", "page_padding_mobile", "20px", null],
  ["spacing", "spacing", "plaque_padding_desktop", "32px", null],
  ["spacing", "spacing", "plaque_padding_mobile", "24px", null],
  ["layout", "layout", "content_max_width", "1080px", null],
  ["layout", "layout", "text_max_width", "680px", null],
  ["layout", "layout", "header_height", "64px", null],
  ["layout", "layout", "mobile_breakpoint", "768px", null],
]

async function execSql(sql, label) {
  const { error } = await supabase.rpc("exec_sql", { sql })
  if (error) throw new Error(`${label}: ${error.message}`)
}

async function main() {
  const ddl = `
    create extension if not exists pgcrypto;

    create table if not exists public.measures_design_token (
      id uuid primary key default gen_random_uuid(),
      registry_key text not null,
      token_scope text not null,
      token_key text not null,
      token_value text not null,
      token_type text not null,
      media_query text,
      is_active boolean not null default true,
      metadata jsonb not null default '{}'::jsonb,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      constraint measures_design_token_type_check check (
        token_type in ('color','font_size','spacing','layout','opacity','line_height','component')
      )
    );

    create unique index if not exists measures_design_token_unique_active_key
    on public.measures_design_token (
      registry_key,
      token_scope,
      token_key,
      coalesce(media_query, '')
    );

    grant select on public.measures_design_token to anon, authenticated;

    drop policy if exists "public reads active measures registry design tokens"
    on public.measures_design_token;

    create policy "public reads active measures registry design tokens"
    on public.measures_design_token
    for select
    to anon, authenticated
    using (
      is_active = true
      and registry_key = 'measures_registry'
    );

    notify pgrst, 'reload schema';
  `

  await execSql(ddl, "Design token table creation failed")

  for (const [tokenScope, tokenType, tokenKey, tokenValue, mediaQuery] of tokens) {
    let lookup = supabase
      .from("measures_design_token")
      .select("id")
      .eq("registry_key", registryKey)
      .eq("token_scope", tokenScope)
      .eq("token_key", tokenKey)

    lookup =
      mediaQuery === null
        ? lookup.is("media_query", null)
        : lookup.eq("media_query", mediaQuery)

    const { data: existingRows, error: lookupError } = await lookup

    if (lookupError) {
      throw new Error(`Token lookup failed for ${tokenKey}: ${lookupError.message}`)
    }

    const payload = {
      registry_key: registryKey,
      token_scope: tokenScope,
      token_key: tokenKey,
      token_value: tokenValue,
      token_type: tokenType,
      media_query: mediaQuery,
      is_active: true,
      metadata: {
        source_oar2: "measures_registry_design_tokens_v1",
      },
      updated_at: new Date().toISOString(),
    }

    const mutation =
      existingRows.length > 0
        ? supabase.from("measures_design_token").update(payload).eq("id", existingRows[0].id)
        : supabase.from("measures_design_token").insert(payload)

    const { error } = await mutation

    if (error) {
      throw new Error(`Token upsert failed for ${tokenKey}: ${error.message}`)
    }
  }

  const { data, error } = await supabase
    .from("measures_design_token")
    .select("token_scope, token_key, token_value, token_type, media_query, is_active")
    .eq("registry_key", registryKey)
    .eq("is_active", true)
    .order("token_scope")
    .order("token_key")

  if (error) {
    throw new Error(`Token validation failed: ${error.message}`)
  }

  const expected = new Set(tokens.map(([, , tokenKey, , mediaQuery]) => `${tokenKey}|${mediaQuery ?? ""}`))
  const seated = new Set(data.map((row) => `${row.token_key}|${row.media_query ?? ""}`))
  const missing = [...expected].filter((key) => !seated.has(key))

  console.log(
    JSON.stringify(
      {
        measures_design_token_exists: true,
        required_token_count: tokens.length,
        seated_token_count: data.length,
        missing_tokens: missing,
        no_slug_fields_introduced: true,
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
