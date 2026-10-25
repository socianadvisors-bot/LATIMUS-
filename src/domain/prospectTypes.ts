/** CSV prospecting is an explicit owner-selected intake, independent of signal EOS. */
export const PROSPECT_FIELDS=['company','address','person','title','phone','website','linkedin','email','city','state','postalCode','notes'] as const;
export type ProspectField=typeof PROSPECT_FIELDS[number];
export type ColumnMapping=Record<ProspectField,number|null>;
export interface MappingExplanation {field:ProspectField;column:number|null;confidence:number;reason:string}
export interface MappingProposal {mapping:ColumnMapping;explanations:MappingExplanation[]}
export interface ParsedProspectCsv {headers:string[];rows:string[][];warnings:string[]}
export interface CsvParseOptions {maxRows?:number;maxBytes?:number;delimiter?:','|';'|'\t';signal?:AbortSignal}
export interface NormalizedProspect {company:string;address:string;person:string;title:string;phone:string;website:string;linkedin:string;email:string;city:string;state:string;postalCode:string;notes:string;normalizedCompany:string;normalizedPerson:string;domain:string;normalizedPhone:string;errors:string[]}
export type ProspectStatus='verified_work_email'|'candidate_work_email'|'company_only'|'not_found'|'company_not_resolved'|'insufficient_input'|'review_required'|'error';
export type EmailSourceType='mailto'|'visible_text'|'structured_data'|'obfuscated'|'search_snippet'|'user_provided'|'inferred';
export interface ObservedEmail {email:string;sourceUrl:string;sourceType:EmailSourceType;context:string;pageTitle:string;observedAt:string;official:boolean;personName?:string;personTitle?:string;companyName?:string}
export interface ObservedPhone {phone:string;sourceUrl:string;context:string;kind:'company'|'person'|'unknown';observedAt:string}
export interface PageEvidence {url:string;title:string;excerpt:string;checkedAt:string;contentHash?:string}
export interface ParsedCompanyPage {url:string;title:string;text:string;emails:ObservedEmail[];phones:ObservedPhone[];profiles:string[];links:string[];evidence:PageEvidence;companyNames:string[]}
export type CompanyResolutionMethod='input_website'|'input_email_domain'|'search_name_address'|'search_name_phone'|'search_company_name'|'cached_company'|'existing_latimus_company'|'manual_confirmation'|'unresolved';
export interface CompanyResearch {domain:string;website:string;companyName:string;companyConfidence:number;resolutionMethod:CompanyResolutionMethod;emails:ObservedEmail[];phones:ObservedPhone[];profiles:string[];pages:PageEvidence[];errors:string[];checkedAt:string}
export interface EmailMatch {email:string;score:number;quality:'verified'|'candidate'|'weak'|'generic'|'inferred';reasons:string[];source:ObservedEmail}
export interface ProspectResult {status:ProspectStatus;domain:string;website:string;companyConfidence:number;companyResolution:CompanyResolutionMethod;person:string;title:string;workEmail:string;emailConfidence:number;emailQuality:string;companyEmail:string;businessPhone:string;linkedin:string;emailSource:string;phoneSource:string;sources:string[];pagesChecked:number;companyEmailsFound:string[];evidence:PageEvidence[];lastChecked:string;emailMatches:EmailMatch[];errors:string[]}
export interface ProspectBatch {id:string;fileName:string;fileHash:string;headers:string[];mapping:ColumnMapping;mappingVersion:string;createdAt:string;rowCount:number;warnings:string[];origin:'csv_prospect';lastExportedAt?:string}
export interface ProspectRow {id:string;batchId:string;index:number;original:string[];normalized:NormalizedProspect;companyId?:string;result:ProspectResult|null;errors:string[];review:'unreviewed'|'accepted'|'rejected';updatedAt:string;crmContactId?:string}
export interface ProspectSettings {concurrency:number;maxPages:number;requestDelayMs:number;timeoutMs:number;cacheMode:'use_cache'|'refresh_stale'|'force_refresh';cacheDays:7|30|90}
export interface ProspectJob {id:string;batchId:string;status:'queued'|'running'|'paused'|'cancelled'|'completed'|'failed';rowIds:string[];completedRowIds:string[];currentCompany:string;pagesFetched:number;searchRequests:number;cacheHits:number;companiesResearched:number;createdAt:string;updatedAt:string;startedAt?:string;completedAt?:string;error?:string;settings:ProspectSettings}
export interface ProspectCompanyCache {id:string;key:string;research:CompanyResearch;checkedAt:string}
export type ProspectExportProfile='full_fidelity'|'crm_import'|'poc_review'|'verified_contacts'|'exceptions'|'company_only'|'custom';
export interface ProspectExportOptions {profile?:ProspectExportProfile;selectedColumns?:string[];selectedRowIds?:string[];safeSpreadsheet?:boolean;includeBom?:boolean}
