import type { ResolvedAction } from "@/systems/measures/types"

type Props = {
  actions: ResolvedAction[]
  onAction?: (action: ResolvedAction) => void
}

export function ActionRail({ actions, onAction }: Props) {
  if (!actions.length) return null

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          disabled={action.blocked}
          onClick={() => onAction?.(action)}
          data-kind={action.kind}
          data-emphasis={action.emphasis}
          className="rounded-xl border px-4 py-2 disabled:opacity-50"
        >
          {action.label}
        </button>
      ))}
    </div>
  )
}
