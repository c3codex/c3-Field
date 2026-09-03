import { DurableObject } from "cloudflare:workers";
import puppeteer from "@cloudflare/puppeteer";

const MEDIUM_IMPORT_URL = "https://medium.com/p/import";
const MEDIUM_DRAFTS_URL = "https://medium.com/me/stories/drafts";
const MEDIUM_SIGNIN_URL = "https://medium.com/m/signin";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      const state = await readMediumState(env);
      return json({
        service: "lapzuli-browser-executor",
        status: "operative",
        worker_identity: env.DIZZY_BROWSER_IDENTITY || "dizzy_lapzuli_browser_executor_v1",
        browser_binding_present: Boolean(env.BROWSER),
        state_binding_present: Boolean(env.BROWSER_STATE),
        medium_session_persisted: Boolean(state.cookies?.length),
        medium_bootstrap_pending: Boolean(state.bootstrap?.session_id),
        external_publication_effects: 0,
      });
    }

    if (url.pathname === "/medium/bootstrap/start") {
      if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
      return startMediumBootstrap(env);
    }

    if (url.pathname === "/medium/bootstrap/complete") {
      if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
      return completeMediumBootstrap(env);
    }

    if (url.pathname === "/medium/session-proof") {
      if (request.method !== "GET") return json({ ok: false, error: "method_not_allowed" }, 405);
      return proveMediumSession(env);
    }

    if (url.pathname === "/medium/import") {
      if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
      return runMediumImport(request, env);
    }

    return json({ ok: false, error: "not_found", external_publication_effects: 0 }, 404);
  },
};

export class BrowserState extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx = ctx;
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/state" && request.method === "GET") {
      const [cookies, bootstrap] = await Promise.all([
        this.ctx.storage.get("medium:cookies"),
        this.ctx.storage.get("medium:bootstrap"),
      ]);
      return json({ cookies: cookies || [], bootstrap: bootstrap || null });
    }

    if (url.pathname === "/cookies" && request.method === "PUT") {
      const body = await request.json().catch(() => ({}));
      const cookies = Array.isArray(body.cookies) ? body.cookies : [];
      await this.ctx.storage.put("medium:cookies", cookies);
      return json({ ok: true, count: cookies.length });
    }

    if (url.pathname === "/bootstrap" && request.method === "PUT") {
      const body = await request.json().catch(() => ({}));
      await this.ctx.storage.put("medium:bootstrap", body);
      return json({ ok: true });
    }

    if (url.pathname === "/bootstrap" && request.method === "DELETE") {
      await this.ctx.storage.delete("medium:bootstrap");
      return json({ ok: true });
    }

    return json({ ok: false, error: "state_route_not_found" }, 404);
  }
}

function mediumStateStub(env) {
  const id = env.BROWSER_STATE.idFromName("medium-unDrifted");
  return env.BROWSER_STATE.get(id);
}

async function readMediumState(env) {
  if (!env.BROWSER_STATE) return { cookies: [], bootstrap: null };
  const response = await mediumStateStub(env).fetch("https://state/state");
  if (!response.ok) return { cookies: [], bootstrap: null };
  return response.json();
}

async function storeMediumCookies(env, cookies) {
  return mediumStateStub(env).fetch("https://state/cookies", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ cookies }),
  });
}

async function storeBootstrap(env, bootstrap) {
  return mediumStateStub(env).fetch("https://state/bootstrap", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(bootstrap),
  });
}

async function clearBootstrap(env) {
  return mediumStateStub(env).fetch("https://state/bootstrap", { method: "DELETE" });
}

async function startMediumBootstrap(env) {
  if (!env.BROWSER) return held("held_browser_binding_missing", 409);
  if (!env.BROWSER_STATE) return held("held_browser_state_binding_missing", 409);

  const browser = await puppeteer.launch(env.BROWSER, { keep_alive: 600000 });
  try {
    const page = await browser.newPage();
    await page.goto(MEDIUM_SIGNIN_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
    const cdp = await page.createCDPSession();
    const { devtoolsFrontendUrl } = await cdp.send("Cloudflare.getLiveView", {
      mode: "tab",
      expiresInMs: 600000,
    });
    const sessionId = browser.sessionId();

    await storeBootstrap(env, {
      session_id: sessionId,
      live_view_url: devtoolsFrontendUrl,
      started_at: new Date().toISOString(),
      account_identity: env.MEDIUM_ACCOUNT_IDENTITY || "unDrifted",
    });

    browser.disconnect();
    return json({
      ok: true,
      standing: "medium_login_handoff_ready",
      session_id: sessionId,
      live_view_url: devtoolsFrontendUrl,
      instructions: "Open the Live View URL, sign in to the unDrifted Medium account, then complete the bootstrap.",
      external_publication_effects: 0,
    });
  } catch (error) {
    try { await browser.close(); } catch {}
    return exception("held_medium_bootstrap_exception", error);
  }
}

async function completeMediumBootstrap(env) {
  const state = await readMediumState(env);
  const sessionId = clean(state.bootstrap?.session_id);
  if (!sessionId) return held("held_medium_bootstrap_not_started", 409);

  let browser;
  try {
    browser = await puppeteer.connect(env.BROWSER, sessionId);
    const pages = await browser.pages();
    const page = pages[pages.length - 1] || await browser.newPage();
    await page.goto(MEDIUM_DRAFTS_URL, { waitUntil: "domcontentloaded", timeout: 30000 });

    if (isSignInUrl(page.url())) {
      browser.disconnect();
      return held("held_medium_login_not_completed", 409);
    }

    const cookies = await page.cookies();
    if (!cookies.length) {
      browser.disconnect();
      return held("held_medium_session_capture_empty", 409);
    }

    await storeMediumCookies(env, cookies);
    await clearBootstrap(env);
    await browser.close();

    return json({
      ok: true,
      standing: "medium_session_persisted",
      account_identity: env.MEDIUM_ACCOUNT_IDENTITY || "unDrifted",
      cookie_count: cookies.length,
      external_publication_effects: 0,
    });
  } catch (error) {
    try { if (browser) browser.disconnect(); } catch {}
    return exception("held_medium_bootstrap_complete_exception", error);
  }
}

async function proveMediumSession(env) {
  if (!env.BROWSER) return held("held_browser_binding_missing", 409);
  const state = await readMediumState(env);
  const cookies = Array.isArray(state.cookies) ? state.cookies : [];
  if (!cookies.length) return held("held_medium_session_missing", 409);

  const browser = await puppeteer.launch(env.BROWSER, { keep_alive: 120000 });
  try {
    const page = await browser.newPage();
    await page.setCookie(...cookies);
    await page.goto(MEDIUM_DRAFTS_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
    const loggedIn = !isSignInUrl(page.url());
    return json({
      ok: loggedIn,
      standing: loggedIn ? "medium_session_proven" : "held_medium_session_invalid",
      account_identity: env.MEDIUM_ACCOUNT_IDENTITY || "unDrifted",
      current_url: page.url(),
      external_publication_effects: 0,
    }, loggedIn ? 200 : 409);
  } finally {
    await browser.close();
  }
}

async function runMediumImport(request, env) {
  const body = await request.json().catch(() => ({}));
  const validation = validateMediumRequest(body);
  if (!validation.ok) {
    return json({
      ok: false,
      standing: "held_medium_request_invalid",
      missing: validation.missing,
      external_publication_effects: 0,
    }, 422);
  }

  if (!env.BROWSER) return held("held_browser_binding_missing", 409);
  const state = await readMediumState(env);
  const cookies = Array.isArray(state.cookies) ? state.cookies : [];
  if (!cookies.length) return held("held_medium_session_missing", 409);

  const requestIdentity = `${body.route_key}:${body.distribution_asset_id}:${body.idempotency_key}`;
  if (body.dry_run !== false) {
    return json({
      ok: true,
      standing: "medium_browser_adapter_ready_dry_run",
      adapter: "cloudflare_browser_run_medium_import_v1",
      request_identity: requestIdentity,
      canonical_url: clean(body.canonical_url),
      publish_authorized: body.publish === true && body.operator_confirmed === true,
      external_publication_effects: 0,
    });
  }

  const browser = await puppeteer.launch(env.BROWSER, { keep_alive: 180000 });
  try {
    const page = await browser.newPage();
    await page.setCookie(...cookies);
    await page.goto(MEDIUM_IMPORT_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
    if (isSignInUrl(page.url())) return held("held_medium_session_invalid", 409);

    const sourceUrl = clean(body.canonical_url);
    const inputSelector = await firstExistingSelector(page, [
      'input[type="url"]',
      'input[name*="url" i]',
      'input[placeholder*="url" i]',
      'input',
    ]);
    if (!inputSelector) return held("held_medium_import_input_not_found", 502);

    await page.click(inputSelector);
    await page.type(inputSelector, sourceUrl, { delay: 5 });
    if (!(await clickButtonByText(page, ["Import", "Import story", "Continue"]))) {
      return held("held_medium_import_action_not_found", 502);
    }

    await waitForSettled(page, 15000);
    const importedText = await page.evaluate(() => document.body?.innerText || "");
    const titleOk = !body.title || importedText.toLowerCase().includes(String(body.title).toLowerCase());
    const disclosureNeedle = clean(body.required_disclosure_text);
    const disclosureOk = !disclosureNeedle || importedText.toLowerCase().includes(disclosureNeedle.toLowerCase());
    if (!titleOk) return held("held_medium_import_content_mismatch", 409, { imported_url: page.url() });
    if (!disclosureOk) return held("held_medium_ai_disclosure_missing", 409, { imported_url: page.url() });

    if (!(body.publish === true && body.operator_confirmed === true)) {
      return json({
        ok: true,
        standing: "medium_imported_draft_ready",
        request_identity: requestIdentity,
        imported_url: page.url(),
        canonical_source: sourceUrl,
        external_publication_effects: 0,
      });
    }

    if (!(await clickButtonByText(page, ["Publish"]))) return held("held_medium_publish_action_not_found", 502);
    await waitForSettled(page, 5000);
    await clickButtonByText(page, ["Publish now", "Publish"]);
    await waitForSettled(page, 12000);

    const canonicalHref = await page.evaluate(() => document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "");
    return json({
      ok: true,
      standing: "medium_story_published",
      request_identity: requestIdentity,
      platform_url: page.url(),
      canonical_source: sourceUrl,
      canonical_href: canonicalHref || null,
      canonical_source_confirmed: normalizeUrl(canonicalHref) === normalizeUrl(sourceUrl),
      published_at: new Date().toISOString(),
      external_publication_effects: 1,
    }, 201);
  } catch (error) {
    return exception("held_medium_browser_exception", error);
  } finally {
    await browser.close();
  }
}

function validateMediumRequest(body) {
  const missing = [];
  for (const key of ["route_key", "publication_object_key", "distribution_asset_id", "canonical_url", "authority_reference", "idempotency_key"]) {
    if (!clean(body?.[key])) missing.push(key);
  }
  if (body?.outlet_key !== "medium") missing.push("outlet_key_medium");
  if (body?.distribution_mode !== "canonical_republication") missing.push("distribution_mode_canonical_republication");
  if (body?.constraints?.canonical_required !== true) missing.push("canonical_required");
  if (body?.constraints?.operator_confirmation_required !== true) missing.push("operator_confirmation_required");
  if (body?.publish === true && body?.operator_confirmed !== true) missing.push("operator_confirmed_for_publish");
  return { ok: missing.length === 0, missing };
}

function isSignInUrl(value) {
  return /signin|login|m\/signin/i.test(value || "");
}

async function firstExistingSelector(page, selectors) {
  for (const selector of selectors) if (await page.$(selector)) return selector;
  return null;
}

async function clickButtonByText(page, labels) {
  return page.evaluate((wanted) => {
    const normalized = wanted.map((label) => String(label).trim().toLowerCase());
    const candidates = Array.from(document.querySelectorAll('button, [role="button"], a'));
    const node = candidates.find((element) => {
      const text = (element.textContent || "").trim().toLowerCase();
      return normalized.some((label) => text === label || text.includes(label));
    });
    if (!node) return false;
    node.click();
    return true;
  }, labels);
}

async function waitForSettled(page, timeoutMs) {
  await Promise.race([
    page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: timeoutMs }).catch(() => null),
    new Promise((resolve) => setTimeout(resolve, Math.min(timeoutMs, 4000))),
  ]);
}

function normalizeUrl(value) {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname.replace(/\/$/, "")}`;
  } catch {
    return String(value || "").replace(/\/$/, "");
  }
}

function clean(value) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function held(standing, status, extra = {}) {
  return json({ ok: false, standing, ...extra, external_publication_effects: 0 }, status);
}

function exception(standing, error) {
  return json({
    ok: false,
    standing,
    error: error instanceof Error ? error.message : String(error),
    external_publication_effects: 0,
  }, 502);
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
