import {z} from 'zod';
import {companyGroupingKey} from '../domain/prospecting';
import {openVault,openVaultWithKey,seal,type VaultEnvelope} from './crypto';
import {validateWorkspace} from '../domain/validation';
import {prospectSettingsSchema} from '../domain/prospectValidation';
import {database} from './storage';
import {researchCompany,readBounded,type SearchHit} from './publicResearch';
import type {Workspace} from '../domain/types';
import type {CompanyResearch,NormalizedProspect,ProspectSettings} from '../domain/prospectTypes';
const id=z.string().min(1).max(100);const base={protocol:z.literal('latimus-prospect-1')};
const messageSchema=z.discriminatedUnion('type',[
 z.object({...base,type:z.literal('session.unlock'),workspaceId:id,passphrase:z.string().min(12).max(1024)}).strict(),
 ...(['session.lock','provider.status','provider.remove','provider.test'] as const).map(type=>z.object({...base,type:z.literal(type),workspaceId:id}).strict()),
 z.object({...base,type:z.literal('provider.import'),workspaceId:id,handleId:id,passphrase:z.string().min(12).max(1024)}).strict(),
 z.object({...base,type:z.literal('research.authorize'),workspaceId:id,jobId:id}).strict(),
 z.object({...base,type:z.literal('research.company'),token:id,rowId:id}).strict(),
 z.object({...base,type:z.literal('research.cancel'),token:id}).strict()
]);
export interface BrokerStorage {get:(store:string,key:string)=>Promise<any>;put:(store:string,key:string,value:unknown)=>Promise<void>;remove:(store:string,key:string)=>Promise<void>}
export interface BrokerDependencies {storage:BrokerStorage;fetcher:typeof fetch;hasOrigin:(origin:string)=>Promise<boolean>;extensionId:string}
interface Session {key:CryptoKey;salt:string;lastPing:number}
interface Capability {workspaceId:string;jobId:string;rows:Map<string,NormalizedProspect>;rowSnapshots:Map<string,string>;settings:ProspectSettings;controller:AbortController;companies:Map<string,Promise<{research:CompanyResearch;searchRequests:number}>>}
export function trustedProspectSender(sender:any,extensionId:string):boolean{try{const u=new URL(sender?.url||sender?.senderFrame?.url||'');return sender?.id===extensionId&&sender?.frameId===0&&typeof sender?.tab?.id==='number'&&u.protocol==='chrome-extension:'&&u.hostname===extensionId&&u.pathname==='/index.html';}catch{return false;}}
export function publicIPv4(value:string):boolean{if(!/^(?:0|[1-9][0-9]{0,2})(?:\.(?:0|[1-9][0-9]{0,2})){3}$/.test(value))return false;const p=value.split('.').map(Number);if(p.length!==4||p.some(n=>!Number.isInteger(n)||n<0||n>255))return false;const[a,b]=p;return a>0&&a<224&&a!==10&&a!==127&&!(a===169&&b===254)&&!(a===172&&b>=16&&b<=31)&&!(a===192&&(b===168||b===0))&&!(a===100&&b>=64&&b<=127)&&!(a===198&&(b===18||b===19||b===51&&p[2]===100))&&!(a===203&&b===0&&p[2]===113)&&!(a===192&&b===88&&p[2]===99);}
/** Conservative global-unicast IPv6 classification; special-use/transition ranges fail closed. */
export function publicIPv6(value:string):boolean{
 if(!/^[0-9a-f:]+$/i.test(value))return false;let canonical:string;try{canonical=new URL('https://['+value+']/').hostname.slice(1,-1);}catch{return false;}const halves=canonical.split('::');if(halves.length>2)return false;const left=halves[0]?halves[0].split(':'):[],right=halves[1]?halves[1].split(':'):[];const parts=halves.length===2?[...left,...Array(8-left.length-right.length).fill('0'),...right]:left;if(parts.length!==8)return false;const blocks=parts.map(p=>parseInt(p,16));if(blocks.some(p=>!Number.isInteger(p)||p<0||p>65535))return false;
 const [first,second]=blocks;if(first<0x2000||first>0x3fff||first===0x2002)return false;if(first===0x2001&&(second===0||second===2||second===0xdb8||(second>=0x10&&second<=0x2f)))return false;if(first===0x3fff&&second<0x1000)return false;return true;
}
export class ProspectBroker {
 private sessions=new Map<string,Session>();private capabilities=new Map<string,Capability>();private dns=new Map<string,{valid:boolean;at:number}>();
 constructor(private deps:BrokerDependencies){}
 ping(workspaceId:string){const s=this.sessions.get(workspaceId);if(s)s.lastPing=Date.now();}
 lock(workspaceId:string){this.sessions.delete(workspaceId);for(const [token,c] of this.capabilities)if(c.workspaceId===workspaceId){c.controller.abort();this.capabilities.delete(token);}}
 private session(workspaceId:string):Session{const s=this.sessions.get(workspaceId);if(!s||Date.now()-s.lastPing>600000){this.lock(workspaceId);throw new Error('Private background session is locked. Unlock research and resume the job.');}return s;}
 private async workspace(workspaceId:string){const s=this.session(workspaceId);const raw=await this.deps.storage.get('vault','active');if(!raw)throw new Error('No active encrypted workspace.');const w=validateWorkspace(JSON.parse(await openVaultWithKey(raw,s.key)));if(w.id!==workspaceId)throw new Error('Workspace scope changed; unlock the current workspace.');return w;}
 private async unlock(workspaceId:string,passphrase:string){const raw=await this.deps.storage.get('vault','active');if(!raw)throw new Error('No active encrypted workspace.');const v=await openVault(raw,passphrase);const w=validateWorkspace(JSON.parse(v.text));if(w.id!==workspaceId)throw new Error('Workspace identity mismatch.');this.lock(workspaceId);this.sessions.set(workspaceId,{key:v.key,salt:v.envelope.salt,lastPing:Date.now()});return w;}
 private async privateProvider(workspaceId:string):Promise<{key:string;lastTest?:string}|null>{const s=this.session(workspaceId),v=await this.deps.storage.get('provider-vault','brave:'+workspaceId);if(!v)return null;try{const p=JSON.parse(await openVaultWithKey(v,s.key));if(typeof p.key!=='string')throw new Error();return p;}catch{throw new Error('Provider vault could not be unlocked. Re-import its key using the current workspace passphrase.');}}
 private async search(workspaceId:string,query:string,signal:AbortSignal):Promise<SearchHit[]>{
  if(!await this.deps.hasOrigin('https://api.search.brave.com/*'))throw new Error('Brave host permission is not granted. Enable it in Provider Settings.');const p=await this.privateProvider(workspaceId);if(!p)throw new Error('provider_not_configured: import an owner-supplied Brave key to resolve missing company websites.');
  const url=new URL('https://api.search.brave.com/res/v1/web/search');url.search=new URLSearchParams({q:query.slice(0,500),count:'10',safesearch:'strict'}).toString();const timeout=AbortSignal.timeout(12000);
  const response=await this.deps.fetcher(url.href,{headers:{Accept:'application/json','X-Subscription-Token':p.key},credentials:'omit',redirect:'error',referrerPolicy:'no-referrer',signal:AbortSignal.any([signal,timeout])});
  if(!response.ok){await response.body?.cancel();throw new Error(`Brave search returned HTTP ${response.status}. Check provider quota, configuration or retry later.`);}const text=await readBounded(response,1000000);let value:unknown;try{value=JSON.parse(text);}catch{throw new Error('Search provider returned invalid JSON.');}
  const v=z.object({web:z.object({results:z.array(z.object({url:z.string().max(2000),title:z.string().max(2000),description:z.string().max(5000)}).passthrough()).max(20)}).optional()}).passthrough().parse(value);return (v.web?.results||[]).map(r=>({url:r.url,title:r.title,description:r.description}));
 }
 private async publicDomain(domain:string,signal:AbortSignal):Promise<boolean>{
  if(!await this.deps.hasOrigin('https://dns.google/*'))throw new Error('Public DNS safety-check permission is missing; approve company research access again.');const cached=this.dns.get(domain);if(cached&&Date.now()-cached.at<300000)return cached.valid;
  const lookup=async(type:'A'|'AAAA')=>{const url=new URL('https://dns.google/resolve');url.search=new URLSearchParams({name:domain,type}).toString();const r=await this.deps.fetcher(url.href,{credentials:'omit',redirect:'error',headers:{Accept:'application/dns-json'},signal:AbortSignal.any([signal,AbortSignal.timeout(10000)])});if(!r.ok){await r.body?.cancel();throw new Error('Public company DNS safety check is unavailable.');}const text=await readBounded(r,100000);return z.object({Status:z.number(),Answer:z.array(z.object({type:z.number(),data:z.string()}).passthrough()).max(256).optional()}).passthrough().parse(JSON.parse(text));};
  const answers=await Promise.all([lookup('A'),lookup('AAAA')]);const addresses=answers.flatMap(v=>v.Answer||[]).filter(a=>a.type===1||a.type===28);const valid=answers.every(v=>v.Status===0)&&addresses.length>0&&addresses.every(a=>a.type===1?publicIPv4(a.data):publicIPv6(a.data));this.dns.set(domain,{valid,at:Date.now()});return valid;
 }
 async handle(raw:unknown,sender:any):Promise<{ok:boolean;value?:unknown;error?:string}>{
  if(!trustedProspectSender(sender,this.deps.extensionId))return {ok:false,error:'Untrusted extension message sender.'};const parsed=messageSchema.safeParse(raw);if(!parsed.success)return {ok:false,error:'Invalid private research request.'};const m=parsed.data;
  try{switch(m.type){
   case 'session.unlock':await this.unlock(m.workspaceId,m.passphrase);return {ok:true,value:{unlocked:true}};
   case 'session.lock':this.lock(m.workspaceId);return {ok:true,value:{unlocked:false}};
   case 'provider.status':{const configured=!!await this.deps.storage.get('provider-vault','brave:'+m.workspaceId);let unlocked=false,lastTest:string|undefined;try{this.session(m.workspaceId);unlocked=true;lastTest=(await this.privateProvider(m.workspaceId))?.lastTest;}catch{}return {ok:true,value:{configured,unlocked,lastTest}};}
   case 'provider.import':{
    try{await this.unlock(m.workspaceId,m.passphrase);const staged=await this.deps.storage.get('file-handles',m.handleId);if(staged?.workspaceId!==m.workspaceId||staged.expiresAt<Date.now()||!staged.handle?.getFile)throw new Error('Selected key-file capability expired or does not belong to this workspace.');const file=await staged.handle.getFile();if(file.size>4096)throw new Error('Key file must be smaller than4KB.');let key=(await file.text()).trim();if(key.startsWith('{')){try{const v=JSON.parse(key);key=v.braveApiKey||v.brave_api_key||v.api_key||'';}catch{throw new Error('Key file is not a supported JSON key document.');}}if(typeof key!=='string'||!/^[A-Za-z0-9_-]{10,512}$/.test(key))throw new Error('Key file does not contain a supported Brave API credential.');const s=this.session(m.workspaceId);await this.deps.storage.put('provider-vault','brave:'+m.workspaceId,await seal(JSON.stringify({key}),s.key,s.salt));return {ok:true,value:{configured:true}};}finally{await this.deps.storage.remove('file-handles',m.handleId);}
   }
   case 'provider.remove':this.session(m.workspaceId);await this.deps.storage.remove('provider-vault','brave:'+m.workspaceId);return {ok:true,value:{configured:false}};
   case 'provider.test':{const p=await this.privateProvider(m.workspaceId);if(!p)throw new Error('provider_not_configured');await this.search(m.workspaceId,'example.com',new AbortController().signal);const s=this.session(m.workspaceId),lastTest=new Date().toISOString();await this.deps.storage.put('provider-vault','brave:'+m.workspaceId,await seal(JSON.stringify({...p,lastTest}),s.key,s.salt));return {ok:true,value:{lastTest}};}
   case 'research.authorize':{
    const w=await this.workspace(m.workspaceId);const job=w.prospectJobs.find(j=>j.id===m.jobId);if(!job||!['queued','running'].includes(job.status)||!w.prospectBatches.some(b=>b.id===job.batchId&&b.origin==='csv_prospect'))throw new Error('Only an active owner-imported CSV job can authorize prospect research.');const selected=new Set(job.rowIds),selectedRows=w.prospectRows.filter(r=>r.batchId===job.batchId&&selected.has(r.id));const rowSnapshots=new Map(selectedRows.map(r=>[r.id,JSON.stringify(r.normalized)]));const rows=new Map(selectedRows.map(r=>[r.id,{...r.normalized,website:r.normalized.website||r.result?.website||'',domain:r.normalized.domain||r.result?.domain||''}]));const token=crypto.randomUUID();this.capabilities.set(token,{workspaceId:m.workspaceId,jobId:job.id,rows,rowSnapshots,settings:prospectSettingsSchema.parse(job.settings),controller:new AbortController(),companies:new Map()});return {ok:true,value:{token}};
   }
   case 'research.cancel':{const c=this.capabilities.get(m.token);c?.controller.abort();this.capabilities.delete(m.token);return {ok:true,value:{cancelled:true}};}
   case 'research.company':{
    const c=this.capabilities.get(m.token);if(!c)throw new Error('Research capability expired. Unlock research and resume the job.');const latest=await this.workspace(c.workspaceId);const job=latest.prospectJobs.find(j=>j.id===c.jobId);if(!job||!['queued','running'].includes(job.status)){c.controller.abort();this.capabilities.delete(m.token);throw new Error('Authorized prospect job is no longer active; paused or cancelled work cannot fetch.');}const row=c.rows.get(m.rowId),latestRow=latest.prospectRows.find(r=>r.id===m.rowId);if(!row||!job.rowIds.includes(m.rowId)||!latestRow||latestRow.batchId!==job.batchId||!latest.prospectBatches.some(b=>b.id===job.batchId&&b.origin==='csv_prospect'))throw new Error('Prospect row is outside the authorized CSV batch.');if(JSON.stringify(latestRow.normalized)!==c.rowSnapshots.get(m.rowId)||JSON.stringify(job.settings)!==JSON.stringify(c.settings)){c.controller.abort();this.capabilities.delete(m.token);throw new Error('Workspace changed since research authorization; resume to authorize the current CSV scope.');}const key=companyGroupingKey(row)||'row:'+m.rowId;let pending=c.companies.get(key);if(!pending){pending=(async()=>{let searchRequests=0;const provider=await this.privateProvider(c.workspaceId);const research=await researchCompany(row,c.settings,{fetcher:this.deps.fetcher,allowOrigin:async url=>{const u=new URL(url);if(!await this.deps.hasOrigin(u.origin+'/*'))return false;if(!await this.publicDomain(u.hostname,c.controller.signal))throw new Error('Public company hostname did not resolve exclusively to public IP addresses.');return true;},search:provider?async(q,signal)=>{searchRequests++;return this.search(c.workspaceId,q,signal);}:undefined},c.controller.signal);return {research,searchRequests};})();c.companies.set(key,pending);}return {ok:true,value:await pending};
   }
  }}catch(e){const error=e instanceof Error?e.message:'Private research operation failed.';return {ok:false,error:error.slice(0,1000)};}
 }
}
export const indexedBrokerStorage:BrokerStorage={
 async get(store,key){const db=await database();try{return await new Promise((resolve,reject)=>{const r=db.transaction(store).objectStore(store).get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}finally{db.close();}},
 async put(store,key,value){const db=await database();try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).put(value,key);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});}finally{db.close();}},
 async remove(store,key){const db=await database();try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).delete(key);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});}finally{db.close();}}
};
