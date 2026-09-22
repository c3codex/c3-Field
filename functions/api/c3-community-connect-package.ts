import {type PassageEnv} from "../_lib/c1-passage"
import {c1RuntimePackage} from "../../src/c3_field_connect/c1RuntimePackage"

const headers={"content-type":"application/json; charset=utf-8","cache-control":"no-store"}

export const onRequestGet: PagesFunction<PassageEnv> = async ({env}) => {
  if(env.C1_PASSAGE_ENABLED!=="true")
    return new Response(JSON.stringify({available:false,reviewOnly:false,message:"The Connect encounter is not available."}),{status:423,headers})
  return new Response(JSON.stringify(c1RuntimePackage),{status:200,headers})
}

export const onRequest: PagesFunction = async () =>
  new Response(JSON.stringify({error:"method not allowed"}),{status:405,headers:{...headers,allow:"GET"}})
