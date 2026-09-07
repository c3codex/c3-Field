import assert from "node:assert/strict"
import {mkdir,writeFile,readFile} from "node:fs/promises"
import path from "node:path"
import {pathToFileURL} from "node:url"
import {createServer} from "node:http"
const {chromium} = await import(process.argv[2] ? pathToFileURL(process.argv[2]).href : "playwright")
const out = path.resolve("../evidence/browser")
await mkdir(out,{recursive:true})
const browser = await chromium.launch({headless:true,executablePath:process.argv[3] || undefined})
const results = []
const errors = []
const context = await browser.newContext({viewport:{width:1440,height:1000}})
context.setDefaultTimeout(20000)
await context.route("**/*", route => {
  const url = new URL(route.request().url())
  return ["127.0.0.1","localhost"].includes(url.hostname) ? route.continue() : route.abort()
})
const page = await context.newPage()
page.on("pageerror",e=>errors.push(e.message))
try {
  await page.goto("http://127.0.0.1:5188/")
  console.log("review page loaded")
  await page.getByRole("heading",{name:"Together, Our Potential Is Unlimited."}).waitFor()
  assert.equal(await page.locator("input[type=checkbox]:checked").count(),0)
  assert.equal(await page.locator("select[name=connectAs] option").count(),1)
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),true)
  assert.ok(await page.locator(".c3-connect-identity img").evaluate(img=>img.complete && img.naturalWidth>0))
  await page.screenshot({path:path.join(out,"desktop.png"),fullPage:true})
  await page.waitForFunction(()=>document.querySelector("video")?.readyState>=1,undefined,{timeout:20000})
  const desktopMedia = await page.locator("video").evaluate(video=>({src:video.currentSrc,width:video.videoWidth,height:video.videoHeight,duration:video.duration}))
  assert.ok(desktopMedia.src.endsWith("/intro.mp4"))
  await page.screenshot({path:path.join(out,"desktop.png"),fullPage:true})
  results.push({check:"desktop rendering",passed:true,width:1440,media:desktopMedia})
  let posts=0
  page.on("request",r=>{if(r.method()==="POST" && r.url().includes("c3-community-connect-capture"))posts++})
  await page.getByLabel("Name",{exact:true}).fill("Review Participant")
  await page.getByLabel("Email",{exact:true}).fill("review@example.invalid")
  await page.getByRole("button",{name:"CONNECT"}).click()
  assert.equal(posts,0)
  results.push({check:"missing explicit consent prevents submission",passed:true})
  await page.locator("input[name=consent]").check()
  await page.locator("input[name=attestation]").check()
  await page.locator("input[name=participationIntention]").check()
  await page.locator("textarea").fill("Connect people with shared skills.")
  const responsePromise=page.waitForResponse(r=>r.url().includes("c3-community-connect-capture"))
  await page.getByRole("button",{name:"CONNECT"}).click()
  const response=await responsePromise
  assert.equal(response.status(),409)
  const body=await response.json()
  assert.equal(body.saved,false)
  assert.equal(body.candidate_evidence.consent_present,true)
  assert.equal(body.candidate_evidence.relationship.participation_intention,true)
  assert.equal(body.candidate_evidence.registration,"not_attempted")
  assert.equal(body.candidate_evidence.notchazz,"not_invoked")
  await page.getByRole("status").filter({hasText:"Your information has not been saved."}).waitFor()
  assert.equal(await page.getByLabel("Name",{exact:true}).inputValue(),"Review Participant")
  await page.screenshot({path:path.join(out,"capture-held.png"),fullPage:true})
  results.push({check:"actual Pages handler receives surfaced evidence and holds before persistence",passed:true,response:body})
  await page.route("**/api/c3-community-connect-capture",route=>route.abort())
  await page.getByRole("button",{name:"CONNECT"}).click()
  await page.getByRole("status").filter({hasText:"We could not reach"}).waitFor()
  assert.equal(await page.getByLabel("Email",{exact:true}).inputValue(),"review@example.invalid")
  results.push({check:"network failure preserves form without false success",passed:true})
  await page.unroute("**/api/c3-community-connect-capture")
  await page.setViewportSize({width:390,height:844})
  await page.goto("http://127.0.0.1:5188/")
  await page.getByRole("heading",{name:"Together, Our Potential Is Unlimited."}).waitFor()
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),true)
  await page.waitForFunction(()=>document.querySelector("video")?.readyState>=1)
  const mobileMedia = await page.locator("video").evaluate(video=>({src:video.currentSrc,width:video.videoWidth,height:video.videoHeight,duration:video.duration}))
  assert.ok(mobileMedia.src.endsWith("/intro-vertical.mp4"))
  await page.screenshot({path:path.join(out,"mobile.png"),fullPage:true})
  results.push({check:"mobile rendering and responsive media",passed:true,width:390,media:mobileMedia})
  await page.goto("http://127.0.0.1:5188/not-seated")
  await page.getByRole("heading",{name:"This page is not available yet."}).waitFor()
  assert.equal(await page.locator("form").count(),0)
  results.push({check:"unknown path does not expose an encounter",passed:true})
  const dist = path.resolve("dist")
  const production = createServer(async(req,res)=>{
    try {
      const pathname = new URL(req.url,"http://127.0.0.1:5190").pathname
      const file = path.resolve(dist,"." + (pathname === "/" ? "/index.html" : pathname))
      if (!file.startsWith(dist + path.sep)) {res.writeHead(403);res.end();return}
      const mime = {".html":"text/html",".js":"text/javascript",".css":"text/css"}[path.extname(file)] ?? "application/octet-stream"
      res.setHeader("Content-Type",mime)
      res.end(await readFile(file))
    }catch{res.writeHead(404);res.end()}
  })
  await new Promise(resolve=>production.listen(5190,"127.0.0.1",resolve))
  try {
    await page.setViewportSize({width:1440,height:1000})
    await page.goto("http://127.0.0.1:5190/?review=1")
    await page.getByRole("heading",{name:"This page is not available yet."}).waitFor()
    assert.equal(await page.locator("form").count(),0)
    assert.equal(await page.locator("video").count(),0)
    await page.screenshot({path:path.join(out,"production-held.png"),fullPage:true})
    results.push({check:"production build stays held even on loopback with review query",passed:true})
  } finally {await new Promise(resolve=>production.close(resolve))}
  assert.deepEqual(errors,[])
} finally {
  await writeFile(path.join(out,"results.json"),JSON.stringify({results,errors},null,2))
  await browser.close()
}
console.log(JSON.stringify({passed:results.length,results,errors},null,2))
