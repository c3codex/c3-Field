export interface StagingEnv { EXECUTION_ENABLED?: string }

// OAR022 explicitly forbids activation. Changing an environment variable cannot
// activate this build. It has no scheduled/queue handler or outbound operation.
export default {
  async fetch(request: Request, env: StagingEnv): Promise<Response> {
    if (env.EXECUTION_ENABLED !== 'false') {
      return Response.json({standing:'HLD',reason:'inert_configuration_required'}, {status:503});
    }
    const path = new URL(request.url).pathname;
    if (request.method === 'GET' && path === '/health') {
      return Response.json({standing:'inert_staging',execution_enabled:false,
        registry_calls:false,codex_calls:false,schedules:false,
        worker_identity:'not_qualified',operator_disposition:'RESERVED'});
    }
    return Response.json({standing:'HLD',reason:'execution_not_authorized_in_staging'}, {status:403});
  }
};
