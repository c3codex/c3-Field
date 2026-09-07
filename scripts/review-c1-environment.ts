import {createServer as createHttpServer} from "node:http"
import {createReadStream, readFileSync, statSync} from "node:fs"
import {createHash} from "node:crypto"
import path from "node:path"
import {createServer as createViteServer} from "vite"
import {c1ReviewPackage, mediaBindings, packageSourceIds, verifyRegistrySnapshot} from "./c1-review-package"
import {onRequestPost} from "../functions/api/c3-community-connect-capture"

const evidence = path.resolve(process.argv[2] ?? "../evidence")
const sha256 = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex")
const registry = JSON.parse(readFileSync(path.join(evidence,"registry-rows.json"),"utf8"))
if (!verifyRegistrySnapshot(registry)) throw new Error("Registry snapshot does not qualify for this held local review")
const documents = JSON.parse(readFileSync(path.join(evidence,"package-sources.json"),"utf8"))
for (const id of [packageSourceIds.manifest,packageSourceIds.homepage,packageSourceIds.encounter]) {
  if (!documents.some((doc: any) => doc.id === id && doc.content && !doc.is_empty)) throw new Error("Package source missing")
}
const text = documents.map((doc: any) => doc.content).join("\n").toLowerCase()
for (const [field,copy] of Object.entries(c1ReviewPackage.copy)) {
  if (!text.includes(copy.toLowerCase())) throw new Error("Package copy not found in source: " + field)
}
if (sha256(readFileSync(path.join(evidence,"oar2.raw.txt"))) !== "c4da8887a52f374963f77dd885086bb0a7e41a7787b411bb5ff0ebf06e80497b") throw new Error("OAR2 hash mismatch")
for (const asset of mediaBindings) {
  if (sha256(readFileSync(path.join(evidence,"media",asset.name))) !== asset.sha256) throw new Error("Asset hash mismatch: " + asset.name)
}
process.env.VITE_C1_REVIEW = "1"
const vite = await createViteServer({mode:"c3field",server:{middlewareMode:true,host:"127.0.0.1"},appType:"spa"})
const host = "127.0.0.1:5188"
const server = createHttpServer(async (req,res) => {
  try {
    if (req.headers.host !== host) { res.writeHead(403);res.end();return }
    const url = new URL(req.url ?? "/", "http://" + host)
    res.setHeader("Cache-Control","no-store")
    if (url.pathname === "/api/c3-community-connect-package") {
      res.setHeader("Content-Type","application/json")
      res.end(JSON.stringify(c1ReviewPackage)); return
    }
    if (url.pathname === "/api/c3-community-connect-capture" && req.method === "POST") {
      const request = new Request(url,{method:"POST",headers:new Headers(req.headers as Record<string,string>),body:req as any,duplex:"half"} as RequestInit)
      const response = await onRequestPost({request} as any)
      res.writeHead(response.status,Object.fromEntries(response.headers.entries()))
      res.end(await response.text()); return
    }
    if (url.pathname.startsWith("/api/")) {res.writeHead(423);res.end("Local review only");return}
    if (url.pathname.startsWith("/c1-review-media/")) {
      const name = url.pathname.slice("/c1-review-media/".length)
      const asset = mediaBindings.find(item => item.name === name)
      if (!asset) {res.writeHead(404);res.end();return}
      const file = path.join(evidence,"media",asset.name), size = statSync(file).size
      const match = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range ?? "")
      const start = match ? Number(match[1]) : 0
      const end = match?.[2] ? Math.min(Number(match[2]),size-1) : size-1
      if (start > end || start >= size) {res.writeHead(416,{"Content-Range":"bytes */"+size});res.end();return}
      res.setHeader("Content-Type",asset.type)
      res.setHeader("Accept-Ranges","bytes")
      res.setHeader("Content-Length",end-start+1)
      if (match) {res.statusCode=206;res.setHeader("Content-Range","bytes "+start+"-"+end+"/"+size)}
      if (req.method === "HEAD") {res.end();return}
      createReadStream(file,{start,end}).pipe(res);return
    }
    vite.middlewares(req,res)
  } catch { res.writeHead(500);res.end("Local review unavailable") }
})
server.listen(5188,"127.0.0.1",() => console.log("C1 local review at http://" + host + " — source and media hashes verified; no persistence or outbound adapters."))
const close = async () => {server.close();await vite.close();process.exit(0)}
process.on("SIGINT",close)
process.on("SIGTERM",close)
