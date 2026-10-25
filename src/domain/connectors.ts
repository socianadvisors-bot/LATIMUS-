import {z} from 'zod';
import type {ConnectorId,SourceSettings,RetrievedRecord} from './types';
export {SOURCE_CATALOG} from './sourceCatalog';
export const CONNECTORS=[
 {id:'usaspending-awards',name:'USAspending · Federal Contract Awards',family:'Procurement & Awards',url:'https://api.usaspending.gov/api/v2/search/spending_by_award/',tier:'A',kind:'company-events',origins:['https://api.usaspending.gov/*'],description:'Retrieve federal prime contracts by performance state, date window and optional keyword.',limitations:'Bounded first page, not exhaustive monitoring. Recipient is the awardee; agency is not the assumed client. Award performance/obligation dates are not publication dates. Needs browser CORS or optional extension permission. Live retrieval status is recorded per workspace.'},
 {id:'austin-permits',name:'City of Austin · Issued Construction Permits',family:'Capital Projects',url:'https://data.austintexas.gov/resource/3syk-w9eu.json',tier:'A',kind:'permit-records',origins:['https://data.austintexas.gov/*'],description:'Retrieve issued-permit records from Austin’s public Socrata dataset after checking its published column metadata.',limitations:'Austin only, bounded first page. Applicant/contractor is not automatically the owner or qualified prospect. Schema and access are checked at retrieval; live retrieval status is recorded per workspace.'},
 {id:'census-cbp',name:'U.S. Census · County Business Patterns',family:'Market Baselines',url:'https://api.census.gov/data.html',tier:'A',kind:'market-baseline',origins:['https://api.census.gov/*'],description:'Retrieve annual state-level establishment, employment and payroll totals for a NAICS group.',limitations:'Annual aggregate statistics, not real-time company events or outreach leads. Select a released 2023+ dataset year. Suppression flags are preserved. Public no-key request is subject to Census limits. Live retrieval status is recorded per workspace.'}
] as const;
export const STATE_FIPS:Record<string,string>={AL:'01',AK:'02',AZ:'04',AR:'05',CA:'06',CO:'08',CT:'09',DE:'10',DC:'11',FL:'12',GA:'13',HI:'15',ID:'16',IL:'17',IN:'18',IA:'19',KS:'20',KY:'21',LA:'22',ME:'23',MD:'24',MA:'25',MI:'26',MN:'27',MS:'28',MO:'29',MT:'30',NE:'31',NV:'32',NH:'33',NJ:'34',NM:'35',NY:'36',NC:'37',ND:'38',OH:'39',OK:'40',OR:'41',PA:'42',RI:'44',SC:'45',SD:'46',TN:'47',TX:'48',UT:'49',VT:'50',VA:'51',WA:'53',WV:'54',WI:'55',WY:'56'};
const day=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v=>!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v,'Invalid source date');
export const sourceSettingsSchema=z.object({state:z.string().refine(s=>!!STATE_FIPS[s],'Use a two-letter U.S. state code'),startDate:day,endDate:day,keyword:z.string().trim().max(100),year:z.string().regex(/^20\d{2}$/).refine(v=>Number(v)>=2023&&Number(v)<=new Date().getFullYear(),'Select a released 2023+ Census year'),naics:z.string().regex(/^\d{2,6}$/),limit:z.number().int().min(1).max(50)}).strict().refine(s=>s.startDate<=s.endDate,'Start date must not follow end date');
export function defaultSourceSettings():SourceSettings{return {state:'TX',startDate:new Date(Date.now()-30*86400000).toISOString().slice(0,10),endDate:new Date().toISOString().slice(0,10),keyword:'',year:'2023',naics:'00',limit:25};}
export function connectorDefinition(id:ConnectorId){const c=CONNECTORS.find(c=>c.id===id);if(!c)throw new Error('Unsupported source adapter');return c;}
export interface PublicRequest {url:string;method:'GET'|'POST';body?:string}
export function buildSourceRequest(id:ConnectorId,value:SourceSettings,austinColumns?:string[]):PublicRequest{
 const s=sourceSettingsSchema.parse(value);
 if(id==='usaspending-awards')return {url:'https://api.usaspending.gov/api/v2/search/spending_by_award/',method:'POST',body:JSON.stringify({filters:{award_type_codes:['A','B','C','D'],time_period:[{start_date:s.startDate,end_date:s.endDate}],place_of_performance_locations:[{country:'USA',state:s.state}],...(s.keyword?{keywords:[s.keyword]}:{})},fields:['Award ID','Recipient Name','Award Amount','Description','Base Obligation Date','Start Date','Last Modified Date','Awarding Agency','Place of Performance State Code','generated_internal_id'],page:1,limit:s.limit,sort:'Award Amount',order:'desc',subawards:false})};
 if(id==='census-cbp'){
  const url=new URL(`https://api.census.gov/data/${s.year}/cbp`);url.search=new URLSearchParams({get:'NAME,ESTAB,EMP,PAYANN,NAICS2022_LABEL',for:`state:${STATE_FIPS[s.state]}`,NAICS2022:s.naics,LFO:'001',EMPSZES:'001'}).toString();return {url:url.href,method:'GET'};
 }
 if(id==='austin-permits'){
  if(!austinColumns)throw new Error('Permit schema must be verified from official dataset metadata before retrieval.');
  const column=['issueddate','issue_date','issued_date'].find(c=>austinColumns.includes(c));if(!column)throw new Error('Austin dataset does not expose a recognized issue-date field. Schema review is required; no records were imported.');
  const url=new URL('https://data.austintexas.gov/resource/3syk-w9eu.json');const where=[`${column} >= '${s.startDate}T00:00:00'`,`${column} < '${new Date(Date.parse(s.endDate)+86400000).toISOString().slice(0,10)}T00:00:00'`];
  if(s.keyword){if(!austinColumns.includes('description'))throw new Error('Keyword filtering is unavailable for the returned permit schema.');where.push(`upper(description) like '%${s.keyword.toUpperCase().replace(/'/g,"''").replace(/[%_]/g,'')}%'`);}
  url.search=new URLSearchParams({'$limit':String(s.limit),'$order':`${column} DESC`,'$where':where.join(' AND ')}).toString();return {url:url.href,method:'GET'};
 }
 throw new Error('Unsupported source adapter');
}
const row=z.record(z.unknown());
function flatFields(value:Record<string,unknown>):Record<string,string|number|null>{return Object.fromEntries(Object.entries(value).slice(0,40).map(([k,v])=>[k.slice(0,100),v===null?null:typeof v==='number'&&Number.isFinite(v)?v:typeof v==='string'?v.slice(0,2000):JSON.stringify(v).slice(0,2000)]));}
function str(value:unknown):string{return typeof value==='string'?value:typeof value==='number'?String(value):'';}
export function parseAustinColumns(value:unknown):string[]{const v=z.object({columns:z.array(z.object({fieldName:z.string().max(200)}).passthrough()).max(500)}).passthrough().parse(value);return v.columns.map(c=>c.fieldName).filter(c=>/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(c));}
export function parseSourceResponse(id:ConnectorId,value:unknown,requestUrl:string,limit:number):{records:RetrievedRecord[];truncated:boolean;warning?:string}{
 if(id==='usaspending-awards'){
  const data=z.object({results:z.array(row).max(1000),page_metadata:z.object({hasNext:z.boolean().optional()}).passthrough().optional()}).passthrough().parse(value);
  const records=data.results.slice(0,limit).map(r=>{
   const key=str(r['Award ID']);const recipient=str(r['Recipient Name']);if(!key||!recipient)throw new Error('USAspending response is missing Award ID or Recipient Name. Nothing was committed.');
   const internal=str(r.generated_internal_id);return {id:`award:${internal||key}`,title:`Contract ${key}`,organization:recipient,date:str(r['Base Obligation Date']),dateLabel:'Base obligation date (not publication date)',geography:str(r['Place of Performance State Code']),reference:internal?`https://www.usaspending.gov/award/${encodeURIComponent(internal)}`:'https://www.usaspending.gov/search',fields:flatFields(r)};
  });return {records,truncated:data.page_metadata?.hasNext===true||data.results.length>limit,warning:'Results are federal contracts within the selected search window, not necessarily newly awarded contracts. Review obligation/event and publication dates before creating a signal. No score, POC or outreach is generated.'};
 }
 if(id==='austin-permits'){
  const data=z.array(row).max(1000).parse(value);const records=data.slice(0,limit).map(r=>{const key=str(r.permit_num||r.permit_number);if(!key)throw new Error('Austin response lacks a recognized permit number; schema review is required.');return {id:`austin:${key}`,title:`Permit ${key}`,organization:str(r.contractor_company_name),date:str(r.issueddate||r.issue_date||r.issued_date),dateLabel:'Permit issue date',geography:str(r.original_address1||r.original_address||'Austin, TX'),reference:`https://data.austintexas.gov/resource/3syk-w9eu.json?${new URLSearchParams({'$where':`${r.permit_num?'permit_num':'permit_number'}='${key.replace(/'/g,"''")}'`})}`,fields:flatFields(r)};});
  return {records,truncated:data.length>=limit,warning:'The organization field is the contractor when supplied, not a verified project owner. Identify the correct company and review evidence before qualifying a signal.'};
 }
 if(id==='census-cbp'){
  const data=z.array(z.array(z.union([z.string(),z.null()]))).min(1).max(1001).parse(value);const headers=z.array(z.string().min(1).max(100)).max(100).parse(data[0]);if(new Set(headers).size!==headers.length)throw new Error('Census response contains duplicate field names.');for(const field of ['NAME','ESTAB','EMP','PAYANN'])if(!headers.includes(field))throw new Error(`Census response lacks ${field}; nothing was committed.`);
  const records=data.slice(1,limit+1).map(values=>{if(values.length!==headers.length)throw new Error('Census response row does not match its headers.');const fields=Object.fromEntries(headers.map((k,i)=>[k!,values[i]]));return {id:`cbp:${fields.state}:${fields.NAICS2022||''}`,title:str(fields.NAME),organization:'',date:'',dateLabel:'Annual reference period from dataset request URL',geography:str(fields.NAME),reference:requestUrl,fields:flatFields(fields)};});
  return {records,truncated:data.length-1>limit,warning:'Annual aggregate market baseline only. EMP is employees; ESTAB is establishments; PAYANN is annual payroll in thousands of dollars. Suppressed/special values remain source strings. No company signal or outreach is created.'};
 }
 throw new Error('Unsupported source adapter');
}
