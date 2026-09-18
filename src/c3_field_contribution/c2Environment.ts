// Formation configuration only: not a registry record or eligibility decision.
export const c2Environment = {
  id: "c2ME_env",
  route: "/c2",
  encounter: "c2_contribution_shell",
  mode: "mdm_participation_renderer",
  prerequisite: "verified_live_c1_C1_environment_session",
  authorityInherited: false,
  databaseReferences: {
    environment: "public.c3_environment",
    prerequisiteProducer: "public.register_and_persist_c1_relationship",
    c2Binding: "functions/api/c2-mdm",
  },
  seams: [
    {id:"eligibility", title:"Participation eligibility", description:"Persisted c1/C1 evidence must be verified before eligibility can be consumed."},
    {id:"participation", title:"Named individual / CI", description:"Participation context awaits the reviewed c2 definition."},
    {id:"contribution", title:"3-2-2 contribution", description:"Contribution input structure awaits formation and review."},
    {id:"interoperability", title:"3x3 interoperability", description:"Interoperability mapping remains a formation interface."},
    {id:"initiative", title:"c3-modeled initiative", description:"Million Dollar Mission is the first connected c3-modeled initiative projection."},
    {id:"handoff", title:"OAR2 / CanCom", description:"A later governed handoff must identify its source and return route."},
    {id:"encounter", title:"Contributed initiative encounter", description:"Connected participants can open prospect dossiers and begin bounded support/contribution actions."},
    {id:"persistence", title:"Persistence boundary", description:"MDM support, contribution, evidence, and Current persist through the governed c2 MDM API."},
    {id:"key", title:"c3 Key boundary", description:"No c3 Key handoff is active."},
  ],
} as const

// Browser state does not create eligibility. Runtime access is resolved server-side from the persisted c3 environment session.
export type PersistedC1EligibilityInput = Readonly<{ evidenceReference: string; relationshipReference: string }>
export function readC2Eligibility(_evidence?: PersistedC1EligibilityInput) {
  return {standing: c2Environment.prerequisite, eligible: false, operationalConsumption: "server_side_only"} as const
}

export const c2Boundaries = Object.freeze({
  participationInput: "c3_env_session", contributionInput: "functions/api/c2-mdm", interoperability: null,
  initiativeFormation: "million_dollar_mission", cancomHandoff: null, contributedEncounter: "c2_mdm_prospect_dossier",
  persistence: "c2_mdm_*", current: "c2_mdm_current", c3Key: null,
})
