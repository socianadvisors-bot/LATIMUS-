/** Explicit bounded official-service smoke test. No fixture interception or TLS bypass. */
import {writeFile} from 'node:fs/promises';
import {emptyWorkspace,applyAction} from '../src/domain/workspace';
import {defaultSourceSettings} from '../src/domain/connectors';
import {retrieveSource} from '../src/platform/sources';
import type {ConnectorId} from '../src/domain/types';
const ids:ConnectorId[]=['usaspending-awards','austin-permits','tdlr-projects','fmcsa-census'];
if(process.env.CENSUS_API_KEY)ids.push('census-cbp');
let w=emptyWorkspace('Official endpoint acceptance');
for(const connectorId of ids)w=await applyAction(w,{type:'source.connect',connectorId,settings:{...defaultSourceSettings(),limit:2}});
const results=await Promise.all(w.sources.map(source=>retrieveSource(source,fetch,undefined,source.connectorId==='census-cbp'?{censusApiKey:process.env.CENSUS_API_KEY}:undefined)));
await writeFile('/tmp/latimus-live-receipts.json',JSON.stringify(results,null,2));
for(const r of results)console.log(JSON.stringify({adapter:r.connectorId,status:r.status,records:r.recordsFetched,completedAt:r.completedAt,requestUrl:r.requestUrl,responseHash:r.responseHash,error:r.error}));
if(!process.env.CENSUS_API_KEY)console.log('Census live data check not run: CENSUS_API_KEY is not present; its metadata and missing-key requirement were separately verified.');
if(results.some(r=>r.status!=='succeeded'))process.exitCode=1;
