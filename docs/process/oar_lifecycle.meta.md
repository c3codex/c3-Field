---
document_type: process
title: OAR Lifecycle — Execution and Handoff
version: v1
status: seeded
system: measures_registry
---

OAR Lifecycle — Execution and Handoff

CORE RULE
Cody executes from OAR2 only.
No thread instructions.
No partial transfers.

---

1. DEFINE (OAR2)

Create:
OAR2: <system_key>_v#

Must include:
- OBSERVED
- ALIGNED
- ROUTED
- CODY ROLE
- VALIDATION

OAR2 is the only instruction surface.

---

2. HANDOFF

Provide Cody only the OAR2 file path.

Example:
docs/oar/<system_key>/oar2_<name>.meta.md

No additional explanation.

---

3. EXECUTION (Cody)

Cody:
- reads OAR2
- executes exactly
- does not invent
- does not extend scope

If state is missing:
- report missing records
- do not guess

---

4. VALIDATION (Cody → Operator)

Cody returns:
- execution result
- validation query output

---

5. LOG (OAR1 — REQUIRED)

Cody must write OAR1 file beside OAR2.

Path:
docs/oar/<system_key>/
  oar2_<...>.meta.md
  oar1_<...>.meta.md

Rule:
No OAR1 file = process not complete.

---

6. REVIEW (Operator)

Verify:
- OAR1 content
- validation query
- system state

---

7. COMMIT (Operator)

git add docs/oar/<system_key>
git commit -m "OAR1 log: <operation>"

---

8. CLOSEOUT

Process = closed
System state = seeded

---

ROLE BOUNDARIES

Cody (Executor)
May:
- execute OAR2
- write OAR1
- return validation

May NOT:
- invent logic
- modify scope
- bypass DB contracts
- introduce slugs
- act on thread instructions

Operator (Authority)
- defines OAR2
- validates execution
- commits OAR1
- advances system

---

HARD RULES

- No OAR2 → no work
- No OAR1 → no completion
- No DB write without OAR1
- No thread instructions to Cody
- No slugs

---

SYSTEM STATE

Plan → Execute → Prove → Log → Commit
