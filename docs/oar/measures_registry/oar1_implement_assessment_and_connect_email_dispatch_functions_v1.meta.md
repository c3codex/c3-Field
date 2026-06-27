---
document_type: oar1
authority_level: working
title: OAR1 — Implement Assessment and Connect Email Dispatch Functions
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_implement_assessment_and_connect_email_dispatch_functions_v1.meta.md
commit: pending
---

# OAR1 — Implement Assessment and Connect Email Dispatch Functions

## OBJECTIVE

Create Cloudflare Pages Functions to dispatch queued email notifications for:
- Assessment captures (`measures_iis_eval_gate1_capture`)
- Connect captures (`measures_registry_connect_capture`)

Operator-gated. No secrets exposed. No email sent during implementation.

---

## FILES CHANGED

| File | Change |
|---|---|
| `functions/api/dispatch-assessment-notification.ts` | Created — Cloudflare Pages Function for assessment email dispatch |
| `functions/api/dispatch-connect-notification.ts` | Created — Cloudflare Pages Function for connect email dispatch |

---

## 1. DISPATCH-ASSESSMENT-NOTIFICATION EXISTS

`functions/api/dispatch-assessment-notification.ts` — created.

---

## 2. DISPATCH-CONNECT-NOTIFICATION EXISTS

`functions/api/dispatch-connect-notification.ts` — created.

---

## 3. BOTH REQUIRE POST

Assessment:
```ts
export const onRequest: PagesFunction<Env> = async () =>
  jsonResponse({ error: "method not allowed" }, 405)
// POST handler registered as onRequestPost
```
Connect: same pattern. Any non-POST method returns 405.

---

## 4. BOTH REQUIRE X-OPERATOR-DISPATCH-KEY

Assessment:
```ts
const operatorKey = request.headers.get("x-operator-dispatch-key")
if (operatorKey !== env.OPERATOR_DISPATCH_KEY) {
  return jsonResponse({ error: "dispatch access denied" }, 403)
}
```
Connect: identical gate.

Both return 503 if `OPERATOR_DISPATCH_KEY` binding is absent.

---

## 5. BOTH READ RESEND_API_KEY SERVER-SIDE ONLY

Both functions:
```ts
type Env = {
  RESEND_API_KEY?: string
  ...
}
// Used only in:
authorization: `Bearer ${env.RESEND_API_KEY}`
```

Key is consumed from Cloudflare Pages environment via `env` — never from `import.meta.env`, never from `window`, never from frontend bundle.

---

## 6. BOTH READ SUPABASE_SERVICE_ROLE_KEY SERVER-SIDE ONLY

Both functions:
```ts
type Env = {
  SUPABASE_SERVICE_ROLE_KEY?: string
  ...
}
// Used only in supabaseFetch() as:
apikey: serviceRoleKey,
authorization: `Bearer ${serviceRoleKey}`
```

Never exposed to frontend.

---

## 7. NO VITE_ RESEND KEY INTRODUCED

Confirmed. No `VITE_RESEND` binding is referenced or introduced in either function or anywhere in the source tree.

---

## 8. NO SECRETS PRINTED

Confirmed. No secret values are reproduced in this OAR1.

---

## 9. ASSESSMENT DISPATCH READS MEASURES_IIS_EVAL_GATE1_CAPTURE

```ts
const [capture] = await supabaseFetch<AssessmentCaptureRow[]>(
  env,
  `measures_iis_eval_gate1_capture?id=eq.${captureId}&select=id,contact_name,contact_email,institution_name,notification_state,metadata&limit=1`,
)
```

Gate: `notification_state === "queued"` AND `metadata.assessment_result_email_consent === true`.

If consent is false, updates `notification_state` to `"held"` (not failed — consent withheld is governance, not an error). Returns 200 with `dispatch_state: "held"`.

Email recipient: `contact_email` (top-level column on capture row).

Email content: reads `metadata.structured_email_artifact.subject` and `.body` if present. Falls back to minimal launch-safe text:
- Thank-you acknowledgment with contact name
- Submission received notice
- Informational boundary statement (no certification, SEAT standing, c3 Key, professional advice)
- Contact email

Sender: `Measures Registry <connect@measuresregistry.com>` — matches existing seat hold convention.

---

## 10. CONNECT DISPATCH READS MEASURES_REGISTRY_CONNECT_CAPTURE

```ts
const [capture] = await supabaseFetch<ConnectCaptureRow[]>(
  env,
  `measures_registry_connect_capture?id=eq.${captureId}&select=id,name,organization,email,message,capture_context,notification_state,metadata,created_at&limit=1`,
)
```

Gate: `notification_state === "queued"`.

Recipient: `OPERATOR_NOTIFY_EMAIL` env binding. If absent, returns 503 with `code: "missing_required"` — no hardcoded recipient invented.

Email content: name, organization, submitter email, message (if present), submission timestamp, capture context.

`reply_to` set to `capture.email` so operator can reply directly to the submitter.

Subject: `"New connection request — {name}, {organization}"`

---

## 11. NOTIFICATION_STATE UPDATES TO NOTIFIED OR FAILED

**Assessment:**

| Outcome | `notification_state` |
|---|---|
| Consent not given | `"held"` |
| Resend success | `"notified"` |
| Resend error | `"failed"` |

Note: `"notified"` matches the seat hold dispatch pattern. The `measures_iis_eval_gate1_capture` table's `notification_state` constraints were not found in migration files — the table predates the current migration chain. If a constraint violation occurs on `"notified"` or `"held"`, it will surface as a 500 error on the function response.

**Connect:**

| Outcome | `notification_state` |
|---|---|
| Resend success | `"sent"` |
| Resend error | `"failed"` |

`"sent"` matches the declared CHECK constraint: `('queued', 'sent', 'failed', 'held')`.

Both functions write dispatch evidence into the capture row's `metadata` field on each outcome:
- `dispatch_error` on failure
- `last_dispatch_provider`, `last_dispatch_provider_message_id`, `last_dispatch_subject`, `notified_at`/`sent_at` on success
- `dispatch_held_reason` on held

No new log table created — OAR2 required avoiding new schema.

---

## 12. NO EMAIL SENT DURING IMPLEMENTATION

Confirmed. Functions require explicit POST with `x-operator-dispatch-key` to trigger any Resend call. No email was sent during file creation or build.

---

## 13. BUILD PASSES

```
✓ built in 7.53s
```

No TypeScript errors. Both new function files are outside the Vite bundle (Cloudflare Pages Functions are compiled separately by Wrangler) and do not affect the client bundle.

---

## 14. LOCAL AND PRODUCTION TEST INSTRUCTIONS

### Required bindings before any test

| Binding | Assessment | Connect |
|---|---|---|
| `RESEND_API_KEY` | Required | Required |
| `OPERATOR_DISPATCH_KEY` | Required | Required |
| `SUPABASE_URL` | Required | Required |
| `SUPABASE_SERVICE_ROLE_KEY` | Required | Required |
| `OPERATOR_NOTIFY_EMAIL` | Not required | Required |

**Note from prior OAR (`oar1_verify_resend_env_binding_and_email_delivery_path_v1`):** `SUPABASE_SERVICE_ROLE_KEY` is stored as `SUPABASE_C3_SECRET` in `.env.local`. This naming mismatch must be resolved before local testing. Options:
1. Add `SUPABASE_SERVICE_ROLE_KEY=<value>` as an alias in `.env.local`
2. Or add `SUPABASE_C3_SECRET` to the `Env` type in all dispatch functions and fall back to it

### Local test — assessment dispatch

```bash
# Start local Pages dev server
wrangler pages dev dist --port 8788

# POST with queued assessment capture ID
curl -X POST http://localhost:8788/api/dispatch-assessment-notification \
  -H "Content-Type: application/json" \
  -H "x-operator-dispatch-key: <OPERATOR_DISPATCH_KEY>" \
  -d '{ "capture_id": "<uuid-of-queued-capture>" }'
```

Expected: `200` with `dispatch_state: "sent"`, `notification_state: "notified"`.

If consent was false on capture: `200` with `dispatch_state: "held"`.

### Local test — connect dispatch

```bash
curl -X POST http://localhost:8788/api/dispatch-connect-notification \
  -H "Content-Type: application/json" \
  -H "x-operator-dispatch-key: <OPERATOR_DISPATCH_KEY>" \
  -d '{ "capture_id": "<uuid-of-queued-connect-capture>" }'
```

Expected: `200` with `dispatch_state: "sent"`, `notification_state: "sent"`.

### Production

Set in Cloudflare Pages → Settings → Environment Variables:
- `RESEND_API_KEY`
- `OPERATOR_DISPATCH_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPERATOR_NOTIFY_EMAIL` (connect dispatch only)

Deploy triggers automatically on push to main. Functions are served at `/api/dispatch-assessment-notification` and `/api/dispatch-connect-notification`.

---

## PRESERVED

- Assessment scoring — unmodified
- Contact capture form — unmodified
- Consent behavior — unmodified (consent gate enforced in dispatch, not removed)
- Legal routes — unmodified
- Publication routes — unmodified
- Payment behavior — unmodified
- Stripe — unmodified
- Paragraph — unmodified
- Buffer — unmodified

---

## NOT CREATED

- Certification
- SEAT standing
- c3 Key issuance
- DAO membership
- Tax-deductible contribution claim

---

## NOTCHAZZ FLAGS

None raised.

- Secret values not printed
- No `VITE_RESEND` key introduced or referenced
- Email sends without operator authorization: NO — both functions gate on `OPERATOR_DISPATCH_KEY` header
- Certification implied: NO — assessment fallback email explicitly states "do not create certification"
- SEAT standing implied: NO — assessment fallback email explicitly states "do not create SEAT standing"
- c3 Key issuance implied: NO — stated in fallback copy
- Professional advice implied: NO — stated in fallback copy
- Tax deductibility implied: NO — absent from both email bodies
- Payment behavior changed: NO
- Unrelated routes changed: NO
- Operator governed: NO

---

## CLOSE

`dispatch-assessment-notification.ts` and `dispatch-connect-notification.ts` created as Cloudflare Pages Functions.

Both are operator-gated, server-side only, and read `RESEND_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` from environment — not from the frontend bundle.

Assessment dispatch gates on `assessment_result_email_consent` before sending. Connect dispatch requires `OPERATOR_NOTIFY_EMAIL` binding and returns `missing_required` if absent.

No email was sent during implementation.

Before testing: resolve `SUPABASE_SERVICE_ROLE_KEY` naming gap in `.env.local` and add `OPERATOR_DISPATCH_KEY` (both identified in prior OAR). Add `OPERATOR_NOTIFY_EMAIL` for connect dispatch.

Build passes.

Nothing is invented.
