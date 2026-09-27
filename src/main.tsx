import React from "react"
import ReactDOM from "react-dom/client"
import App from "./app/App"
import { isC3FieldInitiativeHostCandidate, isC3FieldPersonalEnvironmentHost } from "./c3_field_connect/initiativeSurfaceHost"

async function loadSystemStyles() {
  const hostname = window.location.hostname
  const pathname = window.location.pathname.length > 1 ? window.location.pathname.replace(/\/$/, "") : "/"
  const c3Field = hostname === "c3field.online" || hostname === "www.c3field.online" || isC3FieldPersonalEnvironmentHost(hostname) || isC3FieldInitiativeHostCandidate(hostname) || import.meta.env.MODE === "c3field"
  const measuresRegistry = hostname === "measuresregistry.com" || hostname === "www.measuresregistry.com" || import.meta.env.MODE === "registry"

  if (c3Field && pathname !== "/c3ops") {
    await import("./c3_field_connect/c3FieldSystem.css")
    document.documentElement.dataset.system = "c3-field"
    return
  }

  if (measuresRegistry) {
    await import("./measures_registry/measuresRegistrySystem.css")
    document.documentElement.dataset.system = "measures-registry"
    return
  }

  // Measures of Inanna and remaining legacy/non-host-specific surfaces retain
  // the legacy stylesheet until their own bounded surface CSS entry is seated.
  await import("./index.css")
}

void loadSystemStyles().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})
