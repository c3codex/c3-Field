import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type MeasuresEncounterDef = {
  encounter_slug: string;
  label: string;
  description: string | null;
  encounter_type: string;
  config: unknown;
};

type UseMeasuresEncounterOptions = {
  required?: boolean; // default true
};

export function useMeasuresEncounter(
  encounterSlug?: string | null,
  opts: UseMeasuresEncounterOptions = {}
) {
  const required = opts.required ?? true;

  const [encounter, setEncounter] = useState<MeasuresEncounterDef | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(encounterSlug));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function run() {
      // Missing slug
      if (!encounterSlug) {
        if (!alive) return;
        setEncounter(null);
        setLoading(false);
        setError(required ? "Missing encounter slug." : null);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("measures_encounter_def")
        .select("encounter_slug,label,description,encounter_type,config")
        .eq("encounter_slug", encounterSlug)
        .maybeSingle();

      if (!alive) return;

      // Supabase error
      if (error) {
        setEncounter(null);
        setLoading(false);
        setError(required ? error.message : null);
        return;
      }

      // Not found
      if (!data) {
        setEncounter(null);
        setLoading(false);
        setError(required ? `Encounter not found: ${encounterSlug}` : null);
        return;
      }

      setEncounter(data as MeasuresEncounterDef);
      setLoading(false);
    }

    run();
    return () => {
      alive = false;
    };
  }, [encounterSlug, required]);

  return { encounter, loading, error };
}