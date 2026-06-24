---
document_type: live_supabase_endpoint_resolution_matrix
authority_level: closeout_evidence
system_scope: measures_registry_live_supabase_endpoint
title: Live Supabase Authorized Endpoint Resolution Before SEAT Reference Registration v1
status: completed_endpoint_resolved
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_resolve_authorized_live_supabase_database_endpoint_before_seat_reference_registration_v1.meta.md
---

# Live Supabase Authorized Endpoint Resolution Before SEAT Reference Registration v1

env_review:
  env_file_checked: true
  credential_values_printed: false
  SUPABASE_DATABASE_URL_present: false
  SUPABASE_DB_URL_present: false
  DATABASE_URL_present: true
  SUPABASE_PROJECT_REF_present: false
  SUPABASE_DATABASE_PASSWORD_present: true
  SUPABASE_URL_present: true
  SUPABASE_SERVICE_ROLE_KEY_present: false
  database_endpoint_key_present: true
  database_password_key_present: true
  project_ref_key_present: false

endpoint_classification:
  failing_host_source_key: prior_DATABASE_URL_direct_endpoint
  prior_failing_host_source_key: SUPABASE_URL_derived_direct_host
  failing_connection_mode: direct
  connection_mode_detected: session_pooler
  endpoint_structure_valid: true
  authorized_supabase_host_shape: true
  embedded_password_present: true
  database_name_postgres: true
  dns_resolution_failure_confirmed: false
  dns_failure_class: null
  authorized_endpoint_resolved: true
  credential_values_printed: false

readonly_preflight:
  readonly_preflight_retried: true
  readonly_preflight_successful: true
  transaction_read_only_confirmed: true
  required_schema_accessible: true
  visible_table_count: 186
  visible_public_table_count: 80
  mutation_performed: false

operator_repair:
  required: false
  action: completed_shared_session_pooler_DATABASE_URL_resolved
  preferred_modes:
    - session_pooler
    - transaction_pooler
  placeholder_examples_only:
    session_pooler: 'DATABASE_URL="postgresql://postgres.<project-ref>:<password>@<pooler-host>:5432/postgres?sslmode=require"'
    transaction_pooler: 'DATABASE_URL="postgresql://postgres.<project-ref>:<password>@<pooler-host>:6543/postgres?sslmode=require"'
    database_password: 'SUPABASE_DATABASE_PASSWORD="<database-password>"'
    project_ref: 'SUPABASE_PROJECT_REF="<project-ref>"'
  actual_credentials_in_report: false

mutation_boundary:
  live_DB_mutation_performed: false
  live_DB_reference_registration_performed: false
  payment_migration_performed: false
  Stripe_activation_performed: false
  webhook_activation_performed: false
  checkout_activation_performed: false
  runtime_mutation_performed: false
  route_mutation_performed: false
  renderer_mutation_performed: false
  public_copy_mutation_performed: false
  authority_created: false

validation:
  env_file_checked: true
  credential_values_printed: false
  failing_endpoint_source_identified: true
  connection_mode_classified: true
  authorized_endpoint_resolved: true
  operator_repair_required: false
  validation_matrix_created: true

The authorized shared session pooler endpoint resolved and the privileged preflight succeeded inside a read-only transaction. Schema access was confirmed and no database state was mutated.
