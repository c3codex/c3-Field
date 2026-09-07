---
document_type: oar1
authority_level: launch
title: OAR1 — Public Launch of Measures Registry
status: hold
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_public_launch_of_measures_registry_v1.meta.md
commit: pending
---

# OAR1 — Public Launch of Measures Registry

## FINAL DISPOSITION

**PUBLIC_LAUNCH_HOLD**

Production site is live at `https://measuresregistry.com` over HTTPS. All routes respond correctly. No secret or prohibited claim exposure detected in production HTML.

HOLD issued because local `measures` branch is **65 commits ahead of `origin/measures`**. GitHub has not been updated. If Cloudflare Pages uses GitHub integration, the production deployment does not include:

- Email dispatch functions (`functions/api/dispatch-assessment-notification.ts`, `functions/api/dispatch-connect-notification.ts`)
- Encounter renderer architecture
- Legal routes (Privacy, Terms)
- Assessment consent contract
- All source changes from this launch build chain

**Operator action required:** Push to `origin/measures` and confirm Cloudflare Pages deploys from the updated branch — OR confirm production was deployed via direct wrangler upload and provide production deployment commit.

---

## PRODUCTION PREFLIGHT — EVIDENCE

### DNS and HTTPS

| Check | Result |
|---|---|
| `https://measuresregistry.com` resolves | PASS — HTTP 200, 3,359 bytes |
| HTTPS valid | PASS — TLS handshake succeeded |

### Route checks

| Route | Status | Notes |
|---|---|---|
| `/` | 200 | Live |
| `/ai-operations-assessment` | 308 → `/ai-operations-assessment/` → 200 | Cloudflare trailing-slash redirect — SPA normalizes, routes correctly |
| `/undrifted` | 308 → `/undrifted/` → 200 | Same trailing-slash pattern |
| `/about` | 200 | Live |
| `/privacy` | 200 | Live |
| `/terms` | 200 | Live |
| `/map-integrity-governance` | 200 | Live |

Note: 308 redirects are Cloudflare's standard trailing-slash behavior. `normalizePathname()` in `MeasuresRegistryRuntimeRegistered.tsx:162–164` strips the trailing slash before routing — no functional issue.

### Secret exposure scan (production HTML)

Scanned `https://measuresregistry.com` response body for:
`RESEND_API_KEY`, `OPERATOR_DISPATCH_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_C3_SECRET`, `Error:`, `stack trace`

**Result: Clean. No secrets or stack traces in production HTML.**

### Prohibited claims scan (production HTML)

Scanned for: `SEAT standing`, `c3 Key issuance`, `certification`, `tax-deductible`

**Result: Clean. No prohibited claims in production HTML.**

---

## DEPLOYMENT GAP — HOLD REASON

| Item | Status |
|---|---|
| Local `measures` HEAD | `3041a10` |
| `origin/measures` HEAD | 65 commits behind local |
| GitHub push status | **NOT PUSHED** |
| Email dispatch functions in GitHub | **ABSENT** |
| Cloudflare Pages production build source | Unknown — requires operator confirmation |

The local branch contains all authorized work including:
- `0806310` — email dispatch functions
- `075747d` — assessment consent contract
- `25f35b7` — Privacy and Terms routes
- `c016c3d` — intro content seating
- All encounter renderer architecture commits

None of these are in `origin/measures`. If Cloudflare Pages is configured to deploy from GitHub, the production build is running an older codebase.

---

## AUTHORIZED HELD ITEMS (source-verified)

The following items were confirmed HELD in source code — they are not accessible or activated in the current build:

| Item | Status | Evidence |
|---|---|---|
| SEAT public checkout | HELD | No SEAT checkout route in source |
| c3 Key issuance | HELD | Not referenced in public-facing routes |
| Certification claims | HELD | Explicitly disclaimed in Terms and assessment copy |
| Charitable solicitation | HELD | No solicitation copy in any public renderer |
| Tax-deductible claims | HELD | Explicitly disclaimed in Privacy and Terms |
| Paragraph automation | HELD | `is_active=false` in integration process record (migration `202606260010`) |
| Buffer automation | HELD | `is_active=false` in integration process record (migration `202606260009`) |
| Stripe MAP live activation | HOLD_FOR_OPERATOR | Confirm Stripe mode in production Cloudflare env |
| Social registry | HELD | Not referenced in public-facing routes |

---

## NOTCHAZZ FLAGS

None raised.

- No secrets exposed
- No payment auto-activated
- No SEAT standing exposed
- No c3 Key issuance exposed
- No certification claimed
- No tax-deductible contribution implied
- No charitable solicitation activated
- No social registry activated
- Operator not governed

---

## ROLLBACK TARGET

| Commit | Description |
|---|---|
| `897b381` | OAR1: final launch QA before public release — pre-email dispatch |
| `5aec7f9` | OAR1: end-to-end email delivery test — HOLD (test prep, pre-pass) |

Current HEAD: `3041a10` — OAR1: device QA preflight.

---

## OPERATOR ACTIONS TO CLOSE HOLD

### Option A — GitHub-integrated Cloudflare Pages

```bash
git push origin measures
```

Then confirm in Cloudflare Pages dashboard that the deployment from commit `3041a10` completes successfully.

### Option B — Direct wrangler deploy (if not GitHub-integrated)

If production was deployed via `wrangler pages deploy dist` directly:

Confirm in Cloudflare Pages dashboard:
- Current deployment commit hash
- Deployment includes `functions/api/dispatch-assessment-notification.ts` and `functions/api/dispatch-connect-notification.ts`

Provide confirmed production deployment commit to close this OAR1.

---

## TO RETURN PUBLIC_LAUNCH_COMPLETE

Confirm:

1. Push to `origin/measures` complete — OR production deployment commit confirmed separately
2. Cloudflare Pages deployment current from commit `3041a10` or later
3. Dispatch functions available at `/api/dispatch-assessment-notification` and `/api/dispatch-connect-notification` in production
4. Assessment submission works in production
5. Connect capture works in production
6. Stripe live payment mode confirmed (test vs. live)

Return confirmed evidence and final production deployment commit.

Nothing is invented.
