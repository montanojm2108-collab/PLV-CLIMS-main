import fs from 'node:fs';import path from 'node:path';import ts from 'typescript';
const root=path.resolve('src/app'),files=[];
function visit(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())visit(p);else if(p.endsWith('.ts'))files.push(p);}}
visit(root);
let errors=0;
for(const f of files){const t=fs.readFileSync(f,'utf8'),res=ts.transpileModule(t,{fileName:f,reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}});for(const d of res.diagnostics||[]){errors++;console.error(f,ts.flattenDiagnosticMessageText(d.messageText,'\n'));}}
const routes=fs.readFileSync(path.join(root,'app.routes.ts'),'utf8');const imports=[...routes.matchAll(/import\('(\.\/pages\/[^']+)'\)/g)].map(m=>m[1]);
if(imports.length!==18){console.error('Expected 18 page routes, found',imports.length);errors++;}
for(const item of imports){const file=path.join(root,item+'.ts');if(!fs.existsSync(file)){console.error('Missing route target',file);errors++;}}
for(const name of fs.readdirSync(path.join(root,'pages'))){const dir=path.join(root,'pages',name);for(const ext of ['ts','html','scss']){if(!fs.existsSync(path.join(dir,name+'.page.'+ext))){console.error('Missing page file',name,ext);errors++;}}}
console.log('Checked',files.length,'TypeScript files,',imports.length,'lazy-loaded routes. Problems:',errors);
if(errors)process.exitCode=1;
