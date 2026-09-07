import {c1RuntimePackage} from "./c1RuntimePackage"

export type C1EnvironmentPackage = {
  encounterEnabled?: boolean
  available: boolean
  reviewOnly: boolean
  copy: { heroTitle: string; heroBody: string; structuralLine: string; missionTitle: string; missionBody: string; missionClosing: string; brandLine: string; encounterIntro: string; openPrompt: string; mediaTitle: string; consent: string; attestation: string; participationIntention: string; custodyNotice: string }
  assets: { emblem: {src: string; alt: string}; intro: {src: string; poster?: string; mobileSrc?: string} }
  initiatives: {key: string; label: string}[]
}

export function isLocalC1Review(dev: boolean, enabled: string | undefined, hostname: string) {
  return dev && enabled === "1" && ["127.0.0.1", "localhost", "[::1]"].includes(hostname)
}

const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value)
export function parseC1ReviewPackage(value: unknown): C1EnvironmentPackage {
  const unavailable = () => { throw new Error("The Connect encounter is not available.") }
  if (!record(value) || value.available !== true || value.reviewOnly !== true) return unavailable()
  const {copy, assets, initiatives} = value
  if (!record(copy) || !record(assets) || !Array.isArray(initiatives) || initiatives.length !== 0) return unavailable()
  const copyFields = ["heroTitle","heroBody","structuralLine","missionTitle","missionBody","missionClosing","brandLine","encounterIntro","openPrompt","mediaTitle","consent","attestation","participationIntention","custodyNotice"]
  if (copyFields.some(key => typeof copy[key] !== "string" || !(copy[key] as string).trim() || (copy[key] as string).length > 2000)) return unavailable()
  const {emblem, intro} = assets
  if (!record(emblem) || !record(intro) || emblem.src !== "/c1-review-media/emblem.png" ||
      typeof emblem.alt !== "string" || intro.src !== "/c1-review-media/intro.mp4" ||
      intro.mobileSrc !== "/c1-review-media/intro-vertical.mp4" || intro.poster !== "/c1-review-media/connect-vertical.jpg") return unavailable()
  return value as unknown as C1EnvironmentPackage
}

// No hardcoded standing fallback. A missing or held package must not render an encounter.
export async function loadC1EnvironmentPackage(): Promise<C1EnvironmentPackage> {
  if (!isLocalC1Review(import.meta.env.DEV, import.meta.env.VITE_C1_REVIEW, window.location.hostname)) {
    return c1RuntimePackage
  }
  const response = await fetch("/api/c3-community-connect-package", {cache: "no-store"})
  if (!response.ok) throw new Error("The Connect encounter is not available.")
  return parseC1ReviewPackage(await response.json())
}
