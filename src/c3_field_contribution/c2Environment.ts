// Formation configuration only: not a registry record or eligibility decision.
export const c2Environment = {
  id: "c2ME_env",
  route: "/c2",
  encounter: "c2_contribution_shell",
  mode: "inert_shell",
  prerequisite: "held_pending_verified_live_c1_C1",
  authorityInherited: false,
  databaseReferences: {
    environment: "public.c3_environment",
    prerequisiteProducer: "public.register_and_persist_c1_relationship",
    c2Binding: null, // Exact formed c2 record/interface awaits Chazz/op044 mapping.
  },
  seams: [
    {id:"eligibility", title:"Participation eligibility", description:"Persisted c1/C1 evidence must be verified before eligibility can be consumed."},
    {id:"participation", title:"Named individual / CI", description:"Participation context awaits the reviewed c2 definition."},
    {id:"contribution", title:"3-2-2 contribution", description:"Contribution input structure awaits formation and review."},
    {id:"interoperability", title:"3x3 interoperability", description:"Interoperability mapping remains a formation interface."},
    {id:"initiative", title:"c3-modeled initiative", description:"Initiative formation and encounter design remain open for review."},
    {id:"handoff", title:"OAR2 / CanCom", description:"A later governed handoff must identify its source and return route."},
    {id:"encounter", title:"Contributed initiative encounter", description:"No contributed initiative is published or encounterable through this shell."},
    {id:"persistence", title:"Persistence boundary", description:"No initiative persistence or C2 Current creation is connected."},
    {id:"key", title:"c3 Key boundary", description:"No c3 Key handoff is active."},
  ],
} as const

// Evidence is opaque and read-only. Supplying a value never unlocks this shell.
export type PersistedC1EligibilityInput = Readonly<{ evidenceReference: string; relationshipReference: string }>
export function readC2Eligibility(_evidence?: PersistedC1EligibilityInput) {
  return {standing: c2Environment.prerequisite, eligible: false, operationalConsumption: false} as const
}

// Deliberately no fetch, RPC, storage, wallet or callable mutation adapter.
export const c2Boundaries = Object.freeze({
  participationInput: null, contributionInput: null, interoperability: null,
  initiativeFormation: null, cancomHandoff: null, contributedEncounter: null,
  persistence: null, current: null, c3Key: null,
})
