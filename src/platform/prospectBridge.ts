import {database} from './storage';
import {publicCompanyURL} from './publicResearch';
import type {CompanyResearch} from '../domain/prospectTypes';
export const advancedMode=()=>typeof location!=='undefined'&&location.protocol==='chrome-extension:'&&!!(globalThis as any).chrome?.runtime?.id;
export async function prospectMessage<T=any>(request:Record<string,unknown>):Promise<T>{
 if(!advancedMode())throw new Error('extension_required: public website research and protected search providers require LATIMUS Advanced Mode. Portable Core supports local imports, review and export.');
 const response=await (globalThis as any).chrome.runtime.sendMessage({protocol:'latimus-prospect-1',...request});
 if(!response?.ok)throw new Error(response?.error||'The private research adapter is unavailable. Unlock it and retry.');return response.value as T;
}
export async function unlockProspectBackground(workspaceId:string,passphrase:string){if(!advancedMode())return;await prospectMessage({type:'session.unlock',workspaceId,passphrase});}
export function lockProspectBackground(workspaceId:string){if(advancedMode())void prospectMessage({type:'session.lock',workspaceId}).catch(()=>{});}
export function keepProspectBackground(workspaceId:string):()=>void{
 if(!advancedMode())return ()=>{};const port=(globalThis as any).chrome.runtime.connect({name:'latimus-unlocked-workspace'});const ping=()=>{try{port.postMessage({type:'ping',workspaceId});}catch{}};ping();const timer=setInterval(ping,20000);return()=>{clearInterval(timer);try{port.disconnect();}catch{}};
}
export async function requestCompanyOrigins(domains:string[]):Promise<void>{
 if(!advancedMode()||!domains.length)return;domains=[...new Set(domains.map(d=>new URL(publicCompanyURL('https://'+d)).hostname.replace(/^www\./,'')))];if(domains.length>100)throw new Error('Research at most100 selected company domains per permission group.');const origins=['https://dns.google/*',...new Set(domains.flatMap(d=>[`https://${d}/*`,`https://www.${d}/*`]))];
 if(origins.length>201)throw new Error('This batch contains more than 100 company domains. Research selected rows in smaller permission groups; local normalization/export still supports the full import.');
 const granted=await (globalThis as any).chrome.permissions.request({origins});if(!granted)throw new Error('Company-site access was not granted. The imported batch is unchanged.');
}
export async function stageProviderHandle(workspaceId:string,handle:unknown):Promise<string>{
 const id=crypto.randomUUID();const db=await database();try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction('file-handles','readwrite');tx.objectStore('file-handles').put({workspaceId,handle,expiresAt:Date.now()+300000},id);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});return id;}finally{db.close();}
}
export async function fetchProspectResearch(token:string,rowId:string):Promise<{research:CompanyResearch;searchRequests:number}>{return prospectMessage({type:'research.company',token,rowId});}
