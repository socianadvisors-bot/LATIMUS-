import {sha256} from '../platform/crypto';
import {assertProspectResultConsistency} from './prospectPolicy';
import type {Action,Company,Workspace} from './types';
import type {ColumnMapping,ProspectRow,CompanyResearch} from './prospectTypes';
import {MAPPING_VERSION,normalizeProspectRow,normalizeCompany,normalizeEmail,normalizePerson,normalizeDomain,normalizeURL} from './prospecting';
import {mappingSchema,prospectResearchSchema,prospectResultSchema,prospectSettingsSchema} from './prospectValidation';
function requireValue<T>(v:T|undefined,message:string):T{if(!v)throw new Error(message);return v;}
function mappingCheck(headers:string[],mapping:ColumnMapping){mappingSchema.parse(mapping);for(const index of Object.values(mapping))if(index!==null&&index>=headers.length)throw new Error('Mapped column does not exist.');const indexes=Object.values(mapping).filter(v=>v!==null);if(new Set(indexes).size!==indexes.length)throw new Error('Map each source column to at most one normalized field.');}
type CompanyLookup={domains:Map<string,Company[]>;names:Map<string,Company[]>};
function buildLookup(w:Workspace):CompanyLookup{const d=new Map<string,Company[]>(),n=new Map<string,Company[]>();for(const c of w.companies){if(c.domain)d.set(c.domain,[...(d.get(c.domain)||[]),c]);n.set(c.normalizedName,[...(n.get(c.normalizedName)||[]),c]);}return {domains:d,names:n};}
function linkCompany(w:Workspace,row:ProspectRow,lookup=buildLookup(w)){
 const n=row.normalized;if(!n.company&&!n.domain)return;
 let candidates=[...(n.domain?lookup.domains.get(n.domain):lookup.names.get(n.normalizedCompany))||[]];
 if(!n.domain)candidates=candidates.filter(c=>(!c.address||!n.address||c.address.toLowerCase()===n.address.toLowerCase())&&(!c.geography||![n.city,n.state].filter(Boolean).length||c.geography.toLowerCase()===[n.city,n.state].filter(Boolean).join(', ').toLowerCase()));
 if(candidates.length>1){row.errors.push('Ambiguous existing company; resolve identity before CRM promotion.');return;}
 let c=candidates[0];if(c&&n.domain&&c.name&&n.company&&normalizeCompany(c.name)!==n.normalizedCompany){row.errors.push('Domain is shared by differently named companies; identity review is required.');return;}
 if(!c){c={id:crypto.randomUUID(),name:n.company||n.domain,normalizedName:n.normalizedCompany||normalizeCompany(n.domain),domain:n.domain,geography:[n.city,n.state].filter(Boolean).join(', '),sectors:[],aliases:[],origins:['csv_prospect'],address:n.address};w.companies.push(c);if(c.domain)lookup.domains.set(c.domain,[...(lookup.domains.get(c.domain)||[]),c]);lookup.names.set(c.normalizedName,[...(lookup.names.get(c.normalizedName)||[]),c]);}
 else c.origins=[...new Set([...(c.origins||['intelligence_signal']),'csv_prospect'] as const)];
 row.companyId=c.id;
}

/** Materialize public page provenance into the shared evidence spine, without creating an event. */
async function materializeProspectEvidence(w:Workspace,batchId:string,research:CompanyResearch,now:string){
 if(!research.pages.length)return;
 const domain=normalizeDomain(research.domain||research.website);if(!domain)throw new Error('Public research page evidence has no valid company-domain scope.');
 const sourceId='prospect-source-'+(await sha256(domain)).slice(0,32);const sourceUrl='https://'+domain;
 let source=w.sources.find(s=>s.id===sourceId);
 if(source&&(source.url!==sourceUrl||source.tier!=='B'))throw new Error('Public company source scope is inconsistent.');
 if(!source){source={id:sourceId,name:'Public Company Pages · '+domain,family:'Prospect Research',url:sourceUrl,tier:'B',geography:'',mode:'import',health:'imported',cadence:'On-demand prospect research',limitations:'Cached public company-page evidence imported from Prospecting research, not a live intelligence API or an event. Company association and source claims require review.'};w.sources.push(source);}
 source.lastImport=now;source.health='imported';
 const ids=new Set(w.evidence.map(e=>e.id));
 for(const page of research.pages){
  const validated=normalizeURL(page.url);if(!validated||!page.url.startsWith('https:')||normalizeDomain(validated)!==domain)throw new Error('Public research page provenance URL does not match the company scope.');const actual=new URL(page.url);actual.hash='';const url=actual.href;
  const snapshot=page.contentHash&&/^[a-f0-9]{64}$/.test(page.contentHash)?page.contentHash:await sha256(JSON.stringify([page.title,page.excerpt]));
  const evidenceId='prospect-page-'+(await sha256(JSON.stringify([sourceId,url,snapshot]))).slice(0,40);
  if(ids.has(evidenceId))continue;
  w.evidence.push({id:evidenceId,sourceId,reference:url,excerpt:page.excerpt||page.title||'Public page snapshot; no excerpt supplied.',tier:'B',eventDate:'',publishedAt:'',discoveredAt:page.checkedAt,importedAt:now,observed:true,hash:snapshot,review:'unreviewed',origin:'csv_prospect',prospectBatchId:batchId});ids.add(evidenceId);
 }
}

export async function applyProspectAction(w:Workspace,action:Action):Promise<string>{
 const now=new Date().toISOString();let entity=w.id;
 switch(action.type){
 case 'prospects.import':{
  const p=action.input;if(!p.fileName.trim()||!p.headers.length||p.headers.length>200||p.rows.length>50000)throw new Error('CSV import exceeds supported row/column limits.');if(w.prospectBatches.some(b=>b.fileHash===p.fileHash))throw new Error('This exact CSV file was already imported; reopen its existing batch.');mappingCheck(p.headers,p.mapping);
  const lookup=buildLookup(w);if(w.prospectRows.length+p.rows.length>50000)throw new Error('Workspace prospect-row capacity reached.');const batchId=crypto.randomUUID();entity=batchId;const rows=p.rows.map((original,index)=>{if(original.length>p.headers.length)throw new Error('CSV contains more cells than header columns.');const row:ProspectRow={id:crypto.randomUUID(),batchId,index,original:[...original],normalized:normalizeProspectRow(original,p.headers,p.mapping),result:null,errors:[],review:'unreviewed',updatedAt:now};linkCompany(w,row,lookup);return row;});w.prospectRows.push(...rows);w.prospectBatches.push({id:batchId,fileName:p.fileName,fileHash:p.fileHash,headers:[...p.headers],mapping:{...p.mapping},mappingVersion:MAPPING_VERSION,createdAt:now,rowCount:rows.length,warnings:[],origin:'csv_prospect'});break;
 }
 case 'prospects.remap':{
  const b=requireValue(w.prospectBatches.find(b=>b.id===action.batchId),'Import batch not found.');if(w.prospectJobs.some(j=>j.batchId===b.id&&['running','queued'].includes(j.status)))throw new Error('Pause or cancel the batch before remapping.');if(w.prospectRows.some(r=>r.batchId===b.id&&r.crmContactId))throw new Error('A promoted batch cannot be remapped; import a corrected file to preserve CRM lineage.');mappingCheck(b.headers,action.mapping);for(const job of w.prospectJobs.filter(j=>j.batchId===b.id)){job.status='cancelled';job.completedRowIds=[];job.currentCompany='';job.error='Mapping changed; start new work or retry all selected rows under the new mapping.';job.updatedAt=now;delete job.completedAt;}b.mapping={...action.mapping};const lookup=buildLookup(w);for(const r of w.prospectRows.filter(r=>r.batchId===b.id)){r.normalized=normalizeProspectRow(r.original,b.headers,b.mapping);r.result=null;r.review='unreviewed';r.errors=[];delete r.companyId;r.updatedAt=now;linkCompany(w,r,lookup);}entity=b.id;break;
 }
 case 'prospects.mapping.save':{mappingSchema.parse(action.mapping);if(!action.name.trim())throw new Error('Name the mapping template.');if(w.mappingTemplates.length>=100)throw new Error('Mapping template capacity reached.');w.mappingTemplates.push({id:crypto.randomUUID(),name:action.name.trim(),mapping:{...action.mapping},createdAt:now});break;}
 case 'prospects.review':{if(!action.rowIds.length)throw new Error('Select at least one imported row.');for(const id of action.rowIds){const r=requireValue(w.prospectRows.find(r=>r.id===id),'Prospect row not found.');r.review=action.review;r.updatedAt=now;}break;}
 case 'prospects.promote':{
  if(!action.rowIds.length)throw new Error('Select reviewed prospects to promote.');for(const id of action.rowIds){const r=requireValue(w.prospectRows.find(r=>r.id===id),'Prospect row not found.');if(r.review!=='accepted')throw new Error('Accept each selected row in the review queue before CRM promotion.');if(r.crmContactId)continue;if(r.result)assertProspectResultConsistency(r,r.result);const c=requireValue(w.companies.find(c=>c.id===r.companyId),'Resolve the prospect company before CRM promotion.');const email=normalizeEmail(r.result?.workEmail||r.normalized.email);if(!r.normalized.person)throw new Error('A named contact is required for contact promotion.');const existing=email?w.contacts.find(c=>c.email.toLowerCase()===email.toLowerCase()):undefined;if(existing){if(existing.suppressed)throw new Error('An existing contact is suppressed; promotion cannot bypass suppression.');if(existing.companyId!==c.id)throw new Error('This email belongs to a different account; review identity.');if(normalizePerson(existing.name)!==r.normalized.normalizedPerson)throw new Error('This email belongs to a different contact identity.');existing.origins=[...new Set([...(existing.origins||[existing.origin||'user_entry']),'csv_prospect'] as const)];existing.prospectRowIds=[...new Set([...(existing.prospectRowIds||[]),r.id])];existing.review='accepted';if(existing.status==='unverified candidate'&&email===normalizeEmail(r.normalized.email))existing.status='user-provided';r.crmContactId=existing.id;continue;}
   const verified=r.result?.status==='verified_work_email'&&r.result.emailConfidence>=80&&!!r.result.emailSource;
   const userProvided=email&&email===normalizeEmail(r.normalized.email);const contactId=crypto.randomUUID();w.contacts.push({id:contactId,companyId:c.id,name:r.normalized.person,role:r.result?.title||r.normalized.title,email,status:verified?'verified public':userProvided?'user-provided':email?'unverified candidate':'unavailable',reference:verified?r.result!.emailSource:'',suppressed:false,origin:'csv_prospect',origins:['csv_prospect'],prospectRowId:r.id,prospectRowIds:[r.id],contactConfidence:r.result?.emailConfidence||0,review:'accepted',reasonOwnsProblem:'Owner-selected CSV prospect; contact confidence is separate from opportunity EOS.'});r.crmContactId=contactId;r.updatedAt=now;
  }break;
 }
 case 'prospects.exported':{const b=requireValue(w.prospectBatches.find(b=>b.id===action.batchId),'Import not found.');b.lastExportedAt=now;entity=b.id;break;}
 case 'prospects.start':{
  const b=requireValue(w.prospectBatches.find(b=>b.id===action.batchId),'Import batch not found.');if(w.prospectJobs.some(j=>j.batchId===b.id&&['running','queued'].includes(j.status)))throw new Error('This batch already has active work.');const settings=prospectSettingsSchema.parse(action.settings);const selected=action.rowIds?new Set(action.rowIds):null;const ids=w.prospectRows.filter(r=>r.batchId===b.id&&(!selected||selected.has(r.id))).map(r=>r.id);if(!ids.length)throw new Error('No imported rows selected.');entity=crypto.randomUUID();w.prospectJobs.push({id:entity,batchId:b.id,status:'queued',rowIds:ids,completedRowIds:[],currentCompany:'',pagesFetched:0,searchRequests:0,cacheHits:0,companiesResearched:0,createdAt:now,updatedAt:now,settings});break;
 }
 case 'prospects.control':{
  const j=requireValue(w.prospectJobs.find(j=>j.id===action.jobId),'Prospect job not found.');if(action.control==='pause'){if(!['running','queued'].includes(j.status))throw new Error('Only active work can be paused.');j.status='paused';}
  if(action.control==='cancel'){if(j.status==='completed')throw new Error('Completed work cannot be cancelled.');j.status='cancelled';}
  if(['resume','retry_failed'].includes(action.control)&&w.prospectJobs.some(other=>other.id!==j.id&&other.batchId===j.batchId&&['queued','running'].includes(other.status)))throw new Error('Another job is already active for this CSV batch.');
  if(action.control==='resume'){if(!['paused','failed'].includes(j.status))throw new Error('This job is not paused.');j.status='queued';delete j.error;delete j.completedAt;}
  if(action.control==='retry_failed'){const rowsById=new Map(w.prospectRows.map(r=>[r.id,r]));const done=new Set(j.completedRowIds);const retry=new Set(j.rowIds.filter(id=>!done.has(id)||rowsById.get(id)?.result?.status==='error'));if(!retry.size)throw new Error('No failed or unfinished rows to retry.');j.completedRowIds=j.completedRowIds.filter(id=>!retry.has(id));j.status='queued';delete j.error;delete j.completedAt;}
  j.updatedAt=now;entity=j.id;break;
 }
 case 'prospects.job.running':{const j=requireValue(w.prospectJobs.find(j=>j.id===action.jobId),'Job not found.');if(!['queued','running'].includes(j.status))throw new Error('Prospect job is not runnable.');j.status='running';j.startedAt??=now;j.updatedAt=now;entity=j.id;break;}
 case 'prospects.checkpoint':{
  const j=requireValue(w.prospectJobs.find(j=>j.id===action.jobId),'Job not found.');if(j.status!=='running')throw new Error('Job was paused or cancelled before this checkpoint.');
  const rowsById=new Map(w.prospectRows.map(r=>[r.id,r]));const selected=new Set(j.rowIds),completed=new Set(j.completedRowIds),updated=new Set<string>();
  for(const update of action.results){const r=requireValue(rowsById.get(update.rowId),'Prospect row not in this job batch.');if(r.batchId!==j.batchId)throw new Error('Prospect row not in this job batch.');if(!selected.has(r.id))throw new Error('Unselected prospect cannot be updated.');if(updated.has(r.id))throw new Error('Duplicate row updates in a checkpoint require retry reconciliation.');updated.add(r.id);const parsed=prospectResultSchema.parse(update.result);assertProspectResultConsistency(r,parsed);r.result=parsed;r.updatedAt=now;r.review='unreviewed';completed.add(r.id);}
  j.completedRowIds=[...completed];
  if(action.cache){const research=prospectResearchSchema.parse(action.cache.research);if(research.pages.length){
   await materializeProspectEvidence(w,j.batchId,research,now);
   const domain=normalizeDomain(research.domain||research.website);if(domain&&research.companyConfidence>=80){const companies=new Map(w.companies.map(c=>[c.id,c]));const occupied=new Map(w.companies.filter(c=>c.domain).map(c=>[c.domain,c.id]));for(const rowId of updated){const row=rowsById.get(rowId)!;const company=row.companyId?companies.get(row.companyId):undefined;if(!company||company.domain||normalizeCompany(company.name)!==row.normalized.normalizedCompany||normalizeCompany(research.companyName)!==row.normalized.normalizedCompany)continue;const conflict=occupied.get(domain);if(conflict&&conflict!==company.id){row.errors.push('Resolved domain already belongs to another company; review identity before merging or CRM promotion.');if(row.result){row.result.status='review_required';row.result.workEmail='';row.result.emailConfidence=0;row.result.emailQuality='unavailable';}continue;}company.domain=domain;occupied.set(domain,company.id);}}
   w.prospectCompanyCache=w.prospectCompanyCache.filter(c=>c.key!==action.cache!.key);w.prospectCompanyCache.push(action.cache);while(w.prospectCompanyCache.length>100||JSON.stringify(w.prospectCompanyCache).length>2000000)w.prospectCompanyCache.shift();
  }}
  const m=action.metrics;if(m){j.pagesFetched+=m.pagesFetched||0;j.searchRequests+=m.searchRequests||0;j.cacheHits+=m.cacheHits||0;j.companiesResearched+=m.companiesResearched||0;}j.currentCompany=action.currentCompany||j.currentCompany;j.updatedAt=now;entity=j.id;break;
 }
 case 'prospects.job.finish':{const j=requireValue(w.prospectJobs.find(j=>j.id===action.jobId),'Job not found.');if(!['queued','running'].includes(j.status))throw new Error('Stopped job cannot be completed.');if(!action.error&&j.completedRowIds.length!==j.rowIds.length)throw new Error('Cannot complete a job with unfinished prospect rows.');j.status=action.error?'failed':'completed';j.error=action.error;j.completedAt=now;j.updatedAt=now;entity=j.id;break;}
 default:throw new Error('Unknown prospect action.');
 }
 return entity;
}
