import assert from "node:assert/strict"
import {createServer} from "node:http"
import {writeFile,mkdir} from "node:fs/promises"
import {pathToFileURL} from "node:url"
import {onRequestGet} from "../functions/api/c3-community-connect-verify"
const {chromium}=await import(process.argv[2] ? pathToFileURL(process.argv[2]).href : "playwright")
const request=new Request("https://example.invalid/api/c3-community-connect-verify")
const response=await onRequestGet({request,env:{}} as any), html=await response.text()
const server=createServer((req,res)=>{res.writeHead(200,Object.fromEntries(response.headers));res.end(html)})
await new Promise<void>(resolve=>server.listen(5195,"127.0.0.1",resolve))
const browser=await chromium.launch({headless:true,executablePath:process.argv[3] || undefined})
const results=[]
try{
 for(const size of [{width:1440,height:900},{width:390,height:844}]){
  const page=await browser.newPage({viewport:size})
  let posts=0
  await page.route("**/api/c3-community-connect-verify",async route=>{
   if(route.request().method()==="POST"){posts++;await route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({standing:"connection_recorded",saved:true})})}
   else await route.continue()
  })
  await page.goto("http://127.0.0.1:5195/api/c3-community-connect-verify#receipt=synthetic&token=test")
  await page.getByRole("button",{name:"Confirm connection"}).waitFor()
  assert.equal(posts,0);assert.equal(new URL(page.url()).hash,"")
  await page.getByRole("button",{name:"Confirm connection"}).click()
  await page.getByRole("status").filter({hasText:"confirmed and recorded"}).waitFor()
  assert.equal(posts,1)
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true)
  await mkdir("../evidence/browser",{recursive:true})
  await page.screenshot({path:"../evidence/browser/confirmation-"+size.width+".png",fullPage:true})
  results.push({width:size.width,inert_get:true,fragment_scrubbed:true,explicit_post:true,mocked_result:true})
  await page.close()
 }
 const page=await browser.newPage()
 await page.route("**/api/c3-community-connect-verify",async route=>route.request().method()==="POST"?route.fulfill({status:409,contentType:"application/json",body:'{"standing":"held_verification","saved":false}'}):route.continue())
 await page.goto("http://127.0.0.1:5195/api/c3-community-connect-verify#receipt=synthetic&token=test")
 await page.getByRole("button").click()
 await page.getByRole("status").filter({hasText:"could not confirm"}).waitFor()
 results.push({held_callback_no_success:true})
 await writeFile("../evidence/browser/results.json",JSON.stringify(results,null,2))
 console.log(JSON.stringify(results))
}finally{await browser.close();server.close()}
