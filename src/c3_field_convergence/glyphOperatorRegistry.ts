import type { OpticsMaterialKey, OpticsRelationKey } from "./coherenceOpticsGrammarRegistry"

export type GlyphOperatorKey =
  | "crystal_coherence_pulse"
  | "obsidian_threshold"
  | "obsidian_blocked_passage"
  | "obsidian_correction_required"
  | "lapis_relation_vector"
  | "lapis_dependency_path"
  | "marble_evidence_memory"
  | "marble_closure_seal"

export type GlyphOperatorType = "material" | "relation" | "state" | "evidence"

export type GlyphOperator = {
  glyphKey: GlyphOperatorKey
  materialFamily: OpticsMaterialKey
  operatorType: GlyphOperatorType
  relationType: OpticsRelationKey | null
  stateCondition: string
  visualForm: string
  renderPriority: number
  meaningContract: string
  allowedSurface: "runtime_coherence_optics" | "lapis_relation_field" | "field_readout"
  rendererClass: string
  fallbackBehavior: string
}

export const glyphOperatorRegistry = {
  registryKey: "glyph_operator_registry_v1",
  rendererContract: {
    boundary: "read_only_derived_runtime",
    glyphsRequireSeatedCondition: true,
    noDecorativeGlyphs: true,
    noFrontendOwnedMeaning: true,
  },
  operators: [
    {
      glyphKey: "crystal_coherence_pulse",
      materialFamily: "crystal",
      operatorType: "material",
      relationType: null,
      stateCondition: "coherence score can be derived from runtime standing",
      visualForm: "center pulse",
      renderPriority: 1,
      meaningContract: "authority stillness and center-held source",
      allowedSurface: "lapis_relation_field",
      rendererClass: "c3-glyph-crystal-pulse",
      fallbackBehavior: "render center authority text only",
    },
    {
      glyphKey: "lapis_relation_vector",
      materialFamily: "lapis",
      operatorType: "relation",
      relationType: "upstream",
      stateCondition: "relation vector exists",
      visualForm: "vector bead",
      renderPriority: 2,
      meaningContract: "registered relation motion",
      allowedSurface: "lapis_relation_field",
      rendererClass: "c3-glyph-lapis-vector",
      fallbackBehavior: "render relation path without glyph",
    },
    {
      glyphKey: "lapis_dependency_path",
      materialFamily: "lapis",
      operatorType: "relation",
      relationType: "dependency",
      stateCondition: "source OAR2 dependency exists",
      visualForm: "anchored bead",
      renderPriority: 3,
      meaningContract: "source dependency and continuity pathway",
      allowedSurface: "lapis_relation_field",
      rendererClass: "c3-glyph-lapis-dependency",
      fallbackBehavior: "render dependency path without glyph",
    },
    {
      glyphKey: "obsidian_threshold",
      materialFamily: "obsidian",
      operatorType: "material",
      relationType: null,
      stateCondition: "threshold or fracture pressure exists",
      visualForm: "threshold slit",
      renderPriority: 4,
      meaningContract: "threshold, refusal, and passage control",
      allowedSurface: "lapis_relation_field",
      rendererClass: "c3-glyph-obsidian-threshold",
      fallbackBehavior: "render threshold label only",
    },
    {
      glyphKey: "obsidian_blocked_passage",
      materialFamily: "obsidian",
      operatorType: "state",
      relationType: "blocked-return",
      stateCondition: "execution blocked or unseeded blocked",
      visualForm: "blocked return mark",
      renderPriority: 5,
      meaningContract: "blocked passage or refusal standing",
      allowedSurface: "lapis_relation_field",
      rendererClass: "c3-glyph-obsidian-blocked",
      fallbackBehavior: "render blocked standing text only",
    },
    {
      glyphKey: "obsidian_correction_required",
      materialFamily: "obsidian",
      operatorType: "state",
      relationType: "corrective",
      stateCondition: "correction path or correction-required validation exists",
      visualForm: "correction return mark",
      renderPriority: 6,
      meaningContract: "correction standing routed through recorded lineage",
      allowedSurface: "lapis_relation_field",
      rendererClass: "c3-glyph-obsidian-correction",
      fallbackBehavior: "render correction standing text only",
    },
    {
      glyphKey: "marble_evidence_memory",
      materialFamily: "marble",
      operatorType: "evidence",
      relationType: "sealed",
      stateCondition: "evidence path or evidence reference exists",
      visualForm: "inscription bead",
      renderPriority: 7,
      meaningContract: "witnessed evidence memory",
      allowedSurface: "lapis_relation_field",
      rendererClass: "c3-glyph-marble-evidence",
      fallbackBehavior: "render evidence text only",
    },
    {
      glyphKey: "marble_closure_seal",
      materialFamily: "marble",
      operatorType: "evidence",
      relationType: "convergent",
      stateCondition: "actual OAR1 and evidence path exist",
      visualForm: "closure seal",
      renderPriority: 8,
      meaningContract: "closure seal and preserved continuity",
      allowedSurface: "lapis_relation_field",
      rendererClass: "c3-glyph-marble-closure",
      fallbackBehavior: "render closure text only",
    },
  ] satisfies GlyphOperator[],
} as const

export function glyphForMaterial(materialFamily: OpticsMaterialKey) {
  return glyphOperatorRegistry.operators.find(
    (operator) => operator.operatorType === "material" && operator.materialFamily === materialFamily,
  )
}

export function glyphForRelation(relationType: OpticsRelationKey) {
  return glyphOperatorRegistry.operators.find((operator) => operator.relationType === relationType)
}

export function glyphByKey(glyphKey: GlyphOperatorKey) {
  return glyphOperatorRegistry.operators.find((operator) => operator.glyphKey === glyphKey)
}
