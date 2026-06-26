---
document_type: oar1
authority_level: working
title: OAR1 — Seat Public Legal Surfaces Before Launch
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_seat_public_legal_surfaces_before_launch_v1.meta.md
commit: f6283bf (HEAD — no mutation in this OAR)
---

# OAR1 — Seat Public Legal Surfaces Before Launch

## OBJECTIVE

Inventory public legal surfaces for launch readiness.
Verify consent state in assessment flow.
Return placement recommendations and required revisions.
No legal copy invented. No routes created in this OAR — creation requires operator-reviewed content.

---

## NO FILE CHANGED

This OAR is inventory only. No migrations, no source changes.

Legal copy must be reviewed and approved by the operator before surfaces can be created.

A separate OAR is required per surface to seat verified content and create routes.

---

## ROUTE INVENTORY

### /privacy

| Check | Finding |
|---|---|
| Route in App.tsx | **ABSENT** |
| Route in MeasuresRegistryRuntimeRegistered | **ABSENT** |
| Registry key `privacy` | **ABSENT** |
| Component or page file | **ABSENT** |
| Footer link | **ABSENT** |

**Status: MISSING**

---

### /terms

| Check | Finding |
|---|---|
| Route in App.tsx | **ABSENT** |
| Route in MeasuresRegistryRuntimeRegistered | **ABSENT** |
| Registry key `terms` | **ABSENT** |
| Component or page file | **ABSENT** |
| Footer link | **ABSENT** |

**Status: MISSING**

---

### /data-rights

| Check | Finding |
|---|---|
| Route in App.tsx | **ABSENT** |
| Route in MeasuresRegistryRuntimeRegistered | **ABSENT** |
| Registry key `data_rights` | **ABSENT** |
| Component or page file | **ABSENT** |
| Footer link | **ABSENT** |

**Status: MISSING**

---

### /contact

| Check | Finding |
|---|---|
| Route in App.tsx | **ABSENT** as standalone route |
| Contact form | EXISTS — embedded in `/about` surface (`about_measures_registry`) |
| Standalone /contact route | **ABSENT** |
| Email address | `connect@measuresregistry.com` — present in OAR2 directive |
| Registry key `contact` | **ABSENT** |

**Status: PARTIAL** — contact pathway exists via `/about`. Standalone `/contact` route absent.

---

## CONSENT SURFACE INVENTORY

### assessment_consent

| Check | Finding |
|---|---|
| Registry key `assessment_consent` | **ABSENT** |
| Code implementation | `assessment_result_email_consent` checkbox — present in `submitIisEvaluation` handler, stored in `measures_iis_eval_gate1_capture.metadata` |
| Default state | Not preselected — `evalFields[key] ?? ""` initializes empty |
| DB contract | `approved_content_contract.assessment_contact_capture_contract` in `measures_assessment` encounter_def — **NULL** |
| Label copy | Not verified — depends on null contract |

**Status: CODE-PRESENT, DB-CONTRACT NULL** — consent is captured and stored but label copy is not DB-governed.

---

### communications_consent

| Check | Finding |
|---|---|
| Registry key `communications_consent` | **ABSENT** |
| Code implementation | `measures_registry_updates_opt_in` optional opt-in checkbox — rendered from `optional_opt_in_fields` array |
| Default state | Not preselected — opt-in, not opt-out |
| DB contract | `optional_opt_in_fields` array — contract null, array empty |

**Status: CODE-PRESENT, DB-CONTRACT NULL** — opt-in path exists but label copy is not DB-governed. Opt-in is not preselected. No dark pattern.

---

### email_opt_in

| Check | Finding |
|---|---|
| Registry key `email_opt_in` | **ABSENT** |
| Code implementation | `assessment_result_email_consent` captures email communication consent explicitly |
| Stored field | `measures_iis_eval_gate1_capture.metadata.assessment_result_email_consent` (boolean) |
| Default state | Not preselected |

**Status: CAPTURED IN CODE** — opt-in state is stored with each assessment submission. No registry standing.

---

## CONSENT FLOW ANALYSIS

| Consent check | Status |
|---|---|
| Consent to submit information | Present — form submission with required fields |
| Consent to receive communications | Present — `measures_registry_updates_opt_in` checkbox |
| Consent storage state | STORED — `measures_iis_eval_gate1_capture.metadata` per submission |
| Opt-in state | STORED — `assessment_result_email_consent` boolean per submission |
| Pre-selected consent | NO — all checkboxes default to empty |
| Dark patterns | NONE DETECTED |

**Consent flow: acceptable at current standing. DB governance contract null — see Required Revisions.**

---

## PLACEMENT RECOMMENDATIONS

### Legal route architecture

Legal surfaces do not fit the current surface-switching SPA pattern (MeasuresRegistryRuntimeRegistered dispatches surfaces, not separate HTML routes). Two implementation paths:

**Option A — Dedicated static routes (recommended for launch)**
Add `/privacy`, `/terms`, `/data-rights`, `/contact` as standalone React route branches in `App.tsx` or `MeasuresRegistryRuntime`. Each renders a simple legal document component. No DB surface dispatch needed. Fast to implement, easy to link.

**Option B — DB-governed surfaces**
Seat registry keys and encounter_defs for each legal surface. Dispatcher extends to handle legal surface keys. Requires registry seating + renderer additions. Appropriate if legal content must be fully DB-governed.

Recommendation: **Option A** for launch. Simpler, faster, does not require expanding the surface dispatch system.

### Footer placement

`renderSystemFooter()` in `MeasuresRegistryRuntimeRegistered` currently renders only: `© copyright line | "Registered Branch of c3 Field"`.

Legal links should be added to this footer (Privacy · Terms · Data Rights · Contact).

`footer_contract` in `measures_registry_root` metadata currently only has `link_label: "c3 Field"` and `link_url`. A `legal_links` array could be added to the footer contract or the footer component extended directly.

### Assessment flow placement

Privacy policy and terms links should appear near the consent checkboxes in the contact capture step of the assessment. Specifically adjacent to:
- `assessment_result_email_consent`
- `assessment_boundary_acknowledgment`
- `measures_registry_updates_opt_in`

---

## REQUIRED REVISIONS BEFORE LAUNCH

| Priority | Revision | Blocker |
|---|---|---|
| P0 | Operator reviews and approves legal copy for /privacy | Cannot create without reviewed content |
| P0 | Operator reviews and approves legal copy for /terms | Cannot create without reviewed content |
| P0 | Seat /privacy route + component with reviewed copy | Depends on operator review |
| P0 | Seat /terms route + component with reviewed copy | Depends on operator review |
| P0 | Add legal links to system footer (Privacy · Terms) | Depends on route existence |
| P1 | Seat assessment_contact_capture_contract in measures_assessment encounter_def (DB-govern consent labels) | Currently null — copy is hardcoded or absent |
| P1 | Seat /data-rights route with reviewed content | Data rights surface required for GDPR/CCPA alignment |
| P2 | Standalone /contact route | Contact exists via /about; standalone optional |
| P2 | Seat registry keys for privacy, terms, data_rights | Required if routes become DB-governed surfaces |

---

## MINIMUM TOPICS — OPERATOR MUST VERIFY BEFORE SEATED

### /privacy minimum topics (from OAR2)

- Information collected (assessment inputs, contact data, website)
- Assessment information handling
- Contact information use
- Email communication purpose and opt-out
- Analytics if applicable (confirm whether any analytics are active)
- Third-party services (Supabase, Paragraph, Buffer, Stripe)
- Data retention period
- User rights (access, correction, deletion)
- Contact: connect@measuresregistry.com

### /terms minimum topics (from OAR2)

- Informational purpose
- No guarantees
- No certification by default
- No professional advice
- Payment boundaries (MAP engagement terms)
- Intellectual property
- Prohibited use
- Limitation of liability
- Changes to service

### /data-rights minimum topics (from OAR2)

- Request access
- Request correction
- Request deletion
- Communication preferences
- Contact: connect@measuresregistry.com

### /contact minimum (from OAR2)

- connect@measuresregistry.com
- Communication purpose
- Support boundaries

---

## LAUNCH READINESS

| Surface | Status |
|---|---|
| /privacy | **NOT READY** — route absent, content absent |
| /terms | **NOT READY** — route absent, content absent |
| /data-rights | **NOT READY** — route absent, content absent |
| /contact | **PARTIAL** — pathway exists via /about; standalone absent |
| assessment_consent | **PARTIAL** — code captures consent; DB contract null; label copy unverified |
| communications_consent | **PARTIAL** — opt-in present, not preselected; DB contract null |
| email_opt_in | **PARTIAL** — stored per submission; no standalone registry standing |
| Legal footer links | **NOT READY** — absent from all footers |

**Overall launch readiness: NOT READY**

P0 blockers: /privacy and /terms routes with operator-reviewed content. Legal footer links.

---

## NOTCHAZZ FLAGS

None raised.

- No legal language invented — minimum topics listed from OAR2 directive only
- No consent preselected — verified in code
- User rights not omitted — documented as required revision
- Communication consent not omitted — present in code; DB contract gap noted
- Operator not governed

---

## CLOSE

All required legal surfaces are absent from routes, registry, and source.

Assessment consent exists in code but is not DB-governed. No dark patterns. Opt-in is not preselected.

Three OARs recommended to unblock launch:
1. OAR — Create /privacy route with operator-reviewed content
2. OAR — Create /terms route with operator-reviewed content
3. OAR — Add legal footer links and seat assessment_contact_capture_contract

/data-rights and /contact standalone route deferred to post-launch or folded into above OARs.

Nothing is invented.
