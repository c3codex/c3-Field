import type { C3TreeBranchKey } from "./c3TreeModel"

export type C3ProcessLocation = C3TreeBranchKey | "interoperability"

export type C3ProcessDefinition = {
  key: string
  label: string
  location: C3ProcessLocation
  calledFrom: string
  effect: string
  standing: "structural" | "registered"
}

export const c3ProcessFabric: C3ProcessDefinition[] = [
  {
    key: "environment_formation",
    label: "Environment formation",
    location: "field",
    calledFrom: "BUILD",
    effect: "form bounded environment definition",
    standing: "structural",
  },
  {
    key: "mgs_evaluation",
    label: "MGS evaluation",
    location: "boundary",
    calledFrom: "BUILD / WORK",
    effect: "resolve minimum governed standard",
    standing: "structural",
  },
  {
    key: "current_binding",
    label: "Current binding",
    location: "boundary",
    calledFrom: "state passage",
    effect: "bind governed present-state relation",
    standing: "structural",
  },
  {
    key: "oar_lifecycle",
    label: "OAR lifecycle",
    location: "field",
    calledFrom: "WORK",
    effect: "move bounded governed work",
    standing: "structural",
  },
  {
    key: "custody_resolution",
    label: "Custody resolution",
    location: "interoperability",
    calledFrom: "WORK",
    effect: "resolve authoritative custody relation",
    standing: "structural",
  },
  {
    key: "transfer",
    label: "Transfer",
    location: "interoperability",
    calledFrom: "WORK",
    effect: "carry authorized passage between bounded relations",
    standing: "structural",
  },
  {
    key: "evidence_return",
    label: "Evidence return",
    location: "interoperability",
    calledFrom: "BUILD / WORK",
    effect: "return passage evidence to governed state",
    standing: "structural",
  },
  {
    key: "external_encounter",
    label: "External encounter",
    location: "canopy",
    calledFrom: "Field / Interoperability",
    effect: "relate a bounded c3 passage to a non-c3 environment",
    standing: "structural",
  },
  {
    key: "lapzuli_distribution",
    label: "Lapzuli Distribution",
    location: "field",
    calledFrom: "WORK",
    effect: "qualify and execute bounded distribution passage",
    standing: "registered",
  },
]

export function processLocationLabel(location: C3ProcessLocation) {
  if (location === "interoperability") return "Interoperability · trunk"
  return location.charAt(0).toUpperCase() + location.slice(1) + " · branch"
}
