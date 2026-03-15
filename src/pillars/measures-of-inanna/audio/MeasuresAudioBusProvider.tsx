// src/pillars/measures/audio/MeasuresAudioBusProvider.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useLocation } from "react-router-dom";

export type BusContext = {
  unlock: () => void;
  setObsidianActive: (on: boolean) => void;
  duck: () => void;
  restore: () => void;
};

const Ctx = createContext<BusContext | null>(null);

const OBSIDIAN_VOL = 0.22;
const DUCK_VOL = 0.07;

function isObsidianRoute(pathname: string) {
  return pathname.startsWith("/measures/gates");
}

type Props = {
  children: React.ReactNode;
  obsidianSrc?: string | null;
};

export function MeasuresAudioBusProvider({
  children,
  obsidianSrc,
}: Props) {
  const { pathname } = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!obsidianSrc) {
      audioRef.current = null;
      return;
    }

    const a = new Audio(obsidianSrc);
    a.loop = true;
    a.preload = "auto";
    a.volume = 0;
    audioRef.current = a;

    return () => {
      a.pause();
      a.src = "";
      audioRef.current = null;
    };
  }, [obsidianSrc]);

  const unlock = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;

    const wasMuted = a.muted;
    const prevVol = a.volume;

    a.muted = true;
    a.volume = 0;

    a.play()
      .then(() => {
        a.pause();
        a.currentTime = 0;
      })
      .catch(() => {})
      .finally(() => {
        a.muted = wasMuted;
        a.volume = prevVol;
      });
  }, []);

  const setObsidianActive = useCallback((on: boolean) => {
    const a = audioRef.current;
    if (!a) return;

    if (on) {
      a.play().catch(() => {});
      a.volume = OBSIDIAN_VOL;
    } else {
      a.volume = 0;
      a.pause();
      a.currentTime = 0;
    }
  }, []);

  const duck = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = DUCK_VOL;
  }, []);

  const restore = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (isObsidianRoute(pathname)) a.volume = OBSIDIAN_VOL;
  }, [pathname]);

  useEffect(() => {
    setObsidianActive(isObsidianRoute(pathname));
  }, [pathname, setObsidianActive]);

  const value = useMemo<BusContext>(
    () => ({ unlock, setObsidianActive, duck, restore }),
    [unlock, setObsidianActive, duck, restore]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMeasuresAudioBus(): BusContext {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useMeasuresAudioBus must be inside MeasuresAudioBusProvider");
  }
  return ctx;
}