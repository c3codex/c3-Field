---
document_type: oar1
authority_level: working
document_scope: measures_registry_runtime_audit
title: OAR1 — Runtime Audit: Obsidian Eval Report and Marble Route Binding
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_runtime_audit_obsidian_eval_report_and_marble_route_binding_v1.meta.md
executor: claude
execution_date: 2026-06-09
tags:
  - oar1
  - measures-registry
  - runtime-audit
  - obsidian
  - marble
  - eval-report
  - marble-pathway-reveal
  - route-binding
  - media-map
  - no-mutation
---

# OAR1 — Runtime Audit: Obsidian Eval Report and Marble Route Binding v1

## OBJECTIVE

Audit the Obsidian eval report styling contract, the Marble passage route, the Marble Directory binding, MAP contract read path, deployed API routes, and forbidden leakage — without mutation.

## ACTION

Inspection only. No source, DB, CSS, or route changes were made.

Files read: `MeasuresRegistryRuntimeRegistered.tsx`, `PublicAssessmentSurface.tsx`, `PublicAssessmentResult.tsx`, `MarbleCommerceDirectory.tsx`, `RegisteredPublicAssessment.tsx`, `registeredRuntimeUtils.ts`, `registry.visual-system.css`, `registry.materials.css`, `encounters/assessment.css`, `RegisteredCrystalChamber.tsx`, `RegisteredPublicUnderstand.tsx`.

DB queries: `measures_media_map`, `map_commerce_contracts`, `measures_encounter_def`.

Live endpoint checks: `POST /api/map/create-checkout-session`, `POST /api/stripe/webhook`, `GET /api/map/payment-status/:id`.

---

### Route 1 — Obsidian Eval Report Runtime

**`obsidian_eval_report_status = contract_seated_not_consumed`**

DB state:
- `obsidian_eval_result_surface_visual` row present in `measures_media_map`, `is_active = true`, bucket `measures-registry`, path `obsidian_eval_result_surface_visual_v1.webp` ✓
- `obsidian_contact_surface_visual` and `obsidian_assessment_surface_visual` also present and active ✓

Runtime state:
- Media roles registered in `REGISTERED_MEDIA_ROLES` (MeasuresRegistryRuntimeRegistered.tsx:90-92) ✓
- URLs derived: `obsidianEvalResultVisualUrl` (line 492), `obsidianContactVisualUrl` (line 490), `obsidianAssessmentVisualUrl` (line 491) ✓
- Props threaded: `sharedAssessmentProps` includes all three Obsidian URL props (lines 892-894) ✓
- Props flow: `MeasuresRegistryRuntimeRegistered` → `RegisteredPublicAssessment` → `PublicAssessmentSurface` ✓
- CSS variable set: `--registry-obsidian-eval-result-visual` is conditionally applied in `chamberStyle` on `<main data-material-family="obsidian" style={chamberStyle}>` (PublicAssessmentSurface.tsx:182) ✓

CSS consumption gap:
- `--registry-obsidian-eval-result-visual` is SET on the DOM but **no CSS selector in any stylesheet reads or consumes it**.
- Searched: `registry.visual-system.css`, `registry.materials.css`, `encounters/assessment.css`.
- The visual-system.css binds `--registry-obsidian-source-image` to the Obsidian `::before` layer — this is a different variable (set from `thresholdLeftStillUrl`, not the eval result visual).
- The eval result renders via `PublicAssessmentResult` in `<div class="registry-eval-resolution registry-assessment-complete">`. No eval-result-specific CSS selector applies the Obsidian visual token.

Eval report surface:
- Active component: `PublicAssessmentResult` (src/measures_registry/PublicAssessmentResult.tsx)
- Triggered when: `evalSubmitted === true`
- Report content: fully DB/contract-driven via `reportContract`, `reportTemplate`, `assessmentCompletion` ✓
- No hardcoded report copy in source ✓
- Material family on outer `<main>`: `"obsidian"` (defaults from `stylingContract.material_family` or `"obsidian"`) ✓
- Footer/content frame: rendered by `PublicAssessmentSurface` — the standard header/footer frame applies. Eval result visual is absent because the CSS selector to consume `--registry-obsidian-eval-result-visual` has not been written.

---

### Route 2 — Marble Passage Route

**`marble_passage_status = valid_registered_passage + missing_auto_advance`**

Passage existence:
- `obsidian_to_marble_passage_video` encounter key present in `measures_encounter_def`, display_title: "Before the Pathway" ✓
- Copy loaded from DB via `sectionMap.get("obsidian_to_marble_passage_video")` ✓
- Passage rendered inline in `MeasuresRegistryRuntimeRegistered.tsx` lines 1050-1098

Passage routing:
- `measures_assessment` result → `onBeginPathwayReview()` → `navigate("obsidian_to_marble_passage_video")` (line 1039) ✓
- Passage CTA button → `navigate("marble_pathway_reveal")` (line 1090) ✓
- Route target is correct ✓

Video:
- `before_the_pathway_obsidian_to_marble_passage_video` present in `measures_media_map`, `is_active = true`, bucket `measures-media`, path `before_the_pathway_obsidian_to_marble_passage_v1.mp4` ✓
- URL resolves via `VITE_R2_PUBLIC_BASE_URL` (R2 bucket) ✓
- Video element: `autoPlay muted={passageMuted} playsInline preload="auto"` ✓

Controls:
- Continue CTA: present — `<button>` at line 1090 with label from `passageCta.label` or "Begin Pathway Reveal" ✓
- Mute toggle: present ✓

Auto-advance:
- **MISSING** — the `<video>` element has no `onEnded` handler. There is no auto-advance behavior to `marble_pathway_reveal` when the video ends.
- The passage will play but the user must manually click the CTA to continue.

Transcript rendering:
- `passageTranscript.slice(-2)` — only the last 2 lines of the passage transcript are displayed. If the transcript has more than 2 lines, content is truncated.

---

### Route 3 — Marble Directory Route Binding

**`marble_directory_status = directory_mounted`**

Handler:
- `marble_pathway_reveal` is handled in `MeasuresRegistryRuntimeRegistered.tsx` at line 1099 ✓
- Handler is `else if (activeSurface === "marble_pathway_reveal")` — no competing handler ✓
- `MarbleCommerceDirectory` is imported at line 43 ✓
- `MarbleCommerceDirectory` is mounted at line 1101 ✓
- No legacy surface or codexstone-style renderer handles `marble_pathway_reveal` in source ✓

Props passed to `MarbleCommerceDirectory`:
- `registryTokenStyle={launchMediaStyle}` ✓
- `evalReport={evalReport}` ✓
- `mapCommerceContracts={mapCommerceContracts}` ✓
- `checkoutLoading`, `checkoutError`, `paymentReturn` ✓
- `marbleAccentReferenceUrl={marbleAccentReferenceUrl}` ← SOURCE OF VISUAL ISSUE (see below)
- `renderHeader`, `renderSystemFooter`, `onProceedToPayment` ✓

Codexstone bleed — media map:
- **FOUND** via media table, not source code.
- `marble_accent_reference` entry in `measures_media_map`:
  - bucket: `measures-registry`
  - storage_path: `measures_registry/pre_codex_exhibition/images/marble_chamber_codexstone.webp`
  - is_active: true
- This is a codexstone image from the pre-codex exhibition, not a governed Marble surface visual.
- `MarbleCommerceDirectory` renders this as `<img src={marbleAccentReferenceUrl} alt="" class="registry-marble-accent">` — this is the "large visual chamber surface" the QA observed.
- Source code contains no codexstone string references ✓. Bleed is entirely via the media map record.

State when `?surface=marble_pathway_reveal` accessed without eval:
- `evalReport = null` → renders "Evaluation result is required to enter the Marble Chamber" held state
- Combined with the codexstone accent image, this produces the large-visual-over-message appearance

---

### Route 4 — MAP Commerce Contract Read Path

**`map_contract_status = valid`**

DB state:
| contract_key | circuit | standing | applicable_standing_keys | amount_usd | stripe_product_id | release_state |
|---|---|---|---|---|---|---|
| map_contract_pre_deployment | pre_deployment | eval_result_01 | ["eval_result_01"] | 3333 | prod_UfT3Fg1cmsBvE5 | active |
| map_contract_optimization | optimization | eval_result_02 | ["eval_result_02"] | 7777 | prod_UfT8GJn8S6tusF | active |
| map_contract_remediation | remediation | eval_result_03 | ["eval_result_03","eval_result_04"] | 9999 | prod_UfTFCWo6OPmbbt | active |

Read path: `mapCommerceContracts` loaded in `MeasuresRegistryRuntimeRegistered` via Supabase query filtered by `release_state = active`, ordered by `amount_usd asc` ✓

Recommended circuit logic: `applicable_standing_keys.includes(standingKey)` in `MarbleCommerceDirectory` ✓

Payment action: rendered only on recommended circuit (`isRecommended` guard) ✓

Frontend hardcode: none — all prices, descriptions, and product IDs come from DB ✓

Static Stripe links: none found in renderer ✓

---

### Route 5 — Deployed API Functions

**`api_route_status = deployed_but_env_missing`** (all three)

All three functions are deployed and executing. Responses:

| Endpoint | HTTP | Response |
|---|---|---|
| `POST /api/map/create-checkout-session` | 503 | `{"error":"Payment processor is not configured"}` |
| `POST /api/stripe/webhook` | — | `{"error":"Webhook secret is not configured"}` |
| `GET /api/map/payment-status/:id` | 500 | `{"error":"Supabase server credentials not configured"}` |

Missing environment variables in Cloudflare Pages:

| Variable | Status | Needed by |
|---|---|---|
| `STRIPE_SECRET_KEY` | not configured in CF Pages | `create-checkout-session` |
| `STRIPE_WEBHOOK_SECRET` | pending (after Stripe dashboard registration) | `webhook` |
| `SUPABASE_SERVICE_ROLE_KEY` | not configured in CF Pages | `payment-status`, `create-checkout-session` |

Note: `SUPABASE_URL` and `VITE_SUPABASE_URL` likely configured in CF Pages (from prior `.env` deployment). `SUPABASE_SERVICE_ROLE_KEY` is a distinct credential (service role JWT from Supabase project Settings → API) — not the same as the `SUPABASE_C3_KEY` PAT in `.env.local`.

---

### Route 6 — Forbidden Leakage

No source-level forbidden leakage found.

C1/C2/C3/DAO references in `RegisteredCrystalChamber.tsx` (lines 27-39) and `RegisteredPublicUnderstand.tsx` (lines 19-31) are inside a `PRIVATE_FIELDS` filter array used by a `publicSafeString()` function to STRIP those terms from public output — hold mechanism, not leakage ✓

`MarbleCommerceDirectory.tsx:250` hold notice: "SEAT standing, c3 Key issuance, wallet integration, Registry Certification, and Registered System standing are held until MAP the Environment is complete." — compliant, states held status not activation ✓

No `codexstone` string in source files ✓

No "Measures of Inanna" string in measures_registry source ✓

**Media map artifact (not source code):**
- `marble_accent_reference` storage_path contains `pre_codex_exhibition/images/marble_chamber_codexstone.webp`
- This is a visual artifact from a prior exhibition carried into the live marble accent slot
- Rendered publicly via `<img>` in `MarbleCommerceDirectory`
- Location: `measures_media_map` table, `media_role = marble_accent_reference`

---

## RESULT

### Validation Output

1. **Active component for measures_assessment eval result**: `PublicAssessmentResult` (src/measures_registry/PublicAssessmentResult.tsx) — invoked from `PublicAssessmentSurface` when `evalSubmitted === true`

2. **Active media key for eval result**: `obsidian_eval_result_surface_visual` — present in `measures_media_map`, active, bucket `measures-registry`, path `obsidian_eval_result_surface_visual_v1.webp`

3. **Whether CSS variable is consumed**: NO — `--registry-obsidian-eval-result-visual` is set in `chamberStyle` on the outer `<main>` but no CSS selector in any stylesheet reads it. Contract is seated (DB + runtime), not consumed (no CSS binding layer).

4. **Active component for marble_pathway_reveal**: `MarbleCommerceDirectory` (src/measures_registry/registered_runtime/renderers/MarbleCommerceDirectory.tsx)

5. **Whether MarbleCommerceDirectory is mounted**: YES — imported at line 43 and mounted at line 1101 of MeasuresRegistryRuntimeRegistered.tsx. No competing handler.

6. **Whether codexstone/old marble handler bleed exists**: YES — via media map only, not source code. `marble_accent_reference` row in `measures_media_map` points to `marble_chamber_codexstone.webp` from `pre_codex_exhibition/images/`. This image is rendered as a large visual accent in `MarbleCommerceDirectory`, producing the chamber surface appearance observed in QA.

7. **Active route sequence from eval result to Marble**:
   - `evalSubmitted → true` → `PublicAssessmentResult` renders with `onBeginPathwayReview`
   - `onBeginPathwayReview()` → `navigate("obsidian_to_marble_passage_video")` (line 1039)
   - Passage surface: video + CTA button, no auto-advance
   - CTA → `navigate("marble_pathway_reveal")` (line 1090)
   - `marble_pathway_reveal` → `MarbleCommerceDirectory` (line 1099-1113)

8. **MAP contract read status**: valid — all 3 contracts active in DB with correct standing keys, amounts, product IDs

9. **Deployed API route status**: deployed_but_env_missing — all 3 functions live and responding; `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY` not configured in Cloudflare Pages environment

10. **Forbidden leakage findings**:
    - Source: none
    - Media map: `marble_accent_reference` → `marble_chamber_codexstone.webp` (pre_codex_exhibition artifact, rendered publicly)

11. **Recommended corrective OAR2 title**:
    `OAR2 — Correct Obsidian Eval Result CSS Binding, Marble Accent Reference, and Passage Auto-Advance v1`

---

### Corrective Scope (for next OAR2)

Three discrete fixes required:

**Fix 1 — Obsidian eval result CSS binding**
Write CSS selector(s) that consume `--registry-obsidian-eval-result-visual` on the eval result surface. The outer `<main>` already carries the variable. The selector should target `[data-material-family="obsidian"][data-chamber-state="result"]` or `[data-layout-contract="result_gate"]` and apply the visual to the eval result section background or visual layer.

**Fix 2 — Marble accent reference**
Update `marble_accent_reference` in `measures_media_map` to a governed Marble surface visual (or null if no visual is yet seated). The current path (`pre_codex_exhibition/images/marble_chamber_codexstone.webp`) is a codexstone artifact and must not be the public visual for the Marble Chamber Directory. Options: seat a correct marble visual at a governed path, or set `is_active = false` until a governed image is available.

**Fix 3 — Passage auto-advance**
Add `onEnded` handler to the passage video element in `MeasuresRegistryRuntimeRegistered.tsx` at the `obsidian_to_marble_passage_video` surface (lines 1067-1079). Handler should call `navigate("marble_pathway_reveal")`. This is the only missing behavior; the manual CTA and route target are correct.

---

## CLOSES

OAR2: docs/oar/measures_registry/oar2_runtime_audit_obsidian_eval_report_and_marble_route_binding_v1.meta.md

## NEXT

OAR2-Next: OAR2 — Correct Obsidian Eval Result CSS Binding, Marble Accent Reference, and Passage Auto-Advance v1
