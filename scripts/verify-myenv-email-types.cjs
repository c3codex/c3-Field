const ts=require('typescript'),cp=require('node:child_process'),path=require('node:path')
const base='07dc116f70c99948e0a0ce2204b0e553ecb2735e'
const changed=['functions/_lib/free-nugs.ts','functions/api/my-environment-cancom-email.ts','src/c3_field_connect/MyEnvironmentEncounter.tsx']
function check(files,options,baseline){
  const host=ts.createCompilerHost(options),read=host.readFile
  const original=new Map(baseline?changed.map(f=>[path.resolve(f),cp.execFileSync('git',['show',base+':'+f],{encoding:'utf8'})]):[])
  host.readFile=f=>original.get(path.resolve(f))??read(f)
  return ts.getPreEmitDiagnostics(ts.createProgram(files,options,host)).map(d=>({file:d.file?path.relative(process.cwd(),d.file.fileName):null,code:d.code,message:ts.flattenDiagnosticMessageText(d.messageText,' ')})).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)))
}
const opts={noEmit:true,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,skipLibCheck:true,types:['@cloudflare/workers-types','node'],lib:['lib.es2023.d.ts','lib.dom.d.ts'],jsx:ts.JsxEmit.ReactJSX}
const fn=['functions/api/my-environment-cancom-email.ts','functions/_lib/free-nugs.ts'],front=['src/c3_field_connect/MyEnvironmentEncounter.tsx']
let pass=true
for(const [name,files] of [['server',fn],['frontend',front]]){
  const before=check(files,opts,true),after=check(files,opts,false),equal=JSON.stringify(before)===JSON.stringify(after)
  console.log(JSON.stringify({name,baseline:before,current:after,no_new_diagnostics:equal}));pass&&=equal
}
process.exitCode=pass?0:1
