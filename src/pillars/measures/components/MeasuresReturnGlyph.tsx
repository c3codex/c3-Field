import { useNavigate } from "react-router-dom";
import { MEASURES_ASSETS } from "@/pillars/measures/measuresAssets";

type Props = {
  to?: string;
  ariaLabel?: string;
};

export default function MeasuresReturnGlyph({
  to = "MeasuresTempleHome",
  ariaLabel = "Return to Measures Temple Home",
}: Props) {
  const nav = useNavigate();

  return (
    <button
      aria-label={ariaLabel}
      onClick={() => nav(to)}
      className="group"
    >
      <img
        src={MEASURES_ASSETS.MeasuresReturnGlyph.jeweledSeal}
        alt=""
        draggable={false}
        className="h-10 w-10 opacity-80 transition group-hover:opacity-100"
      />
    </button>
  );
}
