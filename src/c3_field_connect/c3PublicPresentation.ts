export type C3PublicDocumentSection={heading:string;body:string}
export type C3PublicDocument={title:string;route:string;effective_date?:string;intro?:string;body?:string;email?:string;sections?:C3PublicDocumentSection[]}
export type C3PublicPresentation={
  brand:string
  legal_entity:string
  environment_name:string
  environment_definition:string
  intro_state_key:string
  landing_state_key:string
  connect_route:string
  contact_email:string
  brand_line:string
  footer_line:string
  navigation:{label:string;route:string}[]
  public_documents:{key:string;title:string;route:string;standing:string}[]
  media_roles:Record<string,string>
  privacy_document:C3PublicDocument
  terms_document:C3PublicDocument
  contact_document:C3PublicDocument
  footer:{brand:string;environment_line:string;legal_entity:string;brand_line:string;copyright:string}
  landing:Record<string,string>
  seo:{title:string;description:string;canonical_url:string;og_image_asset_key:string;og_type:string}
}

export async function loadC3PublicPresentation(){
  const response=await fetch("/api/c3-public-presentation",{headers:{accept:"application/json"}})
  const body=await response.json().catch(()=>null) as {standing?:string;presentation?:C3PublicPresentation}|null
  if(!response.ok||body?.standing!=="bounded_public_runtime"||!body.presentation) throw new Error("c3_public_presentation_unavailable")
  return body.presentation
}
