import React from "react";

type Props = {
  /**
   * Optional: override default behavior (history.back()).
   * If provided, this runs instead.
   */
  onReturn?: () => void;

  /**
   * Optional: size in pixels of the glyph.
   */
  size?: number;

  /**
   * Optional: extra classes to match different heroes.
   */
  className?: string;
};

/**
 * Syndros Return Glyph (glyph-only seal)
 * Default behavior: window.history.back()
 */
export function SyndrosReturnGlyph({ onReturn, size = 18, className = "" }: Props) {
  return (
    <button
      type="button"
      aria-label="Return"
      onClick={() => (onReturn ? onReturn() : window.history.back())}
      className={[
        "rounded-full border border-white/15 bg-black/35 px-3 py-2 text-stone-100/90 backdrop-blur-md",
        "hover:bg-black/50 active:bg-black/55",
        "transition-colors",
        className,
      ].join(" ")}
      style={{ lineHeight: 0 }}
    >
      <SyndrosGlyph size={size} />
    </button>
  );
}

/**
 * Minimal glyph mark (inline SVG)
 * You can swap this SVG for your real Syndros glyph later.
 */
function SyndrosGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {/* ring */}
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" opacity="0.85" />
      {/* inner tri-knot-ish strokes (placeholder glyph language) */}
      <path
        d="M12 6.8 L15.2 12 L12 17.2 L8.8 12 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.9"
        strokeLinejoin="round"
      />
      <path
        d="M12 6.8 V17.2"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity="0.55"
        strokeLinecap="round"
      />
    </svg>
  );
}
