# OAR2 — Replace Stale MAP Commerce Contract Naming with MAP C2 Circuit Before Live Supabase Migration v1

## Measures Registry / MAP Stripe / Semantic DB Boundary Correction

## Operator
op044

## System
Measures Registry

## Source Closeout
OAR1 — MAP Stripe Live Supabase Migration Held Pending Privileged Preflight Access v1

## Standing
Live migration held / privileged access blocked / semantic DB naming correction required before live migration rerun

---

## OBJECTIVE

Replace stale MAP payment database naming from map_commerce_contracts to map_c2_circuit before any live Supabase migration is retried.

The prior OAR1 blocked live migration because privileged Supabase preflight returned HTTP 401. However, the closeout also confirmed that the pending migration targets public.map_commerce_contracts.

That naming is stale and must not be carried into live standing.

This OAR2 corrects the source, migration, tests, runtime references, and documentation so MAP payment/intake infrastructure uses map_c2_circuit and does not use contract terminology.

---

## SEMANTIC CORRECTION

Stale term:

map_commerce_contracts

Approved replacement:

map_c2_circuit

Reason:

- contract usage is not approved for MAP payment/intake objects.
- contract must not be used except where explicitly approved as smart_contract.
- MAP payment is a C2 review/payment circuit, not a contract surface.
- MAP payment does not create SEAT, c3 Key, certification, registry standing, DAO standing, Codexstone conversion, or c3 Field access.

---

## APPROVED TERMINOLOGY

Use:

- map_c2_circuit
- MAP C2 circuit
- MAP review product
- MAP payment option
- MAP checkout pathway
- MAP review intake
- MAP payment boundary
- MAP payment confirmation

Do not use:

- map_commerce_contracts
- MAP commerce contract
- MAP contract
- commerce contract
- payment contract
- SEAT contract
- Direct contract
- Mapped contract
- Federated contract

Only approved contract exception:

- smart_contract

Do not alter approved smart_contract usage if present.

---

## LIVE MIGRATION HOLD

Do not:

- fix or replace the privileged Supabase credential in this OAR2
- rerun privileged live preflight
- apply live Supabase migration
- submit SQL to live Supabase
- activate Stripe checkout
- activate Stripe webhook fulfillment
- create live payment records
- create live MAP intake records
- send payment confirmation emails
- send operator notifications
- create SEAT standing
- create c3 Key standing
- create certification
- create registry standing
- create DAO standing
- create Codexstone conversion
- create c3 Field access

This OAR2 is source correction only.

---

## REQUIRED SOURCE CORRECTIONS

Update all source references from:

map_commerce_contracts

to:

map_c2_circuit

Review and correct at minimum:

- supabase/migrations/202606200001_map_stripe_price_ids_and_webhook_idempotency.sql
- functions/api/map/create-checkout-session.ts
- functions/api/map/create-checkout-session.test.ts
- functions/api/map/payment-status/[map_order_id].ts
- functions/api/stripe/webhook.ts
- functions/api/stripe/webhook.test.ts
- src/measures_registry/registered_runtime/registeredRuntimeTypes.ts
- src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
- src/measures_registry/registered_runtime/renderers/MarbleCommerceDirectory.tsx
- SEAT package records under docs/seat/measures_registry
- OAR or migration notes that would guide future execution

If a file does not contain the stale term, report no change.

---

## MIGRATION REQUIREMENT

The pending migration must be revised so the live target table becomes:

public.map_c2_circuit

not:

public.map_commerce_contracts

Required migration posture:

- MAP-only table/function names.
- No stale contract table name.
- No SEAT table creation.
- No c3 Key table creation.
- No certification table creation.
- No DAO table creation.
- No Codexstone table creation.
- No registry standing table creation.
- No c3 Field access table creation.

Required idempotency objects remain approved:

- public.stripe_webhook_events
- public.claim_stripe_webhook_event

The webhook claim function may remain named claim_stripe_webhook_event because it describes event idempotency, not contract authority.

---

## RUNTIME REQUIREMENT

Runtime code must resolve MAP review product/price standing from map_c2_circuit.

The public runtime must not render stale contract language.

Public payment copy may say:

> MAP review prepares operational findings and next-step recommendations. It does not create certification, registration, governance standing, or system authority.

Do not introduce public SEAT language.

---

## TEST REQUIREMENT

Update tests so they expect map_c2_circuit.

Run or preserve focused tests for:

- MAP checkout server-side price resolution
- approved MAP pathways
- unapproved pathway rejection
- webhook idempotency
- duplicate event suppression
- invalid signature rejection
- missing metadata rejection
- unpaid completion rejection

If tests cannot be run, return why and provide source-level validation.

---

## SEARCH REQUIREMENT

Search source for stale terms:

- map_commerce_contracts
- MAP commerce contract
- MAP contract
- commerce contract
- payment contract

Expected result:

- map_commerce_contracts has zero active source/runtime/migration references after correction.
- Any remaining contract use must be either removed or explicitly identified as approved smart_contract.

Also search public runtime for:

- SEAT
- System Environment Alignment Threshold
- Direct SEAT
- Mapped SEAT
- Federated SEAT
- c3 Key
- registered system
- Codexstone
- DAO
- registry seal

Expected visible public hits:

> 0

Allowed negative-boundary terms:

- certification
- governance standing

Only allowed if they appear in the approved negative-boundary sentence.

---

## ACCEPTANCE CRITERIA

This OAR2 is complete when:

1. map_commerce_contracts is removed from active source/runtime/test/migration references.
2. Pending migration targets public.map_c2_circuit.
3. Runtime references use map_c2_circuit.
4. Tests are updated to use map_c2_circuit.
5. Documentation records use MAP C2 circuit language.
6. No unapproved contract terminology remains except smart_contract.
7. No live Supabase migration is applied.
8. No privileged credential repair or live preflight is performed.
9. No Stripe checkout/webhook/payment activation occurs.
10. No SEAT/c3/certification/DAO/Codexstone/registry/c3 Field standing is created.
11. Executor returns a new migration hash.
12. Executor recommends rerunning the live migration OAR2 only after this semantic correction closes cleanly.

---

## EXECUTOR RETURN REQUIRED

Return:

1. Files changed.
2. Files reviewed with no change.
3. Exact stale references removed.
4. Replacement references inserted.
5. Revised migration path.
6. New migration SHA256 hash.
7. Search result for map_commerce_contracts.
8. Search result for unapproved contract usage.
9. Public runtime forbidden-term search result.
10. Test results or reason tests were not run.
11. Confirmation no live DB mutation occurred.
12. Confirmation no credential repair/live preflight occurred.
13. Confirmation no Stripe activation occurred.
14. Confirmation no downstream authority was created.
15. Recommended next OAR2.

---

## EXPECTED CLOSEOUT

OAR1 — Stale MAP Commerce Contract Naming Replaced with MAP C2 Circuit Before Live Supabase Migration v1

## EXPECTED NEXT OAR2 AFTER SUCCESS

OAR2 — Apply and Validate MAP Stripe Webhook Idempotency Migration in Live Supabase After MAP C2 Circuit Correction v1
