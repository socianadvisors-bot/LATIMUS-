import {build} from 'esbuild';
import {mkdir,readFile,writeFile,copyFile,rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
await rm('dist',{recursive:true,force:true});
await mkdir('dist/extension',{recursive:true});
await build({entryPoints:['src/main.tsx'],bundle:true,minify:true,format:'iife',target:['chrome120'],outdir:'dist/extension',entryNames:'app',define:{'process.env.NODE_ENV':'"production"'},legalComments:'none'});
const js=await readFile('dist/extension/app.js','utf8');const css=await readFile('dist/extension/app.css','utf8');
const head='<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#102c2a"><title>LATIMUS · Executive Office</title>';
await writeFile('dist/extension/index.html',`<!doctype html><html lang="en"><head>${head}<link rel="stylesheet" href="app.css"></head><body><div id="root"></div><script src="app.js"></script></body></html>`);
const manifest={manifest_version:3,key:(await readFile('public/extension-public-key.txt','utf8')).trim(),name:'LATIMUS — Executive Office',version:JSON.parse(await readFile('package.json','utf8')).version,description:'Local-first executive intelligence, approvals and client delivery. Public-source retrieval and local workflows.',permissions:[],optional_host_permissions:['https://api.usaspending.gov/*','https://data.austintexas.gov/*','https://api.census.gov/*'],action:{default_title:'Open LATIMUS'},background:{service_worker:'worker.js'},content_security_policy:{extension_pages:"script-src 'self'; object-src 'none'; connect-src https://api.usaspending.gov https://data.austintexas.gov https://api.census.gov; base-uri 'none'"}};
await writeFile('dist/extension/manifest.json',JSON.stringify(manifest,null,2));
await copyFile('src/platform/extension-worker.js','dist/extension/worker.js');
// Exact script hash permits only the bundled inline program in portable mode.
const safeJS=js.replace(/<\/script/gi,'<\\/script');const hash=createHash('sha256').update(safeJS).digest('base64');
const csp=`default-src 'none'; script-src 'sha256-${hash}'; style-src 'unsafe-inline'; img-src data: blob:; connect-src https://api.usaspending.gov https://data.austintexas.gov https://api.census.gov; object-src 'none'; base-uri 'none'; form-action 'none'`;
await writeFile('dist/LATIMUS.html',`<!doctype html><html lang="en"><head>${head}<meta http-equiv="Content-Security-Policy" content="${csp}"><style>${css.replace(/<\/style/gi,'<\\/style')}</style></head><body><div id="root"></div><script>${safeJS}</script></body></html>`);
execFileSync('python3',['-c',"import zipfile,pathlib; z=zipfile.ZipFile('dist/LATIMUS-extension.zip','w',zipfile.ZIP_DEFLATED); [z.write(p,p.relative_to('dist/extension')) for p in pathlib.Path('dist/extension').rglob('*') if p.is_file()]; z.close()"]);
console.log('Built portable HTML, unpacked MV3 extension and extension ZIP.');
