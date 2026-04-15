import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

type PhaseMapRow = {
  id: string
  map_key: string
  band: "axis" | "me" | "epithet" | "gate"
  angle_deg: number
  radius: number
  sort_order: number | null
  is_visible: boolean
  layout_metadata: Record<string, unknown> | null

  registry_id: string
  registry_key: string
  display_title: string
  registry_family: "spine" | "gate" | "epithet" | "me" | "chamber_directory"
  material_family: "obsidian" | "crystal" | "marble" | "lapis" | null
  sequence_order: number | null

  release_state: string | null
  access_state: string | null
  phase_label: string | null
}

type Props = {
  activeRegistryKey?: string | null
  onNodeAction?: (registryKey: string) => void
}

type PositionedNode = PhaseMapRow & {
  x: number
  y: number
  isInteractive: boolean
  isReleased: boolean
  isActive: boolean
  nodeRadius: number
}

function toRadians(deg: number) {
  return (deg * Math.PI) / 180
}

function getNodeRadius(band: PhaseMapRow["band"]) {
  switch (band) {
    case "axis":
      return 18
    case "me":
      return 8
    case "epithet":
      return 10
    case "gate":
      return 12
    default:
      return 8
  }
}

function getTone(node: PhaseMapRow) {
  if (node.band === "axis") {
    return {
      stroke: "rgba(250, 232, 186, 0.96)",
      fill: "rgba(255, 245, 220, 0.94)",
      glow: "rgba(250, 232, 186, 0.34)",
    }
  }

  if (node.registry_family === "gate") {
    return {
      stroke: "rgba(242, 214, 160, 0.95)",
      fill: "rgba(18, 18, 24, 0.94)",
      glow: "rgba(242, 214, 160, 0.28)",
    }
  }

  if (node.registry_family === "epithet") {
    if (node.material_family === "lapis") {
      return {
        stroke: "rgba(166, 210, 255, 0.95)",
        fill: "rgba(18, 26, 44, 0.92)",
        glow: "rgba(166, 210, 255, 0.24)",
      }
    }

    if (node.material_family === "crystal") {
      return {
        stroke: "rgba(235, 244, 255, 0.96)",
        fill: "rgba(34, 40, 52, 0.90)",
        glow: "rgba(235, 244, 255, 0.22)",
      }
    }

    return {
      stroke: "rgba(214, 220, 230, 0.94)",
      fill: "rgba(24, 24, 30, 0.92)",
      glow: "rgba(214, 220, 230, 0.20)",
    }
  }

  return {
    stroke: "rgba(245, 245, 238, 0.95)",
    fill: "rgba(92, 92, 98, 0.92)",
    glow: "rgba(245, 245, 238, 0.18)",
  }
}

function isReleased(releaseState: string | null) {
  return releaseState === "released" || releaseState === "open"
}

function isInteractive(accessState: string | null) {
  return accessState === "callable" || accessState === "encounterable"
}

export default function PhaseMap({
  activeRegistryKey,
  onNodeAction,
}: Props) {  const [rows, setRows] = useState<PhaseMapRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function load() {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("v_phase_map_nodes")
        .select("*")
        .order("sort_order", { ascending: true })

      if (!isMounted) return

      if (error) {
        setError(error.message)
        setRows([])
        setLoading(false)
        return
      }

      setRows((data ?? []) as PhaseMapRow[])
      setLoading(false)
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [])

  const width = 1200
  const height = 1200
  const cx = width / 2
  const cy = height / 2
  const scale = 420

  const nodes = useMemo<PositionedNode[]>(() => {
    return rows
      .filter((row) => row.is_visible)
      .map((row) => {
        const angleRad = toRadians(Number(row.angle_deg))
        const bandRadius = Number(row.radius) * scale

        return {
          ...row,
          x: cx + bandRadius * Math.cos(angleRad),
          y: cy + bandRadius * Math.sin(angleRad),
          isInteractive: isInteractive(row.access_state),
          isReleased: isReleased(row.release_state),
          isActive: row.registry_key === activeRegistryKey,
          nodeRadius: getNodeRadius(row.band),
        }
      })
  }, [rows, activeRegistryKey, cx, cy, scale])

  const hoveredNode =
    nodes.find((node) => node.registry_key === hoveredKey) ?? null

  const sameBandPaths = useMemo(() => {
    const byBand = new Map<string, PositionedNode[]>()

    for (const node of nodes.filter((n) => n.band !== "axis" && n.isReleased)) {
      const current = byBand.get(node.band) ?? []
      current.push(node)
      byBand.set(node.band, current)
    }

    const segments: Array<{ from: PositionedNode; to: PositionedNode }> = []

    for (const [, bandNodes] of byBand) {
      const ordered = [...bandNodes].sort(
        (a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999)
      )

      for (let i = 0; i < ordered.length - 1; i += 1) {
        segments.push({
          from: ordered[i],
          to: ordered[i + 1],
        })
      }
    }

    return segments
  }, [nodes])

  if (loading) {
    return (
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at center, rgba(30,36,52,0.62) 0%, rgba(8,12,22,0.94) 58%, rgba(2,4,10,1) 100%)",
          color: "rgba(245,247,250,0.92)",
        }}
      >
        Loading Phase Map...
      </section>
    )
  }

  if (error) {
    return (
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at center, rgba(30,36,52,0.62) 0%, rgba(8,12,22,0.94) 58%, rgba(2,4,10,1) 100%)",
          color: "rgba(255,220,220,0.94)",
          padding: 24,
          textAlign: "center",
        }}
      >
        Phase Map failed to load: {error}
      </section>
    )
  }

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background:
          "radial-gradient(circle at center, rgba(30,36,52,0.62) 0%, rgba(8,12,22,0.94) 58%, rgba(2,4,10,1) 100%)",
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: "min(92vw, 1100px)",
          height: "auto",
          display: "block",
        }}
      >
        <defs>
          <filter id="phase-map-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="phase-map-active" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g opacity={0.24}>
          {[0.35, 0.6, 0.85].map((radius) => (
            <circle
              key={radius}
              cx={cx}
              cy={cy}
              r={radius * scale}
              fill="none"
              stroke="rgba(240, 210, 145, 0.24)"
              strokeWidth="1.25"
            />
          ))}
        </g>

        <g opacity={0.14}>
          {nodes.map((node) => (
            <line
              key={`axis-line-${node.registry_key}`}
              x1={cx}
              y1={cy}
              x2={node.x}
              y2={node.y}
              stroke="rgba(240, 210, 145, 0.16)"
              strokeWidth="1"
            />
          ))}
        </g>

        <g opacity={0.68}>
          {sameBandPaths.map((segment, index) => (
            <line
              key={`segment-${index}`}
              x1={segment.from.x}
              y1={segment.from.y}
              x2={segment.to.x}
              y2={segment.to.y}
              stroke="rgba(242, 214, 160, 0.56)"
              strokeWidth="2"
            />
          ))}
        </g>

        {nodes.map((node) => {
          const tone = getTone(node)
          const opacity = node.isReleased ? 1 : 0.34
          const filter = node.isActive
            ? "url(#phase-map-active)"
            : "url(#phase-map-glow)"

          return (
            <g
              key={node.registry_key}
              onMouseEnter={() => setHoveredKey(node.registry_key)}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={() => {
                if (node.isInteractive) {
                  onNodeAction?.(node.registry_key)
                }
              }}
              style={{
                cursor: node.isInteractive ? "pointer" : "default",
              }}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={node.nodeRadius + 10}
                fill={tone.glow}
                opacity={node.isActive ? 0.85 : 0.32}
                filter={filter}
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={node.nodeRadius}
                fill={tone.fill}
                stroke={tone.stroke}
                strokeWidth={node.isActive ? 3 : 2}
                opacity={opacity}
              />
              {!node.isReleased ? (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.nodeRadius + 5}
                  fill="none"
                  stroke="rgba(235,235,245,0.22)"
                  strokeWidth="1.2"
                  strokeDasharray="2 4"
                />
              ) : null}
            </g>
          )
        })}
      </svg>

      {hoveredNode ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "5vh",
            transform: "translateX(-50%)",
            minWidth: 220,
            padding: "12px 16px",
            borderRadius: 16,
            background: "rgba(10, 14, 24, 0.78)",
            border: "1px solid rgba(245, 220, 170, 0.20)",
            backdropFilter: "blur(12px)",
            color: "rgba(245, 247, 250, 0.96)",
            boxShadow: "0 16px 50px rgba(0,0,0,0.30)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "1rem", fontWeight: 600 }}>
            {hoveredNode.display_title}
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: "0.88rem",
              opacity: 0.82,
              textTransform: "capitalize",
            }}
          >
            {hoveredNode.band}
            {hoveredNode.phase_label ? ` • ${hoveredNode.phase_label}` : ""}
          </div>
        </div>
      ) : null}
    </section>
  )
}






