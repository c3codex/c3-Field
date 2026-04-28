import Temple from "../measures_of_inanna/Temple"
import MeasuresRegistryRuntime from "../measures_registry/MeasuresRegistryRuntime"

function isMeasuresRegistryHost(hostname: string) {
  return hostname === "www.measuresregistry.com" || hostname === "measuresregistry.com"
}

export default function App() {
  if (isMeasuresRegistryHost(window.location.hostname)) {
    return <MeasuresRegistryRuntime />
  }

  return <Temple />
}
