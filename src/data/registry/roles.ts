import type { RegistryItem } from "./types";

export const ROLES: RegistryItem[] = [
  {
    id: "role-human-authorship",
    kind: "role",
    pillar: "model",
    title: "Human Authorship — Sovereign Origin",
    summary:
      "Defines geometry, constraints, ritual architecture, and meaning. Retains sole authority over intent, culture, and governance direction.",
    status: "live",
    tags: ["roles", "sovereignty", "authorship", "origin", "boundaries"],
    roleMeta: {
      scope: "protocol",
      responsibilities: ["stewardship"],
      daoDuty: true,
      functions: [
        "Define field constraints and canonical language",
        "Approve structural changes to c3 model surfaces",
        "Hold authorship boundaries across pillars",
      ],
      signals: [
        "Canon updates are documented",
        "Registry changes preserve provenance",
        "Governance intent remains explicit",
      ],
      commitments: [
        "Non-delegable authority over meaning",
        "No automation of governance decisions",
      ],
    },
  },
  // repeat for each role…
];
