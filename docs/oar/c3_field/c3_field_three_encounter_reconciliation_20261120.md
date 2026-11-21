# c3 Field — three encounter dimensions: source reconciliation
Date: 2026-11-20 | Operator: op044 | Status: source reconciliation / proposed implementation; NOT native PAC admission or production installation

## Decision
Three separate encounters, one governed ecosystem:
1. **Public ecosystem** at `c3field.online/`: dedicated public introduction (DESIGN NOT YET APPROVED), clear Current State registration/continuation, and featured MDM initiative. No visitor standing from browsing.
2. **Standalone initiative** at `mdm.c3field.online`: MDM's own public site and registered initiative context. Do not equate this host with the parent root. Preserve existing MDM media and presentation pending exact SRC/PAC reconciliation.
3. **Participant Field** encountered through Current State / My Env: retain the existing working participant passage and owner-authorized PAC projection. Do not substitute public root presentation or assume authority from a URL alone.

## Verified source findings (c3-Field default branch `c3field`)
- `src/app/App.tsx`: public root `/` renders `C3FieldRoot`; `/connect` renders `C3CommunityConnect`; `/my-environment` renders `MyEnvironmentEncounter`; personal host `my.c3field.online` also renders `MyEnvironmentEncounter`. `/contribute` and `/create` dispatch to `FieldReceiver`. Public metadata fallback still says “The Million Dollar Mission”.
- `src/c3_field_connect/c3FieldRouting.ts`: routes `/` and `/connect` both classified `connect` despite distinct rendered components; `/my-environment` is a separate environment route.
- `src/c3_field_connect/C3FieldRoot.tsx`: root loads `/api/c3-root-presentation`, film, mosaic, sections, and public orientation; its existence does not prove the future public design is approved.
- `src/c3_field_connect/C3CommunityConnect.tsx`: `MillionDollarMissionLanding` remains imported and presented as a legacy public Connect/MDM path. This is a presentation boundary to separate, not delete indiscriminately.
- `src/c3_field_connect/MillionDollarMissionLanding.tsx`: MDM-specific public presentation and film.
- `src/c3_field_connect/MyEnvironmentEncounter.tsx` and `MyPacsPanel.tsx`: participant My Env and owner-controlled “USE ON C3 FIELD” projection controls exist in source; actual session handoff and deployed effect must be verified independently.
- `src/c3_field_connect/initiativeSurfaceHost.ts` and `C3InitiativeSurfaceDoor.tsx`: initiative-host classification and runtime exist; check whether `mdm.c3field.online` has an exact registered host/PAC binding before configuring DNS or assuming it will render MDM.

## Reconciliation matrix
| Boundary | Current source | Required resolution | Evidence to return |
| --- | --- | --- | --- |
| D1 public root | `C3FieldRoot`; legacy MDM SEO fallback | Keep root independent; design new ecosystem landing, registration CTA and featured MDM link; remove MDM-as-parent assumptions only after registered content replacement | public WebPAC/DesignPAC, root route and metadata, anonymous smoke |
| D2 MDM standalone | `MillionDollarMissionLanding` inside Connect; generic initiative-host handling | Bind `mdm.c3field.online` to exact MDM initiative WebPAC/DesignPAC and existing registered assets; migrate presentation, don't duplicate PAC or media | host binding, DNS/SSL, runtime resolution, registered SRC, anonymous smoke |
| D3 participant Field | My Env, PAC projection and FieldReceiver routes | Preserve working My Env→Field encounter; verify exact transition and authorized projections; do not conflate with D1/D2 | authenticated session, projection consent, identity isolation, participant readback |

## Execution sequence
S0. Registrar read-only preflight: resolve operative public/MDM/participant PACs, exact host binding, DesignPACs, SRCs, active authority and holds. Avoid candidate-key duplicates.
S1. Capture deployed root, `/connect`, MDM host and My Env→Field journey, with screenshots and HTTP/JSON evidence. Distinguish source from live state.
S2. Specify three independent presentation contracts and routing tests. D1 design remains pending; use no invented finished design.
S3. Prepare bounded PAC admission/amendments, and explicit effect-specific installation authority. Link to Current State PR #32 only for shared admission concerns; do not silently expand its scope.
S4. Implement and test MDM host isolation, parent-root decoupling, Current State registration path and unchanged participant entry.
S5. Deploy only within effective native authority; return installation receipts, OAR1 and authenticated/anonymous readbacks.

## Non-negotiable safeguards
- No production change authorized by this document; no Codex self-grant, unrestricted SQL or Registry bypass.
- Preserve existing Current State and CanCom runtime; no private My Env leakage to public surfaces.
- Public navigation cannot manufacture participant standing.
- Independent assurance is not a new blanket release blocker; honor any mandatory registered security and authority holds.
- If exact MDM PAC, host, asset or live passage is unresolved, report HLD for that effect rather than assert completion.

## Requested operator disposition
Approve this as the bounded source reconciliation basis for D1/D2/D3. Registrar to return existing PAC identities and effect-specific authorization; implementation then proceeds without redesigning the participant Field.
