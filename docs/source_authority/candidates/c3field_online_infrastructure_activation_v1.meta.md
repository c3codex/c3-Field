---
document_type: oar1
authority_level: working
document_scope: initiative_infrastructure_activation
title: OAR1 — c3field.online Infrastructure Activation
status: seeded
version: v1
operator: op044
initiative: c3_field_convergence
operation_key: c3field_online_infrastructure_activation
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
  cody: frontend_executor
tags:
  - oar1
  - infrastructure
  - cloudflare-pages
  - r2
  - supabase-storage
  - media-resolution
  - c3-field-convergence
source_alignment:
  - Seed Concordance
  - The 21 of Coherence
  - OAR Lifecycle — Execution and Handoff
  - OAR1 — Foundational Role Registration
---

# OAR1 — c3field.online Infrastructure Activation
## c3 Field Convergence Initiative

## OBJECTIVE

Record the seated infrastructure activation standing for `c3field.online`.

This OAR1 establishes that the c3 Field Convergence Initiative now has a bounded deployment and media delivery foundation for runtime implementation.

It registers:

- Cloudflare Pages hosting standing
- c3 Field production domain standing
- c3 Field R2 media bucket standing
- Supabase public media bucket standing
- Pages build variable standing
- frontend media resolver boundary standing

within native order:

Codex -> Field -> Measures -> Chazz -> Cody -> src

---

## ACTION

Infrastructure activation was configured for the c3 Field runtime surface.

### Cloudflare Pages

Cloudflare Pages was seated as the intended hosting surface for:

- `c3field.online`
- `www.c3field.online`

Pages build standing:

- branch: `initiative/c3-field-convergence-infra`
- build command: `npm run build:c3field`
- build output directory: `dist`
- root directory: repository root
- deployment mode: Git-connected Pages deployment

The prior Worker deployment path was removed from active use.

Wrangler configuration was removed so Cloudflare Pages dashboard build variables remain dashboard-managed.

---

### Build Command

The c3 Field build command was registered in `package.json`:

```txt
npm run build:c3field
```

The build emits to:

```txt
dist
```

Build preflight now reports presence/missing standing for required deployment variables.

---

### Runtime Environment Variables

Cloudflare Pages build variables seated for c3 Field include:

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_C3FIELD_R2_PUBLIC_BASE_URL
NODE_VERSION
```

Optional metadata variables remain available for deployment polish:

```txt
VITE_PAGE_TITLE
VITE_PAGE_DESCRIPTION
VITE_MANIFEST_HREF
VITE_PAGE_URL
VITE_PAGE_IMAGE
```

---

### R2 Media Storage

Cloudflare R2 standing:

- bucket: `c3-field-media`
- intended media class: large/runtime media
- expected public base URL: c3 Field media custom domain
- storage provider value: `cloudflare_r2`

R2 rows resolve by:

```txt
VITE_C3FIELD_R2_PUBLIC_BASE_URL + "/" + storage_path
```

R2 remains distinct from Measures media storage.

---

### Supabase Public Media Storage

Supabase public bucket standing:

- bucket: `c3-field-media`
- intended media class: lightweight public image assets
- expected file class: `.webp` and related public image assets
- storage provider value: `supabase`

Supabase rows resolve through Supabase public storage URL construction.

---

### Provider-Aware Media Resolution

Frontend media resolution now gives explicit `storage_provider` standing priority.

Resolution rule:

```txt
storage_provider = cloudflare_r2 -> R2 public base URL
storage_provider = supabase      -> Supabase public storage URL
```

If `storage_provider` is absent, bucket-name fallback remains available for known R2 buckets.

This prevents the shared bucket name `c3-field-media` from collapsing Supabase and R2 media authority.

---

## RESULT

The c3 Field Convergence Initiative now has an active infrastructure foundation for runtime implementation.

Seated standing:

- `c3field.online` is the production runtime domain
- `www.c3field.online` is a production alias domain
- Cloudflare Pages is the intended hosting surface
- R2 `c3-field-media` stores large/runtime media
- Supabase `c3-field-media` stores public `.webp`/image assets
- runtime media resolution is provider-aware
- Pages build variables are dashboard-managed
- Worker deployment standing is not active

---

## VALIDATION

Validation evidence:

- `npm run build:c3field` added
- local elevated build verification completed successfully
- Cloudflare Pages build reached successful Vite output after environment variables were seated
- `VITE_SUPABASE_URL` reported present in Cloudflare build logs
- `VITE_SUPABASE_ANON_KEY` reported present in Cloudflare build logs
- `VITE_C3FIELD_R2_PUBLIC_BASE_URL` reported present in Cloudflare build logs
- Worker-only Wrangler assets configuration was removed after Pages activation
- provider-aware media resolver fix was committed and pushed

Relevant commits:

- `e7b399a` — Configure c3 Field Cloudflare deployment
- `082891a` — Remove Wrangler config for Pages dashboard settings
- `c65ae69` — Respect explicit media storage provider

---

## BOUNDARY

This OAR1 does NOT:

- authorize DB mutation
- authorize deployment beyond the configured Pages surface
- hardcode runtime media paths
- collapse R2 and Supabase storage authority
- transfer Measures media authority into c3 Field
- authorize independent Worker runtime behavior
- replace future OAR2 media migration authority

This OAR1 records infrastructure activation standing only.

---

## SEEDED STANDING

Seeded Standing:
active_infrastructure_reference

Seeded Reason:

This OAR1 records the first bounded production infrastructure standing for `c3field.online`.

It is now treated as an upstream reference for:

- c3 Field deployment configuration
- Cloudflare Pages build standing
- c3 Field media storage distinction
- R2/Supabase provider-aware runtime resolution
- future c3 Field Convergence implementation OAR sequencing

Seeded Boundary:

This seeded standing authorizes reference use only.

Future implementation remains governed by OAR2 authority and validation-first progression.

---

## CLOSING

The c3 Field Convergence Initiative now has seated infrastructure standing for `c3field.online`.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Cody executes.
NotChazz protects.
