---
document_type: oar2
authority_level: working
document_scope: live_assessment_failure
title: OAR2 — Live Repair Eval Contact Capture Insert and Marble Transition
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 — Live Repair Eval Contact Capture Insert and Marble Transition

## OBSERVED

Live runtime still returns:

Evaluation could not be seated. Please try again.

This occurs after contact capture submission.

Expected behavior:

Assessment
→ Contact Capture
→ successful insert
→ Marble Orientation / Obsidian-to-Marble Passage
→ Findings / MAP

Prior OAR1 claimed stale field removal and assessment dedupe were completed, but live behavior indicates the deployed runtime or DB insert contract still fails.

## ALIGNED

This is a live runtime defect.

Do not redesign.

Do not change assessment content.

Do not change Paths.

Do not change About.

Repair the live contact capture insert and transition to Marble orientation.

## ROUTED

Claude shall inspect the live failure path again.

Trace the exact current failure source for:

Evaluation could not be seated. Please try again.

Verify:

- deployed runtime includes removal of confirmation_email_state
- migration 202606240007 is applied in live DB
- measures_iis_eval_gate1_capture current columns
- RLS insert policy
- required/not-null columns
- payload shape sent from contact capture
- browser/runtime console error if available
- Supabase insert response error

If any insert field is invalid, remove or correct it.

If any required DB column is missing from payload, add it from seated runtime data.

If RLS blocks insert, repair policy only for intended public insert scope.

After insert succeeds, verify transition to:

obsidian_to_marble_passage_video

Then verify passage advances to:

map_integrity_governance

## VALIDATION

Success is achieved when:

- contact capture submits successfully
- no Evaluation could not be seated error appears
- Marble orientation / Obsidian-to-Marble passage loads
- passage advances to findings/MAP
- build passes
- OAR1 reports exact live insert error and exact repair

Expected OAR1:

docs/oar/measures_registry/oar1_live_repair_eval_contact_capture_insert_and_marble_transition_v1.meta.md
