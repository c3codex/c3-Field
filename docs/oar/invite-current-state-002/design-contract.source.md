---
document_class: DESIGNPAC_COMPONENT_SOURCE
document_key: c3field_root_current_state_entry_design_contract_20261016
operator: op044
designer: Chazz-Registrar
date: 2026-10-16
target_host: c3field.online
related_app: my.c3field.online
parent_environment: env_c3_field
parent_envpac: c3envpac_field_v0_1
parent_webpac: c3field_root_orientation_c3webpac_v1
desired_pac: c3field_root_current_state_entry_designpac_v1
standing: OPERATOR_DESIGN_DIRECTION_CAPTURED__VISUAL_COMPOSITION_REVIEW_PENDING
release_authority: none
provider_effects: none
---

# c3 Field root — Current State entry and invitation continuity: DesignPAC source component

## Operator observed defect / non-negotiable priority

op044: "because the invite does not open a current state env" and "the intro is good says your environment is ready but opens to the c3 field." The opening film is operator-accepted; **do not substitute/edit the asset or erase its authored words**. What fails is the downstream route: a person arriving by owned My Env invitation, after hearing that their environment is ready, sees public c3 Field orientation instead of a visible path into **Current State and their own persistent My Env**.

The current implementation confirms the disconnect. `functions/api/my-environment-invite.ts` forms `https://c3field.online/?via=<share_reference>` for ordinary share; `App.tsx` routes public root `/` to `C3FieldRoot`, whose `onEnded` sets local `videoDone=true` and stays in c3 Field public root. Root currently does not consume `via`, while `C3CommunityConnect` at registered `/connect` does. The claim/reentry owner destination is already `https://my.c3field.online/my-environment#claim=<signed_claim>` after actual C1 verification. Do not confuse source observation with authenticated deployed browser proof.

## Canonical architectural identities — keep these visually unmistakable

- **c3 Field** at `c3field.online`: parent and public orientation; a wider place for qualified encounters. Its public root must remain valid for visitors **without** an invitation.
- **c3 Current State** at `my.c3field.online`: named participant-facing **app**, not the owner's actual registered environment or a synonym for the public Field.
- **My Env**: persistent, participant-owned **system** accessed through Current State with owner C1/EnvPAC/session/CURRENT. Never show the inviter's My Env to the recipient or share owner-private PACs by simply opening a link.
- **An invitation**: authorized person-to-person source provenance; opening it does not create a relationship, initiative membership, authenticated owner, or environment. **Verified claim** must precede genuine My Env access or creation.
- **Founders Ground**: may be named in private operator-scope invite provenance even while its public initiative surface is unreleased. No invented public Founders Ground host, automatic enrollment or expansion of data access.

## Design intent: two different entrance paths, no misleading handoff

**A. Generic public visitor:** c3field.online/ opens existing approved Field intro and then a thoughtful, readable c3 Field public orientation. Offer clear, primary, accessible entry labelled **"Enter Current State"**, resolving to a registered/qualified C1 Connect→Current State first-visit/reentry path. Offer a secondary Field discovery door. Do not force every public visitor into a private app or claim a My Env already exists.

**B. My Env invitation with verified opaque `via` token:** preserve the accepted intro media. When the intro finishes or the visitor chooses its existing continuation, enter the **C1/Current State connection passage**, carrying the same exact opaque source `via` until backend validates it. Do **not** complete intro into generic public Field pages. Prevent double playback of the same intro when arriving at `/connect`; if direct-to-`/connect?via` remains the canonical entry, show one approved intro and then the relevant Connect continuation. Pending identity/consent/verification, describe next action plainly, e.g. "Continue to Current State" or "Verify to open your environment"; never promise My Env is already provisioned simply because the opaque link exists.

**C. Existing verified participant:** legitimate C1 reentry/claim follows the existing signed proof and enters their **own** registered My Env through `my.c3field.online`. Never bypass the owner/session check, place the invitation token in the claim itself, or grant operator/initiative authority to a recipient. If returning without a current session, use the native verification/reentry passage rather than dead-ending or exposing a personal environment.

**D. New verified recipient:** use registered verified C1 flow to form/resolve one owner relationship and one environment via existing native Registry procedure; enter that person's Current State app/My Env only after qualification. Show why this invitation originated and preserve provenance without asserting membership/standing.

**E. No admitted Current State entitlement / failed verification:** present truthful actionable HLD with a supported route to retry/verify, not a black-and-white terminal page, not unauthorized environment creation. A published Field page remains a separate deliberate door.

## Design system — existing identity first

Retain established c3 Field tree (`intro_tree.env`) **as parent identity**. Do not substitute Baby Chazz, new fabricated icon, stock background, unapproved film or graphics. Current State should have its own subordinate expressive treatment as an entry to a lived-in workspace, not a second unrelated c3 Field brand. Copy principles: **Connect • Contribute • Create** for c3 Field; Current State: **"An Environment You Own — Intelligence You Raise."** Avoid saying all planned systems are complete; describe demonstrated foundations and clearly distinguish in-progress functions.

Visual direction is **operator review pending**: meaningful full-width tree/film existing assets, generous readable typography, legible contrast, thoughtful layer/spacing, obvious entrance, cards/doors only for truly Registry-released experiences, no dense internal-registry vocabulary on public welcome. Palette/material decisions should reuse actual approved c3 Field asset/tokens where found. Do not invent exact token values or artwork custody because dark/monochrome source is currently under-designed. Desktop, half-width and phone layouts need actual operator-browser acceptance before release.

## Required DesignPAC components (packaged as separately custodied, integrity-bound descendants)

1. `parent_identity_and_copy` — registered c3 Field tree identity, Field principles, Current State naming/tagline; links to source WebPAC.
2. `first_impression_and_intro_transition` — accepted intro source and exact public vs invited continuation conditions.
3. `two_entrance_hierarchy` — visible "Enter Current State" primary entry and independent public "Explore c3 Field"; no visitor entitlement implied.
4. `invitation_provenance_and_verification` — registered opaque referral through Connect; current recipient's own environment, not sender's.
5. `current_state_app_entry_orientation` — app gateway, six owner features only as currently qualified; separate intentional Enter c3 Field door after six features.
6. `readiness_and_work_in_progress` — accurate, owner-friendly capabilities and WIP labels without inflated deployments/traction.
7. `responsive_accessibility_and_return` — 320px to desktop, keyboard/focus, visible controls, privacy, reduced motion, copy hierarchy, back/return without losing token.
8. `registered_media_and_og` — existing video/tree/backdrop public authority, FREE/RLS protection, registered social OG with true asset custody and 200 resolution, no unsupported fallback.
9. `footer_and_legal` — parent WebPAC Privacy/Terms/Contact/owner disclosure exactly as currently registered.

DesignPAC candidate shall register **private/source-review**, not runtime/public release; renderer consumes registered design state only after exact operator visual acceptance and separate WebPAC/runtime OAR2. Current Field backdrop `c3_field_c1me_live_backdrop_v1` was previously 401 `environment_claim_required`; **never weaken protected media custody** or convert private assets to public to beautify root. Where an asset is held, show a design-review HLD rather than inventing media.

## Acceptance proofs before public change

- Public root with no `via`: original approved intro, readable c3 Field home, discoverable Current State doorway.
- Invite root with valid `via`: original intro **once**, then C1/Current State verification, not generic Field root; `via` preserved and backend validated.
- Repeat/replay/referral mismatch/revoked reference: fail closed; zero extra invitation refs created by navigation and zero automatic sends.
- Returning recipient: signed reentry path to their own My Env, no new duplicate participant/env, current retained.
- New recipient: no My Env shown until native verification/claim; once legitimately established, Current State opens correct owned My Env.
- Unreleased Founders Ground: private provenance retained but no public initiative surface or participant entitlement fabricated.
- Browser acceptance on laptop at 100%/125%, mobile, keyboard, reduced motion, film sound/onEnded/skip, OG share image, legal footer and errors.
- Cross-host support must be verified via real `c3field.online` / `my.c3field.online` routes and native identity/session, not synthetic UI proof alone.

## Registry boundary

This component documents what the operator wants organized in a DesignPAC. It is NOT itself a completed visually approved DesignPAC, production code patch, domain rewire, deployed UI, registered referral rights or permission to email contacts. Keep `c3field_root_orientation_c3webpac_v1` and currently accepted intro live until independently admitted correction and operator visual review.
