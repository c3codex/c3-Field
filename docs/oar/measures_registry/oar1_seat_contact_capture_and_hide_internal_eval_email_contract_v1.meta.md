---
document_type: oar1
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR1 — Seat Contact Capture and Hide Internal Eval Email Contract
status: open
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_seat_contact_capture_and_hide_internal_eval_email_contract_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - connect-src
  - partial-src
  - contact-capture
  - internal-contract
  - email-contract
  - public-flow
  - codex-first
---

# OAR1 — Seat Contact Capture and Hide Internal Eval Email Contract

## EXECUTION SUMMARY

Seated public partial SRC contact capture contract on `connect_src`. Marked `measures_eval_email_contract` as internal-only registered contract. Corrected public forward route from `connect_src → measures_eval_email_contract → measures_phases_reveal` to `connect_src → measures_phases_reveal`. Created contract-native CSS for the contact capture surface.

No scoring changes. No question changes. No email dispatch implemented. Old runtime not edited. `src/index.css` not expanded.

Browser spot check pending operator confirmation.

## DB ROWS INSPECTED (before mutation)

### connect_src (before)

| field | value |
|---|---|
| function_layer | intake |
| renderer | soft_src_intake_surface |
| title | Your Assessment is Being Prepared |
| eyebrow | Assessment Package Delivery |
| subtitle | Enter the contact information... |
| cta_primary | Continue |
| standing | partial_src_contact_capture |
| public_encounter | (null) |
| internal_only | (null) |
| route_after_capture | measures_eval_email_contract ← stale |
| internal_contract_refs | (null) |
| layout_contract.layout_mode | authority_surface ← pre-OAR |
| footer_contract | (null) |
| styling_contract.surface_mode | (null) |

### measures_eval_email_contract (before)

| field | value |
|---|---|
| public_encounter | (null) |
| internal_only | (null) |
| contract_role | (null) |
| encountered_in_public_flow | (null) |
| state_expression | public_measures_eval_email_contract ← stale |
| transition_contract.route_expectation | measures_eval_email_contract -> reserve_seat ← stale |
| email_delivery_contract.dispatch_implementation | deferred |
| email_delivery_contract.contract_type | assessment_package_delivery |
| renderer_purpose.routes_toward | reserve_seat ← stale |

### structured_eval (before)

| field | value |
|---|---|
| transition_contract.route_expectation | structured_eval -> connect_src -> measures_eval_email_contract -> measures_phases_reveal ← stale |

## DB ROWS MODIFIED

### connect_src — contract seating

```json
{
  "public_encounter": true,
  "route_after_capture": "measures_phases_reveal",
  "internal_contract_refs": {
    "email_package_contract": "measures_eval_email_contract"
  },
  "layout_contract": {
    "layout_mode": "compact_partial_src_capture",
    "footer_visibility": "visible",
    "branding_visibility": "visible",
    "copy_position": "top",
    "form_position": "contained_panel",
    "cta_placement": "below_form",
    "mobile_layout": "single_column_scroll_allowed"
  },
  "styling_contract": {
    "surface_mode": "partial_src_contact_capture",
    "form_style": "governed_identity_capture",
    "copy_density": "restrained",
    "answer_option_style": "not_applicable"
  },
  "branding_contract": {
    "brand_visible": true,
    "brand_label": "Measures Registry",
    "header_mode": "downstream_governed",
    "registry_mark_visible": true
  },
  "footer_contract": {
    "footer_visible": true
  }
}
```

All existing fields preserved via spread. Only additions/corrections applied.

### measures_eval_email_contract — internal-only standing

```json
{
  "public_encounter": false,
  "internal_only": true,
  "contract_role": "email_package_delivery_contract",
  "encountered_in_public_flow": false,
  "state_expression": "internal_registered_contract",
  "renderer_purpose.routes_toward": "internal_only",
  "renderer_purpose.public_route": false,
  "transition_contract.route_expectation": "internal — connect_src references as email package contract; not in public forward route",
  "transition_contract.public_forward_route": false
}
```

Preserved without modification:
- `email_delivery_contract` — all fields
- `email_delivery_contract.dispatch_implementation: "deferred"`
- `email_delivery_contract.contract_type: "assessment_package_delivery"`
- `email_delivery_contract.includes`, `requires`, `email_structure`
- `email_delivery_contract.implementation_note` — "Email dispatch is not implemented"
- `layout_contract`, `styling_contract`, `encounter_isolation_contract`, `source_sitewide_contract`
- Row not deleted. `is_active` not changed.

### structured_eval — route_expectation correction

```json
{
  "transition_contract.route_expectation": "structured_eval -> connect_src -> measures_phases_reveal",
  "transition_contract.route_note": "structured_eval and measures_assessment both converge at connect_src after final question; connect_src routes directly to measures_phases_reveal; measures_eval_email_contract is internal-only"
}
```

## SCRIPTS CREATED

- `docs/oar/measures_registry/inspect-contact-capture-and-email-contract-v1.cjs` — read-only pre-flight inspection
- `docs/oar/measures_registry/update-contact-capture-and-email-contract-v1.cjs` — contract seating (connect_src, measures_eval_email_contract, structured_eval)

## RUNTIME FILES MODIFIED

### `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`

**Contact submit route — corrected:**

```ts
// was:
navigate("measures_eval_email_contract")

// now:
navigate("measures_phases_reveal")
```

**Redirect effect — added** (after popstate handler, before derived copy):

```ts
useEffect(() => {
  if (activeSurface === "measures_eval_email_contract") {
    navigate("measures_phases_reveal")
  }
}, [activeSurface])
```

This ensures direct URL access to `?surface=measures_eval_email_contract` redirects to `measures_phases_reveal`. The internal contract row continues to be loaded (it remains in `REGISTERED_ENCOUNTER_KEYS`) but is not rendered as a public-facing page.

**Surface dispatcher — internal contract branch changed:**

```tsx
// was: rendered RegisteredEvalEmailContract
} else if (activeSurface === "measures_eval_email_contract") {
  // Internal contract — not a public encounter surface; redirect handled by useEffect above
  activeSurfaceElement = null
}
```

No other runtime changes. Contact submit handler structure unchanged. Field validation unchanged.

## CSS FILES CREATED/MODIFIED

### Created: `src/measures_registry/registered_runtime/styles/encounters/contact_capture.css`

Scoped under `.measures-registry-runtime`. Governs:

- `.registry-connect-src` — surface frame, `min-height: 100svh`, header-offset padding, max-width centered
- `.registry-connect-src .registry-encounter-entry` — eyebrow/h1/p entry block
- `.registry-connect-src fieldset` — border/padding reset, flex column stack
- `.registry-connect-src fieldset legend` — uppercase muted label
- `.registry-connect-src fieldset label` — column stack, span + input
- `.registry-connect-src fieldset input` — borderless body, bottom border only, focus accent, transparent background
- `.registry-connect-src .registry-eval-error` — accent color error
- `.registry-connect-src .registry-encounter-actions` — CTA row
- Mobile ≤620px: `min-height: auto` (scroll allowed)

### Modified: `src/measures_registry/registered_runtime/styles/registry.runtime.css`

Added `@import "./encounters/contact_capture.css";` after `@import "./encounters/assessment.css";`.

## CONTACT SUBMIT ROUTE

| | route |
|---|---|
| Before | connect_src → measures_eval_email_contract → measures_phases_reveal |
| After | connect_src → measures_phases_reveal |

Internal contract relation:

    connect_src submit
        → persists contact / partial SRC to measures_iis_eval_gate1_capture
        → routes public user to measures_phases_reveal
        → measures_eval_email_contract referenced internally via internal_contract_refs

## DIRECT URL BEHAVIOR — measures_eval_email_contract

`?surface=measures_eval_email_contract` → `useEffect` fires → `navigate("measures_phases_reveal")` → public user sees `measures_phases_reveal`.

Surface row remains registered. Runtime continues to load its DB row. Not deleted. Not deactivated.

## SCORING CONTRACT PRESERVATION

| item | status |
|---|---|
| scoring_thresholds | not modified |
| scoring_method | not modified |
| answer option values | not modified |
| condition_tags | not modified |
| result labels | not modified |
| assessment_interpretation | not modified |

## BUILD RESULT

```
✓ 104 modules transformed
✓ built in 3.94s
```

No TypeScript errors. No CSS errors. Chunk size warning pre-existing and unrelated.

## FOOTER BOUNDARY STATUS

| surface | footer_visible | mechanism |
|---|---|---|
| ai_isnt_broken_intro | hidden | RegisteredIntro does not render renderSystemFooter() |
| evaluate_structure_path | hidden | RegisteredPathChoice does not render renderSystemFooter() |
| eval_passage | visible | renderSystemFooter() called in RegisteredPassage split-screen branch ✓ |
| measures_assessment | deferred | MeasuresAssessmentChamber — future OAR |
| structured_eval | deferred | same |
| connect_src | visible | RegisteredConnectSrc calls renderSystemFooter() ✓ |
| measures_phases_reveal | visible | RegisteredPhaseReveal renders footer |
| measures_eval_email_contract | not encountered | internal-only — no public render |

## CONFIRMATIONS

- `src/index.css` — not rewritten, not deleted ✓
- `src/measures_registry/MeasuresRegistryRuntime.tsx` — not touched ✓
- Routing — only corrected: connect_src now routes to measures_phases_reveal ✓
- Assessment scoring — unchanged ✓
- Assessment questions — unchanged ✓
- Contact field requirements — unchanged ✓
- Email dispatch — not implemented ✓
- Payment logic — not exposed ✓
- measures_eval_email_contract — registered, not deleted, is_active unchanged ✓
- No copy hardcoded in renderer ✓

## CLOSE CONDITION

Open pending operator browser spot check on:

- `?surface=connect_src` — compact form, Measures Registry branding, footer visible
- Contact submit routes to `measures_phases_reveal` (not `measures_eval_email_contract`)
- `?surface=measures_eval_email_contract` — redirects to `measures_phases_reveal`, not shown as public page
- Full left branch: intro → eval_passage → measures_assessment → connect_src → measures_phases_reveal
- Full right branch: intro → structure_passage → structured_eval → connect_src → measures_phases_reveal

Close this OAR1 when spot check passes and operator confirms.
