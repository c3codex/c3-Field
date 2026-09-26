# OAR2 — Soft Launch Hardening Optics Sweep v1

**process_key:** `c3field_soft_launch_hardening_optics_v1`  
**operator:** op044  
**standing:** CONFIRMED / EXECUTE WITH EVIDENCE  
**scope:** c3 Field soft-launch runtime, My Env, 4.7%, MDM, Measures Registry  
**optics contract:** existing Runtime Coherence Optics / OAR spine only; no new optics primitive

## Objective

Consume the soft-launch seam report through existing c3 runtime optics so every hardening finding has:

1. a named finding,
2. a bounded disposition,
3. evidence of the change or hold,
4. an immutable transition reference, and
5. a visible unresolved condition until proof exists.

Optics must derive from the OAR spine and recorded evidence. It must not invent closure.

## Invariants

- **Current state** means what is operative now.
- **CURRENT** means the retained relational environment token.
- Assets remain in their native/Persisted Asset Custody; a PAC governs what FREE may resolve.
- Measures Registry remains branch/institutional custody and must not be moved into a Named Individual My Env.
- 4.7% ground/map evidence is Evidence_PAC authority. CURRENT may overlay relation but may not manufacture ground.
- A property pin never implies abuse occurred at that property.
- No location is inferred for a relational token.
- Frontend fallback must not substitute unrelated OG/media authority.
- Superseded WebPACs retain lineage but must not remain simultaneously canonical/effective.

## Hardening findings

| # | Finding | Required resolution | First-pass disposition |
|---|---|---|---|
| H01 | 4.7 C2 evidence ground is data-complete enough to resolve property records, but the encounter still lacks the governed evidence map renderer. | Evidence_PAC-driven ground renderer; registered location only; property dossier/source linkage; CURRENT overlay separate. | **HLD — renderer/geospatial proof required** |
| H02 | CURRENT retains connection + initiative visibility, while declared classes WebPAC, invitation, event access, contribution, and resource do not yet have qualifying retention producers. | Add class-specific retention only where the underlying governed relation exists. | **EXECUTING — do not synthesize tokens** |
| H03 | Personalized invitation references have provenance but no complete recipient/cardinality/expiry lifecycle contract. | Define reusable vs recipient-bound behavior, acceptance cardinality, expiry/revocation semantics before enforcing consumption. | **HLD — policy/contract required** |
| H04 | 4.7 OG contract is seated but FREE asset registration, actual WebP integrity readback, and final runtime proof remain incomplete. | Register exact WebP asset from actual custody metadata and prove FREE/share rendering without fallback. | **HLD — custody readback required** |
| H05 | MDM had two effective WebPAC versions and no explicit mandatory OG contract on the canonical v1.3. | Retire v1.2 from effective standing; keep lineage; seat v1.3 OG member + contract from registered `og_master` binding. | **ACT — resolved in hardening migration** |
| H06 | Registry/process metadata still carries pending browser/runtime proof for My Env, CURRENT, relational runtime, and Chazz bridge. | Close only with live readback. Held runtime must remain visibly held. | **HLD — live runtime proof required** |
| H07 | Measures Registry WebPAC correctly resolves to the MR EnvPAC, but PAC-level custody fields were blank and v0.3 metadata self-marked `superseded_by` itself. | Derive PAC custody from institutional EnvPAC; remove self-supersession residue; do not move into personal My Env. | **ACT — resolved in hardening migration** |
| H08 | Some primitive/process metadata still reports bilateral connection/invite projection as pending after the relational runtime is live. | Re-seed effective personal EnvPAC primitives from the canonical seed function and record readback. | **ACT — resolved in hardening migration** |

## Evidence paths

Primary implementation/evidence migration:

`supabase/migrations/20260926233500_soft_launch_hardening_optics_v1.sql`

Optics consumption:

- `public.c3_oar_process_instance`
- `public.c3_oar_transition_event`
- `public.c3_oar_seeded_reference`
- rendered by `src/c3_field_convergence/RuntimeCoherenceOptics.tsx`

The sweep remains open until H01–H04 and H06 either resolve with evidence or remain explicitly held by a subsequent operator decision.

## Closure rule

No OAR1 closeout is permitted merely because source code or Registry rows changed. The final OAR1 must cite the runtime/Registry readback for every ACT item and preserve each HLD item as an explicit unresolved condition.
