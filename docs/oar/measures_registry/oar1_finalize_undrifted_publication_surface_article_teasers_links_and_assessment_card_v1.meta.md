---
document_type: oar1
authority_level: closeout
document_scope: undrifted_publication_surface_refinement
title: OAR1 — Finalize unDrifted Publication Surface, Article Teasers, Links, and Assessment Card v1
status: browser_qa_pending
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_finalize_undrifted_publication_surface_article_teasers_links_and_assessment_card_v1.md
final_seat_standing: held_browser_qa
---

# OAR1 — Finalize unDrifted Publication Surface, Article Teasers, Links, and Assessment Card v1

## Closeout

```yaml
closeout:
  status: browser_qa_pending
  db_migration_applied: true
  renderer_updated: true
  css_updated: true
  cloudflare_build: triggered
  final_seat_standing: held_browser_qa
```

---

## Phase 1 — Article Authority Path Findings

### Mismatch Table

| | Agents With Keys | Fables and Myths |
|---|---|---|
| `featured_article_set.article_url` | absent | absent |
| `featured_article_set.article_route` | null | `/publication/structural_drift/fables_and_myths_dispatch_v1` |
| `featured_article_set.publication_state` | `"unpublished"` | `"published"` |
| Matching dispatch row | `agents_of_chaos_dispatch_v1` | `fables_and_myths_dispatch_v1` |
| Paragraph URL | `https://paragraph.com/@undrifted/agents-of-chaos` | `https://paragraph.com/@undrifted/fables-and-myths` |
| Renderer field read | `article.article_url ?? article.external_url` | `article.article_url ?? article.external_url` |
| Rendered result before fix | overlay (unpublished) | overlay (published but no article_url) |

### Root Cause

The renderer reads `article.article_url` and `article.external_url` from `featured_article_set` entries. Neither field was present. `article_route` (internal path) was seated for Fables and Myths but the renderer does not read that field. Agents With Keys had no route and `publication_state=unpublished`.

### Fix

Migration `202606230002_featured_article_set_article_url_and_teasers.sql` — `jsonb_set` on `measures_registry.metadata.featured_article_set` for `registry_key = 'undrifted_publication_landing'`:

```yaml
agents_with_keys:
  article_url: "https://paragraph.com/@undrifted/agents-of-chaos"
  article_route: "/publication/structural_drift/agents_of_chaos_dispatch_v1"
  publication_state: "published"

fables_and_myths:
  article_url: "https://paragraph.com/@undrifted/fables-and-myths"
  article_route: "/publication/structural_drift/fables_and_myths_dispatch_v1"
  publication_state: "published"
```

### Paragraph Linkage

```yaml
agents_with_keys:
  paragraph_publication: "@undrifted"
  paragraph_article_slug: "agents-of-chaos"
  paragraph_url: "https://paragraph.com/@undrifted/agents-of-chaos"
  dispatch_key: "agents_of_chaos_dispatch_v1"

fables_and_myths:
  paragraph_publication: "@undrifted"
  paragraph_article_slug: "fables-and-myths"
  paragraph_url: "https://paragraph.com/@undrifted/fables-and-myths"
  dispatch_key: "fables_and_myths_dispatch_v1"
```

---

## Phase 2 — Article Card Teasers

Teaser copy seated in DB as `description` field on each `featured_article_set` entry.

### Agents With Keys

```
As AI systems gain access to credentials, APIs, operational workflows, and financial authority,
the question is no longer what an agent can do. The question is who governs it.
```

### Fables and Myths

```
Most AI failures do not begin as technical failures. They begin as stories institutions tell
themselves about control, certainty, accountability, and responsibility.
```

Renderer reads: `asString(article.description) ?? asString(article.subtitle)`. Both seated as `description`. No renderer change required for teasers.

---

## Phase 3 — Assessment Promotion Surface

Replaced `undrifted-dispatch-card--visual` (previously "Leadership for Governed Environments.") with assessment card.

```yaml
eyebrow: "Assessment"
h2: "Structural Drift Is Detectable."
body: "AI isn't broken. Systems are. Assess operational standing, identify structural drift, and discover the next governed pathway."
cta: "Assess the Environment →"
route: "/ai-operations-assessment"
```

Card retains `undrifted-dispatch-card--visual` class for gradient background treatment.

CSS updated: added `span` and `p` to z-index rule so all text content in visual card layers above the fill image.

---

## Phase 4 — c3 Field Surface Refinement

Replaced second dispatch card with governance-specific copy.

```yaml
removed: eyebrow "Leadership"
h2: "c3 Field" (unchanged)
body: "Nothing exists in isolation. The c3 Field provides the governance framework through which Measures Registry, unDrifted, Measures of Inanna, and future registered systems maintain continuity across environments."
cta: "Explore Our Story →" (was "c3 Field / Our Story →")
```

---

## Phase 5 — Visual Corrections

### Logo

Operator replaced asset at same storage path. Cache standing: browser QA required. The runtime loads `measures_registry_logo` via `resolveRuntimeMediaUrl` → Supabase storage public URL. URL unchanged. CDN cache behavior pending browser verification.

### Hero Still State

```yaml
video_element: "questions_ungoverned_systems_cannot_answer.mp4"
poster: "ai_isnt_broken_landing.webp"
autoplay: false
preload: "metadata"
state: "seated still state confirmed — poster shown before play"
```

No change required. Already correct.

### Alignment

CSS z-index rule for `undrifted-dispatch-card--visual` extended to include `span` and `p`. No other layout changes. Further alignment adjustments pending browser QA.

---

## Files Changed

```yaml
commit: f8ab120
branch: measures
new_files:
  - supabase/migrations/202606230002_featured_article_set_article_url_and_teasers.sql
modified_files:
  - src/measures_registry/registered_runtime/renderers/RegisteredStructuralDrift.tsx
  - src/measures_registry/registered_runtime/styles/registry.visual-system.css
```

---

## Migration History Repair

```yaml
cli_version: 2.75.0
issue: supabase db push failed — remote had migration versions absent from local directory
resolution:
  - marked orphaned remote-only versions as reverted (202605220001, 202606090001–202606100006)
  - marked all local migration files as applied in remote history
  - marked 202606230001 as applied (was applied directly in prior session, not tracked)
  - pushed 202606230002 cleanly
migration_history_standing: synced
```

---

## Browser QA

```yaml
status: pending
trigger: Cloudflare Pages build from commit f8ab120
verify:
  - Agents With Keys card shows teaser and "Read Article →" linking to paragraph.com/@undrifted/agents-of-chaos
  - Fables and Myths card shows teaser and "Read Article →" linking to paragraph.com/@undrifted/fables-and-myths
  - Article cards no longer show "Open Article Standing" overlay
  - Third dispatch card shows assessment surface (not "Leadership for Governed Environments.")
  - Assessment CTA routes to /ai-operations-assessment
  - c3 Field card shows governance framework copy and "Explore Our Story →"
  - Hero video opens from still poster state
  - Replacement logo renders with correct resolution
  - No publication regressions
```

---

## Final Standing

```yaml
repair_standing: browser_qa_pending
db_migration_applied: true
renderer_deployed: true
lapis_chamber_isolation: preserved
chamber_boundaries: unchanged
final_seat_standing: held_browser_qa

seat_advancement:
  current: held_browser_qa
  requires:
    - Cloudflare Pages build completes (commit f8ab120)
    - browser QA passes on all Phase 1–5 items
```
