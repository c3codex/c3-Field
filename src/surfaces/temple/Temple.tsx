import Antechamber from "../antechamber/Antechamber";
import Obsidian from "../obsidian/Obsidian";
import Epigraph from "../epigraph/Epigraph";
import PhaseMap from "../phase_map/PhaseMap";

export default function Temple() {
  return (
    <main>
      <h1>Temple</h1>
      <p>Hold surface. No execution.</p>

      <section>
        <h2>Antechamber</h2>
        <Antechamber />
      </section>

      <section>
        <h2>Obsidian (Sealed)</h2>
        <Obsidian />
      </section>

      <section>
        <h2>Epigraph (Unavailable)</h2>
        <Epigraph />
      </section>

      <section>
        <h2>Phase Map (Unavailable)</h2>
        <PhaseMap />
      </section>
    </main>
  );
}