import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Claim = { analysis_id: string; content_item_id: string };

function simpleKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4)
    .slice(0, 50);
}

Deno.serve(async () => {
  // 1) env
  const supabaseUrl = Deno.env.get("PROJECT_URL");
  const serviceKey = Deno.env.get("SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceKey) {
    console.error("Missing env vars", { hasProjectUrl: !!supabaseUrl, hasServiceKey: !!serviceKey });
    return new Response(
      JSON.stringify({ ok: false, error: "Missing PROJECT_URL or SERVICE_ROLE_KEY" }),
      { status: 500 }
    );
  }

  // 2) client (THIS is what you were missing)
  const supabase = createClient(supabaseUrl, serviceKey);

  // 3) claim one job
  const { data: claimRows, error: claimErr } = await supabase.rpc("coherentai_claim_next_job");
  if (claimErr) {
    console.error("claimErr", claimErr);
    return new Response(JSON.stringify({ ok: false, error: claimErr.message }), { status: 500 });
  }

  const claim = (claimRows?.[0] as Claim | undefined);
  if (!claim) {
    return new Response(JSON.stringify({ ok: true, message: "No jobs." }), { status: 200 });
  }

  const { analysis_id, content_item_id } = claim;

  try {
    // 4) fetch content item
    const { data: item, error: itemErr } = await supabase
      .from("content_items")
      .select("id,title,url,slug,raw_json,published_at,created_at")
      .eq("id", content_item_id)
      .single();

    if (itemErr) throw new Error(itemErr.message);

    const title: string = item.title ?? "(untitled)";
    const url: string = item.url;

    // 5) v1 deterministic analysis
    const summary = `CoherentAI (v1) notes: This entry orients around "${title}".`;
    const rationaleMd =
      `**Source:** ${url}\n\n` +
      `**Method (v1):** Deterministic keyword-to-concept matching.\n\n` +
      `**Why it matters:** Coherence emerges from stable links between text, concepts, and canon.`;

const tokens = simpleKeywords(`${title} ${item.slug ?? ""}`);

// 6) optional concepts match (won't crash if table missing)
    let concept_slugs: string[] = [];
    const { data: concepts, error: cErr } = await supabase
      .from("concepts")
      .select("slug,name,description_md")
      .limit(500);

      type LibraryRow = {
  id: string;
  slug: string | null;
  title: string | null;
  source_url: string;
  published_at: string | null;
  created_at: string;
  analysis_status: string | null;
  coherence_score: number | null;
  summary: string | null;
  rationale_md: string | null;
  concept_slugs: string[] | null;
};
    if (!cErr && Array.isArray(concepts)) {
      const hits: string[] = [];
      for (const c of concepts) {
        const hay = `${c.slug} ${c.name ?? ""} ${c.description_md ?? ""}`.toLowerCase();
        if (tokens.some((t) => hay.includes(t))) hits.push(c.slug);
        if (hits.length >= 8) break;
      }
      concept_slugs = hits;
    }

    // 7) TODO: link to registry items later
    const related_registry_ids: string[] = [];

    // 8) write back
    const { error: updErr } = await supabase
      .from("content_analysis")
      .update({
        status: "complete",
        coherence_score: 0.55,
        summary,
        rationale_md: rationaleMd,
        concept_slugs,
        related_registry_ids,
        model_version: "coherentai-v1-deterministic",
        updated_at: new Date().toISOString(),
      })
      .eq("id", analysis_id);

    if (updErr) throw new Error(updErr.message);

    return new Response(JSON.stringify({ ok: true, analysis_id, content_item_id }), { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("analysis error", msg);

    await supabase
      .from("content_analysis")
      .update({
        status: "error",
        error: msg,
        updated_at: new Date().toISOString(),
      })
      .eq("id", analysis_id);

    return new Response(JSON.stringify({ ok: false, analysis_id, error: msg }), { status: 500 });
  }
});