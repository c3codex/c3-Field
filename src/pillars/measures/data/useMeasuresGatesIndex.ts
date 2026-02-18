// src/pillars/measures/data/useMeasuresGatesIndex.ts
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { MeasuresGateIndexRow } from "./types";

function gateOrder(n: MeasuresGateIndexRow["gate_numeral"]) {
  switch (n) {
    case "Ø":
      return 0;
    case "I":
      return 1;
    case "II":
      return 2;
    case "III":
      return 3;
    case "IV":
      return 4;
    case "V":
      return 5;
    case "VI":
      return 6;
    case "VII":
      return 7;
    default:
      return 99;
  }
}

export function useMeasuresGatesIndex() {
  const [rows, setRows] = useState<MeasuresGateIndexRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("v_measures_state")
        .select(
          `
          slug,
          gate_numeral,
          removal_item,
          gate_released,
          gate_utc,
          media_still_url,
          display_title,
          display_subtitle,
          one_liner
        `
        )
        .eq("kind", "gate")
        .eq("pillar", "obsidian")
        .not("gate_numeral", "is", null);

      if (!alive) return;

      if (error) {
        setError(error.message);
        setRows([]);
        setLoading(false);
        return;
      }

      // ✅ make TS happy without "any" and without lying
      setRows((data ?? []) as unknown as MeasuresGateIndexRow[]);
      setLoading(false);
    }

    run();
    return () => {
      alive = false;
    };
  }, []);

  const ordered = useMemo(() => {
    return [...rows].sort((a, b) => gateOrder(a.gate_numeral) - gateOrder(b.gate_numeral));
  }, [rows]);

  return { rows: ordered, loading, error };
}
