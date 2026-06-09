---
document_type: oar2
authority_level: working
document_scope: measures_registry_obsidian_chamber
title: OAR2 — Register Seated Obsidian SQL Files and MCP Execution Boundary
status: confirmed
version: v1
operator: op044
system: measures_registry
executor: claude_mcp
source_oar1: docs/oar/measures_registry/oar1_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  claude_mcp: bounded_executor
tags:
  - oar2
  - measures-registry
  - obsidian-chamber
  - mcp
  - sql-execution
  - contract-registration
  - validation
  - claude
  - bounded-executor
---

# OAR2 — Register Seated Obsidian SQL Files and MCP Execution Boundary v1

## OBSERVED

The Obsidian SRC/OAR1 Eval Email and Marble Carryover contract package has reached migration-ready standing.

OAR1 confirms the prepared execution set includes:

1. supabase/migrations/202606080001_obsidian_src_oar1_eval_email_marble_contracts.sql
2. docs/oar/measures_registry/obsidian_contract_seating_v1.sql
3. docs/oar/measures_registry/obsidian_contract_seating_validation_v1.sql

The OAR1 defines the execution order as:

1. migration first
2. contract seating second
3. validation third

The operator has now set up an MCP server, creating a bounded DB execution surface for Claude.

The prior issue was that Claude could prepare SQL but could not execute SQL without database authority.

This OAR2 registers the seated files and defines the MCP execution boundary.

---

## ALIGNED

Authority order remains:

Codex → Field → Measures → OAR2 → Chazz → Claude-compatible Executor → MCP/DB

Codex remains the authority surface.

Claude/MCP may execute only the seated SQL files named in this OAR2.

Claude/MCP may not invent SQL, alter scope, modify runtime, or claim execution without returned DB output.

This preserves the OAR1 boundary confirmations:

- Assessment runtime: unchanged
- Contact form: unchanged
- Commerce boundary: preserved
- Marble circuit: held
- SRC/SRC1 standing: contact_eval_continuity_opened only

---

## ROUTED

## 1. Register Seated File Set

Register the following files as the active seated execution package for this operation:

- docs/oar/measures_registry/oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md
- docs/oar/measures_registry/oar1_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md
- supabase/migrations/202606080001_obsidian_src_oar1_eval_email_marble_contracts.sql
- docs/oar/measures_registry/obsidian_contract_seating_v1.sql
- docs/oar/measures_registry/obsidian_contract_seating_validation_v1.sql

Standing:

file_set_status = seated_for_mcp_execution
execution_scope = obsidian_contract_registration
db_mutation_authority = bounded_to_named_sql_files

---

## 2. MCP Execution Boundary

Claude via MCP may execute only these SQL files, in this order:

1. supabase/migrations/202606080001_obsidian_src_oar1_eval_email_marble_contracts.sql
2. docs/oar/measures_registry/obsidian_contract_seating_v1.sql
3. docs/oar/measures_registry/obsidian_contract_seating_validation_v1.sql

Claude/MCP must not execute:

- ad hoc SQL
- schema changes outside these files
- runtime edits
- assessment edits
- contact form edits
- pricing/payment/c3 Key/SEAT/certification mutations
- Marble reveal activation

---

## 3. Execution Rule

Before execution, Claude/MCP must verify:

- all three SQL files exist
- file names match OAR1
- execution order matches OAR1
- MCP database target is the intended Supabase project
- no uncommitted/unreviewed replacement SQL is being substituted

If any check fails:

- halt execution
- report missing/mismatched file
- do not run partial package

---

## 4. SQL Execution

Execute:

BLOCK 1 — migration

supabase/migrations/202606080001_obsidian_src_oar1_eval_email_marble_contracts.sql

Then execute:

BLOCK 2 — contract seating

docs/oar/measures_registry/obsidian_contract_seating_v1.sql

Then execute:

BLOCK 3 — validation

docs/oar/measures_registry/obsidian_contract_seating_validation_v1.sql

No block may run out of order.

If any block errors:

- stop immediately
- return the error
- do not proceed to the next block
- do not attempt repair unless a new OAR2 authorizes correction

---

## 5. Validation Output Required

Claude/MCP must return validation output for the 11 checks defined in OAR1:

1. All 6 new tables exist
2. Four evaluation result bands seeded with correct prepared_path_statement
3. Severity precedence logic verified at 1 / 2 / 3 / 4 conditions
4. Four email contract definitions seeded in sequence order
5. No prohibited content in email contract definitions
6. Six concordance contracts seated — all active
7. Concordance relations exist for all 6 contracts
8. Marble carryover default state is held
9. SRC continuity standing constraint is set
10. Existing assessment/contact form tables are unmodified
11. RLS policies exist on all runtime tables

---

## 6. Post-Execution OAR1 Update

After successful MCP execution, Claude must update or draft a new closeout record:

docs/oar/measures_registry/oar1_execute_obsidian_src_oar1_eval_email_and_marble_carryover_sql_v1.meta.md

Required OAR1 closeout fields:

Objective:
Execute the seated Obsidian SQL package through MCP and register DB standing.

Action:
Ran migration SQL, contract seating SQL, and validation SQL in the approved order through MCP.

Result:
Validation output returned. Obsidian contract package standing confirmed or correction required.

Must include:

- timestamp
- executor = claude_mcp
- DB target confirmation
- SQL files executed
- validation output
- errors if any
- final standing

---

## 7. Final Standing Rules

If all validation passes:

standing = executed_validated
contracts = seated
runtime = unchanged
contact_form = unchanged
marble_reveal = held
ready_for_commit = true

If any validation fails:

standing = execution_partial_or_failed
contracts = not accepted
correction_oar2_required = true
ready_for_commit = false

---

## CLAUDE/MCP ROLE

Claude via MCP may:

- verify file presence
- execute the three named SQL files
- return DB output
- return validation output
- draft execution OAR1
- report failure precisely

Claude via MCP may not:

- write new SQL during execution
- repair errors without new OAR2
- change runtime
- change assessment
- change contact form
- activate Marble commerce reveal
- create payment standing
- create SEAT verification
- create Registry Certification
- issue c3 Key
- mark Registered or Redacted
- claim success without validation output

---

## VALIDATION

This OAR2 succeeds when:

- the seated file set is registered
- MCP execution boundary is preserved
- the three SQL files execute in order
- validation output is returned
- no runtime/contact/commerce boundary is mutated
- execution OAR1 is produced
- operator can commit the OAR set

---

## EXPECTED OAR1

docs/oar/measures_registry/oar1_execute_obsidian_src_oar1_eval_email_and_marble_carryover_sql_v1.meta.md

---

## CLOSE

This OAR2 does not create new contract logic.

It registers and executes the already seated Obsidian SQL package through a bounded MCP database lane.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Claude/MCP executes only named SQL files.
