import {FormEvent,useEffect,useRef,useState} from "react"
import EternalFlame from "./EternalFlame"
import {type ProfileContract} from "./ProfilePacPanel"
import MyPacsPanel from "./MyPacsPanel"
import CurrentConstellation,{type CurrentToken} from "./CurrentConstellation"
import OperationsPanel from "./OperationsPanel"
import {
  decryptCanComMessage,
  encryptCanComMessage,
  ensureCanComDeviceIdentity,
  type CanComDeviceBundle,
  type CanComDeviceIdentity,
  type CanComResolvableMessage
} from "../lib/cancom-e2ee"

type EnvPayload={
  authenticated:boolean
  standing:string
  owner?:{display_name:string|null}
  environment?:{env_key:string;environment_name:string;environment_class:string;standing:string;is_active:boolean;is_canonical:boolean}
  envpac?:{envpac_key:string;version:string;standing:string;owner_subject_type:string;custodian_subject_type:string;custodian_subject_key:string;custody_provider:string;portable:boolean;environment_bindings:unknown;rooted_systems:unknown;packages:unknown;profile_pac?:ProfileTruth|null}
  presentation?:{opening_visual_asset_key:string;opening_visual_url:string;source_webpac_key:string;owner_changeable:boolean;selection_standing:string;selected_at?:string;updated_at?:string}|null
  operator_context?:{
    resolution:"operator_context_resolved"|"operator_context_none"|"operator_context_held"
    operator_count?:number
    operators?:Array<{operator_identifier?:string;operator_role?:string;boundary?:string}>
  }|null
}
type Primitive={
  primitive_key:string
  primitive_class:string
  display_label:string
  renderer_key:string
  runtime_endpoint?:string|null
  sort_order:number
  config?:Record<string,unknown>
}
type PrimitivePayload={authenticated:boolean;standing:string;primitives?:Primitive[]}
type PrimitiveGroupKey="core"|"work"|"relations"|"other"
type InitiativeComponent={component_key:string;renderer_key:string;sort_order:number;config?:Record<string,unknown>}
type Initiative={initiative_key:string;initiative_envpac_key:string;target_environment_key?:string|null;visibility_source:string;context_class?:string;context_classes?:string[];initiative_operator_binding_key?:string|null;operator_class?:string|null;operator_role?:string|null;invite_context_allowed?:boolean;components:InitiativeComponent[]}
type InitiativePayload={authenticated:boolean;standing:string;initiatives?:Initiative[]}
type LedgerEntry={entry_key:string;entry_type:string;title?:string|null;body:string;related_route?:string|null;standing:string;created_at:string}
type ConnectionMessage=CanComResolvableMessage
type NativeConnection={
  connection_key:string
  source_relationship_key:string
  target_relationship_key:string
  standing:string
  formed_at:string
  other:{relationship_key:string;display_name:string|null}
  messages:ConnectionMessage[]
}
type InitiativeConnection={
  visibility_key:string
  initiative_key:string
  initiative_envpac_key:string
  target_environment_key?:string|null
  visibility_source:string
  source_ref:string
  standing:string
  visible_at:string
  metadata?:Record<string,unknown>
}
type ConnectionsPayload={authenticated:boolean;standing:string;entries?:LedgerEntry[];native_connections?:NativeConnection[];initiative_connections?:InitiativeConnection[]}
type CanopyReference={reference_key:string;surface_label:string;display_label?:string|null;external_url:string;handle?:string|null;sort_order:number}
type CanopyPayload={standing:string;references?:CanopyReference[]}
type CalendarEvent={
  event_key:string
  title:string
  event_type:string
  start_at:string
  end_at:string
  timezone:string
  event_state:string
  related_relationship_key?:string|null
  related_context_type?:string|null
  related_context_key?:string|null
  location_text?:string|null
  notes?:string|null
  external_projection_state:string
  google_event_url?:string|null
  meet_url?:string|null
}
type CalendarPayload={authenticated:boolean;standing:string;authority?:string;external_projection?:string;events?:CalendarEvent[]}
type ProfileTruth={
  projection_standing?:string
  standing?:string
  pac_key?:string
  profile?:{display_label:string;visibility_scope:string;profile_key:string;profile_class?:string;about?:string|null;interests?:string|null;open_to?:string[];location_region?:string|null}|null
  evaluation?:{completeness_state?:string;resolution_state?:string}
}
type ProfileIntakePayload={authenticated:boolean;standing:string;contract?:ProfileContract;resolved_profile_class?:string|null}
type ChazzMessage={role:"user"|"assistant";text:string}
type ChazzPayload={standing:string;runtime?:string;reason?:string;message?:string;messages?:ChazzMessage[]}
type CurrentPayload={authenticated:boolean;standing:string;semantics?:string;current_state_ref?:string|null;token_count?:number;tokens?:CurrentToken[]}
type AcquisitionProperty={property_key:string;display_name:string;city:string;county:string;lane:string;priority:number;asking_price?:number|null;acreage?:number|null;property_setup?:string|null;listing_status?:string|null;days_on_market?:number|null;oz_status:string;leverage_signal?:string|null;structure_signal:string;acquisition_standing:string;mdm_overlap_note?:string|null;metadata?:Record<string,unknown>}
type AcquisitionResolution={resolution_key:string;property_key:string;resolved_standing:string;resolution_reason:string;next_action?:string|null;effective_at:string}
type AcquisitionDirectory={relationship_key:string;primary_email:string;display_name?:string|null;organization?:string|null;relationship_standing:string}
type AcquisitionsPayload={authenticated:boolean;standing:string;authority?:string;properties?:AcquisitionProperty[];resolutions?:AcquisitionResolution[];directory?:AcquisitionDirectory[]}

async function readChazzJson(response:Response):Promise<ChazzPayload>{
  const contentType=(response.headers.get("content-type")||"").toLowerCase()
  if(!contentType.includes("application/json")){
    await response.text().catch(()=>"")
    throw new Error(response.ok
      ?"Chazz runtime is held because the API route did not resolve as JSON."
      :"Chazz runtime is unavailable from this environment.")
  }
  return await response.json() as ChazzPayload
}

const ARRIVAL_VIDEO="/api/free-media?asset=c3_field_c1me_arrival_video_v1"
const LIVE_BACKDROP="/api/free-media?asset=c3_field_c1me_live_backdrop_v1"

function text(value:unknown,fallback=""){return typeof value==="string"?value:fallback}
function initiativeLabel(initiative:Initiative){
  const entry=initiative.components.find(component=>component.renderer_key==="initiative.entry_card")
  const base=initiative.initiative_key==="47pct"?"4.7%":text(entry?.config?.title,initiative.initiative_key)
  return initiative.context_class==="operator"?base+" · Operator":base
}
function primitiveGroup(primitive:Primitive):PrimitiveGroupKey{
  if(["chazz","current","my_pacs","canopy","calendar"].includes(primitive.primitive_key))return "core"
  if(["native_connections","invite_connection"].includes(primitive.primitive_key))return "relations"
  if(primitive.renderer_key==="c1me.discovery"||primitive.renderer_key==="c1me.pipeline"||primitive.renderer_key==="c1me.acquisitions"||primitive.renderer_key==="c1me.operations")return "work"
  return "other"
}
function primitiveMeta(primitive:Primitive){
  if(primitive.primitive_key==="current")return "retained relation"
  if(primitive.primitive_key==="my_pacs")return "personal custody & approval"
  if(primitive.primitive_key==="calendar")return "c3-native schedule"
  if(primitive.primitive_key==="acquisitions")return "PropPac · acquisition lifecycle"
  if(primitive.primitive_key==="operations")return "operator OAR optics"
  if(primitive.primitive_key==="native_connections")return "CanCom · people & initiative relations"
  if(primitive.primitive_key==="invite_connection")return "CanCom · invite passage"
  if(primitive.renderer_key==="c1me.discovery")return "evidence encounter"
  if(primitive.renderer_key==="c1me.pipeline")return "private operator view"
  if(primitive.primitive_key==="chazz")return "CURRENT-aware work"
  if(primitive.primitive_key==="canopy")return "external surfaces"
  return primitive.primitive_class.replace(/_/g," ")
}

export default function MyEnvironmentEncounter(){
  const [state,setState]=useState<"claiming"|"loading"|"intro"|"ready"|"held">("loading")
  const [data,setData]=useState<EnvPayload|null>(null)
  const [message,setMessage]=useState("Opening your environment…")
  const [primitives,setPrimitives]=useState<Primitive[]>([])
  const [initiatives,setInitiatives]=useState<Initiative[]>([])
  const [ledgerEntries,setLedgerEntries]=useState<LedgerEntry[]>([])
  const [nativeConnections,setNativeConnections]=useState<NativeConnection[]>([])
  const [initiativeConnections,setInitiativeConnections]=useState<InitiativeConnection[]>([])
  const [initiativeConnectionBusy,setInitiativeConnectionBusy]=useState(false)
  const [initiativeConnectionNotice,setInitiativeConnectionNotice]=useState("")
  const [canopy,setCanopy]=useState<CanopyReference[]>([])
  const [profileTruth,setProfileTruth]=useState<ProfileTruth|null>(null)
  const [profileContract,setProfileContract]=useState<ProfileContract|null>(null)

  const [ledgerType,setLedgerType]=useState("note")
  const [ledgerBody,setLedgerBody]=useState("")
  const [ledgerNotice,setLedgerNotice]=useState("")
  const [ledgerBusy,setLedgerBusy]=useState(false)

  const [selectedConnection,setSelectedConnection]=useState("")
  const [connectionMessageType,setConnectionMessageType]=useState("note")
  const [connectionMessage,setConnectionMessage]=useState("")
  const [connectionNotice,setConnectionNotice]=useState("")
  const [connectionBusy,setConnectionBusy]=useState(false)
  const cancomDeviceRef=useRef<CanComDeviceIdentity|null>(null)
  const [cancomE2eeStanding,setCancomE2eeStanding]=useState<"loading"|"ready"|"held">("loading")

  const [canopySurface,setCanopySurface]=useState("")
  const [canopyLabel,setCanopyLabel]=useState("")
  const [canopyUrl,setCanopyUrl]=useState("")
  const [canopyHandle,setCanopyHandle]=useState("")
  const [canopyNotice,setCanopyNotice]=useState("")

  const [profilePresentationAsset,setProfilePresentationAsset]=useState("")

  const [inviteMessage,setInviteMessage]=useState("")
  const [inviteInitiative,setInviteInitiative]=useState("")
  const [inviteNotice,setInviteNotice]=useState("")
  const [inviteCopy,setInviteCopy]=useState("")
  const [activePanel,setActivePanel]=useState<string|null>(null)
  const [environmentIndexOpen,setEnvironmentIndexOpen]=useState(false)
  const [runtimeNotice,setRuntimeNotice]=useState("")
  const [canopyLoaded,setCanopyLoaded]=useState(false)
  const [profileLoaded,setProfileLoaded]=useState(false)
  const [chazzMessages,setChazzMessages]=useState<ChazzMessage[]>([])
  const [chazzInput,setChazzInput]=useState("")
  const [chazzNotice,setChazzNotice]=useState("")
  const [chazzBusy,setChazzBusy]=useState(false)
  const [chazzLoaded,setChazzLoaded]=useState(false)
  const [currentTokens,setCurrentTokens]=useState<CurrentToken[]>([])
  const [currentLoaded,setCurrentLoaded]=useState(false)
  const [calendarEvents,setCalendarEvents]=useState<CalendarEvent[]>([])
  const [calendarLoaded,setCalendarLoaded]=useState(false)
  const [calendarTitle,setCalendarTitle]=useState("")
  const [calendarType,setCalendarType]=useState("meeting")
  const [calendarStart,setCalendarStart]=useState("")
  const [calendarEnd,setCalendarEnd]=useState("")
  const [calendarLocation,setCalendarLocation]=useState("")
  const [calendarNotes,setCalendarNotes]=useState("")
  const [calendarRelationship,setCalendarRelationship]=useState("")
  const [calendarContextType,setCalendarContextType]=useState("")
  const [calendarContextKey,setCalendarContextKey]=useState("")
  const [calendarNotice,setCalendarNotice]=useState("")
  const [calendarBusy,setCalendarBusy]=useState(false)
  const [acquisitionProperties,setAcquisitionProperties]=useState<AcquisitionProperty[]>([])
  const [acquisitionResolutions,setAcquisitionResolutions]=useState<AcquisitionResolution[]>([])
  const [acquisitionDirectory,setAcquisitionDirectory]=useState<AcquisitionDirectory[]>([])
  const [acquisitionsLoaded,setAcquisitionsLoaded]=useState(false)
  const [acquisitionNotice,setAcquisitionNotice]=useState("")

  async function ensureRegisteredCanComDevice(){
    try{
      const identity=cancomDeviceRef.current||await ensureCanComDeviceIdentity()
      const response=await fetch("/api/my-environment-connections",{
        method:"POST",
        headers:{"content-type":"application/json","accept":"application/json"},
        body:JSON.stringify({
          action:"register_e2ee_device",
          device_key:identity.deviceKey,
          encryption_public_key:identity.encryptionPublicKey,
          signing_public_key:identity.signingPublicKey
        })
      })
      const body=await response.json().catch(()=>null) as {ok?:boolean;standing?:string;reason?:string}|null
      if(!response.ok||!body?.ok)throw new Error(body?.reason||body?.standing||"secure_device_registration_held")
      cancomDeviceRef.current=identity
      setCancomE2eeStanding("ready")
      return identity
    }catch(error){
      setCancomE2eeStanding("held")
      throw error
    }
  }

  async function decryptConnectionMessages(connections:NativeConnection[],identity:CanComDeviceIdentity|null){
    return Promise.all(connections.map(async connection=>{
      const messages=await Promise.all((connection.messages||[]).map(async message=>{
        if(message.payload_mode!=="e2ee_ciphertext")return {...message,body:message.body||""}
        if(!identity)return {...message,body:"[Encrypted message unavailable on this device]"}
        try{
          const body=await decryptCanComMessage(message,identity)
          return {...message,body}
        }catch{
          return {...message,body:"[Encrypted message unavailable on this device]"}
        }
      }))
      return {...connection,messages}
    }))
  }

  useEffect(()=>{
    let active=true
    async function hydrateSecondary(){
      let cancomIdentity:CanComDeviceIdentity|null=null
      try{cancomIdentity=await ensureRegisteredCanComDevice()}catch{cancomIdentity=null}
      const results=await Promise.allSettled([
        fetch("/api/my-environment-primitives",{headers:{accept:"application/json"}}),
        fetch("/api/my-environment-initiatives",{headers:{accept:"application/json"}}),
        fetch("/api/my-environment-connections",{headers:{accept:"application/json"}}),
        fetch("/api/my-environment-canopy",{headers:{accept:"application/json"}}),
        fetch("/api/my-environment-profile",{headers:{accept:"application/json"}}),
        fetch("/api/my-environment-current",{headers:{accept:"application/json"}}),
        fetch("/api/my-environment-calendar",{headers:{accept:"application/json"}}),
        fetch("/api/my-environment-acquisitions",{headers:{accept:"application/json"}})
      ])
      if(!active)return
      const [primitiveResult,initiativeResult,connectionsResult,canopyResult,profileResult,currentResult,calendarResult,acquisitionsResult]=results
      if(primitiveResult.status==="fulfilled"&&primitiveResult.value.ok){
        const body=await primitiveResult.value.json() as PrimitivePayload
        if(active&&body.primitives){
          setPrimitives([...body.primitives].sort((a,b)=>a.sort_order-b.sort_order))
          setRuntimeNotice("")
        }
      }else if(active){
        setRuntimeNotice("This environment opened, but its EnvPAC components did not resolve.")
      }
      if(initiativeResult.status==="fulfilled"&&initiativeResult.value.ok){
        const body=await initiativeResult.value.json() as InitiativePayload
        if(active&&body.initiatives) setInitiatives(body.initiatives)
      }
      if(connectionsResult.status==="fulfilled"&&connectionsResult.value.ok){
        const body=await connectionsResult.value.json() as ConnectionsPayload
        const resolvedConnections=await decryptConnectionMessages(body.native_connections||[],cancomIdentity)
        if(active){
          setLedgerEntries(body.entries||[])
          setNativeConnections(resolvedConnections)
          setInitiativeConnections(body.initiative_connections||[])
          setSelectedConnection(current=>current||(resolvedConnections[0]?.connection_key||""))
        }
      }
      if(canopyResult.status==="fulfilled"&&canopyResult.value.ok){
        const body=await canopyResult.value.json() as CanopyPayload
        if(active){
          setCanopy(body.references||[])
          setCanopyLoaded(true)
        }
      }else if(active){
        setCanopyLoaded(false)
      }
      if(currentResult.status==="fulfilled"&&currentResult.value.ok){
        const body=await currentResult.value.json() as CurrentPayload
        if(active){setCurrentTokens(body.tokens||[]);setCurrentLoaded(true)}
      }else if(active){
        setCurrentLoaded(false)
      }
      if(calendarResult.status==="fulfilled"&&calendarResult.value.ok){
        const body=await calendarResult.value.json() as CalendarPayload
        if(active){setCalendarEvents(body.events||[]);setCalendarLoaded(true)}
      }else if(active){
        setCalendarLoaded(false)
      }
      if(acquisitionsResult.status==="fulfilled"&&acquisitionsResult.value.ok){
        const body=await acquisitionsResult.value.json() as AcquisitionsPayload
        if(active){setAcquisitionProperties(body.properties||[]);setAcquisitionResolutions(body.resolutions||[]);setAcquisitionDirectory(body.directory||[]);setAcquisitionsLoaded(true)}
      }else if(active){
        setAcquisitionsLoaded(false)
      }
      if(profileResult.status==="fulfilled"&&profileResult.value.ok){
        const body=await profileResult.value.json() as ProfileIntakePayload
        if(active&&body.contract?.pac_type==="ProfilePAC"){
          setProfileContract(body.contract)
          body.contract.questions.find(question=>question.key==="profile.visibility_scope")
        }
      }
    }
    async function run(){
      try{
        const params=new URLSearchParams(location.hash.slice(1))
        const claim=params.get("claim")
        if(claim){
          setState("claiming")
          const claimResponse=await fetch("/api/my-environment-claim",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({claim})})
          if(!claimResponse.ok) throw new Error("claim")
          history.replaceState(null,"",location.pathname)
        }
        setState("loading")
        const response=await fetch("/api/my-environment",{headers:{accept:"application/json"}})
        const body=await response.json() as EnvPayload
        if(!active)return
        if(!response.ok||body.standing!=="environment_ready"||!body.environment||!body.envpac){
          setMessage(response.status===401&&body.standing==="environment_claim_required"
            ?"This browser has not carried its existing c3Field session onto the canonical My Environment host yet."
            :"Your environment is not available from this browser yet.")
          setState("held")
          return
        }
        setData(body)
        setProfileTruth(body.envpac.profile_pac||null)
        setProfileLoaded(true)
        setProfilePresentationAsset(body.presentation?.opening_visual_asset_key||"")
        document.title=body.owner?.display_name?body.owner.display_name+" | My Environment | c3 Community Partners":"My Environment | c3 Community Partners"
        setState(claim?"intro":"ready")
        void hydrateSecondary()
      }catch{
        if(active){setMessage("Your environment link is unavailable or has expired.");setState("held")}
      }
    }
    document.title="My Environment | c3 Community Partners"
    void run()
    return()=>{active=false}
  },[])

  useEffect(()=>{
    if(!activePanel)return
    const onKeyDown=(event:KeyboardEvent)=>{
      if(event.key==="Escape")setActivePanel(null)
    }
    window.addEventListener("keydown",onKeyDown)
    return()=>window.removeEventListener("keydown",onKeyDown)
  },[activePanel])

  useEffect(()=>{
    if(activePanel!=="primitive:chazz"||chazzLoaded)return
    let active=true
    async function loadChazz(){
      setChazzNotice("")
      try{
        const response=await fetch("/api/my-environment-chazz",{headers:{accept:"application/json"}})
        const body=await readChazzJson(response)
        if(!active)return
        if(response.ok&&body.standing==="ACT"){
          setChazzMessages(body.messages||[])
        }else{
          setChazzNotice(body.reason||"Chazz is held in this environment.")
        }
      }catch{
        if(active)setChazzNotice("Chazz could not resolve from this environment.")
      }finally{
        if(active)setChazzLoaded(true)
      }
    }
    void loadChazz()
    return()=>{active=false}
  },[activePanel,chazzLoaded])

  async function addLedgerEntry(event:FormEvent){
    event.preventDefault()
    if(!ledgerBody.trim())return
    setLedgerBusy(true);setLedgerNotice("")
    try{
      const response=await fetch("/api/my-environment-connections",{
        method:"POST",headers:{"content-type":"application/json"},
        body:JSON.stringify({entry_type:ledgerType,body:ledgerBody.trim()})
      })
      const body=await response.json() as {ok?:boolean;entry?:LedgerEntry;standing?:string;reason?:string}
      if(!response.ok||!body.ok||!body.entry)throw new Error(body.reason||body.standing||"The ledger entry could not be recorded.")
      setLedgerEntries(current=>[body.entry!,...current]);setLedgerBody("");setLedgerNotice("Added to your Ledger.")
    }catch(error){setLedgerNotice(error instanceof Error?error.message:"The ledger entry could not be recorded.")}
    finally{setLedgerBusy(false)}
  }

  async function begin47pctConnection(){
    if(initiativeConnectionBusy)return
    setInitiativeConnectionBusy(true)
    setInitiativeConnectionNotice("")
    try{
      const response=await fetch("/api/my-environment-initiative-connect",{
        method:"POST",
        headers:{"content-type":"application/json","accept":"application/json"},
        body:JSON.stringify({initiative_key:"47pct"})
      })
      const body=await response.json().catch(()=>null) as {ok?:boolean;standing?:string;reason?:string;acknowledgment_url?:string}|null
      if(!response.ok||!body?.ok)throw new Error(body?.reason||body?.standing||"The 4.7% passage could not be prepared.")
      if(body.standing==="initiative_connection_active"){
        setInitiativeConnectionNotice("4.7% is already connected to this environment.")
        return
      }
      if(body.standing!=="322_acknowledgment_required"||typeof body.acknowledgment_url!=="string")
        throw new Error("The 4.7% acknowledgment passage did not resolve.")
      const next=new URL(body.acknowledgment_url,location.origin)
      if(next.origin!=="https://c3field.online"||next.pathname!=="/api/c3-community-connect-acknowledge"||!next.hash.startsWith("#ticket="))
        throw new Error("The 4.7% acknowledgment route did not resolve.")
      location.assign(next.href)
    }catch(error){
      setInitiativeConnectionNotice(error instanceof Error?error.message:"The 4.7% passage could not be prepared.")
    }finally{
      setInitiativeConnectionBusy(false)
    }
  }

  async function sendNativeMessage(event:FormEvent){
    event.preventDefault()
    const plaintext=connectionMessage.trim()
    if(!selectedConnection||!plaintext)return
    setConnectionBusy(true);setConnectionNotice("")
    try{
      const identity=cancomDeviceRef.current||await ensureRegisteredCanComDevice()
      const deviceResponse=await fetch("/api/my-environment-connections",{
        method:"POST",headers:{"content-type":"application/json","accept":"application/json"},
        body:JSON.stringify({action:"resolve_e2ee_devices",connection_key:selectedConnection})
      })
      const deviceBody=await deviceResponse.json().catch(()=>null) as {ok?:boolean;standing?:string;reason?:string;devices?:CanComDeviceBundle[]}|null
      if(!deviceResponse.ok||!deviceBody?.ok)
        throw new Error(deviceBody?.reason||deviceBody?.standing||"secure_device_resolution_held")
      const devices=deviceBody.devices||[]
      if(!devices.some(device=>device.participant_role==="peer"))
        throw new Error("recipient_secure_device_unavailable")

      const packet=await encryptCanComMessage({
        connectionKey:selectedConnection,
        messageType:connectionMessageType,
        plaintext,
        identity,
        devices
      })
      const response=await fetch("/api/my-environment-connections",{
        method:"POST",headers:{"content-type":"application/json","accept":"application/json"},
        body:JSON.stringify({
          action:"send_e2ee_message",
          connection_key:selectedConnection,
          message_type:connectionMessageType,
          ...packet
        })
      })
      const body=await response.json() as {ok?:boolean;message?:ConnectionMessage;standing?:string;reason?:string}
      if(!response.ok||!body.ok||!body.message){
        const reason=body.reason||body.standing||"The encrypted message could not be sent."
        if(reason==="recipient_secure_device_unavailable")
          throw new Error("Secure messaging is waiting for the connected environment to open My Env on an E2EE-capable device.")
        if(reason==="encrypted_key_wrap_incomplete")
          throw new Error("A connected device changed while this message was being encrypted. Try again.")
        throw new Error(reason)
      }
      const localMessage:ConnectionMessage={...body.message,body:plaintext,payload_mode:"e2ee_ciphertext"}
      setNativeConnections(current=>current.map(connection=>connection.connection_key===selectedConnection
        ?{...connection,messages:[...connection.messages,localMessage]}:connection))
      setConnectionMessage("")
      setConnectionNotice("Encrypted end to end and sent through this connection.")
    }catch(error){
      const reason=error instanceof Error?error.message:"The encrypted message could not be sent."
      setConnectionNotice(reason==="recipient_secure_device_unavailable"
        ?"Secure messaging is waiting for the connected environment to open My Env on an E2EE-capable device."
        :reason)
    }finally{setConnectionBusy(false)}
  }

  async function addCanopyReference(event:FormEvent){
    event.preventDefault();setCanopyNotice("")
    try{
      const response=await fetch("/api/my-environment-canopy",{
        method:"POST",headers:{"content-type":"application/json"},
        body:JSON.stringify({action:"add",surface_label:canopySurface,display_label:canopyLabel||null,external_url:canopyUrl,handle:canopyHandle||null,sort_order:canopy.length})
      })
      const body=await response.json() as {standing?:string;reference?:CanopyReference;message?:string}
      if(!response.ok||!body.reference)throw new Error(body.message||body.standing||"The Canopy reference could not be added.")
      setCanopy(current=>[...current,body.reference!]);setCanopySurface("");setCanopyLabel("");setCanopyUrl("");setCanopyHandle("");setCanopyNotice("Added to My Canopy.")
    }catch(error){setCanopyNotice(error instanceof Error?error.message:"The Canopy reference could not be added.")}
  }

  async function removeCanopyReference(referenceKey:string){
    setCanopyNotice("")
    try{
      const response=await fetch("/api/my-environment-canopy",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action:"remove",reference_key:referenceKey})})
      if(!response.ok)throw new Error("The Canopy reference could not be removed.")
      setCanopy(current=>current.filter(reference=>reference.reference_key!==referenceKey))
    }catch(error){setCanopyNotice(error instanceof Error?error.message:"The Canopy reference could not be removed.")}
  }

  async function savePresentation(event:FormEvent){
    event.preventDefault();setProfileNotice("")
    if(!data?.presentation?.owner_changeable){setProfileNotice("This EnvPAC presentation is not owner-changeable.");return}
    try{
      const response=await fetch("/api/my-environment-presentation",{
        method:"POST",headers:{"content-type":"application/json"},
        body:JSON.stringify({opening_visual_asset_key:profilePresentationAsset.trim()})
      })
      const body=await response.json() as {ok?:boolean;standing?:string;reason?:string;presentation?:EnvPayload["presentation"]}
      if(!response.ok||!body.ok||!body.presentation)throw new Error(body.reason||body.standing||"Environment presentation could not be updated.")
      setData(current=>current?{...current,presentation:body.presentation||null}:current)
      setProfileNotice("Environment presentation updated in this EnvPAC.")
    }catch(error){setProfileNotice(error instanceof Error?error.message:"Environment presentation could not be updated.")}
  }

  async function prepareInvite(event:FormEvent){
    event.preventDefault();setInviteNotice("");setInviteCopy("")
    try{
      const response=await fetch("/api/my-environment-invite",{
        method:"POST",headers:{"content-type":"application/json"},
        body:JSON.stringify({message:inviteMessage,...(inviteInitiative?{source_initiative_key:inviteInitiative}:{})})
      })
      const body=await response.json() as {ok?:boolean;public_url?:string;copy_text?:string;standing?:string;reason?:string}
      if(!response.ok||!body.ok||!body.public_url||!body.copy_text)throw new Error(body.reason||body.standing||"The invitation could not be prepared.")
      setInviteCopy(body.copy_text);setInviteNotice("Personalized invitation ready to copy.")
    }catch(error){setInviteNotice(error instanceof Error?error.message:"The invitation could not be prepared.")}
  }

  async function copyPreparedInvite(){
    if(!inviteCopy)return
    try{
      if(navigator.clipboard?.writeText){
        await navigator.clipboard.writeText(inviteCopy)
      }else{
        const field=document.createElement("textarea")
        field.value=inviteCopy
        field.setAttribute("readonly","")
        field.style.position="fixed"
        field.style.opacity="0"
        document.body.appendChild(field)
        field.select()
        const copied=document.execCommand("copy")
        field.remove()
        if(!copied)throw new Error("copy_unavailable")
      }
      setInviteNotice("Invitation copied. Send it in the channel you choose.")
    }catch{
      setInviteNotice("Copy was unavailable. Select the prepared invitation text and copy it manually.")
    }
  }

  async function sendChazz(event:FormEvent){
    event.preventDefault()
    const message=chazzInput.trim()
    if(!message||chazzBusy)return
    setChazzBusy(true);setChazzNotice("");setChazzInput("")
    setChazzMessages(current=>[...current,{role:"user",text:message}])
    try{
      const response=await fetch("/api/my-environment-chazz",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({message})
      })
      const body=await readChazzJson(response)
      if(!response.ok||body.standing!=="ACT"||!body.message)throw new Error(body.reason||"Chazz did not resolve this turn.")
      setChazzMessages(current=>[...current,{role:"assistant",text:body.message!}])
    }catch(error){
      setChazzNotice(error instanceof Error?error.message:"Chazz did not resolve this turn.")
    }finally{
      setChazzBusy(false)
    }
  }

  async function sendPipelineRecordEmail(record:Record<string,unknown>){
    const recipient=text(record.email)
    const subject=text(record.email_subject)
    const message=text(record.email_body)
    if(!recipient||!subject||!message){setRuntimeNotice("This work item is missing its prepared email.");return}
    if(!window.confirm("Send the prepared email to "+recipient+"?"))return
    setRuntimeNotice("Sending through CanCom…")
    try{
      const response=await fetch("/api/my-environment-cancom-email",{
        method:"POST",headers:{"content-type":"application/json"},
        body:JSON.stringify({action:"send",to:recipient,subject,text:message,request_key:crypto.randomUUID()})
      })
      const result=await response.json() as {ok?:boolean;standing?:string;message?:string}
      if(!response.ok||!result.ok)throw new Error(result.message||result.standing||"Email was held.")
      setRuntimeNotice("Email sent. The provider receipt returned to CURRENT.")
    }catch(error){setRuntimeNotice(error instanceof Error?error.message:"Email could not be sent.")}
  }

  function sendPipelineRecordToCalendar(record:Record<string,unknown>){
    const organization=text(record.organization,text(record.display_name,"Relationship"))
    const contact=text(record.display_name)
    setCalendarTitle((contact?contact+" · ":"")+organization+" discovery")
    setCalendarType("encounter")
    setCalendarRelationship(text(record.relationship_key))
    setCalendarContextType("pipeline")
    setCalendarContextKey("measures_registry_nec_cohort")
    setCalendarNotes([
      "NEC / Measures Pipeline",
      text(record.signal)?("Signal: "+text(record.signal)):"",
      "Pipeline stage: "+text(record.stage,"CONNECT"),
      "Observed problem: "+text(record.observed_problem,"Not yet established")
    ].filter(Boolean).join("\n"))
    setCalendarNotice("Pipeline context loaded. Add the confirmed date and time, then save it to your c3 Calendar.")
    setActivePanel("primitive:calendar")
  }

  async function createCalendarEvent(event:FormEvent){
    event.preventDefault()
    if(!calendarTitle.trim()||!calendarStart||!calendarEnd)return
    setCalendarBusy(true);setCalendarNotice("")
    try{
      const response=await fetch("/api/my-environment-calendar",{
        method:"POST",headers:{"content-type":"application/json"},
        body:JSON.stringify({
          action:"create",title:calendarTitle.trim(),event_type:calendarType,
          start_at:new Date(calendarStart).toISOString(),end_at:new Date(calendarEnd).toISOString(),
          timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||"America/Chicago",
          related_relationship_key:calendarRelationship.trim()||null,
          related_context_type:calendarContextType||null,
          related_context_key:calendarContextKey||null,
          location_text:calendarLocation.trim()||null,notes:calendarNotes.trim()||null
        })
      })
      const body=await response.json() as {ok?:boolean;event?:CalendarEvent;message?:string;standing?:string}
      if(!response.ok||!body.ok||!body.event)throw new Error(body.message||body.standing||"The event could not be created.")
      setCalendarEvents(current=>[...current,body.event!].sort((a,b)=>new Date(a.start_at).getTime()-new Date(b.start_at).getTime()))
      setCalendarTitle("");setCalendarStart("");setCalendarEnd("");setCalendarLocation("");setCalendarNotes("");setCalendarRelationship("");setCalendarContextType("");setCalendarContextKey("")
      setCalendarNotice("Added to your c3 Calendar.")
    }catch(error){setCalendarNotice(error instanceof Error?error.message:"The event could not be created.")}
    finally{setCalendarBusy(false)}
  }

  async function calendarAction(eventKey:string,action:"complete"|"cancel"|"prepare_google_projection"){
    setCalendarNotice("")
    try{
      const response=await fetch("/api/my-environment-calendar",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action,event_key:eventKey})})
      const body=await response.json() as {ok?:boolean;google_url?:string;message?:string;standing?:string}
      if(!response.ok||!body.ok)throw new Error(body.message||body.standing||"The calendar action could not be completed.")
      if(action==="prepare_google_projection"&&body.google_url){
        setCalendarEvents(current=>current.map(item=>item.event_key===eventKey?{...item,external_projection_state:"prepared",google_event_url:body.google_url}:item))
        window.open(body.google_url,"_blank","noopener,noreferrer")
        setCalendarNotice("Google projection prepared from the c3 event. c3 remains the calendar authority.")
        return
      }
      if(action==="cancel")setCalendarEvents(current=>current.filter(item=>item.event_key!==eventKey))
      if(action==="complete")setCalendarEvents(current=>current.map(item=>item.event_key===eventKey?{...item,event_state:"completed"}:item))
    }catch(error){setCalendarNotice(error instanceof Error?error.message:"The calendar action could not be completed.")}
  }

  async function resolveAcquisition(property:AcquisitionProperty,resolvedStanding:string){
    const reason=window.prompt("Resolution / evidence for this standing change:")
    if(reason===null)return
    const nextAction=window.prompt("Next action:")||""
    setAcquisitionNotice("")
    try{
      const response=await fetch("/api/my-environment-acquisitions",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({
        action:"resolve",property_key:property.property_key,resolved_standing:resolvedStanding,
        resolution_reason:reason,next_action:nextAction,next_action_owner:"op044"
      })})
      const body=await response.json() as {ok?:boolean;standing?:string;reason?:string;resolution?:AcquisitionResolution;property?:AcquisitionProperty}
      if(!response.ok||!body.ok)throw new Error(body.reason||body.standing||"Resolution could not be recorded.")
      if(body.property)setAcquisitionProperties(current=>current.map(item=>item.property_key===property.property_key?{...item,...body.property}:item))
      if(body.resolution)setAcquisitionResolutions(current=>[body.resolution!,...current])
      setAcquisitionNotice("Resolution persisted to PropPac.")
    }catch(error){setAcquisitionNotice(error instanceof Error?error.message:"Resolution could not be recorded.")}
  }

  function renderPrimitive(primitive:Primitive){
    if(primitive.renderer_key==="c1me.acquisitions"){
      const gerron=acquisitionDirectory.find(item=>item.primary_email.toLowerCase()==="gerron@paragonparcels.com")
      return <section key={primitive.primitive_key} className="myenv-connections-thread">
        <div className="myenv-thread-heading">
          <p className="myenv-kicker">PROPPAC · OPERATOR LIFECYCLE</p>
          <h2>{primitive.display_label}</h2>
          <p>Work Property → Contact → Encounter → Evidence → Resolution → Standing → Next Action here. Commons and MDM remain explicit relations; neither receives property custody from this surface.</p>
        </div>
        {!acquisitionsLoaded&&<p className="myenv-runtime-warning">Acquisition authority could not be resolved from this session.</p>}
        {gerron&&<article>
          <div><span>DIRECTORY · ACQUISITION DISCOVERY</span></div>
          <h3>{gerron.display_name} · {gerron.organization}</h3>
          <p>{gerron.primary_email} · {gerron.relationship_standing.replace(/_/g," ")}</p>
          <small>Directory relation only. Not a property contact and no standing is inferred from the email coordinate.</small>
        </article>}
        <div className="myenv-thread-entries">
          {acquisitionsLoaded&&acquisitionProperties.length===0&&<p className="myenv-relations-empty">PropPac is active; no acquisition records are currently resolved.</p>}
          {acquisitionProperties.map(property=>{
            const latest=acquisitionResolutions.find(item=>item.property_key===property.property_key)
            return <article key={property.property_key}>
              <div><span>{property.lane} · P{property.priority}</span><span>{property.acquisition_standing.replace(/_/g," ")}</span></div>
              <h3>{property.display_name}</h3>
              <p>{property.city}, {property.county} County{property.asking_price?(" · $"+Number(property.asking_price).toLocaleString()):""}{property.acreage?(" · "+property.acreage+" ac"):""}</p>
              {property.property_setup&&<p>{property.property_setup}</p>}
              <p><strong>OZ:</strong> {property.oz_status.replace(/_/g," ")} · <strong>Structure:</strong> {property.structure_signal.replace(/_/g," ")}</p>
              {property.leverage_signal&&<p><strong>Leverage:</strong> {property.leverage_signal}</p>}
              {latest&&<p><strong>Next:</strong> {latest.next_action||latest.resolution_reason}</p>}
              <div className="myenv-chazz-compose-actions">
                {["contact","discovery","diligence","structure","offer","held","dnr"].map(standing=><button key={standing} type="button" onClick={()=>void resolveAcquisition(property,standing)}>{standing.toUpperCase()}</button>)}
              </div>
            </article>
          })}
        </div>
        {acquisitionNotice&&<p className="myenv-initiative-notice" role="status">{acquisitionNotice}</p>}
      </section>
    }
    if(primitive.renderer_key==="c1me.operations"){
      return <OperationsPanel key={primitive.primitive_key}/>
    }
    if(primitive.renderer_key==="c1me.current"){
      return <section key={primitive.primitive_key} className="myenv-connections-thread">
        <div className="myenv-thread-heading">
          <p className="myenv-kicker">RETAINED RELATIONAL ENVIRONMENT TOKEN</p>
          <h2>CURRENT</h2>
          <p>CURRENT retains qualifying relational value from this environment. It is distinct from current state and creates no score, money, ownership, or authority.</p>
        </div>
        {!currentLoaded&&<p className="myenv-runtime-warning">CURRENT could not be resolved from this session.</p>}
        {currentLoaded&&currentTokens.length===0&&<p className="myenv-relations-empty">No relational value has been retained yet. The field begins dark.</p>}
        <div className="myenv-thread-entries">
          {currentTokens.map(token=><article key={token.current_token_key}>
            <div><span>{token.token_class.replace(/_/g," ")}</span><time>{new Date(token.retained_at).toLocaleString()}</time></div>
            <h3>{token.token_class==="initiative"?text(token.metadata?.initiative_key,"Initiative relation"):"Retained relation"}</h3>
            <p>{token.relation_standing==="active"?"Relation presently active.":"Relation retained · present effect "+token.relation_standing+"."}</p>
          </article>)}
        </div>
      </section>
    }
    if(primitive.renderer_key==="c1me.chazz"){
      return <section key={primitive.primitive_key} className="myenv-connections-thread myenv-chazz">
        <div className="myenv-thread-heading">
          <p className="myenv-kicker">C3OPS · CURRENT RESOLVED</p>
          <h2>{primitive.display_label}</h2>
          <p>Work with Chazz inside this environment. Conversation can resolve context and prepare work; it does not create authority.</p>
        </div>
        <div className="myenv-chazz-boundary">
          <span>CAPABILITY</span>
          <strong>conversation · CURRENT-aware reasoning</strong>
          <small>No Registry mutation, publication, distribution, messaging, payment, or external effect is granted by this runtime.</small>
        </div>
        <div className="myenv-chazz-transcript" aria-live="polite">
          {!chazzLoaded&&!chazzNotice&&<p className="myenv-relations-empty">Resolving Chazz from this EnvPAC…</p>}
          {chazzLoaded&&!chazzMessages.length&&!chazzNotice&&<article className="myenv-chazz-message myenv-chazz-message--assistant"><span>CHAZZ</span><p>CURRENT is resolved. What are we working on?</p></article>}
          {chazzMessages.map((message,index)=><article key={index} className={"myenv-chazz-message myenv-chazz-message--"+message.role}>
            <span>{message.role==="assistant"?"CHAZZ":"YOU"}</span>
            <p>{message.text}</p>
          </article>)}
          {chazzBusy&&<article className="myenv-chazz-message myenv-chazz-message--assistant myenv-chazz-thinking"><span>CHAZZ</span><p>Resolving…</p></article>}
        </div>
        {chazzNotice&&<p className="myenv-runtime-warning" role="status">{chazzNotice}</p>}
        <form className="myenv-thread-compose myenv-chazz-compose" onSubmit={sendChazz}>
          <textarea aria-label="Message Chazz" rows={3} maxLength={12000} value={chazzInput} onChange={event=>setChazzInput(event.target.value)} placeholder="Work with Chazz in this environment…" disabled={chazzBusy}/>
          <div className="myenv-chazz-compose-actions">
            <small>CURRENT → c3Ops → evidence</small>
            <button type="submit" disabled={chazzBusy||!chazzInput.trim()}>{chazzBusy?"RESOLVING…":"SEND TO CHAZZ"}</button>
          </div>
        </form>
      </section>
    }
    if(primitive.renderer_key==="c1me.personalize"){
      return <section key={primitive.primitive_key} className="myenv-connections-thread">
        <div className="myenv-thread-heading"><p className="myenv-kicker">ENVIRONMENT</p><h2>{primitive.display_label}</h2>
          <p>Your presentation resolves from this EnvPAC. Avatar is optional, not required.</p>
          {data?.presentation?.opening_visual_asset_key&&<p>Current visual: {data.presentation.opening_visual_asset_key}</p>}
        </div>
      </section>
    }
    if(primitive.renderer_key==="c1me.my_pacs"){
      const profile=profileTruth?.profile
      const profileHeld=profileTruth?.projection_standing==="held"
      return <MyPacsPanel
        key={primitive.primitive_key}
        initialProfile={profile||null}
        profileContract={profileContract}
        profileLoaded={profileLoaded}
        profileHeld={profileHeld}
        onProfileSaved={saved=>setProfileTruth(current=>current?{...current,profile:{...(current.profile||{}),...saved,profile_key:current.profile?.profile_key||"",profile_class:current.profile?.profile_class}}:current)}
        presentation={data?.presentation?{
          opening_visual_asset_key:data.presentation.opening_visual_asset_key,
          owner_changeable:data.presentation.owner_changeable
        }:null}
        presentationAsset={profilePresentationAsset}
        onPresentationAssetChange={setProfilePresentationAsset}
        onSavePresentation={savePresentation}
      />
    }
    if(primitive.renderer_key==="c1me.ledger"){
      return <section key={primitive.primitive_key} className="myenv-connections-thread">
        <div className="myenv-thread-heading"><p className="myenv-kicker">LEDGER</p><h2>{primitive.display_label}</h2><p>Keep private notes, introductions, opportunities, and follow-ups with your environment.</p></div>
        <div className="myenv-thread-entries">
          {ledgerEntries.length===0&&<p className="myenv-relations-empty">Your Ledger is ready.</p>}
          {ledgerEntries.slice(0,8).map(entry=><article key={entry.entry_key}><div><span>{entry.entry_type.replace(/_/g," ")}</span><time>{new Date(entry.created_at).toLocaleString()}</time></div>{entry.title&&<h3>{entry.title}</h3>}<p>{entry.body}</p></article>)}
        </div>
        <form className="myenv-thread-compose" onSubmit={addLedgerEntry}>
          <select aria-label="Ledger entry type" value={ledgerType} onChange={e=>setLedgerType(e.target.value)}>
            <option value="note">Note</option><option value="introduction">Introduction</option><option value="opportunity">Opportunity</option><option value="follow_up">Follow-up</option>
          </select>
          <textarea aria-label="Ledger note" rows={3} maxLength={5000} value={ledgerBody} onChange={e=>setLedgerBody(e.target.value)} placeholder="Add something you want to keep with your environment."/>
          <button type="submit" disabled={ledgerBusy||!ledgerBody.trim()}>ADD TO LEDGER</button>
        </form>
        {ledgerNotice&&<p className="myenv-initiative-notice" role="status">{ledgerNotice}</p>}
      </section>
    }
    if(primitive.renderer_key==="c1me.canopy"){
      return <section key={primitive.primitive_key} className="myenv-connections-thread">
        <div className="myenv-thread-heading"><p className="myenv-kicker">MY CANOPY</p><h2>{primitive.display_label}</h2><p>Owner-selected external surfaces remain environment-held and create no Registry standing.</p></div>
        <div className="myenv-thread-entries">
          {!canopyLoaded&&<p className="myenv-runtime-warning">Canopy could not be resolved from this session.</p>}
          {canopyLoaded&&canopy.length===0&&<p className="myenv-relations-empty">No Canopy references yet.</p>}
          {canopy.map(reference=><article key={reference.reference_key}><div><span>{reference.surface_label}</span></div><h3>{reference.display_label||reference.handle||reference.surface_label}</h3>{reference.handle&&<p>{reference.handle}</p>}<p><a href={reference.external_url} target="_blank" rel="noreferrer">OPEN SURFACE →</a></p><button type="button" onClick={()=>void removeCanopyReference(reference.reference_key)}>REMOVE</button></article>)}
        </div>
        <form className="myenv-thread-compose" onSubmit={addCanopyReference}>
          <input aria-label="Surface" maxLength={80} value={canopySurface} onChange={e=>setCanopySurface(e.target.value)} placeholder="Facebook, Instagram, LinkedIn…"/>
          <input aria-label="Display label" maxLength={120} value={canopyLabel} onChange={e=>setCanopyLabel(e.target.value)} placeholder="Display label"/>
          <input aria-label="Handle" maxLength={160} value={canopyHandle} onChange={e=>setCanopyHandle(e.target.value)} placeholder="@handle (optional)"/>
          <input aria-label="URL" maxLength={2048} value={canopyUrl} onChange={e=>setCanopyUrl(e.target.value)} placeholder="https://…"/>
          <button type="submit" disabled={!canopySurface.trim()||!canopyUrl.trim()}>ADD TO CANOPY</button>
        </form>
        {canopyNotice&&<p className="myenv-initiative-notice" role="status">{canopyNotice}</p>}
      </section>
    }
    if(primitive.renderer_key==="c1me.calendar"){
      return <section key={primitive.primitive_key} className="myenv-connections-thread">
        <div className="myenv-thread-heading">
          <p className="myenv-kicker">C3-NATIVE · PRIMARY CALENDAR</p>
          <h2>{primitive.display_label}</h2>
          <p>Schedule here first. Only events you explicitly choose are projected to Google Calendar.</p>
        </div>
        <div className="myenv-thread-entries">
          {!calendarLoaded&&<p className="myenv-runtime-warning">Calendar could not be resolved from this session.</p>}
          {calendarLoaded&&calendarEvents.length===0&&<p className="myenv-relations-empty">Your c3 Calendar is ready.</p>}
          {calendarEvents.map(item=><article key={item.event_key}>
            <div><span>{item.event_type.replace(/_/g," ")} · {item.event_state}</span><time>{new Date(item.start_at).toLocaleString()}</time></div>
            <h3>{item.title}</h3>
            <p>{new Date(item.start_at).toLocaleString()} → {new Date(item.end_at).toLocaleString()}</p>
            {item.location_text&&<p><strong>Where:</strong> {item.location_text}</p>}
            {item.notes&&<p>{item.notes}</p>}
            {item.related_relationship_key&&<p><strong>Relation:</strong> {item.related_relationship_key}</p>}
            <p><strong>Google:</strong> {item.external_projection_state==="none"?"not projected":item.external_projection_state}</p>
            <div className="myenv-chazz-compose-actions">
              {item.event_state==="scheduled"&&<button type="button" onClick={()=>void calendarAction(item.event_key,"prepare_google_projection")}>SEND TO GOOGLE</button>}
              {item.event_state==="scheduled"&&<button type="button" onClick={()=>void calendarAction(item.event_key,"complete")}>COMPLETE</button>}
              {item.event_state==="scheduled"&&<button type="button" onClick={()=>void calendarAction(item.event_key,"cancel")}>CANCEL</button>}
            </div>
          </article>)}
        </div>
        <form className="myenv-thread-compose" onSubmit={createCalendarEvent}>
          <input aria-label="Event title" maxLength={240} value={calendarTitle} onChange={e=>setCalendarTitle(e.target.value)} placeholder="Event"/>
          <select aria-label="Event type" value={calendarType} onChange={e=>setCalendarType(e.target.value)}>
            <option value="meeting">Meeting</option><option value="encounter">Encounter</option><option value="follow_up">Follow-up</option><option value="deadline">Deadline</option><option value="task">Task</option><option value="other">Other</option>
          </select>
          <label>Starts</label><input aria-label="Starts" type="datetime-local" value={calendarStart} onChange={e=>setCalendarStart(e.target.value)}/>
          <label>Ends</label><input aria-label="Ends" type="datetime-local" value={calendarEnd} onChange={e=>setCalendarEnd(e.target.value)}/>
          <input aria-label="Related relationship key" maxLength={160} value={calendarRelationship} onChange={e=>setCalendarRelationship(e.target.value)} placeholder="Relationship key (optional)"/>
          <input aria-label="Location or link" maxLength={500} value={calendarLocation} onChange={e=>setCalendarLocation(e.target.value)} placeholder="Location / link (optional)"/>
          <textarea aria-label="Event notes" rows={3} maxLength={5000} value={calendarNotes} onChange={e=>setCalendarNotes(e.target.value)} placeholder="Prep, purpose, context…"/>
          <button type="submit" disabled={calendarBusy||!calendarTitle.trim()||!calendarStart||!calendarEnd}>{calendarBusy?"ADDING…":"ADD TO C3 CALENDAR"}</button>
        </form>
        {calendarNotice&&<p className="myenv-initiative-notice" role="status">{calendarNotice}</p>}
        <p className="myenv-runtime-warning">Google is downstream only. Automatic Google Meet creation remains held until a provider executor is explicitly connected.</p>
      </section>
    }
    if(primitive.renderer_key==="c1me.discovery"){
      const config=primitive.config||{}
      const request=(config.request&&typeof config.request==="object"?config.request:{}) as Record<string,unknown>
      const candidates=Array.isArray(config.candidates)?config.candidates.filter((item):item is Record<string,unknown>=>!!item&&typeof item==="object"):[]
      return <section key={primitive.primitive_key} className="myenv-connections-thread">
        <div className="myenv-thread-heading">
          <p className="myenv-kicker">REGISTRY DISCOVERY · EVIDENCE ONLY</p>
          <h2>{primitive.display_label}</h2>
          <p>{text(config.summary,"Evidence-backed candidates surfaced for human evaluation. Registry does not recommend, certify, or create trust.")}</p>
        </div>
        <article className="myenv-initiative-card">
          <div><span>REQUEST</span><h3>{text(request.capacity,"Requested capacity")}</h3>
            <p>{[text(request.location),text(request.customer_type)].filter(Boolean).join(" · ")}</p>
          </div>
        </article>
        <div className="myenv-thread-entries">
          {candidates.map((candidate,index)=>{
            const evidence=Array.isArray(candidate.evidence)?candidate.evidence.filter((item):item is Record<string,unknown>=>!!item&&typeof item==="object"):[]
            const unknowns=Array.isArray(candidate.unknowns)?candidate.unknowns.filter((item):item is string=>typeof item==="string"):[]
            return <article key={text(candidate.candidate_key,String(index))}>
              <div><span>{text(candidate.registry_state,"candidate · evidence only")}</span></div>
              <h3>{text(candidate.display_name,"Candidate")}</h3>
              {text(candidate.location)&&<p><strong>Location:</strong> {text(candidate.location)}</p>}
              {text(candidate.capacity)&&<p><strong>Capacity:</strong> {text(candidate.capacity)}</p>}
              {text(candidate.experience)&&<p><strong>Experience:</strong> {text(candidate.experience)}</p>}
              {text(candidate.story)&&<p><strong>Story:</strong> {text(candidate.story)}</p>}
              {text(candidate.reviews)&&<p><strong>Reviews:</strong> {text(candidate.reviews)}</p>}
              {unknowns.length>0&&<p><strong>Not established:</strong> {unknowns.join(" · ")}</p>}
              {evidence.length>0&&<p><strong>Evidence:</strong> {evidence.map((item,evidenceIndex)=><span key={evidenceIndex}>{evidenceIndex>0?" · ":""}<a href={text(item.url)} target="_blank" rel="noreferrer">{text(item.label,"source")}</a></span>)}</p>}
            </article>
          })}
        </div>
        <p className="myenv-runtime-warning">These records support discovery only. ProWorx decides whether any candidate is worth contacting or belongs in its environment.</p>
      </section>
    }
    if(primitive.renderer_key==="c1me.pipeline"){
      const config=primitive.config||{}
      const stages=Array.isArray(config.pipeline_stages)?config.pipeline_stages.filter((item):item is string=>typeof item==="string"):[]
      const records=Array.isArray(config.records)?config.records.filter((item):item is Record<string,unknown>=>!!item&&typeof item==="object"):[]
      return <section key={primitive.primitive_key} className="myenv-connections-thread">
        <div className="myenv-thread-heading">
          <p className="myenv-kicker">PRIVATE OPERATOR VIEW · EVIDENCE-RESOLVED</p>
          <h2>{primitive.display_label}</h2>
          <p>{text(config.summary,"Relationship work projected from Registry evidence. Pipeline state does not create consent, standing, CURRENT, or authority.")}</p>
        </div>
        {stages.length>0&&<article className="myenv-initiative-card"><div><span>PIPELINE</span><h3>{stages.join(" → ")}</h3></div></article>}
        <div className="myenv-thread-entries">
          {records.length===0&&<p className="myenv-relations-empty">No pipeline records resolved.</p>}
          {records.map((record,index)=><article key={text(record.relationship_key,text(record.email,String(index)))}>
            <div><span>{text(record.stage,"CAPTURE")}</span>{text(record.last_touch)&&<time>{text(record.last_touch)}</time>}</div>
            <h3>{text(record.organization,text(record.display_name,"Relationship"))}</h3>
            {text(record.display_name)&&<p><strong>Contact:</strong> {text(record.display_name)}</p>}
            {text(record.signal)&&<p><strong>Signal:</strong> {text(record.signal)}</p>}
            <p><strong>Next:</strong> {text(record.next_encounter,"reply or discovery conversation")}</p>
            <p><strong>Observed problem:</strong> {text(record.observed_problem,"Not yet established")}</p>
            <div className="myenv-action-row">
              <button type="button" onClick={()=>sendPipelineRecordToCalendar(record)}>SEND TO CALENDAR</button>
              {text(record.email)&&text(record.email_subject)&&text(record.email_body)&&<button type="button" onClick={()=>sendPipelineRecordEmail(record)}>SEND EMAIL</button>}
            </div>
          </article>)}
        </div>
        <p className="myenv-runtime-warning">Progress only from evidenced replies and discovery. Outreach alone does not establish a problem or relationship standing.</p>
      </section>
    }
    if(primitive.renderer_key==="c1me.native_connections"){
      const has47pct=initiativeConnections.some(connection=>connection.initiative_key==="47pct")
      return <section key={primitive.primitive_key} className="myenv-connections-thread">
        <div className="myenv-thread-heading"><p className="myenv-kicker">CANCOM · C3-NATIVE</p><h2>CanCom · {primitive.display_label}</h2><p>People and initiative relations appear here only after their governed passage resolves. Personal messages use end-to-end encrypted CanCom passage.</p></div>
        <div className="myenv-thread-entries">
          {initiativeConnections.map(connection=>{
            const initiative=initiatives.find(item=>item.initiative_key===connection.initiative_key)
            const entry=initiative?.components.find(component=>component.renderer_key==="initiative.entry_card")
            const label=connection.initiative_key==="47pct"?"4.7%":text(entry?.config?.title,connection.initiative_key)
            return <article key={connection.visibility_key}>
              <div><span>initiative connection</span><time>{new Date(connection.visible_at).toLocaleString()}</time></div>
              <h3>{label}</h3>
              <p>{connection.visibility_source} → {connection.target_environment_key||"connected environment"}</p>
            </article>
          })}
          {!has47pct&&<article className="myenv-initiative-card">
            <div><span>available passage</span><h3>4.7%</h3><p>Connect this environment to the 4.7% initiative through its required 3-2-2 acknowledgment. Starting the passage does not create support, attendance, contribution, or C2 standing.</p></div>
            <button type="button" onClick={()=>void begin47pctConnection()} disabled={initiativeConnectionBusy}>{initiativeConnectionBusy?"PREPARING…":"CONNECT TO 4.7%"}</button>
          </article>}
          {nativeConnections.length===0&&initiativeConnections.length===0&&<p className="myenv-relations-empty">No active c3 connections yet.</p>}
          {nativeConnections.map(connection=><article key={connection.connection_key}><div><span>person connection</span><time>{new Date(connection.formed_at).toLocaleString()}</time></div><h3>{connection.other.display_name||"Connected environment"}</h3>{connection.messages.slice(-5).map(item=><p key={item.message_key}><strong>{item.sender_relationship_key===connection.other.relationship_key?(connection.other.display_name||"Connection")+": ":"You: "}</strong>{item.body}</p>)}</article>)}
        </div>
        {initiativeConnectionNotice&&<p className="myenv-initiative-notice" role="status">{initiativeConnectionNotice}</p>}
        <p className="myenv-runtime-warning">{cancomE2eeStanding==="ready"
          ?"New personal connection messages leave this device only as end-to-end encrypted ciphertext. Legacy messages predate E2EE; Registry retains passage evidence, not message text."
          :"Secure CanCom messaging is held until this browser can establish its local device encryption identity."}</p>
        {nativeConnections.length>0&&<form className="myenv-thread-compose" onSubmit={sendNativeMessage}>
          <select aria-label="Connected environment" value={selectedConnection} onChange={e=>setSelectedConnection(e.target.value)}>
            {nativeConnections.map(connection=><option key={connection.connection_key} value={connection.connection_key}>{connection.other.display_name||"Connected environment"}</option>)}
          </select>
          <select aria-label="Message type" value={connectionMessageType} onChange={e=>setConnectionMessageType(e.target.value)}>
            <option value="note">Note</option><option value="introduction">Introduction</option><option value="opportunity">Opportunity</option><option value="follow_up">Follow-up</option>
          </select>
          <textarea aria-label="Connection message" rows={3} maxLength={5000} value={connectionMessage} onChange={e=>setConnectionMessage(e.target.value)} placeholder="Leave a message on this connection ledger."/>
          <button type="submit" disabled={connectionBusy||!selectedConnection||!connectionMessage.trim()}>SEND TO CONNECTION</button>
        </form>}
        {connectionNotice&&<p className="myenv-initiative-notice" role="status">{connectionNotice}</p>}
      </section>
    }
    if(primitive.renderer_key==="c1me.invite_connection"){
      return <section key={primitive.primitive_key} className="myenv-connections-thread">
        <div className="myenv-thread-heading"><p className="myenv-kicker">CANCOM · RELATIONAL PASSAGE</p><h2>{primitive.display_label}</h2><p>Prepare a personalized invitation from this environment. The connection forms only when the recipient authenticates into their environment.</p></div>
        <form className="myenv-thread-compose" onSubmit={prepareInvite}>
          <textarea aria-label="Invitation message" rows={3} maxLength={1200} value={inviteMessage} onChange={e=>setInviteMessage(e.target.value)} placeholder="Add a personal invitation message."/>
          <select aria-label="Initiative context" value={inviteInitiative} onChange={e=>setInviteInitiative(e.target.value)}>
            <option value="">No initiative context</option>
            {initiatives.map(initiative=><option key={initiative.initiative_key} value={initiative.initiative_key}>{initiativeLabel(initiative)}</option>)}
          </select>
          <button type="submit">PREPARE INVITE</button>
        </form>
        {inviteNotice&&<p className="myenv-initiative-notice" role="status">{inviteNotice}</p>}
        {inviteCopy&&<article className="myenv-initiative-card">
          <div><span>personalized invite</span><h3>Copy & send</h3><p>The link carries this invitation's opaque provenance into the selected initiative Connect surface.</p></div>
          <textarea aria-label="Prepared invitation" rows={7} readOnly value={inviteCopy} onFocus={event=>event.currentTarget.select()}/>
          <button type="button" onClick={()=>void copyPreparedInvite()}>COPY INVITATION</button>
        </article>}
      </section>
    }
    return null
  }

  if(state==="held"||state==="claiming"||state==="loading"||!data?.environment||!data.envpac){
    return <main className="myenv-shell myenv-held"><section><p className="myenv-kicker">c3 Community Partners</p><h1>My Environment</h1><p>{message}</p>{state==="held"&&<a href="https://c3field.online/api/my-environment-session-handoff">Continue existing My Environment</a>}</section></main>
  }
  if(state==="intro"){
    return <main className="myenv-shell myenv-arrival" aria-label="Entering your environment"><video className="myenv-arrival-video" src={ARRIVAL_VIDEO} autoPlay muted playsInline preload="auto" onEnded={()=>setState("ready")} onError={()=>setState("ready")}/></main>
  }

  const has47pct=initiatives.some(initiative=>initiative.initiative_key==="47pct")
  const genericBackdrop=!data.presentation||["c3_field_c1me_live_backdrop_v1","c3_field_environment_opening_visual_v1"].includes(data.presentation.opening_visual_asset_key)
  const backdrop=genericBackdrop?"":(data.presentation?.opening_visual_url||"")
  const activePrimitive=activePanel?.startsWith("primitive:")
    ?primitives.find(primitive=>"primitive:"+primitive.primitive_key===activePanel)
    :null
  const activeInitiative=activePanel?.startsWith("initiative:")
    ?initiatives.find(initiative=>"initiative:"+initiative.initiative_key===activePanel)
    :null
  const groupedPrimitives={
    core:primitives.filter(primitive=>primitiveGroup(primitive)==="core"),
    work:primitives.filter(primitive=>primitiveGroup(primitive)==="work"),
    relations:primitives.filter(primitive=>primitiveGroup(primitive)==="relations"),
    other:primitives.filter(primitive=>primitiveGroup(primitive)==="other")
  }
  const hasOperatorContext=
    data.operator_context?.resolution==="operator_context_resolved" &&
    (data.operator_context.operator_count||0)>0 &&
    (data.operator_context.operators||[]).some(operator=>operator.operator_role==="operator"&&operator.boundary==="notchazz_pass")
  const environmentItemCount=primitives.length+initiatives.length

  return <main className="myenv-shell myenv-environment" aria-label="My Environment" data-runtime-contract="c1me_env_primitives_v3+CURRENT_v1">
    {backdrop&&<img className="myenv-backdrop" src={backdrop} alt="" aria-hidden="true"/>}
    <CurrentConstellation tokens={currentTokens}/>
    <div className="myenv-environment-wash" aria-hidden="true"/>
    <section className="myenv-place" aria-label="c1ME environment">
      <div className="myenv-presence">
        <p className="myenv-kicker">c1ME.env</p>
        <h1>{data.owner?.display_name?.trim()||"My Environment"}</h1>
        <p className="myenv-presence-hint">{environmentItemCount} things are available in this environment · open the Environment Index</p>
      </div>
    </section>

    {runtimeNotice&&<p className="myenv-runtime-notice" role="status">{runtimeNotice}</p>}
    {initiatives.some(initiative=>initiative.initiative_key==="47pct")&&<aside className="myenv-runtime-notice myenv-eternal-flame" aria-label="Eternal Flame memorial"><EternalFlame compact /></aside>}

    <button
      type="button"
      className="myenv-index-toggle"
      aria-expanded={environmentIndexOpen}
      aria-controls="myenv-environment-index"
      onClick={()=>setEnvironmentIndexOpen(value=>!value)}
    >
      <span>ENVIRONMENT INDEX</span><strong>{environmentItemCount}</strong>
    </button>

    <nav id="myenv-environment-index" className={"myenv-index"+(environmentIndexOpen?" myenv-index--open":"")} aria-label="Environment Index">
      <div className="myenv-index-head">
        <div><span>MY ENVIRONMENT</span><strong>Environment Index</strong></div>
        <small>{environmentItemCount} available</small>
        <button type="button" aria-label="Close Environment Index" onClick={()=>setEnvironmentIndexOpen(false)}>×</button>
      </div>
      {([
        ["core","Core",groupedPrimitives.core],
        ["work","Work",groupedPrimitives.work],
        ["relations","Relations",groupedPrimitives.relations],
        ["other","Other",groupedPrimitives.other]
      ] as Array<[PrimitiveGroupKey,string,Primitive[]]>).map(([key,label,items])=>items.length>0&&<section className="myenv-index-group" key={key}>
        <p>{label}</p>
        {items.map(primitive=><button
          key={primitive.primitive_key}
          type="button"
          className="myenv-index-item"
          aria-current={activePanel==="primitive:"+primitive.primitive_key?"page":undefined}
          onClick={()=>{setActivePanel("primitive:"+primitive.primitive_key);setEnvironmentIndexOpen(false)}}
        >
          <span>{primitive.display_label}</span>
          <small>{primitiveMeta(primitive)}</small>
        </button>)}
      </section>)}
      {initiatives.length>0&&<section className="myenv-index-group">
        <p>Initiatives</p>
        {initiatives.map(initiative=>{
          const label=initiativeLabel(initiative)
          return <button
            key={initiative.initiative_key}
            type="button"
            className="myenv-index-item myenv-index-item--initiative"
            aria-current={activePanel==="initiative:"+initiative.initiative_key?"page":undefined}
            onClick={()=>{setActivePanel("initiative:"+initiative.initiative_key);setEnvironmentIndexOpen(false)}}
          >
            <span>{label}</span>
            <small>{initiative.target_environment_key||"initiative relation"}</small>
          </button>
        })}
      </section>}
      {hasOperatorContext&&<section className="myenv-index-group myenv-index-system">
        <p>System</p>
        <a className="myenv-index-item myenv-index-system-link" href="/c3ops">
          <span>C3OPS ↗</span>
          <small>operator system surface</small>
        </a>
      </section>}
    </nav>

    {(activePrimitive||activeInitiative)&&<div
      className="myenv-overlay"
      role="presentation"
      onMouseDown={event=>{if(event.currentTarget===event.target)setActivePanel(null)}}
    >
      <section className="myenv-panel" role="dialog" aria-modal="true" aria-label={activePrimitive?.display_label||"Initiative"}>
        <button className="myenv-panel-close" type="button" aria-label="Close" onClick={()=>setActivePanel(null)}>×</button>
        {activePrimitive&&renderPrimitive(activePrimitive)}
        {activeInitiative&&<section className="myenv-connections-thread">
          <div className="myenv-thread-heading">
            <p className="myenv-kicker">{(activeInitiative.context_class==="operator"?"operator":activeInitiative.visibility_source).toUpperCase()}</p>
            <h2>{initiativeLabel(activeInitiative)}</h2>
            <p>{activeInitiative.context_class==="operator"
              ?"This initiative is available because this environment carries an active initiative-operator binding. Operator context does not create participant standing."
              :"This initiative is visible because this environment has an evidenced encounter or invitation relation."}</p>
          </div>
          {activeInitiative.initiative_key==="47pct"&&<article className="myenv-initiative-card myenv-initiative-memorial" aria-label="Eternal Flame memorial"><span>MEMORIAL</span><EternalFlame /></article>}
          {activeInitiative.components.filter(component=>component.renderer_key==="initiative.entry_card").map(component=>{
            const config=component.config||{}
            const held=config.display_state==="held"||config.interaction_enabled===false
            const holdReasons=Array.isArray(config.hold_reasons)?config.hold_reasons.filter((value):value is string=>typeof value==="string"):[]
            return <article key={component.component_key} className="myenv-initiative-card" aria-disabled={held||undefined} style={held?{opacity:.58,filter:"grayscale(1)"}:undefined}>
              <div>
                <span>{held?text(config.status_label,"HOLD"):text(config.target_environment_label,activeInitiative.target_environment_key||"initiative")}</span>
                <h3>{text(config.title,activeInitiative.initiative_key)}</h3>
                {text(config.summary)&&<p>{text(config.summary)}</p>}
                {held&&holdReasons.length>0&&<ul>{holdReasons.map(reason=><li key={reason}>{reason}</li>)}</ul>}
              </div>
              {!held&&text(config.route)&&<a href={text(config.route)}>ENTER →</a>}
            </article>
          })}
        </section>}
      </section>
    </div>}
  </main>
}
