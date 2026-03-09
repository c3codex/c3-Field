import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type MeasuresGateIndexRow = {
  slug: string;
  gate_numeral: string | null;
  removal_item: string | null;

  media_still_url: string | null;
  media_animated_url: string | null;

  gate_released: boolean | null;
  gate_utc: string | null; // Supabase returns timestamptz as string
};

type State = {
  rows: MeasuresGateIndexRow[];
  loading: boolean;
  error: string | null;
};

function safeInt(s: string | null): number {
  if (!s) return 9999;
  const n = Number.parseInt(s.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : 9999;
}

export function useMeasuresGatesIndex(): State {
  const [rows, setRows] = useState<MeasuresGateIndexRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("v_measures_gates_index")
        .select(
          "slug,gate_numeral,removal_item,media_still_url,media_animated_url,gate_released,gate_utc"
        );

      if (!alive) return;

      if (error) {
        setError(error.message ?? String(error));
        setRows([]);
        setLoading(false);
        return;
      }

      setRows((data ?? []) as MeasuresGateIndexRow[]);
      setLoading(false);
    }

    run();

    return () => {
      alive = false;
    };
  }, []);

  // Sort in hook so UI stays clean:
  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      // 1) gate numeral asc (Gate I, II, III… or "1" style)
      const na = safeInt(a.gate_numeral);
      const nb = safeInt(b.gate_numeral);
      if (na !== nb) return na - nb;

      // 2) then release time (nulls last)
      const ta = a.gate_utc ? Date.parse(a.gate_utc) : Number.POSITIVE_INFINITY;
      const tb = b.gate_utc ? Date.parse(b.gate_utc) : Number.POSITIVE_INFINITY;
      if (ta !== tb) return ta - tb;

      // 3) stable fallback
      return a.slug.localeCompare(b.slug);
    });
    return copy;
  }, [rows]);

  return { rows: sorted, loading, error };
}

export default useMeasuresGatesIndex;