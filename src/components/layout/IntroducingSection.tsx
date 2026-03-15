import React, { useEffect, useMemo, useRef, useState } from "react";
import { SyndrosReturnGlyph } from "@/components/ui/SyndrosReturnGlyph";
import { PRICELESS_ASSETS } from "@pillars/priceless-gallery/pricelessAssets";

const INTRO_PAUSE_MS = 700;
const BOTTOM_EPS_PX = 6;

export default function PricelessIntroPage() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [paused, setPaused] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setPaused(false), INTRO_PAUSE_MS);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let raf = 0;

    const compute = () => {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        const { scrollTop, scrollHeight, clientHeight } = el;
        const bottom = scrollTop + clientHeight >= scrollHeight - BOTTOM_EPS_PX;
        setAtBottom(bottom);
      });
    };

    compute();
    el.addEventListener("scroll", compute, { passive: true });

    return () => {
      window.cancelAnimationFrame(raf);
      el.removeEventListener("scroll", compute);
    };
  }, [paused]);

  useEffect(() => {
    if (!paused && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [paused]);

  const navLinks = useMemo(
    () => [
      { label: "Gallery", href: "/gallery" },
      { label: "c3 DAO", href: "c3dao.eth.limo" },
      
    ],
    []
  );

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* BACKGROUND PILLARS */}
      <div className="absolute inset-0">
  <img
    src={PRICELESS_ASSETS.priceless.pillars}
    alt="Priceless Gallery Pillars"
    className="h-full w-full object-cover opacity-[0.92]"
    draggable={false}
  />
  <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/70" />
</div>

      {/* SYNDROS RETURN (right-center) */}
      <div className="pointer-events-auto fixed right-4 top-1/2 z-40 -translate-y-1/2">
        <SyndrosReturnGlyph />
      </div>

      {/* CONTENT OVERLAY */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1100px] px-4 md:px-8">
        <div className="flex w-full items-stretch py-10 md:py-14">
          <div
            ref={scrollRef}
            className={[
              "relative w-full rounded-3xl border border-white/10 bg-black/25 backdrop-blur-md",
              "shadow-[0_0_60px_rgba(0,0,0,0.45)]",
              "overflow-y-auto overscroll-contain",
              "max-h-[78vh] md:max-h-[80vh]",
              "scroll-smooth",
            ].join(" ")}
          >
            {/* PAUSE / LOAD VEIL */}
            <div
              className={[
                "pointer-events-none absolute inset-0 z-20 transition-opacity duration-500",
                paused ? "opacity-100" : "opacity-0",
              ].join(" ")}
            >
              <div className="absolute inset-0 bg-black/55" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-center">
                  <div className="font-sans text-[10px] tracking-[0.35em] uppercase text-stone-200/60">
                    Entering
                  </div>
                  <div className="mt-2 font-serif text-[16px] text-stone-100/90">
                    Priceless Gallery
                  </div>
                </div>
              </div>
            </div>

            {/* SCROLL CONTENT */}
            <div className="px-6 pb-24 pt-8 md:px-10 md:pt-10">
              <div className="font-sans text-[10px] tracking-[0.35em] uppercase text-stone-200/55">
                Introducing
              </div>

              <h1 className="mt-3 font-serif text-[28px] leading-tight text-stone-100 md:text-[38px]">
                Priceless Gallery
              </h1>

              {/* PLAQUES */}
              <div className="mt-10 space-y-8">
                {/* PLAQUE: Introducing Priceless Gallery */}
                <div className="rounded-2xl border border-white/10 bg-black/35 p-6 backdrop-blur-sm">
                  <h2 className="mt-1 font-serif text-[18px] leading-snug text-stone-100 md:text-[20px]">
                    Introducing Priceless Gallery
                  </h2>

                  <p className="mt-4 font-sans text-[14px] leading-relaxed text-stone-200/85">
                    <strong className="text-stone-100">Priceless Gallery</strong> is a cultural initiative
                    of the <strong className="text-stone-100">c3 DAO</strong>, designed to restore how
                    creative value circulates in the world.
                  </p>

                  <p className="mt-4 font-sans text-[14px] leading-relaxed text-stone-200/85">
                    It is not a marketplace.
                    <br />
                    It is not a brand of taste or speculation.
                  </p>

                  <p className="mt-4 font-sans text-[14px] leading-relaxed text-stone-200/85">
                    It is a system for encountering art freely, valuing it voluntarily, and translating
                    that value into shared, real-world infrastructure.
                  </p>

                  <p className="mt-4 font-sans text-[14px] leading-relaxed text-stone-200/85">
                    Priceless Gallery operates using the <strong className="text-stone-100">c3 model</strong>:
                    <br />
                    <strong className="text-stone-100">Connect · Contribute · Create</strong> — three linked
                    circuits that ensure creative sovereignty, transparent value flow, and tangible communal
                    benefit.
                  </p>
                </div>

                {/* PLAQUE: Connect */}
                <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-sm">
                  <h2 className="mt-1 font-serif text-[18px] leading-snug text-stone-100 md:text-[20px]">
                    Connect
                  </h2>
                  <p className="mt-2 font-sans text-[13px] leading-relaxed text-stone-200/80">
                    <strong className="text-stone-100">Encounter without coercion</strong>
                  </p>

                  <p className="mt-4 font-sans text-[14px] leading-relaxed text-stone-200/85">
                    The first responsibility of art is to be encountered.
                  </p>

                  <p className="mt-4 font-sans text-[14px] leading-relaxed text-stone-200/85">
                    In the <strong className="text-stone-100">Connect</strong> circuit, visitors experience
                    artworks, exhibitions, writings, and collections without price signals, paywalls, wallets,
                    or calls to action. There is nothing to buy, join, or unlock.
                  </p>

                  <p className="mt-4 font-sans text-[14px] leading-relaxed text-stone-200/85">
                    This circuit exists to restore orientation before valuation — allowing recognition,
                    resonance, and trust to form naturally.
                  </p>

                  <p className="mt-4 font-sans text-[14px] leading-relaxed text-stone-200/85">
                    No pricing.
                    <br />
                    No algorithms optimized for sales.
                    <br />
                    No extraction of attention or identity.
                  </p>

                  <p className="mt-4 font-sans text-[14px] leading-relaxed text-stone-200/85">Only encounter.</p>
                </div>

                {/* PLAQUE: Contribute */}
                <div className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-sm">
                  <h2 className="mt-1 font-serif text-[18px] leading-snug text-stone-100 md:text-[20px]">
                    Contribute
                  </h2>
                  <p className="mt-2 font-sans text-[13px] leading-relaxed text-stone-200/80">
                    <strong className="text-stone-100">Value enters by choice</strong>
                  </p>

                  <p className="mt-4 font-sans text-[14px] leading-relaxed text-stone-200/85">
                    When someone chooses to acquire a work, value enters the system through{" "}
                    <strong className="text-stone-100">voluntary contribution</strong>.
                  </p>

                  <p className="mt-4 font-sans text-[14px] leading-relaxed text-stone-200/85">
                    There are no listed prices and no suggested amounts.
                    <br />
                    The contributor chooses value at the moment of acquisition.
                  </p>

                  <p className="mt-4 font-sans text-[14px] leading-relaxed text-stone-200/85">
                    That contribution is automatically and transparently split:
                  </p>

                  <ul className="mt-5 space-y-2 font-sans text-[14px] leading-relaxed text-stone-200/80">
                    <li>• 33% to the artist or creator</li>
                    <li>• 33% to Priceless Gallery operations</li>
                    <li>• 33% to the shared commons treasury stewarded by the c3 DAO</li>
                  </ul>

                  <p className="mt-5 font-sans text-[14px] leading-relaxed text-stone-200/85">
                    This structure ensures fair compensation, operational sustainability, and collective
                    reinvestment — without speculation, negotiation, or pressure.
                  </p>
                </div>

                {/* PLAQUE: Create */}
                <div className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-sm">
                  <h2 className="mt-1 font-serif text-[18px] leading-snug text-stone-100 md:text-[20px]">
                    Create
                  </h2>
                  <p className="mt-2 font-sans text-[13px] leading-relaxed text-stone-200/80">
                    <strong className="text-stone-100">Commons value becomes structure</strong>
                  </p>

                  <p className="mt-4 font-sans text-[14px] leading-relaxed text-stone-200/85">
                    The final circuit translates accumulated commons value into{" "}
                    <strong className="text-stone-100">on-soil impact</strong>.
                  </p>

                  <p className="mt-4 font-sans text-[14px] leading-relaxed text-stone-200/85">
                    Funds stewarded by the c3 DAO are allocated toward shared infrastructure such as:
                  </p>

                  <ul className="mt-5 space-y-2 font-sans text-[14px] leading-relaxed text-stone-200/80">
                    <li>• Cultural and exhibition spaces</li>
                    <li>• Land and commons restoration</li>
                    <li>• Educational and healing environments</li>
                    <li>• Architectural, sound-based, or civic projects</li>
                  </ul>

                  <p className="mt-5 font-sans text-[14px] leading-relaxed text-stone-200/85">
                    The DAO does not curate art or influence creative direction.
                    <br />
                    Its role is stewardship, transparency, and continuity — ensuring that cultural value
                    becomes lived stability.
                  </p>
                </div>

                {/* PLAQUE: Why Priceless Gallery Matters */}
                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                  <h2 className="mt-1 font-serif text-[18px] leading-snug text-stone-100 md:text-[20px]">
                    Why Priceless Gallery Matters
                  </h2>

                  <p className="mt-4 font-sans text-[14px] leading-relaxed text-stone-200/85">
                    Priceless Gallery is the <strong className="text-stone-100">first full demonstration</strong>{" "}
                    of the c3 model in practice.
                  </p>

                  <p className="mt-4 font-sans text-[14px] leading-relaxed text-stone-200/85">It proves that:</p>

                  <ul className="mt-5 space-y-2 font-sans text-[14px] leading-relaxed text-stone-200/80">
                    <li>• Art can be encountered without commodification</li>
                    <li>• Value can flow without coercion</li>
                    <li>• Creative intelligence can fund shared conditions for life</li>
                  </ul>

                  <p className="mt-5 font-sans text-[14px] leading-relaxed text-stone-200/85">
                    Here, art is not reduced to a product.
                    <br />
                    And value is not abstracted into speculation.
                  </p>

                  <p className="mt-4 font-sans text-[14px] leading-relaxed text-stone-200/85">
                    Creative work is encountered freely, valued voluntarily, and converted into structures
                    that support future creation.
                  </p>
                </div>

                {/* End marker */}
                <div className="pt-2 text-center font-sans text-[11px] tracking-[0.3em] uppercase text-stone-200/35">
                  End of Introduction
                </div>
              </div>
            </div>

            {/* NAV FOOTER (hidden until end) */}
            <div
              className={[
                "sticky bottom-0 z-10 border-t border-white/10 bg-black/55 backdrop-blur-md",
                "transition-opacity duration-500",
                atBottom && !paused ? "opacity-100" : "opacity-0 pointer-events-none",
              ].join(" ")}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 md:px-10">
                <div className="font-sans text-[10px] tracking-[0.35em] uppercase text-stone-200/55">
                  Continue
                </div>

                <div className="flex flex-wrap gap-2">
                  {navLinks.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 font-sans text-[12px] text-stone-100/90 hover:bg-black/45"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Scroll hint (until bottom) */}
            {!paused && !atBottom && (
              <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2">
                <div className="rounded-full border border-white/10 bg-black/35 px-3 py-1 font-sans text-[11px] text-stone-200/70">
                  Scroll to continue
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
