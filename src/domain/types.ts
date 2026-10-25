import type {ColumnMapping,ProspectBatch,ProspectRow,ProspectJob,ProspectCompanyCache,ProspectSettings,ProspectResult} from './prospectTypes';
export type ConnectorId='usaspending-awards'|'austin-permits'|'census-cbp'|'tdlr-projects'|'fmcsa-census'|'csv-import';
export interface SourceSettings {state:string;startDate:string;endDate:string;keyword:string;year:string;naics:string;limit:number}
export interface RetrievedRecord {id:string;title:string;organization:string;date:string;dateLabel:string;geography:string;reference:string;fields:Record<string,string|number|null>}
export interface SourceRun {id:string;sourceId:string;connectorId:ConnectorId;settings:SourceSettings;status:'succeeded'|'failed';startedAt:string;completedAt:string;requestUrl:string;responseHash:string;recordsFetched:number;records:RetrievedRecord[];error?:string;warning?:string;truncated:boolean;mode?:'network'|'manual_import';origin?:IntakeOrigin;feedId?:string;rawHeaders?:string[];rawRows?:string[][];importFileName?:string;importFileHash?:string}
export type Sector = 'Business' | 'Finance' | 'Construction' | 'Real Estate' | 'Technology' | 'Logistics' | 'Energy';
export type Tier = 'A' | 'B' | 'C' | 'D';
export interface Source { id:string; name:string; family:string; url:string; tier:Tier; geography:string; mode:'manual'|'import'|'connected'; health:'not checked'|'imported'|'failed'|'retrieved'; cadence:string; lastImport?:string; limitations:string; connectorId?:ConnectorId; settings?:SourceSettings; lastAttempt?:string; lastSuccess?:string; lastError?:string;feedId?:string }
export type IntakeOrigin='csv_prospect'|'intelligence_signal'|'user_entry'|'intelligence_opportunity';
export interface Company { id:string; name:string; normalizedName:string; domain:string; geography:string; sectors:Sector[]; aliases:string[];origins?:IntakeOrigin[];address?:string;naics?:string;primarySector?:Sector;subsector?:string }
export interface Evidence { id:string; sourceId:string; reference:string; excerpt:string; tier:Tier; eventDate:string; publishedAt:string; discoveredAt:string; importedAt:string; observed:boolean; hash:string; review:'unreviewed'|'verified'|'contradicted';origin?:IntakeOrigin;prospectBatchId?:string }
export interface EOSComponents { trigger:number; need:number; capacity:number; fit:number; access:number }
export interface Signal { id:string; companyId:string; title:string; family:string; trigger:string; eventId:string; eventDate:string; geography:string; sectors:Sector[]; evidenceIds:string[]; fingerprint:string; need:string; components:EOSComponents; score:number; scoreVersion:string; createdAt:string;origin?:IntakeOrigin;permitLeadScore?:number }
export interface Opportunity { id:string; companyId:string; signalId:string; title:string; need:string; offer:string; ownerRole:string; stage:'Qualified'|'Discovery'|'Proposal'|'Won'|'Lost'|'Nurture'; createdAt:string; outcomeNote?:string;origin?:IntakeOrigin }
export interface Contact {id:string;companyId:string;name:string;role:string;email:string;status:'user-provided'|'unverified candidate'|'verified public'|'unavailable';reference:string;suppressed:boolean;origin?:IntakeOrigin;origins?:IntakeOrigin[];prospectRowIds?:string[];prospectRowId?:string;contactConfidence?:number;review?:'accepted'|'unreviewed'|'rejected';reasonOwnsProblem?:string}
export interface Engagement {id:string;opportunityId:string;companyId:string;name:string;owner:string;status:'Active'|'At risk'|'Complete';budgetCents:number;baseline:string;acceptance:string;createdAt:string}
export interface Task {id:string;engagementId:string;title:string;owner:string;due:string;status:'To do'|'In progress'|'Done';kind:'Task'|'Risk'|'Decision'|'Milestone';benefitCents:number}
export interface Approval {id:string;companyId:string;contactId:string;subject:string;body:string;destination:string;hash:string;policyVersion:string;status:'Pending'|'Approved'|'Rejected';createdAt:string;expiresAt:string;decidedAt?:string;decisionBy?:string}
export interface AuditEvent {id:string;at:string;action:string;entityId:string;detail:string}
export interface Job {id:string;kind:'report';entityId:string;state:'queued'|'running'|'succeeded'|'failed'|'cancelled';idempotencyKey:string;attempts:number;checkpoint:string;error?:string;createdAt:string;updatedAt:string}
export interface Artifact {id:string;title:string;kind:'executive-brief';body:string;createdAt:string;review:'Draft'|'Reviewed';workspaceId:string}
export interface Workspace {schemaVersion:1;id:string;name:string;deviceId:string;revision:number;demo:boolean;createdAt:string;updatedAt:string;sources:Source[];companies:Company[];evidence:Evidence[];signals:Signal[];opportunities:Opportunity[];contacts:Contact[];engagements:Engagement[];tasks:Task[];approvals:Approval[];audit:AuditEvent[];jobs:Job[];artifacts:Artifact[];sourceRuns:SourceRun[];prospectBatches:ProspectBatch[];prospectRows:ProspectRow[];prospectJobs:ProspectJob[];prospectCompanyCache:ProspectCompanyCache[];mappingTemplates:{id:string;name:string;mapping:ColumnMapping;createdAt:string}[]}
export interface SignalInput { companyName:string; domain:string; title:string; family:string; trigger:string; eventId:string; eventDate:string; publishedAt:string; geography:string; sectors:Sector[]; sourceId:string; reference:string; excerpt:string; need:string; components:EOSComponents;permitLeadScore?:number }
export type Action =
 | {type:'source.csv.import';feedId:string;fileName:string;fileHash:string;headers:string[];rows:string[][]}
 | {type:'prospects.import';input:{fileName:string;fileHash:string;headers:string[];rows:string[][];mapping:ColumnMapping}}
 | {type:'prospects.remap';batchId:string;mapping:ColumnMapping}
 | {type:'prospects.mapping.save';name:string;mapping:ColumnMapping}
 | {type:'prospects.review';rowIds:string[];review:'accepted'|'rejected'|'unreviewed'}
 | {type:'prospects.promote';rowIds:string[]}
 | {type:'prospects.exported';batchId:string}
 | {type:'prospects.start';batchId:string;settings:ProspectSettings;rowIds?:string[]}
 | {type:'prospects.control';jobId:string;control:'pause'|'resume'|'cancel'|'retry_failed'}
 | {type:'prospects.job.running';jobId:string}
 | {type:'prospects.checkpoint';jobId:string;results:{rowId:string;result:ProspectResult}[];cache?:ProspectCompanyCache;metrics?:{pagesFetched?:number;searchRequests?:number;cacheHits?:number;companiesResearched?:number};currentCompany?:string}
 | {type:'prospects.job.finish';jobId:string;error?:string}

 | {type:'source.connect';connectorId:ConnectorId;settings:SourceSettings}
 | {type:'source.configure';sourceId:string;settings:SourceSettings}
 | {type:'source.retrieved';run:SourceRun}
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
export interface AppProps {workspace:Workspace;act:(action:Action)=>Promise<void>;onLock:()=>void;onExport:()=>Promise<void>;onImport:(file:File,password:string)=>Promise<void>;onSwitch:()=>void;storageMode:string;saveStatus:string;onPullSource:(sourceId:string,credentials?:{censusApiKey?:string})=>Promise<void>;onRunProspecting:(batchId:string,settings:ProspectSettings,rowIds?:string[])=>Promise<void>;onControlProspecting:(jobId:string,control:'pause'|'resume'|'cancel'|'retry_failed')=>Promise<void>}
