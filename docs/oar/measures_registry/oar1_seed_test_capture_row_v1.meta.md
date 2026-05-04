---
document_type: oar1
title: OAR1 Seed Test Capture Row
version: v1
status: executed
system: measures_registry
operator: op044
source_oar2: docs/oar/measures_registry/oar2_seed_test_capture_row_v1.meta.md
---

OAR1: oar1_seed_test_capture_row_v1

## Objective
Seed one queued Foundation Seat test capture row for provider dispatch validation.

## Actions
- Inserted one row into `measures_seat_hold_capture`.
- Used operator-provided test email.
- Set `notification_state` to `queued`.
- Marked metadata as validation-only test data.
- Did not send email.

## Validation
```json
{
  "dbConnection": "active",
  "oneTestRowCreated": true,
  "capture_id": "0db9a91b-bddd-4177-bb45-9923f481e2c1",
  "email": "contibute2c3communitypartners@gmail.com",
  "notification_state": "queued",
  "offering_key": "foundation_seat",
  "source_encounter_key": "foundation_seat_hold",
  "metadataTest": true,
  "metadataSource": "seed_test_capture_row_v1",
  "metadataPurpose": "provider_dispatch_validation",
  "emailSentByThisOar": false
}
```

## Cleanup Rule
After provider dispatch validation, retain the row if sent/logged as dispatch proof. If not used, it may be marked `suppressed`. Do not delete sent proof rows.

## Files
- docs/oar/measures_registry/oar2_seed_test_capture_row_v1.meta.md
- docs/oar/measures_registry/execute-seed-test-capture-row.cjs
