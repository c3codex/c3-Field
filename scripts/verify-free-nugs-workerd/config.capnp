using Workerd = import "/workerd/workerd.capnp";
const config :Workerd.Config = (
  services = [
    (name = "probe", worker = (
      modules = [(name = "worker.js", esModule = embed "probe.bundle.js")],
      compatibilityDate = "2024-01-01", globalOutbound = "registry"
    )),
    (name = "registry", worker = (
      modules = [(name = "registry.js", esModule = embed "registry.js")],
      compatibilityDate = "2024-01-01"
    ))
  ],
  sockets = [(name = "http", address = "127.0.0.1:4182", http = (), service = "probe")]
);
