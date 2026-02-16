// src/pillars/measures/components/GateStage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MeasuresReturnGlyph from "./MeasuresReturnGlyph";

type EnableMode = "all" | "gate1Only";

export type GateStageProps = {
  titleLine1: string;
  titleLine2?: string;
  hoverInvocation?: string;

  animatedSrc: string;
  stillSrc: string;

  indexCount: number;
  plateRouteBase: string; // e.g. "/measures/gates"

  autoRevealAfterMs?: number; // e.g. 9000
  enableMode?: EnableMode; // e.g. "gate1Only"

  /**
   * Optional: if you want to send update requests somewhere (Supabase later),
   * provide a handler. If omitted, we just store locally and show success.
   */
  onRequestGateUpdate?: (gateId: string, email: string) => Promise<void> | void;

  /**
   * Optional: If you want a "manual" alternative link (Paragraph, Substack, etc.)
   * Leave empty to hide.
   */
  updatesLinkLabel?: string;
  updatesLinkHref?: string;
};

type GateId = `gate${1 | 2 | 3 | 4 | 5 | 6 | 7}`;

const LOCAL_KEY = "measures_gate_update_requests_v1";

function loadLocalRequests(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
    return {};
  } catch {
    return {};
  }
}

function saveLocalRequest(gateId: string, email: string) {
  const db = loadLocalRequests();
  const list = Array.isArray(db[gateId]) ? db[gateId] : [];
  const normalized = email.trim().toLowerCase();
  if (!list.includes(normalized)) list.push(normalized);
  db[gateId] = list;
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(db));
  } catch {
    // ignore
  }
}

function isValidEmail(v: string) {
  const s = v.trim();
  if (!s) return false;
  // simple, practical email check
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export default function GateStage({
  titleLine1,
  titleLine2,
  hoverInvocation,

  animatedSrc,
  stillSrc,

  indexCount,
  plateRouteBase,

  autoRevealAfterMs = 9000,
  enableMode = "all",

  onRequestGateUpdate,
  updatesLinkLabel,
  updatesLinkHref,
}: GateStageProps) {
  const nav = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [settled, setSettled] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [active, setActive] = useState<GateId | null>(null);

  // sealed invitation modal state
  const [inviteGate, setInviteGate] = useState<GateId | null>(null);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const gates = useMemo(() => {
    const ids: GateId[] = [];
    const n = Math.max(1, Math.min(7, indexCount));
    for (let i = 1; i <= n; i++) ids.push(`gate${i}` as GateId);
    return ids;
  }, [indexCount]);

  useEffect(() => {
    const v = videoRef.current;
    if (v) v.playbackRate = 0.85;

    const t = window.setTimeout(() => {
      setSettled(true);
      setRevealed(true);
    }, autoRevealAfterMs);

    return () => window.clearTimeout(t);
  }, [autoRevealAfterMs]);

  // ESC to close invitation
  useEffect(() => {
    if (!inviteGate) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeInvite();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
     
  }, [inviteGate]);

  const isEnabled = (id: GateId) => {
    if (enableMode === "all") return true;
    return id === "gate1";
  };

  const openInvite = (id: GateId) => {
    setInviteGate(id);
    setSent(false);
    setErr(null);
    setSending(false);
  };

  const closeInvite = () => {
    setInviteGate(null);
    setSent(false);
    setErr(null);
    setSending(false);
  };

  const requestUpdates = async () => {
    if (!inviteGate) return;
    setErr(null);

    if (!isValidEmail(email)) {
      setErr("Enter a valid email.");
      return;
    }

    const gateId = inviteGate;
    const normalized = email.trim().toLowerCase();

    setSending(true);
    try {
      // Always store locally (so we never lose intent)
      saveLocalRequest(gateId, normalized);

      // Optional external handler (Supabase later)
      if (onRequestGateUpdate) {
        await onRequestGateUpdate(gateId, normalized);
      }

      setSent(true);
    } catch (e) {
      setErr("Couldn’t send right now, but your request was saved locally.");
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-obsidian">
      {/* sealed invitation modal */}
      {inviteGate ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center px-6"
          aria-modal="true"
          role="dialog"
        >
          {/* dim */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closeInvite}
            aria-hidden
          />

          {/* chamber panel */}
          <div className="relative w-full max-w-[720px] rounded-2xl border border-white/10 bg-black/50 backdrop-blur">
            <div className="px-6 py-6 sm:px-8 sm:py-7">
              <div className="text-[10px] tracking-[0.35em] uppercase text-stone-200/60 font-sans">
                sealed gate
              </div>

              <h2 className="mt-3 text-stone-100 font-serif text-[28px] leading-tight">
                {inviteGate.replace("gate", "Gate ")} is present, but not yet open.
              </h2>

              <p className="mt-3 text-stone-200/75 font-sans text-sm leading-relaxed">
                The descent unfolds in sequence. If you want a simple notification when this gate
                opens, leave a point of contact. No broadcasts. No noise.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email for gate opening"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-stone-100 placeholder:text-stone-200/35 outline-none focus:border-white/20"
                />
                <button
                  type="button"
                  onClick={requestUpdates}
                  disabled={sending}
                  className={[
                    "rounded-xl border px-4 py-3 font-sans text-[10px] tracking-[0.35em] uppercase transition",
                    "border-white/12 bg-black/10 text-stone-100",
                    sending ? "opacity-60 cursor-not-allowed" : "hover:border-white/20 hover:bg-black/20",
                  ].join(" ")}
                >
                  {sent ? "requested" : sending ? "sending…" : "request update"}
                </button>
              </div>

              {err ? (
                <div className="mt-3 text-stone-200/60 font-sans text-xs">
                  {err}
                </div>
              ) : null}

              {sent ? (
                <div className="mt-3 text-stone-200/70 font-sans text-xs">
                  Noted. You’ll only be contacted when this gate opens.
                </div>
              ) : null}

              {updatesLinkHref && updatesLinkLabel ? (
                <div className="mt-5">
                  <a
                    href={updatesLinkHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block rounded-full border border-white/10 bg-black/10 px-4 py-2
                               font-sans text-[10px] tracking-[0.35em] uppercase text-stone-200/70
                               transition hover:border-white/20 hover:text-stone-100"
                  >
                    {updatesLinkLabel}
                  </a>
                </div>
              ) : null}

              <div className="mt-6">
                <button
                  type="button"
                  onClick={closeInvite}
                  className="rounded-full border border-white/10 bg-black/10 px-4 py-2
                             font-sans text-[10px] tracking-[0.35em] uppercase text-stone-200/70
                             transition hover:border-white/20 hover:text-stone-100"
                >
                  close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* top bar */}
      <div className="relative z-30 px-6 pt-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <MeasuresReturnGlyph />
          <div className="text-right">
            <div className="font-sans text-[10px] tracking-[0.35em] uppercase text-stone-200/60">
              {titleLine1}
            </div>
            {titleLine2 ? (
              <div className="mt-1 font-sans text-[10px] tracking-[0.30em] uppercase text-stone-200/40">
                {titleLine2}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* stage */}
      <div className="relative z-10 mt-6 px-6 pb-14">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20">
            <div className="relative aspect-square w-full">
              {/* animated */}
              <video
                ref={videoRef}
                className={[
                  "absolute inset-0 h-full w-full object-contain",
                  "transition-opacity duration-700",
                  settled ? "opacity-0" : "opacity-100",
                ].join(" ")}
                autoPlay
                muted
                playsInline
                preload="auto"
                loop={false}
              >
                <source src={animatedSrc} type="video/mp4" />
              </video>

              {/* still */}
              <img
                src={stillSrc}
                alt=""
                className={[
                  "absolute inset-0 h-full w-full object-contain",
                  "transition-opacity duration-700",
                  settled ? "opacity-100" : "opacity-0",
                ].join(" ")}
                draggable={false}
              />

              {/* vignette */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.00),rgba(0,0,0,0.60)_70%,rgba(0,0,0,0.90)_100%)]" />

              {/* hover invocation */}
              {hoverInvocation ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-5 text-center">
                  <span
                    className="rounded-full border border-white/10 bg-black/25 px-4 py-2 backdrop-blur
                               font-sans text-[10px] tracking-[0.32em] uppercase text-stone-200/55"
                  >
                    {hoverInvocation}
                  </span>
                </div>
              ) : null}
            </div>

            {/* index reveal */}
            <div className="px-6 py-10 md:px-10">
              {!revealed ? (
                <div className="font-sans text-[10px] tracking-[0.35em] uppercase text-stone-200/35">
                  settling…
                </div>
              ) : (
                <>
                  <div className="font-sans text-[10px] tracking-[0.35em] uppercase text-stone-200/55">
                    index
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {gates.map((id) => {
                      const enabled = isEnabled(id);

                      return (
                        <button
                          key={id}
                          type="button"
                          aria-disabled={!enabled}
                          onMouseEnter={() => setActive(id)}
                          onMouseLeave={() => setActive(null)}
                          onFocus={() => setActive(id)}
                          onBlur={() => setActive(null)}
                          onClick={() => {
                            if (enabled) {
                              nav(`${plateRouteBase}/${id}`);
                            } else {
                              openInvite(id);
                            }
                          }}
                          className={[
                            "relative rounded-xl border bg-black/10 px-4 py-4 text-left transition",
                            enabled
                              ? "border-white/10 hover:border-white/20"
                              : "border-white/5 opacity-70 hover:border-white/10",
                          ].join(" ")}
                        >
                          <div className="font-sans text-[10px] tracking-[0.35em] uppercase text-stone-200/75">
                            {id.replace("gate", "gate ")}
                          </div>
                          <div className="mt-2 font-sans text-[10px] tracking-[0.30em] uppercase text-stone-200/40">
                            {enabled ? "open" : "sealed"}
                          </div>

                          {active === id && enabled ? (
                            <div className="pointer-events-none absolute inset-0 rounded-xl shadow-[0_0_50px_rgba(255,255,255,0.10)]" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* back to temple */}
          <div className="mt-8">
            <button
              type="button"
              onClick={() => nav("/measures")}
              className="rounded-full border border-white/12 bg-black/10 px-6 py-3
                         font-sans text-[10px] tracking-[0.35em] uppercase text-stone-200/70
                         transition hover:border-white/20 hover:text-stone-100"
            >
              return to temple
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
