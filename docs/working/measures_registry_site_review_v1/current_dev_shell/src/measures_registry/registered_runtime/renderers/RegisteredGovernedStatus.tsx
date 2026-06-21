import type { GovernedStatusCopy } from "../registeredRuntimeUtils"

type Props = {
  status: GovernedStatusCopy | null
}

export default function RegisteredGovernedStatus({ status }: Props) {
  if (!status) return null

  return (
    <section
      className="registry-path-signal"
      data-governed-status={status.status}
      data-surface-role={status.surfaceRole}
      aria-label="Governed status"
    >
      {status.displayTitle ? <p>{status.displayTitle}</p> : null}
      {status.displayBody ? <p>{status.displayBody}</p> : null}
      {status.allowedNextStep ? <p>{status.allowedNextStep}</p> : null}
      <p>{status.activationBoundary}</p>
    </section>
  )
}
