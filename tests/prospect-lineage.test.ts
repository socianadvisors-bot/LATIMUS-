import {describe,it,expect} from 'vitest';
import {applyAction,emptyWorkspace,outreachGate} from '../src/domain/workspace';
import {validateWorkspace} from '../src/domain/validation';
import {proposeMapping,selectResult} from '../src/domain/prospecting';
import type {Workspace} from '../src/domain/types';
import type {ProspectSettings} from '../src/domain/prospectTypes';
const settings:ProspectSettings={concurrency:1,maxPages:1,requestDelayMs:250,timeoutMs:3000,cacheMode:'refresh_stale',cacheDays:30};

async function imported(){const headers=['Company','Owner','Website','Email'];return applyAction(emptyWorkspace('Lineage review'),{type:'prospects.import',input:{fileName:'lineage-fictional.csv',fileHash:'7'.repeat(64),headers,rows:[['Example Industrial LLC','Robert Johnson','https://example.com','robert.johnson@example.com'],['Other Fictional LLC','Jane Smith','https://other.example.org','jane.smith@other.example.org']],mapping:proposeMapping(headers).mapping}})}
async function promoted(){let w=await imported();const ids=w.prospectRows.map(r=>r.id);w=await applyAction(w,{type:'prospects.review',rowIds:ids,review:'accepted'});return applyAction(w,{type:'prospects.promote',rowIds:ids})}

describe('independent shared-contact CSV lineage validation',()=>{
 it('restores promoted contacts with bidirectional row/company provenance and keeps CSV qualification separate from EOS',async()=>{
  const restored=validateWorkspace(JSON.parse(JSON.stringify(await promoted())));expect(restored.signals).toHaveLength(0);expect(restored.opportunities).toHaveLength(0);
  for(const row of restored.prospectRows){const contact=restored.contacts.find(c=>c.id===row.crmContactId)!;expect(contact.prospectRowIds).toContain(row.id);expect(contact.origins).toContain('csv_prospect');expect(contact.companyId).toBe(row.companyId);expect(outreachGate(restored,contact.id,contact.companyId)).toBe(contact)}
 });
 it('rejects a restored prospect linked to another company contact',async()=>{
  const w=await promoted();w.prospectRows[0].crmContactId=w.contacts[1].id;expect(()=>validateWorkspace(w)).toThrow('another company');
 });
 it('rejects a contact that claims a foreign company prospect row in either lineage field',async()=>{
  for(const field of ['prospectRowId','prospectRowIds'] as const){const w=await promoted();if(field==='prospectRowId')w.contacts[0][field]=w.prospectRows[1].id;else w.contacts[0][field]=[w.prospectRows[1].id];expect(()=>validateWorkspace(w)).toThrow('lineage')}
 });
 it('rejects deleted rows and missing reciprocal links claimed by a contact',async()=>{
  const w=await promoted();for(const corrupt of [(copy:Workspace)=>{copy.contacts[0].prospectRowIds=['missing-row']},(copy:Workspace)=>{delete copy.prospectRows[0].crmContactId}]){const copy=structuredClone(w);corrupt(copy);expect(()=>validateWorkspace(copy)).toThrow('lineage')}
 });
 it('rejects a row-to-contact link whose reciprocal prospect lineage was removed',async()=>{
  const w=await promoted();delete w.contacts[0].prospectRowId;delete w.contacts[0].prospectRowIds;expect(()=>validateWorkspace(w)).toThrow('lineage');
 });
 it('rejects shared prospect evidence that claims an unknown CSV import batch',async()=>{
  const w=await promoted(),sourceId=crypto.randomUUID(),now=new Date().toISOString();w.sources.push({id:sourceId,name:'Fictional public company source',family:'Prospect Research',url:'https://example.com',tier:'B',geography:'',mode:'import',health:'imported',cadence:'Manual',limitations:'Fictional fixture'});w.evidence.push({id:crypto.randomUUID(),sourceId,reference:'https://example.com/team',excerpt:'Fictional source-backed fixture',tier:'B',eventDate:'',publishedAt:'',discoveredAt:now,importedAt:now,observed:true,hash:'9'.repeat(64),review:'unreviewed',origin:'csv_prospect',prospectBatchId:'unknown-batch'});expect(()=>validateWorkspace(w)).toThrow('CSV batch');
 });
 it('retains prior lineage when a second explicit CSV import deduplicates the same named contact',async()=>{
  let w=await promoted();const first=w.prospectRows[0],contactId=first.crmContactId;const headers=['Company','Owner','Website','Email','Additional'];w=await applyAction(w,{type:'prospects.import',input:{fileName:'second-fictional.csv',fileHash:'8'.repeat(64),headers,rows:[['Example Industrial LLC','Robert Johnson','https://example.com','robert.johnson@example.com','second owner-selected import']],mapping:proposeMapping(headers).mapping}});const last=w.prospectRows.at(-1)!;w=await applyAction(w,{type:'prospects.review',rowIds:[last.id],review:'accepted'});w=await applyAction(w,{type:'prospects.promote',rowIds:[last.id]});expect(w.contacts).toHaveLength(2);expect(w.prospectRows.at(-1)!.crmContactId).toBe(contactId);expect(w.contacts.find(c=>c.id===contactId)!.prospectRowIds).toEqual(expect.arrayContaining([first.id,last.id]));expect(()=>validateWorkspace(JSON.parse(JSON.stringify(w)))).not.toThrow();
 });
 it('invalidates old checkpoint cursors when a paused batch is remapped and retries every selected row',async()=>{
  let w=await imported();const batch=w.prospectBatches[0],row=w.prospectRows[0],original=w.prospectRows.map(r=>[...r.original]);w=await applyAction(w,{type:'prospects.start',batchId:batch.id,settings});const jobId=w.prospectJobs[0].id;w=await applyAction(w,{type:'prospects.job.running',jobId});w=await applyAction(w,{type:'prospects.checkpoint',jobId,results:[{rowId:row.id,result:selectResult(row,null)}]});w=await applyAction(w,{type:'prospects.control',jobId,control:'pause'});expect(w.prospectJobs[0].completedRowIds).toEqual([row.id]);
  w=await applyAction(w,{type:'prospects.remap',batchId:batch.id,mapping:{...batch.mapping,person:null}});expect(w.prospectJobs[0].status).toBe('cancelled');expect(w.prospectJobs[0].completedRowIds).toEqual([]);expect(w.prospectRows.every(r=>r.result===null&&r.normalized.person==='')).toBe(true);expect(w.prospectRows.map(r=>r.original)).toEqual(original);await expect(applyAction(w,{type:'prospects.control',jobId,control:'resume'})).rejects.toThrow();
  w=await applyAction(w,{type:'prospects.control',jobId,control:'retry_failed'});expect(w.prospectJobs[0].status).toBe('queued');expect(w.prospectJobs[0].rowIds).toHaveLength(2);expect(w.prospectJobs[0].completedRowIds).toEqual([]);expect(w.prospectJobs[0].completedAt).toBeUndefined();
 });
 it('clears the prior completion timestamp when a failed job is queued for recovery',async()=>{
  let w=await imported();w=await applyAction(w,{type:'prospects.start',batchId:w.prospectBatches[0].id,settings});const jobId=w.prospectJobs[0].id;w=await applyAction(w,{type:'prospects.job.running',jobId});w=await applyAction(w,{type:'prospects.job.finish',jobId,error:'Fixture session locked before checkpoint'});expect(w.prospectJobs[0].completedAt).toBeTruthy();w=await applyAction(w,{type:'prospects.control',jobId,control:'resume'});expect(w.prospectJobs[0].status).toBe('queued');expect(w.prospectJobs[0].completedAt).toBeUndefined();expect(w.prospectJobs[0].error).toBeUndefined();
 });
});
