import type {Action,Workspace} from '../domain/types';
import type {CompanyResearch,ProspectResult,ProspectRow} from '../domain/prospectTypes';
import {groupProspects,selectResult} from '../domain/prospecting';

export interface ProspectRunnerDependencies {
 read:()=>Workspace|null;
 act:(action:Action)=>Promise<void>;
 advanced:boolean;
 authorize:(jobId:string)=>Promise<string>;
 research:(token:string,rowId:string)=>Promise<{research:CompanyResearch;searchRequests:number}>;
 cancel:(token:string)=>Promise<unknown>;
}
/** Persisted checkpoints are authoritative. In-flight work is disposable on pause, lock or reload. */
export async function runProspectJob(jobId:string,deps:ProspectRunnerDependencies,signal:AbortSignal):Promise<void>{
 let token:string|undefined,authorization:Promise<string>|undefined;
 const authorize=()=>authorization??=deps.authorize(jobId).then(value=>{token=value;return value;});
 const abort=()=>{if(token)void deps.cancel(token).catch(()=>{});};signal.addEventListener('abort',abort,{once:true});
 const current=()=>{if(signal.aborted)throw new DOMException('Prospect work stopped','AbortError');const w=deps.read();const j=w?.prospectJobs.find(j=>j.id===jobId);if(!w||!j||!['queued','running'].includes(j.status))throw new DOMException('Prospect job stopped','AbortError');return {w,j};};
 try{
  let {w,j}=current();await deps.act({type:'prospects.job.running',jobId});({w,j}=current());
  const completed=new Set(j.completedRowIds),selected=new Set(j.rowIds);
  const groups=[...groupProspects(w.prospectRows.filter(r=>r.batchId===j.batchId&&selected.has(r.id)&&!completed.has(r.id)))];
  const settings=j.settings,cache=new Map(w.prospectCompanyCache.map(c=>[c.key,c]));
  const localResults:{rowId:string;result:ProspectResult}[]=[];
  const flush=async()=>{if(!localResults.length)return;current();const results=localResults.splice(0,500);await deps.act({type:'prospects.checkpoint',jobId,results});await new Promise(r=>setTimeout(r,0));};
  const resultFor=(row:ProspectRow,research?:CompanyResearch)=>{
   const result=selectResult(row,research);
   if(research&&!research.pages.length&&research.errors.length){if(research.errors.some(e=>/ambiguous/i.test(e)))result.status='review_required';else result.status='error';}
   if(row.errors.some(e=>/ambiguous|differently named|identity review/i.test(e))){result.status='review_required';result.workEmail='';result.emailConfidence=0;result.emailQuality='unavailable';result.emailSource='';result.errors.push('Imported company identity requires review before individual contact use.');}
   return result;
  };
  // One company request per group; bounded parallelism never multiplies per-company crawling.
  let index=0;
  const worker=async()=>{while(index<groups.length){
   current();const [key,rows]=groups[index++];const stored=cache.get(key);
   const age=stored?Date.now()-Date.parse(stored.checkedAt):Infinity;
   const cached=stored&&stored.research.pages.length>0&&age>=0&&age<=settings.cacheDays*86400000&&settings.cacheMode!=='force_refresh'?stored:undefined;
   if(!deps.advanced&&!cached){
    for(const row of rows){const result=resultFor(row);result.errors.push('extension_required: Portable Core completed local normalization. Public company research requires Advanced Mode.');localResults.push({rowId:row.id,result});if(localResults.length>=500)await flush();}
    continue;
   }
   let research:CompanyResearch,searchRequests=0;
   if(cached)research=cached.research;
   else{
    token=await authorize();current();
    try{const reply=await deps.research(token,rows[0].id);research=reply.research;searchRequests=reply.searchRequests;}
    catch(e){if(signal.aborted)throw e;const message=e instanceof Error?e.message:'Public company research failed.';
     // Session/capability loss is recoverable at the job boundary, without falsely completing rows.
     if(/locked|capability expired|workspace scope|workspace changed|unlock|job.*(?:paused|cancelled|active)/i.test(message))throw e;
     for(const row of rows){const result=resultFor(row);result.status='error';result.errors.push(message.slice(0,1800));localResults.push({rowId:row.id,result});if(localResults.length>=500)await flush();}continue;
    }
   }
   current();await flush();
   for(let offset=0;offset<rows.length;offset+=500){
    current();const first=offset===0;
    await deps.act({type:'prospects.checkpoint',jobId,results:rows.slice(offset,offset+500).map(row=>({rowId:row.id,result:resultFor(row,research)})),
     cache:!cached&&first&&research.pages.length>0?{id:crypto.randomUUID(),key,research,checkedAt:research.checkedAt}:undefined,
     currentCompany:rows[0].normalized.company||research.domain,
     metrics:first?{pagesFetched:cached?0:research.pages.length,searchRequests,cacheHits:cached?1:0,companiesResearched:cached?0:1}:undefined});
    await new Promise(r=>setTimeout(r,0));
   }
  }};
  // Portable work uses one writer so local batches remain stable and cheap to encrypt.
  const parallel=deps.advanced?settings.concurrency:1;
  await Promise.all(Array.from({length:Math.min(parallel,groups.length)},worker));await flush();current();await deps.act({type:'prospects.job.finish',jobId});
 }catch(e){
  if(!signal.aborted&&e instanceof Error&&e.name!=='AbortError'){
   const w=deps.read(),j=w?.prospectJobs.find(j=>j.id===jobId);if(j&&['queued','running'].includes(j.status))await deps.act({type:'prospects.job.finish',jobId,error:e.message.slice(0,1800)});
  }
 }finally{signal.removeEventListener('abort',abort);if(token)await deps.cancel(token).catch(()=>{});}
}
