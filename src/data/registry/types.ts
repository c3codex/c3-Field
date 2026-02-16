// src/data/registry/types.ts

export type PillarId = "priceless" | "model" | "measures" | "codexstone" | "gallery";

export type RegistryKind =
  | "article"
  | "project"
  | "update"
  | "event"
  | "drop"
  | "contract"
  | "role";

export type RegistryStatus = "draft" | "live" | "archived";

export type RoleResponsibility =
  | "none"
  | "informational"
  | "stewardship"
  | "governance-participation";

export type RoleMeta = {
  scope?: "protocol" | "dao" | "pillar" | "project";
  responsibilities?: RoleResponsibility[];

  // Signals that this role has duties toward the DAO (vote/participate/etc.)
  daoDuty?: boolean;

  // Human-readable expectations
  functions?: string[];
  signals?: string[];
  commitments?: string[];

  // Optional references
  docsUrl?: string;
  applyUrl?: string;
};

export type RegistryLink = {
  label: string;
  href: string;
  external?: boolean; // true = opens new tab
};

export type ChainRef = {
  chain: "base" | "ethereum" | "optimism" | "zora" | "polygon" | "arbitrum" | "unknown";
  contract?: string; // 0x…
  tokenId?: string;  // string for safety
  collectionUrl?: string;
  tokenUrl?: string;
};

export type Provenance = {
  paragraphUrl?: string;
  ipfsCid?: string;
  sha256?: string;
  chainRefs?: ChainRef[];
  createdBy?: string; // e.g., "Ariyah"
  createdAt?: string; // ISO
};

export type RegistryItem = {
  id: string;                 // stable slug, never changes once published
  kind: RegistryKind;
  pillar: PillarId;

  title: string;
  summary: string;
  roleMeta?: RoleMeta;


  date?: string;              // ISO (optional for timeless items)
  status: RegistryStatus;

  tags: string[];             // v1: free strings; later: controlled vocab
  route?: string;             // internal route if it has an on-site page
  links?: RegistryLink[];     // external/internal references
  related?: string[];         // manual boosts (ids)

  provenance?: Provenance;
};

