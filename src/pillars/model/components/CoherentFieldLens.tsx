// src/pillars/model/components/LensFiltersBar.tsx
// v1 minimal filter UI (no styling assumptions beyond Tailwind)

import React from "react";
import type { PillarId, RegistryKind, RegistryStatus } from "@/data/registry/types";

type LensFilters = {
  query?: string;
  pillar?: PillarId | "all";
  kind?: RegistryKind | "all";
  status?: RegistryStatus | "all";
  tagsAny?: string[];
  tagsAll?: string[];
};

const PILLARS: Array<{ id: PillarId | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "model", label: "Model" },
  { id: "measures", label: "Measures" },
  { id: "codexstone", label: "Codexstone" },
  { id: "gallery", label: "Gallery" },
  { id: "priceless", label: "Priceless" },
];

const KINDS: Array<{ id: RegistryKind | "all"; label: string }> = [
  { id: "all", label: "All Types" },
  { id: "article", label: "Articles" },
  { id: "update", label: "Updates" },
  { id: "event", label: "Events" },
  { id: "project", label: "Projects" },
  { id: "drop", label: "Drops" },
  { id: "contract", label: "Contracts" },
];

const STATUS: Array<{ id: RegistryStatus | "all"; label: string }> = [
  { id: "live", label: "Live" },
  { id: "draft", label: "Draft" },
  { id: "archived", label: "Archived" },
  { id: "all", label: "All Status" },
];

type Props = {
  value: LensFilters;
  onChange: (next: LensFilters) => void;
};

export default function LensFiltersBar({ value, onChange }: Props) {
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur-md">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Query */}
        <input
          value={value.query ?? ""}
          onChange={(e) => onChange({ ...value, query: e.target.value })}
          placeholder="Search the field…"
          className="w-full md:w-[320px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-stone-100 outline-none placeholder:text-stone-400 focus:border-white/20"
        />

        {/* Pillar */}
        <select
          value={value.pillar ?? "all"}
         onChange={(e) =>
  onChange({
    ...value,
    pillar: e.target.value as PillarId | "all",
  })
}

          className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-stone-100 outline-none focus:border-white/20"
        >
          {PILLARS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>

        {/* Kind */}
        <select
          value={value.kind ?? "all"}
          onChange={(e) =>
  onChange({
    ...value,
    kind: e.target.value as RegistryKind | "all",
  })
}

          className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-stone-100 outline-none focus:border-white/20"
        >
          {KINDS.map((k) => (
            <option key={k.id} value={k.id}>
              {k.label}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={value.status ?? "live"}
          onChange={(e) =>
  onChange({
    ...value,
    status: e.target.value as RegistryStatus | "all",
  })
}

          className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-stone-100 outline-none focus:border-white/20"
        >
          {STATUS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Clear */}
        <button
          type="button"
          onClick={() =>
            onChange({
              query: "",
              pillar: "all",
              kind: "all",
              status: "live",
              tagsAny: [],
              tagsAll: [],
            })
          }
          className="ml-auto rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-stone-100/90 hover:bg-black/50"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
