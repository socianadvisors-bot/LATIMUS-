import {emptyWorkspace} from './workspace';
import {ingestSignal} from './intelligence';
import {validateWorkspace} from './validation';
import type {SignalInput,Workspace} from './types';
/** Fictional fixtures, never represented as real companies, fresh feeds, or sent messages. */
export async function sampleWorkspace():Promise<Workspace>{
  let w=emptyWorkspace('THE CONSULT · Demonstration',true);const now=new Date().toISOString();
  const day=(back:number)=>new Date(Date.now()-back*86400000).toISOString().slice(0,10);
  w.sources=[
    {id:'demo-permits',name:'Sample Public Project Register',family:'Capital Projects',url:'https://example.com/sample-permits',tier:'A',geography:'Texas',mode:'import',health:'not checked',cadence:'Manual import',limitations:'Fictional fixture. Not connected to a government registry.'},
    {id:'demo-company',name:'Sample Company Announcements',family:'Capital & Transactions',url:'https://example.org/announcements',tier:'B',geography:'United States',mode:'manual',health:'not checked',cadence:'Manual review',limitations:'Illustrative first-party records, not live announcements.'},
    {id:'demo-discovery',name:'Sample Discovery Feed',family:'Workforce & Leadership',url:'https://example.net/discovery',tier:'D',geography:'United States',mode:'import',health:'not checked',cadence:'Manual import',limitations:'Discovery-only fixture. Cannot independently qualify outreach.'}
  ];
  const inputs:SignalInput[]=[
    {companyName:'Cedarline Logistics',domain:'cedarline.example.com',title:'Regional distribution center expansion',family:'Capital Projects',trigger:'New facility or expansion',eventId:'SAMPLE-001',eventDate:day(3),publishedAt:day(2),geography:'Dallas–Fort Worth, TX',sectors:['Logistics','Construction','Finance'],sourceId:'demo-permits',reference:'https://example.com/sample-permits/001',excerpt:'FICTIONAL SAMPLE: Cedarline plans a new regional distribution center. No factual company or project claim is being made.',need:'Coordinate facility delivery, capital phasing and distribution network readiness.',components:{trigger:27,need:23,capacity:19,fit:14,access:8}},
    {companyName:'Northbank Energy',domain:'northbank.example.org',title:'Storage portfolio enters development',family:'Energy & Infrastructure',trigger:'Data-center / energy / large-load project',eventId:'SAMPLE-002',eventDate:day(5),publishedAt:day(4),geography:'Austin, TX',sectors:['Energy','Real Estate','Finance'],sourceId:'demo-company',reference:'https://example.org/announcements/002',excerpt:'FICTIONAL SAMPLE: Northbank is evaluating a storage portfolio and delivery partners.',need:'Align development dependencies, financing scenarios and owner decision gates.',components:{trigger:24,need:22,capacity:18,fit:14,access:8}},
    {companyName:'Meridian Works',domain:'meridian.example.com',title:'Manufacturing award creates delivery demand',family:'Procurement & Awards',trigger:'Government contract award',eventId:'SAMPLE-003',eventDate:day(7),publishedAt:day(6),geography:'Houston, TX',sectors:['Business','Technology','Logistics'],sourceId:'demo-permits',reference:'https://example.com/sample-permits/003',excerpt:'FICTIONAL SAMPLE: Meridian is a private awardee preparing program mobilization. The agency is not the assumed client.',need:'Mobilize operating capacity and establish program controls for the private awardee.',components:{trigger:25,need:21,capacity:17,fit:13,access:7}},
    {companyName:'Ashford Properties',domain:'ashford.example.org',title:'Portfolio refinancing under evaluation',family:'Capital & Transactions',trigger:'Refinance / debt maturity / recapitalization',eventId:'SAMPLE-004',eventDate:day(9),publishedAt:day(8),geography:'San Antonio, TX',sectors:['Real Estate','Finance'],sourceId:'demo-company',reference:'https://example.org/announcements/004',excerpt:'FICTIONAL SAMPLE: Ashford is reviewing property-level performance ahead of refinancing.',need:'Establish property cash flow baseline and downside sensitivities.',components:{trigger:21,need:20,capacity:16,fit:12,access:6}},
    {companyName:'Juniper Systems',domain:'juniper.example.net',title:'Unconfirmed leadership change',family:'Workforce & Leadership',trigger:'CFO/COO/key executive departure',eventId:'SAMPLE-005',eventDate:day(2),publishedAt:day(1),geography:'Denver, CO',sectors:['Technology','Business'],sourceId:'demo-discovery',reference:'https://example.net/discovery/005',excerpt:'FICTIONAL DISCOVERY SAMPLE: A leadership change is rumored. Primary corroboration is required.',need:'Monitor for a verifiable operating transition; do not pursue from this source alone.',components:{trigger:18,need:16,capacity:12,fit:12,access:6}}
  ];
  for(const i of inputs)w=await ingestSignal(w,i,now);
  w.evidence.forEach(e=>{if(e.tier!=='D')e.review='verified'});
  w.opportunities=w.signals.slice(0,4).map((s,i)=>({id:`demo-opp-${i}`,companyId:s.companyId,signalId:s.id,title:s.title,need:s.need,offer:'Enterprise Value & Execution Blueprint',ownerRole:i===0?'COO / VP Operations':'CFO / Development Executive',stage:i===0?'Won':i===1?'Discovery':'Qualified',createdAt:now,outcomeNote:i===0?'Fictional sample: owner-confirmed engagement. No actual contract.':undefined}));
  w.contacts=[{id:'demo-contact',companyId:w.companies[0].id,name:'Alex Morgan (Sample)',role:'VP Operations',email:'alex@example.com',status:'user-provided',reference:'',suppressed:false}];
  w.engagements=[{id:'demo-engagement',opportunityId:w.opportunities[0].id,companyId:w.companies[0].id,name:'Cedarline · Distribution Readiness',owner:'Managing Principal',status:'Active',budgetCents:8500000,baseline:'Illustrative baseline: delivery plan and cash phasing not yet reconciled.',acceptance:'Approved mobilization roadmap, baseline and owner handover.',createdAt:now}];
  w.tasks=[
    {id:'demo-task-1',engagementId:'demo-engagement',title:'Confirm capital and delivery baseline',owner:'Finance lead',due:day(-2),status:'In progress',kind:'Milestone',benefitCents:0},
    {id:'demo-task-2',engagementId:'demo-engagement',title:'Validate site readiness dependencies',owner:'Project lead',due:day(-5),status:'To do',kind:'Task',benefitCents:0},
    {id:'demo-task-3',engagementId:'demo-engagement',title:'Owner decision: phased mobilization',owner:'Managing Principal',due:day(-1),status:'To do',kind:'Decision',benefitCents:0},
    {id:'demo-task-4',engagementId:'demo-engagement',title:'Long-lead equipment delivery uncertainty',owner:'Project lead',due:day(1),status:'In progress',kind:'Risk',benefitCents:0}
  ];
  w.audit=[{id:crypto.randomUUID(),at:now,action:'workspace.sample',entityId:w.id,detail:'Explicit demonstration fixture loaded. All companies, projects and outcomes are fictional.'}];
  return validateWorkspace(w);
}
