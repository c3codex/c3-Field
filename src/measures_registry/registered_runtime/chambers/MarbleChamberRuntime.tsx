import { useEffect, useState } from "react"
import type { CSSProperties } from "react"
import { supabase } from "@/integrations/supabase/client"
import type { MapC2CircuitRow } from "../registeredRuntimeTypes"
import type { AssessmentConditionTrace, EnvironmentalStandingReport } from "../registeredRuntimeUtils"
import MarbleCommerceDirectory from "../renderers/MarbleCommerceDirectory"

type MapPaymentReturnState = {
  mapOrderId: string
  verifying: boolean
  schedulingReleased: boolean
  error: string | null
}

type MarbleChamberRuntimeProps = {
  registryTokenStyle: CSSProperties
  evalReport: EnvironmentalStandingReport | null
  organizationName: string | null
  currentAiUsage: string | null
  conditionTraces: AssessmentConditionTrace[]
  environmentScore: number | null
  marbleAccentReferenceUrl: string | null
  contactEmail: string
  renderHeader: () => React.ReactNode
  renderSystemFooter: () => React.ReactNode
  onNavigateToMap: () => void
}

export default function MarbleChamberRuntime({
  registryTokenStyle,
  evalReport,
  organizationName,
  currentAiUsage,
  conditionTraces,
  environmentScore,
  marbleAccentReferenceUrl,
  contactEmail,
  renderHeader,
  renderSystemFooter,
  onNavigateToMap,
}: MarbleChamberRuntimeProps) {
  const [mapC2Circuit, setMapC2Circuit] = useState<MapC2CircuitRow[]>([])
  const [mapCheckoutLoading, setMapCheckoutLoading] = useState(false)
  const [mapCheckoutError, setMapCheckoutError] = useState<string | null>(null)
  const [mapPaymentReturn, setMapPaymentReturn] = useState<MapPaymentReturnState | null>(() => {
    const params = new URLSearchParams(window.location.search)
    const mapOrderId = params.get("map_order_id")
    const sessionId = params.get("session_id")
    if (mapOrderId && sessionId) {
      return { mapOrderId, verifying: true, schedulingReleased: false, error: null }
    }
    return null
  })

  useEffect(() => {
    let cancelled = false
    void supabase
      .from("map_c2_circuit")
      .select("map_circuit_key, map_pathway, evaluation_standing, applicable_standing_keys, product_name, amount_usd, currency, stripe_product_id, release_state, map_boundary, access_boundary, public_map_boundary, public_access_boundary, public_payment_boundary, deliverables")
      .eq("release_state", "active")
      .order("amount_usd", { ascending: true })
      .then(({ data, error }) => {
        if (!cancelled && !error) setMapC2Circuit((data ?? []) as MapC2CircuitRow[])
      })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!mapPaymentReturn?.verifying) return
    let cancelled = false

    void fetch(`/api/map/payment-status/${mapPaymentReturn.mapOrderId}`)
      .then((res) => res.json() as Promise<{ scheduling_released?: boolean; payment_status?: string; error?: string }>)
      .then((data) => {
        if (cancelled) return
        if (data.error) {
          setMapPaymentReturn((prev) => prev ? { ...prev, verifying: false, error: data.error ?? "Payment verification failed." } : null)
          return
        }
        setMapPaymentReturn((prev) =>
          prev ? { ...prev, verifying: false, schedulingReleased: data.scheduling_released === true, error: null } : null,
        )
        if (data.scheduling_released) {
          onNavigateToMap()
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMapPaymentReturn((prev) =>
            prev ? { ...prev, verifying: false, error: "Payment verification could not complete." } : null,
          )
        }
      })

    return () => { cancelled = true }
  }, [mapPaymentReturn?.verifying, mapPaymentReturn?.mapOrderId, onNavigateToMap])

  async function handleProceedToMapPayment(paymentOption: MapC2CircuitRow) {
    setMapCheckoutLoading(true)
    setMapCheckoutError(null)

    try {
      const origin = window.location.origin
      const successUrl = `${origin}/map-integrity-governance`
      const cancelUrl = `${origin}/map-integrity-governance`

      const response = await fetch("/api/map/create-checkout-session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          evaluation_result_id: evalReport?.standing_key ?? null,
          map_standing: evalReport?.standing_key ?? paymentOption.evaluation_standing,
          map_pathway: paymentOption.map_pathway,
          contact_email: contactEmail,
          success_url: successUrl,
          cancel_url: cancelUrl,
        }),
      })

      const data = (await response.json()) as { checkout_url?: string; error?: string }

      if (!response.ok || !data.checkout_url) {
        setMapCheckoutError(data.error ?? "Payment could not be initiated.")
        setMapCheckoutLoading(false)
        return
      }

      window.location.href = data.checkout_url
    } catch {
      setMapCheckoutError("Payment could not be initiated. Please try again.")
      setMapCheckoutLoading(false)
    }
  }

  return (
    <MarbleCommerceDirectory
      registryTokenStyle={registryTokenStyle}
      evalReport={evalReport}
      organizationName={organizationName}
      currentAiUsage={currentAiUsage}
      conditionTraces={conditionTraces}
      environmentScore={environmentScore}
      mapC2Circuit={mapC2Circuit}
      checkoutLoading={mapCheckoutLoading}
      checkoutError={mapCheckoutError}
      paymentReturn={mapPaymentReturn}
      marbleAccentReferenceUrl={marbleAccentReferenceUrl}
      renderHeader={renderHeader}
      renderSystemFooter={renderSystemFooter}
      onProceedToPayment={handleProceedToMapPayment}
    />
  )
}
