import { useMemo } from "react"

export type ReleasedRouteStep =
  | "temple"
  | "harrumuk_to_phase_map"
  | "phase_map"
  | "gate_1"
  | "gate_2"
  | "kumurrah_to_epithet_1"
  | "epithet_1"
  | "epithet_2"
  | "epithet_3"
  | "kumurrah_to_codexstone"
  | "codexstone"
  | "harrumuk_to_antechamber"
  | "antechamber"

export type ReleasedRoute = {
  steps: ReleasedRouteStep[]
  currentIndex: number
  currentStep: ReleasedRouteStep
  nextStep: ReleasedRouteStep | null
  previousStep: ReleasedRouteStep | null
}

const RELEASED_ROUTE_STEPS: ReleasedRouteStep[] = [
  "temple",
  "harrumuk_to_phase_map",
  "phase_map",
  "gate_1",
  "gate_2",
  "kumurrah_to_epithet_1",
  "epithet_1",
  "epithet_2",
  "epithet_3",
  "kumurrah_to_codexstone",
  "codexstone",
  "harrumuk_to_antechamber",
  "antechamber",
]

export function useReleasedRoute(
  currentStep: ReleasedRouteStep
): ReleasedRoute {
  return useMemo(() => {
    const currentIndex = RELEASED_ROUTE_STEPS.indexOf(currentStep)

    const safeIndex = currentIndex >= 0 ? currentIndex : 0
    const resolvedCurrentStep = RELEASED_ROUTE_STEPS[safeIndex]

    const previousStep =
      safeIndex > 0 ? RELEASED_ROUTE_STEPS[safeIndex - 1] : null

    const nextStep =
      safeIndex < RELEASED_ROUTE_STEPS.length - 1
        ? RELEASED_ROUTE_STEPS[safeIndex + 1]
        : null

    return {
      steps: RELEASED_ROUTE_STEPS,
      currentIndex: safeIndex,
      currentStep: resolvedCurrentStep,
      nextStep,
      previousStep,
    }
  }, [currentStep])
}
