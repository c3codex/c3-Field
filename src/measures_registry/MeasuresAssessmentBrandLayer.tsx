type MeasuresAssessmentBrandLayerProps = {
  registryMarkUrl: string | null
}

export function MeasuresAssessmentBrandLayer({ registryMarkUrl }: MeasuresAssessmentBrandLayerProps) {
  return (
    <div className="registry-assessment-brand-layer" aria-hidden="true">
      {registryMarkUrl ? <img src={registryMarkUrl} alt="" /> : null}
      <span>MEASURES REGISTRY</span>
      <small>Integrity Governance for AI Accelerated Systems</small>
    </div>
  )
}
