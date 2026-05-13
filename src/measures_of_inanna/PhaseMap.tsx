import React from "react"

type PhaseMapNode = {
  registry_key: string
  label: string
  family: "gate" | "epithet" | "me"
  material: string
  node_state: "open" | "sealed" | "visible"
  is_interactive: boolean
}

type Props = {
  nodes: PhaseMapNode[]
  centerNode?: {
    registry_key: string
    label: string
  }
  routeViaRegistryKey?: string | null
  onNavigate: (
    registryKey: string,
    options?: { targetAfterPassage?: string | null },
  ) => void
}

const RING_RADIUS: Record<string, number> = {
  gate: 22,
  epithet: 36,
  me: 48,
}

function positionOnRing(index: number, total: number, radius: number) {
  const angle = (index / total) * Math.PI * 2

  return {
    x: 50 + Math.cos(angle) * radius,
    y: 50 + Math.sin(angle) * radius,
  }
}

export default function PhaseMap({ nodes, centerNode, routeViaRegistryKey, onNavigate }: Props) {
  if (!nodes || nodes.length === 0) {
    return <div className="phase-map-empty">Phase Map unavailable</div>
  }

  const grouped = {
    gate: nodes.filter((node) => node.family === "gate"),
    epithet: nodes.filter((node) => node.family === "epithet"),
    me: nodes.filter((node) => node.family === "me"),
  }

  const resolvedCenterNode =
    centerNode ?? {
      registry_key: "gate_1_crown_removed",
      label: "Universal First Encounter",
    }

  function navigateNode(node: PhaseMapNode) {
    if (routeViaRegistryKey && node.family === "gate") {
      onNavigate(routeViaRegistryKey, { targetAfterPassage: node.registry_key })
      return
    }

    onNavigate(node.registry_key)
  }

  return (
    <main className="phase-map-root">
      <button
        type="button"
        className="phase-map-center-node"
        onClick={() =>
          routeViaRegistryKey
            ? onNavigate(routeViaRegistryKey, {
                targetAfterPassage: resolvedCenterNode.registry_key,
              })
            : onNavigate(resolvedCenterNode.registry_key)
        }
      >
        {resolvedCenterNode.label}
      </button>

      {Object.entries(grouped).map(([family, group]) => {
        const radius = RING_RADIUS[family]

        return group.map((node, index) => {
          const position = positionOnRing(index, group.length, radius)

          return (
            <button
              key={node.registry_key}
              type="button"
              className="phase-map-node"
              style={{
                position: "absolute",
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              data-family={node.family}
              data-material={node.material}
              data-state={node.node_state}
              disabled={!node.is_interactive}
              onClick={() => {
                if (node.is_interactive) navigateNode(node)
              }}
            >
              <span className="node-label">{node.label}</span>
            </button>
          )
        })
      })}
    </main>
  )
}
