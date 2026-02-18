import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type MeasuresMERow = {
  slug: string;
  display_title: string | null;
  display_subtitle: string | null;
  one_liner: string | null;
  me_utc: string | null;
  me_released: boolean | null;
};

export function useMeasuresMEsIndex() {
  const [rows, setRows] = useState<MeasuresMERow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMEs = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("v_measures_state")
      .select("slug,display_title,display_subtitle,one_liner,me_utc,me_released")
      .eq("kind", "me")
      .eq("pillar", "marble");

    if (error) {
      setError(error.message);
      setRows([]);
      setLoading(false);
      return;
    }

    const typed = (data ?? []) as MeasuresMERow[];
    typed.sort((a, b) => {
      const at = a.me_utc ? Date.parse(a.me_utc) : Number.POSITIVE_INFINITY;
      const bt = b.me_utc ? Date.parse(b.me_utc) : Number.POSITIVE_INFINITY;
      return at - bt;
    });

    setRows(typed);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMEs();

    const channel = supabase
      .channel("measures-mes-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "measures_phase_calendar" }, () => {
        fetchMEs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMEs]);

  return { rows, loading, error, refetch: fetchMEs };
}
