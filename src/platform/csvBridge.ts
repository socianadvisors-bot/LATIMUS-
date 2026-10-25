import {parseProspectCsv} from '../domain/prospecting';
import type {ParsedProspectCsv} from '../domain/prospectTypes';
declare const __LATIMUS_CSV_WORKER__:string;
/** Bundled worker only: extension uses its self resource; portable HTML uses the exact embedded build bytes. */
export async function parseProspectCsvInWorker(text:string,signal?:AbortSignal):Promise<ParsedProspectCsv>{
 if(signal?.aborted)throw new DOMException('CSV parsing cancelled','AbortError');
 if(typeof Worker==='undefined'){await new Promise(r=>setTimeout(r,0));return parseProspectCsv(text,{maxRows:50000,maxBytes:10*1024*1024,signal});}
 let url:string;let blob=false;let options:WorkerOptions={};
 if(location.protocol==='chrome-extension:')url=(globalThis as any).chrome.runtime.getURL('csv-worker.js');
 else if(typeof __LATIMUS_CSV_WORKER__==='string'){url=URL.createObjectURL(new Blob([__LATIMUS_CSV_WORKER__],{type:'text/javascript'}));blob=true;}
 else{url='/src/platform/csv-worker.ts';options={type:'module'};}
 return new Promise((resolve,reject)=>{let worker:Worker;try{worker=new Worker(url,options);}catch(e){if(blob)URL.revokeObjectURL(url);reject(e);return;}
  const clean=()=>{worker.terminate();signal?.removeEventListener('abort',abort);if(blob)URL.revokeObjectURL(url);};
  const abort=()=>{clean();reject(new DOMException('CSV parsing cancelled','AbortError'));};signal?.addEventListener('abort',abort,{once:true});
  worker.onmessage=e=>{clean();if(e.data?.ok)resolve(e.data.result);else reject(new Error(e.data?.error||'CSV parsing failed.'));};worker.onerror=()=>{clean();reject(new Error('The bundled CSV worker could not run. Check browser permissions and retry.'));};worker.postMessage({type:'parse',text});
 });
}
