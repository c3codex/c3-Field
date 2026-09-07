---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR1 - Seed Undrifted Encounter Definition From Registered Publication Records
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_seed_undrifted_encounter_definition_from_registered_publication_records_v1
---

# OAR1 - Seed Undrifted Encounter Definition From Registered Publication Records

## EXECUTION METHOD

Live DB queried: measures_publication_registry and measures_publication_dispatch for
publication_key = 'undrifted'. LapisChamberRenderer.tsx UnDriftedIndex metadata schema
mapped from source records. Migration 202606300017 written and applied via
`npx supabase db push` (exit code 0). Post-migration verify confirmed row exists via
PostgREST anon query. TypeScript `npx tsc --noEmit` zero errors.

---

## PRE-MUTATION STATE

### measures_encounter_def for encounter_key = 'undrifted'

- Row: **ABSENT**
- registryResolver ENCOUNTER_DEF_KEYS: 'undrifted' present (key was queued in prior OAR)
- Result: registryResolver returns encounterDef = null for undrifted surface
- UnDriftedIndex renders: empty shell (no masthead, cover, articles, assessment, role call, footer)

---

## POST-MUTATION STATE

### measures_encounter_def for encounter_key = 'undrifted'

| Field | Value |
|---|---|
| encounter_key | `undrifted` |
| display_title | `unDrifted` |
| encounter_type | `view` |
| material_family | `lapis` |
| surface_type | `threshold` |
| is_active | `true` |

### Metadata sections seeded

| Section | Source | Key fields |
|---|---|---|
| `brand_copy` | measures_publication_registry | header: "unDrifted", principles_line: "Measure · Detect · Correct · Govern" |
| `brand_assets` | measures_publication_registry | primary_full_lockup_path: "/undrifted_logo.png" |
| `style_contract` | measures_publication_registry | key: "undrifted_publication_style_v1" |
| `landing_design_contract` | derived from pub registry (landing key) | cover_eyebrow: "ISSUE 001 — LAUNCH EDITION", insights_eyebrow: "DISPATCHES FROM MEASURES REGISTRY", insights_heading: "FEATURE ARTICLES", landing_contract_key, style_contract_key |
| `issue_record` | measures_publication_registry | issue_number: "001", issue_date: "June 2026", edition: "Launch Edition" |
| `cover_story` | measures_publication_registry | feature_headline: "AI ISN'T BROKEN. SYSTEMS ARE.", feature_deck, feature_positioning |
| `assessment_feature` | OAR2 requirement | route_path: "/ai-operations-assessment", cta_label: "Assess the Environment", feature_label: "ASSESSMENT", feature_title: "AI Operations Assessment" |
| `featured_article_set` | measures_publication_dispatch (2 records) | agents_with_keys_dispatch_v1 (Agents With Keys), fables_and_myths_dispatch_v1 (Fables & Myths) |
| `role_call_feature` | measures_publication_registry | ROLE CALL — ALL POSITIONS AVAILABLE, WHAT IS YOURS? |
| `next_issue_teaser` | measures_publication_registry | FROM ASSESSMENT TO ACTION — COMING JULY 2026 |
| `footer_record` | measures_publication_registry | MEASURE. DETECT. CORRECT. GOVERN. / COHERENCE IS NOT ASSUMED. IT IS MAINTAINED. |

### featured_article_set inventory

| Dispatch key | Title | article_url | media_role | publication_state |
|---|---|---|---|---|
| agents_with_keys_dispatch_v1 | Agents With Keys | https://paragraph.com/@undrifted/agents-with-keys | agents_with_keys_cover | published |
| fables_and_myths_dispatch_v1 | Fables & Myths | https://paragraph.com/@undrifted/fables-and-myths | fables_and_myths_cover | published |

OAR2 stated "known records: Measures Registry, unDrifted" but additional dispatch records
(agents_with_keys, fables_and_myths, agents_of_chaos, structural_drift) were confirmed present
in measures_publication_dispatch. The two with feature_label = "FEATURE ARTICLE" and cover
media_roles were included per OAR2 rule: "Additional articles may be included only if registered
records exist." agents_of_chaos and structural_drift are diagnostic trace/field note records
without cover media roles and were not included in featured_article_set.

---

## SURFACE_TYPE NOTE

`surface_type = 'publication'` was attempted first but violates
`measures_encounter_def_surface_type_check`. Valid values observed:
`threshold`, `chamberplate`, `aspect`, `passage`, `phase_map`. Used `threshold` (same as
the existing `structural_drift_publication` encounter_def row).

---

## PUBLICATION AUTHORITY — NOT CHANGED

Publication authority remains in:
- measures_publication_registry (brand, cover, issue, style, role_call, next_issue, footer authority)
- measures_publication_dispatch (article records, URLs, dispatch status)

The encounter_def row is a **rendering projection** only. No content was invented.
No publication records were modified. FREE does not query publication tables.

---

## COMPONENT RENDER EXPECTATIONS

UnDriftedIndex (LapisChamberRenderer.tsx:79) reads from `encounter.encounterDef?.metadata`:

| Component field | Metadata path | Seeded value |
|---|---|---|
| `title` / masthead | `brand_copy.header` | "unDrifted" |
| `mastHeadPrinciples` | `brand_copy.principles_line` | "Measure · Detect · Correct · Govern" |
| `primaryLogoPath` | `brand_assets.primary_full_lockup_path` | "/undrifted_logo.png" |
| `styleKey` | `landing_design_contract.style_contract_key` | "undrifted_publication_style_v1" |
| `landingKey` | `landing_design_contract.landing_contract_key` | "undrifted_issue_001_landing_v1" |
| `issueNumber` | `issue_record.issue_number` | "001" |
| `issueDate` | `issue_record.issue_date` | "June 2026" |
| `issueEdition` | `issue_record.edition` | "Launch Edition" |
| `coverEyebrow` | `landing_design_contract.hero.cover_eyebrow` | "ISSUE 001 — LAUNCH EDITION" |
| `coverHeadline` | `cover_story.feature_headline` | "AI ISN'T BROKEN. SYSTEMS ARE." |
| `coverDeck` | `cover_story.feature_deck` | (seeded) |
| `coverPositioning` | `cover_story.feature_positioning` | "THE STANDARD FOR AI SYSTEMS GOVERNANCE." |
| `assessmentFeatureLabel` | `assessment_feature.feature_label` | "ASSESSMENT" |
| `assessmentFeatureTitle` | `assessment_feature.feature_title` | "AI Operations Assessment" |
| `assessmentCtaLabel` | `assessment_feature.cta_label` | "Assess the Environment" |
| `assessmentRoute` | `assessment_feature.route_path` | "/ai-operations-assessment" |
| `featuredArticleSet` | `featured_article_set` | 2 records |
| `roleCallLabel` | `role_call_feature.feature_label` | "ROLE CALL" |
| `roleCallTitle` | `role_call_feature.feature_title` | "ALL POSITIONS AVAILABLE" |
| `roleCallUrl` | `role_call_feature.external_url` | ABSENT (CTA button suppressed — no external URL in source) |
| `nextIssueLabel` | `next_issue_teaser.feature_label` | "NEXT ISSUE" |
| `nextIssueTitle` | `next_issue_teaser.feature_title` | "FROM ASSESSMENT TO ACTION" |
| `nextIssueHint` | `next_issue_teaser.release_hint` | "COMING JULY 2026" |
| `footerLine1` | `footer_record.footer_line_1` | "MEASURE. DETECT. CORRECT. GOVERN." |
| `footerLine2` | `footer_record.footer_line_2` | "COHERENCE IS NOT ASSUMED. IT IS MAINTAINED." |

Media (encounter.mediaByRole): `agents_with_keys_cover` and `fables_and_myths_cover` are listed
in MEDIA_ROLES but not in any MEDIA_CAMPAIGN_KEYS fetch scope — **gap not addressed in this OAR**.
Cover image media rows for the two article cards may not render if not in the media fetch.

---

## GAPS — NOT ADDRESSED IN THIS OAR

### 1. agents_with_keys_cover and fables_and_myths_cover media fetch scope

MEDIA_ROLES in registryResolver.ts includes `agents_with_keys_cover` and
`fables_and_myths_cover` (lines 58-59), but the `MEDIA_CAMPAIGN_KEYS` used in the resolver
query determines which rows are fetched. If these media roles are not associated with a
campaign in MEDIA_CAMPAIGN_KEYS, the article card cover images will not resolve (null).
Text and links will still render. Requires media row audit — separate OAR.

### 2. role_call_feature external_url absent

The `role_call_feature.external_url` field is absent from source records. UnDriftedIndex
suppresses the CTA button when external_url is null (line 360: `roleCallUrl && roleCallCtaLabel`).
The role call section title, body, and tagline render; the CTA link is suppressed.
Seating the external_url requires a separate OAR that defines the destination.

### 3. assessment_feature.feature_body absent

No feature_body was available from source records without inventing copy. The assessment
feature section renders heading and CTA; body paragraph is suppressed. A separate OAR
may seat assessment copy from existing brand language if desired.

---

## VALIDATION CHECKLIST

| Item | Status |
|---|---|
| Pre-migration encounterDef absent confirmed | ✓ |
| content_source: publication records only, not invented | ✓ |
| measures_publication_registry not modified | ✓ |
| measures_publication_dispatch not modified | ✓ |
| surface_type check constraint respected | ✓ (threshold, not publication) |
| Migration 202606300017 applied exit code 0 | ✓ |
| Post-migration row confirmed via PostgREST | ✓ |
| encounter_key = 'undrifted' confirmed in row | ✓ |
| brand_copy fields present in metadata | ✓ |
| cover_story fields present | ✓ |
| issue_record fields present | ✓ |
| featured_article_set 2 records from dispatch | ✓ |
| assessment_feature route_path = /ai-operations-assessment | ✓ |
| role_call_feature fields present | ✓ |
| next_issue_teaser fields present | ✓ |
| footer_record fields present | ✓ |
| landing_design_contract fields present | ✓ |
| No article content invented | ✓ |
| No publication authority changed | ✓ |
| TypeScript tsc --noEmit zero errors | ✓ |

---

## FINAL DISPOSITION

**SEATED** — measures_encounter_def row for encounter_key = 'undrifted' seeded.

registryResolver will now return encounterDef for undrifted. UnDriftedIndex no longer renders
an empty shell. Masthead, cover, issue rail, assessment feature, featured article cards,
role call, next issue teaser, and footer all have source data.

Three gaps deferred: article cover media fetch scope, role_call external_url,
assessment feature body copy.

Lapis holds publications.
The encounter can now encounter them.
The chamber renders its holdings.

Lapis relates.
Lapis publishes.
Lapis distributes.

Codex holds.
Systems align.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.
FREE renders.

Collapse is not the default.
