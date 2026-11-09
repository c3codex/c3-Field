const fs=require('node:fs')
const path=require('node:path')
const {createHash}=require('node:crypto')
function checkTreePurpose(root=process.cwd()) {
 const policy=JSON.parse(fs.readFileSync(path.join(root,'docs/governance/c3-tree-purpose.json'),'utf8'))
 const failures=[]
 const hash=bytes=>createHash('sha256').update(bytes).digest('hex')
 const asset=path.join(root,policy.asset_path)
 if(!fs.existsSync(asset)||hash(fs.readFileSync(asset))!==policy.sha256)failures.push('c3_tree bytes missing or changed; separate review required')
 const approved=new Set([policy.locator_source,...policy.renderers,...policy.reviewed_consumers])
 const exts=new Set(['.ts','.tsx','.js','.jsx','.css','.html','.json','.svg'])
 function walk(dir) {
  const full=path.join(root,dir)
  if(!fs.existsSync(full))return
  for(const entry of fs.readdirSync(full,{withFileTypes:true})){
   const relative=path.posix.join(dir,entry.name)
   if(entry.isDirectory()){walk(relative);continue}
   const bytes=fs.readFileSync(path.join(root,relative))
   if(relative!==policy.asset_path && dir.startsWith('public') && hash(bytes)===policy.sha256) failures.push(`${relative}: duplicate c3_tree copy`)
   if(!exts.has(path.extname(entry.name)) || /\.(test|spec)\.[^.]+$/.test(relative))continue
   const source=bytes.toString('utf8')
   if(/c3-tree-source-v1|c3tree\.webp|C3_TREE_BACKDROP|dnrDocument|DnrBackdrop|DnrBoundary/.test(source) && !approved.has(relative)) failures.push(`${relative}: unreviewed c3_tree use`)
   if(relative!==policy.locator_source && /c3-tree-source-v1|c3tree\.webp|C3_TREE_BACKDROP/.test(source) && !policy.renderers.includes(relative))failures.push(`${relative}: direct artwork reference outside approved renderer`)
  }
 }
 for(const dir of ['src','functions','public'])walk(dir)
 return failures
}
module.exports={checkTreePurpose}
if(require.main===module){
 const failures=checkTreePurpose()
 if(failures.length){failures.forEach(x=>console.error('[c3-tree-purpose] HOLD: '+x));process.exitCode=42}
 else console.log('[c3-tree-purpose] PASS: unchanged artwork; reviewed entrance/boundary references only')
}
