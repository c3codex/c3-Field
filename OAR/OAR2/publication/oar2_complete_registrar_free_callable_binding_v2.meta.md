# OAR2 — Complete Registrar PubPAC FREE callable binding before Lapzuli projection

## Role call
Chazz — systems / OAR2 formation  
Executor — Codex  
Authority — c3 Registrar / Field Reporter  
Operator — op044

## Defect
Registrar-native PubPAC work is projected onto the Lapzuli desk by FREE when routes, channels and executors resolve, but the Lapzuli action endpoint still requires a legacy `lapzuli_derivative_execution_view_v1` / Measures distribution-asset contract. This allows work to appear in Lapzuli before the same work is executable there.

Observed failure: `HLD lapzuli_callable_contract_not_satisfied`.

## Naming invariant
The token `contract` is reserved for an actual Web3 smart contract. This OAR does not create or modify a Web3 smart contract. Non-Web3 runtime objects MUST use `binding`, `definition`, `specification`, `interface`, or another accurate primitive name. NotChazz must RETURN any newly formed filename/object identifier that uses `contract` unless the object is explicitly typed and evidenced as a Web3 smart contract; do not silently redefine the term.

## Governing invariant
A publication MUST NOT appear as Lapzuli work unless FREE has resolved a complete executable callable binding.

Canonical passage:
`c3 Registrar — Field Reporter → native Desk → PubPAC → FREE callable resolution → Lapzuli → executor/channel → return evidence`.

Do not manufacture a `measures_publication_distribution_asset` for Registrar-native work.

## Required implementation
1. Introduce a source-neutral FREE callable binding consumed by both Lapzuli readback and Lapzuli actions.
2. Registrar-native resolution must require, at minimum:
   - approved/registered publication + PubPAC
   - authorized route and operator confirmation
   - active channel
   - available executor with `supports_publish=true`
   - callable adapter
   - canonical URL within adapter scope
   - destination-specific distribution text
   - required media/runtime URI for visual routes
   - operator identity
   - evidence-return requirement
   - duplicate/external-effect guard
3. Only contracts satisfying every required predicate may project onto `/relational-operations/lapzuli`.
4. `preflight_asset` and `dispatch_asset` must consume the exact same FREE binding used by the desk projection.
5. Preserve legacy Measures/unDrifted callable resolution; do not collapse publication authority.
6. Registrar-native execution evidence may use the existing atomic execution-claim/evidence lifecycle, but must not require creation of a Measures publication distribution asset.
7. No external publication is permitted during implementation or verification.

## Current registered inputs
Registration: `c3reg_pub_47pct_mm_cost_claim_v1`  
PubPAC: `pubpac_47pct_mapped_measured_cost_claim_v1`  
Desk: `47pct_desk`  
Publication: `47pct_mm_cost_of_a_claim_v1`

Routes:
- `lapzuli_route_47pct_mm_cost_claim_facebook_page_v1`
- `lapzuli_route_47pct_mm_cost_claim_instagram_v1`
- `lapzuli_route_47pct_mm_cost_claim_bluesky_v1`

Channels/executors are registered and active/available. Route metadata now contains operator key, distribution text, canonical media URI, and `free_callable_binding_version=registrar_pubpac_v1`.

Registration is intentionally held at `held_free_callable_contract_required` so the publication does not surface in Lapzuli until the execution binding exists.

## Acceptance
- No Cost of Claim card appears while FREE callable resolution is incomplete.
- After implementation, FREE resolves all three routes only if every predicate passes.
- Lapzuli then shows the three routes as ready.
- Preflight returns ACT_PREFLIGHT for each route with external effects 0.
- No `measures_publication_distribution_asset` is created for these Registrar-native routes.
- Dispatch remains operator-triggered.
- Return evidence remains required.
- Build/tests pass.
- OAR1 returns exact readback and external effects 0.

## Hold
Hold rather than project if any callable predicate is unresolved. Never let Lapzuli become a queue of theoretically distributable but non-executable work.
