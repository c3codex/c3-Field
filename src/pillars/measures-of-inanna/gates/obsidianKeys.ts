// src/pillars/measures/gates/obsidianKeys.ts

export const OBSIDIAN_EPIGRAPH_SEEN_KEY = "measures:obsidian_epigraph_seen";

export function hasSeenObsidianEpigraph(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(OBSIDIAN_EPIGRAPH_SEEN_KEY) === "true";
}

export function markObsidianEpigraphSeen(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(OBSIDIAN_EPIGRAPH_SEEN_KEY, "true");
}

export function clearObsidianEpigraphSeen(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(OBSIDIAN_EPIGRAPH_SEEN_KEY);
}