import PhaseMap from "../phase_map/PhaseMap";
import TempleFlowController from "./TempleFlowController";

export default function Temple() {
  return (
    <main className="measures-shell">
      <h1>Temple</h1>

      <section className="measures-panel">
        <h2>Temple Flow</h2>
        <TempleFlowController />
      </section>

      <section className="measures-panel">
        <h2>Phase Map</h2>
        <PhaseMap />
      </section>
    </main>
  );
}

