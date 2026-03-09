// src/data/registry/index.ts
import type { RegistryItem } from "./types";

import { ROLES } from "./roles";
import { GENERATED_ITEMS } from "./generated";

// If/when you add these later, uncomment:
// import { ARTICLES } from "./articles";
// import { PROJECTS } from "./projects";
// import { UPDATES } from "./updates";
// import { ARTIFACTS } from "./artifacts";
export { codexVaultPublicUrl, normalizeCodexVaultKey } from "./resolveHref";
export const REGISTRY_ALL: RegistryItem[] = [
  ...ROLES,
  ...GENERATED_ITEMS,
  // ...ARTICLES,
  // ...PROJECTS,
  // ...UPDATES,
  // ...ARTIFACTS,
];

// Optional helper maps for fast lookup
export const REGISTRY_BY_ID: Record<string, RegistryItem> =
  Object.fromEntries(REGISTRY_ALL.map((item) => [item.id, item]));

export const REGISTRY_BY_PILLAR = REGISTRY_ALL.reduce(
  (acc, item) => {
    if (!acc[item.pillar]) acc[item.pillar] = [];
    acc[item.pillar].push(item);
    return acc;
  },
  {} as Record<string, RegistryItem[]>
);

export const REGISTRY_BY_KIND = REGISTRY_ALL.reduce(
  (acc, item) => {
    if (!acc[item.kind]) acc[item.kind] = [];
    acc[item.kind].push(item);
    return acc;
  },
  {} as Record<string, RegistryItem[]>
);
