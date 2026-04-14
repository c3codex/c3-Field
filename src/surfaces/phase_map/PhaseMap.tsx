import { useMemo } from "react"
import { useReleasedProgression } from "@/systems/measures/useReleasedProgression"
import { useTempExhibitionMedia } from "@/systems/measures/use_temp_exhibition_media"
import { getSurfaceItems } from "@/systems/measures/group_by_surface"

function buildPublicMediaUrl(bucketName: string, storagePath: string) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

  if (!supabaseUrl) {
    throw new Error("VITE_SUPABASE_URL is required")
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${storagePath}`
}

function SectionCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "16px",
        padding: "1rem",
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <div
        style={{
          fontSize: "0.9rem",
          opacity: 0.7,
          marginBottom: "0.5rem",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {title}
      </div>
      <div>{children}</div>
    </div>
  )
}

export default function PhaseMap() {
  const progression = useReleasedProgression("gate_2_lapis_beads")
  const { groups } = useTempExhibitionMedia()

  const phaseMapItems = useMemo(
    () => getSurfaceItems(groups, "phase_map", "phase_map_main"),
    [groups]
  )

  const phaseMapImage = phaseMapItems.find((item) => item.media_type === "image")

  const imageUrl = phaseMapImage
    ? buildPublicMediaUrl(phaseMapImage.bucket_name, phaseMapImage.storage_path)
    : null

  return (
    <section
      style={{
        display: "grid",
        gap: "1rem",
      }}
    >
      {imageUrl ? (
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "18px",
            overflow: "hidden",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <img
            src={imageUrl}
            alt={phaseMapImage?.label ?? "Phase Map"}
            style={{
              display: "block",
              width: "100%",
              height: "auto",
            }}
          />
        </div>
      ) : null}

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        <SectionCard title="Current Gate Progression">
          {progression.releasedGateKeys.join(" → ")}
        </SectionCard>

        <SectionCard title="Resolve Surface">
          {progression.codexstoneAvailable
            ? "Codexstone available"
            : "No resolve surface"}
        </SectionCard>

        <SectionCard title="Next Movement">
          {progression.nextGateKey
            ? `Next Gate: ${progression.nextGateKey}`
            : progression.codexstoneAvailable
              ? "Resolve to Codexstone"
              : "Return via Harrumuk"}
        </SectionCard>

        <SectionCard title="Current Ritual Band">
          Spring Equinox
        </SectionCard>

        <SectionCard title="Next Release Window">
          Gate 3 — next new moon
        </SectionCard>
      </div>

      <div
        style={{
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "16px",
          padding: "1rem",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <div
          style={{
            fontSize: "0.9rem",
            opacity: 0.7,
            marginBottom: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          Released Surfaces
        </div>

        <div
          style={{
            display: "grid",
            gap: "0.75rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          <div>
            <strong>Gates</strong>
            <div>Gate 1</div>
            <div>Gate 2</div>
          </div>

          <div>
            <strong>Epithets</strong>
            <div>Primus Artus</div>
            <div>Gemynd Corpus</div>
            <div>Percipari</div>
          </div>

          <div>
            <strong>Resolve</strong>
            <div>Codexstone</div>
          </div>
        </div>
      </div>
    </section>
  )
}
