---
document_type: oar1
authority_level: working
title: OAR1 — Fix About Measures Registry Encounter
status: executed
version: v1
operator: op044
system: measures_registry
process_key: fix_about_measures_registry_encounter
source_oar2: docs/oar/measures_registry/oar2_fix_about_measures_registry_encounter_v1.meta.md
---

## OBJECTIVE

Fix the full About Measures Registry encounter for the Understand the Environment path.

Repair the public sequence: Codexstone Seal → About orientation → unDrifted bridge panel → Connect role call.

## DB STANDING VERIFIED FIRST

MCP Supabase unauthorized. DB standing confirmed by reading migration history, source files, and renderer contracts.

### Encounter Audit

**`about_measures_registry` encounter:**
- Registered in `REGISTERED_ENCOUNTER_KEYS` ✓
- Registered in `SURFACE_QUERY` as `"about_measures_registry"` ✓
- Mapped to `/about-measures-registry` in `ROUTE_SURFACE_ALIASES` ✓
- Renderer: `RegisteredAboutMeasuresRegistry` dispatched in surface branch ✓
- Existing content: `approved_content_contract` with `title`, `position_copy`, `connect_contract` — single-page layout, connect is email link only

**Gap found:**
`approved_content_contract` contained only a flat title + copy array + connect email-link card. No Codexstone Seal, no Objective/Action/Result structure, no unDrifted bridge, no form-based Connect.

### Media Audit

| Media Role | Status |
|------------|--------|
| `about_measures_registry_video` | Loaded in `REGISTERED_MEDIA_ROLES`, URL resolved at runtime via `mediaMap` ✓ |
| `official_codexstone_seal` | Loaded in `REGISTERED_MEDIA_ROLES`, URL resolved via `officialCodexstoneSealUrl` ✓ |

`officialCodexstoneSealUrl` was already derived in the runtime from `mediaMap.get("official_codexstone_seal")` but **not passed to `RegisteredAboutMeasuresRegistry`**. This gap is corrected in this OAR.

### Connect Backend Audit

No existing `measures_registry_connect_capture` table in migrations. No generic contact capture table found. Pattern established by `measures_iis_eval_gate1_capture` is used as the model.

**Resolution per OAR2:** Create the table, wire the form. Backend gap is not a blocker — OAR2 explicitly authorized Claude to create the table.

### Route Sequence Audit

`structure_passage` → `RegisteredPublicUnderstand` → `onContinue` → `null` (no governed next surface for `structure_passage` branch).

`about_measures_registry` is accessible via direct URL `/about-measures-registry` and from the Lapis chamber via `onAboutMeasuresRegistry()` which calls `navigate("about_measures_registry")`.

The four-section single-page implementation satisfies the sequence requirement: within `/about-measures-registry`, the encounter presents Codexstone Seal → About → unDrifted bridge → Connect as sequential vertical sections.

## ACTION

### Migration 1: `supabase/migrations/202606240005_seat_about_measures_registry_encounter_content.sql`

Updated `measures_encounter_def` where `encounter_key = 'about_measures_registry'`.

Used `metadata || jsonb_build_object(...)` to replace `approved_content_contract` while preserving all other existing metadata keys.

New `approved_content_contract` structure:

```json
{
  "title": "About Measures Registry",
  "codexstone_seal_section": {
    "title": "Measures Registry",
    "subtitle": "AI outcomes reflect the systems AI operates within.",
    "standing": "public"
  },
  "orientation_sections": [
    { "label": "Objective", "copy": "AI systems are not the problem. The environments they operate within are. Unstructured authority, undefined roles, absent review pathways, and ungoverned runtime surfaces produce drift — not design." },
    { "label": "Action", "copy": "Measures Registry structures assessment, accountability, and governed optimization across institutional AI environments. It defines the system conditions that shape AI behavior and builds the review pathways required to address them." },
    { "label": "Result", "copy": "Institutions operating through Measures Registry gain AI environments that are accountable, reviewable, and less drift-prone — not through AI model changes, but through the institutional systems that determine AI behavior." }
  ],
  "undrifted_bridge_section": {
    "label": "unDrifted",
    "subtitle": "The publication for governed system environments.",
    "issue_label": "Issue 001",
    "headline": "AI Isn't Broken. Systems Are.",
    "cta_label": "Read Issue →",
    "cta_url": "/undrifted",
    "standing": "public"
  },
  "connect_section": {
    "title": "Connect",
    "body": "Request a leadership conversation.",
    "supporting_copy": [
      "Measures Registry works with organizations seeking greater accountability, clearer authority, and better outcomes from AI systems.",
      "Whether assessing current operations, exploring governance structures, or preparing for larger implementation decisions, the first step is a conversation."
    ],
    "fields": [
      { "field_key": "name", "label": "Name", "type": "text", "required": true },
      { "field_key": "organization", "label": "Organization", "type": "text", "required": true },
      { "field_key": "email", "label": "Email", "type": "email", "required": true },
      { "field_key": "message", "label": "Message", "type": "textarea", "required": false }
    ],
    "cta_label": "Request Conversation",
    "success_title": "Received.",
    "success_copy": "Your request has been seated. A member of the Measures Registry team will follow up.",
    "standing": "public"
  }
}
```

Validation block confirms all four top-level section keys present.

### Migration 2: `supabase/migrations/202606240006_create_measures_registry_connect_capture.sql`

Created `measures_registry_connect_capture` table:

```sql
CREATE TABLE public.measures_registry_connect_capture (
  id                 uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  name               text         NOT NULL,
  organization       text         NOT NULL,
  email              text         NOT NULL,
  message            text,
  capture_context    text         NOT NULL DEFAULT 'about_measures_registry_connect',
  notification_state text         NOT NULL DEFAULT 'queued',
  metadata           jsonb        NOT NULL DEFAULT '{}',
  created_at         timestamptz  NOT NULL DEFAULT now()
);
```

RLS: insert-open to public, select requires authenticated.

### Renderer: `src/measures_registry/registered_runtime/renderers/RegisteredAboutMeasuresRegistry.tsx`

Complete rework. Previous single-page flat layout replaced with four-section encounter.

New props added:

| Prop | Source |
|------|--------|
| `officialCodexstoneSealUrl` | `mediaMap.get("official_codexstone_seal")` (already in runtime) |
| `connectFields` | Runtime state `connectFields` |
| `connectSubmitting` | Runtime state |
| `connectSubmitted` | Runtime state |
| `connectError` | Runtime state |
| `onSetConnectField` | Runtime handler |
| `onSubmitConnect` | Runtime handler |

Removed:
- `featuredArticleImageUrl` (not used in new layout; article URL falls back to `bridgeCtaUrl` for bridge link)

Section rendering:

1. `registry-about-seal` — Codexstone Seal image + title + subtitle
2. `registry-about-orientation` — two-column: orientation blocks left, video right (sticky on desktop)
3. `registry-about-bridge` — unDrifted bridge panel as `<a>` linking to article URL or `/undrifted`
4. `registry-about-connect` — two-column: copy left, form right. Form → `onSubmitConnect`. Success state replaces form after submission.

Form fallback: if `connect_section.fields` array is not seated in DB, renderer falls back to hardcoded four-field structure (name, organization, email, message). DB-seated fields take precedence.

Guard: if `approved_content_contract` is null/missing, renders held state (unchanged from prior).

### Runtime: `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`

Added state:

```tsx
const [connectFields, setConnectFields] = useState<Record<string, string>>({})
const [connectSubmitting, setConnectSubmitting] = useState(false)
const [connectSubmitted, setConnectSubmitted] = useState(false)
const [connectError, setConnectError] = useState<string | null>(null)
```

Added handlers:

- `setConnectField(key, value)` — updates `connectFields` state
- `submitConnect(event)` — validates required fields, inserts to `measures_registry_connect_capture`, sets `connectSubmitted` on success

Updated `about_measures_registry` dispatch block to pass all connect state + handlers + `officialCodexstoneSealUrl`.

`featuredArticleImageUrl` removed from props (no longer used in renderer).

### CSS: `src/measures_registry/registered_runtime/styles/encounters/about.css`

Complete rework. Previous cards layout replaced with four-section governed style.

Key layout contracts:

| Section | Layout |
|---------|--------|
| `.registry-about-seal` | Centered flex column, prominent mark + title + subtitle |
| `.registry-about-orientation` | Two-column grid (1fr 1fr), video sticky on desktop |
| `.registry-about-bridge` | Full-width panel, single bordered card link, editorial |
| `.registry-about-connect` | Two-column grid (1fr 1fr), copy left / form right |

Form inputs: dark field treatment, `rgba(255,255,255,0.04)` background, border transitions on focus, no SaaS styling.

Mobile breakpoint (≤ 860px): all two-column grids collapse to single column.

Section dividers: `border-bottom: 1px solid rgba(255,255,255,0.08)` between sections 1–3.

## RESULT

### Encounter sequence (post-repair):

| Position | Section | Content |
|----------|---------|---------|
| 1 | Codexstone Seal | Measures Registry mark + "AI outcomes reflect the systems AI operates within." |
| 2 | About Orientation | "About Measures Registry" title + Objective/Action/Result blocks + video (right column) |
| 3 | unDrifted Bridge | unDrifted → Issue 001 → "AI Isn't Broken. Systems Are." → Read Issue → |
| 4 | Connect | "Connect" title + supporting copy + name/org/email/message form → Request Conversation |

### Route map (unchanged):

`/about-measures-registry` → `about_measures_registry` surface → `RegisteredAboutMeasuresRegistry`

Access paths:
- Direct URL `/about-measures-registry` ✓
- Lapis chamber `onAboutMeasuresRegistry()` ✓

### Style contract: dark, governed, institutional, non-SaaS ✓

### Connect backend:

- Table: `measures_registry_connect_capture` — created and active ✓
- RLS: public insert, authenticated read ✓
- Notification pipeline: `notification_state = 'queued'` ✓
- No notification handler wired (email delivery pipeline not in scope of this OAR2) — **NotChazz flag: Connect form inserts to DB but no email notification is dispatched. Operator notification pipeline for `measures_registry_connect_capture` is an open integration gap.**

### No changes to:

- Assessment surfaces, scoring, MAP, payment
- `/undrifted`, `LapisChamberRuntime`
- Intro, path choice, passage, eval surfaces
- Any other registered surface

## NOTCHAZZ FLAGS

**Flag: Connect capture notification pipeline not wired.**

`measures_registry_connect_capture.notification_state` is set to `'queued'` on insert but no email notification or webhook handler exists for this table. Operator must seat a notification handler (Supabase Edge Function, Resend binding, or similar) to receive submitted Connect requests. This is outside OAR2 scope and requires Chazz/operator standing.

## CLOSE

Build: `npm run build:registry` — PASSED, 0 TypeScript errors

Migrations applied: `supabase db push` to project `zfihrspxvennjzazxcbj`

Files modified:
- `supabase/migrations/202606240005_seat_about_measures_registry_encounter_content.sql` (new)
- `supabase/migrations/202606240006_create_measures_registry_connect_capture.sql` (new)
- `src/measures_registry/registered_runtime/renderers/RegisteredAboutMeasuresRegistry.tsx` (rework)
- `src/measures_registry/registered_runtime/styles/encounters/about.css` (rework)
- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` (connect state + handler + prop pass)
- `docs/oar/measures_registry/oar1_fix_about_measures_registry_encounter_v1.meta.md` (this file)

Commit: `9d0a672` — "Feat: fix About Measures Registry encounter — four-section sequence with Connect form"
Push: pushed to `origin/measures`
