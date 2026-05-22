type MeasuresAssessmentBrandLayerProps = {
  registryMarkUrl: string | null
  registryWatermarkUrl: string | null
}

export function MeasuresAssessmentBrandLayer({ registryMarkUrl, registryWatermarkUrl }: MeasuresAssessmentBrandLayerProps) {
  return (
    <div className="registry-assessment-brand-layer" aria-hidden="true">
      {registryWatermarkUrl ? <img className="registry-assessment-watermark" src={registryWatermarkUrl} alt="" /> : null}
      {registryMarkUrl ? <img src={registryMarkUrl} alt="" /> : null}
      <span>MEASURES REGISTRY</span>
      <small>Integrity Governance for AI Accelerated Systems</small>
    </div>
  )
}
