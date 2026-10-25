import {beforeAll,afterEach,describe,it,expect,vi} from 'vitest';
import {ProspectBroker,publicIPv4,publicIPv6,trustedProspectSender,type BrokerStorage} from '../src/platform/prospectBroker';
import {createVault,openVaultWithKey,seal,type VaultEnvelope} from '../src/platform/crypto';
import {applyAction,emptyWorkspace} from '../src/domain/workspace';
import {proposeMapping} from '../src/domain/prospecting';
import type {Workspace} from '../src/domain/types';
import type {ProspectSettings} from '../src/domain/prospectTypes';

const passphrase='Fixture-only passphrase 123';
const fixtureSecret='fixture_ONLY_brave_key_123456789';
const extensionId='abcdefghijklmnopabcdefghijklmnop';
const sender={id:extensionId,frameId:0,tab:{id:9},url:`chrome-extension://${extensionId}/index.html`};
const settings:ProspectSettings={concurrency:1,maxPages:1,requestDelayMs:250,timeoutMs:3000,cacheMode:'refresh_stale',cacheDays:30};
let workspace:Workspace,vault:VaultEnvelope,key:CryptoKey;
beforeAll(async()=>{
 const headers=['Company','Owner','Website'];
 workspace=await applyAction(emptyWorkspace('Broker security fixtures'),{type:'prospects.import',input:{fileName:'fixture.csv',fileHash:'5'.repeat(64),headers,rows:[['Example Industrial LLC','Robert Johnson','https://example.com'],['Example Industrial LLC','Jane Smith','https://example.com'],['Another Company LLC','Jo Doe','https://other.example.org']],mapping:proposeMapping(headers).mapping}});
 workspace=await applyAction(workspace,{type:'prospects.start',batchId:workspace.prospectBatches[0].id,rowIds:workspace.prospectRows.slice(0,2).map(r=>r.id),settings});
 const created=await createVault(JSON.stringify(workspace),passphrase);vault=created.envelope;key=created.key;
});
afterEach(()=>{vi.useRealTimers();vi.restoreAllMocks()});

function fixture(fetcher:typeof fetch=vi.fn(async(input)=>{
 const url=String(input);
 if(url.startsWith('https://dns.google/resolve'))return Response.json({Status:0,Answer:[{type:1,data:'93.184.215.14'}]});
 if(url.endsWith('/robots.txt'))return new Response('User-agent: *\nDisallow:',{headers:{'content-type':'text/plain'}});
 return new Response('<title>Example Industrial LLC</title><h1>Example Industrial LLC</h1><article><h2>Robert Johnson</h2><a href="mailto:robert.johnson@example.com">Email Robert</a></article>',{headers:{'content-type':'text/html'}});
}) as typeof fetch,hasOrigin=(origin:string)=>Promise.resolve(true)){
 const data=new Map<string,any>([['vault:active',structuredClone(vault)]]);
 const storage:BrokerStorage={get:async(store,id)=>data.get(store+':'+id),put:async(store,id,value)=>{data.set(store+':'+id,value)},remove:async(store,id)=>{data.delete(store+':'+id)}};
 const broker=new ProspectBroker({extensionId,storage,fetcher,hasOrigin});
 const request=(type:string,extra:Record<string,unknown>={})=>broker.handle({protocol:'latimus-prospect-1',type,...extra},sender);
 const unlock=()=>request('session.unlock',{workspaceId:workspace.id,passphrase});
 const authorize=()=>request('research.authorize',{workspaceId:workspace.id,jobId:workspace.prospectJobs[0].id});
 async function importProvider(extra:Record<string,unknown>={}){
  const handleId=crypto.randomUUID();data.set('file-handles:'+handleId,{workspaceId:workspace.id,expiresAt:Date.now()+300000,handle:{getFile:async()=>({size:fixtureSecret.length,text:async()=>fixtureSecret})},...extra});
  return {handleId,response:await request('provider.import',{workspaceId:workspace.id,handleId,passphrase})};
 }
 return {data,broker,storage,request,unlock,authorize,importProvider,fetcher};
}

describe('private prospect broker sender and CSV capabilities',()=>{
 it('accepts only the extension full-tab page and rejects hostile frames, origins and message shapes before storage/network',async()=>{
  const f=fixture();expect(trustedProspectSender(sender,extensionId)).toBe(true);
  const hostile=[undefined,{}, {...sender,id:'different-extension'}, {...sender,frameId:1}, {...sender,tab:undefined}, {...sender,url:'https://example.com/index.html'}, {...sender,url:`chrome-extension://${extensionId}/other.html`}];
  for(const bad of hostile){expect(trustedProspectSender(bad,extensionId)).toBe(false);expect((await f.broker.handle({protocol:'latimus-prospect-1',type:'provider.status',workspaceId:workspace.id},bad)).ok).toBe(false)}
  for(const bad of [{type:'fetch',url:'https://example.com'},{type:'session.unlock',workspaceId:workspace.id,passphrase,unexpected:true},{type:'provider.status',workspaceId:workspace.id,apiKey:fixtureSecret}]){
   const result=await f.broker.handle({protocol:'latimus-prospect-1',...bad},sender);expect(result).toEqual({ok:false,error:'Invalid private research request.'});expect(JSON.stringify(result)).not.toContain(fixtureSecret);
  }
  expect(f.fetcher).not.toHaveBeenCalled();
 });
 it('requires real workspace decryption and matching workspace identity before research',async()=>{
  const f=fixture();expect((await f.authorize()).ok).toBe(false);
  expect((await f.request('session.unlock',{workspaceId:workspace.id,passphrase:'wrong fixture passphrase'})).ok).toBe(false);
  expect((await f.request('session.unlock',{workspaceId:'different-workspace',passphrase})).ok).toBe(false);
  expect((await f.unlock()).value).toEqual({unlocked:true});expect(f.fetcher).not.toHaveBeenCalled();
 });
 it('limits issued tokens to selected rows in the owner-imported CSV job and shares company research',async()=>{
  const f=fixture();await f.unlock();const authorized=await f.authorize();expect(authorized.ok).toBe(true);const token=(authorized.value as any).token;
  const wrong=await f.request('research.company',{token,rowId:workspace.prospectRows[2].id});expect(wrong.ok).toBe(false);expect(wrong.error).toContain('outside');expect(f.fetcher).not.toHaveBeenCalled();
  const first=await f.request('research.company',{token,rowId:workspace.prospectRows[0].id});expect(first.ok).toBe(true);expect((first.value as any).research.pages).toHaveLength(1);const calls=(f.fetcher as any).mock.calls.length;
  const same=await f.request('research.company',{token,rowId:workspace.prospectRows[1].id});expect(same.ok).toBe(true);expect((f.fetcher as any).mock.calls).toHaveLength(calls);
  await f.request('research.cancel',{token});expect((await f.request('research.company',{token,rowId:workspace.prospectRows[0].id})).ok).toBe(false);
 });
 it('keeps same-named company research separate when imported city clues differ',async()=>{
  const headers=['Company','Owner','City','State'];let scope=emptyWorkspace('Company geography fixture');scope.id=workspace.id;scope=await applyAction(scope,{type:'prospects.import',input:{fileName:'geography-fictional.csv',fileHash:'c'.repeat(64),headers,rows:[['Fictional Parts LLC','Jane Example','Dallas','TX'],['Fictional Parts LLC','Jo Example','Austin','TX']],mapping:proposeMapping(headers).mapping}});scope=await applyAction(scope,{type:'prospects.start',batchId:scope.prospectBatches[0].id,settings});
  const fetcher=vi.fn(async(input:RequestInfo|URL)=>{const url=new URL(String(input));expect(url.origin).toBe('https://api.search.brave.com');const city=url.searchParams.get('q')!.includes('Dallas')?'Dallas':'Austin';return Response.json({web:{results:[{url:`https://fictionalparts-${city.toLowerCase()}.example.com`,title:`Fictional Parts LLC ${city} TX`,description:`Official Fictional Parts LLC website ${city} TX`}]}})});const f=fixture(fetcher as typeof fetch,async origin=>origin==='https://api.search.brave.com/*');f.data.set('vault:active',await seal(JSON.stringify(scope),key,vault.salt));await f.importProvider();const authorized=await f.request('research.authorize',{workspaceId:scope.id,jobId:scope.prospectJobs[0].id});expect(authorized.ok).toBe(true);const token=(authorized.value as any).token;
  const domains:string[]=[];for(const row of scope.prospectRows){const result=await f.request('research.company',{token,rowId:row.id});expect(result.ok).toBe(true);domains.push((result.value as any).research.domain)}expect(fetcher).toHaveBeenCalledTimes(2);expect(domains).toEqual(['fictionalparts-dallas.example.com','fictionalparts-austin.example.com']);
 });
 it('invalidates token authority on lock and aborts its in-flight request',async()=>{
  let began!:()=>void;const started=new Promise<void>(r=>{began=r});let signal:AbortSignal|undefined;
  const fetcher=vi.fn((_url:RequestInfo|URL,init?:RequestInit)=>new Promise<Response>((_resolve,reject)=>{signal=init!.signal as AbortSignal;began();signal.addEventListener('abort',()=>reject(new DOMException('Cancelled','AbortError')),{once:true})}));
  const f=fixture(fetcher as typeof fetch);await f.unlock();const {value}=await f.authorize();const token=(value as any).token;
  const pending=f.request('research.company',{token,rowId:workspace.prospectRows[0].id});await started;await f.request('session.lock',{workspaceId:workspace.id});expect(signal!.aborted).toBe(true);expect((await pending).ok).toBe(false);expect((await f.request('research.company',{token,rowId:workspace.prospectRows[0].id})).ok).toBe(false);
 });
 it('rechecks persisted job state before consuming an earlier research token',async()=>{
  const f=fixture();await f.unlock();const {value}=await f.authorize();const paused=await applyAction(workspace,{type:'prospects.control',jobId:workspace.prospectJobs[0].id,control:'pause'});f.data.set('vault:active',await seal(JSON.stringify(paused),key,vault.salt));
  const result=await f.request('research.company',{token:(value as any).token,rowId:workspace.prospectRows[0].id});expect(result.ok).toBe(false);expect(f.fetcher).not.toHaveBeenCalled();
 });
 it('rejects restored changes to row selection, normalized company clues or job settings',async()=>{
  for(const change of [(w:Workspace)=>{w.prospectJobs[0].rowIds=[w.prospectRows[1].id]},(w:Workspace)=>{w.prospectRows[0].normalized.website='https://changed.example.org';w.prospectRows[0].normalized.domain='changed.example.org'},(w:Workspace)=>{w.prospectJobs[0].settings.maxPages=2}]){
   const f=fixture();await f.unlock();const {value}=await f.authorize();const restored=structuredClone(workspace);change(restored);f.data.set('vault:active',await seal(JSON.stringify(restored),key,vault.salt));const result=await f.request('research.company',{token:(value as any).token,rowId:workspace.prospectRows[0].id});expect(result.ok).toBe(false);expect(f.fetcher).not.toHaveBeenCalled();
  }
 });
});

describe('background-only encrypted provider credential',()=>{
 it('reads a staged file capability only in the broker and stores ciphertext without returning the secret',async()=>{
  const f=fixture();const {response,handleId}=await f.importProvider();expect(response).toEqual({ok:true,value:{configured:true}});expect(f.data.has('file-handles:'+handleId)).toBe(false);
  const provider=f.data.get('provider-vault:brave:'+workspace.id);expect(provider.format).toBe('latimus-vault');expect(JSON.stringify(provider)).not.toContain(fixtureSecret);expect(JSON.parse(await openVaultWithKey(provider,key))).toEqual({key:fixtureSecret});
  const status=await f.request('provider.status',{workspaceId:workspace.id});expect(status.value).toEqual({configured:true,unlocked:true,lastTest:undefined});expect(JSON.stringify(status)).not.toContain(fixtureSecret);expect(f.fetcher).not.toHaveBeenCalled();
 });
 it('rejects expired or foreign staged handles and removes them on failure',async()=>{
  const f=fixture();for(const extra of [{workspaceId:'other'},{expiresAt:Date.now()-1},{handle:{getFile:async()=>({size:5000,text:async()=>fixtureSecret})}}]){const {response,handleId}=await f.importProvider(extra);expect(response.ok).toBe(false);expect(JSON.stringify(response)).not.toContain(fixtureSecret);expect(f.data.has('file-handles:'+handleId)).toBe(false)}
  expect(f.data.has('provider-vault:brave:'+workspace.id)).toBe(false);
 });
 it('uses the fixed Brave HTTPS endpoint, omits credentials, and returns only status after an actual fixture response',async()=>{
  const fetcher=vi.fn(async()=>Response.json({web:{results:[]}}));const f=fixture(fetcher as typeof fetch);await f.importProvider();const result=await f.request('provider.test',{workspaceId:workspace.id});expect(result.ok).toBe(true);expect((result.value as any).lastTest).toMatch(/^20\d\d-/);expect(JSON.stringify(result)).not.toContain(fixtureSecret);
  expect(fetcher).toHaveBeenCalledTimes(1);const [url,init]=(fetcher as any).mock.calls[0];const u=new URL(url);expect(u.origin+u.pathname).toBe('https://api.search.brave.com/res/v1/web/search');expect(u.searchParams.get('q')).toBe('example.com');expect(init.headers['X-Subscription-Token']).toBe(fixtureSecret);expect(init.credentials).toBe('omit');expect(init.redirect).toBe('error');expect(init.referrerPolicy).toBe('no-referrer');
  const encrypted=f.data.get('provider-vault:brave:'+workspace.id);expect(JSON.parse(await openVaultWithKey(encrypted,key)).lastTest).toBe((result.value as any).lastTest);
 });
 it('requires explicit Brave permission and does not expose upstream error bodies or claim a failed test as connected',async()=>{
  const denied=fixture(vi.fn() as unknown as typeof fetch,async origin=>!origin.includes('api.search.brave.com'));await denied.importProvider();expect((await denied.request('provider.test',{workspaceId:workspace.id})).ok).toBe(false);expect(denied.fetcher).not.toHaveBeenCalled();
  const fetcher=vi.fn(async()=>new Response('upstream accidentally echoed '+fixtureSecret,{status:401}));const f=fixture(fetcher as typeof fetch);await f.importProvider();const result=await f.request('provider.test',{workspaceId:workspace.id});expect(result.ok).toBe(false);expect(result.error).toContain('HTTP 401');expect(JSON.stringify(result)).not.toContain(fixtureSecret);expect((await f.request('provider.status',{workspaceId:workspace.id})).value).toMatchObject({configured:true,lastTest:undefined});
 });
 it('reports an expired background session as locked and requires unlock before removing its credential',async()=>{
  const f=fixture();await f.importProvider();vi.spyOn(Date,'now').mockReturnValue(Date.now()+600001);
  const status=await f.request('provider.status',{workspaceId:workspace.id});expect(status.value).toMatchObject({configured:true,unlocked:false});const remove=await f.request('provider.remove',{workspaceId:workspace.id});expect(remove.ok).toBe(false);expect(f.data.has('provider-vault:brave:'+workspace.id)).toBe(true);vi.restoreAllMocks();
  await f.unlock();expect((await f.request('provider.remove',{workspaceId:workspace.id})).ok).toBe(true);expect(f.data.has('provider-vault:brave:'+workspace.id)).toBe(false);
 });
 it('stops consuming an oversized streamed search response at the provider response budget',async()=>{
  let chunks=0,cancelled=false;const body=new ReadableStream<Uint8Array>({pull(controller){chunks++;if(chunks<=16)controller.enqueue(new Uint8Array(256*1024).fill(32));else controller.close()},cancel(){cancelled=true}});
  const f=fixture(vi.fn(async()=>new Response(body,{headers:{'content-type':'application/json'}})) as typeof fetch);await f.importProvider();const result=await f.request('provider.test',{workspaceId:workspace.id});expect(result.ok).toBe(false);expect(chunks).toBeLessThanOrEqual(6);expect(cancelled).toBe(true);expect(JSON.stringify(result)).not.toContain(fixtureSecret);
 });
});

describe('public DNS and optional company access boundaries',()=>{
 it('accepts strict public dotted-decimal IPv4 and rejects private, reserved and malformed addresses',()=>{
  expect(publicIPv4('93.184.215.14')).toBe(true);
  for(const address of ['127.0.0.1','10.1.2.3','169.254.1.2','172.16.0.1','192.168.1.2','100.64.0.1','198.18.0.1','198.51.100.2','203.0.113.2','0.0.0.0','224.0.0.1','255.255.255.255','1..2.3','1.2.3.','1e2.1.2.3','1.2.3.256'])expect(publicIPv4(address),address).toBe(false);
 });
 it('accepts public global-unicast IPv6 and rejects private, mapped, special-use and malformed IPv6',()=>{
  expect(publicIPv6('2606:4700:4700::1111')).toBe(true);expect(publicIPv6('2001:4860:4860::8888')).toBe(true);
  for(const address of ['::','::1','fc00::1','fd00::1','fe80::1','ff02::1','::ffff:127.0.0.1','::ffff:7f00:1','2001:db8::1','2001::1','2002:7f00:1::','3fff::1','64:ff9b::7f00:1','2606:4700:::1111','2606:4700::zzzz'])expect(publicIPv6(address),address).toBe(false);
 });
 it('does not request a company website after DNS answers contain any private address',async()=>{
  const fetcher=vi.fn(async()=>Response.json({Status:0,Answer:[{type:1,data:'93.184.215.14'},{type:1,data:'127.0.0.1'}]}));const f=fixture(fetcher as typeof fetch);await f.unlock();const {value}=await f.authorize();const result=await f.request('research.company',{token:(value as any).token,rowId:workspace.prospectRows[0].id});expect(result.ok).toBe(true);expect((result.value as any).research.pages).toHaveLength(0);expect((result.value as any).research.errors.join()).toContain('public IP');expect(fetcher).toHaveBeenCalledTimes(2);expect((fetcher as any).mock.calls[0][0]).toMatch(/^https:\/\/dns.google\/resolve\?/);
 });
 it('does not approve a public A answer when the same hostname has a private AAAA answer',async()=>{
  for(const unsafe of ['::1','fd00::123','fe80::1','::ffff:7f00:1']){
   const fetcher=vi.fn(async(input:RequestInfo|URL)=>{const u=new URL(String(input));expect(u.origin).toBe('https://dns.google');return Response.json({Status:0,Answer:[u.searchParams.get('type')==='AAAA'?{type:28,data:unsafe}:{type:1,data:'93.184.215.14'}]})});
   const f=fixture(fetcher as typeof fetch);await f.unlock();const {value}=await f.authorize();const result=await f.request('research.company',{token:(value as any).token,rowId:workspace.prospectRows[0].id});expect(result.ok).toBe(true);expect((result.value as any).research.pages).toHaveLength(0);expect((result.value as any).research.errors.join()).toContain('public IP');expect(fetcher).toHaveBeenCalledTimes(2);
  }
 });
 it('does no DNS or company fetch if the company origin was not granted',async()=>{
  const f=fixture(vi.fn() as unknown as typeof fetch,async origin=>!origin.includes('example.com'));await f.unlock();const {value}=await f.authorize();const result=await f.request('research.company',{token:(value as any).token,rowId:workspace.prospectRows[0].id});expect(result.ok).toBe(true);expect((result.value as any).research.pages).toHaveLength(0);expect((result.value as any).research.errors.join()).toContain('permission_required');expect(f.fetcher).not.toHaveBeenCalled();
 });
 it('stops consuming oversized streamed DNS responses before allocating the whole body',async()=>{
  let chunks=0,cancelled=0;const fetcher=vi.fn(async()=>{let reads=0;return new Response(new ReadableStream<Uint8Array>({pull(controller){reads++;chunks++;if(reads<=16)controller.enqueue(new Uint8Array(32*1024).fill(32));else controller.close()},cancel(){cancelled++}}),{headers:{'content-type':'application/dns-json'}})});const f=fixture(fetcher as typeof fetch);await f.unlock();const {value}=await f.authorize();const result=await f.request('research.company',{token:(value as any).token,rowId:workspace.prospectRows[0].id});expect(result.ok).toBe(true);expect((result.value as any).research.pages).toHaveLength(0);expect(chunks).toBeLessThanOrEqual(10);expect(cancelled).toBe(2);expect(fetcher).toHaveBeenCalledTimes(2);
 });
});
