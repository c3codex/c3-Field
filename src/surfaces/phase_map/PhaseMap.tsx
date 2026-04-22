import { useMemo, useState } from "react"

export type PhaseMapNode = {
  registryKey: string
  displayTitle: string
  angleDeg: number
  band: number
  isReleased: boolean
  isInteractive: boolean
}

export type PhaseMapLegend = {
  enabled?: boolean
  items?: Array<{
    tone: string
    label: string
  }>
} | null

type PhaseMapProps = {
  nodes: PhaseMapNode[]
  legend?: PhaseMapLegend
  activeRegistryKey?: string | null
  onNodeAction?: (node: PhaseMapNode) => void
}

function getNodeRadius(band: number): number {
  if (band <= 1) return 10
  if (band === 2) return 9
  return 8
}

function getTone(node: PhaseMapNode, isActive: boolean, isHovered: boolean): string {
  if (isActive) return "fill-white stroke-white"
  if (isHovered) return node.isReleased ? "fill-stone-200 stroke-stone-100" : "fill-stone-500 stroke-stone-400"
  return node.isReleased ? "fill-stone-300 stroke-stone-200" : "fill-stone-700 stroke-stone-600"
}

function getLegendTone(tone: string): string {
  switch (tone) {
    case "released":
      return "bg-stone-300"
    case "held":
      return "bg-stone-600"
    case "active":
      return "bg-white"
    default:
      return "bg-stone-500"
  }
}

export default function PhaseMap({
  nodes,
  legend,
  activeRegistryKey,
  onNodeAction,
}: PhaseMapProps) {
  const [hoveredRegistryKey, setHoveredRegistryKey] = useState<string | null>(null)

  const center = 260
  const outerRadius = 190
  const bandDivisor = 3

  const positionedNodes = useMemo(() => {
    return nodes.map((node) => {
      const radius = outerRadius * (node.band / bandDivisor)
      const radians = (node.angleDeg * Math.PI) / 180
      const x = center + radius * Math.cos(radians)
      const y = center + radius * Math.sin(radians)

      return {
        ...node,
        x,
        y,
      }
    })
  }, [nodes])

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <svg
        viewBox="0 0 520 520"
        className="w-full max-w-[720px] h-auto"
        role="img"
        aria-label="Phase Map"
      >
        <circle cx={center} cy={center} r={outerRadius / 3} className="fill-none stroke-stone-700" />
        <circle cx={center} cy={center} r={(outerRadius / 3) * 2} className="fill-none stroke-stone-700" />
        <circle cx={center} cy={center} r={outerRadius} className="fill-none stroke-stone-700" />

        {positionedNodes.map((node) => {
          const isActive = activeRegistryKey === node.registryKey
          const isHovered = hoveredRegistryKey === node.registryKey
          const toneClass = getTone(node, isActive, isHovered)

          return (
            <g
              key={node.registryKey}
              onMouseEnter={() => setHoveredRegistryKey(node.registryKey)}
              onMouseLeave={() => setHoveredRegistryKey(null)}
              onClick={() => {
                if (node.isInteractive) onNodeAction?.(node)
              }}
              className={node.isInteractive ? "cursor-pointer" : "cursor-default"}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={getNodeRadius(node.band)}
                className={`${toneClass} transition-all duration-200`}
                opacity={node.isReleased ? 1 : 0.45}
                strokeWidth={isActive ? 2 : 1}
              />

              {(isHovered || isActive) && (
                <text
                  x={node.x + 12}
                  y={node.y + 4}
                  className="fill-stone-200 text-[12px]"
                >
                  {node.displayTitle}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {legend?.enabled && Array.isArray(legend.items) && legend.items.length > 0 ? (
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-stone-300">
          {legend.items.map((item, index) => (
            <div key={`${item.label}-${index}`} className="flex items-center gap-2">
              <span className={`inline-block h-3 w-3 rounded-full ${getLegendTone(item.tone)}`} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
