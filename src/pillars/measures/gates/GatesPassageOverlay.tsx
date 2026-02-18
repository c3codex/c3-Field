import React, { useEffect, useRef } from "react";

export default function GatesPassageOverlay({
  src,
  onDone,
}: {
  src: string;
  onDone: () => void;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const done = () => onDone();
    v.addEventListener("ended", done);
    return () => v.removeEventListener("ended", done);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        playsInline
        preload="auto"
      >
        <source src={src} />
      </video>

      {/* optional skip */}
      <button
        className="absolute right-4 top-4 rounded-lg bg-black/50 px-3 py-2 text-sm text-white/90 hover:bg-black/70"
        onClick={onDone}
      >
        Skip
      </button>
    </div>
  );
}
