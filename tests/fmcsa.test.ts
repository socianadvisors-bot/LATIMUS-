import {describe,it,expect} from 'vitest';
import {buildFmcsaRequest,parseFmcsaResponse,compareFleetSnapshots} from '../src/domain/fmcsa';
import {defaultSourceSettings} from '../src/domain/connectors';
import type {SourceRun} from '../src/domain/types';
const FMCSA_URL='https://data.transportation.gov/resource/az4n-8mr2.json';
function run(count:unknown,at='2026-10-24T12:00:00.000Z',dot='123'):SourceRun{
 return {id:at,sourceId:'fmcsa-source',connectorId:'fmcsa-census',settings:defaultSourceSettings(),status:'succeeded',startedAt:at,completedAt:at,requestUrl:FMCSA_URL,responseHash:'a'.repeat(64),recordsFetched:1,records:parseFmcsaResponse([{dot_number:dot,legal_name:'Fixture Carrier',power_units:count,phy_state:'TX'}],FMCSA_URL,25).records,truncated:false};
}
describe('live-schema-backed FMCSA census adapter',()=>{
 it('uses bounded official state reads and an optional exact numeric USDOT filter without private contact fields',()=>{
  const query=new URL(buildFmcsaRequest({...defaultSourceSettings(),keyword:'00123',limit:2}).url);
  expect(query.origin).toBe('https://data.transportation.gov');expect(query.pathname).toBe('/resource/az4n-8mr2.json');
  expect(query.searchParams.get('$where')).toBe("phy_state='TX' AND dot_number=123");expect(query.searchParams.get('$limit')).toBe('2');
  const selected=query.searchParams.get('$select')!;expect(selected).toContain('power_units');for(const field of ['phone','email_address','company_officer','phy_street'])expect(selected).not.toContain(field);
  expect(()=>buildFmcsaRequest({...defaultSourceSettings(),keyword:"1 OR 1=1"})).toThrow('numeric USDOT');expect(()=>buildFmcsaRequest({...defaultSourceSettings(),keyword:'0'})).toThrow('positive');
 });
 it('preserves unknown dates and exact source count values without equating census addition with new authority',()=>{
  const p=parseFmcsaResponse([{dot_number:'295774',status_code:'I',power_units:'0',add_date:'19870616',phy_state:'TX',phone:'do not retain',email_address:'do-not-retain@example.com'}],FMCSA_URL,25);
  expect(p.records[0].date).toBe('');expect(p.records[0].dateLabel).toContain('not authority issuance');expect(p.records[0].fields.power_units).toBe('0');expect(p.records[0].fields.add_date).toBe('19870616');expect(p.records[0].fields).not.toHaveProperty('phone');expect(p.records[0].fields).not.toHaveProperty('email_address');expect(p.warning).toContain('not a new-authority');
  expect(parseFmcsaResponse([{dot_number:123,mcs150_date:'20261001',power_units:'N'}],FMCSA_URL,25).records[0].date).toBe('20261001');
 });
 it('rejects missing or duplicate identity rather than creating unstable fleet comparisons',()=>{
  expect(()=>parseFmcsaResponse([{legal_name:'Unknown'}],FMCSA_URL,25)).toThrow('USDOT');expect(()=>parseFmcsaResponse([{dot_number:'123'},{dot_number:123}],FMCSA_URL,25)).toThrow('duplicate');
 });
});
describe('observed fleet snapshot changes',()=>{
 it('requires an earlier successful baseline for the same DOT and never claims first-pull expansion',()=>{
  const previous=run('10'),current=run('15','2026-10-25T12:00:00.000Z');
  expect(compareFleetSnapshots(undefined,current)).toEqual([]);expect(compareFleetSnapshots({...previous,status:'failed'},current)).toEqual([]);expect(compareFleetSnapshots(previous,run('15','2026-10-25T12:00:00.000Z','456'))).toEqual([]);
  const [change]=compareFleetSnapshots(previous,current);expect(change).toMatchObject({dotNumber:'123',previousPowerUnits:10,currentPowerUnits:15,delta:5});expect(change.warning).toContain('does not independently verify');
 });
 it('does not compare reversed/same-time snapshots or different source/query scope',()=>{
  const previous=run('10'),current=run('15','2026-10-25T12:00:00.000Z');expect(compareFleetSnapshots(current,previous)).toEqual([]);expect(compareFleetSnapshots(previous,run('15'))).toEqual([]);expect(compareFleetSnapshots(previous,{...current,sourceId:'different'})).toEqual([]);expect(compareFleetSnapshots(previous,{...current,settings:{...current.settings,state:'CA'}})).toEqual([]);
 });
 it('rejects negative, suppressed, missing, zero, fractional and unsafe counts without imputing growth',()=>{
  const previous=run('10');for(const count of ['-1','N',null,'0','1.5','9007199254740992'])expect(compareFleetSnapshots(previous,run(count,'2026-10-25T12:00:00.000Z'))).toEqual([]);
  expect(compareFleetSnapshots(previous,run('10','2026-10-25T12:00:00.000Z'))).toEqual([]);
 });
 it('reports decreases truthfully and skips ambiguous duplicate identities',()=>{
  const previous=run('10'),current=run('8','2026-10-25T12:00:00.000Z');expect(compareFleetSnapshots(previous,current)[0].delta).toBe(-2);
  expect(compareFleetSnapshots({...previous,records:[...previous.records,...previous.records]},current)).toEqual([]);expect(compareFleetSnapshots(previous,{...current,records:[...current.records,...current.records]})).toEqual([]);
 });
});
