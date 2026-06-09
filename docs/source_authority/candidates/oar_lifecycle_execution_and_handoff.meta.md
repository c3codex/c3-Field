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

Lifecycle shorthand:
Thread proposes.
OAR2 seats.
Cody executes.
DB registers.
src renders.
Validation verifies.
OAR1 proves.
Operator closes.

Term standing:
- Proposed = thread-only shaping or discussion; no executable route.
- Seated = OAR2-confirmed executable scope; not DB state by itself.
- Registered = DB / Measures registry state confirmed by readback.
- Rendered = src/frontend expression confirmed by runtime or browser validation.
- Verified = DB, build, runtime, browser, route-head, or API validation confirms behavior.
- Proven = OAR1 records what happened, what changed, what validated, and what remained held.
- Closed = operator accepts OAR1 standing and commits or continues.

Use rule:
Do not use "registered" without DB / Measures readback.
Do not use "rendered" without runtime or browser validation.
Do not use "complete" without OAR1.
Do not use "seated" as a synonym for DB registration.

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
- registration_authorized: true | false

If registration_authorized is true, OAR2 must define:
- target DB surface
- mutation boundary
- readback requirement
- validation requirement
- OAR1 proof requirement

If registration_authorized is false, OAR2 seats scope only and does not authorize DB mutation.

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
- No DB write unless OAR2 authorizes registration and readback confirms the registered standing
- No thread instructions to Cody
- No slugs

---

SYSTEM STATE

Thread proposes → OAR2 seats → Cody executes → DB registers → src renders → Validation verifies → OAR1 proves → Operator closes
