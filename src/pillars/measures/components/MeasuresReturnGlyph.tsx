import { useNavigate } from "react-router-dom";
import { useMeasuresReturnGlyph } from "../data/hooks/useMeasuresReturnGlyph";

type Props = {
  to?: string;
  ariaLabel?: string;
};

export default function MeasuresReturnGlyph({
  to = "/measures",
  ariaLabel = "Return to Measures Temple Home",
}: Props) {
  const nav = useNavigate();
  const { src, loading, error } = useMeasuresReturnGlyph();

  if (loading || error || !src) return null;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => nav(to)}
      className="group"
    >
      <img
        src={src}
        alt=""
        draggable={false}
        className="h-10 w-10 opacity-80 transition group-hover:opacity-100"
      />
    </button>
  );
}