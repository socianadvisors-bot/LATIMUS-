import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowRight,ShieldCheck,LockKeyhole,Upload,Layers,Activity,KeyRound} from 'lucide-react';
import App from './ui/App';
import './ui/styles.css';
import './platform/gate.css';
import type {Action,Workspace} from './domain/types';
import type {ProspectSettings} from './domain/prospectTypes';
import {runProspectJob} from './platform/prospectRunner';
import {advancedMode,unlockProspectBackground,lockProspectBackground,keepProspectBackground,requestCompanyOrigins,prospectMessage,fetchProspectResearch} from './platform/prospectBridge';
import {emptyWorkspace,applyAction} from './domain/workspace';
import {sampleWorkspace} from './domain/demo';
import {validateWorkspace} from './domain/validation';
import {createVault,openVault,seal,type VaultEnvelope} from './platform/crypto';
import {requestSourcePermission,retrieveSource} from './platform/sources';
import {loadVault,storeVault,portableMode,downloadFile} from './platform/storage';
interface Session {key:CryptoKey;envelope:VaultEnvelope;workspace:Workspace;generation:number}
function Root(){
  const [researchReady,setResearchReady]=useState(!advancedMode());
  const [workspace,setWorkspace]=useState<Workspace|null>(null);const [envelope,setEnvelope]=useState<VaultEnvelope|null>(null);const [loaded,setLoaded]=useState(false);const [error,setError]=useState('');const [busy,setBusy]=useState(false);const [creating,setCreating]=useState(false);const [saveStatus,setSaveStatus]=useState('Encrypted · saved');
  const [name,setName]=useState('THE CONSULT');const [password,setPassword]=useState('');const [confirmPassword,setConfirmPassword]=useState('');const [sample,setSample]=useState(false);const [importFile,setImportFile]=useState<File|null>(null);
  const backgroundUnlockQueue=useRef(Promise.resolve());
  const prospectRuns=useRef(new Map<string,AbortController>());
  const stopProspecting=()=>{for(const controller of prospectRuns.current.values())controller.abort();prospectRuns.current.clear();};
  const session=useRef<Session|null>(null);const queue=useRef(Promise.resolve());const generation=useRef(0);const lastActivity=useRef(Date.now());const hiddenAt=useRef<number|null>(null);const dirty=useRef(false);const autoRunning=useRef(false);const pulls=useRef(new Map<string,AbortController>());
  const activate=(w:Workspace,key:CryptoKey,v:VaultEnvelope)=>{setResearchReady(!advancedMode());stopProspecting();for(const controller of pulls.current.values())controller.abort();pulls.current.clear();if(session.current)lockProspectBackground(session.current.workspace.id);generation.current++;session.current={workspace:w,key,envelope:v,generation:generation.current};setWorkspace(w);setEnvelope(v);setPassword('');setConfirmPassword('');setError('');setImportFile(null);lastActivity.current=Date.now();setSaveStatus(portableMode()?'File mode · export to save':'Encrypted · saved');};
  const lock=()=>{stopProspecting();if(session.current)lockProspectBackground(session.current.workspace.id);for(const c of pulls.current.values())c.abort();pulls.current.clear();generation.current++;session.current=null;setWorkspace(null);setPassword('');setConfirmPassword('');setCreating(false);setError('');};
  useEffect(()=>{loadVault().then(v=>{setEnvelope(v);setCreating(!v);}).catch(e=>{setError(String(e.message));setCreating(true);}).finally(()=>setLoaded(true));},[]);
  useEffect(()=>{
    const touch=()=>{lastActivity.current=Date.now();};const visibility=()=>{if(document.hidden)hiddenAt.current=Date.now();else {if(hiddenAt.current&&Date.now()-hiddenAt.current>=120000)lock();hiddenAt.current=null;}};
    const unload=(event:BeforeUnloadEvent)=>{if(portableMode()&&dirty.current){event.preventDefault();event.returnValue='';}};
    window.addEventListener('pointerdown',touch);window.addEventListener('keydown',touch);document.addEventListener('visibilitychange',visibility);window.addEventListener('beforeunload',unload);
    const timer=setInterval(()=>{if(session.current&&Date.now()-lastActivity.current>=600000)lock();},10000);
    return()=>{window.removeEventListener('pointerdown',touch);window.removeEventListener('keydown',touch);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('beforeunload',unload);clearInterval(timer);};
  },[]);
  async function unlockBackgroundSession(workspaceId:string,passphrase:string){
    const g=generation.current;
    const operation=backgroundUnlockQueue.current.catch(()=>{}).then(async()=>{
      if(session.current?.generation!==g)return;
      try{await unlockProspectBackground(workspaceId,passphrase);
        if(session.current?.generation!==g){lockProspectBackground(workspaceId);return;}
        setResearchReady(true);
      }catch(e){if(session.current?.generation===g)setError(e instanceof Error?e.message:'Private research could not be unlocked.');}
    });backgroundUnlockQueue.current=operation;await operation;
  }
  async function authenticate(event:React.FormEvent){
    event.preventDefault();setBusy(true);setError('');try{
      if(importFile){await importWorkspace(importFile,password);return;}
      if(creating){
        if(password!==confirmPassword)throw new Error('Passphrases do not match.');
        if(envelope){if(!window.confirm('Create a new workspace in this browser? Your previous encrypted workspace will download as a backup before replacement. Keep its original passphrase.'))return;downloadFile('LATIMUS-previous-workspace.vault.json',JSON.stringify(envelope));}
        const w=sample?await sampleWorkspace():emptyWorkspace(name);const {key,envelope:v}=await createVault(JSON.stringify(w),password);await storeVault(v,envelope);activate(w,key,v);await unlockBackgroundSession(w.id,password);dirty.current=portableMode();
      }else{if(!envelope)throw new Error('No workspace found.');const opened=await openVault(envelope,password);const w=validateWorkspace(JSON.parse(opened.text));activate(w,opened.key,opened.envelope);await unlockBackgroundSession(w.id,password);}
    }catch(e){setError(e instanceof Error?e.message:'Unable to open workspace.');}finally{setBusy(false);}
  }
  function act(action:Action):Promise<void>{
    const g=generation.current;
    const next=queue.current.catch(()=>{}).then(async()=>{
      const current=session.current;if(!current||g!==current.generation)throw new Error('Workspace locked. Unlock to continue.');
      setSaveStatus('Encrypting…');
      try{const w=await applyAction(current.workspace,action);const v=await seal(JSON.stringify(w),current.key,current.envelope.salt);
        if(!session.current||session.current.generation!==g)throw new Error('Workspace locked before the update completed. Retry after unlocking.');
        await storeVault(v,current.envelope);current.workspace=w;current.envelope=v;setEnvelope(v);
        if(session.current?.generation===g){setWorkspace(w);setSaveStatus(portableMode()?'Unsaved file changes · export':'Encrypted · saved');}
        dirty.current=true;
      }catch(e){setSaveStatus('Update not saved');throw e;}
    });queue.current=next;return next;
  }
  useEffect(()=>{
    if(!workspace||autoRunning.current||!workspace.jobs.some(j=>j.state==='queued'||j.state==='running'))return;
    autoRunning.current=true;const timer=setTimeout(()=>{act({type:'jobs.run'}).catch(e=>setError(e.message)).finally(()=>{autoRunning.current=false;});},250);
    return()=>{clearTimeout(timer);autoRunning.current=false;};
  },[workspace?.revision,workspace?.id]);
  useEffect(()=>{if(!workspace)return;return keepProspectBackground(workspace.id);},[workspace?.id]);
  useEffect(()=>{
    if(!workspace||!researchReady)return;
    // One workspace-local runner; jobs queued behind it remain durable in the encrypted vault.
    if(prospectRuns.current.size)return;
    const job=workspace.prospectJobs.find(j=>['queued','running'].includes(j.status));if(!job)return;
    const controller=new AbortController(),g=generation.current;prospectRuns.current.set(job.id,controller);
    const deps={read:()=>session.current?.generation===g?session.current.workspace:null,act,advanced:advancedMode(),
      authorize:async(jobId:string)=>(await prospectMessage<{token:string}>({type:'research.authorize',workspaceId:workspace.id,jobId})).token,
      research:fetchProspectResearch,cancel:async(token:string)=>prospectMessage({type:'research.cancel',token})};
    void runProspectJob(job.id,deps,controller.signal).catch(e=>{if(!controller.signal.aborted)setError(e.message);}).finally(()=>{
      if(prospectRuns.current.get(job.id)===controller)prospectRuns.current.delete(job.id);
      // Trigger the next persisted job even when the last update rendered before finally.
      if(session.current?.generation===g)setWorkspace({...session.current.workspace});
    });
  },[workspace,researchReady]);
  async function runProspecting(batchId:string,settings:ProspectSettings,rowIds?:string[]){
    const current=session.current;if(!current)throw new Error('Unlock the workspace first.');const g=current.generation;
    const selected=rowIds?new Set(rowIds):null;
    const domains=[...new Set(current.workspace.prospectRows.filter(r=>r.batchId===batchId&&(!selected||selected.has(r.id))).map(r=>r.normalized.domain||r.result?.domain||'').filter(Boolean))];
    await requestCompanyOrigins(domains);
    if(session.current?.generation!==g)throw new Error('Workspace changed before prospect work started.');
    await act({type:'prospects.start',batchId,settings,rowIds});
  }
  async function controlProspecting(jobId:string,control:'pause'|'resume'|'cancel'|'retry_failed'){
    const current=session.current;if(!current)throw new Error('Unlock the workspace first.');const g=current.generation;
    if(control==='resume'||control==='retry_failed'){
      const job=current.workspace.prospectJobs.find(j=>j.id===jobId);if(!job)throw new Error('Prospect job not found.');const ids=new Set(job.rowIds);
      await requestCompanyOrigins([...new Set(current.workspace.prospectRows.filter(r=>ids.has(r.id)).map(r=>r.normalized.domain||r.result?.domain||'').filter(Boolean))]);
      if(session.current?.generation!==g)throw new Error('Workspace changed before resuming.');
    }else prospectRuns.current.get(jobId)?.abort();
    await act({type:'prospects.control',jobId,control});
  }
  async function pullSource(sourceId:string,credentials?:{censusApiKey?:string}){
    const current=session.current;if(!current)throw new Error('Unlock the workspace first.');const g=current.generation;
    const source=current.workspace.sources.find(s=>s.id===sourceId);if(!source)throw new Error('Source not found.');
    if(pulls.current.has(sourceId))throw new Error('This source request is already running.');
    if(source.lastAttempt&&Date.now()-Date.parse(source.lastAttempt)<5000)throw new Error('Please wait five seconds between source requests.');
    const controller=new AbortController();pulls.current.set(sourceId,controller);
    try{
      await requestSourcePermission(source);
      if(session.current?.generation!==g)throw new Error('Workspace locked; no source data was saved.');
      const run=await retrieveSource(structuredClone(source),fetch,controller.signal,credentials);
      if(session.current?.generation!==g)throw new Error('Workspace changed; no source data was saved.');
      const latest=session.current.workspace.sources.find(s=>s.id===sourceId);if(JSON.stringify(latest?.settings)!==JSON.stringify(source.settings))throw new Error('Source settings changed during retrieval. Retry with the new filters.');
      await act({type:'source.retrieved',run});
      if(run.status==='failed')throw new Error(run.error||'Source retrieval failed.');
    }finally{if(pulls.current.get(sourceId)===controller)pulls.current.delete(sourceId);}
  }
  async function exportWorkspace(){await queue.current.catch(()=>{});const s=session.current;if(!s)throw new Error('Unlock workspace first.');downloadFile(`LATIMUS-${s.workspace.id.slice(0,8)}-r${s.workspace.revision}.vault.json`,JSON.stringify(s.envelope));dirty.current=false;setSaveStatus(portableMode()?'Encrypted file exported':'Encrypted · backup exported');}
  async function importWorkspace(file:File,pass:string){
    if(file.size>96*1024*1024)throw new Error('Workspace file exceeds the 96 MB limit.');
    const opened=await openVault(JSON.parse(await file.text()),pass);const w=validateWorkspace(JSON.parse(opened.text));
    await queue.current.catch(()=>{});
    const existing=session.current;
    const summary=`Restore “${w.name}” (revision ${w.revision})?\n${w.companies.length} companies · ${w.signals.length} signals · ${w.engagements.length} engagements.\nWorkspace ID: ${w.id}\n${existing?`Replaces this workspace. ${existing.workspace.id===w.id?'Same workspace ID; conflicting revisions are replaced, not merged.':'This is a different workspace.'} An encrypted backup of the current workspace will download first.`:envelope?'Replaces the existing locked workspace in this browser. Its encrypted backup will download first; keep the original passphrase.':'This encrypted workspace will become active in this browser.'}\nOnly restore files you trust; imported approvals do not prove sender identity. No external action will execute.`;
    if(!window.confirm(summary))throw new Error('Restore cancelled. Your existing workspace was retained.');
    const restoreGeneration=generation.current;
    const operation=queue.current.catch(()=>{}).then(async()=>{
      if(generation.current!==restoreGeneration)throw new Error('Workspace changed before restore began; no file was restored.');
      const previous=session.current?.envelope||envelope;
      if(previous)downloadFile('LATIMUS-before-restore.vault.json',JSON.stringify(previous));
      await storeVault(opened.envelope,previous);
      if(generation.current!==restoreGeneration){setEnvelope(opened.envelope);return;}
      activate(w,opened.key,opened.envelope);await unlockBackgroundSession(w.id,pass);dirty.current=portableMode();
    });
    queue.current=operation;await operation;
  }
  if(workspace)return <><App key={workspace.id} workspace={workspace} act={act} onLock={lock} onExport={exportWorkspace} onImport={importWorkspace} onSwitch={lock} storageMode={portableMode()?'Portable file · explicit encrypted save':'Browser · encrypted IndexedDB'} saveStatus={saveStatus} onPullSource={pullSource} onRunProspecting={runProspecting} onControlProspecting={controlProspecting}/>{error&&<div className="runtime-error" role="alert">{error}<button onClick={()=>setError('')}>Dismiss</button></div>}</>;
  return <main className="vault-gate"><section className="gate-story"><div className="gate-brand"><span className="brand-mark">L</span><span>LATIMUS<small>THE CONSULT · EXECUTIVE OFFICE</small></span></div><div className="gate-copy"><div className="gate-eyebrow">CLARITY. COORDINATION. EXECUTION.</div><h1>Intelligence into<br/><em>measurable outcomes.</em></h1><p>Your private Executive Office. Connect market signals, owner decisions and client delivery in one secure, local workspace.</p><div className="gate-flow"><span><Activity size={20}/> Intelligence</span><ArrowRight size={16}/><span><Layers size={20}/> Execution</span><ArrowRight size={16}/><span>Outcomes</span></div></div><footer><ShieldCheck size={17}/> Local first. Encrypted by default. Built for owner control.</footer></section><section className="gate-panel"><div className="gate-form"><span className="gate-lock"><LockKeyhole size={25}/></span><div className="gate-eyebrow">YOUR SECURE WORKSPACE</div><h2>{importFile?'Restore your workspace':creating?'Welcome to LATIMUS':'Welcome back'}</h2><p>{importFile?'Enter the passphrase used to encrypt this file. You will preview its contents before replacement.':creating?'Create an encrypted workspace to begin. Your records stay on this device; no account or server is required.':'Unlock your private Executive Office. Your passphrase never leaves this device.'}</p>
    {!loaded?<p role="status">Checking encrypted storage…</p>:<form onSubmit={authenticate}>
    {creating&&!importFile&&<label>Workspace name<input name="workspace-name" value={name} maxLength={100} onChange={e=>setName(e.target.value)} required/></label>}
    <label>Passphrase<input aria-label="Passphrase" autoComplete={creating?'new-password':'current-password'} type="password" minLength={12} maxLength={1024} value={password} onChange={e=>setPassword(e.target.value)} required placeholder="At least 12 characters"/></label>
    {creating&&!importFile&&<><label>Confirm passphrase<input aria-label="Confirm passphrase" type="password" autoComplete="new-password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required/></label><label className="sample-option"><input type="checkbox" checked={sample} onChange={e=>setSample(e.target.checked)}/><span>Include a demonstration workspace<small>Fictional records to explore the workflow. Clearly labeled.</small></span></label></>}
    {importFile&&<div className="gate-filename"><Upload size={16}/>{importFile.name}<button type="button" onClick={()=>setImportFile(null)}>Cancel</button></div>}
    {error&&<p className="gate-error" role="alert">{error}</p>}
    <button className="gate-submit" disabled={busy} type="submit">{busy?'Securing workspace…':importFile?'Preview & restore':creating?'Create encrypted workspace':'Unlock workspace'}<ArrowRight size={18}/></button>
    <div className="gate-recovery"><KeyRound size={15}/><span>Keep your passphrase safe. There is no password reset. Export encrypted backups regularly.{portableMode()?' File mode requires explicit export before closing.':''}</span></div>
    </form>}
    <div className="gate-alternatives"><label className="gate-import"><Upload size={15}/> Restore encrypted file<input type="file" accept=".json" onChange={e=>{setImportFile(e.target.files?.[0]||null);setError('');}}/></label>{envelope&&<button onClick={()=>{setCreating(!creating);setError('');setImportFile(null);}}>{creating?'Use existing workspace':'Create a new workspace'}</button>}</div><div className="gate-version">LATIMUS 0.4 · LOCAL TOOLS + ASSISTED HANDOFF<br/>Search setup is optional in Advanced Mode. Outbound sending remains off.</div>
    </div></section></main>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><Root/></React.StrictMode>);
