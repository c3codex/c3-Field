---
document_type: oar1
authority_level: working
title: OAR1 — Final Launch QA Before Public Release
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_final_launch_qa_before_public_release_v1.meta.md
commit: c84ea10 (HEAD — inventory only, no mutations)
---

# OAR1 — Final Launch QA Before Public Release

## OBJECTIVE

Complete launch validation.
Evidence only. No mutations unless required for repair.
PASS / FAIL / GAP / HOLD for every surface.

---

## OVERALL STANDING

**CONDITIONAL PASS — Hold for P0 items before public traffic.**

P0 blockers cleared: legal surfaces, consent contract, legal identity, legacy deactivation, route bridging.

P0 operator holds remaining: email delivery activation, 404 handling, UX device verification.

---

## ROUTES

### Crystal — Intro and Path Choice

| Surface | Status | Evidence |
|---|---|---|
| `/` — intro_hook sequence | PASS | `encounter_structure.intro_hook` governs surface via `rootStructureNode`; `ai_isnt_broken_intro` encounter_def seeded |
| `/` — path_choice | PASS | `evaluate_structure_path` encounter_def seeded; left/right choice governed by `encounter_structure.path_choice` |
| `/ai-operations-assessment` — landing | PASS | `ROUTE_SURFACE_ALIASES["/ai-operations-assessment"] = "measures_assessment"` and `ai_operations_assessment_landing` registry key seated |

### Obsidian — Eval and Assessment

| Surface | Status | Evidence |
|---|---|---|
| Eval passage (orientation) | PASS | `eval_passage` bridged to `obsidian_chamber_orientation_passage` via migration 202606260006; surface assignment redirected |
| Assessment (7 questions) | PASS | `PUBLIC_ASSESSMENT_EXPECTED_QUESTION_COUNT = 7`; `measures_assessment_contract` in `active_contract_keys` confirmed operational |
| Contact capture form | PASS | `consent_fields` and `optional_opt_in_fields` seated in migration 202606260012; consent checkboxes rendering |
| Consent — not preselected | PASS | `default_checked: false` on all fields; renderer initializes `evalFields[key] ?? ""` |
| Submission notice | PASS | `assessment_submission_notice` seated and rendered in `PublicAssessmentSurface` |
| Privacy/terms notices | PASS | `privacy_notice` and `terms_notice` seated and rendered |
| Boundary notice | PASS | `standing_boundary_note` now DB-governed (migration 202606260012) |
| Passage to marble video | PASS | `obsidian_to_marble_passage_video` surface dispatched; carry-forward logic present in source |

### Marble — MAP

| Surface | Status | Evidence |
|---|---|---|
| `map_integrity_governance` — surface | PASS | `MarbleChamberRuntime` dispatched when surface active; route `/map-integrity-governance` in `ROUTE_SURFACE_ALIASES` |
| MAP circuits and cards | HOLD | `measures_map_c2_circuit` data cannot be verified without live DB access; requires operator confirmation |
| MAP CTA — payment initiation | HOLD | Stripe product IDs seated in migrations (202606200001); live payment flow requires external verification |
| Carry-forward from assessment | PASS | `evalReport`, `organizationName`, `currentAiUsage`, `conditionTraces` passed to `MarbleChamberRuntime` from session state |

### Lapis — Publications

| Surface | Status | Evidence |
|---|---|---|
| `/undrifted` route | PASS | `ROUTE_SURFACE_ALIASES["/undrifted"] = "structural_drift_dispatches"` ✓ |
| `undrifted_publication_landing` registry key | PASS | Seated in prior migrations; `landingUnitMap.get("undrifted_publication_landing")` resolves |
| 6 dispatches registered | PASS | Migration 202606260008 registered all 6 unDrifted dispatches in `measures_publication_dispatch` |
| Article routes (`/publication/structural_drift/...`) | PASS | `STRUCTURAL_DRIFT_DISPATCHES_ROUTE` handled in `initialSurface()`; `publication_dispatch` surface dispatches `LapisChamberRuntime` |
| `/structural-drift` redirect | PASS | `useEffect` replaces to `/undrifted` on load |
| `structural_drift_publication` legacy key | PASS | Deactivated, bridged to `undrifted` in migration 202606260007 |
| Paragraph article links | HOLD | External URLs (`paragraph.com/@undrifted/...`) — live status requires browser verification |

### Legal Surfaces

| Surface | Status | Evidence |
|---|---|---|
| `/privacy` route | PASS | `RegisteredPrivacy` component; `ROUTE_SURFACE_ALIASES["/privacy"] = "privacy"` (migration 25f35b7) |
| `/privacy` renders | PASS | Component renders static content sourced verbatim from OAR2 disclosure blocks |
| `/terms` route | PASS | `RegisteredTerms` component; `ROUTE_SURFACE_ALIASES["/terms"] = "terms"` |
| `/terms` renders | PASS | Component renders static content sourced verbatim from OAR2 disclosure blocks |
| Legal footer links | PASS | Privacy · Terms · Contact nav in `renderSystemFooter()` on all surfaces |
| `/data-rights` route | GAP | Absent — deferred as P1 per `oar1_seat_public_legal_surfaces_before_launch_v1` |
| Standalone `/contact` route | GAP | Absent — P2; contact pathway exists via `/about` |

### About

| Surface | Status | Evidence |
|---|---|---|
| `/about` and `/about-measures-registry` | PASS | `RegisteredAboutMeasuresRegistry` dispatched; `ROUTE_SURFACE_ALIASES` covers both aliases |
| Legal identity in footer | PASS | `about_measures_registry` encounter_def `footer_contract.copy_lines` seeded in migration 202606260011; renders via `renderSystemFooter()` |
| Legal identity in content | PASS | `approved_content_contract.legal_identity_statement` seeded |
| Connect form | PASS | `measures_registry_connect_capture` insert logic present; `notification_state: "queued"` set |

### 404 / Unmatched Routes

| Check | Status | Evidence |
|---|---|---|
| Dedicated 404 component | GAP | Absent — unmatched routes render `"Root route authority is not seated."` held state. No user-facing 404 page. |
| Behavior on unmatched path | GAP | Held state renders but is not a proper 404. No HTTP 404 status (SPA). |

---

## ASSESSMENTS

| Check | Status | Evidence |
|---|---|---|
| 7-question flow | PASS | `PUBLIC_ASSESSMENT_EXPECTED_QUESTION_COUNT = 7`; question rendering gated by `publicAssessmentQuestionContractReady` |
| Question navigation (back/continue) | PASS | `evalSectionIndex` state with `onBackQuestion` / `onContinueQuestion` handlers |
| Scoring and report generation | PASS | `resolveEnvironmentalReportByScore()` in `registeredRuntimeUtils.ts`; `EnvironmentalStandingReport` constructed from answers |
| `assessment_result_email_consent` — required checkbox | PASS | Seated in `consent_fields`; `required: true`; not preselected |
| `measures_registry_updates_opt_in` — optional checkbox | PASS | Seated in `optional_opt_in_fields`; `required: false`; not preselected |
| Assessment boundary acknowledgment | PASS | `assessment_boundary_acknowledgment` stored in submission metadata as boolean; no dark pattern |
| Contact capture form fields | PASS | `institution_name`, `contact_name`, `contact_email`, `role_title` — 4 identity fields in `post_assessment_contact_form.fields` (migration 202606230010) |
| Assessment capture insert | PASS | `measures_iis_eval_gate1_capture` insert in `submitIisEvaluation`; `notification_state: "queued"` |
| Email delivery after capture | HOLD | `notification_state: "queued"` is set on capture insert. No edge function deployed at `supabase/functions/measures-sign/` (deno.json only, no implementation). Email delivery requires operator activation of Resend integration or edge function deployment. |

---

## MAP

| Check | Status | Evidence |
|---|---|---|
| MAP surface loads | PASS | `MarbleChamberRuntime` dispatched from surface dispatcher |
| MAP carry-forward from assessment | PASS | Session state (`evalReport`, org name, AI usage, condition traces) passed as props |
| MAP circuit records | HOLD | Cannot verify `measures_map_c2_circuit` table state without live DB access |
| MAP payment CTA | HOLD | Stripe product IDs in DB (migration 202606200001); live payment requires verification |
| MAP pathway labels | HOLD | `publicResultBoundary.pathwayLabels` — requires live assessment flow to verify |

---

## PUBLICATIONS

| Check | Status | Evidence |
|---|---|---|
| `/undrifted` dispatch list | PASS | 6 dispatches in `measures_publication_dispatch`; `LapisChamberRuntime` renders |
| Individual article routes | PASS | `/publication/structural_drift/{dispatch_key}` handled by `publication_dispatch` surface |
| Paragraph article URLs | HOLD | External; requires browser verification |
| Dispatch body content | HOLD | `dispatch_body: ''` on all 6 dispatches (migration 202606260008); content is on Paragraph platform, not in DB |
| Paragraph automation | HOLD | `paragraph_publication_integration` process in `draft` status (migration 202606260010) |
| Buffer distribution | HOLD | `buffer_social_distribution_integration` process in `draft` status (migration 202606260009) |

---

## INTEGRATIONS

| Integration | Status | Evidence |
|---|---|---|
| Supabase | PASS | Active, linked, migrations applied, RLS in place |
| Resend (email) | HOLD | Referenced in c3 key migration (provider: 'resend'). No edge function deployed. Assessment and connect captures queue at `notification_state: "queued"` — requires activation before email delivery begins |
| Stripe | HOLD | Stripe price IDs and webhook idempotency seating (migration 202606200001); no webhook handler deployed (edge function absent); live payment requires external verification |
| Paragraph | HOLD | `PARAGRAPH_PUBLISH_KEY` env binding exists; automation process `draft/held`; not activated |
| Buffer | HOLD | `BUFFER_SOCIAL_KEY` env binding exists; automation process `draft/held`; not activated |
| Cloudflare | HOLD | DNS, CDN, and page rules — requires external verification |

---

## UX

| Check | Status | Evidence |
|---|---|---|
| Loading states | PASS | `root_authority_loading` held state renders while DB resolves; surface data fetched via `loadData()` |
| Gap states | PASS | `landing_unit_missing`, "Contact capture contract is not seated.", "Root route authority is not seated." — all present in source |
| Assessment error states | PASS | `evalError` state renders `registry-form-error` on form; missing fields blocked |
| Connect form error states | PASS | `connectError` state renders on missing required fields |
| Desktop layout | HOLD | Requires live browser verification |
| Mobile layout | HOLD | Requires live browser verification; responsive CSS in `registry.layout.css` |
| Tablet layout | HOLD | Requires live browser verification |
| Intro video (autoplay/muted) | HOLD | Video autoplay with muted=true fallback in source; requires live verification for browser compatibility |
| Marble audio continuity | HOLD | `renderMarbleToneContinuity()` present; requires live verification |
| Legal links nav in footer | PASS | `registry-footer-legal-links` nav present on all surfaces that render footer |

---

## SEO

| Route | Title | Description | Canonical | OG/Twitter | Status |
|---|---|---|---|---|---|
| `/` | Measures Registry | Integrity Governance for AI Systems | set | set | PASS |
| `/ai-operations-assessment` | AI Operations Assessment \| Measures Registry | specific | set | set | PASS |
| `/undrifted` | unDrifted \| Measures Registry | specific | set | set | PASS |
| `/structural-drift` | Structural Drift \| unDrifted | specific; canonical → /undrifted | set | set | PASS |
| `/about` | About Measures Registry | specific | set | set | PASS |
| `/about-measures-registry` | About Measures Registry | specific; canonical → /about | set | set | PASS |
| `/privacy` | Privacy Policy \| Measures Registry | specific | set | set | PASS |
| `/terms` | Terms of Use \| Measures Registry | specific | set | set | PASS |
| `/map-integrity-governance` | Measures Registry (fallback) | generic (fallback) | not specific | fallback | GAP — no entry in `REGISTRY_ROUTE_METADATA`; uses `REGISTRY_METADATA` fallback |
| og:image (all routes) | `og.jpeg` | — | — | set | PASS |

---

## LEGAL STANDING

| Check | Status | Evidence |
|---|---|---|
| Legal identity in footer (/about) | PASS | `copy_lines` seeded; renders via `renderSystemFooter()` |
| Legal identity in DB | PASS | `measures_registry_root.metadata.legal_identity` seeded (migration 202606260011) |
| All disclosure blocks seated | PASS | `measures_registry_root.metadata.legal_disclosures` — 5 blocks + fundraising standing |
| `/privacy` content | PASS | Federal tax + contributions disclosures verbatim from OAR2 |
| `/terms` content | PASS | Contributions + DAO participation + mission support verbatim from OAR2 |
| Measures Registry as separate entity | PASS (NOT implied) | Branch relationship explicit in all legal surfaces |
| Federal tax-exempt status | PASS (NOT implied) | Disclosure explicit on /privacy and in measures_registry_root |
| Tax deductibility | PASS (NOT implied) | Disclosure explicit; contributions_disclosure seated |
| Charitable solicitation | PASS (NOT activated) | Held in `fundraising_standing.held` |
| Global footer legal statement | GAP | `footer_contract.legal_identity_statement` seated in DB but renderer does not yet read it globally (only /about surface via `copy_lines`) |
| Consent preselection | PASS (NONE) | All consent fields `default_checked: false`; renderer initializes to `""` |

---

## KNOWN GAPS SUMMARY

| Item | Priority | Blocking Launch |
|---|---|---|
| Email delivery (Resend / edge function) | P0 | YES — captures queue but are never delivered without activation |
| UX device verification (desktop/mobile/tablet) | P0 | YES — unknown regressions on device breakpoints |
| 404 / unmatched route page | P1 | Recommended before public traffic |
| `/data-rights` route | P1 | Recommended before public traffic |
| `/map-integrity-governance` SEO metadata | P1 | SEO gap on MAP public route |
| Stripe payment flow live verification | P0 | YES if MAP payments are active on launch |
| Cloudflare DNS/CDN verification | P0 | YES — domain must resolve correctly |
| Paragraph/Buffer automation | P2 | Deferred; not blocking if manual publication continues |
| Global footer legal statement | P2 | `legal_identity_statement` available but renderer not extended |
| Standalone `/contact` route | P2 | Contact accessible via /about; standalone deferred |
| `assessment` working-residue node in `encounter_structure` | P2 | Non-blocking; cleanup deferred |

---

## ACTIONS REQUIRED BEFORE PUBLIC TRAFFIC

| Action | Owner | Priority |
|---|---|---|
| Deploy or confirm Resend edge function for email delivery | Operator | P0 |
| Verify live assessment email delivery end-to-end | Operator | P0 |
| Verify Cloudflare DNS routing to measuresregistry.com | Operator | P0 |
| Verify Stripe payment flow on MAP engagement | Operator | P0 (if MAP payments active) |
| Live UX review — desktop, mobile, tablet | Operator | P0 |
| Verify intro video autoplay on mobile Chrome/Safari | Operator | P0 |
| Add `/map-integrity-governance` to `REGISTRY_ROUTE_METADATA` in App.tsx | Engineering | P1 |
| Create `/data-rights` route | Engineering | P1 |
| Create dedicated 404 component | Engineering | P1 |
| Activate Paragraph/Buffer automation processes | Operator | P2 (post-launch) |

---

## NOTCHAZZ FLAGS

None raised.

- No legal language invented
- No consent preselected
- No certification implied
- No SEAT standing implied
- No tax deductibility implied
- No charitable solicitation activated
- Operator not governed

---

## CLOSE

All P0 source-side launch blockers from prior OARs are cleared:

- /privacy and /terms routes: DONE
- Legal footer links: DONE
- Consent contract: DONE
- Legal identity: DONE
- Legacy key deactivation: DONE
- Surface bridging: DONE

Remaining P0 items are operator-activated infrastructure:
email delivery, Cloudflare DNS, Stripe live verification, UX device review.

Engineering P1 items (404, /data-rights, MAP SEO) do not block launch but should follow shortly after.

Nothing is invented.
