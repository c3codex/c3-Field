---
document_type: oar2
authority_level: launch_repair
document_scope: report_passage_sequence
title: OAR2 - Reorder Report After Obsidian to Marble Passage
status: closed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Reorder Report After Obsidian to Marble Passage

## PURPOSE

Align the public encounter sequence to native chamber order.

The assessment report shall be encountered after the Obsidian to Marble passage.

The report is not itself the passage.

The passage prepares the participant to receive the findings.

Nothing is invented.

## CURRENT ORDER

assessment
  -> contact capture
  -> report
  -> passage video
  -> MAP
  -> payment

## APPROVED ORDER

assessment
  -> contact capture
  -> obsidian_to_marble_passage_video
  -> assessment report
  -> MAP the Environment
  -> payment

## ARCHITECTURAL STANDING

Assessment:
Evaluation occurs.

Contact capture:
Secure passage is acknowledged.

Obsidian to Marble passage:
Threshold movement occurs.

Assessment report:
Findings are revealed.

MAP the Environment:
Governed pathway is encountered.

Payment:
Exchange occurs.

## REQUIRED ACTIONS

### 1. Reorder transition flow

After contact capture submission:

Do not render the assessment report immediately.

Navigate to:

obsidian_to_marble_passage_video

only.

### 2. Preserve report state

Persist report payload exactly as currently implemented:

- standing_key
- environmental_standing
- findings
- explainability
- recommendation
- pathway information

Do not recalculate the report.

Do not alter scoring.

### 3. Passage completion

After passage completion:

Render assessment report.

The report should be the first encounter after threshold transition.

### 4. Report completion

After report acknowledgement:

Navigate to:

map_integrity_governance

### 5. MAP standing

No changes to:

- MAP cards
- pricing
- pathway mappings
- Stripe behavior
- payment wiring

### 6. Preserve informational standing

The report remains:

- informational
- non-corrective
- non-certifying
- non-advisory

No changes to:

- informational notice
- key environmental indicators
- recommendation language

Recommendation remains:

MAP the Environment to review the operating conditions behind these findings and determine the appropriate governed pathway.

## EXPECTED FLOW

assessment
  -> contact capture
  -> passage video
  -> assessment report
  -> MAP the Environment
  -> payment

## VALIDATION

Return OAR1 evidence showing:

- report no longer renders before passage
- passage video renders immediately after contact capture
- report payload survives transition
- report renders after passage completion
- informational notice preserved
- key environmental indicators preserved
- recommendation preserved
- MAP reached after report acknowledgement
- payment flow unchanged
- assessment capture unchanged
- email dispatch unchanged
- build passes
- browser QA confirms final sequence

## NOTCHAZZ FLAGS

Raise NotChazz if:

- report is recalculated
- score thresholds change
- findings change
- report renders before passage
- MAP is bypassed
- Stripe behavior changes
- informational notice changes
- recommendation changes
- operator is governed instead of the work body

## CLOSE

The report is encountered after passage.

The passage prepares the participant to receive the findings.

Nothing is invented.
