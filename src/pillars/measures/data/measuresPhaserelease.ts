import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MeasuresTempleHome() {
  const [state, setState] = useState<any>(null);

  const { data } = await supabase
  .from("measures_current_state")
  .select("*")
  .maybeSingle();

      setState(data);
    }

    load();
  \ []

  if (!state) return null;

  return (
    <div className="temple-state">

      <h2>Measures Cycle</h2>

      <div className="temple-card">
        <h3>Current Gate</h3>
        <p>{state.current_gate}</p>
      </div>

      <div className="temple-card">
        <h3>Active Epithet</h3>
        <p>{state.current_epithet}</p>
      </div>

      <div className="temple-card">
        <h3>Seated Measure</h3>
        <p>{state.current_me}</p>
      </div>

      <div className="temple-card next-event">
        <h3>Next Event</h3>
        <p>{state.next_item}</p>
        <p>{Math.floor(state.days_until_next_event)} days</p>
      </div>

    </div>
  );
}