// Release and runtime admission are HELD by the governing OAR2.
// Local review uses a separate loopback harness; no query flag or client input opens this route.
export const onRequest: PagesFunction = async () => new Response(JSON.stringify({
  available: false, reviewOnly: false, message: "The Connect encounter is not available.",
}), {status: 423, headers: {"content-type": "application/json; charset=utf-8", "cache-control": "no-store"}})
