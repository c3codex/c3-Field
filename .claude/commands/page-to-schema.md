---
name: page-to-schema
description: >
  Use this skill whenever the user describes a page, shares a design reference, uploads
  a screenshot, or provides a URL and wants Claude to produce the Supabase DB schema and
  implementation plan behind it. Triggers on: "structure this page", "schema for this
  design", "set up the DB for this", "turn this into a database", "create a render plan",
  "build the schema from this", "design this into tables", "site settings for this",
  "style profile for this layout", or any request to go from a page description or
  example to structured database output. Produces all five outputs every time: style
  profile, content placement, site settings and branding, DB schema (tables + SQL),
  and render runtime plan. Always queries the existing DB first before proposing schema.
---

# Page to Schema Skill

## Purpose

Claude receives a page — as a description, HTML, screenshot, or URL — and produces
the full Supabase DB structure and runtime plan needed to render it from seated state.

This skill is general. It works for any Claude Code project with a Supabase backend.

---

## Process

Always follow this sequence. Never skip a step.

```
1. RECEIVE INPUT       — description, image, HTML, or URL
2. QUERY DB            — inspect existing schema before proposing anything
3. INFER               — extract page structure from input
4. PRODUCE FIVE OUTPUTS — in order, every time
5. CONFIRM             — ask for review before generating SQL
6. DELIVER SQL         — insert/migration SQL ready to run
```

---

## Step 1 — Receive Input

Accept any of:

- **Natural language description** — user describes the page in prose
- **HTML/CSS** — existing markup to reverse-engineer
- **Screenshot or image** — visual reference uploaded to context
- **URL** — Claude fetches and reads the page
- **Mix** — any combination of the above

If the input is a URL, fetch it. If it is an image, read the visual structure.
Extract every visible section, content slot, and design decision present in the input.

---

## Step 2 — Query DB First

Before proposing any schema, inspect what already exists:

```sql
-- List all tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY table_name;

-- For each relevant table, inspect columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = '{table}';
```

Use MCP Supabase tools if available. If not, ask the user to paste their schema
or run the query and share results.

**Infer from what exists.** Extend existing tables where the pattern fits.
Propose new tables only where no existing structure can carry the content.
Never overwrite or replace existing columns — add, extend, or join.

---

## Step 3 — Infer Page Structure

From the input, extract:

- What sections exist and in what order
- What content slots each section contains (headline, body, image, CTA, etc.)
- What is dynamic (should come from DB) vs. structural (layout only)
- What branding decisions are present (palette, type, spacing rhythm)
- What settings are site-level vs. page-level vs. component-level
- What the render dependency chain looks like (what must load before what renders)

State your inferences explicitly before producing outputs. If something is ambiguous,
name the ambiguity and state your assumption.

---

## Step 4 — Produce Five Outputs

Produce all five, in this order, every time.

---

### Output 1 — Style Profile

Typography, color, and spacing tokens derived from the input.

```sql
INSERT INTO site_style_profiles (
  profile_key,
  display_name,
  tokens
) VALUES (
  'profile_key',
  'Human-readable name',
  '{
    "color": {
      "background": "#hex",
      "surface": "#hex",
      "text_primary": "#hex",
      "text_secondary": "#hex",
      "accent": "#hex",
      "border": "#hex"
    },
    "typography": {
      "display_family": "Font Name",
      "body_family": "Font Name",
      "scale": {
        "display": "clamp(2rem, 5vw, 4rem)",
        "heading": "clamp(1.5rem, 3vw, 2.5rem)",
        "body": "1rem",
        "caption": "0.875rem"
      },
      "weight": {
        "display": "700",
        "heading": "600",
        "body": "400"
      }
    },
    "spacing": {
      "section_gap": "6rem",
      "component_gap": "2rem",
      "content_gap": "1rem",
      "container_max": "1200px",
      "container_padding": "1.5rem"
    },
    "motion": {
      "duration_fast": "150ms",
      "duration_base": "300ms",
      "easing": "cubic-bezier(0.4, 0, 0.2, 1)"
    },
    "radius": {
      "sm": "4px",
      "md": "8px",
      "lg": "16px"
    }
  }'::jsonb
);
```

---

### Output 2 — Content Placement

Sections and slots in render order. Maps what appears where and what DB field
feeds each slot.

```sql
INSERT INTO page_content_placement (
  page_key,
  section_key,
  slot_key,
  slot_type,        -- 'headline' | 'body' | 'media' | 'cta' | 'list' | 'embed'
  render_order,
  db_source_table,
  db_source_column,
  is_required,
  fallback_behavior  -- 'held' | 'hidden' | 'unavailable'
) VALUES
  ('page_key', 'hero', 'headline',    'headline', 1,  'pages',   'hero_headline',    true,  'held'),
  ('page_key', 'hero', 'subheadline', 'body',     2,  'pages',   'hero_subheadline', false, 'hidden'),
  ('page_key', 'hero', 'media',       'media',    3,  'media_map', 'hero_image_url', false, 'held'),
  ('page_key', 'hero', 'cta',         'cta',      4,  'pages',   'hero_cta_label',   false, 'hidden');
```

Capture every visible slot. Mark required vs. optional. Define fallback behavior
for each — never leave it undefined.

---

### Output 3 — Site Settings and Branding

Global settings that apply across the site, not just this page.

```sql
INSERT INTO site_settings (
  setting_key,
  setting_group,   -- 'branding' | 'seo' | 'social' | 'contact' | 'feature_flags'
  value,
  is_public        -- true = safe to expose in client bundle
) VALUES
  ('site_name',       'branding', '"Site Name"',              true),
  ('site_tagline',    'branding', '"Tagline here"',           true),
  ('logo_url',        'branding', '"https://..."',            true),
  ('favicon_url',     'branding', '"https://..."',            true),
  ('accent_color',    'branding', '"#hex"',                   true),
  ('contact_email',   'contact',  '"hello@domain.com"',       true),
  ('og_image_url',    'seo',      '"https://..."',            true),
  ('twitter_handle',  'social',   '"@handle"',                true);
```

Pull branding values from the style profile where they overlap. Site settings
and style profile are separate concerns — settings are operational,
style profile is visual.

---

### Output 4 — DB Schema

Tables, columns, and relations needed to seat all content for this page.

Structure:

```sql
-- 1. Create tables
CREATE TABLE IF NOT EXISTS {table_name} (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  is_active   boolean NOT NULL DEFAULT true,
  -- content columns here
);

-- 2. Add indexes
CREATE INDEX IF NOT EXISTS {table_name}_{column}_idx ON {table_name} ({column});

-- 3. Enable RLS
ALTER TABLE {table_name} ENABLE ROW LEVEL SECURITY;

-- 4. Public read policy (adjust per project auth model)
CREATE POLICY "public_read_{table_name}"
  ON {table_name} FOR SELECT
  USING (is_active = true);

-- 5. Seed required rows
INSERT INTO {table_name} (...) VALUES (...);
```

Rules:
- Every table gets `id`, `created_at`, `updated_at`, `is_active`
- Use `jsonb` for structured content that varies by page (e.g. `approved_content_contract`)
- Use typed columns for content that is filtered, sorted, or joined
- Propose FK relations explicitly — never leave implicit
- Include RLS for every table
- Seed the minimum required rows so the runtime does not start empty

---

### Output 5 — Render Runtime Plan

How the frontend reads from DB and renders each section. Written as a dependency
map, not code — the plan Claude or the developer implements.

Format:

```
PAGE: {page_key}
  │
  ├─ LOAD: {primary_table} WHERE page_key = '{page_key}' AND is_active = true
  │     └─ IF NULL → render <UnavailableState surface="{page_key}" />
  │
  ├─ SECTION: hero
  │     ├─ headline     ← pages.hero_headline          (required → held if null)
  │     ├─ subheadline  ← pages.hero_subheadline       (optional → hidden if null)
  │     ├─ media        ← media_map WHERE role='hero_image' AND is_active=true
  │     │     └─ IF NULL → render held media placeholder
  │     └─ cta          ← pages.hero_cta_label + pages.hero_cta_url
  │           └─ IF NULL → hidden
  │
  ├─ SECTION: {next_section}
  │     └─ ...
  │
  └─ RENDER ORDER: hero → {section_2} → {section_3} → footer
```

State every dependency. State every null path. The runtime plan is the contract
between DB and renderer — it should have no ambiguities.

---

## Step 5 — Confirm Before SQL

After producing the five outputs as structured prose/pseudocode, pause:

```
Ready to generate SQL. Before I do:
- Style profile: {n} tokens across color, type, spacing, motion, radius
- Content placement: {n} slots across {n} sections
- Site settings: {n} entries across {n} groups
- Schema: {n} tables, {n} new / {n} extending existing
- Runtime plan: {n} sections, dependencies mapped

Confirm to generate migration SQL, or flag anything to adjust first.
```

Do not generate SQL until confirmed. Schema decisions are hard to undo.

---

## Step 6 — Deliver SQL

After confirmation, produce a single migration file:

```sql
-- ============================================================
-- Migration: {page_key}_schema_v1
-- Generated: {date}
-- Sections: style_profile, site_settings, content_placement,
--           schema, seed
-- ============================================================

-- STYLE PROFILE
-- ...

-- SITE SETTINGS
-- ...

-- CONTENT PLACEMENT
-- ...

-- SCHEMA
-- ...

-- SEED
-- ...
```

Label every section. Keep the file runnable top-to-bottom with no manual steps.
Include `IF NOT EXISTS` and `ON CONFLICT DO NOTHING` guards throughout so the
migration is safe to re-run.

---

## Handling Ambiguity

| Situation | Action |
|-----------|--------|
| Input shows content but DB source is unclear | State assumption, mark with `-- ASSUMPTION:` comment in SQL |
| Existing table could extend but isn't a clean fit | Propose extension AND new table, let user choose |
| Branding visible in image but hex values unclear | Derive closest value, flag as `-- APPROXIMATE:` |
| Section exists in input but purpose is unclear | Name it, describe what it appears to do, ask for confirmation |
| DB has no existing schema | Propose full schema from scratch, clearly marked as greenfield |

---

## What This Skill Does Not Do

- Does not write React/TypeScript component code (that is implementation, not schema)
- Does not deploy or run migrations (outputs SQL only)
- Does not invent content to fill DB rows (seeds structure, not fabricated copy)
- Does not make auth decisions (marks RLS policies as adjust-per-project)
- Does not override existing schema without explicit confirmation

---

## Reference Files

See `references/` for:

- `schema-patterns.md` — common table patterns (media_map, content_placement, site_settings)
- `style-profile-tokens.md` — full token reference with defaults
- `runtime-plan-examples.md` — example runtime plans for common page types

Load when needed. Do not load all at once.
