import {describe,it,expect,vi} from 'vitest';
import {runProspectJob,type ProspectRunnerDependencies} from '../src/platform/prospectRunner';
import {applyAction,emptyWorkspace} from '../src/domain/workspace';
import {validateWorkspace} from '../src/domain/validation';
import {companyGroupingKey,proposeMapping} from '../src/domain/prospecting';
import type {Action,Workspace} from '../src/domain/types';
import type {CompanyResearch,ProspectSettings} from '../src/domain/prospectTypes';

const settings:ProspectSettings={concurrency:2,maxPages:1,requestDelayMs:250,timeoutMs:3000,cacheMode:'refresh_stale',cacheDays:30};
async function seeded(count=3,unique=false,options:Partial<ProspectSettings>={}){
 const headers=['Company','Owner','Website','Unmapped'];const rows=Array.from({length:count},(_,i)=>[unique?`Fictional Firm ${i}`:'Example Industrial LLC',`Person ${i}`,unique?`https://firm${i}.example.com`:'https://example.com',`Preserve ${i}`]);
 let w=await applyAction(emptyWorkspace('Runner fixture'),{type:'prospects.import',input:{fileName:'fictional.csv',fileHash:'6'.repeat(64),headers,rows,mapping:proposeMapping(headers).mapping}});
 w=await applyAction(w,{type:'prospects.start',batchId:w.prospectBatches[0].id,settings:{...settings,...options}});return w;
}
function research(domain='example.com',checkedAt=new Date().toISOString()):CompanyResearch{return {domain,website:'https://'+domain,companyName:'Example Industrial LLC',companyConfidence:90,resolutionMethod:'input_website',emails:[],phones:[],profiles:[],pages:[{url:'https://'+domain,title:'Fictional company fixture',excerpt:'Fictional evidence only',checkedAt}],errors:[],checkedAt};}
function harness(initial:Workspace,advanced:boolean,researcher?:ProspectRunnerDependencies['research']){
 let w:Workspace|null=initial,queue=Promise.resolve();const actions:Action[]=[];
 const deps:ProspectRunnerDependencies={read:()=>w,advanced,
  act:action=>{const operation=queue.catch(()=>{}).then(async()=>{if(!w)throw new Error('Locked');w=await applyAction(w,action);actions.push(action)});queue=operation;return operation},
  authorize:vi.fn(async()=>crypto.randomUUID()),
  research:researcher||vi.fn(async(_token,rowId)=>({research:research(w!.prospectRows.find(r=>r.id===rowId)!.normalized.domain),searchRequests:0})),
  cancel:vi.fn(async()=>undefined)};
 return {deps,actions,workspace:()=>w!,setWorkspace:(next:Workspace|null)=>{w=next}};
}

describe('durable company-first prospect job runner',()=>{
 it('processes portable imports in bounded500-row checkpoints with truthful local-only results',async()=>{
  const w=await seeded(1201),h=harness(w,false),jobId=w.prospectJobs[0].id;await runProspectJob(jobId,h.deps,new AbortController().signal);
  const checkpoints=h.actions.filter(a=>a.type==='prospects.checkpoint');expect(checkpoints.map(a=>a.type==='prospects.checkpoint'?a.results.length:0)).toEqual([500,500,201]);expect(h.workspace().prospectJobs[0].status).toBe('completed');expect(h.workspace().prospectJobs[0].completedRowIds).toHaveLength(1201);expect(h.workspace().prospectRows.every(r=>r.result?.errors.some(e=>e.includes('extension_required'))&&r.result.workEmail==='')).toBe(true);expect(h.workspace().prospectRows[1200].original[3]).toBe('Preserve 1200');expect(h.deps.authorize).not.toHaveBeenCalled();expect(h.deps.research).not.toHaveBeenCalled();
 });
 it('resumes a reloaded portable job from its durable checkpoint without overwriting completed rows',async()=>{
  const w=await seeded(1201),h=harness(w,false),jobId=w.prospectJobs[0].id,controller=new AbortController();const act=h.deps.act;
  h.deps.act=async action=>{await act(action);if(action.type==='prospects.checkpoint'){await act({type:'prospects.control',jobId,control:'pause'});controller.abort()}};
  await runProspectJob(jobId,h.deps,controller.signal);expect(h.workspace().prospectJobs[0].status).toBe('paused');expect(h.workspace().prospectJobs[0].completedRowIds).toHaveLength(500);const saved=validateWorkspace(JSON.parse(JSON.stringify(h.workspace())));const completed=saved.prospectRows.slice(0,500).map(r=>JSON.stringify(r));
  const next=harness(await applyAction(saved,{type:'prospects.control',jobId,control:'resume'}),false);await runProspectJob(jobId,next.deps,new AbortController().signal);expect(next.workspace().prospectJobs[0].status).toBe('completed');expect(next.workspace().prospectJobs[0].completedRowIds).toHaveLength(1201);expect(next.workspace().prospectRows.slice(0,500).map(r=>JSON.stringify(r))).toEqual(completed);const resumed=next.actions.flatMap(a=>a.type==='prospects.checkpoint'?a.results.map(r=>r.rowId):[]);expect(resumed).toHaveLength(701);expect(resumed.some(id=>saved.prospectJobs[0].completedRowIds.includes(id))).toBe(false);
 });
 it('researches a shared company once, checkpoints every person and records actual request counters',async()=>{
  const w=await seeded(520),lookup=vi.fn(async()=>({research:research(),searchRequests:2})),h=harness(w,true,lookup);await runProspectJob(w.prospectJobs[0].id,h.deps,new AbortController().signal);
  expect(lookup).toHaveBeenCalledTimes(1);expect(h.deps.authorize).toHaveBeenCalledTimes(1);expect(h.deps.cancel).toHaveBeenCalledTimes(1);expect(h.workspace().prospectJobs[0]).toMatchObject({status:'completed',companiesResearched:1,pagesFetched:1,searchRequests:2,cacheHits:0});expect(h.workspace().prospectRows.every(r=>r.result?.status==='company_only')).toBe(true);expect(h.workspace().prospectCompanyCache).toHaveLength(1);expect(h.workspace().contacts).toHaveLength(0);expect(h.workspace().signals).toHaveLength(0);
 });
 it('reuses a fresh persisted company cache without background authorization in either runtime',async()=>{
  for(const advanced of [true,false]){const w=await seeded();w.prospectCompanyCache.push({id:crypto.randomUUID(),key:companyGroupingKey(w.prospectRows[0].normalized),research:research(),checkedAt:new Date().toISOString()});const h=harness(w,advanced);await runProspectJob(w.prospectJobs[0].id,h.deps,new AbortController().signal);expect(h.deps.authorize).not.toHaveBeenCalled();expect(h.deps.research).not.toHaveBeenCalled();expect(h.workspace().prospectJobs[0]).toMatchObject({status:'completed',companiesResearched:0,pagesFetched:0,cacheHits:1});expect(h.workspace().prospectRows[0].result?.evidence).toHaveLength(1)}
 });
 it('refreshes stale cache and honors force refresh even when a cached company is fresh',async()=>{
  for(const mode of ['refresh_stale','force_refresh'] as const){const w=await seeded(3,false,{cacheMode:mode});const checkedAt=new Date(Date.now()-(mode==='refresh_stale'?40*86400000:1000)).toISOString();w.prospectCompanyCache.push({id:crypto.randomUUID(),key:companyGroupingKey(w.prospectRows[0].normalized),research:research('example.com',checkedAt),checkedAt});const h=harness(w,true);await runProspectJob(w.prospectJobs[0].id,h.deps,new AbortController().signal);expect(h.deps.research).toHaveBeenCalledTimes(1);expect(h.workspace().prospectJobs[0]).toMatchObject({companiesResearched:1,cacheHits:0});expect(h.workspace().prospectCompanyCache).toHaveLength(1);expect(h.workspace().prospectCompanyCache[0].checkedAt).not.toBe(checkedAt)}
 });
 it('limits concurrent company requests and shares one job authorization across workers',async()=>{
  let active=0,peak=0;const w=await seeded(6,true),lookup=vi.fn(async(_token:string,rowId:string)=>{active++;peak=Math.max(peak,active);await new Promise(r=>setTimeout(r,5));active--;return {research:research(w.prospectRows.find(r=>r.id===rowId)!.normalized.domain),searchRequests:0}});const h=harness(w,true,lookup);await runProspectJob(w.prospectJobs[0].id,h.deps,new AbortController().signal);expect(lookup).toHaveBeenCalledTimes(6);expect(peak).toBe(2);expect(h.deps.authorize).toHaveBeenCalledTimes(1);expect(h.workspace().prospectJobs[0].status).toBe('completed');
 });
 it('pauses in-flight work without marking unsaved rows complete, then resumes after reload',async()=>{
  const w=await seeded(),controller=new AbortController();let began!:()=>void;const started=new Promise<void>(r=>{began=r});const lookup=vi.fn((_token:string,_rowId:string)=>new Promise<{research:CompanyResearch;searchRequests:number}>((_resolve,reject)=>{began();controller.signal.addEventListener('abort',()=>reject(new DOMException('Stopped','AbortError')),{once:true})}));const h=harness(w,true,lookup),jobId=w.prospectJobs[0].id;
  const running=runProspectJob(jobId,h.deps,controller.signal);await started;await h.deps.act({type:'prospects.control',jobId,control:'pause'});controller.abort();await running;expect(h.workspace().prospectJobs[0]).toMatchObject({status:'paused',completedRowIds:[]});expect(h.workspace().prospectRows.every(r=>r.result===null)).toBe(true);expect(h.actions.some(a=>a.type==='prospects.job.finish')).toBe(false);expect(h.deps.cancel).toHaveBeenCalled();
  const next=harness(await applyAction(validateWorkspace(JSON.parse(JSON.stringify(h.workspace()))),{type:'prospects.control',jobId,control:'resume'}),true);await runProspectJob(jobId,next.deps,new AbortController().signal);expect(next.workspace().prospectJobs[0].status).toBe('completed');
 });
 it('sends broker cancellation while its research response is still pending',async()=>{
  const w=await seeded(),controller=new AbortController();let began!:()=>void,finish!:(reply:{research:CompanyResearch;searchRequests:number})=>void;const started=new Promise<void>(resolve=>{began=resolve});let settled=false;
  const lookup=vi.fn(()=>new Promise<{research:CompanyResearch;searchRequests:number}>(resolve=>{finish=reply=>{settled=true;resolve(reply)};began()}));const h=harness(w,true,lookup),jobId=w.prospectJobs[0].id;const running=runProspectJob(jobId,h.deps,controller.signal);await started;await h.deps.act({type:'prospects.control',jobId,control:'pause'});controller.abort();
  try{await vi.waitFor(()=>expect(h.deps.cancel).toHaveBeenCalled(),{timeout:500});expect(settled).toBe(false);expect(h.workspace().prospectJobs[0].status).toBe('paused')}finally{finish({research:research(),searchRequests:0});await running}
  expect(h.actions.some(a=>a.type==='prospects.checkpoint'||a.type==='prospects.job.finish')).toBe(false);
 });
 it('retains unfinished rows after a background lock and can resume with a fresh capability',async()=>{
  const w=await seeded(),h=harness(w,true,vi.fn(async()=>{throw new Error('Private background session is locked. Unlock research and resume the job.')}));const jobId=w.prospectJobs[0].id;await runProspectJob(jobId,h.deps,new AbortController().signal);expect(h.workspace().prospectJobs[0]).toMatchObject({status:'failed',completedRowIds:[]});expect(h.workspace().prospectRows.every(r=>r.result===null)).toBe(true);
  const next=harness(await applyAction(h.workspace(),{type:'prospects.control',jobId,control:'resume'}),true);await runProspectJob(jobId,next.deps,new AbortController().signal);expect(next.workspace().prospectJobs[0].status).toBe('completed');
 });
 it('does not cache a permission failure and retries it after the owner grants access',async()=>{
  const w=await seeded(),failed={...research(),companyConfidence:0,pages:[],errors:['permission_required: approve example.com in Advanced Mode, then resume selected rows.']};const h=harness(w,true,vi.fn(async()=>({research:failed,searchRequests:1})));const jobId=w.prospectJobs[0].id;await runProspectJob(jobId,h.deps,new AbortController().signal);expect(h.workspace().prospectRows.every(r=>r.result?.status==='error')).toBe(true);expect(h.workspace().prospectCompanyCache).toHaveLength(0);
  const next=harness(await applyAction(h.workspace(),{type:'prospects.control',jobId,control:'retry_failed'}),true);await runProspectJob(jobId,next.deps,new AbortController().signal);expect(next.deps.research).toHaveBeenCalledTimes(1);expect(next.workspace().prospectJobs[0].status).toBe('completed');expect(next.workspace().prospectRows.every(r=>r.result?.status==='company_only')).toBe(true);
 });
 it('discards an in-flight reply after workspace generation is removed instead of resurrecting old data',async()=>{
  const w=await seeded();let began!:()=>void,finish!:(value:{research:CompanyResearch;searchRequests:number})=>void;const started=new Promise<void>(r=>{began=r});const h=harness(w,true,vi.fn(()=>new Promise<{research:CompanyResearch;searchRequests:number}>(resolve=>{finish=resolve;began()})));const running=runProspectJob(w.prospectJobs[0].id,h.deps,new AbortController().signal);await started;h.setWorkspace(null);finish({research:research(),searchRequests:0});await running;expect(h.actions.some(a=>a.type==='prospects.checkpoint'||a.type==='prospects.job.finish')).toBe(false);expect(h.deps.cancel).toHaveBeenCalledTimes(1);
 });
});
