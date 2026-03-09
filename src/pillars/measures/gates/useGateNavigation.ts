import { useMemo } from "react";
import { nextObsidianGateSlug, OBSIDIAN_GATE_ORDER } from "./nextGate";

export function useGateNavigation(currentGate: string | null) {

  const nextGate = useMemo(() => {
    if (!currentGate) return null;
    return nextObsidianGateSlug(currentGate);
  }, [currentGate]);

  function isGateUnlocked(gate: string) {
    if (!currentGate) return false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = OBSIDIAN_GATE_ORDER.indexOf(gate as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c = OBSIDIAN_GATE_ORDER.indexOf(currentGate as any);

    return g <= c;
  }

  return {
    nextGate,
    isGateUnlocked
  };
}