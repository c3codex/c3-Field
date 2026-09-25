export type AgentEventResult={
  sessionId:string|null
  text:string
  completed:boolean
  failed:boolean
  failureMessage:string|null
  usage:Record<string,unknown>|null
}

export function parseAgentEventPayload(payload:unknown,result:AgentEventResult){
  if(!payload||typeof payload!=="object"||Array.isArray(payload))return
  const event=payload as Record<string,unknown>
  if(typeof event.session_id==="string"&&event.session_id.startsWith("sess_"))result.sessionId=event.session_id
  const type=typeof event.type==="string"?event.type:""
  if(type==="agent.session.turn.output_text.delta"&&typeof event.delta==="string")result.text+=event.delta
  if(type==="agent.session.turn.output_text.done"&&typeof event.text==="string"&&!result.text)result.text=event.text
  if(type==="agent.session.turn.completed"){
    result.completed=true
    if(event.usage&&typeof event.usage==="object"&&!Array.isArray(event.usage))result.usage=event.usage as Record<string,unknown>
  }
  if(type==="agent.session.turn.failed"||type==="agent.session.turn.cancelled"||type==="agent.session.error"){
    result.failed=true
    const error=event.error
    result.failureMessage=error&&typeof error==="object"&&!Array.isArray(error)&&typeof (error as Record<string,unknown>).message==="string"
      ?String((error as Record<string,unknown>).message)
      :type
  }
}

export async function consumeAgentEventStream(response:Response):Promise<AgentEventResult>{
  if(!response.ok||!response.body)throw new Error("openai_stream_unavailable")
  const result:AgentEventResult={sessionId:null,text:"",completed:false,failed:false,failureMessage:null,usage:null}
  const reader=response.body.getReader()
  const decoder=new TextDecoder()
  let buffer=""
  while(true){
    const {done,value}=await reader.read()
    buffer+=decoder.decode(value||new Uint8Array(),{stream:!done})
    const frames=buffer.split(/\r?\n\r?\n/)
    buffer=frames.pop()||""
    for(const frame of frames){
      for(const line of frame.split(/\r?\n/)){
        if(!line.startsWith("data:"))continue
        const raw=line.slice(5).trim()
        if(!raw||raw==="[DONE]")continue
        try{parseAgentEventPayload(JSON.parse(raw),result)}catch{}
      }
    }
    if(done)break
  }
  if(buffer.trim()){
    for(const line of buffer.split(/\r?\n/)){
      if(!line.startsWith("data:"))continue
      const raw=line.slice(5).trim()
      if(!raw||raw==="[DONE]")continue
      try{parseAgentEventPayload(JSON.parse(raw),result)}catch{}
    }
  }
  return result
}

export type ChazzMessage={role:"user"|"assistant";text:string}

export function projectAgentItems(payload:unknown):ChazzMessage[]{
  if(!payload||typeof payload!=="object"||Array.isArray(payload))return[]
  const root=payload as Record<string,unknown>
  const data=Array.isArray(root.data)?root.data:Array.isArray(root.items)?root.items:[]
  const messages:ChazzMessage[]=[]
  for(const candidate of data){
    if(!candidate||typeof candidate!=="object"||Array.isArray(candidate))continue
    const item=candidate as Record<string,unknown>
    const role=item.role==="user"?"user":item.role==="assistant"?"assistant":null
    if(!role||!Array.isArray(item.content))continue
    const parts:string[]=[]
    for(const raw of item.content){
      if(!raw||typeof raw!=="object"||Array.isArray(raw))continue
      const part=raw as Record<string,unknown>
      if((part.type==="input_text"||part.type==="output_text")&&typeof part.text==="string"&&part.text.trim())parts.push(part.text)
    }
    if(parts.length)messages.push({role,text:parts.join("\n")})
  }
  return messages
}
