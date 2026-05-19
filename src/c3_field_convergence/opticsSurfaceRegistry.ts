import type { OpticsMaterialKey } from "./coherenceOpticsGrammarRegistry"
import type { GlyphOperatorKey } from "./glyphOperatorRegistry"

export type OpticsSurfaceKey =
  | "center_authority_core"
  | "runtime_relation_ring"
  | "fracture_field"
  | "continuity_stream"
  | "validation_wave"
  | "inscription_band"
  | "threshold_boundary"
  | "memory_sediment"
  | "glyph_cluster"
  | "relation_orbit"

export type OpticsSurfaceFamily = "authority" | "relation" | "fracture" | "continuity" | "validation" | "inscription"

export type DensityProfile = "minimal" | "low" | "balanced" | "inspection"
export type MotionProfile = "still" | "pulsed" | "orbital" | "interrupted" | "flowing"

export type OpticsSurfaceContract = {
  surfaceKey: OpticsSurfaceKey
  surfaceFamily: OpticsSurfaceFamily
  materialFamilies: OpticsMaterialKey[]
  glyphFamilies: GlyphOperatorKey[]
  revealPriority: number
  hierarchyWeight: number
  spatialContract: string
  densityProfile: DensityProfile
  motionProfile: MotionProfile
  fractureBehavior: string
  inscriptionBehavior: string
  tonalEligibility: string
  runtimeBinding: string
  rendererContract: "read_only_derived_runtime"
  allowedSurfaceScope: "runtime_coherence_optics" | "lapis_relation_field" | "unified_runtime_console"
  rendererClass: string
}

export const opticsSurfaceRegistry = {
  registryKey: "optics_surface_registry_v1",
  rendererContract: {
    boundary: "read_only_derived_runtime",
    surfacesRequireRuntimeBinding: true,
    noDecorativeFracture: true,
    noFrontendOwnedPerceptualAuthority: true,
  },
  surfaces: [
    {
      surfaceKey: "center_authority_core",
      surfaceFamily: "authority",
      materialFamilies: ["crystal"],
      glyphFamilies: ["crystal_coherence_pulse"],
      revealPriority: 1,
      hierarchyWeight: 100,
      spatialContract: "hold center authority as the first perceived field condition",
      densityProfile: "minimal",
      motionProfile: "pulsed",
      fractureBehavior: "fracture may orbit but cannot displace center authority",
      inscriptionBehavior: "inscription remains secondary to center-held coherence",
      tonalEligibility: "gold-white coherence only when score is derived",
      runtimeBinding: "coherenceScore, registry-backed persistence, evidence continuity",
      rendererContract: "read_only_derived_runtime",
      allowedSurfaceScope: "lapis_relation_field",
      rendererClass: "c3-surface-center-authority-core",
    },
    {
      surfaceKey: "runtime_relation_ring",
      surfaceFamily: "relation",
      materialFamilies: ["lapis"],
      glyphFamilies: ["lapis_relation_vector", "lapis_dependency_path"],
      revealPriority: 2,
      hierarchyWeight: 88,
      spatialContract: "make relation perceivable through orbital adjacency before text",
      densityProfile: "balanced",
      motionProfile: "orbital",
      fractureBehavior: "interrupted relation remains visibly broken",
      inscriptionBehavior: "evidence-bearing relation may resolve toward inscription",
      tonalEligibility: "blue relation only from transition and dependency vectors",
      runtimeBinding: "transitionLog, source_oar2_path, process_instance_key",
      rendererContract: "read_only_derived_runtime",
      allowedSurfaceScope: "lapis_relation_field",
      rendererClass: "c3-surface-runtime-relation-ring",
    },
    {
      surfaceKey: "relation_orbit",
      surfaceFamily: "relation",
      materialFamilies: ["lapis", "crystal"],
      glyphFamilies: ["lapis_relation_vector", "crystal_coherence_pulse"],
      revealPriority: 3,
      hierarchyWeight: 84,
      spatialContract: "hold runtime nodes in orbit around center authority",
      densityProfile: "balanced",
      motionProfile: "orbital",
      fractureBehavior: "fracture bends orbit but does not erase continuity",
      inscriptionBehavior: "closed orbit may touch marble inscription",
      tonalEligibility: "orbital relation fields only from placed runtime nodes",
      runtimeBinding: "derived relation nodes and vectors",
      rendererContract: "read_only_derived_runtime",
      allowedSurfaceScope: "lapis_relation_field",
      rendererClass: "c3-surface-relation-orbit",
    },
    {
      surfaceKey: "fracture_field",
      surfaceFamily: "fracture",
      materialFamilies: ["obsidian"],
      glyphFamilies: ["obsidian_threshold", "obsidian_blocked_passage", "obsidian_correction_required"],
      revealPriority: 4,
      hierarchyWeight: 72,
      spatialContract: "show refusal and interruption as pressure at the orbit edge",
      densityProfile: "low",
      motionProfile: "interrupted",
      fractureBehavior: "blocked-return and correction-required standing must remain visible",
      inscriptionBehavior: "fracture cannot become closure without recorded evidence",
      tonalEligibility: "red-orange pressure only from blocked, held, or correction standing",
      runtimeBinding: "execution_standing, validation_standing, seeded_reference_standing, correction_oar2_path",
      rendererContract: "read_only_derived_runtime",
      allowedSurfaceScope: "lapis_relation_field",
      rendererClass: "c3-surface-fracture-field",
    },
    {
      surfaceKey: "continuity_stream",
      surfaceFamily: "continuity",
      materialFamilies: ["lapis", "marble"],
      glyphFamilies: ["lapis_relation_vector", "marble_evidence_memory"],
      revealPriority: 5,
      hierarchyWeight: 66,
      spatialContract: "carry continuity through bottom readout without displacing geometry",
      densityProfile: "inspection",
      motionProfile: "flowing",
      fractureBehavior: "correction continuity remains named when present",
      inscriptionBehavior: "evidence continuity may stabilize the readout",
      tonalEligibility: "stable wave only from existing transition and evidence counts",
      runtimeBinding: "transitionLog.length, correctionVectors.length, evidenceTotal",
      rendererContract: "read_only_derived_runtime",
      allowedSurfaceScope: "lapis_relation_field",
      rendererClass: "c3-surface-continuity-stream",
    },
    {
      surfaceKey: "validation_wave",
      surfaceFamily: "validation",
      materialFamilies: ["obsidian", "lapis"],
      glyphFamilies: ["obsidian_correction_required", "lapis_relation_vector"],
      revealPriority: 6,
      hierarchyWeight: 58,
      spatialContract: "surface validation pressure as a compact state legend",
      densityProfile: "inspection",
      motionProfile: "still",
      fractureBehavior: "failed validation must remain readable",
      inscriptionBehavior: "validation does not become inscription until closed evidence exists",
      tonalEligibility: "validation tone only from checks and process standing",
      runtimeBinding: "validationChecks, failedChecks, process standing counts",
      rendererContract: "read_only_derived_runtime",
      allowedSurfaceScope: "lapis_relation_field",
      rendererClass: "c3-surface-validation-wave",
    },
    {
      surfaceKey: "inscription_band",
      surfaceFamily: "inscription",
      materialFamilies: ["marble"],
      glyphFamilies: ["marble_evidence_memory", "marble_closure_seal"],
      revealPriority: 7,
      hierarchyWeight: 52,
      spatialContract: "distribute evidence memory along the outer field edge",
      densityProfile: "low",
      motionProfile: "still",
      fractureBehavior: "missing evidence remains uninscribed",
      inscriptionBehavior: "only recorded evidence may appear as witnessed continuity",
      tonalEligibility: "marble tone only from evidence path or reference",
      runtimeBinding: "evidence_path, actual_oar1_path, evidence_reference",
      rendererContract: "read_only_derived_runtime",
      allowedSurfaceScope: "lapis_relation_field",
      rendererClass: "c3-surface-inscription-band",
    },
    {
      surfaceKey: "threshold_boundary",
      surfaceFamily: "fracture",
      materialFamilies: ["obsidian"],
      glyphFamilies: ["obsidian_threshold", "obsidian_blocked_passage"],
      revealPriority: 8,
      hierarchyWeight: 46,
      spatialContract: "hold threshold at the passage boundary",
      densityProfile: "minimal",
      motionProfile: "interrupted",
      fractureBehavior: "boundary appears only when threshold standing exists",
      inscriptionBehavior: "threshold does not inscribe closure",
      tonalEligibility: "threshold tone from blocked or fractured nodes",
      runtimeBinding: "fracturedNodes, interruptedVectors",
      rendererContract: "read_only_derived_runtime",
      allowedSurfaceScope: "lapis_relation_field",
      rendererClass: "c3-surface-threshold-boundary",
    },
    {
      surfaceKey: "memory_sediment",
      surfaceFamily: "inscription",
      materialFamilies: ["marble"],
      glyphFamilies: ["marble_evidence_memory"],
      revealPriority: 9,
      hierarchyWeight: 38,
      spatialContract: "let evidence memory settle as secondary discovery",
      densityProfile: "low",
      motionProfile: "still",
      fractureBehavior: "memory cannot cover unresolved standing",
      inscriptionBehavior: "evidence trace becomes sediment only when recorded",
      tonalEligibility: "soft marble tone from evidence total",
      runtimeBinding: "evidenceTotal, marbleCount",
      rendererContract: "read_only_derived_runtime",
      allowedSurfaceScope: "lapis_relation_field",
      rendererClass: "c3-surface-memory-sediment",
    },
    {
      surfaceKey: "glyph_cluster",
      surfaceFamily: "relation",
      materialFamilies: ["crystal", "obsidian", "lapis", "marble"],
      glyphFamilies: [
        "crystal_coherence_pulse",
        "obsidian_blocked_passage",
        "obsidian_correction_required",
        "lapis_relation_vector",
        "marble_closure_seal",
      ],
      revealPriority: 10,
      hierarchyWeight: 34,
      spatialContract: "compress seated state without replacing inspection text",
      densityProfile: "balanced",
      motionProfile: "still",
      fractureBehavior: "glyphs show fracture only from fracture conditions",
      inscriptionBehavior: "glyphs show closure only from recorded closure",
      tonalEligibility: "glyph tone follows registered material operator",
      runtimeBinding: "node kind, vector kind, fractured flag, evidence path",
      rendererContract: "read_only_derived_runtime",
      allowedSurfaceScope: "lapis_relation_field",
      rendererClass: "c3-surface-glyph-cluster",
    },
  ] satisfies OpticsSurfaceContract[],
} as const

export function surfaceContract(surfaceKey: OpticsSurfaceKey) {
  return opticsSurfaceRegistry.surfaces.find((surface) => surface.surfaceKey === surfaceKey)
}

export function surfaceClasses(surfaceKeys: OpticsSurfaceKey[]) {
  return surfaceKeys
    .map((surfaceKey) => surfaceContract(surfaceKey)?.rendererClass)
    .filter(Boolean)
    .join(" ")
}
