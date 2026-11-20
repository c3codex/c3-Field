// Private deployment candidate. Bindings deliberately not provisioned here.
import pg from "pg";
import {deliverConsent} from "./delivery.mjs";
export default {
  async fetch(request,env) {
    if(!env.OWNER_CONSENT_DB?.connectionString||!env.OWNER_CONSENT_MAIL_KEY||!env.OWNER_CONSENT_FROM)
      return new Response(null,{status:503,headers:{"cache-control":"no-store"}});
    return deliverConsent(request,{
      async issue(p){
        const client=new pg.Client({connectionString:env.OWNER_CONSENT_DB.connectionString,connectionTimeoutMillis:5000,query_timeout:5000});
        try{
          await client.connect();
          // Dedicated login inherits only delivery role; no admin/service fallback.
          const result=await client.query("select c3_owner_consent_v1.issue($1::jsonb) as result",[JSON.stringify(p)]);
          return result.rows[0]?.result;
        }finally{await client.end().catch(()=>{})}
      },
      async send(m){
        const response=await fetch("https://api.resend.com/emails",{
          method:"POST",redirect:"error",signal:AbortSignal.timeout(10000),
          headers:{"content-type":"application/json","authorization":"Bearer "+env.OWNER_CONSENT_MAIL_KEY,"idempotency-key":m.idempotencyKey},
          body:JSON.stringify({from:env.OWNER_CONSENT_FROM,to:[m.to],subject:m.subject,text:m.text})
        });
        const body=await response.json().catch(()=>null);
        return response.ok&&typeof body?.id==="string"&&body.id.length>0;
      }
    });
  }
};
