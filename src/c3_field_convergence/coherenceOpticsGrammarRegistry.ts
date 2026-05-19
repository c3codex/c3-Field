export type OpticsMaterialKey = "crystal" | "obsidian" | "lapis" | "marble"

export type OpticsRelationKey =
  | "upstream"
  | "downstream"
  | "corrective"
  | "convergent"
  | "divergent"
  | "dependency"
  | "blocked-return"
  | "unresolved"
  | "sealed"

export type OpticsCompositionPresetKey =
  | "field_lens"
  | "rooted_orbit"
  | "mandala_runtime"
  | "inscription_ring"
  | "fracture_return"

export type OpticsMaterialGrammar = {
  key: OpticsMaterialKey
  label: string
  geometryRole: string
  behavior: string
  spatialRule: string
  densityRule: string
  revealPriority: number
  rendererClass: string
  statements: string[]
}

export type OpticsRelationGrammar = {
  key: OpticsRelationKey
  label: string
  behavior: string
  relationRule: string
  rendererClass: string
}

export type OpticsCompositionPreset = {
  key: OpticsCompositionPresetKey
  label: string
  spatialRule: string
  densityRule: string
  rendererClass: string
}

export const coherenceOpticsGrammarRegistry = {
  grammarKey: "coherence_optics_grammar_registry_v1",
  rendererContract: {
    truthSource: "seated runtime registry, validation checks, evidence trace, and transition continuity",
    boundary: "read_only_derived_runtime",
    noMutation: true,
    noAutomation: true,
    noFrontendOwnedTruth: true,
  },
  materials: [
    {
      key: "crystal",
      label: "Crystal",
      geometryRole: "center-held authority",
      behavior: "authority stillness, coherence pulse, source held within the field",
      spatialRule: "remain merged into the center field; never separate as a competing panel",
      densityRule: "felt first with minimal explanation",
      revealPriority: 1,
      rendererClass: "c3-optics-material-crystal",
      statements: ["Authority held as stillness", "Immutable coherence", "Center-held truth"],
    },
    {
      key: "lapis",
      label: "Lapis Relation Ring",
      geometryRole: "relation vector field",
      behavior: "relation, vectors, dependency, continuity pathways",
      spatialRule: "carry relation through orbital adjacency before explanatory text",
      densityRule: "show pathways without dashboard saturation",
      revealPriority: 2,
      rendererClass: "c3-optics-material-lapis",
      statements: ["Mapping and lineage", "Dependencies and adjacency", "Standing continuity"],
    },
    {
      key: "obsidian",
      label: "Obsidian Gate",
      geometryRole: "threshold and fracture gate",
      behavior: "threshold, refusal, blocked passage, fracture tension",
      spatialRule: "make interruption visible without overwhelming center authority",
      densityRule: "hold fracture tension as secondary pressure",
      revealPriority: 3,
      rendererClass: "c3-optics-material-obsidian",
      statements: ["Constraint and threshold", "Refusal and correction", "Passage control"],
    },
    {
      key: "marble",
      label: "Marble Inscription",
      geometryRole: "inscription and evidence memory",
      behavior: "evidence, closure memory, witnessed continuity",
      spatialRule: "distribute preserved lineage around the field edge",
      densityRule: "remain discoverable after relation is perceived",
      revealPriority: 4,
      rendererClass: "c3-optics-material-marble",
      statements: ["Evidence continuity", "Closure sediment", "Preserved lineage"],
    },
  ] satisfies OpticsMaterialGrammar[],
  spatialHierarchy: [
    "Crystal coherence felt first",
    "Lapis relation perceived second",
    "Obsidian fracture tension perceived third",
    "Marble inscription continuity discovered fourth",
    "Detailed lineage encountered last",
  ],
  densityRules: [
    "text secondary to geometry",
    "labels minimal unless inspected",
    "no equal visual urgency",
    "relation must be perceivable before explanation",
    "fracture must remain visible without overwhelming center authority",
  ],
  relations: [
    {
      key: "upstream",
      label: "Upstream",
      behavior: "received source motion",
      relationRule: "enter field from source side",
      rendererClass: "c3-lapis-arc-upstream",
    },
    {
      key: "downstream",
      label: "Downstream",
      behavior: "delivered runtime motion",
      relationRule: "exit toward delivered standing",
      rendererClass: "c3-lapis-arc-downstream",
    },
    {
      key: "corrective",
      label: "Corrective",
      behavior: "correction return path",
      relationRule: "bend back toward a recorded correction lineage",
      rendererClass: "c3-lapis-arc-corrective",
    },
    {
      key: "convergent",
      label: "Convergent",
      behavior: "closure convergence",
      relationRule: "draw evidence and actual OAR1 toward held standing",
      rendererClass: "c3-lapis-arc-convergent",
    },
    {
      key: "divergent",
      label: "Divergent",
      behavior: "expected closure unresolved",
      relationRule: "show split where actual closure is missing",
      rendererClass: "c3-lapis-arc-divergent",
    },
    {
      key: "dependency",
      label: "Dependency",
      behavior: "source dependency",
      relationRule: "anchor from recorded source OAR2",
      rendererClass: "c3-lapis-arc-dependency",
    },
    {
      key: "blocked-return",
      label: "Blocked Return",
      behavior: "blocked or held return",
      relationRule: "make refusal visible as interrupted return path",
      rendererClass: "c3-lapis-arc-blocked-return",
    },
    {
      key: "unresolved",
      label: "Unresolved",
      behavior: "unverified standing",
      relationRule: "hold as visible pending state",
      rendererClass: "c3-lapis-arc-unresolved",
    },
    {
      key: "sealed",
      label: "Sealed",
      behavior: "completed evidence continuity",
      relationRule: "close into inscription continuity",
      rendererClass: "c3-lapis-arc-sealed",
    },
  ] satisfies OpticsRelationGrammar[],
  compositionPresets: [
    {
      key: "field_lens",
      label: "Field Lens",
      spatialRule: "center authority, orbital relation, distributed inscription",
      densityRule: "single chamber with compact readouts",
      rendererClass: "c3-lapis-preset-field-lens",
    },
    {
      key: "rooted_orbit",
      label: "Rooted Orbit",
      spatialRule: "bottom readout grounds the orbital field",
      densityRule: "readout supports geometry without displacing it",
      rendererClass: "c3-lapis-preset-rooted-orbit",
    },
    {
      key: "mandala_runtime",
      label: "Mandala Runtime",
      spatialRule: "runtime standing resolves through rings and axes",
      densityRule: "abstract status before detailed listing",
      rendererClass: "c3-lapis-preset-mandala-runtime",
    },
    {
      key: "inscription_ring",
      label: "Inscription Ring",
      spatialRule: "evidence memory distributes along the edge",
      densityRule: "closure appears as secondary discovery",
      rendererClass: "c3-lapis-preset-inscription-ring",
    },
    {
      key: "fracture_return",
      label: "Fracture Return",
      spatialRule: "blocked and corrective relation remains visible",
      densityRule: "fracture tension remains bounded",
      rendererClass: "c3-lapis-preset-fracture-return",
    },
  ] satisfies OpticsCompositionPreset[],
} as const

export function materialGrammar(key: OpticsMaterialKey) {
  return coherenceOpticsGrammarRegistry.materials.find((material) => material.key === key)
}

export function relationGrammar(key: OpticsRelationKey) {
  return coherenceOpticsGrammarRegistry.relations.find((relation) => relation.key === key)
}

export function compositionPresetGrammar(key: OpticsCompositionPresetKey) {
  return coherenceOpticsGrammarRegistry.compositionPresets.find((preset) => preset.key === key)
}
