import Temple from "../measures_of_inanna/Temple"
import MeasuresRegistryRuntime from "../measures_registry/MeasuresRegistryRuntime"

export default function App() {
  const mode = import.meta.env.MODE

  if (mode === "registry") {
    return <MeasuresRegistryRuntime />
  }

  if (mode === "inanna") {
    return <Temple />
  }

  return <MeasuresRegistryRuntime />
}