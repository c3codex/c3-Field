import { supabase } from "@/integrations/supabase/client"

export type RuntimeMediaUrlInput = {
  publicUrl?: string | null
  bucketName?: string | null
  storagePath?: string | null
  storageProvider?: string | null
}

const R2_BUCKETS = new Set(["measures-media"])

function trimSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, "")
}

export function encodeObjectKey(objectKey: string) {
  return objectKey
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")
}

function r2PublicBaseUrl() {
  return import.meta.env.VITE_R2_PUBLIC_BASE_URL?.replace(/\/+$/g, "") ?? ""
}

export function isR2Media(input: RuntimeMediaUrlInput) {
  const provider = input.storageProvider?.toLowerCase() ?? null
  return provider === "cloudflare_r2" || Boolean(input.bucketName && R2_BUCKETS.has(input.bucketName))
}

export function resolveRuntimeMediaUrl(input?: RuntimeMediaUrlInput | null) {
  if (!input) return null
  if (input.publicUrl) return input.publicUrl

  const bucketName = input.bucketName
  const storagePath = input.storagePath
  if (!bucketName || !storagePath) return null

  if (isR2Media(input)) {
    const baseUrl = r2PublicBaseUrl()
    if (!baseUrl) return null
    return `${baseUrl}/${encodeObjectKey(trimSlashes(storagePath))}`
  }

  return supabase.storage.from(bucketName).getPublicUrl(storagePath).data.publicUrl
}
