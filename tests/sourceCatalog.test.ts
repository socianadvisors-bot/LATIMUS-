import {describe,it,expect} from 'vitest';
import {SOURCE_CATALOG} from '../src/domain/sourceCatalog';
import {CONNECTORS} from '../src/domain/connectors';
describe('unimplemented official-source discovery catalog',()=>{
 it('retains source families without claiming connections or live verification',()=>{
  expect(SOURCE_CATALOG.length).toBeGreaterThanOrEqual(20);
  for(const s of SOURCE_CATALOG){expect(['Not implemented','Owner credentials required','Approved provider required','Deferred by owner']).toContain(s.availability);expect(s.reason.length).toBeGreaterThan(50);expect(s.availability.toLowerCase()).not.toContain('connected')}
  const names=SOURCE_CATALOG.map(s=>s.name).join(' ')+' '+CONNECTORS.map(s=>s.name).join(' ');for(const name of ['TDLR','BLS','SAM.gov','Texas procurement','SEC','Form D','8-K','10-Q','10-K','FMCSA','SAFER','Railroad Commission','ERCOT','County','WARN','careers','Tier C','Tier D'])expect(names).toContain(name);
 });
 it('uses HTTPS public authority discovery destinations without credentials',()=>{
  for(const s of SOURCE_CATALOG){const u=new URL(s.url);expect(u.protocol).toBe('https:');expect(u.username).toBe('');expect(u.password).toBe('');expect(u.hostname.endsWith('.gov')||['www.ercot.com','www.sos.state.tx.us'].includes(u.hostname)).toBe(true)}
 });
 it('does not misstate snapshots, source identities or credentials as an implemented automatic pull',()=>{
  expect(SOURCE_CATALOG.find(s=>s.name.includes('Company Census'))).toBeUndefined();
  expect(CONNECTORS.find(s=>s.id==='tdlr-projects')?.limitations).toContain('not municipal permits');
  expect(SOURCE_CATALOG.find(s=>s.name.includes('SAM.gov'))?.availability).toBe('Owner credentials required');
  expect(SOURCE_CATALOG.find(s=>s.name.includes('Tier D'))?.reason).toContain('cannot independently justify');
  for(const name of ['County appraisal and ownership records','County clerk deeds, liens and real-property records','Commercial listings and property market datasets'])expect(SOURCE_CATALOG.find(s=>s.name===name)?.availability).toBe('Deferred by owner');
  for(const name of ['SEC EDGAR company filings','ERCOT project and large-load information'])expect(SOURCE_CATALOG.find(s=>s.name===name)?.availability).not.toBe('Deferred by owner');
 });
});
