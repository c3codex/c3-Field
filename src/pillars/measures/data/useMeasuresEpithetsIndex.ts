import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type MeasuresEpithetRow = {
  slug: string;
  display_title: string | null;
  display_subtitle: string | null;
  one_liner: string | null;
  epithet_utc: string | null;
  epithet_released: boolean | null;
};

export function useMeasuresEpithetsIndex() {
  const [rows, setRows] = useState<MeasuresEpithetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEpithets = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("v_measures_state")
      .select("slug,display_title,display_subtitle,one_liner,epithet_utc,epithet_released")
      .eq("kind", "epithet")
      .eq("pillar", "crystal")
      .eq("epithet_released", true); // hidden until release

    if (error) {
      setError(error.message);
      setRows([]);
      setLoading(false);
      return;
    }

    const typed = (data ?? []) as MeasuresEpithetRow[];
    typed.sort((a, b) => {
      const at = a.epithet_utc ? Date.parse(a.epithet_utc) : Number.POSITIVE_INFINITY;
      const bt = b.epithet_utc ? Date.parse(b.epithet_utc) : Number.POSITIVE_INFINITY;
      return at - bt;
    });

    setRows(typed);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEpithets();

    const channel = supabase
      .channel("measures-epithets-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "measures_phase_calendar" }, () => {
        fetchEpithets();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEpithets]);

  return { rows, loading, error, refetch: fetchEpithets };
}
