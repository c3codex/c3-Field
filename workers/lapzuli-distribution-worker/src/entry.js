import legacyWorker from "./index.js";
import { handleBufferRequest } from "./buffer-adapter.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/buffer/")) {
      return handleBufferRequest(request, env, url.pathname);
    }
    return legacyWorker.fetch(request, env, ctx);
  },
};
