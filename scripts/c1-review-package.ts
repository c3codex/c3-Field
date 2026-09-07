// Environment-specific package projection, not a source of standing.
// Source: reconciled Drive manifest and copy, read 2026-09-06.
// Only consumed by the loopback review harness. Not imported by production frontend.
export const c1ReviewPackage = {
  available: true, reviewOnly: true,
  copy: {
    heroTitle: "Together, Our Potential Is Unlimited.",
    heroBody: "c3 Community Partners brings people together around a shared mission so community potential can become visible, connected, and useful.",
    structuralLine: "AUTHORITY · OPERATIONS · RESPONSIBILITY",
    missionTitle: "Every community contains more potential than we can see.",
    missionBody: "c3 Community Partners creates governed ways for people to connect around a shared mission, contribute what they know and can do, and create together.",
    missionClosing: "CONNECT establishes the participating community.",
    brandLine: "CONNECT · CONTRIBUTE · CREATE",
    encounterIntro: "Connecting means choosing to participate in the c3 community and shared mission.",
    openPrompt: "Where do you see people, ideas, skills, or resources that are not yet connected?",
    mediaTitle: "Real People. Real Places. A Shared Mission.",
    consent: "I agree to share this information with c3 Community Partners for the purpose of participating in the C1 Connect environment.",
    attestation: "I confirm that the information I provide is accurate to the best of my knowledge.",
    participationIntention: "I choose to connect with c3 Community Partners and participate in its shared mission.",
    custodyNotice: "The Connect relation remains in governed c3 custody for the individual record.",
  },
  assets: {
    emblem: {src: "/c1-review-media/emblem.png", alt: "c3 Community Partners"},
    intro: {src: "/c1-review-media/intro.mp4", mobileSrc: "/c1-review-media/intro-vertical.mp4", poster: "/c1-review-media/connect-vertical.jpg"},
  },
  initiatives: [],
}
export const packageSourceIds = {
  package: "1v1i7fSVGjuOgZ6qtXehheC_UPJqHADvW",
  manifest: "1LF5dl07FBvCP2whAfBFqxaNp1XEdCULHHZ-a4RAuusw",
  homepage: "1wqK5g4jay504i9iI3yu8m3D_BBTBNPq7draizPs2CNI",
  encounter: "1h30T45anD4X-NKAMc4ZrknIRWaRdjypf_yHW9ousb_Q",
}
export const mediaBindings = [
  {name:"emblem.png",id:"1PQ6UOX3k5Hknr8d3W0Zrw9uX4oq2hzJW",sha256:"2c145855863e040615b4d7883dae9b53e256421a2508681e70942b2a0e8351f2",type:"image/png"},
  {name:"intro.mp4",id:"1fjczn5zHd0q94IAyvH0KZA_BXFzqelGJ",sha256:"a68996e801ef91f99fbef19d22a2105fdb64e61b720d79e944fb6e521291a201",type:"video/mp4"},
  {name:"intro-vertical.mp4",id:"1ur4DiB7qyXBpku1xz-8opF70Cop9ET3D",sha256:"208063482add26125a8f14e753ef7a5126ecffda027bb026b23c7b97c3b7c867",type:"video/mp4"},
  {name:"connect-square.jpg",id:"1-95y6US5tzfJDShfP1ftm4J-iOymHhIN",sha256:"278d18672878b676f2e83bc25acddc0f87fb0bee327ef243a5be3c4a6da3a2b4",type:"image/jpeg"},
  {name:"connect-vertical.jpg",id:"1wGdPc3s3n9HLALPL12W4xfsziaAoPRJ9",sha256:"cc9462a9f43b2466a46aee895f723641ff4f94e4ec0b6a8bdf11d7dc6f77262d",type:"image/jpeg"},
]
export function verifyRegistrySnapshot(rows: {evidence: string; record: any}[]) {
  const env = rows.find(row => row.evidence === "environment")?.record
  const registry = rows.find(row => row.evidence === "registry")?.record
  const terms = ["material_environment_resolution_mechanism_v2", "dual_car_same_destination_v1", "environment_specific_relational_inputs_v1", "current_as_result_of_passage_founding_principle_v1"]
  return env?.env_key === "env_c3_community_connect" && env?.environment_name === "c1ME_env" &&
    env?.system_key === "c3_field" && env?.is_canonical === true && env?.is_active === true &&
    env?.standing === "governed_environment" && env?.metadata?.env_pac_drive_id === packageSourceIds.package &&
    env?.metadata?.runtime_activation_state === "held" && env?.metadata?.public_release_state === "held" &&
    env?.metadata?.noninheritance_rule === true && registry?.registry_key === "c3_community_connect" &&
    registry?.release_state === "held" && registry?.access_state === "gated" &&
    terms.every(key => rows.some(row => row.evidence === "term" && row.record.term_key === "source_concordance_v8_" + key && row.record.term_standing === "active" && row.record.visibility_standing === "protected"))
}
