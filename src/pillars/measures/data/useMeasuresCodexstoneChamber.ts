// src/pillars/measures/data/useMeasuresCodexstoneChamber.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type MeasuresCodexstoneRow = {
  slug: string;
  kind: string;
  pillar: string;

  display_title: string | null;
  display_subtitle: string | null;
  one_liner: string | null;

  media_still_url: string | null;
  media_animated_url: string | null;

  registry_active: boolean;
  me_released: boolean;
  me_utc: string | null;
};

export function useMeasuresCodexstoneChamber() {
  const [row, setRow] = useState<MeasuresCodexstoneRow | null>(null);
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
          slug,kind,pillar,
          display_title,display_subtitle,one_liner,
          media_still_url,media_animated_url,
          registry_active,me_released,me_utc
        `
        )
        .eq("slug", "codexstone-chamber")
        .maybeSingle();

      if (!alive) return;

      if (error) {
        setError(error.message);
        setRow(null);
        setLoading(false);
        return;
      }

      if (!data) {
        setError("Missing codexstone-chamber row in v_measures_state.");
        setRow(null);
        setLoading(false);
        return;
      }

      setRow(data as MeasuresCodexstoneRow);
      setLoading(false);
    }

    run();
    return () => {
      alive = false;
    };
  }, []);

  return { row, loading, error };
}
