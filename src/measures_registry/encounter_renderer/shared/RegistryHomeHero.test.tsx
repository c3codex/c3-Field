import test from "node:test"
import assert from "node:assert/strict"
import React from "react"
import {renderToStaticMarkup} from "react-dom/server"
import {RegistryHomeHero} from "./RegistryHomeHero"
const hero={source_pac_key:"approved_home_pac",brand_name:"Approved Registry",headline:"Approved headline",body:"Exact governed context",primary_cta:"Approved CTA",primary_cta_route:"/assessment",primary_cta_target:"obsidian_chamber_orientation",public_release_authorized:true,copy_standing:"released_governed_public_copy",frontend_hardcode_allowed:false,semantic_html_allowed:true,visual_contract:{architectural_stage_mode:"frontend_css",baked_reference_copy_authoritative:false,stage_copy_allowed:false,background_media_role:"hero_background"},free_header:{free_source_authority:"webpac",source_pac_key:"approved_home_pac"}}
const render=(homeHero:any,backgroundUrl:string|null="https://media.example/approved.webp")=>renderToStaticMarkup(React.createElement(RegistryHomeHero,{homeHero,backgroundUrl,onAssessment:()=>{}}))
test("registered home context is semantic visible DOM from the guarded WebPAC projection",()=>{
 const html=render(hero);assert(html.includes("<h1"));assert(html.includes(hero.headline));assert(html.includes(hero.body));assert(html.includes(hero.primary_cta));assert(html.includes('data-copy-authority="webpac_via_registry_projection"'))
})
test("missing, unreleased or misbound home authority cannot fall back to invented copy",()=>{
 for(const value of [null,{...hero,public_release_authorized:false},{...hero,headline:""},{...hero,free_header:{...hero.free_header,source_pac_key:"wrong_pac"}}]){const html=render(value);assert(html.includes('role="status"'));assert(!html.includes(hero.body));assert(!html.includes("<h1"))}
 assert(!render(hero,null).includes(hero.body))
})
