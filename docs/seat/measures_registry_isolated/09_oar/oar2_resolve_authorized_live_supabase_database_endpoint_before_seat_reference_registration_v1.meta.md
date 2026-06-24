---
document_type: oar2
authority_level: working
system_scope: measures_registry_live_supabase_endpoint
title: OAR2 - Resolve Authorized Live Supabase Database Endpoint Before SEAT Reference Registration v1
status: proposed
version: v1
operator: op044
mutation_scope:
  env_endpoint_review: true
  supabase_connection_string_review: true
  privileged_readonly_preflight: true
  live_DB_mutation: false
  live_DB_reference_registration: false
  payment_migration: false
  Stripe_activation: false
  webhook_activation: false
  checkout_activation: false
  runtime_mutation: false
  route_mutation: false
  renderer_mutation: false
  public_copy_mutation: false
  authority_creation: false
---

# OAR2 - Resolve Authorized Live Supabase Database Endpoint Before SEAT Reference Registration v1

## OBSERVED

The prior live Supabase SEAT folder reference registration OAR stopped without mutation.

Closeout reason:

live_connection_failed_dns_resolution_ENOENT_direct_db_host

The OAR1 confirms:

- privileged read-only preflight was attempted
- live connection failed
- required schema was not accessible
- no reference surface was identified
- no SEAT folder reference was inserted or confirmed
- no live DB mutation occurred
- no payment migration occurred
- no Stripe, webhook, checkout, runtime, route, renderer, public-copy, or authority mutation occurred
- retry requires a resolvable authorized live database endpoint

This is an endpoint resolution failure, not a confirmed password failure.

## ALIGNED

The next valid action is not SEAT reference registration and not MAP payment migration.

The next valid action is to resolve the authorized live Supabase database endpoint used by Cody for privileged read-only preflight.

No database mutation may occur during this OAR2.

This preserves:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

The endpoint must be corrected before any live DB standing can be inspected, registered, or migrated.

## ROUTED

Cody must inspect local environment configuration and Supabase connection variables without printing secrets.

### 1. Review environment variable presence

Cody must inspect .env.local for the presence of these keys:

- SUPABASE_DATABASE_URL
- SUPABASE_DB_URL
- DATABASE_URL
- SUPABASE_PROJECT_REF
- SUPABASE_DATABASE_PASSWORD
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY

Cody may report whether each key is present or missing.

Cody may not print credential values.

### 2. Identify the failing host source

Cody must determine which environment variable or connection string produced the failing direct DB host.

Required output:

- failing_host_source_key: key_name_or_unknown
- failing_connection_mode: direct_or_pooler_or_unknown
- dns_resolution_failure_confirmed: true_or_false
- credential_values_printed: false

### 3. Compare against Supabase connection modes

Cody must identify whether the current configured endpoint appears to be one of:

- direct connection
- transaction pooler
- session pooler
- unknown / malformed

If the direct host does not resolve from Cody's environment, Cody must not retry mutation.

Cody must recommend using a resolvable authorized Supabase pooler or current dashboard-provided connection string.

### 4. Produce endpoint repair instructions

Cody must produce a local operator repair report explaining which .env.local key needs correction.

The report must include placeholders only, not real secrets.

Allowed example format:

DATABASE_URL="postgresql://postgres.<project-ref>:<password>@<pooler-host>:6543/postgres?sslmode=require"
SUPABASE_DATABASE_PASSWORD="<database-password>"
SUPABASE_PROJECT_REF="<project-ref>"

No actual passwords, service role keys, webhook secrets, or full live connection strings may be printed.

### 5. Re-run read-only preflight only if endpoint is resolvable

If Cody can resolve the corrected endpoint from existing .env.local values without exposing secrets, Cody may rerun read-only preflight.

If not, Cody must stop with repair instructions and no mutation.

### 6. Required validation matrix

Cody must create:

docs/seat/measures_registry_isolated/10_validation/live_supabase_authorized_endpoint_resolution_before_seat_reference_registration_v1.meta.md

The validation matrix must include:

- env_file_checked: true
- credential_values_printed: false
- database_endpoint_key_present: true_or_false
- database_password_key_present: true_or_false
- project_ref_key_present: true_or_false
- failing_host_source_key: key_name_or_unknown
- connection_mode_detected: direct_or_transaction_pooler_or_session_pooler_or_unknown
- dns_resolution_failure_confirmed: true_or_false
- authorized_endpoint_resolved: true_or_false
- readonly_preflight_retried: true_or_false
- readonly_preflight_successful: true_or_false
- live_DB_mutation_performed: false
- payment_migration_performed: false
- authority_created: false

### 7. Required OAR1 closeout

Cody must create:

docs/seat/measures_registry_isolated/09_oar/oar1_resolve_authorized_live_supabase_database_endpoint_before_seat_reference_registration_v1.meta.md

## CODY ROLE

Cody may:

- inspect .env.local
- report key presence / absence
- identify malformed or non-resolving DB endpoint source
- classify connection mode
- test DNS resolution without printing secrets
- retry read-only preflight only if endpoint is resolvable
- create validation matrix
- create OAR1 closeout

Cody may not:

- print passwords
- print service role keys
- print Stripe secrets
- print webhook secrets
- print full live database URL with credentials
- mutate live DB
- insert SEAT reference standing
- apply MAP payment migration
- activate Stripe
- activate webhook fulfillment
- activate checkout
- mutate runtime, route, renderer, or public copy
- create SEAT authority, c3 Key, certification, DAO, Codexstone conversion, Registry Standing, or Registry Certification

## VALIDATION

This OAR2 resolves successfully when:

- env_file_checked: true
- credential_values_printed: false
- failing_endpoint_source_identified: true
- connection_mode_classified: true
- authorized_endpoint_resolved: true_or_operator_repair_required
- live_DB_mutation_performed: false
- payment_migration_performed: false
- authority_created: false
- validation_matrix_created: true
- oar1_closeout_created: true

## STOP CONDITIONS

Cody must stop without mutation if:

- env_file_missing: true
- database_endpoint_missing: true
- database_password_missing: true
- endpoint_malformed: true
- dns_resolution_failed: true
- authorized_endpoint_unclear: true
- readonly_preflight_failed: true
- secret_value_would_need_to_be_printed: true

If stopped, Cody must produce an OAR1 closeout with:

- status: stopped_no_mutation
- reason: exact_reason
- operator_repair_required: true
- live_DB_mutation_performed: false
- payment_migration_performed: false
- authority_created: false

## EXPECTED NEXT OAR2 AFTER CLOSEOUT

Only after the authorized live Supabase endpoint is resolvable and read-only preflight can succeed:

OAR2 - Register Measures Registry SEAT Folder Reference Standing in Live Supabase Before MAP Payment Migration v1

## CLOSE

Resolve the endpoint first.

Do not mutate the database.

Do not add Stripe state.

Do not register SEAT standing until live DB access is proven.

The seam is connection authority, not payment logic.
