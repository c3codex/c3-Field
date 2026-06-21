---
document_type: oar2
authority_level: proposed_execution
system_scope: measures_registry_live_runtime_boundary_repair
title: OAR2 - Remove Stale Isolated Runtime Content and Surface Exposure Before Live QA
status: ready_for_execution
version: v1
operator: op044
process_key: remove_stale_isolated_runtime_content_surface_exposure_before_live_qa
---

# OAR2 - Remove Stale Isolated Runtime Content and Surface Exposure Before Live QA

## OBJECTIVE

Remove stale isolated Measures Registry runtime exposure after successful Cloudflare deployment, and restore the DB-first rendering boundary before live QA continues.

## LIVE QA FINDING

Cloudflare deployment was successful.

However, production still resolves:

https://measuresregistry.com/?surface=crystal_chamber

That URL renders old isolated Measures Registry runtime content with no seated media.

This confirms two issues:

1. A stale internal surface route remains publicly reachable.
2. Old Measures Registry content is seated in runtime/source files instead of resolving exclusively from the database.

This is not a Cloudflare deployment failure.

This is a deployed stale runtime/content boundary violation.

## BOUNDARY

Measures Registry isolated runtime should not exist in public runtime files.

Raw chamber/surface query keys must not be publicly reachable.

Public-facing content must not be hard-seated in runtime/source files.

The renderer may contain approved shells, loaders, held states, missing states, and DB-bound rendering logic only.

## REQUIRED WORK

1. Search source/runtime for stale route keys:

- crystal_chamber
- obsidian_chamber
- lapis_chamber
- marble_chamber
- isolated_measures_registry
- measures_registry_isolated
- surface=

2. Remove or block public query-string routing to stale internal chamber surfaces.

3. Search source/runtime for hard-seated Measures Registry public content, including:

- old article cards
- old chamber copy
- old explainer labels
- old media labels
- old CTA copy
- old fallback public copy
- isolated Measures Registry surface objects

4. Remove hard-seated public content from runtime/source files unless it is one of the following approved renderer states:

- loading state
- neutral held state
- DB-missing state
- error state
- renderer shell

5. Confirm public Measures Registry content resolves from Supabase registry records, not source-file content objects.

6. Confirm DB-missing states do not render old public content.

7. Confirm live Measures Registry entry uses only approved launch routing.

8. Confirm old isolated Measures Registry runtime files are not reachable in production.

9. Preserve DB-first rendering boundary.

10. Do not create or activate:

- payment
- checkout session
- webhook fulfillment
- SRC binding
- c3 key
- permission
- certification
- DAO standing
- Codexstone conversion
- Registry Certification

## ACCEPTANCE

- https://measuresregistry.com/?surface=crystal_chamber no longer renders old isolated runtime.
- No stale isolated chamber surface is publicly reachable.
- Old Measures Registry public content is not seated in runtime/source files.
- Runtime files contain renderer logic only, not source-owned public truth.
- Public content resolves from Supabase registry records.
- Missing DB/media records show neutral held/loading/error states only.
- Public root resolves approved Measures Registry launch entry.
- Cloudflare redeploy succeeds after correction.
- Return changed files and live QA evidence.

## RETURN EVIDENCE

Return:

1. Search results for stale surface keys.
2. Search results for hard-seated Measures Registry content.
3. Files changed.
4. Explanation of route blocking/removal.
5. Confirmation of DB-first content boundary.
6. Production QA result after redeploy.
7. Confirmation no payment, checkout, SRC, c3 key, certification, DAO, Codexstone, or Registry Certification standing was created.
