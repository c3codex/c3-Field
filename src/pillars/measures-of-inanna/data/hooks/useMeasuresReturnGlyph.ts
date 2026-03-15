import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type ReturnGlyphState = {
  src: string | null;
  loading: boolean;
  error: string | null;
};

export function useMeasuresReturnGlyph(): ReturnGlyphState {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("v_measures_media_resolved")
        .select("resolved_url")
        .eq("slug", "measures-return-glyph")
        .maybeSingle();

      if (!alive) return;

      if (error) {
        setError(error.message);
        setSrc(null);
      } else {
        setSrc(data?.resolved_url ?? null);
      }

      setLoading(false);
    }

    run();

    return () => {
      alive = false;
    };
  }, []);

  return { src, loading, error };
}