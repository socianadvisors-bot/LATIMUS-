import {normalizeDomain,normalizeEmail,normalizePerson,isGenericEmail,scoreObservedEmail} from './prospecting';
import type {ProspectResult,ProspectRow,CompanyResearch} from './prospectTypes';
/** Imported/checkpointed status labels cannot manufacture verified contact authority. */
export function assertProspectResultConsistency(row:Pick<ProspectRow,'normalized'>,result:ProspectResult):void{
 if(!['verified_work_email','candidate_work_email'].includes(result.status)){if(result.workEmail)throw new Error('Only evidence-supported verified/candidate results may carry a primary individual work email.');return;}
 if(row.normalized.domain&&normalizeDomain(result.domain)!==row.normalized.domain)throw new Error('Contact result company domain differs from the supplied prospect company. Review company identity first.');
 if(!normalizeDomain(result.domain)||normalizeDomain(result.website)!==normalizeDomain(result.domain))throw new Error('Contact result website and company domain do not reconcile.');
 if(normalizePerson(result.person)!==row.normalized.normalizedPerson)throw new Error('Contact result person differs from the imported contact identity.');
 const email=normalizeEmail(result.workEmail);if(!email||isGenericEmail(email))throw new Error('A named contact result requires an observed individual email.');
 const research:CompanyResearch={domain:result.domain,website:result.website,companyName:row.normalized.company,companyConfidence:result.companyConfidence,resolutionMethod:result.companyResolution,emails:[],phones:[],profiles:[],pages:result.evidence,errors:[],checkedAt:result.lastChecked};
 const support=result.emailMatches.find(m=>normalizeEmail(m.email)===email&&m.source.email.toLowerCase()===email&&m.source.sourceUrl===result.emailSource);
 let safeSource=false;try{const u=new URL(result.emailSource);safeSource=u.protocol==='https:'&&!u.username&&!u.password;}catch{}
 if(!safeSource||!support||!result.evidence.some(e=>e.url===support.source.sourceUrl)||!/^https:\/\//.test(result.emailSource))throw new Error('Contact status lacks its linked observed source evidence.');
 const score=scoreObservedEmail(row.normalized,research,support.source);if(score.score!==result.emailConfidence||score.score!==support.score)throw new Error('Contact confidence does not reconcile with its evidence.');
 if(result.status==='verified_work_email'&&(score.quality!=='verified'||score.score<80||result.emailQuality!=='verified'||result.companyConfidence<80))throw new Error('Verified contact status cannot be asserted without strong observed identity evidence.');
 if(result.status==='candidate_work_email'&&(!['verified','candidate'].includes(score.quality)||score.score<55))throw new Error('Candidate contact status lacks sufficient observed evidence.');
 if(normalizeDomain(result.emailSource)!==normalizeDomain(result.website)&&result.status==='verified_work_email')throw new Error('Verified contact source must belong to the resolved company domain.');
}
