---
document_type: oar2
authority_level: working
document_scope: launch_consent_contract
title: OAR2 - Seat Assessment Consent Contract Before Launch
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: docs/oar/measures_registry/oar1_seat_public_legal_surfaces_before_launch_v1.meta.md
---

# OAR2 - Seat Assessment Consent Contract Before Launch

## GOVERNANCE STANDING

This OAR governs assessment consent language and DB contract alignment.

It does not govern the operator.

Purpose is to seat governed consent copy for the Measures Registry assessment contact capture flow before launch.

Nothing is invented.
Nothing is assumed.
Evidence precedes mutation.

## OBSERVED

Assessment consent exists in code.

Email opt-in exists in code.

Communications opt-in exists in code.

Consent is not preselected.

No dark patterns detected.

assessment_contact_capture_contract is currently null in DB.

Current gap:

Consent behavior exists, but consent copy is not DB-governed.

## REQUIRED MUTATION

Update measures_assessment encounter_def metadata.

Seat:

approved_content_contract.assessment_contact_capture_contract

Required fields:

assessment_submission_notice:
  "By submitting this assessment, you agree that Measures Registry may store your responses and contact information to provide assessment results and related follow-up."

assessment_result_email_consent:
  label: "Send my assessment results and related follow-up by email."
  required: true
  default_checked: false

measures_registry_updates_opt_in:
  label: "I would like to receive occasional Measures Registry updates."
  required: false
  default_checked: false

privacy_notice:
  "Your information is handled according to the Measures Registry Privacy Policy."

terms_notice:
  "Use of this assessment is subject to the Measures Registry Terms of Use."

boundary_notice:
  "Assessment results are informational and do not create certification, SEAT standing, c3 Key issuance, or professional advice."

contact_email:
  "connect@measuresregistry.com"

Preserve all existing metadata.

## SOURCE ALIGNMENT

If renderer currently uses hardcoded consent labels, update it to prefer DB contract labels when present.

Fallback may remain only as neutral emergency fallback.

No new consent behavior.

No preselected consent.

No dark patterns.

## VALIDATION

Return OAR1 evidence showing:

1. assessment_contact_capture_contract exists.
2. assessment_submission_notice exists.
3. assessment_result_email_consent label exists.
4. assessment_result_email_consent default_checked is false.
5. measures_registry_updates_opt_in label exists.
6. measures_registry_updates_opt_in default_checked is false.
7. privacy_notice exists.
8. terms_notice exists.
9. boundary_notice exists.
10. contact_email exists.
11. existing metadata preserved.
12. no consent is preselected.
13. no certification claim added.
14. no SEAT standing implied.
15. no professional advice claim added.
16. build passes.

## NOTCHAZZ FLAGS

Raise NotChazz if:

- consent is preselected
- communication opt-in is preselected
- certification is implied
- SEAT standing is implied
- c3 Key issuance is implied
- tax deductibility is implied
- professional advice is implied
- existing metadata is overwritten
- operator is governed instead of the work body

## CLOSE

Seat governed assessment consent copy.

Preserve consent behavior.

No dark patterns.

Nothing is invented.
