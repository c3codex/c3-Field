// src/pillars/measures/data/useMeasuresMarbleIndex.ts
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type MeasuresMarbleIndexRow = {
  slug: string;
  display_title: string | null;
  display_subtitle: string | null;
  one_liner: string | null;

  me_released: boolean;
  me_utc: string | null;

  media_still_url: string | null;
  media_animated_url: string | null;
};

export function useMeasuresMarbleIndex() {
  const [rows, setRows] = useState<MeasuresMarbleIndexRow[]>([]);
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
          "slug,display_title,display_subtitle,one_liner,me_released,me_utc,media_still_url,media_animated_url"
        )
        .eq("kind", "me")
        .eq("pillar", "marble");

      if (!alive) return;

      if (error) {
        setError(error.message);
        setRows([]);
        setLoading(false);
        return;
      }

      setRows((data ?? []) as MeasuresMarbleIndexRow[]);
      setLoading(false);
    }

    run();
    return () => {
      alive = false;
    };
  }, []);

  const ordered = useMemo(() => {
    // Put codexstone first, then the rest alphabetical (minimal but sane)
    return [...rows].sort((a, b) => {
      if (a.slug === "codexstone-chamber") return -1;
      if (b.slug === "codexstone-chamber") return 1;
      return a.slug.localeCompare(b.slug);
    });
  }, [rows]);

  return { rows: ordered, loading, error };
}
