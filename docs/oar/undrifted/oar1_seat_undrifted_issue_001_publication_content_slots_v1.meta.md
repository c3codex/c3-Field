---
document_type: oar1
authority_level: working
title: OAR1 — Seat unDrifted Issue 001 Publication Content Slots
status: executed
version: v1
operator: op044
system: undrifted
process_key: seat_undrifted_issue_001_publication_content_slots
source_oar2: docs/oar/undrifted/oar2_seat_undrifted_issue_001_publication_content_slots_v1.meta.md
---

## OBJECTIVE

Seat DB publication content into the three render slots added by the prior OAR2 execution (align_undrifted_runtime_to_issue_001):

- `featured_article_set[*].feature_label` → section eyebrow label per article card
- `featured_article_set[*].teaser` → editorial teaser text per article card
- `assessment_feature.rating_display` → editorial signal for the assessment feature block

All three slots are conditional in the renderer — content activates on load when DB fields are present.

## DB STANDING VERIFIED FIRST

Migration history audited from `supabase/migrations/`:

**Current `featured_article_set` shape (from migrations 202606230002 + 202606240001):**

Agents With Keys:
- `title`: "Agents With Keys"
- `subtitle`: "Systems Without Governance"
- `media_role`: "agents_with_keys_cover"
- `article_url`: "https://paragraph.com/@undrifted/agents-with-keys"
- `description`: "Capability is not authority. Structure prevents drift."
- `dispatch_key`: "agents_with_keys_dispatch_v1"
- `publication_state`: "published"
- `feature_label`: ← ABSENT (render slot not yet seated)
- `teaser`: ← ABSENT (render slot not yet seated)

Fables & Myths:
- `title`: "Fables & Myths"
- `subtitle`: "Institutional Narrative and Policy Risk"
- `media_role`: "fables_and_myths_cover"
- `article_url`: "https://paragraph.com/@undrifted/fables-and-myths"
- `description`: "Anthropic, Fables 5, Mythos 5, and the U.S. government. When institutions narrate capability as control, systems drift becomes policy risk."
- `dispatch_key`: "fables_and_myths_dispatch_v1"
- `publication_state`: "published"
- `feature_label`: ← ABSENT (render slot not yet seated)
- `teaser`: ← ABSENT (render slot not yet seated)

**Current `assessment_feature` shape (from migration 202606240001 Route 6):**
- `feature_key`: "assess_the_environment_editor_feature"
- `feature_label`: "EDITOR'S FEATURE"
- `feature_title`: "ASSESS THE ENVIRONMENT"
- `feature_body`: "A public evaluation revealing structural drift, operational misalignment, authority gaps, and governance risk."
- `cta_label`: "BEGIN ASSESSMENT →"
- `route_path`: "/ai-operations-assessment"
- `rating_display`: ← ABSENT (render slot not yet seated)

**Conflicts found:** None. DB JSON shape supports `jsonb_set` and merge (`||`) patterns for all three fields. Renderer reads them conditionally — no structural mismatch.

## ACTION

**Migration: `supabase/migrations/202606240003_seat_undrifted_issue_001_publication_content_slots.sql`**

### Part 1 — `featured_article_set` labels and teasers

Used merge pattern (`article || jsonb_build_object(...)`) to add new fields without replacing existing article objects. `ORDER BY ordinal` preserves article sequence.

**Agents With Keys:**
- `feature_label`: `'STRUCTURAL DRIFT'` — matches publication topic positioning; surfaces as eyebrow above article title
- `teaser`: `'As AI systems gain access to credentials, APIs, operational workflows, and financial authority, the question is no longer what an agent can do. The question is who governs it.'` — editorial context pull; distinct from the short `description` line

**Fables & Myths:**
- `feature_label`: `'SYSTEM GOVERNANCE'` — matches institutional-narrative topic positioning
- `teaser`: `'Most AI failures do not begin as technical failures. They begin as stories institutions tell themselves about control, certainty, accountability, and responsibility.'` — editorial setup; distinct from the named-subject `description` line

Both `feature_label` values are from OAR2 recommended direction: STRUCTURAL DRIFT, SYSTEM GOVERNANCE, AI ACCOUNTABILITY, INSTITUTIONAL REVIEW. Values chosen to match each article's primary topic.

Both `teaser` values are editorially distinct from existing `description` fields — no duplicate text surfaces in the same card.

### Part 2 — `assessment_feature.rating_display`

Used `jsonb_set` path `'{assessment_feature,rating_display}'` to add one field without replacing the full object.

- `rating_display`: `'Issue 001 Recommended Assessment'` — edition-specific editorial signal; surfaces between the assessment title and body in the `undrifted-assessment-rating` slot

### `.env.local` fix (housekeeping, not OAR2 scope)

Lines 6–8 of `.env.local` contained PowerShell-style variable assignments (`$env:VARIABLE=...`) that are invalid `.env` format. These were breaking Supabase CLI env file parsing, blocking `supabase db push`. Commented them out. They were not active env vars in any Node.js or CLI context; they were accidental pastes from a PowerShell session.

## RESULT

**DB applied:** `supabase db push` — migration `202606240003` applied to project `zfihrspxvennjzazxcbj`. All three validation assertions passed.

**`/undrifted` article cards now surface (when page loads from DB):**
- Eyebrow: `STRUCTURAL DRIFT` above "Agents With Keys"
- Eyebrow: `SYSTEM GOVERNANCE` above "Fables & Myths"
- Teaser: editorial context pull below each article title, above the description

**`/undrifted` assessment feature block now surfaces:**
- `Issue 001 Recommended Assessment` between ASSESS THE ENVIRONMENT heading and body copy

**All existing content preserved.** Merge pattern confirmed via validation assertions in migration:
- Agents With Keys `title`, `description`, `publication_state` unchanged
- Fables & Myths `title`, `publication_state` unchanged
- Assessment feature `feature_key`, `cta_label` unchanged

No hardcoded content was introduced in React. All new content is DB-seated and conditionally rendered.

## CLOSE

Build: `npm run build:registry` — PASSED, 0 TypeScript errors, built in 4.48s

Migration applied: `202606240003_seat_undrifted_issue_001_publication_content_slots.sql` → project `zfihrspxvennjzazxcbj`

Files changed:
- `supabase/migrations/202606240003_seat_undrifted_issue_001_publication_content_slots.sql` (new)
- `docs/oar/undrifted/oar1_seat_undrifted_issue_001_publication_content_slots_v1.meta.md` (this file)
- `docs/oar/undrifted/oar1_align_undrifted_runtime_to_issue_001_publication_system_v1.meta.md` (CLOSE section corrected — prior commit was pending)
- `.env.local` (housekeeping — commented out invalid PowerShell lines blocking CLI)

Commit: `54d82a8` — "Feat: seat unDrifted Issue 001 publication content slots"
Push: pushed to `origin/measures`
