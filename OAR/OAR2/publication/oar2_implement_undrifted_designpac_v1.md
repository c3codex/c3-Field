# OAR2 — Implement unDrifted Governed Publication Presentation v1

**OAR key:** oar2_implement_undrifted_designpac_v1
**Operator:** op044
**Registrar / review:** Chazz
**Executor:** Codex
**Passage:** CanCom
**Return:** CanCom/cancom → Chazz review → op044 disposition
**Standing:** operator-confirmed / preflight-passed / ready-for-bounded-execution

## Objective
Implement the already-governed unDrifted publication presentation from resolved authority without transferring editorial or publication truth into the renderer.

## Governing inputs
- DesignPAC: `undrifted_designpac_v1` — Registry standing `registered_complete`; eight authoritative Drive components in custody folder `100NVqUJik1KEMVSgLXKPvPAuk5Vo3msE`.
- BrandPAC: `undrifted_brandpac_v1`.
- WebPAC: `undrifted_measuresregistry_c3webpac_v1`.
- PubPAC/current publication state: resolve from Registry at execution; do not freeze to an older Issue 003 article snapshot.
- Renderer identity: `c2me.publication_encounter`.

## Required implementation boundary
1. Resolve publication identity, current Issue, Feature, Desk, Desk-lead, article membership/order, release state, routes, and publication assets from governed Registry/PubPAC state.
2. Consume BrandPAC for approved visual authority.
3. Consume DesignPAC for page grammar, composition, interaction, living-Issue behavior, archive/direct-route behavior, responsive/accessibility behavior, and acceptance tests.
4. Renderer may calculate presentation; it may not calculate truth.
5. No hardcoded frontend publication identity, Issue selection, Feature choice, Desk membership, article membership/order, publication assets, or lifecycle state may silently become authority.
6. Issue 003 is the validation fixture by identity, not a frozen content snapshot. Validate against CURRENT eligible Registry state at execution.
7. Archive precedence: Registry/PubPAC/release state supplies frozen historical publication truth; DesignPAC supplies archive presentation. Preserve final cover representation, final eligible membership/index, durable article identity/routes, and governed assets. Do not promote obsolete flipbook pagination or historical renderer geometry into archival authority.
8. Evidence survives replacement. Retire displaced renderer/CSS behavior from the active path where required, but preserve it as implementation evidence.
9. Preserve direct semantic reading, keyboard navigation, reduced motion, mobile single-page behavior, desktop spreads, durable routes, View-in-Issue behavior, clean failure modes, and the complete DesignPAC 08 acceptance gate.
10. Authority-sensitive acceptance failure is HOLD, never close-enough substitution.

## Responsibility disposition
- Publication identity — Registry/PubPAC — RETAIN.
- Issue selection — Registry/PubPAC current standing — RETAIN.
- Article membership/order — Registry/PubPAC current standing — RETAIN.
- Banner/publication assets — BrandPAC/PubPAC governed bindings — RETAIN.
- Durable routes — Registry/WebPAC — RETAIN.
- Release state — Registry/PubPAC — RETAIN.
- Styling/composition — DesignPAC — TRANSFER active presentation responsibility to governed DesignPAC consumption; displaced implementation retained as evidence.
- Frontend hardcoded authority/fallback editorial state — RETIRE from active authority path.
- Bounded clean-reading/failure fallback — RETAIN/IMPLEMENT only where it preserves access without inventing publication state.

## Execution authorization
Codex is authorized to make the source, Registry-binding, and deployment changes necessary to implement this bounded presentation package and validate it against DesignPAC 08. This authorization does not permit invention or alteration of publication/editorial standing, unauthorized PubPAC membership, BrandPAC authority, or unrelated c3 surfaces.

## Required return evidence
Return OAR1 through CanCom with:
- exact source files changed and commit SHA(s);
- Registry mutations, if any;
- deployed surface/deployment identifier;
- authority-resolution path proving PubPAC + BrandPAC + DesignPAC → WebPAC → bounded renderer;
- Issue 003 CURRENT-state membership used for validation;
- DesignPAC 08 criteria 1–28 PASS/HOLD matrix;
- desktop/mobile, keyboard, reduced-motion, direct-route, archive-transition, living-recomposition, and failure-mode results;
- displaced implementation evidence retained;
- explicit external effects;
- unresolved holds;
- confirmation that no renderer/frontend authority was manufactured.

If governed inputs conflict at execution, HOLD and return evidence rather than choosing a winner.
