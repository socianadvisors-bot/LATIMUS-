import {afterEach,describe,expect,it,vi} from 'vitest';
import {parseProspectCsvInWorker} from '../src/platform/csvBridge';
class FakeWorker {
 static latest:FakeWorker; terminated=false; onmessage:((e:any)=>void)|null=null;onerror:(()=>void)|null=null;request:unknown;
 constructor(public url:string,public options?:WorkerOptions){FakeWorker.latest=this;}
 postMessage(value:unknown){this.request=value;}
 terminate(){this.terminated=true;}
}
afterEach(()=>vi.unstubAllGlobals());
describe('CSV worker lifecycle',()=>{
 it('rejects an already cancelled parse without creating a worker',async()=>{
  const ctor=vi.fn();vi.stubGlobal('Worker',ctor);const signal=AbortSignal.abort();await expect(parseProspectCsvInWorker('Company\nExample',signal)).rejects.toMatchObject({name:'AbortError'});expect(ctor).not.toHaveBeenCalled();
 });
 it('terminates active CPU work when the owner cancels, retaining no result',async()=>{
  vi.stubGlobal('Worker',FakeWorker);vi.stubGlobal('location',{protocol:'http:'});const controller=new AbortController();const parsing=parseProspectCsvInWorker('Company\nExample',controller.signal);const rejected=expect(parsing).rejects.toMatchObject({name:'AbortError'});expect(FakeWorker.latest.request).toEqual({type:'parse',text:'Company\nExample'});controller.abort();await rejected;expect(FakeWorker.latest.terminated).toBe(true);
 });
 it('terminates workers after a completed parse and reports runtime failures rather than silent success',async()=>{
  vi.stubGlobal('Worker',FakeWorker);vi.stubGlobal('location',{protocol:'http:'});const result={headers:['Company'],rows:[['Example']],warnings:[]};const parsing=parseProspectCsvInWorker('Company\nExample');FakeWorker.latest.onmessage?.({data:{ok:true,result}});await expect(parsing).resolves.toEqual(result);expect(FakeWorker.latest.terminated).toBe(true);
  const failed=parseProspectCsvInWorker('Company\nExample');const rejected=expect(failed).rejects.toThrow('bundled CSV worker could not run');FakeWorker.latest.onerror?.();await rejected;expect(FakeWorker.latest.terminated).toBe(true);
 });
});
