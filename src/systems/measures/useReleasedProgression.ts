import { useMemo } from "react"
import { useTempExhibitionMedia } from "@/systems/measures/use_temp_exhibition_media"

export type ReleasedProgression = {
  releasedGateKeys: string[]
  currentGateKey: string | null
  nextGateKey: string | null
  codexstoneAvailable: boolean
  shouldResolveToCodexstone: boolean
  shouldReturnViaHarrumuk: boolean
}

const RELEASED_GATE_KEYS = ["gate_1_crown_removed", "gate_2_lapis_beads"]
const RELEASED_GATE_MEDIA_KEYS = ["gate_01", "gate_02"]
const CODEXSTONE_AVAILABLE = true

export function useReleasedProgression(
  currentGateKey: string | null
): ReleasedProgression {
  const { groups } = useTempExhibitionMedia()

  return useMemo(() => {
    const availableGateMediaKeys = RELEASED_GATE_MEDIA_KEYS.filter(
      (mediaKey) => !!groups[`gate::${mediaKey}`]
    )

    const releasedGateKeys = RELEASED_GATE_KEYS.filter((_, index) => {
      return !!availableGateMediaKeys[index]
    })

    const currentIndex = currentGateKey
      ? releasedGateKeys.indexOf(currentGateKey)
      : -1

    const nextGateKey =
      currentIndex >= 0 && currentIndex < releasedGateKeys.length - 1
        ? releasedGateKeys[currentIndex + 1]
        : null

    const codexstoneAvailable = CODEXSTONE_AVAILABLE && !!groups["me::me_codexstone"]

    const shouldResolveToCodexstone =
      !nextGateKey && codexstoneAvailable

    const shouldReturnViaHarrumuk =
      !nextGateKey && !codexstoneAvailable

    return {
      releasedGateKeys,
      currentGateKey,
      nextGateKey,
      codexstoneAvailable,
      shouldResolveToCodexstone,
      shouldReturnViaHarrumuk,
    }
  }, [groups, currentGateKey])
}
