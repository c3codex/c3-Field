import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type MeasuresTextContent = {
  id: string;
  slug: string;
  manifest_slug: string;
  text_kind:
    | "epigraph"
    | "plaque"
    | "context"
    | "scroll"
    | "aspect"
    | "statement"
    | "structure"
    | "passage";
  title: string;
  display_label: string | null;
  artifact_type: string | null;
  artifact_number: number | null;
  body_md: string;
  storage_path: string | null;
  public_url: string | null;
  is_active: boolean;
};

export function useMeasuresTextContent(manifestSlug?: string | null) {
  const [items, setItems] = useState<MeasuresTextContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function run() {
      if (!manifestSlug) {
        if (!alive) return;
        setItems([]);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("measures_text_content")
        .select(
          [
            "id",
            "slug",
            "manifest_slug",
            "text_kind",
            "title",
            "display_label",
            "artifact_type",
            "artifact_number",
            "body_md",
            "storage_path",
            "public_url",
            "is_active",
          ].join(",")
        )
        .eq("manifest_slug", manifestSlug)
        .eq("is_active", true);

      if (!alive) return;

      if (error) {
        setItems([]);
        setError(error.message);
      } else {
        setItems((data ?? []) as unknown as MeasuresTextContent[]);
        setError(null);
      }

      setLoading(false);
    }

    void run();

    return () => {
      alive = false;
    };
  }, [manifestSlug]);

  return { items, loading, error };
}