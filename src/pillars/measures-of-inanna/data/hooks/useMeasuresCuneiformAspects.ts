import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type MeasuresCuneiformAspect = {
  id: string;
  manifest_slug: string;
  artifact_type: string | null;
  artifact_number: number | null;
  aspect_key: string;
  glyph: string;
  title: string;
  body_md: string;
  side: "left" | "right";
  top_position: string;
  display_order: number;
  source: string | null;
  visibility: "plate-only" | "gallery-item" | "book-only";
  is_active: boolean;
};

export function useMeasuresCuneiformAspects(
  manifestSlug?: string | null,
  visibility: "plate-only" | "gallery-item" | "book-only" | "all" = "all"
) {
  const [aspects, setAspects] = useState<MeasuresCuneiformAspect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function run() {
      if (!manifestSlug) {
        if (!alive) return;
        setAspects([]);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      let query = supabase
        .from("measures_cuneiform_aspect")
        .select(
          [
            "id",
            "manifest_slug",
            "artifact_type",
            "artifact_number",
            "aspect_key",
            "glyph",
            "title",
            "body_md",
            "side",
            "top_position",
            "display_order",
            "source",
            "visibility",
            "is_active",
          ].join(",")
        )
        .eq("manifest_slug", manifestSlug)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (visibility !== "all") {
        query = query.eq("visibility", visibility);
      }

      const { data, error } = await query;

      if (!alive) return;

      if (error) {
        setAspects([]);
        setError(error.message);
      } else {
        setAspects((data ?? []) as MeasuresCuneiformEdges[]);
        setError(null);
      }

      setLoading(false);
    }

    void run();

    return () => {
      alive = false;
    };
  }, [manifestSlug, visibility]);

  return { aspects, loading, error };
}