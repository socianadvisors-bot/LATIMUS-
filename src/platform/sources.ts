import type {Source,SourceRun} from '../domain/types';
import {buildSourceRequest,connectorDefinition,parseAustinColumns,parseCensusNaics,parseSourceResponse,type PublicRequest} from '../domain/connectors';
import {sourceRunSchema} from '../domain/validation';
import {sha256} from './crypto';
const MAX_BYTES=2*1024*1024;
const isExtension=()=>location.protocol==='chrome-extension:';
/** Called directly from a user click. No content-script bridge and no arbitrary URL argument. */
export async function requestSourcePermission(source:Source):Promise<void>{
 if(!source.connectorId)throw new Error('This source has no retrieval adapter.');
 const def=connectorDefinition(source.connectorId);
 if(!isExtension())return;
 const browser=(globalThis as any).chrome;
 const granted=await browser.permissions.request({origins:[...def.origins]});
 if(!granted)throw new Error('Source access was not granted. No request was made.');
}
async function readJSON(request:PublicRequest,signal:AbortSignal,fetcher:typeof fetch):Promise<{value:unknown;text:string}>{
 // The adapter constructs both URL and body. Workspace data, credentials and arbitrary URLs never enter this transport.
 const response=await fetcher(request.url,{method:request.method,headers:request.body?{'Accept':'application/json','Content-Type':request.contentType||'application/json'}:{'Accept':'application/json'},body:request.body,credentials:'omit',redirect:'error',referrerPolicy:'no-referrer',cache:'no-store',signal});
 if(!response.ok)throw new Error(`Official source returned HTTP ${response.status}. Previous records were retained.`);
 if(Number(response.headers.get('content-length'))>MAX_BYTES){await response.body?.cancel();throw new Error('Source response exceeds 2 MB. Narrow the search window or reduce the limit.');}
 if(!response.body)throw new Error('Source returned no response body.');
 const reader=response.body.getReader();const chunks:Uint8Array[]=[];let length=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;length+=value.byteLength;if(length>MAX_BYTES){await reader.cancel();throw new Error('Source response exceeds 2 MB. Narrow the search.');}chunks.push(value);}}
 finally{reader.releaseLock();}
 const bytes=new Uint8Array(length);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 const text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);let value:unknown;try{value=JSON.parse(text);}catch{throw new Error('Source did not return JSON. Access may be blocked or the endpoint may have changed.');}
 return {text,value};
}
export async function retrieveSource(source:Source,fetcher:typeof fetch=fetch,callerSignal?:AbortSignal,credentials?:{censusApiKey?:string}):Promise<SourceRun>{
 if(!source.connectorId||!source.settings)throw new Error('Configure an official source adapter first.');
 const def=connectorDefinition(source.connectorId);const startedAt=new Date().toISOString();const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),25000);let requestUrl=def.url as string;const signal=callerSignal?AbortSignal.any([controller.signal,callerSignal]):controller.signal;
 try{
  let columns:string[]|undefined;let naics:string|undefined;
  if(source.connectorId==='census-cbp'){if(!credentials?.censusApiKey?.trim())throw new Error('A free Census API key is required for CBP data. Add it temporarily in this source card; it is never saved in the workspace.');requestUrl=`https://api.census.gov/data/${source.settings.year}/cbp/variables.json`;const metadata=await readJSON({url:requestUrl,method:'GET'},signal,fetcher);naics=parseCensusNaics(metadata.value);}
  if(source.connectorId==='austin-permits'){requestUrl='https://data.austintexas.gov/api/views/3syk-w9eu.json';const schema=await readJSON({url:requestUrl,method:'GET'},signal,fetcher);columns=parseAustinColumns(schema.value);}
  const request=buildSourceRequest(source.connectorId,source.settings,columns,naics);requestUrl=request.url;
  let authorizedRequest=request;
  if(source.connectorId==='census-cbp'){const url=new URL(request.url);url.searchParams.set('key',credentials!.censusApiKey!.trim());authorizedRequest={...request,url:url.href};}
  const {text,value}=await readJSON(authorizedRequest,signal,fetcher);const result=parseSourceResponse(source.connectorId,value,requestUrl,source.settings.limit);
  if(credentials?.censusApiKey&&JSON.stringify(result).includes(credentials.censusApiKey))throw new Error('Source unexpectedly echoed a credential; response was not retained.');
  return sourceRunSchema.parse({id:crypto.randomUUID(),sourceId:source.id,connectorId:source.connectorId,settings:source.settings,status:'succeeded',startedAt,completedAt:new Date().toISOString(),requestUrl,responseHash:await sha256(text),recordsFetched:result.records.length,...result});
 }catch(e){let message=callerSignal?.aborted?'Source request cancelled because the workspace was locked.':controller.signal.aborted?'Source request timed out. No fresh data was recorded.':e instanceof Error?e.message:'Source request failed.';
  if(credentials?.censusApiKey){message=message.replaceAll(credentials.censusApiKey,'[redacted]');}
  return {id:crypto.randomUUID(),sourceId:source.id,connectorId:source.connectorId,settings:source.settings,status:'failed',startedAt,completedAt:new Date().toISOString(),requestUrl,responseHash:'',recordsFetched:0,records:[],error:message.slice(0,3000)+' If the browser blocks CORS, use the extension and grant this source access. If this cloud runtime denies the host, save its domain in environment settings.',truncated:false};
 }finally{clearTimeout(timeout);controller.abort();}
}
