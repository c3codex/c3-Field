---
document_type: oar1
authority_level: working
document_scope: measures_registry
title: OAR1 — Deactivate Deprecated Eval Residue and Seat Obsidian-to-Marble Carry-Forward
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_deactivate_deprecated_eval_residue_and_seat_obsidian_to_marble_carry_forward_v1.meta.md
executor: claude
execution_date: 2026-06-09
commit: ba39529
tags:
  - oar1
  - measures-registry
  - obsidian
  - marble
  - carry-forward
  - src
  - assessment
  - contact-capture
  - deprecated-eval-residue
  - passage
---

# OAR1 — Deactivate Deprecated Eval Residue and Seat Obsidian-to-Marble Carry-Forward v1

## OBJECTIVE

Execute OAR2 mutations scoped to:
1. Deactivate deprecated eval/email residue and one public-boundary violation from active runtime state
2. Seat durable carry-forward payload in the assessment contact capture write
3. Autoload passage after successful contact submit — skip long evaluation report display
4. Update passage copy to approved public language

## PRE-EXECUTION AUDIT

### DB residue targets confirmed

| encounter_key | display_title | is_active before | action |
|---|---|---|---|
| `measures_eval_email_contract` | Measures Evaluation Email Contract | true | deactivate |
| `connect_src` | c3 Field | true | deactivate — exposes internal name |
| `iis_eval_gate1` | MEASURES AI OPERATIONAL EVALUATION | false | already inactive, no action |
| `understand_failure` | Deprecated Reference | false | already inactive, no action |
| `foundation_seat_hold` | FOUNDATION SEAT | true | outside this OAR scope |
| `phase_payment` | Phase Payment | true | outside this OAR scope |

### Carry-forward table selection

`measures_iis_eval_gate1_capture` — selected as the durable write path. Already used by runtime. Columns fit assessment contact capture. Has `metadata` JSONB for carry-forward payload.

`src_intake_request` — has `env_key UUID NOT NULL` requiring a reference that doesn't exist in this flow. `interest_area`, `course_intent` columns suggest different enrollment purpose. Deferred as a later refactor target per OAR2 ROUTED §3.

`oar1_log` — requires `src_intake_request_id UUID NOT NULL` and `env_key UUID NOT NULL`. Cannot write from assessment flow without `src_intake_request` record. Gap confirmed: `oar1_log` is coupled to a future `src_intake_request`-based flow.

`system_oar_log` — exists, all fields nullable except `oar_key`, `oar_type`, `status`, `metadata`. Not written from frontend in this OAR; OAR1 trace embedded in `measures_iis_eval_gate1_capture.metadata` instead. `system_oar_log` available for a future governed write once RLS is verified.

### Passage copy (before)

| field | value before |
|---|---|
| `passage_transcript` | 11-line internal technical narrative |
| `cta.label` | "Begin Pathway Reveal" |

### Source flow (before)

After contact submit: `setEvalSubmitted(true)` → renders `PublicAssessmentResult` → user clicks "Begin Pathway Review" → `navigate("obsidian_to_marble_passage_video")`.

---

## ACTION

### Fix 1 — Deactivate deprecated residue

**SQL:**

```sql
UPDATE measures_encounter_def
SET is_active = false
WHERE encounter_key IN ('measures_eval_email_contract', 'connect_src')
RETURNING encounter_key, display_title, is_active;
```

**Result:** 2 rows updated.

| encounter_key | display_title | is_active |
|---|---|---|
| `measures_eval_email_contract` | Measures Evaluation Email Contract | false |
| `connect_src` | c3 Field | false |

No other encounter_def rows touched.

---

### Fix 2 — Update passage copy

**SQL:**

```sql
UPDATE measures_encounter_def
SET metadata = jsonb_set(
  jsonb_set(
    metadata,
    '{passage_transcript}',
    '["Assessment received.",
      "Your result has been recorded and matched to a structured review path.",
      "The next page will present the recommended next step and the action available for your organization."]'
  ),
  '{cta}',
  '{"label": "Continue", "cta_type": "marble_entry", "routes_to": "marble_pathway_reveal"}'
)
WHERE encounter_key = 'obsidian_to_marble_passage_video';
```

**Result:** 1 row updated.

| field | value after |
|---|---|
| `passage_transcript[0]` | "Assessment received." |
| `passage_transcript[1]` | "Your result has been recorded and matched to a structured review path." |
| `passage_transcript[2]` | "The next page will present the recommended next step and the action available for your organization." |
| `cta.label` | "Continue" |
| `cta.cta_type` | "marble_entry" |
| `cta.routes_to` | "marble_pathway_reveal" |

---

### Fix 3 — Seat carry-forward payload and autoload passage

**File:** `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`

**Changes in `submitIisEvaluation` (contact_capture branch):**

1. Added `carry_forward` key to `measures_iis_eval_gate1_capture.metadata` insert:
   ```json
   {
     "source_surface": "measures_assessment",
     "passage_surface": "obsidian_to_marble_passage_video",
     "destination_surface": "map_integrity_governance",
     "destination_legacy_alias": "marble_pathway_reveal",
     "environment_score": evalReport.score,
     "circuit_identification": evalReport.standing_key,
     "continuation_pathway": evalReport.continuation_pathway,
     "organization_name": institution_name,
     "contact_name": contact_name,
     "contact_email": contact_email,
     "current_ai_usage": ai_deployment_status,
     "state": "carried_forward"
   }
   ```

2. Added `oar1_trace` key to `measures_iis_eval_gate1_capture.metadata` insert:
   ```json
   {
     "objective": "Carry completed assessment standing into governed review.",
     "action": "Assessment result computed; contact submitted; durable carry-forward created; assessment standing bound for passage.",
     "result": "Assessment standing ready for MAP circuit review.",
     "source_oar2": "oar2_deactivate_deprecated_eval_residue_and_seat_obsidian_to_marble_carry_forward_v1",
     "carry_forward_version": "1"
   }
   ```

3. Renamed `result_displayed_after_contact_capture: true` → `passage_autoloads_after_submit: true` to accurately reflect new behavior.

4. After successful DB insert, added `navigate("obsidian_to_marble_passage_video")` immediately after `setEvalSubmitted(true)`. Both state updates are batched by React 18 — `PublicAssessmentResult` is never rendered; the runtime transitions directly to the passage surface.

**Flow after fix:**

AI Operations Assessment  
→ environment score computed  
→ circuit identification computed  
→ contact capture form appears  
→ contact submit writes durable carry-forward to `measures_iis_eval_gate1_capture`  
→ passage autoloads (`obsidian_to_marble_passage_video`)  
→ passage video ends → `navigate("marble_pathway_reveal")`  
→ Marble-side surface receives session-state carry-forward (`evalReport`, `evalFields`)

---

## BUILD

```
npm run build:registry
✓ 103 modules transformed
✓ built in 4.05s
dist-registry/assets/index-CyxhbQVq.js   539.95 kB
dist-registry/assets/index-D1PySCUU.css  237.10 kB
dist-registry/index.html
```

Build passed. No TypeScript errors. Chunk size warning is pre-existing.

---

## RESULT

### Validation

1. **Deprecated `measures_eval_email_contract` removed from active runtime**: YES — `is_active = false` confirmed via SQL RETURNING
2. **`connect_src` (exposes "c3 Field") deactivated**: YES — `is_active = false` confirmed via SQL RETURNING
3. **No broad residue cleanup outside OAR scope**: YES — only 2 rows updated; `foundation_seat_hold`, `phase_payment`, `iis_eval_gate1`, `understand_failure` not touched
4. **AI Operations Assessment still renders before contact capture**: YES — `evalStep === "contact_capture"` only triggers after all 7 questions answered and scored
5. **Current AI usage dropdown remains part of assessment flow**: YES — `ai_deployment_status` field still collected in contact form
6. **Environment score computed before contact capture**: YES — `resolveEnvironmentalReportByScore()` runs before `setEvalStep("contact_capture")`
7. **Circuit identification computed before contact capture**: YES — `evalReport.standing_key` available before contact step
8. **Contact capture appears only after assessment completion**: YES — `evalStep === "contact_capture"` branch only reached after scoring
9. **Contact fields include organization name, contact name, and contact email**: YES — `institution_name`, `contact_name`, `contact_email` collected via form
10. **Contact submit writes durable carry-forward state**: YES — `measures_iis_eval_gate1_capture.metadata.carry_forward` contains all required fields
11. **Carry-forward includes environment score and circuit identification**: YES — `environment_score: evalReport.score`, `circuit_identification: evalReport.standing_key`
12. **Carry-forward includes contact information**: YES — `organization_name`, `contact_name`, `contact_email` in `carry_forward`
13. **SRC or SRC-equivalent record created**: YES — `measures_iis_eval_gate1_capture` is the capture record with full carry-forward payload; `src_intake_request` deferred (requires `env_key`, different schema purpose)
14. **OAR1 trace or OAR1-equivalent created**: YES — `measures_iis_eval_gate1_capture.metadata.oar1_trace` embedded; `oar1_log` write deferred — requires `src_intake_request_id` and `env_key` (gap confirmed and reported)
15. **Passage autoloads after successful contact submit**: YES — `navigate("obsidian_to_marble_passage_video")` called after `setEvalSubmitted(true)` in contact_capture branch
16. **Passage copy matches approved copy**: YES — `passage_transcript` updated in DB; `cta.label` updated to "Continue"
17. **Long public evaluation report not shown in transition**: YES — `PublicAssessmentResult` bypassed; `navigate()` called before React can render it
18. **Marble-side surface receives carry-forward reference**: YES (session state) — `evalReport` and `evalFields` remain in component state through passage; `marble_pathway_reveal` receives `evalReport` prop; durable DB carry-forward exists in `measures_iis_eval_gate1_capture` for Marble hardening OAR
19. **Correct MAP contract still resolves from circuit identification**: YES — `map_commerce_contracts` loaded by circuit; `evalReport.standing_key` feeds `handleProceedToMapPayment`
20. **MAP pricing unchanged**: YES — no commerce contract rows touched
21. **Stripe checkout unchanged**: YES — `handleProceedToMapPayment` not modified
22. **SEAT remains held**: YES — no SEAT tables touched
23. **c3 Key / wallet remain held**: YES — not touched
24. **Crystal and Lapis unchanged**: YES — no Crystal or Lapis files or records touched
25. **MRM not introduced**: YES — no MRM structures created
26. **Build passes**: YES — `✓ built in 4.05s`
27. **OAR1 written**: this document

---

## GAPS REPORTED

**Gap 1 — `oar1_log` not writable from assessment flow**
`oar1_log` requires `src_intake_request_id UUID NOT NULL` and `env_key UUID NOT NULL`. The assessment contact flow does not produce a `src_intake_request` record. A formal OAR1 log entry for the carry-forward event cannot be written until the `src_intake_request` flow is established or the `oar1_log` schema is updated. The `oar1_trace` in `measures_iis_eval_gate1_capture.metadata` serves as the interim trace.

**Gap 2 — `src_intake_request` write deferred**
`src_intake_request` has `env_key UUID NOT NULL` (foreign-key reference unknown), and its column set (`interest_area`, `course_intent`) suggests it was designed for a different intake flow. Full SRC carry-forward via `src_intake_request` requires a schema review and subsequent OAR before write is possible.

**Gap 3 — Marble receives session-state carry-forward only**
`marble_pathway_reveal` currently receives `evalReport` through React component state (in-memory). If the user opens `/map-integrity-governance` or `?surface=marble_pathway_reveal` directly, `evalReport` is null. Durable carry-forward exists in `measures_iis_eval_gate1_capture` but the Marble surface does not yet query it by ID. Marble hardening OAR resolves this.

---

## COMMIT

`ba39529` — pushed to `origin/measures`

Files changed:
- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` — carry-forward payload, oar1_trace, passage autoload
- `dist-registry/` — rebuilt artifacts
- `docs/oar/measures_registry/` — OAR governance docs

---

## CLOSES

OAR2: docs/oar/measures_registry/oar2_deactivate_deprecated_eval_residue_and_seat_obsidian_to_marble_carry_forward_v1.meta.md

## NEXT

1. **OAR2 — Harden `marble_pathway_reveal` to MAP Integrity Governance** — seed `map_integrity_governance` encounter + registry entry, `/map-integrity-governance` route alias, resolve durable carry-forward from DB rather than session state only.

2. **OAR2 — Seat `src_intake_request` write** — after `src_intake_request` schema is reviewed for `env_key` resolution, complete the formal SRC carry-forward record and bind `oar1_log` write.

3. **Deploy verification** — confirm live at `https://measuresregistry.com/?surface=measures_assessment` that:
   - Contact capture appears after all 7 questions answered
   - Passage autoloads after contact submit
   - Passage copy reads "Assessment received. Your result has been recorded..."
   - Passage CTA reads "Continue"
   - Marble Directory loads after passage ends
