---
document_type: oar1
authority_level: working
title: OAR1 — End-to-End Email Delivery Test Before Public Release
status: hold
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_end_to_end_email_delivery_test_before_public_release_v1.meta.md
commit: pending
---

# OAR1 — End-to-End Email Delivery Test Before Public Release

## FINAL DISPOSITION

**EMAIL_DELIVERY_HOLD**

Precheck partially complete. Live dispatch tests cannot be executed without operator completing local dev bindings or deploying to Cloudflare Pages and providing the test dispatch commands.

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

**Local dev gap:** `OPERATOR_DISPATCH_KEY` and `OPERATOR_NOTIFY_EMAIL` are not present in any local env file. Wrangler pages dev cannot run all tests without these.

**No `.dev.vars` file exists.** No `wrangler.toml` found. No `wrangler pages dev` script in `package.json`.

### 2. Secret values not printed

Confirmed. No values reproduced.

### 3. No VITE_ Resend key

Confirmed. `RESEND_API_KEY` is not referenced anywhere in the `src/` tree. No `VITE_RESEND` key introduced.

### 4. No service role key exposed to frontend

Confirmed. `SUPABASE_SERVICE_ROLE_KEY` is not referenced in any `src/` file. It is read exclusively by Cloudflare Pages Functions via `env.SUPABASE_SERVICE_ROLE_KEY`.

### 5. MCP DB access

Supabase MCP returned `Unauthorized` — live DB query and test row insertion cannot be performed from this session. Test row SQL provided below for operator execution.

---

## HOLD — REASON

Two bindings (`OPERATOR_DISPATCH_KEY`, `OPERATOR_NOTIFY_EMAIL`) are absent from all local env files. Per OAR2 precheck rule: "If any required binding is missing, stop and return HOLD."

Production Cloudflare Pages environment is operator-confirmed as set. Live tests can be completed by either:

**Path A — Local wrangler dev:**
Operator sets up `.dev.vars` with all required secrets, runs `wrangler pages dev`, executes test dispatches.

**Path B — Production deployment:**
Deploy `measures` branch to Cloudflare Pages (or confirm it is deployed), then execute test dispatches against the live URL.

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

## EVIDENCE TO RETURN ON COMPLETION

When tests are run, update this OAR1 with:

| Check | Result | Evidence |
|---|---|---|
| Assessment dispatch — 200 response | | |
| Assessment row — `notification_state = 'notified'` | | |
| Assessment email received at inbox | | |
| Consent-held — 200 response with `dispatch_state: "held"` | | |
| Consent-held row — `notification_state = 'held'` | | |
| No email sent for consent-held row | | |
| Connect dispatch — 200 response | | |
| Connect row — `notification_state = 'sent'` | | |
| Connect email received at `OPERATOR_NOTIFY_EMAIL` | | |
| `reply_to` is submitter email | | |
| No certification implied in email | | |
| No SEAT standing implied | | |
| No c3 Key implied | | |
| No professional advice implied | | |
| Unauthorized dispatch returns 403 | | |
| Resend dashboard confirms all sends | | |

---

## NOTCHAZZ FLAGS

None raised.

- Secret values not printed
- No VITE_RESEND key introduced
- Service role key not in frontend bundle
- No email sent during this OAR (precheck only)
- Consent-withheld path held correctly in implementation
- No certification, SEAT standing, c3 Key, professional advice, or tax deductibility in email content
- Operator not governed

---

## CLOSE

Precheck complete. All binding names verified. `OPERATOR_DISPATCH_KEY` and `OPERATOR_NOTIFY_EMAIL` are absent from local env files — tests cannot run without operator adding them.

Production Cloudflare Pages environment is operator-confirmed as set. Live tests are ready to execute once operator either:

1. Creates `.dev.vars` with missing local bindings and runs `wrangler pages dev`, or
2. Deploys `measures` branch and tests against the live Cloudflare Pages URL

DB test row INSERT SQL is provided above. Exact curl dispatch commands are provided. DB verification queries are provided.

Return `EMAIL_DELIVERY_PASS` when all evidence rows in the table above are confirmed.

Nothing is invented.
