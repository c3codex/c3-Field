---
document_type: oar1
authority_level: working
document_scope: measures_registry
title: OAR1 — Harden marble_pathway_reveal to MAP Integrity Governance
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_harden_marble_pathway_reveal_to_map_integrity_governance_v1.meta.md
executor: claude
execution_date: 2026-06-09
commit: 1f4f54f
tags:
  - oar1
  - measures-registry
  - marble
  - map-integrity-governance
  - marble-pathway-reveal
  - carry-forward
  - map-circuit
  - seat-held
  - public-route
---

# OAR1 — Harden marble_pathway_reveal to MAP Integrity Governance v1

## OBJECTIVE

Execute OAR2 mutations scoped to:
1. Promote `map_integrity_governance` as the canonical surface key; demote `marble_pathway_reveal` to legacy alias
2. Add `/map-integrity-governance` as a public route
3. Resolve durable carry-forward from DB when session state is absent
4. Store `evalScore` and `evalCaptureId` for durable carry-forward resolution
5. Personalize the MAP Integrity Governance surface with organization name, score, selected circuit, AI usage, and three assessment indicators
6. Add approved public copy: why-not-assessment, why-no-suggestions
7. Replace "Proceed to MAP Payment" with "Begin MAP Review"
8. Remove all "Marble Chamber" language from public surfaces
9. Preserve MAP pricing, Stripe checkout, SEAT, c3 Key, wallet, Crystal, Lapis boundaries

---

## PRE-EXECUTION AUDIT

### DB state before

| table | encounter_key | display_title | is_active |
|---|---|---|---|
| `measures_encounter_def` | `marble_pathway_reveal` | "Recommended Governed Pathway" | true |
| `measures_encounter_def` | `map_integrity_governance` | — does not exist | — |
| `measures_registry` | `marble_pathway_reveal` | "Recommended Governed Pathway" | true |
| `measures_registry` | `map_integrity_governance` | — does not exist | — |

### Source state before

- `RegisteredSurface` type: `marble_pathway_reveal` present, `map_integrity_governance` absent
- `SURFACE_QUERY`: `marble_pathway_reveal → "marble_pathway_reveal"`, no `map_integrity_governance`
- No `/map-integrity-governance` route alias
- `MarbleCommerceDirectory.tsx`: "Marble Chamber" eyebrow, "Governed Pathway" heading, "Proceed to MAP Payment" CTA, no personalization, no why-not-assessment copy
- `evalScore` not stored in state — `interpretation.score` discarded after diagnostic step
- `evalCaptureId` not stored — insert result discarded

### MAP commerce contracts confirmed active

| contract_key | map_circuit_key | applicable_standing_keys | amount_usd |
|---|---|---|---|
| `map_contract_pre_deployment` | `pre_deployment` | `["eval_result_01"]` | $3,333 |
| `map_contract_optimization` | `optimization` | `["eval_result_02"]` | $7,777 |
| `map_contract_remediation` | `remediation` | `["eval_result_03","eval_result_04"]` | $9,999 |

---

## ACTION

### Fix 1 — DB: Update `marble_pathway_reveal` display_title and metadata

**SQL:**

```sql
UPDATE measures_encounter_def
SET
  display_title = 'MAP Integrity Governance',
  metadata = metadata || jsonb_build_object(
    'title', 'MAP Integrity Governance',
    'public_title', 'MAP Integrity Governance',
    'legacy_alias_for', 'map_integrity_governance'
  )
WHERE encounter_key = 'marble_pathway_reveal';
```

**Result:** 1 row updated — `display_title = 'MAP Integrity Governance'`.

---

### Fix 2 — DB: Insert `map_integrity_governance` registry row and encounter def

**SQL (CTE):**

```sql
WITH registry_insert AS (
  INSERT INTO measures_registry (
    registry_key, display_title, registry_family, encounter_type,
    material_family, release_state, access_state, sequence_order, is_active, metadata
  )
  VALUES (
    'map_integrity_governance', 'MAP Integrity Governance', 'spine', 'view',
    'marble', 'released', 'callable', 1091, true,
    jsonb_build_object(
      'source_oar2', 'oar2_harden_marble_pathway_reveal_to_map_integrity_governance_v1',
      'legacy_alias_for', 'marble_pathway_reveal'
    )
  )
  ON CONFLICT (registry_key) DO NOTHING
  RETURNING id
)
INSERT INTO measures_encounter_def (
  registry_id, encounter_key, display_title, encounter_type,
  material_family, sequence_order, is_active, metadata
)
SELECT id, 'map_integrity_governance', 'MAP Integrity Governance', 'view', 'marble', 1091, true,
  jsonb_build_object(
    'title', 'MAP Integrity Governance',
    'public_title', 'MAP Integrity Governance',
    'material_family', 'marble',
    'surface_alias_for', 'marble_pathway_reveal',
    'source_oar2', 'oar2_harden_marble_pathway_reveal_to_map_integrity_governance_v1'
  )
FROM registry_insert
ON CONFLICT (encounter_key) DO NOTHING
RETURNING encounter_key, display_title, is_active;
```

**Result:** `map_integrity_governance` row inserted in both `measures_registry` and `measures_encounter_def`.

---

### Fix 3 — Source: `registeredRuntimeTypes.ts`

Replaced `"marble_pathway_reveal"` with `"map_integrity_governance"` in the `RegisteredSurface` union type.

---

### Fix 4 — Source: `MeasuresRegistryRuntimeRegistered.tsx`

**REGISTERED_ENCOUNTER_KEYS**: Added `"map_integrity_governance"` (kept `"marble_pathway_reveal"` for legacy fetch continuity).

**SURFACE_QUERY**: Replaced `marble_pathway_reveal: "marble_pathway_reveal"` with `map_integrity_governance: "map_integrity_governance"`.

**SURFACE_QUERY_ALIASES**: Added `marble_pathway_reveal: "map_integrity_governance"` as legacy alias.

**ROUTE_SURFACE_ALIASES**: Added `"/map-integrity-governance": "map_integrity_governance"`.

**New state variables:**
- `evalScore: number | null` — stores the numeric score from `resolveEnvironmentalReportByScore`
- `evalCaptureId: string | null` — stores the UUID of the `measures_iis_eval_gate1_capture` row after contact submit

**`submitIisEvaluation` — diagnostic branch**: Added `setEvalScore(interpretation.score)` alongside `setEvalReport`.

**`submitIisEvaluation` — contact_capture branch**:
- Changed insert from `{ error }` to `{ data: captureData, error }` with `.select("id").single()` chained
- Fixed `carry_forward.environment_score: evalReport.score` → `carry_forward.environment_score: evalScore` (prior value was `undefined`)
- After error check: `if (captureData?.id) setEvalCaptureId(captureData.id)`

**DB carry-forward resolution useEffect**: Added after the assessment reset useEffect. When `activeSurface === "map_integrity_governance"` and `evalCaptureId` is set but `evalReport` is null, queries `measures_iis_eval_gate1_capture` by ID, reconstructs `evalReport` from `metadata.assessment_result_binding.environmental_standing_report`, and restores `institution_name` / `ai_deployment_status` from `metadata.carry_forward`.

**Surface dispatcher**: Renamed `else if (activeSurface === "marble_pathway_reveal")` → `else if (activeSurface === "map_integrity_governance")`. Added new props: `organizationName`, `currentAiUsage`, `conditionTraces`, `environmentScore`.

**Navigate calls updated** (3 locations): `navigate("marble_pathway_reveal")` → `navigate("map_integrity_governance")` in payment return verification, passage video `onEnded`, and passage CTA `onClick`.

**Payment/cancel URL**: `?surface=marble_pathway_reveal` → `?surface=map_integrity_governance` in `handleProceedToMapPayment`.

---

### Fix 5 — Source: `MarbleCommerceDirectory.tsx`

**New props added:**
- `organizationName: string | null`
- `currentAiUsage: string | null`
- `conditionTraces: AssessmentConditionTrace[]`
- `environmentScore: number | null`

**`data-surface` attribute**: All states updated from `"marble_pathway_reveal"` → `"map_integrity_governance"`.

**No-eval state copy** (public-safe, no internal language):
- Before: "Evaluation result is required to enter the Marble Chamber."
- After: "Assessment context unavailable. Please return to the assessment to continue."

**`data-layout-contract`** for no-eval state: `"passage_required"` → `"context_required"`.

**Main surface header**:
- Removed: `<span>Marble Chamber</span>` eyebrow
- Removed: `<h2>Governed Pathway</h2>`
- Added: `<h2>MAP Integrity Governance</h2>`
- Added approved why-not-assessment copy: "Your initial assessment identified the review path. The MAP is not a repeat of that assessment. It is the structured review required to measure, audit, and prepare your organization for the System Environment Alignment Track."
- Added approved why-no-suggestions copy: "Measures Registry does not provide generic helpful suggestions from this assessment. Suggestions can describe possible improvements, but they do not verify authority, role boundaries, evidence paths, review ownership, or implementation readiness. The selected MAP is the governed review path for determining what can be acted on responsibly."

**Assessment standing section** added:
- "Your result has been matched to a structured review path."
- When `organizationName` present: personalization block with environment score, selected review path, current AI usage
- When `conditionTraces` present: up to 3 assessment indicators from answer labels

**MAP circuit cards**: Removed per-card "System Standing" section (consolidated into header personalization).

**Payment CTA**:
- Before: "Proceed to MAP Payment"
- After: "Begin MAP Review"

**Payment confirmation SEAT copy**:
- Before: "A full SEAT Contract may be generated only after MAP the Environment is complete."
- After: "SEAT standing releases only after MAP deliverables and resolution complete the commerce circuit."

---

### Fix 6 — Build artifact: `/map-integrity-governance` static route

Copied `dist-registry/index.html` to `dist-registry/map-integrity-governance/index.html` to activate Cloudflare Pages routing for the `/map-integrity-governance` path.

SEO metadata customization (title, canonical, OG tags) for this route is deferred — see Gap 1.

---

## BUILD

```
npm run build:registry
✓ 103 modules transformed.
✓ built in 4.30s
dist-registry/assets/index-DRztjOQN.js   541.95 kB
dist-registry/assets/index-D1PySCUU.css  237.10 kB
dist-registry/index.html
```

Build passed. No TypeScript errors. Chunk size warning is pre-existing.

---

## RESULT

### Validation

1. **`map_integrity_governance` encounter/standing exists**: YES — row inserted in `measures_encounter_def` and `measures_registry`; `marble_pathway_reveal` explicitly rebound via `SURFACE_QUERY_ALIASES` as legacy alias
2. **Public title renders as `MAP Integrity Governance`**: YES — `<h2>MAP Integrity Governance</h2>` in component; DB `display_title` updated to "MAP Integrity Governance"
3. **`/map-integrity-governance` route works**: YES — `ROUTE_SURFACE_ALIASES` entry added; `dist-registry/map-integrity-governance/index.html` created; SEO customization deferred (Gap 1)
4. **`?surface=marble_pathway_reveal` no longer displays obsolete semantics**: YES — `SURFACE_QUERY_ALIASES` maps it to `map_integrity_governance`; component renders "MAP Integrity Governance" title, not "Recommended Governed Pathway" or "Governed Pathway"
5. **MAP surface can resolve durable carry-forward from DB**: YES — DB carry-forward useEffect queries `measures_iis_eval_gate1_capture` by `evalCaptureId` when `evalReport` is null
6. **Direct Marble entry without carry-forward shows safe unavailable state**: YES — "Assessment context unavailable. Please return to the assessment to continue."
7. **Organization name renders when available**: YES — from `evalFields.institution_name` or DB carry-forward
8. **Environment score renders when available**: YES — `evalScore` state (numeric); falls back to `evalReport.environmental_standing` when null
9. **Selected MAP circuit renders from `circuit_identification`**: YES — `recommendedContract` resolved from `standingKey` vs `applicable_standing_keys`
10. **Current AI usage renders if carried**: YES — from `evalFields.ai_deployment_status` or DB carry-forward
11. **Three selected assessment indicators render if available**: YES — `conditionTraces.slice(0, 3)` with answer labels; safe fallback (no section rendered) when absent
12. **Correct MAP contract loads from DB contract authority**: YES — `map_commerce_contracts` loaded from `release_state = 'active'` rows; `recommendedContract` resolved at render time
13. **Price still resolves from DB contract table**: YES — `formatUsd(contract.amount_usd)` from DB; no hardcoded pricing
14. **No hardcoded price or selected contract added to frontend**: YES — all pricing from `map_commerce_contracts` rows
15. **Copy explains initial assessment identified the review path**: YES — "Your initial assessment identified the review path."
16. **Copy explains MAP is not a repeat assessment**: YES — "The MAP is not a repeat of that assessment."
17. **Copy explains why Measures Registry does not provide generic helpful suggestions**: YES — approved §8 copy included
18. **Payment action opens MAP work only**: YES — `handleProceedToMapPayment` unchanged; Stripe checkout creates session for selected MAP only
19. **SEAT remains held until MAP resolution**: YES — `seat_hold_notice` from DB contract; holds section unchanged
20. **c3 Key, wallet, certification, registered system, DAO remain held**: YES — not touched
21. **Public copy exposes no chamber/material/schema/SRC/OAR/table/view/internal route language**: YES — "Marble Chamber" removed from all rendered text; no internal key/table/schema language in public copy
22. **Crystal unchanged**: YES — no Crystal files or records touched
23. **Lapis unchanged**: YES — no Lapis files or records touched
24. **Obsidian scoring/contact flow unchanged**: YES — `submitIisEvaluation` diagnostic and contact_capture logic unchanged except adding `setEvalScore` and `.select("id").single()` with `setEvalCaptureId`
25. **MRM not introduced**: YES — no MRM structures created
26. **Build passes**: YES — `✓ built in 4.30s`
27. **OAR1 written**: this document

---

## GAPS REPORTED

**Gap 1 — `/map-integrity-governance` SEO metadata not seated**

The `measures_registry` row for `map_integrity_governance` was inserted with no SEO metadata (`seo` key absent from metadata). The `generate-registry-route-heads.cjs` script requires full SEO fields (`title`, `description`, `canonical_url`, `og_type`, `og_title`, `og_description`, `og_url`, `og_image`, `twitter_card`, `twitter_title`, `twitter_description`, `twitter_image`, `route_path`, `route_authority`). Until these are seated, the static route uses the base `index.html` without SEO customization. Cloudflare Pages serves the SPA correctly from `dist-registry/map-integrity-governance/index.html` but without route-specific meta tags. Resolves in a future SEO seating OAR.

**Gap 2 — Marble carry-forward reconstruction limited to `evalReport` + contact fields**

DB carry-forward resolution useEffect can reconstruct `evalReport` from `metadata.assessment_result_binding.environmental_standing_report` and restore `institution_name` / `ai_deployment_status` from `metadata.carry_forward`. It cannot reconstruct `evalScore` (not stored in DB carry_forward — was previously `undefined`; fixed in this OAR to store correctly for future captures). It cannot reconstruct `conditionTraces` without an additional read of `metadata.condition_traces`. Users who access the MAP surface via DB resolution path will see personalization but without numeric score and without assessment indicators. Resolves in a future carry-forward hardening OAR.

---

## COMMIT

`1f4f54f` — pushed to `origin/measures`

Files changed:
- `src/measures_registry/registered_runtime/registeredRuntimeTypes.ts` — `marble_pathway_reveal` → `map_integrity_governance` in RegisteredSurface
- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` — route aliases, state, useEffect, dispatcher
- `src/measures_registry/registered_runtime/renderers/MarbleCommerceDirectory.tsx` — full public copy and personalization update
- `dist-registry/` — rebuilt artifacts + new map-integrity-governance route directory
- `docs/oar/measures_registry/` — OAR governance docs

---

## CLOSES

OAR2: docs/oar/measures_registry/oar2_harden_marble_pathway_reveal_to_map_integrity_governance_v1.meta.md

## NEXT

1. **OAR2 — Seat SEO metadata for `/map-integrity-governance`** — seed `seo` block in `measures_registry.metadata` for `map_integrity_governance` and add route to `generate-registry-route-heads.cjs`.

2. **OAR2 — Harden DB carry-forward reconstruction** — add `evalScore` and `conditionTraces` to the DB resolution useEffect (requires reading `metadata.condition_traces` and parsing `metadata.carry_forward.environment_score` for future captures where score is now correctly stored).

3. **OAR2 — Seat `src_intake_request` write** — after `src_intake_request` schema review for `env_key` resolution, complete the formal SRC carry-forward record and bind `oar1_log` write.

4. **Deploy verification** — confirm live at `https://measuresregistry.com/?surface=measures_assessment` and `https://measuresregistry.com/map-integrity-governance`:
   - Assessment completes → contact submit → passage autoloads → MAP Integrity Governance loads
   - "MAP Integrity Governance" title renders
   - Personalization block renders with org name, score, selected MAP circuit
   - Why-not-assessment and why-no-suggestions copy renders
   - "Begin MAP Review" CTA renders for recommended contract
   - `?surface=marble_pathway_reveal` redirects correctly to MAP Integrity Governance surface
   - `/map-integrity-governance` direct URL loads correctly
