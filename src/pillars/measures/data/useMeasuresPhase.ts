import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type MeasuresPhaseState = {
  current_gate: string | null;
  current_epithet: string | null;
  current_me: string | null;
  next_item: string | null;
  days_until_next_event: number | null;
};

export function useMeasuresPhase() {
  const [state, setState] = useState<MeasuresPhaseState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("measures_current_state")
        .select("*")
        .maybeSingle();

      if (error) {
        console.error("Measures phase error:", error);
        setLoading(false);
        return;
      }

      setState(data);
      setLoading(false);
    }

    load();
  }, []);

  return { state, loading };
}