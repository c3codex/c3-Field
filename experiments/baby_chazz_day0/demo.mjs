import {nurseryTurn} from './nursery.mjs';
// Synthetic-only mock model; not open-weight inference.
const env={environment_key:'synthetic_env_001',current_ref:'synthetic_current_001',current_verified:true,capability:'chazz_conversation',capability_active:true,facts:[{environment_key:'synthetic_env_001',ref:'synthetic:current',text:'This environment has one approved test fact.',retrieval_authorized:true}]};
const result=await nurseryTurn(env,{environment_key:'synthetic_env_001',message:'Where am I?'},async admitted=>({kind:'orientation',text:'You are in an authorized test environment. I can orient, not register or send.',evidence_refs:[admitted.facts[0].ref]}));
console.log(JSON.stringify(result,null,2));
