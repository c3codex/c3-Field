export type C3TreeBranchKey = "canopy" | "field" | "boundary"

export type C3TreeBranch = {
  key: C3TreeBranchKey
  label: string
  purpose: string
  examples: string[]
}

export const c3Tree = {
  roots: {
    label: "Systems",
    purpose: "Root identity, responsibility, source relation, and bounded system continuity.",
    examples: ["c3 Field", "Measures Registry", "Measures of Inanna", "c3 Ops"],
  },
  trunk: {
    label: "Interoperability",
    purpose: "Carries governed relation and passage without collapsing rooted systems into one another.",
    examples: ["relation", "route", "custody", "transfer", "return"],
  },
  branches: [
    {
      key: "canopy",
      label: "Canopy",
      purpose: "Participation, community, communication, access, and contribution.",
      examples: ["participants", "community", "communication", "contribution"],
    },
    {
      key: "field",
      label: "Field",
      purpose: "Operational arrangement: environments, processes, BUILD, WORK, and implementation.",
      examples: ["BUILD", "WORK", "processes", "Lapzuli"],
    },
    {
      key: "boundary",
      label: "Boundary",
      purpose: "Permission and constraint: identity, role, standing, authority, MGS, and holds.",
      examples: ["identity", "role", "permission", "MGS", "holds"],
    },
  ] satisfies C3TreeBranch[],
  optics: {
    label: "c3Optics",
    purpose: "Observes the whole tree: state, passage, correlation, evidence, and verification.",
  },
} as const

export const c3TreeLaw = [
  "Systems root.",
  "Interoperability connects.",
  "Canopy gathers.",
  "Field arranges.",
  "Boundary governs passage.",
] as const
