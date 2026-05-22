---
document_type: oar1
authority_level: implementation_evidence
document_scope: operator_gated_oar2_automation_to_cody_and_chazz_prompt_return
title: OAR1 - Operator-Gated OAR2 Automation To Cody And Chazz Prompt Return v1
status: completed_pending_chazz_review
version: v1
operator: op044
system: process
source_oar2: operator-provided implementation plan in thread
branch: measures
date: 2026-05-22
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
  cody: execution
  src: renderer
---

# OAR1 - Operator-Gated OAR2 Automation To Cody And Chazz Prompt Return v1

## Execution Summary

Implemented the operator-gated OAR2 handoff loop without creating fallback frontend authority or a Chazz DB review queue.

The implementation preserves:

- Operator confirmation before Cody execution
- DB queue standing as execution authority
- Cody as executor only
- OAR1/evidence requirement before Chazz prompt generation
- Chazz prompt as thread review surface only
- final standing dependent on governed DB/Measures seating

## Implemented Surfaces

- `supabase/migrations/202605220001_operator_gated_oar2_automation_handoff.sql`
  - Adds queue statuses for `queued_for_cody`, `oar1_submitted`, and `held`
  - Adds OAR2/OAR1 path, permissions, mutation standing, deploy standing, Cody handoff prompt, and Chazz review prompt fields
  - Adds `system_oar_queue_confirm_and_start_cody(...)`
  - Adds `system_oar_queue_submit_oar1_for_chazz_prompt(...)`
  - Preserves `thread_prompt_only` as the Chazz prompt authority boundary

- `src/c3_field_convergence/oarAutomationHandoff.ts`
  - Derives Cody handoff eligibility from confirmed OAR2 plus operator confirmation
  - Blocks proposed and review-only OAR2 execution
  - Generates Chazz review prompt only when OAR1 and evidence paths are present
  - Validates that the Chazz prompt does not finalize standing

- `src/c3_field_convergence/OarOperationsConsole.tsx`
  - Includes the new automation validation checks
  - Displays DB/src mutation standing in inspection
  - Shows the generated Chazz review prompt only as a selected process review artifact

## Chazz Review Prompt Contract

Generated prompt includes:

- source OAR2 path
- OAR1 path
- evidence path
- execution standing
- DB mutation standing
- src mutation standing
- deploy standing
- Cody change summary
- requested Chazz decision: `validated`, `correction_required`, or `held`

The generated prompt explicitly states that final standing must be seated back into governed DB/Measures state.

## Validation

- `npm.cmd run build:c3field`
  - blocked by existing local Windows/Vite config access issue:
    - `Cannot read directory "../../..": Access is denied.`
    - `Could not resolve "C:\\Users\\c3DAO\\OneDrive\\Apps\\c3Field\\vite.config.ts"`

- `npx.cmd tsc -p tsconfig.app.json --noEmit --ignoreDeprecations 5.0 --lib ES2021,DOM,DOM.Iterable`
  - New c3 convergence automation files passed after type tightening.
  - Remaining failures are pre-existing `src/measures_of_inanna/GenericEncounter.tsx` type errors outside this OAR scope.

## Standing

completed_pending_chazz_review

Chazz validates.
Cody executed.
Measures records.
src renders seated standing only.
