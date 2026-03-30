import { useAntechamberStatus } from "../../shared/hooks/useAntechamberStatus";

export default function Antechamber() {
  const status = useAntechamberStatus();

  return (
    <section>
      <h3>Antechamber</h3>
      <p>First executable surface. Not yet active.</p>

      <ul>
        <li>SRC standing: {status.srcStanding}</li>
        <li>Envelope: {status.envelope}</li>
        <li>envKey: {status.envKey}</li>
        <li>OAR1: {status.oar1}</li>
        <li>Passage: {status.passage}</li>
      </ul>
    </section>
  );
}