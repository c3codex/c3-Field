---
document_type: oar1
authority_level: launch_repair
title: OAR1 — Complete FREE Cutover and Decommission Registered Runtime Active Path
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_complete_free_cutover_and_decommission_registered_runtime_active_path_v1.meta.md
commit: 2641e2f
---

# OAR1 — Complete FREE Cutover and Decommission Registered Runtime Active Path

## FINAL DISPOSITION

**FREE_CUTOVER_COMPLETE**

FREE is now the active public encounter path for Measures Registry. `MeasuresRegistryOrchestrator` is the top-level renderer. `MeasuresRegistryRuntimeRegistered` is decommissioned as active route authority and preserved as rollback only.

Build passes. All routes resolve through FREE. Assessment capture, connect capture, and manifest repair complete.

---

## VALIDATION CHECKLIST

| Item | Status | Evidence |
|---|---|---|
| App.tsx routes through EncounterEntry | PASS | Import changed to `MeasuresRegistryOrchestrator` — `App.tsx:5` |
| registered_runtime no longer active route authority | PASS | Marked `ROLLBACK_ONLY` — `MeasuresRegistryRuntimeRegistered.tsx:1–4` |
| `/` resolves through FREE | PASS | Default surface `intro_hook` → `CrystalSeatRenderer.IntroHookSeat` |
| `/ai-operations-assessment` resolves through FREE | PASS | `ROUTE_SURFACE_MAP["/ai-operations-assessment"] = "measures_assessment"` → `ObsidianChamberRenderer.MeasuresAssessment` |
| `/undrifted` resolves through FREE | PASS | `ROUTE_SURFACE_MAP["/undrifted"] = "structural_drift_dispatches"` → `LapisChamberRenderer` |
| `/about` resolves through FREE | PASS | `ROUTE_SURFACE_MAP["/about"] = "about_measures_registry"` → `CrystalSeatRenderer.AboutMeasuresRegistry` |
| `/privacy` resolves | PASS | Orchestrator renders `RegisteredPrivacy` directly when `activeSurface === "privacy"` |
| `/terms` resolves | PASS | Orchestrator renders `RegisteredTerms` directly when `activeSurface === "terms"` |
| `/map-integrity-governance` resolves through FREE | PASS | `ROUTE_SURFACE_MAP["/map-integrity-governance"] = "map_integrity_governance"` → `MarbleChamberRenderer` |
| Assessment inserts into `measures_iis_eval_gate1_capture` | PASS | `onCaptureAssessment` in orchestrator — full DB row with eligibility, carry_forward, metadata, structured_email_artifact |
| Consent not preselected | PASS | Consent fields default `""` → `=== "true"` → `false` — unchanged from prior OAR |
| `notification_state = "queued"` on capture | PASS | `notification_state: "queued"` in both `onCaptureAssessment` and `onCaptureConnect` |
| Email dispatch compatibility preserved | PASS | `metadata.structured_email_artifact = payload.emailArtifact` — compatible with `dispatch-assessment-notification.ts` |
| Assessment schema not invented | PASS | Same table, same column names as registered runtime |
| `site.webmanifest` valid JSON | PASS | `public/site.webmanifest` created — valid JSON, 6 fields |
| Build passes | PASS | `vite build` — 106 modules, 0 errors, `dist/index.html` generated |
| No SEAT, certification, c3 Key, tax-deductible, charitable claim | PASS | No change to copy, terms, or prohibited claim guards |
| Secret values not exposed | PASS | DB insert callbacks receive only form payload — no secrets referenced |
| Scoring not changed | PASS | `resolveEnvironmentalReportByScore` unchanged, called in `ObsidianChamberRenderer` |
| Legal copy not changed | PASS | `RegisteredPrivacy.tsx` and `RegisteredTerms.tsx` unmodified |
| Operator not governed | PASS | No operator action required for this OAR |

---

## CHANGES — EVIDENCE

### `src/measures_registry/encounter_renderer/MeasuresRegistryOrchestrator.tsx` (created)

Top-level FREE orchestrator. Replaces `MeasuresRegistryRuntimeRegistered` as active public renderer.

Active path:
```
App.tsx
  → MeasuresRegistryOrchestrator
      → useRegistryResolver()  (data fetch — same queries as registryResolver.ts)
      → activeSurface from URL via ROUTE_SURFACE_MAP
      → registryTokenStyle from designTokenRows via cssTokenName
      → renderHeader / renderSystemFooter
      → onCaptureAssessment (DB insert into measures_iis_eval_gate1_capture)
      → onCaptureConnect (DB insert into measures_registry_connect_capture)
      → EncounterEntry
          → EncounterBoundary
              → ChamberRouter
                  → CrystalSeatRenderer (intro, path_choice, about, structure_passage)
                  → ObsidianChamberRenderer (eval_passage, measures_assessment, passage)
                  → LapisChamberRenderer (structural_drift_dispatches, publication_dispatch)
                  → MarbleChamberRenderer (map_integrity_governance)
```

`privacy` and `terms` surfaces rendered directly by orchestrator via `RegisteredPrivacy` / `RegisteredTerms` before `EncounterEntry` is reached.

### `src/app/App.tsx` (modified)

Line 5 — import changed:
```typescript
// BEFORE:
import MeasuresRegistryRuntime from "../measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered"
// AFTER:
import MeasuresRegistryRuntime from "../measures_registry/encounter_renderer/MeasuresRegistryOrchestrator"
```

All routing logic in `App.tsx` unchanged. The `MeasuresRegistryRuntime` variable name preserved for minimal diff.

### `src/measures_registry/encounter_renderer/chambers/ObsidianChamberRenderer.tsx` (modified)

`AssessmentCapturePayload` extended:
```typescript
export type AssessmentCapturePayload = {
  institutionName: string
  contactName: string
  contactEmail: string
  evaluationAnswers: Record<string, unknown>
  conditionTraces: AssessmentConditionTrace[]
  allFields: Record<string, string>          // full form state — consent, role, website, etc.
  emailArtifact: AssessmentEmailArtifact | null  // required for dispatch-assessment-notification
  report: EnvironmentalStandingReport | null
}
```

`handleSubmitEvaluation` updated to include `allFields`, `emailArtifact`, `report` in payload.

### `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` (modified)

Lines 1–4 added:
```typescript
// ROLLBACK_ONLY — not_active_route_authority
// Active public path is MeasuresRegistryOrchestrator (FREE encounter renderer).
// This file is preserved as rollback target and audit trace only.
// OAR: docs/oar/measures_registry/oar2_complete_free_cutover_and_decommission_registered_runtime_active_path_v1.meta.md
```

### `public/site.webmanifest` (created)

Valid JSON manifest resolving the `<link rel="manifest" href="/site.webmanifest" />` in `index.html`:
```json
{
  "name": "Measures Registry",
  "short_name": "Registry",
  "description": "Integrity Governance for AI Systems",
  "start_url": "/",
  "display": "standalone"
}
```

---

## ASSESSMENT CAPTURE — DB ROW SCHEMA MATCH

The orchestrator's `onCaptureAssessment` inserts into `measures_iis_eval_gate1_capture` with:

| Column | Source |
|---|---|
| `id` | `crypto.randomUUID()` — client-generated, eliminates SELECT after insert |
| `institution_name` | `payload.institutionName` |
| `institution_address` | `normalizeWebsite(payload.allFields.website)` |
| `institution_phone` | `""` (unchanged) |
| `contact_name` | `payload.contactName` |
| `contact_position` | `payload.allFields.role_title` |
| `contact_email` | `payload.contactEmail` |
| `evaluation_answers` | `payload.evaluationAnswers` |
| `capture_context` | `"measures_assessment_contact_gated_delivery"` |
| `intent` | `"assessment_result_delivery_request"` |
| `eligibility` | Object with 7 gate fields |
| `campaign_tag` | `"measures_assessment_contact_gated_delivery"` |
| `notification_state` | `"queued"` |
| `metadata.structured_email_artifact` | `payload.emailArtifact` → compatible with dispatch function |
| `metadata.assessment_result_email_consent` | `payload.allFields.assessment_result_email_consent === "true"` |
| `metadata.assessment_boundary_acknowledgment` | `payload.allFields.assessment_boundary_acknowledgment === "true"` |
| `metadata.carry_forward` | Fully populated for MAP passage |
| `metadata.source_runtime` | `"free_encounter_renderer_v1"` |

---

## NOTCHAZZ FLAGS

None raised.

- registered_runtime decommissioned as active route authority — PASS
- FREE does not infer authority — authority determined by encounter surface assignments in DB
- Assessment schema not invented — same table and column names
- Scoring unchanged — `resolveEnvironmentalReportByScore` untouched
- Consent not preselected — no change to default field values
- Email dispatch compatible — `structured_email_artifact` preserved in metadata
- No payment activation — Stripe behavior unchanged
- No SEAT standing exposed
- No c3 Key standing exposed
- No certification claimed
- No secret values exposed
- Operator not governed

---

## ROLLBACK

If FREE path fails in production, rollback by reverting `App.tsx` import to registered runtime:

```typescript
import MeasuresRegistryRuntime from "../measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered"
```

Rollback commit target: `860494c` (last commit on registered runtime with uuid fix).

---

## OPEN ITEMS — NOT IN THIS OAR

- Production black screen (`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` not in Cloudflare Pages Build env) — unresolved, requires operator action
- PUBLIC_LAUNCH_COMPLETE closeout — pending confirmed deployment + assessment production test
- SEO gap: `/map-integrity-governance` absent from `REGISTRY_ROUTE_METADATA` in `App.tsx` — P1, noted

Nothing is invented.
