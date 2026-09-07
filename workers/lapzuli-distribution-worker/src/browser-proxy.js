export async function proxyBrowserExecutor(request, env, path) {
  if (!env.BROWSER_EXECUTOR) {
    return json({
      ok: false,
      standing: "held_browser_executor_binding_missing",
      external_publication_effects: 0,
    }, 409);
  }

  const method = request.method;
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  const init = { method, headers };
  if (!['GET', 'HEAD'].includes(method)) init.body = await request.text();

  return env.BROWSER_EXECUTOR.fetch(new Request(`https://lapzuli-browser.internal${path}`, init));
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
