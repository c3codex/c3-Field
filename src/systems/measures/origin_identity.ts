export type OriginKeyType = "session_key" | "envkey" | "c3_key"

export function getOriginIdentity(): {
  originKey: string
  originKeyType: OriginKeyType
} {
  const existing = window.localStorage.getItem("c3_origin_key")

  if (existing) {
    return {
      originKey: existing,
      originKeyType: "session_key",
    }
  }

  const created =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `session_${Date.now()}_${Math.random().toString(36).slice(2)}`

  window.localStorage.setItem("c3_origin_key", created)

  return {
    originKey: created,
    originKeyType: "session_key",
  }
}
