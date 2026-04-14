import React, { useMemo, useState } from "react"
import { useTempExhibitionMedia } from "@/systems/measures/use_temp_exhibition_media"
import { getSurfaceItems } from "@/systems/measures/group_by_surface"

type TempleViewState = "temple_home" | "temple_main"

function buildPublicMediaUrl(bucketName: string, storagePath: string) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

  if (!supabaseUrl) {
    throw new Error("VITE_SUPABASE_URL is required")
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${storagePath}`
}

export default function TempleMediaBridge() {
  const { groups, loading, error } = useTempExhibitionMedia()
  const [view, setView] = useState<TempleViewState>("temple_home")

  const homeItems = useMemo(
    () => getSurfaceItems(groups, "temple", "temple_home"),
    [groups]
  )

  const mainItems = useMemo(
    () => getSurfaceItems(groups, "temple", "temple_main"),
    [groups]
  )

  if (loading) {
    return <div>Loading temple media…</div>
  }

  if (error) {
    return <div>Temple media error: {error}</div>
  }

  if (view === "temple_home") {
    const home = homeItems[0]

    if (!home) {
      return <div>Temple home media not found.</div>
    }

    const imageUrl = buildPublicMediaUrl(home.bucket_name, home.storage_path)

    return (
      <div
        style={{
          position: "relative",
          width: "100%",
        }}
      >
        <img
          src={imageUrl}
          alt={home.label ?? "Temple Home"}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
          }}
        />

        <button
          type="button"
          aria-label="Enter temple encounter"
          onClick={() => setView("temple_main")}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "22%",
            height: "22%",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        />
      </div>
    )
  }

  return (
    <div
      style={{
        display: "grid",
        gap: "1rem",
        width: "100%",
      }}
    >
      {mainItems.map((item) => {
        const mediaUrl = buildPublicMediaUrl(item.bucket_name, item.storage_path)

        if (item.media_type === "video") {
          return (
            <video
              key={item.id}
              src={mediaUrl}
              muted autoPlay playsInline
              playsInline
              style={{
                display: "block",
                width: "100%",
                height: "auto",
              }}
            />
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

        return null
      })}
    </div>
  )
}

