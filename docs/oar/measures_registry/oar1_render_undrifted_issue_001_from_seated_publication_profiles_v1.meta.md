---
document_type: oar1
authority_level: closeout
document_scope: runtime_render
title: OAR1 — Render unDrifted Issue 001 From Seated Publication Profiles
status: browser_qa_pending
version: v1
operator: op044
system: measures_registry
surface: undrifted
source_oar2: docs/oar/measures_registry/oar2_render_undrifted_issue_001_from_seated_publication_profiles_v1.meta.md
final_seat_standing: rendered
---

# OAR1 — Render unDrifted Issue 001 From Seated Publication Profiles v1

## Closeout

```yaml
closeout:
  status: browser_qa_pending
  db_mutation: false
  src_mutation: true
  frontend_mutation: true
  branch: measures
  files_changed:
    - src/measures_registry/registered_runtime/renderers/RegisteredStructuralDrift.tsx
    - src/measures_registry/registered_runtime/chambers/LapisChamberRuntime.tsx
    - src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
    - src/measures_registry/registered_runtime/styles/registry.visual-system.css
```

---

## DB State Before Execution

All seated publication profiles confirmed before implementation.

```yaml
measures_publication_registry (undrifted):
  publication_type: digital magazine ✓
  metadata.issue_record: seated ✓
  metadata.style_profile: seated ✓
  metadata.media_profile: seated ✓
  metadata.cover_story: seated ✓
  metadata.next_issue_teaser: seated ✓
  metadata.footer_record: seated ✓
  metadata.role_call_feature: seated ✓

measures_registry (undrifted_publication_landing):
  metadata.content_profile: seated ✓
  metadata.assessment_feature: seated ✓
  metadata.role_call_feature: seated ✓
  metadata.landing_design_contract.edition_marker: "ISSUE 001 • JUNE 2026 • LAUNCH EDITION" ✓
  metadata.landing_design_contract.hero.cover_eyebrow: "ISSUE 001 • JUNE 2026 • LAUNCH EDITION" ✓
  metadata.featured_article_set[agents_with_keys]: title, description, article_url, dispatch_key ✓
  metadata.featured_article_set[fables_and_myths]: title, description, article_url, dispatch_key ✓

measures_media_map:
  ai_isnt_broken_landing: active ✓ (static hero)
  agents_with_keys_cover: active ✓
  fables_and_myths_cover: active ✓
```

---

## Route 1 — Section 1: Masthead

```yaml
change: masthead tagline source corrected
from: brandCopy.principles_line ("Measure · Detect · Correct · Govern")
to:   contentProfile.tagline ("THE PUBLICATION FOR GOVERNED SYSTEM ENVIRONMENTS")
fallback: brandCopy.principles_line (if content_profile absent)
edition_marker: landingContract.edition_marker ("ISSUE 001 • JUNE 2026 • LAUNCH EDITION") — unchanged
```

**Removed:** stale `Measure · Detect · Correct · Govern` as masthead principles line.
**Added:** `content_profile.tagline` as primary masthead principles line.

---

## Route 2 — Section 2: Hero Cover

```yaml
change: video element removed from cover
from: <video> element using questionsUngovernedVideoUrl
to:   <img> element using aiIsntBrokenLandingUrl
hero_media_role: ai_isnt_broken_landing
static_only: true
autoplay: false
video: false
```

**Removed:** `<video>` element. Hero is static image only — magazine cover presentation.

---

## Route 3 — Section 3: Cover Story

```yaml
change: headline and deck source corrected
cover_headline:
  from: brandCopy.primary_line ("Structural drift is detectable. Collapse is not the default.")
  to:   coverStory.feature_headline ("AI ISN'T BROKEN. SYSTEMS ARE.")
cover_deck:
  from: heroContract.description (stale)
  to:   coverStory.feature_deck ("Measures Registry launches with Integrity Governance...")
added:
  cover_positioning: coverStory.feature_positioning ("THE STANDARD FOR AI SYSTEMS GOVERNANCE.")
  core_distinction: coverStory.core_distinction ("We do not govern AI. We govern the systems that produce AI outcomes.")
```

Core distinction rendered in `.undrifted-cover-assessment` panel (bordered editorial style).

---

## Route 4 — Section 4: Editor's Feature (Assessment)

```yaml
change: herald section replaced with editor's feature section
from: undrifted-herald (hardcoded "About Measures Registry", "c3 Field", "Assess the Environment")
to:   undrifted-editor-feature (DB-seated assessment_feature)
source:
  feature_label: assessmentFeature.feature_label ("EDITOR'S FEATURE")
  feature_title: assessmentFeature.feature_title ("ASSESS THE ENVIRONMENT")
  feature_body:  assessmentFeature.feature_body
  cta_label:     assessmentFeature.cta_label ("BEGIN ASSESSMENT →")
  route_path:    assessmentFeature.route_path ("/ai-operations-assessment")
```

**Removed:** hardcoded Herald section ("About Measures Registry", "c3 Field", "Assess the Environment").
**Added:** `.undrifted-editor-feature` section from `assessment_feature` seated authority.

---

## Route 5 — Section 5: Feature Articles

```yaml
change: article overlay removed; "Read the Dispatch →" link rendered for all articles with article_url
from: onClick handler opening selectedManifestArticle overlay for articles without URL
to:   <a href={articleUrl}> for all articles with seated article_url
agents_with_keys_article_url: https://paragraph.com/@undrifted/agents-with-keys ✓
fables_and_myths_article_url: https://paragraph.com/@undrifted/fables-and-myths ✓
```

**Removed:** `selectedManifestArticle` state and article overlay modal.
**Kept:** `featuredArticleSet` grid, article cover media via `manifestCover()`.

---

## Route 6 — Section 6: Role Call

```yaml
change: new section added
source: role_call_feature (seated in landing record)
feature_label: "ROLE CALL"
feature_title: "ALL POSITIONS AVAILABLE"
feature_tagline: "WHAT IS YOURS?"
positions: [Connect, Contribute, Create]
cta_label: "Connect · Contribute · Create →"
cta_destination: onOurStory callback → window.open("https://c3field.online", "_blank")
```

**Leadership Briefing and Leadership Call:** not rendered. Superseded by Role Call per SEND.CARD.

**Outstanding:** `role_call_feature.destination_url` is not seated in DB. `https://c3field.online` is resolved via `onOurStory` callback in MeasuresRegistryRuntimeRegistered (infrastructure layer). Future OAR: seat `destination_url` in role_call_feature.

---

## Route 7 — Section 7: Next Issue

```yaml
change: new section added
source: next_issue_teaser (seated in publication registry)
feature_label: "NEXT ISSUE"
feature_title: "FROM ASSESSMENT TO ACTION"
feature_body:  "What happens after drift is detected?..."
release_hint:  "COMING JULY 2026"
```

---

## Route 8 — Section 8: Footer

```yaml
change: footer content source corrected
from: social links only (connect footer was minimal)
to:   footer_record lines + social links
footer_line_1: footerRecord.footer_line_1 ("MEASURE. DETECT. CORRECT. GOVERN.")
footer_line_2: footerRecord.footer_line_2 ("COHERENCE IS NOT ASSUMED. IT IS MAINTAINED.")
```

---

## CSS Added

```yaml
new_classes:
  - .undrifted-editor-feature       (editor's feature section layout)
  - .undrifted-role-call            (role call section layout)
  - .undrifted-role-call-tagline    (tagline style)
  - .undrifted-role-call-positions  (positions list — flex, uppercase, cyan)
  - .undrifted-next-issue           (next issue teaser layout)
  - .undrifted-footer-line          (footer record text lines)
```

---

## Props Changed

```yaml
RegisteredStructuralDrift:
  added: onOurStory: () => void
  removed_usage: questionsUngovernedVideoUrl (prop retained in type, not rendered)
  removed_usage: undriftedFillUrl (prop retained in type, not rendered)
  removed_state: selectedManifestArticle (useState removed entirely)

LapisChamberRuntime:
  added: onOurStory: () => void (type + destructure + prop passthrough)

MeasuresRegistryRuntimeRegistered:
  added: onOurStory={() => window.open("https://c3field.online", "_blank", "noreferrer")}
```

---

## Validation Checklist

```yaml
masthead_renders_from_db_authority:     pending browser_qa
hero_renders_from_ai_isnt_broken_landing: pending browser_qa
publication_identity_is_undrifted:     pending browser_qa
measures_registry_renders_as_cover_story: pending browser_qa
assessment_feature_renders:            pending browser_qa
agents_with_keys_renders:              pending browser_qa
fables_and_myths_renders:              pending browser_qa
role_call_renders:                     pending browser_qa
next_issue_renders:                    pending browser_qa
footer_renders:                        pending browser_qa
no_stale_measures_registry_ownership:  resolved in code
no_video_hero:                         resolved in code
no_frontend_owned_content:             resolved in code
typescript_errors:                     none (tsc --noEmit clean)
```

---

## Final Standing

```yaml
routes_rendered:
  route_1_masthead:         rendered (contentProfile.tagline)
  route_2_hero_cover:       rendered (static image, no video)
  route_3_cover_story:      rendered (coverStory feature fields)
  route_4_editors_feature:  rendered (assessmentFeature, herald removed)
  route_5_feature_articles: rendered (article_url links, overlay removed)
  route_6_role_call:        rendered (roleCallFeature, onOurStory wired)
  route_7_next_issue:       rendered (nextIssueTeaserFeature)
  route_8_footer:           rendered (footerRecord lines)

db_mutation: false
map_unchanged: true
payment_unchanged: true
assessment_flow_unchanged: true
final_seat_standing: browser_qa_pending
```
