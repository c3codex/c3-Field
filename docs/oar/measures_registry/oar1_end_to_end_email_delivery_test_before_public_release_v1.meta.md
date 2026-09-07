---
document_type: oar1
authority_level: working
title: OAR1 — End-to-End Email Delivery Test Before Public Release
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_end_to_end_email_delivery_test_before_public_release_v1.meta.md
commit: pending
---

# OAR1 — End-to-End Email Delivery Test Before Public Release

## FINAL DISPOSITION

**EMAIL_DELIVERY_PASS**

All dispatch tests executed against local wrangler Pages dev server (`http://127.0.0.1:8788`) using `.dev.vars` bindings. All 4 tests passed. Operator confirmed DB row states, email receipt, and absence of email for consent-withheld row.

---

## PRECHECK

### 1. Binding name verification

Verified by name only across `.env.local` and `.env.cloudflare`. Secret values not printed.

| Binding | `.env.local` | `.env.cloudflare` | Status |
|---|---|---|---|
| `RESEND_API_KEY` | PRESENT | absent | PARTIAL |
| `OPERATOR_DISPATCH_KEY` | absent | absent | MISSING FROM LOCAL |
| `SUPABASE_URL` | PRESENT | PRESENT | PASS |
| `SUPABASE_SERVICE_ROLE_KEY` | absent (stored as `SUPABASE_C3_SECRET`) | PRESENT | PARTIAL |
| `OPERATOR_NOTIFY_EMAIL` | absent | absent | MISSING FROM LOCAL |

**Operator confirmation:** "Cloudflare variables are set" — production Cloudflare Pages environment is reported to have all required bindings.

**Resolution:** Operator added `OPERATOR_DISPATCH_KEY` and `OPERATOR_NOTIFY_EMAIL` to `.dev.vars`. `SUPABASE_SERVICE_ROLE_KEY` added as alias for `SUPABASE_C3_SECRET`. All 5 bindings confirmed present by wrangler at startup.

### 2. Secret values not printed

Confirmed. No values reproduced.

### 3. No VITE_ Resend key

Confirmed. `RESEND_API_KEY` is not referenced anywhere in the `src/` tree. No `VITE_RESEND` key introduced.

### 4. No service role key exposed to frontend

Confirmed. `SUPABASE_SERVICE_ROLE_KEY` is not referenced in any `src/` file. It is read exclusively by Cloudflare Pages Functions via `env.SUPABASE_SERVICE_ROLE_KEY`.

### 5. MCP DB access

Supabase MCP returned `Unauthorized` — live DB query and test row insertion cannot be performed from this session. Test row SQL provided below for operator execution.

---

## TEST PREPARATION — COMPLETE

### DB test rows (operator runs these in Supabase SQL editor or CLI)

#### Assessment test row — consent given (Test 1)

```sql
INSERT INTO public.measures_iis_eval_gate1_capture (
  institution_name, institution_address, institution_phone,
  contact_name, contact_position, contact_email,
  evaluation_answers, capture_context, intent, eligibility,
  campaign_tag, notification_state, metadata
) VALUES (
  'Test Organization',
  'testorg.example.com',
  '',
  'Test Contact',
  'Test Role',
  'connect@measuresregistry.com',
  '{"q1": {"selected": true}}'::jsonb,
  'measures_assessment_contact_gated_delivery',
  'assessment_result_delivery_request',
  '{
    "gate_1": "complete",
    "assessment_returned": true,
    "contact_capture_submitted": true,
    "consent_confirmed": true,
    "minimum_identity_captured": true,
    "src_requirements_satisfied": true,
    "implementation_src_requirements_satisfied": false,
    "deferred_src_fields_held": true
  }'::jsonb,
  'measures_assessment_contact_gated_delivery',
  'queued',
  '{
    "encounter_key": "measures_ai_operational_evaluation",
    "assessment_result_email_consent": true,
    "environmental_standing_report": {"standing_key": "test_standing", "operational_exposure_summary": "Test dispatch row."},
    "assessment_result_binding": {"contact_email": "connect@measuresregistry.com"},
    "structured_email_artifact": {
      "subject": "Your Measures Registry Assessment Results — Dispatch Test",
      "preview": "Test assessment delivery",
      "body": [
        "This is a test dispatch of your Measures Registry assessment results.",
        "Assessment results are informational and do not create certification, SEAT standing, c3 Key issuance, or professional advice.",
        "Questions? Contact us at connect@measuresregistry.com."
      ]
    }
  }'::jsonb
) RETURNING id;
-- Save this id as ASSESSMENT_CONSENT_TRUE_CAPTURE_ID
```

#### Assessment test row — consent withheld (Test 2)

```sql
INSERT INTO public.measures_iis_eval_gate1_capture (
  institution_name, institution_address, institution_phone,
  contact_name, contact_position, contact_email,
  evaluation_answers, capture_context, intent, eligibility,
  campaign_tag, notification_state, metadata
) VALUES (
  'Test Organization No Consent',
  'testorg.example.com',
  '',
  'Test Contact No Consent',
  'Test Role',
  'connect@measuresregistry.com',
  '{"q1": {"selected": false}}'::jsonb,
  'measures_assessment_contact_gated_delivery',
  'assessment_result_delivery_request',
  '{
    "gate_1": "complete",
    "assessment_returned": true,
    "contact_capture_submitted": true,
    "consent_confirmed": false,
    "minimum_identity_captured": true,
    "src_requirements_satisfied": true,
    "implementation_src_requirements_satisfied": false,
    "deferred_src_fields_held": true
  }'::jsonb,
  'measures_assessment_contact_gated_delivery',
  'queued',
  '{
    "encounter_key": "measures_ai_operational_evaluation",
    "assessment_result_email_consent": false,
    "environmental_standing_report": {"standing_key": "test_standing"},
    "assessment_result_binding": {"contact_email": "connect@measuresregistry.com"}
  }'::jsonb
) RETURNING id;
-- Save this id as ASSESSMENT_CONSENT_FALSE_CAPTURE_ID
```

#### Connect test row (Test 3)

```sql
INSERT INTO public.measures_registry_connect_capture (
  name, organization, email, message, notification_state
) VALUES (
  'Test Connect Sender',
  'Test Connect Organization',
  'connect@measuresregistry.com',
  'This is a test connect submission for end-to-end dispatch validation.',
  'queued'
) RETURNING id;
-- Save this id as CONNECT_CAPTURE_ID
```

---

### Local dev setup (Path A)

Create `.dev.vars` in project root:

```
# .dev.vars — Cloudflare Pages local dev secrets (never commit this file)
RESEND_API_KEY=<value from .env.local>
OPERATOR_DISPATCH_KEY=<operator-defined secret>
OPERATOR_NOTIFY_EMAIL=<operator notification inbox>
SUPABASE_URL=<value from .env.cloudflare>
SUPABASE_SERVICE_ROLE_KEY=<value from .env.cloudflare>
```

Add `.dev.vars` to `.gitignore` if not already present.

Start local Pages dev server (build first):

```bash
npm run build
wrangler pages dev dist --port 8788
```

---

### Test dispatch commands

Replace `<BASE_URL>` with either `http://localhost:8788` (local) or your Cloudflare Pages domain.
Replace `<OPERATOR_DISPATCH_KEY>` with the key value.

#### Test 1 — Assessment dispatch, consent given

```bash
curl -X POST <BASE_URL>/api/dispatch-assessment-notification \
  -H "Content-Type: application/json" \
  -H "x-operator-dispatch-key: <OPERATOR_DISPATCH_KEY>" \
  -d '{ "capture_id": "<ASSESSMENT_CONSENT_TRUE_CAPTURE_ID>" }'
```

**Expected response:**
```json
{
  "capture_id": "...",
  "dispatch_state": "sent",
  "notification_state": "notified",
  "provider": "resend",
  "provider_message_id": "...",
  "notified_at": "..."
}
```

**Verify in DB:**
```sql
SELECT notification_state, metadata->>'last_dispatch_provider', metadata->>'notified_at'
FROM measures_iis_eval_gate1_capture
WHERE id = '<ASSESSMENT_CONSENT_TRUE_CAPTURE_ID>';
-- Expected: notification_state = 'notified'
```

**Verify email:** Inbox at `contact_email` receives email with subject from `structured_email_artifact.subject`.

---

#### Test 2 — Assessment dispatch, consent withheld

```bash
curl -X POST <BASE_URL>/api/dispatch-assessment-notification \
  -H "Content-Type: application/json" \
  -H "x-operator-dispatch-key: <OPERATOR_DISPATCH_KEY>" \
  -d '{ "capture_id": "<ASSESSMENT_CONSENT_FALSE_CAPTURE_ID>" }'
```

**Expected response:**
```json
{
  "capture_id": "...",
  "dispatch_state": "held",
  "reason": "assessment_result_email_consent not given"
}
```

**Verify in DB:**
```sql
SELECT notification_state, metadata->>'dispatch_held_reason'
FROM measures_iis_eval_gate1_capture
WHERE id = '<ASSESSMENT_CONSENT_FALSE_CAPTURE_ID>';
-- Expected: notification_state = 'held', dispatch_held_reason = 'assessment_result_email_consent not given'
```

**Verify no email:** No email sent to the consent-false capture's contact address.

---

#### Test 3 — Connect dispatch

```bash
curl -X POST <BASE_URL>/api/dispatch-connect-notification \
  -H "Content-Type: application/json" \
  -H "x-operator-dispatch-key: <OPERATOR_DISPATCH_KEY>" \
  -d '{ "capture_id": "<CONNECT_CAPTURE_ID>" }'
```

**Expected response:**
```json
{
  "capture_id": "...",
  "dispatch_state": "sent",
  "notification_state": "sent",
  "provider": "resend",
  "provider_message_id": "...",
  "sent_at": "..."
}
```

**Verify in DB:**
```sql
SELECT notification_state, metadata->>'last_dispatch_provider', metadata->>'sent_at'
FROM measures_registry_connect_capture
WHERE id = '<CONNECT_CAPTURE_ID>';
-- Expected: notification_state = 'sent'
```

**Verify email:** `OPERATOR_NOTIFY_EMAIL` inbox receives notification. `reply_to` is `connect@measuresregistry.com` (the test submitter address).

---

### Authorization check — Test 4 (negative test)

```bash
curl -X POST <BASE_URL>/api/dispatch-assessment-notification \
  -H "Content-Type: application/json" \
  -H "x-operator-dispatch-key: wrong-key" \
  -d '{ "capture_id": "<any-uuid>" }'
```

**Expected:** `403 { "error": "dispatch access denied" }`

---

## EVIDENCE

Tests executed 2026-06-27 against `http://127.0.0.1:8788` via `npx wrangler pages dev dist --port 8788`.

| Check | Result | Evidence |
|---|---|---|
| Assessment dispatch — 200 response | PASS | `dispatch_state: "sent"` |
| Assessment row — `notification_state = 'notified'` | PASS | Operator confirmed DB |
| Assessment email received at inbox | PASS | Operator confirmed receipt at `connect@measuresregistry.com` |
| Consent-held — 200 response with `dispatch_state: "held"` | PASS | `dispatch_state: "held"`, `reason: "assessment_result_email_consent not given"` |
| Consent-held row — `notification_state = 'held'` | PASS | Operator confirmed DB |
| No email sent for consent-held row | PASS | Operator confirmed no email received |
| Connect dispatch — 200 response | PASS | `dispatch_state: "sent"` |
| Connect row — `notification_state = 'sent'` | PASS | Operator confirmed DB |
| Connect email received at `OPERATOR_NOTIFY_EMAIL` | PASS | Operator confirmed receipt |
| `reply_to` is submitter email | PASS | Set to `capture.email` in function |
| No certification implied in email | PASS | Email copy reviewed — no certification claim |
| No SEAT standing implied | PASS | Email copy reviewed — no SEAT standing claim |
| No c3 Key implied | PASS | Email copy reviewed — no c3 Key claim |
| No professional advice implied | PASS | Email copy reviewed — no professional advice claim |
| Unauthorized dispatch returns 403 | PASS | `403 { "error": "dispatch access denied" }` |
| Resend provider message IDs | PASS | Assessment: `2b8a505c-6d0a-41bd-8b82-6f32faa85068` / Connect: `e7dc7ccf-ddbe-4ea2-a8a3-31eb8bea45cb` |

---

## NOTCHAZZ FLAGS

None raised.

- Secret values not printed
- No VITE_RESEND key introduced
- Service role key not in frontend bundle
- Emails sent only via explicit operator-authorized test dispatch
- Consent-withheld path held correctly — no email sent for Test 2
- No certification, SEAT standing, c3 Key, professional advice, or tax deductibility in email content
- Operator not governed

---

## CLOSE

EMAIL_DELIVERY_PASS.

All dispatch functions verified end-to-end via local wrangler Pages dev. Assessment consent gate enforced. Connect dispatch routed to operator inbox with submitter reply-to. Unauthorized access blocked at 403. DB state confirmed by operator. Email receipt confirmed by operator.

Nothing is invented.
