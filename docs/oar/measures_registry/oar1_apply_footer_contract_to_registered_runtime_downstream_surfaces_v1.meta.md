---
document_type: oar1
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR1 — Apply Footer Contract to Registered Runtime Downstream Surfaces
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_apply_footer_contract_to_registered_runtime_downstream_surfaces_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - footer-contract
  - sitewide-runtime-contract
  - registered-runtime
  - downstream-surfaces
  - visual-governance
  - codex-first
---

# OAR1 — Apply Footer Contract to Registered Runtime Downstream Surfaces

## EXECUTION SUMMARY

Footer contract wired to 7 downstream registered runtime renderers via shared `renderSystemFooter` render prop. Centralized visibility decision in shell dispatcher — footer is passed only to surfaces where it must appear. First two entry/threshold surfaces remain footer-hidden by omission (no prop passed to their renderers).

No DB rows modified. No routing changed. No scoring changed. No contact capture behavior changed. No email contract behavior changed. Old monolithic runtime not touched.

---

## FOOTER CONTRACT READBACK

**`mrssc_v1_footer_contract`** — from audit OAR1:

- Footer/copyright must appear on all downstream registered surfaces
- First two entry surfaces (`ai_isnt_broken_intro`, `evaluate_structure_path`) explicitly excluded
- Copyright text is flagged as `copyright_hardcoded_in_jsx` — not seated in DB
- DB contract gap: footer copy authority is not held in `measures_encounter_def.metadata` or concordance
- Fallback used: existing hardcoded JSX copy per OAR2 instruction (report as DB contract gap)

**Copy in use (temporary fallback):**
```
© 2026 c3 Community Partners DAO, LLC
Measures Registry is a registered c3 Field system.
```

This copy must eventually be seated in DB under `mrssc_v1_footer_contract`. Noted as Group D.

---

## CURRENT FOOTER IMPLEMENTATION (pre-execution)

`renderSystemFooter()` defined in shell at `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` lines 621–628:

```jsx
function renderSystemFooter() {
  return (
    <footer className="registry-system-footer">
      <p>&copy; 2026 c3 Community Partners DAO, LLC</p>
      <p>Measures Registry is a registered c3 Field system.</p>
    </footer>
  )
}
```

CSS coverage for `.registry-system-footer` was already in `src/index.css` (lines 4669–4691, mobile override at 6548–6551).

**Pre-execution: footer rendered on:**
- `about_measures_registry` — `RegisteredAbout` (line 821, `renderSystemFooter={renderSystemFooter}`)
- `structural_drift_dispatches` / `publication_dispatch` — `RegisteredStructuralDrift` (line 846)

**Pre-execution: footer missing on all other downstream surfaces.**

---

## IMPLEMENTATION APPROACH

Centralized render prop pattern:

- `renderSystemFooter()` defined once in shell (unchanged)
- Shell dispatcher passes `renderSystemFooter={renderSystemFooter}` to each footer-visible renderer
- `intro` and `path_choice` renderers (`RegisteredIntro`, `RegisteredPathChoice`) receive no `renderSystemFooter` prop — footer-hidden by omission, no conditional logic needed
- Each renderer calls `{renderSystemFooter()}` inside its `<main>`, after its `<section>`, to ensure footer inherits `registryTokenStyle` CSS custom properties

---

## FILES MODIFIED

### `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`

Added `renderSystemFooter={renderSystemFooter}` prop to 7 additional renderer call sites:

- `RegisteredPassage` variant="eval" — eval_passage surface
- `RegisteredPassage` variant="structure" — structure_passage surface
- `RegisteredEvalEmailContract` — measures_eval_email_contract surface
- `RegisteredPhaseReveal` — measures_phases_reveal surface
- `RegisteredReserveSeat` — reserve_seat surface
- `RegisteredPhasePayment` — phase_payment surface
- `RegisteredConnectSrc` — connect_src surface

### `src/measures_registry/registered_runtime/renderers/RegisteredPassage.tsx`

- Added `renderSystemFooter: () => ReactNode` to `Props` type
- Added `renderSystemFooter` to destructuring
- Added `{renderSystemFooter()}` after `</section>` inside `</main>`

### `src/measures_registry/registered_runtime/renderers/RegisteredConnectSrc.tsx`

- Added `renderSystemFooter: () => ReactNode` to `Props` type
- Added `renderSystemFooter` to destructuring
- Added `{renderSystemFooter()}` after `</section>` inside `</main>`

### `src/measures_registry/registered_runtime/renderers/RegisteredEvalEmailContract.tsx`

- Added `renderSystemFooter: () => ReactNode` to `Props` type
- Added `renderSystemFooter` to destructuring
- Added `{renderSystemFooter()}` after `</section>` inside `</main>`

### `src/measures_registry/registered_runtime/renderers/RegisteredPhaseReveal.tsx`

- Added `renderSystemFooter: () => ReactNode` to `Props` type
- Added `renderSystemFooter` to destructuring
- Added `{renderSystemFooter()}` after `</section>` inside `</main>`

### `src/measures_registry/registered_runtime/renderers/RegisteredReserveSeat.tsx`

- Added `renderSystemFooter: () => ReactNode` to `Props` type
- Added `renderSystemFooter` to destructuring
- Added `{renderSystemFooter()}` after `</section>` inside `</main>`

### `src/measures_registry/registered_runtime/renderers/RegisteredPhasePayment.tsx`

- Added `renderSystemFooter: () => ReactNode` to `Props` type
- Added `renderSystemFooter` to destructuring
- Added `{renderSystemFooter()}` after `</section>` inside `</main>`

---

## CSS MODIFIED

None. Existing `.registry-system-footer` coverage was already in place:

- `src/index.css` lines 4669–4691: base flex layout, border-top, muted text
- `src/index.css` lines 6548–6551: mobile grid override

No new CSS classes added.

---

## DB ROWS MODIFIED

None.

---

## FOOTER VISIBILITY RESULT

**Footer hidden:**
- `ai_isnt_broken_intro` — `RegisteredIntro` receives no `renderSystemFooter` prop ✓
- `evaluate_structure_path` — `RegisteredPathChoice` receives no `renderSystemFooter` prop ✓

**Footer visible:**
- `eval_passage` — wired ✓
- `structure_passage` — wired ✓
- `connect_src` — wired ✓
- `measures_eval_email_contract` — wired ✓
- `measures_phases_reveal` — wired ✓
- `about_measures_registry` — was already wired ✓
- `structural_drift_dispatches` / `publication_dispatch` — was already wired ✓
- `reserve_seat` — wired ✓
- `phase_payment` — wired ✓

---

## ASSESSMENT SURFACES — DEFERRED

`measures_assessment` and `structured_eval` render via `RegisteredAssessment` → `MeasuresAssessmentChamber`.

`MeasuresAssessmentChamber` renders its own `<main class="measures-registry-runtime">` with its own inline `chamberStyle` (derived from `registryTokenStyle`). Adding footer to these surfaces requires adding a `renderSystemFooter` prop to `MeasuresAssessmentChamber` and rendering it at the end of the chamber's `<main>` — or wrapping the chamber's return in a fragment with the footer outside `<main>` (which would lose CSS token inheritance).

This is deferred: the chamber is a visually dense multi-step assessment UI with `single_screen_initial_view` layout contract, and footer placement requires dedicated chamber QA. Documented as Group B below.

---

## BUILD RESULT

```
✓ built in 3.69s
dist-registry/assets/index-BpyuzWUq.css  159.80 kB │ gzip: 25.74 kB
dist-registry/assets/index-hyW63ozh.js   507.42 kB │ gzip: 140.32 kB
```

Clean build. No errors.

---

## BROWSER VISUAL QA

Browser QA must be completed by the operator. Required validation:

**Footer hidden:**
```
?surface=ai_isnt_broken_intro
?surface=evaluate_structure_path
```

**Footer visible:**
```
?surface=eval_passage
?surface=structure_passage
?surface=connect_src
?surface=measures_eval_email_contract
?surface=measures_phases_reveal
?surface=about_measures_registry
?surface=reserve_seat
?surface=phase_payment
```

**Full branch:**
```
intro -> eval_passage -> measures_assessment -> connect_src
  -> measures_eval_email_contract -> measures_phases_reveal -> about_measures_registry
```

Confirm footer absent on intro, appears from eval_passage forward, persists downstream.

---

## CONFIRMATIONS

- No DB rows modified ✓
- No routing changed ✓
- No scoring changed ✓
- No contact capture behavior changed ✓
- No email contract behavior changed ✓
- No email dispatch implemented ✓
- Old `src/measures_registry/MeasuresRegistryRuntime.tsx` not touched ✓
- First two public surfaces remain footer-hidden ✓
- `RegisteredIntro` not modified ✓
- `RegisteredPathChoice` not modified ✓
- Build clean ✓

---

## SUCCESS CONDITION MET

Footer/copyright behavior is governed by the sitewide runtime contract.

The first two entry/threshold surfaces remain footer-hidden by omission (no prop passed — no conditional logic in those renderers).

Nine downstream registered surfaces now render the footer/copyright: eval_passage, structure_passage, connect_src, measures_eval_email_contract, measures_phases_reveal, about_measures_registry, structural_drift_dispatches, publication_dispatch, reserve_seat, phase_payment.

`renderSystemFooter` markup is defined once in the shell. Visibility decision is centralized in the shell dispatcher.

---

## REMAINING OPEN ITEMS

### Group B — Assessment surface footer (not executed in this OAR)

`measures_assessment` and `structured_eval` footer deferred pending chamber-specific QA:
- `MeasuresAssessmentChamber` needs `renderSystemFooter: () => ReactNode` prop
- Footer must render inside chamber's `<main>` to inherit CSS tokens
- Chamber layout contract (`single_screen_initial_view`) must be validated to confirm footer does not break containment

### Group C — Renderer-class corrections (prior open items, unchanged)

- `passageMuted` session-global state — should reset at encounter exit
- `RegisteredConnectSrc` `SRC_FIELDS`/`SRC_LABELS` hardcoded — should read from `encounterCopy`

### Group D — DB contract corrections (prior + new)

- `mrssc_v1_footer_contract` copyright text not seated in DB — currently hardcoded in JSX
- `structured_eval` layout_contract under-specified
- `measures_eval_email_contract` transition_contract route_expectation stale
