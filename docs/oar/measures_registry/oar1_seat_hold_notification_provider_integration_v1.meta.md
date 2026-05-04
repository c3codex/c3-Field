---
document_type: oar1
title: OAR1 Seat Hold Notification Provider Integration
version: v1
status: executed
system: measures_registry
operator: op044
source_oar2: docs/oar/measures_registry/oar2_seat_hold_notification_provider_integration_v1.meta.md
---

OAR1: oar1_seat_hold_notification_provider_integration_v1

## Objective
Integrate Resend as the explicit server-side provider for queued seat hold notification dispatch.

## Actions
- Added same-origin server dispatch function:
  - `/api/dispatch-seat-hold-notification`
- Kept `RESEND_API_KEY` server-side only.
- Required operator dispatch key through `OPERATOR_DISPATCH_KEY`.
- Updated operator review dispatch button to call the server function instead of direct DB dispatch.
- Seated provider metadata on DB templates:
  - provider: `resend`
  - sender: `Measures Registry <connect@measuresregistry.com>`
  - reply_to: `connect@measuresregistry.com`
- Preserved DB-governed templates and notification state.
- Revoked the prior direct DB template dispatch function from public, anon, and authenticated roles.

## Constraints Held
- No frontend API key.
- No public dispatch access.
- No automatic send on capture.
- No batch sending.
- No payment links.
- No SRC language.
- No c3 key logic.
- No cohort opening.
- No Measures of Inanna changes.

## Validation
```json
{
  "dbConnection": "active",
  "provider": "resend",
  "sender": "Measures Registry <connect@measuresregistry.com>",
  "replyTo": "connect@measuresregistry.com",
  "reviewViewHasCaptureId": true,
  "oldDbTemplateDispatchRevoked": true,
  "resendApiKeyServerSideOnly": true,
  "serverResendKeyPresentLocally": false,
  "build_registry": "passed"
}
```

## Required Server Environment
- `RESEND_API_KEY`
- `OPERATOR_DISPATCH_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_URL` or `VITE_SUPABASE_URL`

## Validation Standing
The implementation is wired for real Resend dispatch, but local real-send validation was not performed because `RESEND_API_KEY` is not present in the local server environment. Once the required Cloudflare Pages environment variables are set, queued operator dispatch will send through Resend and record:
- `provider = resend`
- `provider_message_id = Resend email id`
- `dispatch_state = sent`
- `notification_state = notified`
- `notified_at = now()`

## Files
- docs/oar/measures_registry/oar2_seat_hold_notification_provider_integration_v1.meta.md
- docs/oar/measures_registry/execute-seat-hold-notification-provider-integration.cjs
- functions/api/dispatch-seat-hold-notification.ts
- src/measures_registry/MeasuresRegistryRuntime.tsx
- src/index.css
