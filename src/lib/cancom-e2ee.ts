export type CanComDeviceBundle={
  device_key:string
  relationship_key:string
  encryption_public_key:string
  signing_public_key:string
  key_fingerprint:string
  participant_role:"requester"|"peer"
  created_at?:string
}

export type CanComKeyWrap={
  device_key:string
  relationship_key:string
  ephemeral_public_key:string
  salt:string
  iv:string
  wrapped_key:string
}

export type CanComEncryptedPacket={
  message_key:string
  sender_device_key:string
  ciphertext:string
  content_iv:string
  key_wraps:CanComKeyWrap[]
  signature:string
  additional_data:string
  ciphertext_sha256:string
}

export type CanComResolvableMessage={
  message_key:string
  connection_key:string
  sender_relationship_key:string
  message_type:string
  body?:string|null
  created_at:string
  payload_mode?:string|null
  sender_device_key?:string|null
  sender_signing_public_key?:string|null
  sender_key_fingerprint?:string|null
  crypto_protocol?:string|null
  crypto_version?:string|null
  ciphertext?:string|null
  content_iv?:string|null
  key_wraps?:CanComKeyWrap[]|null
  signature?:string|null
  signature_algorithm?:string|null
  additional_data?:string|null
  content_sha256?:string|null
  content_visibility?:string|null
}

export type CanComDeviceIdentity={
  deviceKey:string
  encryptionPrivateKey:CryptoKey
  signingPrivateKey:CryptoKey
  encryptionPublicKey:string
  signingPublicKey:string
  fingerprint:string
  createdAt:string
}

const DB_NAME="c3-cancom-e2ee-v1"
const DB_VERSION=1
const STORE_NAME="device_identity"
const STORE_KEY="primary"
const encoder=new TextEncoder()
const decoder=new TextDecoder()

function bytesToBase64(bytes:Uint8Array){
  let binary=""
  const chunk=0x8000
  for(let i=0;i<bytes.length;i+=chunk){
    binary+=String.fromCharCode(...bytes.subarray(i,Math.min(i+chunk,bytes.length)))
  }
  return btoa(binary)
}
function base64ToBytes(value:string){
  const binary=atob(value)
  const bytes=new Uint8Array(binary.length)
  for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i)
  return bytes
}
function bufferToBase64(buffer:ArrayBuffer){return bytesToBase64(new Uint8Array(buffer))}
async function sha256Hex(data:Uint8Array){
  const digest=await crypto.subtle.digest("SHA-256",data)
  return Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,"0")).join("")
}
async function sha256Text(value:string){return sha256Hex(encoder.encode(value))}

function openDb(){
  return new Promise<IDBDatabase>((resolve,reject)=>{
    const request=indexedDB.open(DB_NAME,DB_VERSION)
    request.onupgradeneeded=()=>{
      const db=request.result
      if(!db.objectStoreNames.contains(STORE_NAME))db.createObjectStore(STORE_NAME,{keyPath:"id"})
    }
    request.onsuccess=()=>resolve(request.result)
    request.onerror=()=>reject(request.error||new Error("cancom_crypto_storage_unavailable"))
  })
}
async function readStoredIdentity(){
  const db=await openDb()
  try{
    return await new Promise<(CanComDeviceIdentity&{id:string})|null>((resolve,reject)=>{
      const tx=db.transaction(STORE_NAME,"readonly")
      const request=tx.objectStore(STORE_NAME).get(STORE_KEY)
      request.onsuccess=()=>resolve((request.result as CanComDeviceIdentity&{id:string})||null)
      request.onerror=()=>reject(request.error||new Error("cancom_crypto_storage_read_failed"))
    })
  }finally{db.close()}
}
async function writeStoredIdentity(identity:CanComDeviceIdentity){
  const db=await openDb()
  try{
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction(STORE_NAME,"readwrite")
      tx.objectStore(STORE_NAME).put({id:STORE_KEY,...identity})
      tx.oncomplete=()=>resolve()
      tx.onerror=()=>reject(tx.error||new Error("cancom_crypto_storage_write_failed"))
      tx.onabort=()=>reject(tx.error||new Error("cancom_crypto_storage_write_failed"))
    })
  }finally{db.close()}
}

export function canUseCanComE2ee(){
  return typeof window!=="undefined"&&window.isSecureContext&&!!window.crypto?.subtle&&typeof indexedDB!=="undefined"
}

export async function ensureCanComDeviceIdentity():Promise<CanComDeviceIdentity>{
  if(!canUseCanComE2ee())throw new Error("cancom_e2ee_not_supported")
  const stored=await readStoredIdentity()
  if(stored)return stored

  const encryptionPair=await crypto.subtle.generateKey(
    {name:"X25519"},
    false,
    ["deriveBits"]
  ) as CryptoKeyPair
  const signingPair=await crypto.subtle.generateKey(
    {name:"Ed25519"},
    false,
    ["sign","verify"]
  ) as CryptoKeyPair

  const encryptionPublicKey=bufferToBase64(await crypto.subtle.exportKey("raw",encryptionPair.publicKey))
  const signingPublicKey=bufferToBase64(await crypto.subtle.exportKey("raw",signingPair.publicKey))
  const fingerprint=await sha256Text(encryptionPublicKey+":"+signingPublicKey)

  const identity:CanComDeviceIdentity={
    deviceKey:"device_"+crypto.randomUUID(),
    encryptionPrivateKey:encryptionPair.privateKey,
    signingPrivateKey:signingPair.privateKey,
    encryptionPublicKey,
    signingPublicKey,
    fingerprint,
    createdAt:new Date().toISOString()
  }
  await writeStoredIdentity(identity)
  return identity
}

function wrapInfo(messageKey:string,connectionKey:string,deviceKey:string){
  return encoder.encode("c3-cancom-wrap-v1|"+messageKey+"|"+connectionKey+"|"+deviceKey)
}

async function deriveWrappingKey(
  privateKey:CryptoKey,
  peerPublicKeyBase64:string,
  salt:Uint8Array,
  info:Uint8Array
){
  const peerPublicKey=await crypto.subtle.importKey(
    "raw",
    base64ToBytes(peerPublicKeyBase64),
    {name:"X25519"},
    false,
    []
  )
  const shared=await crypto.subtle.deriveBits(
    {name:"X25519",public:peerPublicKey},
    privateKey,
    256
  )
  const ikm=await crypto.subtle.importKey("raw",shared,"HKDF",false,["deriveKey"])
  return crypto.subtle.deriveKey(
    {name:"HKDF",hash:"SHA-256",salt,info},
    ikm,
    {name:"AES-GCM",length:256},
    false,
    ["encrypt","decrypt"]
  )
}

function canonicalSignatureInput(
  additionalData:string,
  ciphertext:string,
  contentIv:string,
  wraps:CanComKeyWrap[]
){
  return JSON.stringify({
    protocol:"c3_cancom_e2ee_v1",
    version:"1",
    additional_data:additionalData,
    ciphertext,
    content_iv:contentIv,
    key_wraps:[...wraps].sort((a,b)=>a.device_key.localeCompare(b.device_key))
  })
}

export async function encryptCanComMessage(input:{
  connectionKey:string
  messageType:string
  plaintext:string
  identity:CanComDeviceIdentity
  devices:CanComDeviceBundle[]
}):Promise<CanComEncryptedPacket>{
  const devices=[...new Map(input.devices.map(device=>[device.device_key,device])).values()]
    .filter(device=>device.encryption_public_key&&device.signing_public_key)
    .sort((a,b)=>a.device_key.localeCompare(b.device_key))

  if(!devices.some(device=>device.participant_role==="peer"))throw new Error("recipient_secure_device_unavailable")
  if(!devices.some(device=>device.device_key===input.identity.deviceKey))throw new Error("sender_secure_device_unresolved")

  const messageKey=crypto.randomUUID()
  const additionalData=JSON.stringify({
    protocol:"c3_cancom_e2ee_v1",
    version:"1",
    message_key:messageKey,
    connection_key:input.connectionKey,
    message_type:input.messageType,
    sender_device_key:input.identity.deviceKey
  })
  const additionalDataBytes=encoder.encode(additionalData)
  const contentKeyBytes=crypto.getRandomValues(new Uint8Array(32))
  const contentKey=await crypto.subtle.importKey(
    "raw",
    contentKeyBytes,
    {name:"AES-GCM"},
    false,
    ["encrypt","decrypt"]
  )
  const contentIv=crypto.getRandomValues(new Uint8Array(12))
  const encrypted=await crypto.subtle.encrypt(
    {name:"AES-GCM",iv:contentIv,additionalData:additionalDataBytes,tagLength:128},
    contentKey,
    encoder.encode(input.plaintext)
  )
  const ciphertext=bufferToBase64(encrypted)
  const wraps:CanComKeyWrap[]=[]

  for(const device of devices){
    const ephemeral=await crypto.subtle.generateKey(
      {name:"X25519"},
      false,
      ["deriveBits"]
    ) as CryptoKeyPair
    const ephemeralPublicKey=bufferToBase64(await crypto.subtle.exportKey("raw",ephemeral.publicKey))
    const salt=crypto.getRandomValues(new Uint8Array(32))
    const iv=crypto.getRandomValues(new Uint8Array(12))
    const info=wrapInfo(messageKey,input.connectionKey,device.device_key)
    const wrappingKey=await deriveWrappingKey(ephemeral.privateKey,device.encryption_public_key,salt,info)
    const wrappedKey=await crypto.subtle.encrypt(
      {name:"AES-GCM",iv,additionalData:info,tagLength:128},
      wrappingKey,
      contentKeyBytes
    )
    wraps.push({
      device_key:device.device_key,
      relationship_key:device.relationship_key,
      ephemeral_public_key:ephemeralPublicKey,
      salt:bytesToBase64(salt),
      iv:bytesToBase64(iv),
      wrapped_key:bufferToBase64(wrappedKey)
    })
  }

  contentKeyBytes.fill(0)
  const signatureInput=canonicalSignatureInput(additionalData,ciphertext,bytesToBase64(contentIv),wraps)
  const signature=await crypto.subtle.sign(
    {name:"Ed25519"},
    input.identity.signingPrivateKey,
    encoder.encode(signatureInput)
  )

  return {
    message_key:messageKey,
    sender_device_key:input.identity.deviceKey,
    ciphertext,
    content_iv:bytesToBase64(contentIv),
    key_wraps:wraps,
    signature:bufferToBase64(signature),
    additional_data:additionalData,
    ciphertext_sha256:await sha256Hex(new Uint8Array(encrypted))
  }
}

function pinSenderSigningKey(deviceKey:string,signingPublicKey:string){
  const storageKey="c3.cancom.sender-signing-key."+deviceKey
  const pinned=localStorage.getItem(storageKey)
  if(pinned&&pinned!==signingPublicKey)throw new Error("cancom_sender_key_changed")
  if(!pinned)localStorage.setItem(storageKey,signingPublicKey)
}

export async function decryptCanComMessage(
  message:CanComResolvableMessage,
  identity:CanComDeviceIdentity
){
  if(message.payload_mode!=="e2ee_ciphertext")return message.body||""
  if(
    message.crypto_protocol!=="c3_cancom_e2ee_v1"||
    message.crypto_version!=="1"||
    !message.ciphertext||
    !message.content_iv||
    !message.additional_data||
    !message.signature||
    !message.sender_device_key||
    !message.sender_signing_public_key||
    !Array.isArray(message.key_wraps)
  )throw new Error("cancom_encrypted_message_invalid")

  const computedHash=await sha256Hex(base64ToBytes(message.ciphertext))
  if(message.content_sha256&&computedHash!==message.content_sha256)
    throw new Error("cancom_ciphertext_integrity_failed")

  pinSenderSigningKey(message.sender_device_key,message.sender_signing_public_key)
  const signingPublicKey=await crypto.subtle.importKey(
    "raw",
    base64ToBytes(message.sender_signing_public_key),
    {name:"Ed25519"},
    false,
    ["verify"]
  )
  const signatureInput=canonicalSignatureInput(
    message.additional_data,
    message.ciphertext,
    message.content_iv,
    message.key_wraps
  )
  const signatureValid=await crypto.subtle.verify(
    {name:"Ed25519"},
    signingPublicKey,
    base64ToBytes(message.signature),
    encoder.encode(signatureInput)
  )
  if(!signatureValid)throw new Error("cancom_signature_invalid")

  const wrap=message.key_wraps.find(item=>item.device_key===identity.deviceKey)
  if(!wrap)throw new Error("cancom_message_not_addressed_to_device")

  const salt=base64ToBytes(wrap.salt)
  const iv=base64ToBytes(wrap.iv)
  const info=wrapInfo(message.message_key,message.connection_key,identity.deviceKey)
  const wrappingKey=await deriveWrappingKey(
    identity.encryptionPrivateKey,
    wrap.ephemeral_public_key,
    salt,
    info
  )
  const contentKeyBytes=await crypto.subtle.decrypt(
    {name:"AES-GCM",iv,additionalData:info,tagLength:128},
    wrappingKey,
    base64ToBytes(wrap.wrapped_key)
  )
  const contentKey=await crypto.subtle.importKey(
    "raw",
    contentKeyBytes,
    {name:"AES-GCM"},
    false,
    ["decrypt"]
  )
  const plaintext=await crypto.subtle.decrypt(
    {
      name:"AES-GCM",
      iv:base64ToBytes(message.content_iv),
      additionalData:encoder.encode(message.additional_data),
      tagLength:128
    },
    contentKey,
    base64ToBytes(message.ciphertext)
  )
  new Uint8Array(contentKeyBytes).fill(0)
  return decoder.decode(plaintext)
}
