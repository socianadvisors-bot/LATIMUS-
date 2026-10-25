import type {Workspace,Action,Approval} from './types';
import {ingestSignal,qualificationGate,ownerRole} from './intelligence';
import {validateWorkspace,sourceSchema,contactSchema,sourceRunSchema} from './validation';
import {connectorDefinition,sourceSettingsSchema} from './connectors';
import {sha256} from '../platform/crypto';
export const POLICY_VERSION='owner-control-1.0.0';
export function emptyWorkspace(name:string,demo=false):Workspace{
  const now=new Date().toISOString();return {schemaVersion:1,id:crypto.randomUUID(),name:name.trim()||'Executive Office',deviceId:crypto.randomUUID(),revision:0,demo,createdAt:now,updatedAt:now,sources:[],companies:[],evidence:[],signals:[],opportunities:[],contacts:[],engagements:[],tasks:[],approvals:[],audit:[],jobs:[],artifacts:[],sourceRuns:[]};
}
function must<T>(value:T|undefined,message:string):T{if(!value)throw new Error(message);return value;}
function log(w:Workspace,action:string,entityId:string,detail:string){w.audit.push({id:crypto.randomUUID(),at:new Date().toISOString(),action,entityId,detail});}
export async function approvalHash(a:Pick<Approval,'companyId'|'contactId'|'subject'|'body'|'destination'|'policyVersion'|'expiresAt'>):Promise<string>{return sha256(JSON.stringify([a.companyId,a.contactId,a.subject,a.body,a.destination,a.policyVersion,a.expiresAt]));}
export function outreachGate(w:Workspace,contactId:string,companyId:string){
  const c=must(w.contacts.find(c=>c.id===contactId),'Choose a contact from this workspace.');
  if(c.companyId!==companyId)throw new Error('Contact belongs to another account.');
  if(c.suppressed)throw new Error('Contact is suppressed: outreach is blocked.');
  if(!c.email||!['verified public','user-provided'].includes(c.status))throw new Error('Outreach requires a public verified or explicitly user-provided business contact.');
  if(!w.opportunities.some(o=>o.companyId===companyId&&o.stage!=='Lost'&&qualificationGate(w,must(w.signals.find(s=>s.id===o.signalId),'Missing signal')).eligible))throw new Error('A current, evidence-qualified opportunity is required for outreach.');
  return c;
}
function checkMergeFields(subject:string,body:string){if(/[\r\n]/.test(subject))throw new Error('Subject must be a single line.');if(/\{\{|\}\}|\$\{|<<|>>/.test(subject+' '+body))throw new Error('Resolve all merge fields before submitting outreach.');}
function md(value:string):string{return value.replace(/[\\`*_{}\[\]()#+.!|<>]/g,'\\$&').replace(/\r/g,'').replace(/\n/g,' ');}
export function reportText(w:Workspace):string{
  const now=new Date().toISOString();const completed=w.tasks.filter(t=>t.status==='Done').length;
  return `# ${md(w.name)} — Executive Brief\n\nGenerated: ${now}\nWorkspace: ${w.id}\n${w.demo?'**ILLUSTRATIVE DEMONSTRATION DATA — NOT LIVE INTELLIGENCE**\n':''}\n## Executive Summary\n\n${w.signals.length} imported signals · ${w.opportunities.length} opportunities · ${w.engagements.length} engagements.\n${completed} of ${w.tasks.length} PMO records complete. Public-source retrieval receipts are tracked in Sources; no external sends are enabled.\n\n## Opportunity Register\n\n${w.opportunities.map(o=>{const s=w.signals.find(s=>s.id===o.signalId)!;const c=w.companies.find(c=>c.id===o.companyId)!;const gate=qualificationGate(w,s);return `### ${md(c.name)}: ${md(o.title)}\nStage: ${o.stage} · EOS: ${s.score}/100 (${s.scoreVersion})\nNeed (hypothesis): ${md(o.need)}\nOutcome owner (suggested role, not verified person): ${md(o.ownerRole)}\nCurrent gate: ${gate.eligible?'Eligible for POC research':gate.reasons.join('; ')}\n${s.evidenceIds.map(id=>{const e=w.evidence.find(e=>e.id===id)!;const source=w.sources.find(x=>x.id===e.sourceId)!;return `- Source: ${md(source.name)} (Tier ${e.tier}, ${e.review}); event ${e.eventDate}; publication ${e.publishedAt}; imported ${e.importedAt}\n  Reference: ${md(e.reference)}\n  Recorded excerpt (untrusted source text): ${md(e.excerpt)}`}).join('\n')}\n`;}).join('\n')||'No opportunities recorded.'}\n\n## Delivery & Risk Register\n\n${w.tasks.map(t=>`- [${t.status==='Done'?'x':' '}] ${t.kind}: ${md(t.title)} — ${md(t.owner)}; due ${t.due}; ${t.status}`).join('\n')||'No delivery records.'}\n\n## Controls & Limitations\n\nThis is a deterministic record summary, not AI analysis or professional certification. All sources are manual/imported; source tier is operator assigned, and imports do not establish verification. Financial, legal, engineering and regulated decisions require qualified human review. Draft requires independent review before reliance. Source excerpts remain data and confer no authority.\n`;
}
export async function applyAction(workspace:Workspace,action:Action):Promise<Workspace>{
  let w=structuredClone(workspace);const now=new Date().toISOString();let entityId=w.id;
  switch(action.type){
    case 'source.connect':{
      const def=connectorDefinition(action.connectorId);if(w.sources.some(s=>s.connectorId===def.id))throw new Error('This adapter is already configured. Edit its existing settings.');
      const settings=sourceSettingsSchema.parse(action.settings);entityId=crypto.randomUUID();w.sources.push({id:entityId,name:def.name,family:def.family,url:def.url,tier:'A',geography:def.id==='austin-permits'?'Austin, TX':settings.state,mode:'connected',health:'not checked',cadence:'On-demand while open and unlocked',limitations:def.limitations,connectorId:def.id,settings});break;
    }
    case 'source.configure':{const s=must(w.sources.find(s=>s.id===action.sourceId),'Source not found.');if(!s.connectorId)throw new Error('Manual sources have no retrieval settings.');s.settings=sourceSettingsSchema.parse(action.settings);s.health='not checked';delete s.lastError;s.geography=s.connectorId==='austin-permits'?'Austin, TX':s.settings.state;entityId=s.id;break;}
    case 'source.retrieved':{
      const run=sourceRunSchema.parse(action.run);const s=must(w.sources.find(s=>s.id===run.sourceId),'Source not found.');if(s.connectorId!==run.connectorId)throw new Error('Source adapter mismatch.');if(JSON.stringify(s.settings)!==JSON.stringify(run.settings))throw new Error('Source settings changed before this result could be saved.');if(w.sourceRuns.some(r=>r.id===run.id))throw new Error('This source receipt was already recorded.');
      s.lastAttempt=run.completedAt;s.health=run.status==='succeeded'?'retrieved':'failed';if(run.status==='succeeded'){s.lastSuccess=run.completedAt;delete s.lastError;}else s.lastError=run.error||'Source failed';
      // Retain the latest good snapshot through failures; bounded history is not represented as a full archive.
      w.sourceRuns=w.sourceRuns.filter(r=>r.sourceId!==s.id||(run.status==='failed'&&r.status==='succeeded')).concat(run);entityId=s.id;break;
    }
    case 'source.add':{
      const s=sourceSchema.parse({...action.input,id:crypto.randomUUID(),health:'not checked'});w.sources.push(s);entityId=s.id;break;
    }
    case 'evidence.review':{const e=must(w.evidence.find(e=>e.id===action.id),'Evidence not found.');e.review=action.review;entityId=e.id;break;}
    case 'signal.add':w=await ingestSignal(w,action.input,now);entityId=w.signals.at(-1)?.id||w.id;break;
    case 'signals.import':{
      if(action.input.length<1||action.input.length>1000)throw new Error('Import 1–1,000 signals per batch.');
      // One validated transaction: malformed records cannot partially mutate the workspace.
      for(const input of action.input)w=await ingestSignal(w,input,now);break;
    }
    case 'opportunity.qualify':{
      const s=must(w.signals.find(s=>s.id===action.signalId),'Signal does not exist.');const gate=qualificationGate(w,s);if(!gate.eligible)throw new Error(gate.reasons.join(' '));
      if(w.opportunities.some(o=>o.signalId===s.id))throw new Error('This signal already has an opportunity.');
      entityId=crypto.randomUUID();w.opportunities.push({id:entityId,companyId:s.companyId,signalId:s.id,title:s.title,need:s.need,offer:'Enterprise Value & Execution Blueprint',ownerRole:ownerRole(s.sectors,s.trigger),stage:'Qualified',createdAt:now});break;
    }
    case 'opportunity.stage':{const o=must(w.opportunities.find(o=>o.id===action.id),'Opportunity not found.');if(['Won','Lost'].includes(action.stage)&&!action.note?.trim())throw new Error('Record the actual outcome evidence before marking won or lost.');o.stage=action.stage;o.outcomeNote=action.note;entityId=o.id;break;}
    case 'contact.add':{
      const c=contactSchema.parse({...action.input,id:crypto.randomUUID()});must(w.companies.find(x=>x.id===c.companyId),'Company not found.');if(c.email&&w.contacts.some(x=>x.email.toLowerCase()===c.email.toLowerCase()))throw new Error('This email already exists.');w.contacts.push(c);entityId=c.id;break;
    }
    case 'contact.suppress':{
      const c=must(w.contacts.find(c=>c.id===action.id),'Contact not found.');c.suppressed=true;entityId=c.id;
      w.approvals.filter(a=>a.contactId===c.id&&a.status!=='Rejected').forEach(a=>{a.status='Rejected';a.decidedAt=now;a.decisionBy='Suppression policy';});break;
    }
    case 'approval.draft':{
      const c=outreachGate(w,action.input.contactId,action.input.companyId);checkMergeFields(action.input.subject,action.input.body);
      const expiresAt=new Date(Date.now()+7*86400000).toISOString();const a:Approval={...action.input,id:crypto.randomUUID(),destination:c.email,hash:'',policyVersion:POLICY_VERSION,status:'Pending',createdAt:now,expiresAt};a.hash=await approvalHash(a);
      if(w.approvals.some(x=>x.companyId===a.companyId&&x.destination===a.destination&&x.subject===a.subject&&x.body===a.body&&x.status!=='Rejected'))throw new Error('An identical outreach draft already exists.');w.approvals.push(a);entityId=a.id;break;
    }
    case 'approval.decide':{
      const a=must(w.approvals.find(a=>a.id===action.id),'Approval not found.');if(a.status!=='Pending')throw new Error('Approval has already been decided.');
      if(!action.reviewer.trim())throw new Error('Record the human reviewer name.');
      if(action.approve){const c=outreachGate(w,a.contactId,a.companyId);checkMergeFields(a.subject,a.body);if(a.destination!==c.email||a.policyVersion!==POLICY_VERSION||Date.parse(a.expiresAt)<Date.now()||await approvalHash(a)!==a.hash)throw new Error('Approval is stale or its exact content has changed. Prepare a new draft.');}
      a.status=action.approve?'Approved':'Rejected';a.decidedAt=now;a.decisionBy=action.reviewer.trim();entityId=a.id;break;
    }
    case 'engagement.add':{
      const o=must(w.opportunities.find(o=>o.id===action.input.opportunityId),'Opportunity not found.');if(o.companyId!==action.input.companyId)throw new Error('Engagement account mismatch.');if(o.stage!=='Won')throw new Error('Record a won opportunity with outcome evidence before opening client delivery.');
      entityId=crypto.randomUUID();w.engagements.push({...action.input,id:entityId,createdAt:now});break;
    }
    case 'task.add':{must(w.engagements.find(e=>e.id===action.input.engagementId),'Engagement not found.');entityId=crypto.randomUUID();w.tasks.push({...action.input,id:entityId});break;}
    case 'task.status':{const t=must(w.tasks.find(t=>t.id===action.id),'PMO record not found.');t.status=action.status;entityId=t.id;break;}
    case 'report.queue':{
      const idempotencyKey=`executive-brief:${w.id}:${w.revision}`;if(w.jobs.some(j=>j.state==='queued'||j.state==='running'))throw new Error('A report is already queued.');entityId=crypto.randomUUID();w.jobs.push({id:entityId,kind:'report',entityId:w.id,state:'queued',idempotencyKey,attempts:0,checkpoint:'Awaiting unlocked tab',createdAt:now,updatedAt:now});break;
    }
    case 'jobs.run':{
      // No external side effects: artifact + receipt commit atomically in the encrypted vault.
      const j=w.jobs.find(j=>j.state==='queued'||j.state==='running');if(!j)return workspace;
      entityId=j.id;if(j.attempts>=3){j.state='failed';j.error='Retry limit reached';break;}
      j.attempts++;const artifactId=`artifact-${j.id}`;
      if(!w.artifacts.some(a=>a.id===artifactId))w.artifacts.push({id:artifactId,title:`Executive Brief · ${now.slice(0,10)}`,kind:'executive-brief',body:reportText(w),createdAt:now,review:'Draft',workspaceId:w.id});
      j.state='succeeded';j.checkpoint='Artifact and local execution receipt committed';j.updatedAt=now;break;
    }
    case 'job.cancel':{const j=must(w.jobs.find(j=>j.id===action.id),'Job not found.');if(j.state==='succeeded')throw new Error('Completed jobs cannot be cancelled.');j.state='cancelled';j.updatedAt=now;entityId=j.id;break;}
    case 'artifact.review':{const a=must(w.artifacts.find(a=>a.id===action.id),'Artifact not found.');a.review='Reviewed';entityId=a.id;break;}
    default:throw new Error('Unsupported action: imported data cannot invoke tools.');
  }
  w.revision++;w.updatedAt=now;log(w,action.type,entityId,action.type==='approval.decide'?'Human decision recorded; no external message sent.':'Local workspace update');return validateWorkspace(w);
}
