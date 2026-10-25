import {describe,it,expect} from 'vitest';
import {createVault,openVault,readEnvelope,seal} from '../src/platform/crypto';
import {emptyWorkspace,applyAction,approvalHash} from '../src/domain/workspace';
import {sampleWorkspace} from '../src/domain/demo';
import {validateWorkspace} from '../src/domain/validation';

describe('authenticated encrypted workspace',()=>{
  it('round trips without plaintext and rejects a wrong passphrase and damaged ciphertext',async()=>{
    const w=emptyWorkspace('Confidential customer');const {key,envelope}=await createVault(JSON.stringify(w),'correct horse battery staple');
    expect(JSON.stringify(envelope)).not.toContain('Confidential');expect(key.extractable).toBe(false);
    const opened=await openVault(envelope,'correct horse battery staple');expect(validateWorkspace(JSON.parse(opened.text))).toEqual(w);
    await expect(openVault(envelope,'wrong password supplied')).rejects.toThrow('Unable to unlock');
    const changed={...envelope,ciphertext:envelope.ciphertext.slice(0,-8)+'ABCDABCD'};await expect(openVault(changed,'correct horse battery staple')).rejects.toThrow('Unable to unlock');
    await expect(seal('a'.repeat(16*1024*1024+1),key,envelope.salt)).rejects.toThrow('16 MB');
    const again=await seal(JSON.stringify(w),key,envelope.salt);expect(again.iv).not.toEqual(envelope.iv);
  });
  it('rejects weak passphrases, attacker-controlled KDF costs and schema versions',async()=>{
    await expect(createVault('{}','short')).rejects.toThrow('12');expect(()=>readEnvelope({format:'latimus-vault',version:1,kdf:'PBKDF2-SHA256',iterations:999999999})).toThrow('parameters');expect(()=>validateWorkspace({...emptyWorkspace('test'),schemaVersion:99})).toThrow();
  });
  it('rejects cross-workspace links and fabricated EOS totals on restore',async()=>{
    const w=await sampleWorkspace();w.signals[0].companyId='another-account';expect(()=>validateWorkspace(w)).toThrow('cross-workspace');const bad=await sampleWorkspace();bad.signals[0].score=1;expect(()=>validateWorkspace(bad)).toThrow('reconcile');
  });
});
describe('owner-controlled actions',()=>{
  it('binds approval to exact content, disallows merge fields, and sends nothing',async()=>{
    let w=await sampleWorkspace();const c=w.contacts[0];const input={companyId:c.companyId,contactId:c.id,subject:'Delivery Readiness Review',body:'Alex, may we discuss your delivery priorities?'};
    await expect(applyAction(w,{type:'approval.draft',input:{...input,body:'Hi {{name}}'}})).rejects.toThrow('merge fields');
    w=await applyAction(w,{type:'approval.draft',input});const a=w.approvals[0];expect(a.hash).toEqual(await approvalHash(a));
    await expect(applyAction(w,{type:'approval.draft',input})).rejects.toThrow('identical');
    const tampered=structuredClone(w);tampered.approvals[0].body='Different offer';await expect(applyAction(tampered,{type:'approval.decide',id:a.id,approve:true,reviewer:'Owner'})).rejects.toThrow('exact content');
    w=await applyAction(w,{type:'approval.decide',id:a.id,approve:true,reviewer:'Owner'});expect(w.approvals[0].status).toBe('Approved');expect(w.audit.at(-1)?.detail).toContain('no external message sent');
  });
  it('suppression revokes approvals and prevents drafting; contacts cannot cross accounts',async()=>{
    let w=await sampleWorkspace();const c=w.contacts[0];w=await applyAction(w,{type:'approval.draft',input:{companyId:c.companyId,contactId:c.id,subject:'Readiness Review',body:'A manually prepared draft.'}});
    w=await applyAction(w,{type:'contact.suppress',id:c.id});expect(w.approvals[0].status).toBe('Rejected');await expect(applyAction(w,{type:'approval.draft',input:{companyId:c.companyId,contactId:c.id,subject:'Again',body:'Should not send'}})).rejects.toThrow('suppressed');
    await expect(applyAction(await sampleWorkspace(),{type:'approval.draft',input:{companyId:'wrong',contactId:c.id,subject:'Cross account',body:'Bad'}})).rejects.toThrow('another account');
  });
  it('prevents unsupported external actions and client delivery without won evidence',async()=>{
    const w=await sampleWorkspace();await expect(applyAction(w,{type:'send'} as any)).rejects.toThrow('Unsupported action');const o=w.opportunities[1];await expect(applyAction(w,{type:'engagement.add',input:{opportunityId:o.id,companyId:o.companyId,name:'bad',owner:'Owner',status:'Active',budgetCents:0,baseline:'',acceptance:''}})).rejects.toThrow('won');
  });
  it('writes artifacts and receipts atomically and safely resumes the local queue',async()=>{
    let w=await sampleWorkspace();w=await applyAction(w,{type:'report.queue'});await expect(applyAction(w,{type:'report.queue'})).rejects.toThrow('queued');
    w=validateWorkspace(JSON.parse(JSON.stringify(w)));w.jobs[0].state='running';w=await applyAction(w,{type:'jobs.run'});expect(w.jobs[0].state).toBe('succeeded');expect(w.artifacts).toHaveLength(1);const next=await applyAction(w,{type:'jobs.run'});expect(next.artifacts).toHaveLength(1);expect(next.artifacts[0].body).toContain('ILLUSTRATIVE');
  });
  it('rolls back a malformed batch without partial source updates',async()=>{
    const w=await sampleWorkspace();const initial=JSON.stringify(w);await expect(applyAction(w,{type:'signals.import',input:[{companyName:'bad'} as any]})).rejects.toThrow();expect(JSON.stringify(w)).toBe(initial);
  });
});
