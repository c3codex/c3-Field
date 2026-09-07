---
document_type: oar1
authority_level: working
document_scope: measures_registry_foundation
title: OAR1 - Seat Native Operating Order and OAR Context
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_seat_native_operating_order_and_oar_context_v1
---

# OAR1 - Seat Native Operating Order and OAR Context

## EXECUTION METHOD

Definitional seating OAR. No DB migrations. No source file mutations.
The native order emerged through implementation and launch work — this OAR closes it as seated definition.

---

## NATIVE OPERATING ORDER — SEATED

    Codex holds.
    Systems align.
    Measures allows.
    Field arranges.
    Roles authorize.
    Optics prove.

The order is coherent top-down and bottom-up.

Collapse is not the default.

---

## NATIVE DEFINITIONS — SEATED

### Codex holds

Codex is authority.

Codex holds truth, registry standing, definitions, records, source authority, historical
standing, and seated structure.

Codex does not render. Codex does not infer. Codex holds.

---

### Systems align

Systems align execution to Codex-held truth.

Systems include: database execution, registry execution, OAR process, Chazz, Cody,
migrations, validation, transfer process, source mutation process.

Systems do not invent authority. Systems align.

---

### Measures allows

Measures determines what is registered, active, public, private, held, encounterable,
unavailable, sequenced, optional, required, and what becomes visible in FREE.

Measures governs standing. Measures allows operation. Measures does not invent truth.

Measures allows.

**Explicit standing definitions:**

| Standing | Meaning |
|---|---|
| registered | Has a row in measures_registry (registry_key exists) |
| active | is_active=true in measures_registry |
| public | access_state='encounterable' AND release_state='released' AND is_active=true |
| held | Exists in DB with release_state indicating not yet available to route (held, antechamber, etc.) |
| encounterable | Resolved as reachable by current role in encounter flow |
| unavailable | Gated out by RLS, is_active=false, or release_state blocking |

---

### Field arranges

Field arranges relation and public appearance: directories, profiles, chamber relationships,
surface composition, and the FREE render surface.

FREE is the public render surface of Field. FREE is not a separate authority layer.

Field arranges.

---

### Roles authorize

Roles authorize: navigation, continuation, assessment, publication actions, payment actions,
resolution actions, and future secured actions.

Roles do not determine truth. Roles authorize.

---

### Optics prove

Optics proves what rendered, what occurred, what was encountered, what actions were taken,
what standing existed, and what changed.

Optics is evidence. Optics proves.

---

## OAR CONTEXT — SEATED

OARs exist inside Systems. OARs are not authority. OARs are alignment instruments.

OARs: propose, validate, mutate, verify, record evidence.

OARs align systems to Codex-held truth.

OARs do not create truth by themselves. Truth must be seated.

### OAR2 responsibilities

OAR2 may: propose standing, propose mutation, propose alignment, define target state, define validation.

### OAR1 responsibilities

OAR1 may: execute, verify, record evidence, prove outcome, document gaps, confirm standing.

OAR1 does not create authority. OAR1 proves what occurred.

---

## RELATION TO CHAMBER ARCHITECTURE

The native order governs:

- chambers, directories, surfaces, profiles, passages
- antechambers, compacts, agreements, resolutions
- public release

Everything in Measures Registry resolves through the native order.

No new authority layer is introduced by this definition.

No chamber architecture is contradicted.

---

## VALIDATION CHECKLIST

| Item | Status |
|---|---|
| Native order documented and seated | ✓ |
| OAR context documented and seated | ✓ |
| Measures standing explicitly defined (registered, active, public, held, encounterable) | ✓ |
| FREE recognized as public render surface of Field | ✓ |
| FREE recognized as NOT a separate authority layer | ✓ |
| OARs recognized as system alignment instruments, not authority | ✓ |
| No chamber architecture contradicted | ✓ |
| No new authority layer introduced | ✓ |
| No DB mutations required | ✓ |
| No source file mutations required | ✓ |

---

## FINAL DISPOSITION

**SEATED** — Native operating order and OAR context documented as closed definition.

The native order emerged through implementation and launch work across multiple OAR cycles.
This OAR closes it as an explicit, seated foundation for all future Measures Registry work.

Codex holds.
Systems align.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.

FREE renders.

Collapse is not the default.
