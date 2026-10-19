---
document_class: OAR2
oar_key: oar2_registrar_invite_current_state_handoff_root_design_codex_20261016_002
execution_instance: registrar_invite_current_state_handoff_root_design_codex_002
operator: op044
registrar: Chazz
executor: Codex
date_local: 2026-10-16
correction_to_prior_oar2: oar2_registrar_myenv_invite_initiative_surface_fallback_codex_20261016_001
scope: same_invite_source_line_plus_bounded_current_state_public_to_owned_entry_source_tests
designpac_source: governance/maturity/c3_field_m3_20261008/design/c3field_root_current_state_entry_design_contract_20261016.md
designpac_candidate: c3field_root_current_state_entry_designpac_v1
source_branch: coordinate_with_001_no_competing_parallel_patch
production_install: false
cloudflare_deployment: false
live_registry_designpac_registration: false
external_message_send: false
participant_creation: false
expected_return: registry://cancom/oar1_return/registrar_invite_current_state_handoff_root_design_codex_002
---

# OAR2 #002 — CORRECTION: the accepted intro must lead to c3 Current State, not stop at public c3 Field

## Urgent operator correction / scope precedence

op044, reporting the real Invite Connection experience on October 16:
- "because the invite does not open a current state env"
- "the intro is good says you environment is ready but opens to the c3 field"
- wants `c3field.online` design aligned to **c3 Current State**, organized under native DesignPAC.

This CORRECTS the disposition in previous CanCom-delivered invite OAR2 #001. The prior #001 recognized that Founders Ground legitimately lacks a released public initiative host; it proposed `https://c3field.online/?via=<share_reference>` generic fallback. That destination **is insufficient as an end-to-end acceptance**: existing `App.tsx` renders `C3FieldRoot` for public `/`; `C3FieldRoot` merely marks `videoDone=true` on ending the film and renders public c3 Field sections, ignoring the `via` reference. The recipient does not enter c3 Current State or the existing C1 Connect→verified personal My Env handoff. Avoid claiming `?via` root alone is a working Current State invitation. The operator likes the current film and wants it preserved.

**Incorporation, not duplication:** Codex MUST locate current #001 execution state and working branch, apply this operator correction on the SAME source line, and not race two releases. If #001 already completed source work, prepare a corrected patch with tests and record exact supersession. #001's operator/person invite provenance and permission protections remain binding. Do not delete prior evidence or rewrite its immutable SHA.

## Verified source observations
- `functions/api/my-environment-invite.ts` validates owner via `c3_env_session` and Registry `resolve_c1me_visible_initiatives_internal`, but currently *writes active share reference before* checking whether initiative surface URL exists; for selected unreleased Founders Ground it fails `initiative_surface_not_resolved` after creating active reference.
- Recovered active owner-held share reference: `90c495d0-3588-4d2b-a5bc-bd919b10513b`, with private provenance `source_initiative_key=founders_ground`, `source_context_class=operator`, binding `initop_founders_ground_op044_v1`, and no recipient standing. Do NOT mint another reference, send a message, or equate this reference to a connection. The invite reference is legitimate but current public root exit is wrong.
- `src/app/App.tsx` renders `C3FieldRoot` at `c3field.online/` even with `via`. `C3FieldRoot.tsx` currently preserves an accepted film and local `videoDone`, without a `via` continuation, which is why user sees public Field.
- `src/c3_field_connect/C3CommunityConnect.tsx` reads `via` through `shareReferenceFromLocation()` and passes it to `/api/c3-community-connect-capture`. `/connect` already has native C1 Connect presentation, verification and replay handling (verify). `functions/_lib/c1-passage.ts` already provides signed owner claim/reentry to `https://my.c3field.online/my-environment#claim=<signed_claim>` only after C1/owner resolution. `App.tsx` personal host routes to owner-bound `MyEnvironmentEncounter` without public bypass.
- `c3field_root_orientation_c3webpac_v1` already governs public Field root; there is NO approved public c3 Field DesignPAC at present. Proposed root-to-Current State DesignPAC source is captured in `governance/maturity/c3_field_m3_20261008/design/c3field_root_current_state_entry_design_contract_20261016.md` commit `3c14ca21170809dff29528d29a1a5b6594dd3173`; no final operator visual acceptance, public release or unreviewed asset reuse.

## Precise fix: PUBLIC FIELD and PERSONAL APP are different destinations

1. **Invitation continuation is to Current State's C1/verified-person entrance, not public Field.** Preserve the approved **existing intro** and accepted playback, sound, aspect and skip/end semantics. When arrival carries a syntactically valid `?via=<uuid>` and a user has not authenticated/claimed their own Env, the end of that intro or visible continuation CTA must take them into an existing *registered C1 Connect passage with the exact opaque `via` preserved*. `https://c3field.online/connect?via=<uuid>` is currently an existing route whose component reads `via`; it is a valid candidate for the C1 ENTRY, not My Env itself. Verify whether routing through it introduces a **second intro** and remove duplicate playback without tampering with the video source or losing provenance. Prefer one cohesive intro → Connect/verify → Current State experience.
2. **Never send an unauthenticated invitee directly to an owner's My Env.** The destination `https://my.c3field.online/my-environment` requires their own native session or signed claim; no cross-user private state. If verified returning person, resolve existing relationship/reentry without creating a second Env. If new verified person, resolve their OWN registered C1 EnvPAC and personal environment via established native passage, then enter c3 Current State. A share token alone is not a signed claim, acceptance, membership or permission.
3. **Correct the misleading completion.** Film content is artist-approved and unchanged. If it says "your environment is ready" before verification, next on-screen state must make actual standing clear ("Continue to Current State" / "Verify to open your environment") and not claim a provisioned authenticated My Env until Registry says so. Keep the distinction that the Current State is the *app* and My Env is the individual's persistent *system*.
4. **Unreleased initiative fallback is personally authorized, not a phantom public initiative.** Founders Ground may be recorded privately as source provenance under op044's active operator binding while its public initiative surface is held. Validate initiative context before share reference insert; unreleased public surface -> fall back to **the complete personal-Current-State invitation path**, not generic c3 Field orientation. A malformed/colliding/forged released initiative surface, revoked operator context, ownership mismatch or unsupported identity must HLD before minting; do not quietly downgrade untrusted source to a valid invitation.
5. **Preserve public Field for everyone else.** A direct visitor to `c3field.online/` without referral remains on the registered public c3 Field root and existing intro. A clear **Enter c3 Current State** doorway should be available as the dominant human-facing next step, while **Explore c3 Field** is separate and intentional. Do not redirect all public traffic to My Env or break existing MDM, 4.7%, Living Circuit, legal docs or other released Field paths.
6. **Avoid breaking live releases while DesignPAC is private.** This OAR2 authorizes source/test implementation of the *functional* invite/intro-to-C1 handoff and a source-only root CTA candidate that must be held from public install until the DesignPAC has native standing, provenance/visual acceptance and a WebPAC design-presentation read. Do not style/invent a whole visual system on the fly. `intro_tree.env` is parent c3 Field identity, not Current State's invented logo. Preserve source art, private/public FREE media guards and legal/OG contracts. Public root's known `401 environment_claim_required` protected backdrop is not permission to expose protected personal assets.
7. **DesignPAC source contract**: review/qualify proposed `c3field_root_current_state_entry_designpac_v1` against active `pac_schema_designpac_v1_1`, `c3envpac_field_v0_1`, owner identity, actual tree and intro custody, and safe FREE snapshot/selector semantics. Return exact unresolved prerequisites; do not self-register/patch native DesignPAC unless separately granted Registrar formation. Source design should include first impression, root-to-Current State hierarchy, two-door CTA grammar, invite/provenance, real C1 verified entry, feature readiness, responsive/accessibility, OG and footer; visual acceptance remains operator review.
8. **No new email or participant.** Do not dispatch six outreach messages, reissue `via`, auto-accept connection, create Founders Ground initiative participant rights, send email from CanCom, install SQL, amend LIVE public Pages/Workers or deploy under #002.

## Tests and verification
- Existing known active `via=90c495d0-3588-4d2b-a5bc-bd919b10513b` can reach native C1 Connect via accepted intro, with exact share token preserved and zero additional reference.
- Intro completion/skip each causes at most one transition to C1; no duplicate intro, and no default generic Field destination for a referred invite.
- Unreferred public root still opens c3 Field safely and offers current-state doorway without violating its public/parent nature.
- Returning verified recipient gets their OWN registered My Env under `my.c3field.online`; a newcomer gets eligible native C1 verification without false early ownership.
- Revoked/malformed/forged `via` token, revoked/colliding initiative, failed provider/backend, replay, duplicate submission, wrong personal session -> safe HLD, never access/invite other people.
- Current State entry preserves privacy and differentiates Current State app from My Env; no implicit public Founders Ground release, initiative membership, private source leak or connection standing.
- Mobile and desktop, keyboard, reduced motion, sound and completed film, and clear user CTA. Real public browser proof only after separately approved deployment, not simulated.
- Source diff/negative tests/OAR1 on same #001 correction branch. If safe Cloudflare Pages branch preview settings cannot be verified, hold source push/PR, retain immutable patch/custody. Production install requires separate exact OAR2.

## Return
Codex OAR1 at `registry://cancom/oar1_return/registrar_invite_current_state_handoff_root_design_codex_002` must state whether #001 has already modified source, exact source file/test diffs, branch and hashes, preserved intro media URI evidence, requested DesignPAC source dependencies, actual runnable link route and user-visible step to My Env via verification, accessibility, incomplete production installer, no external effects and precise grant needed to deploy. No fabricated operational proof. Operator wants an INVITE THAT REACHES CURRENT STATE, not just a link that resolves to c3 Field.
