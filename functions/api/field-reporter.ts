import {fieldReporterResponse} from "../_lib/field-reporter"
import type {InitiativeSurfaceEnv} from "../_lib/initiative-surface-host"
export const onRequestGet:PagesFunction<InitiativeSurfaceEnv>=({request,env})=>fieldReporterResponse(request,env)
export const onRequest:PagesFunction=async()=>new Response("method not allowed",{status:405})
