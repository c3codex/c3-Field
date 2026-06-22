---
document_type: oar2
authority_level: launch
document_scope: deployment_and_production_verification
title: OAR2 — Commit, Deploy and Production Browser Verification
status: proposed
version: v1
operator: op044
system: measures_registry
process_key: commit_deploy_and_production_browser_verification
source_oar1:
  - docs/oar/measures_registry/oar1_seat_c3field_route_authority_and_deploy_final_launch_repair_v1.meta.md
---

# OAR2 — Commit, Deploy and Production Browser Verification v1

## OBSERVED

Launch repairs have been applied.

Current standing:

- root authority media query repaired
- stale crystal chamber dependency removed
- fallback authority removed
- facebook placeholder removed
- root route head repaired
- c3field redirect rule applied
- c3field route head created
- build script patched for persistence

Deployment has not yet occurred.

Browser QA has not yet occurred.

SEAT remains held pending deployment and rendered verification.

## ALIGNED

Deploy current seated state.

Do not introduce new features.

Do not introduce new routes.

Do not alter content.

Do not alter MAP/payment.

Do not alter social scheduling.

Do not alter publication standing.

Deploy only the repaired launch state.

## ROUTED

### 1. Commit

Commit all staged launch repairs.

Required files include:

- dist-registry/_redirects
- dist-registry/index.html
- dist-registry/c3field/index.html
- scripts/generate-registry-route-heads.cjs

Record commit hash.

### 2. Deploy

Push to production branch.

Allow Cloudflare Pages deployment to complete.

Record:

- commit hash
- deployment identifier
- production URL
- deployment status

### 3. Production Verification

Verify live production:

#### Root

- https://measuresregistry.com/
- intro_hook loads
- path choice loads

#### Left Path

- assessment path opens
- assessment sequence functions
- contact capture follows assessment

#### Right Path

- passage media loads
- About Measures Registry renders
- Codexstone seal visible

#### Undrifted

- https://measuresregistry.com/undrifted
- page loads
- social icons visible
- Facebook absent

#### Footer

- Registered Branch of c3 Field visible
- click opens https://c3field.online
- no redirect loop
- no fallback to root intro

### 4. Browser QA

If browser capability exists:

Return:

- screenshots
- console findings
- network findings

If browser capability does not exist:

Return exact capability limitation.

Do not fabricate verification.

### 5. Final Standing

Return:

- deployment complete yes/no
- production verified yes/no
- browser verified yes/no
- remaining defects
- SEAT standing

## ACCEPTANCE

Launch may move to VERIFIED only when:

- deployment completed
- root intro visible
- path choice visible
- right path renders correctly
- c3field redirect functions
- Facebook absent
- no critical production defects found

## EXPECTED OAR1

docs/oar/measures_registry/oar1_commit_deploy_and_production_browser_verification_v1.meta.md

## CLOSE

This OAR performs the production deployment and final launch verification pass.
