import {z} from 'zod';
import type {RetrievedRecord,SourceRun,SourceSettings} from './types';
import {sourceSettingsSchema,type PublicRequest} from './connectors';

const ENDPOINT='https://data.transportation.gov/resource/az4n-8mr2.json';
/** Public business/operating fields only; never request officers, emails, phone or street addresses. */
const FIELDS=['dot_number','legal_name','dba_name','status_code','power_units','mcs150_date','add_date','phy_state','phy_city'] as const;
const valueSchema=z.union([z.string().max(2000),z.number().finite(),z.null()]);
const rowSchema=z.record(z.unknown());
const str=(value:unknown)=>typeof value==='string'?value:typeof value==='number'?String(value):'';
function dotNumber(value:unknown):string|null{
 const text=str(value).trim();if(!/^\d{1,15}$/.test(text))return null;
 const n=Number(text);return Number.isSafeInteger(n)&&n>0?String(n):null;
}
function positiveCount(value:unknown):number|null{
 if(typeof value!=='number'&&typeof value!=='string')return null;
 const text=String(value).trim();if(!/^\d{1,15}$/.test(text))return null;
 const n=Number(text);return Number.isSafeInteger(n)&&n>0?n:null;
}
export function buildFmcsaRequest(settings:SourceSettings):PublicRequest{
 const s=sourceSettingsSchema.parse(settings);const keyword=s.keyword.trim();
 if(keyword&&!/^\d{1,15}$/.test(keyword))throw new Error('FMCSA keyword must be a numeric USDOT number, or leave it blank for a bounded state baseline.');
 const number=keyword?dotNumber(keyword):null;if(keyword&&!number)throw new Error('USDOT number must be a positive safe integer.');
 const where=[`phy_state='${s.state}'`,...(number?[`dot_number=${number}`]:[])];
 const url=new URL(ENDPOINT);url.search=new URLSearchParams({'$select':FIELDS.join(','),'$where':where.join(' AND '),'$order':'dot_number ASC','$limit':String(s.limit)}).toString();
 return {url:url.href,method:'GET'};
}
export function parseFmcsaResponse(value:unknown,_requestUrl:string,limit:number):{records:RetrievedRecord[];truncated:boolean;warning:string}{
 z.number().int().min(1).max(50).parse(limit);
 const rows=z.array(rowSchema).max(1000).parse(value);const seen=new Set<string>();
 const records=rows.slice(0,limit).map(row=>{
  const dot=dotNumber(row.dot_number);if(!dot)throw new Error('FMCSA response lacks a valid USDOT identifier; nothing was committed.');
  if(seen.has(dot))throw new Error('FMCSA response has duplicate USDOT identifiers; identity review is required.');seen.add(dot);
  const fields:Record<string,string|number|null>={};
  for(const key of FIELDS)if(Object.prototype.hasOwnProperty.call(row,key))fields[key]=valueSchema.parse(row[key]);
  const reference=new URL(ENDPOINT);reference.search=new URLSearchParams({'$where':`dot_number=${dot}`,'$select':FIELDS.join(',')}).toString();
  return {id:`fmcsa:${dot}`,title:`USDOT ${dot}`,organization:str(row.legal_name),date:str(row.mcs150_date),dateLabel:'MCS-150 filing/update date as returned (not authority issuance)',geography:[str(row.phy_city),str(row.phy_state)].filter(Boolean).join(', '),reference:reference.href,fields};
 });
 return {records,truncated:rows.length>=limit,warning:'Official carrier census snapshot, not a new-authority or verified fleet-expansion event. MCS-150 and add dates are source-reported census dates, not authority issuance. Counts may be stale or administratively revised; missing/suppressed fields remain unknown. Fleet-change observations require two comparable chronological snapshots. No POC, score, lead or outreach is generated.'};
}
export interface FleetSnapshotChange {dotNumber:string;company:string;previousPowerUnits:number;currentPowerUnits:number;delta:number;previousAt:string;currentAt:string;warning:string}
/** Observation only. A first baseline, failed/stale/suppressed/ambiguous snapshot never proves expansion. */
export function compareFleetSnapshots(previous:SourceRun|null|undefined,current:SourceRun):FleetSnapshotChange[]{
 if(!previous||previous.status!=='succeeded'||current.status!=='succeeded')return [];
 if(String(previous.connectorId)!=='fmcsa-census'||String(current.connectorId)!=='fmcsa-census'||previous.sourceId!==current.sourceId)return [];
 if(previous.settings.state!==current.settings.state||previous.settings.keyword.trim()!==current.settings.keyword.trim())return [];
 const before=Date.parse(previous.completedAt),after=Date.parse(current.completedAt);
 if(!Number.isFinite(before)||!Number.isFinite(after)||before>=after)return [];
 const prior=new Map<string,RetrievedRecord>();const ambiguous=new Set<string>();
 for(const record of previous.records){const dot=dotNumber(record.fields.dot_number);if(!dot||record.id!==`fmcsa:${dot}`)continue;if(prior.has(dot))ambiguous.add(dot);prior.set(dot,record);}
 const currentCounts=new Map<string,number>();for(const record of current.records){const dot=dotNumber(record.fields.dot_number);if(dot)currentCounts.set(dot,(currentCounts.get(dot)||0)+1);}
 const changes:FleetSnapshotChange[]=[];
 for(const record of current.records){
  const dot=dotNumber(record.fields.dot_number);if(!dot||record.id!==`fmcsa:${dot}`||ambiguous.has(dot)||currentCounts.get(dot)!==1)continue;
  const old=prior.get(dot);if(!old)continue;
  const oldCount=positiveCount(old.fields.power_units),newCount=positiveCount(record.fields.power_units);
  if(oldCount===null||newCount===null||oldCount===newCount)continue;
  changes.push({dotNumber:dot,company:record.organization||old.organization,previousPowerUnits:oldCount,currentPowerUnits:newCount,delta:newCount-oldCount,previousAt:previous.completedAt,currentAt:current.completedAt,warning:'Observed change between two source snapshots of reported power units. This may reflect reporting age, corrections or administrative changes; it does not independently verify physical fleet expansion, new authority, economic need or outreach qualification.'});
 }
 return changes;
}
