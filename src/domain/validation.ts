import {z} from 'zod';
import type {Workspace} from './types';
const text=z.string().max(20000), short=z.string().max(300), id=z.string().min(1).max(100);
const date=z.string().datetime({offset:true});
const day=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v=>!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v,'Invalid date');
const money=z.number().int().safe().nonnegative();
const sector=z.enum(['Business','Finance','Construction','Real Estate','Technology','Logistics','Energy']);
const arr=<T extends z.ZodTypeAny>(schema:T)=>z.array(schema).max(10000);
export const safeReference=z.string().max(2000).refine(s=>{if(!s)return true;try{const u=new URL(s);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}},'Use a full HTTPS source reference');
export const sourceSchema=z.object({id,name:short.min(1),family:short.min(1),url:safeReference,tier:z.enum(['A','B','C','D']),geography:short,mode:z.enum(['manual','import']),health:z.enum(['not checked','imported','failed']),cadence:short,lastImport:date.optional(),limitations:text}).strict();
const company=z.object({id,name:short.min(1),normalizedName:short.min(1),domain:short,geography:short,sectors:arr(sector),aliases:arr(short)}).strict();
const evidence=z.object({id,sourceId:id,reference:safeReference,excerpt:text.min(1),tier:z.enum(['A','B','C','D']),eventDate:day,publishedAt:day,discoveredAt:date,importedAt:date,observed:z.boolean(),hash:short.min(1),review:z.enum(['unreviewed','verified','contradicted'])}).strict();
const components=z.object({trigger:z.number().int().min(0).max(30),need:z.number().int().min(0).max(25),capacity:z.number().int().min(0).max(20),fit:z.number().int().min(0).max(15),access:z.number().int().min(0).max(10)}).strict();
const signal=z.object({id,companyId:id,title:short.min(1),family:short,trigger:short.min(1),eventId:short,eventDate:day,geography:short,sectors:arr(sector),evidenceIds:arr(id),fingerprint:z.string().min(1).max(2000),need:text,components,score:z.number().min(0).max(100),scoreVersion:short,createdAt:date}).strict();
const opportunity=z.object({id,companyId:id,signalId:id,title:short,need:text,offer:text,ownerRole:short,stage:z.enum(['Qualified','Discovery','Proposal','Won','Lost','Nurture']),createdAt:date,outcomeNote:text.optional()}).strict();
export const contactSchema=z.object({id,companyId:id,name:short.min(1),role:short,email:z.union([z.literal(''),z.string().email().max(300)]),status:z.enum(['user-provided','unverified candidate','verified public','unavailable']),reference:safeReference,suppressed:z.boolean()}).strict().refine(c=>c.status!=='verified public'||!!c.reference,'Verified public contacts require a public HTTPS reference');
const engagement=z.object({id,opportunityId:id,companyId:id,name:short.min(1),owner:short.min(1),status:z.enum(['Active','At risk','Complete']),budgetCents:money,baseline:text,acceptance:text,createdAt:date}).strict();
const task=z.object({id,engagementId:id,title:short.min(1),owner:short,due:day,status:z.enum(['To do','In progress','Done']),kind:z.enum(['Task','Risk','Decision','Milestone']),benefitCents:money}).strict();
const approval=z.object({id,companyId:id,contactId:id,subject:short.min(1),body:text.min(1),destination:z.string().email().max(300),hash:short,policyVersion:short,status:z.enum(['Pending','Approved','Rejected']),createdAt:date,expiresAt:date,decidedAt:date.optional(),decisionBy:short.optional()}).strict();
const audit=z.object({id,at:date,action:short,entityId:short,detail:text}).strict();
const job=z.object({id,kind:z.literal('report'),entityId:short,state:z.enum(['queued','running','succeeded','failed','cancelled']),idempotencyKey:short,attempts:z.number().int().min(0).max(10),checkpoint:text,error:text.optional(),createdAt:date,updatedAt:date}).strict();
const artifact=z.object({id,title:short,kind:z.literal('executive-brief'),body:z.string().max(300000),createdAt:date,review:z.enum(['Draft','Reviewed']),workspaceId:id}).strict();
const schema=z.object({schemaVersion:z.literal(1),id,name:short.min(1),deviceId:id,revision:z.number().int().safe().nonnegative(),demo:z.boolean(),createdAt:date,updatedAt:date,sources:arr(sourceSchema),companies:arr(company),evidence:arr(evidence),signals:arr(signal),opportunities:arr(opportunity),contacts:arr(contactSchema),engagements:arr(engagement),tasks:arr(task),approvals:arr(approval),audit:arr(audit),jobs:arr(job),artifacts:arr(artifact)}).strict();
export function validateWorkspace(value:unknown):Workspace {
  const w=schema.parse(value) as Workspace;
  const allIds=new Set<string>();
  for(const collection of [w.sources,w.companies,w.evidence,w.signals,w.opportunities,w.contacts,w.engagements,w.tasks,w.approvals,w.audit,w.jobs,w.artifacts])for(const r of collection){if(allIds.has(r.id))throw new Error('Duplicate record identifier');allIds.add(r.id);}
  const has=(records:{id:string}[],value:string)=>{if(!records.some(r=>r.id===value))throw new Error('Broken or cross-workspace record link: '+value);};
  for(const e of w.evidence){has(w.sources,e.sourceId);if(e.tier!==w.sources.find(s=>s.id===e.sourceId)!.tier)throw new Error('Evidence tier does not match source');}
  for(const s of w.signals){has(w.companies,s.companyId);s.evidenceIds.forEach(e=>has(w.evidence,e));const sum=Object.values(s.components).reduce((a,b)=>a+b,0);if(s.score!==sum)throw new Error('EOS components do not reconcile');}
  for(const o of w.opportunities){has(w.companies,o.companyId);has(w.signals,o.signalId);if(w.signals.find(s=>s.id===o.signalId)!.companyId!==o.companyId)throw new Error('Opportunity company mismatch');}
  for(const c of w.contacts)has(w.companies,c.companyId);
  for(const e of w.engagements){has(w.opportunities,e.opportunityId);if(w.opportunities.find(o=>o.id===e.opportunityId)!.companyId!==e.companyId)throw new Error('Engagement company mismatch');}
  for(const t of w.tasks)has(w.engagements,t.engagementId);
  for(const a of w.approvals){has(w.contacts,a.contactId);if(w.contacts.find(c=>c.id===a.contactId)!.companyId!==a.companyId)throw new Error('Approval company mismatch');}
  for(const a of w.artifacts)if(a.workspaceId!==w.id)throw new Error('Cross-workspace artifact');
  return w;
}
