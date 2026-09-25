import assert from "node:assert/strict"
import test from "node:test"
import {parseAgentEventPayload,projectAgentItems,type AgentEventResult} from "../_lib/my-environment-chazz"

test("agent event projection captures session, output and completion without reasoning text",()=>{
  const result:AgentEventResult={sessionId:null,text:"",completed:false,failed:false,failureMessage:null,usage:null}
  parseAgentEventPayload({type:"agent.session.created",session_id:"sess_test123"},result)
  parseAgentEventPayload({type:"agent.session.turn.reasoning_summary_text.delta",session_id:"sess_test123",delta:"private summary"},result)
  parseAgentEventPayload({type:"agent.session.turn.output_text.delta",session_id:"sess_test123",delta:"Hello "},result)
  parseAgentEventPayload({type:"agent.session.turn.output_text.delta",session_id:"sess_test123",delta:"from Chazz."},result)
  parseAgentEventPayload({type:"agent.session.turn.completed",session_id:"sess_test123",usage:{input_tokens:4,output_tokens:3}},result)
  assert.equal(result.sessionId,"sess_test123")
  assert.equal(result.text,"Hello from Chazz.")
  assert.equal(result.completed,true)
  assert.deepEqual(result.usage,{input_tokens:4,output_tokens:3})
})

test("saved item projection returns only user and assistant text",()=>{
  const messages=projectAgentItems({data:[
    {type:"message",role:"user",content:[{type:"input_text",text:"Hi"}]},
    {type:"reasoning",content:[{type:"summary_text",text:"hidden"}]},
    {type:"message",role:"assistant",content:[{type:"output_text",text:"Hey Stephanie"}]},
    {type:"function_call",name:"not_exposed"}
  ]})
  assert.deepEqual(messages,[{role:"user",text:"Hi"},{role:"assistant",text:"Hey Stephanie"}])
})
