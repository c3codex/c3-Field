import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type MeasuresMediaUnit = {
  asset_family: string | null;
  artifact_type: string | null;
  artifact_number: number | null;
  manifest_slug: string;

  hero_video_url: string | null;
  hero_image_url: string | null;
  epigraph_video_url: string | null;
  epigraph_image_url: string | null;
  animated_video_url: string | null;
  animated_image_url: string | null;
  still_image_url: string | null;
  original_image_url: string | null;
  original_video_url: string | null;
  thumb_image_url: string | null;
  passage_video_url: string | null;
  passage_image_url: string | null;
  audio_url: string | null;
  document_url: string | null;

  primary_url: string | null;
  primary_kind: string | null;
  source_objects: string[] | null;
};

export function useMeasuresMediaUnit(manifestSlug?: string | null) {
  const [item, setItem] = useState<MeasuresMediaUnit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function run() {
      if (!manifestSlug) {
        if (!alive) return;
        setItem(null);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("measures_media_grouped_v")
        .select("*")
        .eq("manifest_slug", manifestSlug)
        .maybeSingle();

      if (!alive) return;

      if (error) {
        setItem(null);
        setError(error.message);
      } else {
        setItem((data as MeasuresMediaUnit | null) ?? null);
        setError(null);
      }

      setLoading(false);
    }

    void run();

    return () => {
      alive = false;
    };
  }, [manifestSlug]);

  return { item, loading, error };
}