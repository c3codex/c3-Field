import { RegistryItem } from "@/data/registry/types";

interface LensFilters {
  query?: string;
  pillar?: string;
  kind?: string;
  status?: string;
  tagsAny?: string[];
  tagsAll?: string[];
}

interface LensResult {
  item: RegistryItem;
  score: number;
  reasons: string[];
}

function norm(s: string) {
  return (s || "").toLowerCase().trim();
}
function normStatus(s: string) {
  const v = norm(s);
  if (!v) return "live";
  // treat canon/active/published as live for UI + related
  if (v === "canon" || v === "active" || v === "published") return "live";
  return v;
}

function overlapCount(a: string[], b: string[]) {
  const setB = new Set(b.map(norm));
  let c = 0;
  for (const t of a) if (setB.has(norm(t))) c++;
  return c;
}

export function searchLens(items: RegistryItem[], filters: LensFilters): LensResult[] {
  const q = norm(filters.query || "");
  const pillar = filters.pillar ?? "all";
  const kind = filters.kind ?? "all";
  const status = filters.status ?? "all";
  const tagsAny = (filters.tagsAny ?? []).map(norm).filter(Boolean);
  const tagsAll = (filters.tagsAll ?? []).map(norm).filter(Boolean);

  const now = Date.now();
  const out: LensResult[] = [];

  for (const item of items) {
    if (pillar !== "all" && item.pillar !== pillar) continue;
    if (kind !== "all" && item.kind !== kind) continue;
    const itemStatus = normStatus(item.status);

if (status !== "all" && itemStatus !== normStatus(status)) continue;


    const itemTags = (item.tags || []).map(norm);

    if (tagsAny.length > 0) {
      const anyOk = tagsAny.some((t) => itemTags.includes(t));
      if (!anyOk) continue;
    }
    if (tagsAll.length > 0) {
      const allOk = tagsAll.every((t) => itemTags.includes(t));
      if (!allOk) continue;
    }

    let score = 0;
    const reasons: string[] = [];

    if (q) {
      const title = norm(item.title);
      const summary = norm(item.summary);
      const tags = norm((item.tags || []).join(" "));

      if (title.includes(q)) {
        score += 40;
        reasons.push("title match");
      }
      if (summary.includes(q)) {
        score += 20;
        reasons.push("summary match");
      }
      if (tags.includes(q)) {
        score += 15;
        reasons.push("tag match");
      }
      if (score === 0) continue;
    } else {
      score += 5;
      reasons.push("browse");
    }

    if (tagsAny.length > 0) {
      const c = overlapCount(item.tags || [], tagsAny);
      if (c > 0) {
        score += 8 * c;
        reasons.push(`tagsAny overlap x${c}`);
      }
    }
    if (tagsAll.length > 0) {
      const c = overlapCount(item.tags || [], tagsAll);
      if (c > 0) {
        score += 10 * c;
        reasons.push(`tagsAll overlap x${c}`);
      }
    }

    if (item.date) {
      const t = Date.parse(item.date);
      if (!Number.isNaN(t)) {
        const days = (now - t) / (1000 * 60 * 60 * 24);
        if (days <= 14) {
          score += 12;
          reasons.push("recent (≤14d)");
        } else if (days <= 60) {
          score += 6;
          reasons.push("recent (≤60d)");
        }
      }
    }

    out.push({ item, score, reasons });
  }

  out.sort((a, b) => b.score - a.score);
  return out;
}

export function relatedLens(
  items: RegistryItem[],
  seedId: string,
  limit = 12
): LensResult[] {
  const seed = items.find((x) => x.id === seedId);
  if (!seed) return [];

  const seedTags = seed.tags || [];
  const manual = new Set(seed.related || []);
  const out: LensResult[] = [];

  for (const item of items) {
    if (item.id === seed.id) continue;
    if (item.status !== "live") continue;

    let score = 0;
    const reasons: string[] = [];

    const shared = overlapCount(item.tags || [], seedTags);
    if (shared > 0) {
      score += 10 * shared;
      reasons.push(`shared tags x${shared}`);
    }
    if (manual.has(item.id)) {
      score += 40;
      reasons.push("manual related boost");
    }
    if (item.pillar === seed.pillar) {
      score += 6;
      reasons.push("same pillar");
    }

    if (score > 0) out.push({ item, score, reasons });
  }

  out.sort((a, b) => b.score - a.score);
  return out.slice(0, limit);
}

export function getAllTags(items: RegistryItem[]): string[] {
  const s = new Set<string>();
  for (const it of items) (it.tags || []).forEach((t) => s.add(t));
  return Array.from(s).sort((a, b) => a.localeCompare(b));
}
