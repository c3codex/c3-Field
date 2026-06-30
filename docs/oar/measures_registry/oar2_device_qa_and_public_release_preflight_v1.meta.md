---
document_type: oar2
authority_level: working
document_scope: device_qa_and_release_preflight
title: OAR2 - Device QA and Public Release Preflight
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Device QA and Public Release Preflight

## PURPOSE

Complete final device QA and production release preflight.

Evidence only.

No architecture changes.
No feature work.
No legal copy changes.
No payment activation unless explicitly authorized.
Nothing is invented.

## OBSERVED

P0 source-side launch blockers are cleared.

Email delivery tests passed:

- assessment consent true sent
- assessment consent false held
- connect dispatch sent
- unauthorized dispatch denied

Remaining launch question:

Can the public site be encountered cleanly across production route, devices, media, legal surfaces, assessment flow, publication surfaces, and fallback states?

## REQUIRED QA

### Production Routes

Verify live routes:

- /
- /ai-operations-assessment
- /undrifted
- /about
- /privacy
- /terms
- /map-integrity-governance
- invalid route

For each return:

- status
- rendered surface
- visible headline or marker
- console errors
- network failures

### Device QA

Test:

- 1440 x 900
- 1366 x 768
- 768 x 1024
- 390 x 844

Verify:

- no horizontal overflow
- CTA visible
- footer links visible where expected
- text readable
- video/media does not cover controls
- assessment form usable
- legal pages readable

### Intro and Encounter Flow

Verify:

- intro loads
- video or motion media loads if seated
- path choice works
- left path reaches assessment
- right path reaches about or understand path
- no stale legacy keys render
- no runtime terminology visible to public

### Assessment Flow

Verify:

- 7 questions render
- navigation works
- scoring completes
- contact capture renders
- consent fields render and are unchecked by default
- submission succeeds
- email dispatch path already PASS from prior OAR
- no certification, SEAT, c3 Key, or professional advice claim appears

### Publication Flow

Verify:

- /undrifted renders
- six publication dispatches appear or are accessible
- Paragraph links resolve
- Structural Drift remains article, not publication identity
- images and teasers display if seated
- no broken internal article route

### Legal Surfaces

Verify:

- /privacy renders
- /terms renders
- footer links navigate
- Contact link resolves to /about or active contact pathway
- legal identity statement present
- no federal tax-exempt claim
- no tax-deductible claim
- no charitable solicitation claim

### MAP Boundary

Verify:

- /map-integrity-governance renders
- MAP cards render if seated
- no SEAT pricing exposed
- no certification claim
- no c3 Key issuance claim
- payment CTA behavior documented
- Stripe live payment not activated unless explicitly authorized

### Media and Assets

Verify:

- images load
- videos load
- posters load
- missing assets handled gracefully
- no broken logo path
- no stale bundle issue
- no source map or secret exposure

### Error and Held States

Verify:

- invalid route produces acceptable held or 404 behavior
- gap states are understandable
- no stack traces
- no raw error objects
- no internal secret or env names visible

### Cloudflare and Production Preflight

Verify:

- DNS resolves
- HTTPS valid
- Cloudflare Pages deployment current
- production env vars present by name only:
  - RESEND_API_KEY
  - OPERATOR_DISPATCH_KEY
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
  - OPERATOR_NOTIFY_EMAIL
- no secret values printed
- Pages Functions available
- rollback target identified

## REQUIRED OUTPUT

For every category return:

- PASS
- FAIL
- GAP
- HOLD

Include:

- evidence
- severity
- blocker status
- recommended disposition

## FINAL DISPOSITION

Return one:

- READY_FOR_PUBLIC_RELEASE
- NOT_READY
- HOLD_FOR_OPERATOR

## NOTCHAZZ FLAGS

Raise NotChazz if:

- architecture changes during QA
- DB mutates without explicit repair authorization
- legal copy changes
- payment activates unexpectedly
- SEAT standing is exposed
- c3 Key standing is exposed
- secrets are printed
- public route exposes stale runtime terminology
- operator is governed instead of the work body

## CLOSE

Perform final device QA and release preflight.

Evidence only.

Nothing is invented.
