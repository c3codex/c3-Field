import { useEffect, useMemo, useState } from "react"
import type { CSSProperties, FormEvent } from "react"
import { supabase } from "@/integrations/supabase/client"
import { asString, mediaUrl } from "../registeredRuntimeUtils"
import type { SectionCopy } from "../registeredRuntimeUtils"
import type { EnvironmentalStandingReport } from "../registeredRuntimeUtils"
import type { LandingUnitRow, MediaRow, PublicationDispatchRow, PublicationRegistryRow } from "../registeredRuntimeTypes"
import RegisteredStructuralDrift from "../renderers/RegisteredStructuralDrift"

const LAPIS_CAMPAIGN_KEYS = ["agents_of_chaos_integrity_governance", "measures_registry_root_authority_v1"] as const
const STRUCTURAL_DRIFT_DISPATCHES_ROUTE = "/publication/structural_drift"

const LAPIS_MEDIA_ROLES = [
  "measures_registry_logo",
  "ai_isnt_broken_landing",
  "undrifted_fill",
  "agents_with_keys_cover",
  "fables_and_myths_cover",
  "questions_ungoverned_systems_cannot_answer",
  "questions_ungoverned_systems_cannot_answer_video",
  "structural_drift_cover",
  "structural_drift_cover_photo",
  "structural_drift_publication_cover",
  "publication_structural_drift_cover",
  "structural_drift_feature_image",
  "structural_drift_featured_image",
] as const

type LapisChamberRuntimeProps = {
  registryTokenStyle: CSSProperties
  activeSurface: "structural_drift_dispatches" | "publication_dispatch"
  undriftedLandingUnit: LandingUnitRow | null
  structuralDriftCopy: SectionCopy
  evalReport: EnvironmentalStandingReport | null
  renderSystemFooter: () => React.ReactNode
  onBeginEvaluation: () => void
  onContinueToAssessmentPackage: () => void
  onGoToEvalPassage: () => void
  onAboutMeasuresRegistry: () => void
  onOurStory: () => void
}

export default function LapisChamberRuntime({
  registryTokenStyle,
  activeSurface,
  undriftedLandingUnit,
  structuralDriftCopy,
  evalReport,
  renderSystemFooter,
  onBeginEvaluation,
  onContinueToAssessmentPackage,
  onGoToEvalPassage,
  onAboutMeasuresRegistry,
  onOurStory,
}: LapisChamberRuntimeProps) {
  const [mediaRows, setMediaRows] = useState<MediaRow[]>([])
  const [publicationRows, setPublicationRows] = useState<PublicationRegistryRow[]>([])
  const [publicationDispatchRows, setPublicationDispatchRows] = useState<PublicationDispatchRow[]>([])
  const [publicationEmail, setPublicationEmail] = useState("")
  const [publicationOrganization, setPublicationOrganization] = useState("")
  const [publicationSubmitting, setPublicationSubmitting] = useState(false)
  const [publicationStatus, setPublicationStatus] = useState<string | null>(null)
  const [publicationError, setPublicationError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadLapisData() {
      const [mediaResult, publicationResult, dispatchResult] = await Promise.all([
        supabase
          .from("measures_media_map")
          .select("media_role, storage_bucket, storage_path, mime_type, is_active, metadata")
          .in("campaign_key", [...LAPIS_CAMPAIGN_KEYS])
          .in("media_role", [...LAPIS_MEDIA_ROLES])
          .order("sort_order", { ascending: true }),
        supabase
          .from("measures_publication_registry")
          .select("publication_key, title, subtitle, publication_type, status, external_url, tone, metadata")
          .in("publication_key", ["structural_drift", "undrifted"])
          .eq("status", "published"),
        supabase
          .from("measures_publication_dispatch")
          .select("publication_key, dispatch_key, issue_number, title, dispatch_body, excerpt, seo_description, tags, primary_cta, secondary_cta, references, media_manifest, internal_route, article_url, external_url, status, published_at, metadata")
          .eq("publication_key", "undrifted")
          .eq("status", "published")
          .order("issue_number", { ascending: true }),
      ])

      if (cancelled) return
      if (!mediaResult.error) setMediaRows((mediaResult.data ?? []) as MediaRow[])
      if (!publicationResult.error) setPublicationRows((publicationResult.data ?? []) as PublicationRegistryRow[])
      if (!dispatchResult.error) setPublicationDispatchRows((dispatchResult.data ?? []) as PublicationDispatchRow[])
    }

    void loadLapisData()
    return () => { cancelled = true }
  }, [])

  const mediaMap = useMemo(
    () => new Map(
      mediaRows.filter((row) => row.is_active !== false).map((row) => [row.media_role, row]),
    ),
    [mediaRows],
  )

  const undriftedPublication = publicationRows.find((row) => row.publication_key === "undrifted") ?? null
  const structuralDriftPublication = publicationRows.find((row) => row.publication_key === "structural_drift") ?? null
  const structuralDriftDispatches = publicationDispatchRows.filter((row) => row.publication_key === "undrifted")
  const selectedDispatchKey = window.location.pathname.startsWith(`${STRUCTURAL_DRIFT_DISPATCHES_ROUTE}/`)
    ? window.location.pathname.slice(`${STRUCTURAL_DRIFT_DISPATCHES_ROUTE}/`.length)
    : null
  const selectedPublicationDispatch =
    structuralDriftDispatches.find((row) => row.dispatch_key === selectedDispatchKey) ??
    structuralDriftDispatches[0] ??
    null

  const registryLogoUrl = mediaUrl(mediaMap.get("measures_registry_logo"))
  const aiIsntBrokenLandingUrl = mediaUrl(mediaMap.get("ai_isnt_broken_landing"))
  const undriftedFillUrl = mediaUrl(mediaMap.get("undrifted_fill"))
  const agentsWithKeysCoverUrl = mediaUrl(mediaMap.get("agents_with_keys_cover"))
  const fablesAndMythsCoverUrl = mediaUrl(mediaMap.get("fables_and_myths_cover"))
  const questionsUngovernedSystemsVideoUrl = mediaUrl(mediaMap.get("questions_ungoverned_systems_cannot_answer_video"))
  const questionsUngovernedImageUrl = mediaUrl(mediaMap.get("questions_ungoverned_systems_cannot_answer"))

  async function submitPublicationSubscription(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPublicationStatus(null)
    setPublicationError(null)

    const email = publicationEmail.trim().toLowerCase()
    if (!email) {
      setPublicationError("Email is required.")
      return
    }

    setPublicationSubmitting(true)
    const { error } = await supabase.from("measures_publication_subscription_capture").insert({
      publication_key: undriftedPublication?.publication_key ?? "undrifted",
      dispatch_key: selectedPublicationDispatch?.dispatch_key ?? null,
      email,
      organization: publicationOrganization.trim() || null,
      capture_source: asString(selectedPublicationDispatch?.metadata?.capture_source) ?? "structural_drift_dispatch",
      metadata: {
        source: "publication_dispatch_renderer",
        internal_route: selectedPublicationDispatch?.internal_route ?? STRUCTURAL_DRIFT_DISPATCHES_ROUTE,
      },
    })
    setPublicationSubmitting(false)

    if (error) {
      setPublicationError("Subscription could not be recorded.")
      return
    }

    setPublicationEmail("")
    setPublicationOrganization("")
    setPublicationStatus("Registry dispatch subscription recorded.")
  }

  return (
    <RegisteredStructuralDrift
      registryTokenStyle={registryTokenStyle}
      variant={activeSurface === "publication_dispatch" ? "article" : "index"}
      routePath={window.location.pathname}
      structuralDriftCopy={structuralDriftCopy}
      publicationLandingUnit={undriftedLandingUnit}
      undriftedPublication={undriftedPublication}
      structuralDriftPublication={structuralDriftPublication}
      structuralDriftDispatches={structuralDriftDispatches}
      selectedPublicationDispatch={selectedPublicationDispatch}
      evalReport={evalReport}
      publicationEmail={publicationEmail}
      publicationOrganization={publicationOrganization}
      publicationSubmitting={publicationSubmitting}
      publicationStatus={publicationStatus}
      publicationError={publicationError}
      onBeginEvaluation={onBeginEvaluation}
      onContinueToAssessmentPackage={onContinueToAssessmentPackage}
      onGoToEvalPassage={onGoToEvalPassage}
      onAboutMeasuresRegistry={onAboutMeasuresRegistry}
      onOurStory={onOurStory}
      questionsUngovernedVideoUrl={questionsUngovernedSystemsVideoUrl}
      questionsUngovernedImageUrl={questionsUngovernedImageUrl}
      registryLogoUrl={registryLogoUrl}
      aiIsntBrokenLandingUrl={aiIsntBrokenLandingUrl}
      undriftedFillUrl={undriftedFillUrl}
      agentsWithKeysCoverUrl={agentsWithKeysCoverUrl}
      fablesAndMythsCoverUrl={fablesAndMythsCoverUrl}
      onPublicationEmailChange={setPublicationEmail}
      onPublicationOrganizationChange={setPublicationOrganization}
      onSubmitSubscription={submitPublicationSubscription}
      renderSystemFooter={renderSystemFooter}
    />
  )
}
