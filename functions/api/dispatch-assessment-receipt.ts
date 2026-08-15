import { deliverAssessmentReceipt, type AssessmentDeliveryEnv } from "./assessment-delivery-service"

type Env = AssessmentDeliveryEnv & {
  OPERATOR_DISPATCH_KEY?: string
}

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders,
  })
}

export const onRequestPost = async ({ request, env }: { request: Request, env: Env }) => {
  try {
    const operatorKey = request.headers.get("x-operator-dispatch-key")
    const isOperator = !!env.OPERATOR_DISPATCH_KEY && operatorKey === env.OPERATOR_DISPATCH_KEY
    if (!isOperator) {
      return jsonResponse({ error: "dispatch access denied" }, 403)
    }

    const { capture_id: captureId } = (await request.json().catch(() => ({}))) as {
      capture_id?: string
    }
    const result = await deliverAssessmentReceipt(env, captureId ?? "")
    return jsonResponse(result.body, result.status)
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "receipt dispatch failed" },
      500,
    )
  }
}

export const onRequest = async () =>
  jsonResponse({ error: "method not allowed" }, 405)
