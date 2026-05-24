import { useEffect } from "react"
import OarOperationsConsole from "../c3_field_convergence/OarOperationsConsole"
import Temple from "../measures_of_inanna/Temple"
import MeasuresRegistryRuntime from "../measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered"

const REGISTRY_METADATA = {
  title: "Measures Registry",
  description: "Integrity Governance for AI Systems",
  url: "https://measuresregistry.com",
  image: "https://measuresregistry.com/og.jpeg",
}

const INANNA_METADATA = {
  title: "Measures of Inanna",
  description: "A ceremonial exhibition of sacred measure & immutable memory.",
  url: "https://www.measuresofinanna.com",
  image: "https://www.measuresofinanna.com/og.png",
}

const C3_FIELD_METADATA = {
  title: "c3 Field",
  description: "c3 Field Convergence operations spine.",
  url: "https://c3field.online",
  image: "https://c3field.online/og.jpeg",
}

function isMeasuresRegistryHost(hostname: string) {
  return hostname === "measuresregistry.com" || hostname === "www.measuresregistry.com"
}

function isMeasuresOfInannaHost(hostname: string) {
  return hostname === "measuresofinanna.com" || hostname === "www.measuresofinanna.com"
}

function isC3FieldHost(hostname: string) {
  return hostname === "c3field.online" || hostname === "www.c3field.online"
}

function setMeta(selector: string, content: string) {
  const element = document.head.querySelector<HTMLMetaElement>(selector)
  if (element) element.content = content
}

function applyPageMetadata(metadata: typeof REGISTRY_METADATA) {
  document.title = metadata.title
  setMeta('meta[name="description"]', metadata.description)
  setMeta('meta[property="og:title"]', metadata.title)
  setMeta('meta[property="og:description"]', metadata.description)
  setMeta('meta[property="og:url"]', metadata.url)
  setMeta('meta[property="og:image"]', metadata.image)
  setMeta('meta[name="twitter:title"]', metadata.title)
  setMeta('meta[name="twitter:description"]', metadata.description)
  setMeta('meta[name="twitter:image"]', metadata.image)
}

export default function App() {
  const mode = import.meta.env.MODE
  const hostname = window.location.hostname
  const isRegistryHost = isMeasuresRegistryHost(hostname)
  const isInannaHost = isMeasuresOfInannaHost(hostname)
  const isC3Host = isC3FieldHost(hostname)

  useEffect(() => {
    if (isC3Host || mode === "c3field") {
      applyPageMetadata(C3_FIELD_METADATA)
      return
    }

    if (isInannaHost || mode === "inanna") {
      applyPageMetadata(INANNA_METADATA)
      return
    }

    applyPageMetadata(REGISTRY_METADATA)
  }, [isInannaHost, mode])

  if (isRegistryHost) {
    return <MeasuresRegistryRuntime />
  }

  if (isInannaHost) {
    return <Temple />
  }

  if (isC3Host || mode === "c3field") {
    return <OarOperationsConsole />
  }

  if (mode === "inanna") {
    return <Temple />
  }

  return <MeasuresRegistryRuntime />
}
