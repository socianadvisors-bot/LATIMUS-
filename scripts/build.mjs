import {build} from 'esbuild';
import {mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';

const bundleOptions={bundle:true,minify:true,format:'iife',target:['chrome120'],platform:'browser',legalComments:'none'};
await rm('dist',{recursive:true,force:true});
await mkdir('dist/extension',{recursive:true});
// These are the same bundled bytes in the extension resource and the portable Blob.
// No worker imports executable code from a network origin at runtime.
const csvBuild=await build({...bundleOptions,entryPoints:['src/platform/csv-worker.ts'],write:false});
const csvWorker=csvBuild.outputFiles[0].text;
await writeFile('dist/extension/csv-worker.js',csvWorker);
await build({...bundleOptions,entryPoints:['src/platform/extension-worker.ts'],outfile:'dist/extension/worker.js'});
await build({...bundleOptions,entryPoints:['src/main.tsx'],outdir:'dist/extension',entryNames:'app',define:{'process.env.NODE_ENV':'"production"',__LATIMUS_CSV_WORKER__:JSON.stringify(csvWorker)}});
const js=await readFile('dist/extension/app.js','utf8');
const css=await readFile('dist/extension/app.css','utf8');
const head='<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#102c2a"><title>LATIMUS · Executive Office</title>';
await writeFile('dist/extension/index.html',`<!doctype html><html lang="en"><head>${head}<link rel="stylesheet" href="app.css"></head><body><div id="root"></div><script src="app.js"></script></body></html>`);
const sourceOrigins=['https://api.usaspending.gov','https://data.austintexas.gov','https://api.census.gov','https://www.tdlr.texas.gov','https://data.transportation.gov'];
const researchOrigins=['https://dns.google','https://api.search.brave.com'];
// Company access is declared optional, then requested for explicit imported domains.
// The background broker independently validates sender, workspace, job, row, URL,
// public DNS, scope, request budgets, redirects and granted origin before retrieval.
const optionalOrigins=[...sourceOrigins,...researchOrigins].map(origin=>origin+'/*');
const extensionCsp="script-src 'self'; worker-src 'self'; object-src 'none'; connect-src https:; base-uri 'none'";
const manifest={
 manifest_version:3,key:(await readFile('public/extension-public-key.txt','utf8')).trim(),
 name:'LATIMUS — Executive Office',version:JSON.parse(await readFile('package.json','utf8')).version,
 description:'Local-first executive intelligence, CSV prospect research, owner approvals and client delivery.',
 permissions:[],optional_host_permissions:[...optionalOrigins,'https://*/*'],
 action:{default_title:'Open LATIMUS'},background:{service_worker:'worker.js'},
 content_security_policy:{extension_pages:extensionCsp}
};
await writeFile('dist/extension/manifest.json',JSON.stringify(manifest,null,2));
// Exact script hash permits only the bundled inline program in portable mode.
const safeJS=js.replace(/<\/script/gi,'<\\/script');
const hash=createHash('sha256').update(safeJS).digest('base64');
const csp=`default-src 'none'; script-src 'sha256-${hash}'; worker-src blob:; style-src 'unsafe-inline'; img-src data: blob:; connect-src ${sourceOrigins.join(' ')}; object-src 'none'; base-uri 'none'; form-action 'none'`;
await writeFile('dist/LATIMUS.html',`<!doctype html><html lang="en"><head>${head}<meta http-equiv="Content-Security-Policy" content="${csp}"><style>${css.replace(/<\/style/gi,'<\\/style')}</style></head><body><div id="root"></div><script>${safeJS}</script></body></html>`);
execFileSync('python3',['-c',"import zipfile,pathlib; z=zipfile.ZipFile('dist/LATIMUS-extension.zip','w',zipfile.ZIP_DEFLATED); [z.write(p,p.relative_to('dist/extension')) for p in pathlib.Path('dist/extension').rglob('*') if p.is_file()]; z.close()"]);
console.log('Built portable HTML with embedded CSV worker, unpacked MV3 extension with private background broker, and extension ZIP.');
