---
document_type: oar2
authority_level: launch_repair
document_scope: assessment_report_wording
title: OAR2 - Align Assessment Report Wording to Scored Results
status: closed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Align Assessment Report Wording to Scored Results

## PURPOSE

Align public assessment report wording to scored assessment results.

Report language must be governed by the assessment score and standing key.

Nothing is invented.

## OBSERVED

Current post-assessment flow now reaches:

assessment
  -> contact capture
  -> report
  -> passage media
  -> MAP encounter

Report wording needs correction.

Report wording must align to scored assessment outcome, not generic fallback copy.

## REQUIRED TRACE

Trace:

- assessment score calculation
- score band
- standing_key
- environmental_standing
- report template selection
- pathway recommendation
- MAP card/pathway match

Return current source for each:

- source file
- DB table
- metadata key
- current visible wording
- approved/unapproved disposition

## REQUIRED REPAIR

Repair report wording so each scored result maps to approved standing language.

Expected result structure:

1. Foundational / early-stage standing
2. Fragmented / optimization standing
3. Drift / remediation standing
4. High-exposure / remediation standing if seated

For each score band, ensure report includes:

- standing title
- plain-language finding
- condition summary
- pathway recommendation
- boundary statement
- next step

Do not invent copy.

Use existing DB-seated assessment interpretation and report template language where approved.

If approved copy is missing, return HOLD with exact missing keys and recommended copy slots.

## MAP ALIGNMENT

Ensure report standing maps to MAP pathway:

- foundational standing -> MAP foundational / $333
- optimization standing -> MAP optimization / $777
- remediation or high-exposure standing -> MAP remediation / $999

Do not expose SEAT pricing.

Do not imply certification.

Do not imply c3 Key issuance.

Do not imply professional advice.

## VALIDATION

Return OAR1 evidence showing:

- score calculation traced
- standing_key mapping traced
- report template source traced
- all report copy sources identified
- unapproved/fallback copy removed or held
- each score band maps to correct report wording
- each report maps to correct MAP pathway
- no SEAT pricing exposed
- no certification claim
- no c3 Key claim
- no professional advice claim
- build passes
- browser QA confirms report wording after assessment

## NOTCHAZZ FLAGS

Raise NotChazz if:

- report copy is invented
- score bands are changed without authority
- MAP pathway mapping is changed without evidence
- SEAT pricing is exposed
- certification is claimed
- c3 Key issuance is implied
- professional advice is implied
- assessment capture breaks
- contact capture breaks
- passage/MAP flow breaks
- operator is governed instead of the work body

## CLOSE

Align report wording to scored assessment results.

Nothing is invented.
