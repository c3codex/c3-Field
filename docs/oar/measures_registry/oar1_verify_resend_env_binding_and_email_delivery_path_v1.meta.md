---
document_type: oar1
authority_level: working
title: OAR1 — Verify Resend Env Binding and Email Delivery Path
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_verify_resend_env_binding_and_email_delivery_path_v1.meta.md
commit: inventory only — no mutations
---

# OAR1 — Verify Resend Env Binding and Email Delivery Path

## OBJECTIVE

Verify the Resend environment binding and email delivery path before end-to-end launch testing.
Evidence only. No mutations. No secrets exposed. No email sent.

---

## OVERALL STANDING

**INCOMPLETE — binding gap and scope mismatch identified before testing.**

`RESEND_API_KEY` is present. Two other required bindings are absent or misnamed.
The implemented dispatch function covers seat hold captures only — not assessment or connect captures.
End-to-end email test is not yet authorized until gaps are resolved.

---

## 1. REQUIRED ENV BINDING NAME

| Binding | Required by | Purpose |
|---|---|---|
| `RESEND_API_KEY` | `dispatch-seat-hold-notification.ts` | Authenticates Resend API call |
| `OPERATOR_DISPATCH_KEY` | `dispatch-seat-hold-notification.ts` | Gate on `x-operator-dispatch-key` header; prevents unauthorized dispatch |
| `SUPABASE_URL` | `dispatch-seat-hold-notification.ts` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `dispatch-seat-hold-notification.ts` | Service role for reading capture rows and writing dispatch log |

---

## 2. `.env.local` BINDING PRESENCE

Confirmed by name only. Secret values are not printed.

| Binding | Present in `.env.local` |
|---|---|
| `RESEND_API_KEY` | YES |
| `OPERATOR_DISPATCH_KEY` | NO — absent |
| `SUPABASE_URL` | YES |
| `SUPABASE_SERVICE_ROLE_KEY` | NO — stored as `SUPABASE_C3_SECRET` (naming mismatch) |

**Gap 1:** `OPERATOR_DISPATCH_KEY` is not in `.env.local`. The dispatch function will return 503 on this key.

**Gap 2:** The service role key is stored under `SUPABASE_C3_SECRET` in `.env.local`, not `SUPABASE_SERVICE_ROLE_KEY`. The dispatch function reads `env.SUPABASE_SERVICE_ROLE_KEY` and will throw `"Supabase server credentials are not configured"` without it.

Resolution options for Gap 2:
- Add `SUPABASE_SERVICE_ROLE_KEY` as an alias in `.env.local` pointing to the same value.
- Or update the function `Env` type and reads to also accept `SUPABASE_C3_SECRET`.

---

## 3. SECRET VALUE NOT PRINTED

Confirmed. No secret values are reproduced in this OAR1.

---

## 4. NO FRONTEND `VITE_` RESEND EXPOSURE

Confirmed. `RESEND_API_KEY` is not prefixed with `VITE_` and is not present in any `src/` file.

Grep confirms no `VITE_RESEND` reference exists anywhere in the source tree. The key is consumed server-side only by the Cloudflare Pages Function runtime via `env.RESEND_API_KEY`.

---

## 5. EMAIL SENDER IMPLEMENTATION PATH

**Implemented (Cloudflare Pages Function — seat hold only):**

| File | Route | Trigger |
|---|---|---|
| `functions/api/dispatch-seat-hold-notification.ts` | `POST /api/dispatch-seat-hold-notification` | Explicit operator HTTP dispatch with `x-operator-dispatch-key` header |

This function:
- Reads from `measures_seat_hold_capture` where `notification_state = 'queued'` AND `seat_lifecycle_state = 'approved'`
- Fetches subject/body from `measures_seat_hold_notification_template` by `offering_key`
- POSTs to `https://api.resend.com/emails` using `RESEND_API_KEY`
- Writes outcome to `measures_seat_hold_notification_dispatch_log`
- Updates `notification_state` to `notified` or `failed` on the capture row

**Absent (no implementation):**

| Capture table | `notification_state` set | Dispatch function |
|---|---|---|
| `measures_iis_eval_gate1_capture` (assessment) | `queued` | ABSENT |
| `measures_registry_connect_capture` (connect form) | `queued` | ABSENT |

Assessment captures are inserted directly from the client via the Supabase anon key. No Cloudflare Pages Function or Supabase edge function exists to process queued notifications for either table. This was identified as P0 in `oar1_final_launch_qa_before_public_release_v1` and confirmed here.

---

## 6. QUEUED NOTIFICATION PATH IDENTIFIED

**Assessment (`measures_iis_eval_gate1_capture`):**

Insert at: `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:621`
```ts
const { data: captureData, error } = await supabase
  .from("measures_iis_eval_gate1_capture")
  .insert({ ..., notification_state: "queued", ... })
```

After insert, `captureData[0]?.id` is available in the client — no notification is triggered. The row sits queued with no processor.

**Connect (`measures_registry_connect_capture`):**

Insert at: `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:564`
```ts
const { error } = await supabase
  .from("measures_registry_connect_capture")
  .insert({ ..., notification_state: "queued", ... })
```

Same pattern — no processor.

---

## 7. PRODUCTION BINDING LOCATION

**Cloudflare Pages environment variables** (Settings → Environment Variables in the Cloudflare Pages dashboard).

All four bindings must be set as **encrypted secrets** in Cloudflare Pages:
- `RESEND_API_KEY`
- `OPERATOR_DISPATCH_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

`.env.local` is used by local Wrangler dev only. It is not deployed.

Note: No `wrangler.toml` or `wrangler.jsonc` was found in the project root. Pages Function bindings are declared in Cloudflare Pages dashboard, not from a local config file.

---

## 8. WHETHER END-TO-END EMAIL TEST IS AUTHORIZED NEXT

**NOT YET — resolve binding gaps first.**

End-to-end test is authorized for the seat hold dispatch path after:

| Step | Status |
|---|---|
| `RESEND_API_KEY` in `.env.local` | DONE |
| `OPERATOR_DISPATCH_KEY` added to `.env.local` | REQUIRED |
| `SUPABASE_SERVICE_ROLE_KEY` resolved in `.env.local` (Gap 2 above) | REQUIRED |
| `RESEND_API_KEY` set in Cloudflare Pages environment variables | REQUIRED before production test |
| `OPERATOR_DISPATCH_KEY` set in Cloudflare Pages environment variables | REQUIRED before production test |
| `SUPABASE_SERVICE_ROLE_KEY` set in Cloudflare Pages environment variables | REQUIRED before production test |
| Seat hold capture row with `seat_lifecycle_state = 'approved'` exists in DB | REQUIRED for dispatch |

**Assessment / connect email test is NOT authorized** — implementation is absent. A new Pages Function must be created for each capture path before testing.

**Exact next test step (seat hold path):**

1. Resolve `SUPABASE_SERVICE_ROLE_KEY` gap in `.env.local`.
2. Add `OPERATOR_DISPATCH_KEY` to `.env.local`.
3. Run `wrangler pages dev` locally.
4. POST to `http://localhost:8788/api/dispatch-seat-hold-notification` with:
   ```json
   { "capture_id": "<queued-and-approved-seat-hold-id>" }
   ```
   Header: `x-operator-dispatch-key: <OPERATOR_DISPATCH_KEY value>`
5. Confirm `200` response with `dispatch_state: "sent"`.
6. Confirm `notification_state: "notified"` in `measures_seat_hold_capture`.
7. Confirm email received at recipient address.

---

## GAPS SUMMARY

| Gap | Priority | Blocks |
|---|---|---|
| `OPERATOR_DISPATCH_KEY` absent from `.env.local` | P0 | Local dispatch test |
| `SUPABASE_SERVICE_ROLE_KEY` naming mismatch (`SUPABASE_C3_SECRET`) | P0 | Local dispatch test |
| All three bindings must be set in Cloudflare Pages | P0 | Production dispatch |
| No dispatch function for assessment captures | P0 | Assessment email delivery |
| No dispatch function for connect captures | P0 | Connect form email delivery |

---

## NOTCHAZZ FLAGS

None raised.

- Secret value not printed — `RESEND_API_KEY` confirmed by name only
- No `VITE_RESEND` exposure confirmed
- No email sent — inventory only
- Missing implementations not treated as working — explicitly flagged as absent
- Dashboard domain verification not treated as app delivery
- Operator not governed

---

## CLOSE

`RESEND_API_KEY` is present in `.env.local` under the correct binding name.

Email delivery via Resend is implemented for the seat hold path only (`dispatch-seat-hold-notification.ts`).

Two binding gaps block local testing of even the implemented path: `OPERATOR_DISPATCH_KEY` is absent, and `SUPABASE_SERVICE_ROLE_KEY` is stored under a different name (`SUPABASE_C3_SECRET`).

Assessment and connect capture email delivery have no implementation. Those paths require new Cloudflare Pages Functions before end-to-end testing is possible.

End-to-end email test is not yet authorized. Resolve binding gaps first.

Nothing is invented.
