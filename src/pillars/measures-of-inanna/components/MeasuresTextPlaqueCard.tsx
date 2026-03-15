import React from "react";
import ReactMarkdown from "react-markdown";

type Props = {
  heading: string;
  bodyMd: string;
  tone?: "soft" | "mid" | "deep";
};

export default function MeasuresTextPlaqueCard({
  heading,
  bodyMd,
  tone = "mid",
}: Props) {
  const toneClass =
    tone === "soft"
      ? "bg-black/14"
      : tone === "deep"
      ? "bg-black/18"
      : "bg-black/16";

  return (
    <div className={`rounded-2xl border border-white/10 ${toneClass} p-6`}>
      <div className="font-sans text-[10px] uppercase tracking-[0.35em] text-stone-200/60">
        {heading}
      </div>

      <div className="mt-4 font-sans text-[13px] leading-relaxed text-stone-200/85">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <div className="mt-3 font-serif text-[18px] leading-snug text-stone-100">
                {children}
              </div>
            ),
            h2: ({ children }) => (
              <div className="mt-4 font-sans text-[11px] uppercase tracking-[0.32em] text-stone-100/90">
                {children}
              </div>
            ),
            h3: ({ children }) => (
              <div className="mt-4 font-sans text-[11px] uppercase tracking-[0.32em] text-stone-100/90">
                {children}
              </div>
            ),
            p: ({ children }) => <p className="mt-3">{children}</p>,
            strong: ({ children }) => (
              <strong className="font-serif text-[18px] leading-snug text-stone-100">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="text-stone-300/80 not-italic">{children}</em>
            ),
            br: () => <br />,
          }}
        >
          {bodyMd}
        </ReactMarkdown>
      </div>
    </div>
  );
}