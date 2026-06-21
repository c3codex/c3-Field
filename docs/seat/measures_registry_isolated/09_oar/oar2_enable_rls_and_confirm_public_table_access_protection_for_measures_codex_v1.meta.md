---
document_type: oar2
authority_level: proposed
system_scope: measures_codex
title: OAR2 - Enable RLS and Confirm Public Table Access Protection for Measures Codex v1
status: proposed
version: v1
operator: op044
priority: critical_security
mutation_scope:
  runtime: false
  database: true
  routes: false
  renderer: false
  public_copy: false
  docs_created: false
  docs_updated: false
  docs_deleted: false
---

# OAR2 - Enable RLS and Confirm Public Table Access Protection for Measures Codex v1

## OBSERVED

Supabase issued a critical security warning for the Measures Codex project:

```text
Table publicly accessible
Anyone with your project URL can read, edit, and delete all data in this table because Row-Level Security is not enabled.
```

Reported issue:

```yaml
issue:
  code: rls_disabled_in_public
  severity: critical
  project: Measures Codex
```

This creates a direct conflict with Measures Registry and c3 Field guardrails:

```text
Codex is authority.
Renderer reads only governed state.
No public unauthenticated access to unrestricted Codex tables.
No public insert, update, or delete unless explicitly authorized.
```

Current standing:

```yaml
standing:
  issue: critical_security
  runtime_launch_safe: false
  public_surface_work_should_pause: true
  database_mutation_required: true
```

## ALIGNED

This OAR2 authorizes database security inspection and RLS protection only.

The goal is to:

1. identify public tables without Row Level Security;
2. enable RLS on unsafe public tables;
3. confirm existing policies;
4. add only narrow required read policies where needed;
5. block anon/public insert, update, and delete unless explicitly authorized;
6. verify anon/public access behavior;
7. produce OAR1 evidence.

This OAR2 does not authorize:

- runtime mutation
- route mutation
- renderer mutation
- public copy mutation
- launch activation
- SEAT completion claim
- SEAL standing
- Registry Standing
- Branch standing
- c3 Key
- DAO participation
- certification
- unrelated schema redesign
- broad permissive public policies

Authority remains:

```text
Codex → Field → Measures → OAR2 → Chazz → Cody → src
```

## ROUTED

## 1. Inspect public tables without RLS

Run read-only inspection first:

```sql
select
  schemaname,
  tablename,
  rowsecurity
from pg_tables
where schemaname = 'public'
  and rowsecurity = false
order by tablename;
```

Record every table returned.

Do not proceed blindly.

## 2. Inspect existing policies

For all public tables, inspect policies:

```sql
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

Record whether any existing policy permits anon insert, update, delete, or unrestricted read.

## 3. Enable RLS on unsafe public tables

For each public table returned by the RLS-disabled inspection, enable RLS:

```sql
alter table public.<table_name> enable row level security;
```

Replace `<table_name>` with each inspected table name.

Do not alter tables outside `public`.

Do not disable RLS on any table.

Do not drop policies unless a policy is explicitly unsafe and operator confirms deletion.

## 4. Policy rules

After RLS is enabled, public access must remain blocked unless an explicit policy exists.

Default expectation:

```yaml
default_policy_standing:
  anon_select: blocked_unless_explicit_read_policy_exists
  anon_insert: blocked
  anon_update: blocked
  anon_delete: blocked
  authenticated_write: blocked_unless_explicitly_authorized
```

If a table must be public-renderer readable, add only a narrow read policy based on existing columns.

Do not invent columns.

Before creating a read policy, inspect table columns:

```sql
select
  table_schema,
  table_name,
  column_name,
  data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = '<table_name>'
order by ordinal_position;
```

Allowed read policy pattern only if matching columns exist:

```sql
create policy "<table_name> anon read released active"
on public.<table_name>
for select
to anon
using (
  release_state = 'released'
  and active = true
);
```

If the table lacks `release_state` or `active`, do not invent an alternate policy. Report schema gap and keep anon access blocked.

## 5. Verify anon/public access behavior

After RLS is enabled and any approved read policies are applied, verify:

```yaml
verification_required:
  - RLS enabled on previously exposed tables
  - anon select blocked unless explicit read policy exists
  - anon insert blocked
  - anon update blocked
  - anon delete blocked
  - no public unrestricted policy exists
```

Use Supabase SQL inspection and policy readback.

If direct anon API testing is available, perform it.

If direct anon API testing is not available, state that direct anon API testing was not available and rely only on DB readback.

Do not claim direct anon test passed if no direct anon test occurred.

## 6. Required readback

Run final readback:

```sql
select
  schemaname,
  tablename,
  rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;
```

And:

```sql
select
  schemaname,
  tablename,
  policyname,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

## 7. OAR1 closeout

Create OAR1:

```text
docs/seat/measures_registry_isolated/09_oar/oar1_enable_rls_and_confirm_public_table_access_protection_for_measures_codex_v1.meta.md
```

OAR1 must report:

```yaml
required_oar1_evidence:
  - OAR2 path
  - tables inspected
  - tables found with RLS disabled
  - tables altered
  - policies inspected
  - policies created if any
  - policies not created due to schema gaps if any
  - unsafe policies found if any
  - final RLS readback
  - final policy readback
  - anon/public access verification method
  - anon select standing
  - anon insert standing
  - anon update standing
  - anon delete standing
  - direct anon API test performed true_or_false
  - database mutation confirmation
  - no runtime mutation confirmation
  - no route mutation confirmation
  - no renderer mutation confirmation
  - no public copy mutation confirmation
  - remaining blockers
  - next recommended OAR2 title
```

## CODY MAY

```text
inspect public tables
inspect policies
enable RLS on unsafe public tables
create narrow read policies only when columns support safe release-state read
perform DB readback
perform anon API verification if available
write OAR1 evidence
```

## CODY MAY NOT

```text
disable RLS
drop policies without explicit operator confirmation
create broad anon policies
permit anon insert
permit anon update
permit anon delete
invent release columns
mutate runtime
mutate routes
mutate renderer
mutate public copy
activate launch
activate payment
claim SEAT completion
claim SEAL standing
claim Registry Standing
assign c3 Key
activate DAO participation
```

## VALIDATION RETURN

Return:

```yaml
validation_return:
  - searched_or_inspected_tables
  - tables_with_rls_disabled_before
  - tables_rls_enabled
  - policies_created
  - policies_blocked_or_skipped
  - unsafe_policies_found
  - final_rls_status
  - final_policy_status
  - anon_public_access_standing
  - direct_anon_api_test_performed
  - OAR1_path
```

## NEXT RECOMMENDED OAR2

```text
OAR2 - Review Supabase Public Policies and Renderer Read Requirements for Measures Registry v1
```

## CLOSE

This OAR2 protects public database access first.

No launch work proceeds while Codex public table access is unsafe.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody secures and writes evidence.
