type Env = Record<string, unknown>

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders })
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export const onRequestPost: PagesFunction<Env> = async ({ request }) => {
  const body = await request.json().catch(() => ({})) as Record<string, unknown>
  const name = clean(body.name)
  const email = clean(body.email).toLowerCase()
  const message = clean(body.message)

  if (name.length < 2 || !validEmail(email)) {
    return jsonResponse({
      standing: "held_invalid_candidate_signal",
      result_label: "Signal Held",
      message: "A name and valid email are required before candidate review can be received.",
      external_standing_created: false,
      mutation_count: 0,
    }, 400)
  }

  return jsonResponse({
    standing: "held_candidate_capture_adapter_missing",
    result_label: "Pending Current Review",
    message:
      "The candidate signal is valid, but no governed C1 Connect capture adapter is seated. Current review is required before any relational standing can be created.",
    source_registry_key: "c3_community_connect",
    capture_context: "c3_community_c1_connect_candidate",
    candidate_signal: {
      name_present: true,
      email_present: true,
      message_present: Boolean(message),
    },
    external_standing_created: false,
    mutation_count: 0,
  }, 409)
}

export const onRequest: PagesFunction<Env> = async () =>
  jsonResponse({ error: "method not allowed" }, 405)
