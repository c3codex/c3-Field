import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type MeasuresGatePlateRow = {
  slug: string;
  kind: string;
  pillar: string;

  display_title: string | null;
  display_subtitle: string | null;
  one_liner: string | null;

  gate_numeral: string | null;
  removal_item: string | null;

  plaque_md: string | null;

  gate_released: boolean;
  gate_utc: string | null;

  media_still_url: string | null;
  media_animated_url: string | null;
  media_passage_url: string | null;
};

export function useMeasuresGatePlate(gateSlug?: string | null) {
  const [row, setRow] = useState<MeasuresGatePlateRow | null>(null);
  const [loading, setLoading] = useState<boolean>(!!gateSlug);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gateSlug) {
      setRow(null);
      setLoading(false);
      setError(null);
      return;
    }

    const ac = new AbortController();

    async function run() {
      setLoading(true);
      setError(null);

      const q = supabase
        .from("v_measures_state_v2")
        .select(
          `
          slug,kind,pillar,
          display_title,display_subtitle,one_liner,
          gate_numeral,removal_item,
          plaque_md,
          gate_released,gate_utc,
          media_still_url,media_animated_url,media_passage_url
        `
        )
        .eq("kind", "gate")
        .eq("pillar", "obsidian")
        .eq("slug", gateSlug)
        .maybeSingle();

      // ✅ Safe attach AbortSignal if this supabase-js build supports it
      const maybeAbortSignal = (q as unknown as { abortSignal?: (s: AbortSignal) => unknown }).abortSignal;
      if (typeof maybeAbortSignal === "function") {
        maybeAbortSignal(ac.signal);
      }

      const { data, error } = await q;

      if (ac.signal.aborted) return;

      if (error) {
        setError(error.message);
        setRow(null);
        setLoading(false);
        return;
      }

      if (!data) {
        setError(`Gate not found: ${gateSlug}`);
        setRow(null);
        setLoading(false);
        return;
      }

      setRow(data as MeasuresGatePlateRow);
      setLoading(false);
    }

    run();
    return () => ac.abort();
  }, [gateSlug]);

  return { row, loading, error };
}
