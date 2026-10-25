import { z } from 'zod';
import type { EOSComponents, Sector, Signal, SignalInput, Workspace } from './types';

export const EOS_VERSION = 'eos-1.0.0';
export const MAX_EVIDENCE_AGE_DAYS = 90;
export const SECTORS = ['Business','Finance','Construction','Real Estate','Technology','Logistics','Energy'] as const;
export const SIGNAL_FAMILIES = ['Capital Projects','Procurement & Awards','Capital & Transactions','Workforce & Leadership','Property & Real Estate','Transportation & Logistics','Energy & Infrastructure','Distress, Compliance & Risk'] as const;
export const TRIGGERS = ['New construction permit','Major property acquisition','Government contract award','Large RFP/competitive award won','Acquisition announced','New funding/capital raise','New facility or expansion','20+ new jobs / rapid hiring','CFO/COO/key executive hired','CFO/COO/key executive departure','Revenue decline','Rapid revenue growth','Lawsuit/compliance/enforcement issue','Material negative review/service pattern','Supply-chain disruption','Fleet expansion','New DOT/operating authority','Data-center / energy / large-load project','Commercial-property vacancy or operating distress','Refinance / debt maturity / recapitalization','Owner succession / probable exit'] as const;
const text = z.string().trim().min(1).max(300);
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD dates').refine(value=>!Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10)===value,'Invalid calendar date');
const httpsReference = z.string().trim().max(2048).url().refine(value=>{const u=new URL(value);return u.protocol==='https:' && !u.username && !u.password},'Evidence references must use HTTPS without embedded credentials');
export const eosSchema = z.object({trigger:z.number().int().min(0).max(30),need:z.number().int().min(0).max(25),capacity:z.number().int().min(0).max(20),fit:z.number().int().min(0).max(15),access:z.number().int().min(0).max(10)}).strict();
export const signalInputSchema = z.object({companyName:text,domain:z.string().trim().max(253),title:text,family:z.enum(SIGNAL_FAMILIES),trigger:text,eventId:z.string().trim().max(300),eventDate:day,publishedAt:day,geography:text,sectors:z.array(z.enum(SECTORS)).min(1).max(7),sourceId:z.string().trim().min(1).max(100),reference:httpsReference,excerpt:z.string().trim().min(5).max(20000),need:text,components:eosSchema,permitLeadScore:z.number().int().min(0).max(100).optional()}).strict();

export function normalizeCompanyName(name:string):string {
  const normalized = name.normalize('NFKC').toLocaleLowerCase('en-US').replace(/&/g,' and ').replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim();
  return normalized.replace(/\s+(?:incorporated|corporation|limited|company|inc|corp|llc|ltd|co)$/,'').trim() || normalized;
}
export function normalizeDomain(value:string):string {
  if(!value.trim()) return '';
  let u:URL;try {u=new URL(value.includes('://')?value.trim():`https://${value.trim()}`)} catch {throw new Error('Invalid company domain')}
  if(u.protocol!=='https:' || u.username || u.password || u.port || !u.hostname.includes('.') || /[\s]/.test(u.hostname)) throw new Error('Company domain must be a valid HTTPS hostname');
  return u.hostname.replace(/^www\./,'').toLowerCase();
}
export function fingerprintSignal(company:string,trigger:string,eventId:string,eventDate:string):string {
  return JSON.stringify([normalizeCompanyName(company),trigger.trim().toLocaleLowerCase('en-US'),eventId.trim().toLocaleLowerCase('en-US'),eventDate]);
}
export function scoreEOS(components:EOSComponents):number {const c=eosSchema.parse(components);return c.trigger+c.need+c.capacity+c.fit+c.access}
export function actionBand(score:number):string {
  if(!Number.isInteger(score)||score<0||score>100)throw new Error('EOS must be an integer from 0 to 100');
  return score>=90?'A1 · Immediate Executive Pursuit':score>=75?'A2 · High-Priority Personalized Campaign':score>=65?'B1 · Qualified Outreach':score>=50?'B2 · Monitor / Nurture':'C · Intelligence Database Only';
}
export function qualificationGate(w:Workspace,s:Signal,now=Date.now()):{eligible:boolean;reasons:string[]} {
  const reasons:string[]=[];
  if(scoreEOS(s.components)!==s.score||s.scoreVersion!==EOS_VERSION)reasons.push('Score formula or version is inconsistent; re-review required.');
  if(s.score<65)reasons.push('EOS below 65: monitor or nurture before POC research.');
  const evidence=s.evidenceIds.map(id=>w.evidence.find(e=>e.id===id)).filter(e=>e!==undefined);
  if(evidence.length!==s.evidenceIds.length||!evidence.length)reasons.push('Signal has missing evidence.');
  if(evidence.some(e=>e.review==='contradicted'))reasons.push('Contradicted evidence requires human review.');
  const eventTime=Date.parse(s.eventDate);
  if(!Number.isFinite(eventTime)||eventTime>now+86400000||now-eventTime>MAX_EVIDENCE_AGE_DAYS*86400000)reasons.push('Event is stale or future-dated; revalidate before pursuit (90-day policy).');
  const fresh=evidence.filter(e=>w.sources.some(source=>source.id===e.sourceId&&source.tier===e.tier&&source.health!=='failed') && e.review==='verified' && Number.isFinite(Date.parse(e.publishedAt)) && Date.parse(e.publishedAt)<=now+86400000 && now-Date.parse(e.publishedAt)<=MAX_EVIDENCE_AGE_DAYS*86400000 && Number.isFinite(Date.parse(e.importedAt)) && Date.parse(e.importedAt)<=now+86400000 && now-Date.parse(e.importedAt)<=MAX_EVIDENCE_AGE_DAYS*86400000);
  if(!fresh.some(e=>e.tier==='A'||e.tier==='B') && new Set(fresh.filter(e=>e.tier==='C').map(e=>{try{return new URL(w.sources.find(source=>source.id===e.sourceId)!.url).hostname.replace(/^www\./,'').toLowerCase()}catch{return ''}}).filter(Boolean)).size<2)reasons.push('Require current human-verified Tier A/B evidence or two reviewed Tier C sources on different domains. Tier D is discovery only.');
  return {eligible:reasons.length===0,reasons};
}
export function ownerRole(sectors:Sector[],trigger=''):string {
  const t=trigger.toLowerCase();
  if(t.includes('award'))return 'COO / Program Executive — owns award mobilization and delivery';
  if(t.includes('succession'))return 'Owner / CEO — owns succession and transaction readiness';
  if(t.includes('refinanc')||t.includes('funding')||t.includes('capital raise'))return 'CFO / Principal — owns capital deployment and financing';
  if(t.includes('acquisition'))return 'CFO / Corporate Development — owns diligence and integration';
  if(t.includes('departure'))return 'CEO / Owner — owns leadership continuity';
  if(sectors.includes('Construction')||sectors.includes('Energy'))return 'VP Development / Project Executive — owns project mobilization and delivery';
  if(sectors.includes('Logistics'))return 'COO / Fleet Operations — owns service, capacity and operating performance';
  if(sectors.includes('Real Estate'))return 'Asset Manager / Principal — owns property performance and capital decisions';
  if(sectors.includes('Technology'))return 'COO / Technology Leader — owns systems delivery and adoption';
  if(sectors.includes('Finance'))return 'CFO / Controller — owns financial performance and liquidity';
  return 'COO / Business Leader — owns operating outcomes';
}
async function digest(text:string):Promise<string>{return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text))),v=>v.toString(16).padStart(2,'0')).join('')}
export async function ingestSignal(workspace:Workspace,input:SignalInput,now=new Date().toISOString()):Promise<Workspace>{
  const p=signalInputSchema.parse(input);const source=workspace.sources.find(s=>s.id===p.sourceId);if(!source)throw new Error('Source does not exist in this workspace');
  if(!Number.isFinite(Date.parse(now)))throw new Error('Invalid ingestion timestamp');
  if(Date.parse(p.eventDate)>Date.parse(now)+86400000||Date.parse(p.publishedAt)>Date.parse(now)+86400000)throw new Error('Future event or publication date requires correction');
  const w=structuredClone(workspace);const normalized=normalizeCompanyName(p.companyName);const domain=normalizeDomain(p.domain);
  const candidates=w.companies.filter(c=>c.normalizedName===normalized||c.aliases.some(a=>normalizeCompanyName(a)===normalized));
  if(candidates.length>1)throw new Error('Ambiguous company identity; resolve aliases before importing');
  let company=candidates[0];
  if(company&&company.domain&&domain&&company.domain!==domain)throw new Error('Company name matches but domains conflict; human identity review required');
  if(!company){company={id:crypto.randomUUID(),name:p.companyName,normalizedName:normalized,domain,geography:p.geography,sectors:[...new Set(p.sectors)],aliases:[],origins:['intelligence_signal']};w.companies.push(company)}
  else {if(company.geography.toLowerCase()!==p.geography.toLowerCase()&&!domain)throw new Error('Same company name in another geography requires a domain for identity review');company.sectors=[...new Set([...company.sectors,...p.sectors])];if(!company.domain&&domain)company.domain=domain}
  company.origins=[...new Set([...(company.origins||[]),'intelligence_signal'] as const)];
  const hash=await digest(JSON.stringify({sourceId:p.sourceId,reference:p.reference,excerpt:p.excerpt,eventDate:p.eventDate,publishedAt:p.publishedAt}));
  let evidence=w.evidence.find(e=>e.hash===hash);
  if(!evidence){evidence={id:crypto.randomUUID(),sourceId:p.sourceId,reference:p.reference,excerpt:p.excerpt,tier:source.tier,eventDate:p.eventDate,publishedAt:p.publishedAt,discoveredAt:now,importedAt:now,observed:true,hash,review:'unreviewed'};w.evidence.push(evidence)}
  const fingerprint=fingerprintSignal(company.normalizedName,p.trigger,p.eventId,p.eventDate);
  let signal=w.signals.find(s=>s.fingerprint===fingerprint&&s.companyId===company.id);
  if(signal){signal.evidenceIds=[...new Set([...signal.evidenceIds,evidence.id])];signal.sectors=[...new Set([...signal.sectors,...p.sectors])]}
  else {signal={id:crypto.randomUUID(),companyId:company.id,title:p.title,family:p.family,trigger:p.trigger,eventId:p.eventId,eventDate:p.eventDate,geography:p.geography,sectors:[...new Set(p.sectors)],evidenceIds:[evidence.id],fingerprint,need:p.need,components:p.components,score:scoreEOS(p.components),scoreVersion:EOS_VERSION,createdAt:now,permitLeadScore:p.permitLeadScore};w.signals.push(signal)}
  if(p.permitLeadScore!==undefined){if(signal.permitLeadScore!==undefined&&signal.permitLeadScore!==p.permitLeadScore)throw new Error('Conflicting Permit Lead Scores require review; preserve the existing placement score.');signal.permitLeadScore=p.permitLeadScore;}
  const importedSource=w.sources.find(s=>s.id===p.sourceId)!;importedSource.health='imported';importedSource.lastImport=now;
  return w;
}
export function parseSignalImport(text:string):SignalInput[]{
  if(text.length>5_000_000)throw new Error('Import exceeds 5 MB text limit');
  const parsed=JSON.parse(text) as unknown;return z.array(signalInputSchema).min(1).max(1000).parse(parsed);
}
