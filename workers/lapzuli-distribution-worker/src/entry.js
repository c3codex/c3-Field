import legacyWorker from "./index.js";
import { handleBufferRequest } from "./buffer-adapter.js";
import { handleC3BufferRequest } from "./buffer-c3-adapter.js";
import { handleC3BlueskyRequest } from "./c3-bluesky-adapter.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/bluesky/c3/")) {
      return handleC3BlueskyRequest(request, env, url.pathname);
    }
    if (url.pathname.startsWith("/buffer/c3/")) {
      return handleC3BufferRequest(request, env, url.pathname);
    }
    if (url.pathname.startsWith("/buffer/")) {
      return handleBufferRequest(request, env, url.pathname);
    }
    return legacyWorker.fetch(request, env, ctx);
  },
};
