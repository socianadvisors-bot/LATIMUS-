export type Sector = 'Business' | 'Finance' | 'Construction' | 'Real Estate' | 'Technology' | 'Logistics' | 'Energy';
export type Tier = 'A' | 'B' | 'C' | 'D';
export interface Source { id:string; name:string; family:string; url:string; tier:Tier; geography:string; mode:'manual'|'import'; health:'not checked'|'imported'|'failed'; cadence:string; lastImport?:string; limitations:string }
export interface Company { id:string; name:string; normalizedName:string; domain:string; geography:string; sectors:Sector[]; aliases:string[] }
export interface Evidence { id:string; sourceId:string; reference:string; excerpt:string; tier:Tier; eventDate:string; publishedAt:string; discoveredAt:string; importedAt:string; observed:boolean; hash:string; review:'unreviewed'|'verified'|'contradicted' }
export interface EOSComponents { trigger:number; need:number; capacity:number; fit:number; access:number }
export interface Signal { id:string; companyId:string; title:string; family:string; trigger:string; eventId:string; eventDate:string; geography:string; sectors:Sector[]; evidenceIds:string[]; fingerprint:string; need:string; components:EOSComponents; score:number; scoreVersion:string; createdAt:string }
export interface Opportunity { id:string; companyId:string; signalId:string; title:string; need:string; offer:string; ownerRole:string; stage:'Qualified'|'Discovery'|'Proposal'|'Won'|'Lost'|'Nurture'; createdAt:string; outcomeNote?:string }
export interface Contact {id:string;companyId:string;name:string;role:string;email:string;status:'user-provided'|'unverified candidate'|'verified public'|'unavailable';reference:string;suppressed:boolean}
export interface Engagement {id:string;opportunityId:string;companyId:string;name:string;owner:string;status:'Active'|'At risk'|'Complete';budgetCents:number;baseline:string;acceptance:string;createdAt:string}
export interface Task {id:string;engagementId:string;title:string;owner:string;due:string;status:'To do'|'In progress'|'Done';kind:'Task'|'Risk'|'Decision'|'Milestone';benefitCents:number}
export interface Approval {id:string;companyId:string;contactId:string;subject:string;body:string;destination:string;hash:string;policyVersion:string;status:'Pending'|'Approved'|'Rejected';createdAt:string;expiresAt:string;decidedAt?:string;decisionBy?:string}
export interface AuditEvent {id:string;at:string;action:string;entityId:string;detail:string}
export interface Job {id:string;kind:'report';entityId:string;state:'queued'|'running'|'succeeded'|'failed'|'cancelled';idempotencyKey:string;attempts:number;checkpoint:string;error?:string;createdAt:string;updatedAt:string}
export interface Artifact {id:string;title:string;kind:'executive-brief';body:string;createdAt:string;review:'Draft'|'Reviewed';workspaceId:string}
export interface Workspace {schemaVersion:1;id:string;name:string;deviceId:string;revision:number;demo:boolean;createdAt:string;updatedAt:string;sources:Source[];companies:Company[];evidence:Evidence[];signals:Signal[];opportunities:Opportunity[];contacts:Contact[];engagements:Engagement[];tasks:Task[];approvals:Approval[];audit:AuditEvent[];jobs:Job[];artifacts:Artifact[]}
export interface SignalInput { companyName:string; domain:string; title:string; family:string; trigger:string; eventId:string; eventDate:string; publishedAt:string; geography:string; sectors:Sector[]; sourceId:string; reference:string; excerpt:string; need:string; components:EOSComponents }
export type Action =
 | {type:'source.add';input:Omit<Source,'id'|'health'|'lastImport'>}
 | {type:'signal.add';input:SignalInput}
 | {type:'evidence.review';id:string;review:Evidence['review']}
 | {type:'signals.import';input:SignalInput[]}
 | {type:'opportunity.qualify';signalId:string}
 | {type:'opportunity.stage';id:string;stage:Opportunity['stage'];note?:string}
 | {type:'contact.add';input:Omit<Contact,'id'>}
 | {type:'contact.suppress';id:string}
 | {type:'approval.draft';input:Pick<Approval,'companyId'|'contactId'|'subject'|'body'>}
 | {type:'approval.decide';id:string;approve:boolean;reviewer:string}
 | {type:'engagement.add';input:Omit<Engagement,'id'|'createdAt'>}
 | {type:'task.add';input:Omit<Task,'id'>}
 | {type:'task.status';id:string;status:Task['status']}
 | {type:'report.queue'}
 | {type:'jobs.run'}
 | {type:'job.cancel';id:string}
 | {type:'artifact.review';id:string};
export interface AppProps {workspace:Workspace;act:(action:Action)=>Promise<void>;onLock:()=>void;onExport:()=>Promise<void>;onImport:(file:File,password:string)=>Promise<void>;onSwitch:()=>void;storageMode:string;saveStatus:string}
