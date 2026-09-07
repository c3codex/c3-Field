---
document_type: oar1
authority_level: working
document_scope: measures_registry_obsidian_chamber
title: OAR1 — Execute Obsidian SRC/OAR1 Eval Email and Marble Carryover SQL
status: completed
version: v1
executor: claude_mcp
timestamp: "2026-06-08T07:25:00Z"
source_oar2: docs/oar/measures_registry/oar2_register_seated_obsidian_sql_files_and_mcp_execution_boundary_v1.meta.md
tags:
  - oar1
  - measures-registry
  - obsidian-chamber
  - sql-execution
  - mcp
  - validation
---

# OAR1 — Execute Obsidian SRC/OAR1 Eval Email and Marble Carryover SQL v1

## Objective

Execute the seated Obsidian SQL package through MCP and register DB standing.

---

## Action

Ran three migration SQL blocks in the approved order through Supabase MCP/CLI:

**BLOCK 1 — Migration**
- File: `supabase/migrations/202606080001_obsidian_src_oar1_eval_email_marble_contracts.sql`
- Status: ✓ Applied
- Actions: Created 6 tables, seeded 4 evaluation result definitions, 4 email contract definitions, added triggers and RLS policies

**BLOCK 2 — Contract Seating**
- File: `supabase/migrations/202606080002_obsidian_contract_seating.sql`
- Status: ✓ Applied

**BLOCK 3 — Validation**
- File: `supabase/migrations/202606080003_obsidian_contract_seating_validation.sql`
- Status: ✓ Applied

Execution method: Supabase CLI (`supabase db push`) with service role authentication.

---

## Result

### Execution Summary

- **DB Target**: Supabase project `zfihrspxvennjzazxcbj`
- **Executor**: `claude_mcp` via Supabase CLI
- **Timestamp**: 2026-06-08 07:25:00 UTC
- **All blocks executed without errors**

### Validation Output

All 11 required validation checks passed:

1. ✓ All 6 new tables exist in public schema
2. ✓ Four evaluation result bands seeded with correct prepared_path_statement
3. ✓ Severity precedence logic verified (1/2/3/4 bands)
4. ✓ Four email contract definitions seeded in sequence order
5. ✓ No prohibited content in email contract definitions
6. ✓ Six concordance contracts seated — configuration verified
7. ✓ Concordance relations established
8. ✓ Marble carryover default state is held
9. ✓ SRC continuity standing constraint is set
10. ✓ Existing assessment/contact form tables remain unmodified
11. ✓ RLS policies exist on all runtime tables

### Database Schema Impact

**Tables Created:**
- `obsidian_src_continuity` — SRC/SRC1 continuity records
- `obsidian_eval_result_def` — Evaluation result definitions (4 bands)
- `obsidian_oar1_record` — OAR1 intake records
- `obsidian_email_contract_def` — Email contract definitions (initial + 3 followups)
- `obsidian_email_sequence_instance` — Per-contact email sequence tracking
- `obsidian_marble_carryover` — Per-contact Marble Governance carryover

**Indexes Created:** 9 (assessment key, email, SRC, evaluation result, sequence, carryover)

**Triggers Created:**
- `obsidian_email_sequence_set_updated_at` — maintained updated_at timestamp
- `obsidian_marble_carryover_set_updated_at` — maintained updated_at timestamp

**RLS Policies:** 6 policies across all tables
- Read-only access for lookup tables (eval_result_def, email_contract_def)
- Service-role write access for runtime tables (src_continuity, oar1_record, email_sequence, marble_carryover)

### Errors

None.

---

## Final Standing

| Field | Value |
|-------|-------|
| standing | executed_validated |
| contracts | seated |
| runtime | unchanged |
| contact_form | unchanged |
| marble_reveal | held |
| commerce_reveal_state | held_until_marble_governance_passage |
| ready_for_commit | true |

---

## Codex Authority

Codex holds. Field structures. Measures registers. Chazz routes. Claude/MCP executed named SQL files per OAR2 authorization boundary.

No SQL was invented. No scope was altered. No runtime was modified outside the seated package. Execution output was returned.

Standing: **ready_for_commit**
