import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeGatewayClient} from './cancom-native-gateway-client.mjs';
function client(answer={standing:'claimed'},jwt='user-jwt',traces=[]) {return createNativeGatewayClient({url:'https://example.invalid',publishableKey:'public',getAccessToken:async()=>jwt,fetchImpl:async(url,init)=>{traces.push({url,init});return {ok:true,json:async()=>answer};}});}
test('native proposed endpoint carries exact token/fence/bytes; no review API',async()=>{const t=[];await client(undefined,undefined,t).call('claim',{instance:'i',payload:Buffer.from('abc')});assert.match(t[0].url,/cancom_native_executor019_v1$/);assert.equal(JSON.parse(t[0].init.body).p_payload,'\\x616263');});
test('missing credentials refuse before transport',async()=>{await assert.rejects(client({},'').call('discover'));await assert.rejects(client({},'public').call('discover'));});
test('unknown operation and server HOLD refuse',async()=>{await assert.rejects(client().call('deploy'));await assert.rejects(client({standing:'HLD'}).call('claim'));});
