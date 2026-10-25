import {describe,it,expect} from 'vitest';
import {MASTER_SOURCES} from '../src/domain/sourceMaster';
const source=(id:string)=>MASTER_SOURCES.find(s=>s.id===id)!;
describe('controlling 55-source plan preservation and honest deployment',()=>{
 it('preserves all stable original identities and the complete seven-sector scope',()=>{
  expect(MASTER_SOURCES.map(s=>s.id)).toEqual(Array.from({length:55},(_,i)=>`INT-${String(i+1).padStart(3,'0')}`));
  expect(source('INT-001').name).toBe('TDLR TABS Project Search');expect(source('INT-023').name).toBe('SAM.gov Contract Awards');expect(source('INT-041').name).toBe('FMCSA Company Census File');expect(source('INT-055').name).toBe('EIA Electricity Data');
  expect(new Set(MASTER_SOURCES.flatMap(s=>s.sectors))).toEqual(new Set(['Business','Finance','Construction','Real Estate','Technology','Logistics','Energy']));
  expect(source('INT-030').sectors).toHaveLength(7);expect(source('INT-038').sectors).toHaveLength(7);
 });
 it('retains source-plan fields, check cadence, geography, automation, POC and workbook distinctions',()=>{
  expect(source('INT-001')).toMatchObject({sectors:['Construction','Real Estate','Energy','Technology'],cost:'Free',checkCadence:'Daily',geography:'Texas',automation:'M/H',pocUsefulness:'H',workbook:'SOURCES + PERMIT_LEADS + SIGNALS',planPage:3});
  expect(source('INT-001').fieldsAvailable).toEqual(['Project #','facility','owner','design firm','city/county','dates','work type','cost']);
  expect(source('INT-005').fieldsAvailable).toContain('JSON/query capability');expect(source('INT-005').connectorId).toBeUndefined();
  expect(source('INT-019').triggerTypes).toEqual(['Acquisition','deed','refinance','lien']);expect(source('INT-023').cost).toBe('Free account');
  expect(source('INT-033').checkCadence).toBe('Intraday');expect(source('INT-041').checkCadence).toBe('Weekly snapshots');expect(source('INT-047').geography).toBe('U.S./metro/state');expect(source('INT-049').checkCadence).toBe('2x daily/nightly');
 });
 it('keeps exactly the eight owner-disabled property feeds while retaining mixed construction and energy scope',()=>{
  const expected=Array.from({length:8},(_,i)=>`INT-${String(i+15).padStart(3,'0')}`);expect(MASTER_SOURCES.filter(s=>s.ownerDisabled).map(s=>s.id)).toEqual(expected);
  for(const s of MASTER_SOURCES){expect(s.propertyOnly).toBe(expected.includes(s.id));expect(s.ownerDisabled).toBe(s.propertyOnly);if(s.ownerDisabled){expect(s.support).toBe('disabled_by_owner');expect(s.notes).toContain('disabled by owner');expect(s.connectorId).toBeUndefined();}}
  for(const id of ['INT-001','INT-002','INT-029','INT-030','INT-032','INT-051'])expect(source(id).ownerDisabled).toBe(false);
 });
 it('maps only actual plan-native sources and cannot silently substitute Austin or Census for DFW feeds',()=>{
  expect(MASTER_SOURCES.filter(s=>s.connectorId).map(s=>[s.id,s.connectorId])).toEqual([['INT-001','tdlr-projects'],['INT-024','usaspending-awards'],['INT-041','fmcsa-census']]);
  for(const s of MASTER_SOURCES){expect(s.connectorId).not.toBe('austin-permits');expect(s.connectorId).not.toBe('census-cbp');if(s.support==='native_adapter')expect(s.connectorId).toBeTruthy();else expect(s.connectorId).toBeUndefined();}
  expect(source('INT-024').notes).toContain('prime contracts only');expect(source('INT-041').notes).toContain('first baseline cannot prove fleet growth');
 });
 it('distinguishes planned automation from live operation and does not fabricate missing metrics',()=>{
  for(const s of MASTER_SOURCES){expect(s.triggerTypes.length).toBeGreaterThan(0);expect(s.fieldsAvailable.length).toBeGreaterThan(0);expect(s.checkCadence).toBeTruthy();expect(s.workbook).toBeTruthy();const u=new URL(s.url);expect(u.protocol).toBe('https:');expect(u.username+u.password).toBe('');expect(s.signalStrength).toBeNull();expect(s.updateFrequency).toBeNull();expect(s.lastChecked).toBeNull();expect(s.nextCheckDue).toBeNull();expect(s.signalsCaptured).toBeNull();expect(s.qualifiedOpportunities).toBeNull();expect(s.wins).toBeNull();expect(s.revenueSourced).toBeNull();expect(s.notes).toContain('not a verified machine endpoint');if(!s.connectorId&&!s.ownerDisabled)expect(['manual_import_available','credentials_required']).toContain(s.support);}
  expect(source('INT-023').support).toBe('credentials_required');expect(source('INT-037').authentication).toContain('fees');
 });
 it('preserves explicit deployment priorities while labelling purpose-based assignments instead of inventing source-plan quotations',()=>{
  for(const [id,tier] of [['INT-001',1],['INT-019',1],['INT-041',1],['INT-043',1],['INT-015',2],['INT-042',2],['INT-053',2],['INT-046',3],['INT-047',3],['INT-048',3],['INT-055',3]] as const){expect(source(id).deploymentTier).toBe(tier);expect(source(id).deploymentBasis).toBe('explicit source-plan priority');}
  expect(source('INT-003').deploymentBasis).toBe('purpose-based implementation sequencing');expect(source('INT-003').notes).toContain('not named individually');
 });
});
