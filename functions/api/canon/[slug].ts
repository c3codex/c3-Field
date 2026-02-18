type Env = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

type Context = {
  request: Request;
  env: Env;
  params: { slug?: string };
};

export async function onRequest(context: Context) {
  const { request, env, params } = context;

  const slug = params.slug;
  const url = new URL(request.url);
  const format = (url.searchParams.get("format") || "md").toLowerCase();

  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  if (format !== "md" && format !== "pdf") {
    return new Response("Invalid format", { status: 400 });
  }

  const SUPABASE_URL = env.SUPABASE_URL;
  const SERVICE_ROLE = env.SUPABASE_SERVICE_ROLE_KEY;
  const BUCKET = "codex-vault";

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return new Response("Server misconfigured (missing env vars)", { status: 500 });
  }

  const canonRes = await fetch(
    `${SUPABASE_URL}/rest/v1/canon_artifact?slug=eq.${encodeURIComponent(slug)}&select=storage_path_md,storage_path_pdf`,
    {
      headers: {
        apikey: SERVICE_ROLE,
        Authorization: `Bearer ${SERVICE_ROLE}`,
      },
    }
  );

  if (!canonRes.ok) {
    return new Response("Not found", { status: 404 });
  }

  const rows = await canonRes.json();
  const row = rows?.[0];

  if (!row) {
    return new Response("Not found", { status: 404 });
  }

  const rawKey =
    format === "pdf" ? row.storage_path_pdf : row.storage_path_md;

  if (!rawKey) {
    return new Response("No file for format", { status: 404 });
  }

  const objectKey = rawKey.replace(/^\/+/, "");

  const signRes = await fetch(
    `${SUPABASE_URL}/storage/v1/object/sign/${BUCKET}/${encodeURI(objectKey)}`,
    {
      
      method: "POST",
      headers: {
        apikey: SERVICE_ROLE,
        Authorization: `Bearer ${SERVICE_ROLE}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ expiresIn: 600 }),
    }
  );

  if (!signRes.ok) {
    return new Response("Failed to sign", { status: 500 });
  }

  const signed = await signRes.json();
  const signedURL = signed?.signedURL;

  if (!signedURL) {
    return new Response("Failed to sign", { status: 500 });
  }

  const redirectTo = signedURL.startsWith("http")
    ? signedURL
    : `${SUPABASE_URL}${signedURL}`;

  return Response.redirect(redirectTo, 302);
}
