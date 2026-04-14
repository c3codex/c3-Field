import React, { useMemo, useRef } from "react"
import { useTempExhibitionMedia } from "@/systems/measures/use_temp_exhibition_media"
import { getSurfaceItems } from "@/systems/measures/group_by_surface"

type ChamberplateSurfaceProps = {
  surfaceType: "gate" | "epithet" | "me"
  surfaceKey: string
  title?: string
}

function buildPublicMediaUrl(bucketName: string, storagePath: string) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

  if (!supabaseUrl) {
    throw new Error("VITE_SUPABASE_URL is required")
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${storagePath}`
}

export default function ChamberplateSurface({
  surfaceType,
  surfaceKey,
  title,
}: ChamberplateSurfaceProps) {
  const { groups, loading, error } = useTempExhibitionMedia()
  const audioRefs = useRef<Record<number, HTMLAudioElement | null>>({})

  const items = useMemo(
    () => getSurfaceItems(groups, surfaceType, surfaceKey),
    [groups, surfaceType, surfaceKey]
  )

  function pauseAllAudio(exceptId?: number) {
    Object.entries(audioRefs.current).forEach(([id, audio]) => {
      if (!audio) return
      if (Number(id) !== exceptId) {
        audio.pause()
      }
    })
  }

  if (loading) {
    return <div>Loading chamberplate…</div>
  }

  if (error) {
    return <div>Chamberplate error: {error}</div>
  }

  if (items.length === 0) {
    return <div>No chamberplate media found for: {surfaceType} / {surfaceKey}</div>
  }

  return (
    <section
      data-surface-type={surfaceType}
      data-surface-key={surfaceKey}
      style={{
        display: "grid",
        gap: "1rem",
        width: "100%",
      }}
    >
      {title ? <h3>{title}</h3> : null}

      {items.map((item) => {
        const mediaUrl = buildPublicMediaUrl(item.bucket_name, item.storage_path)

        if (item.media_type === "video") {
          return (
            <video
              key={item.id}
              src={mediaUrl}
              muted autoPlay playsInline
              playsInline
              preload="metadata"
              style={{
                display: "block",
                width: "100%",
                height: "auto",
              }}
            />
          )
        }

        if (item.media_type === "audio") {
          return (
            <div
              key={item.id}
              style={{
                display: "grid",
                gap: "0.5rem",
                padding: "0.75rem",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "12px",
              }}
            >
              <div>{item.label ?? "Chamberplate Audio"}</div>
              <audio
                ref={(node) => {
                  audioRefs.current[item.id] = node
                }}
                src={mediaUrl}
                controls
                preload="metadata"
                onPlay={() => pauseAllAudio(item.id)}
                style={{ width: "100%" }}
              />
            </div>
          )
        }

        if (item.media_type === "image") {
          return (
            <img
              key={item.id}
              src={mediaUrl}
              alt={item.label ?? item.storage_path}
              style={{
                display: "block",
                width: "100%",
                height: "auto",
              }}
            />
          )
        }

        return (
          <div key={item.id}>
            Unsupported chamberplate media type: {item.media_type}
          </div>
        )
      })}
    </section>
  )
}

