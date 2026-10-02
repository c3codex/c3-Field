const ts=require('typescript')
const fs=require('node:fs')
const path=require('node:path')
const cp=require('node:child_process')
const base='e3e461080938ec14e45951ab45956cb4292f6ca1'
function diagnostics(files,options,baseline=false){
  const host=ts.createCompilerHost(options)
  const read=host.readFile
  const overridden=new Map()
  if(baseline)for(const file of ['src/c3_field_connect/OperationsPanel.tsx','functions/api/my-environment-operations.ts','functions/_lib/me-environment.ts']){
    overridden.set(path.resolve(file),cp.execFileSync('git',['show',base+':'+file],{encoding:'utf8'}))
  }
  host.readFile=file=>overridden.has(path.resolve(file))?overridden.get(path.resolve(file)):read(file)
  const program=ts.createProgram(files,options,host)
  return ts.getPreEmitDiagnostics(program).map(d=>({code:d.code,file:d.file?path.relative(process.cwd(),d.file.fileName).replaceAll('\\','/'):null,
    line:d.file&&d.start!==undefined?d.file.getLineAndCharacterOfPosition(d.start).line+1:null,
    message:ts.flattenDiagnosticMessageText(d.messageText,'\n')})).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)))
}
const config=ts.readConfigFile('tsconfig.app.json',ts.sys.readFile)
const parsed=ts.parseJsonConfigFileContent(config.config,ts.sys,process.cwd())
parsed.options.ignoreDeprecations='5.0'
const frontend=diagnostics(parsed.fileNames,parsed.options)
const baselineFrontend=diagnostics(parsed.fileNames,parsed.options,true)
const options={noEmit:true,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,
  moduleResolution:ts.ModuleResolutionKind.Bundler,skipLibCheck:true,types:['@cloudflare/workers-types','node'],
  lib:['lib.es2023.d.ts','lib.dom.d.ts']}
const functions=['functions/_lib/c3ops-oar-optics.ts','functions/_lib/me-environment.ts','functions/api/my-environment-operations.ts',
  'functions/api/my-environment-operations.test.ts','scripts/lib/cancom-oar-passage.ts']
const fn=diagnostics(functions,options)
const baselineFn=diagnostics(['functions/api/my-environment-operations.ts','functions/_lib/me-environment.ts'],options,true)
const panel=diagnostics(['src/c3_field_connect/OperationsPanel.tsx'],{...options,jsx:ts.JsxEmit.ReactJSX})
const report={typescript_version:ts.version,base_revision:base,
  config_override:'ignoreDeprecations=5.0 for locked TypeScript 5.9.3; repository config 6.0 is invalid',
  frontend_diagnostics:frontend,baseline_frontend_diagnostics:baselineFrontend,
  frontend_baseline_identical:JSON.stringify(frontend)===JSON.stringify(baselineFrontend),
  functions_diagnostics:fn,baseline_functions_diagnostics:baselineFn,
  functions_baseline_identical:JSON.stringify(fn)===JSON.stringify(baselineFn),
  changed_panel_diagnostics:panel}
const destination=process.argv[2]
if(destination)fs.writeFileSync(destination,JSON.stringify(report,null,2)+'\n')
console.log(JSON.stringify({frontend_errors:frontend.length,frontend_baseline_identical:report.frontend_baseline_identical,
  functions_errors:fn.length,functions_baseline_identical:report.functions_baseline_identical,
  changed_panel_errors:panel.length}))
process.exitCode=report.frontend_baseline_identical&&report.functions_baseline_identical&&panel.length===0?0:1
