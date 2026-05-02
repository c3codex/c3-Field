import { useEffect } from "react"
import Temple from "../measures_of_inanna/Temple"
import MeasuresRegistryRuntime from "../measures_registry/MeasuresRegistryRuntime"

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

function isMeasuresRegistryHost(hostname: string) {
  return hostname === "measuresregistry.com" || hostname === "www.measuresregistry.com"
}

function isMeasuresOfInannaHost(hostname: string) {
  return hostname === "measuresofinanna.com" || hostname === "www.measuresofinanna.com"
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

  useEffect(() => {
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

  if (mode === "inanna") {
    return <Temple />
  }

  return <MeasuresRegistryRuntime />
}
