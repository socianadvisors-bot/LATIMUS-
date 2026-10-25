import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const password='CSV worker fixture password 123';
async function create(page:Page,url:string){await page.goto(url);await page.getByLabel('Passphrase',{exact:true}).fill(password);await page.getByLabel('Confirm passphrase',{exact:true}).fill(password);await page.getByRole('button',{name:'Create encrypted workspace'}).click();await expect(page.getByRole('heading',{name:'Command Center',exact:true})).toBeVisible();}
async function importFixture(page:Page){
 await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:'Prospecting',exact:true}).click();
 await page.getByLabel('Import prospect CSV',{exact:true}).setInputFiles({name:'worker-fixture.csv',mimeType:'text/csv',buffer:Buffer.from('Company,Owner,Website,Extra\r\n"Fixture, Inc.",Jane Example,https://example.com,"Original, preserved"\r\nSecond Fixture,Alex Sample,,=1+1\r\n')});
 await expect(page.getByRole('button',{name:'Confirm mapping & import'})).toBeVisible();await expect(page.getByRole('heading',{name:'worker-fixture.csv',exact:true})).toBeVisible();await page.getByRole('button',{name:'Confirm mapping & import'}).click();await expect(page.locator('.prospect-results-table')).toContainText('Fixture, Inc.');await expect(page.locator('.prospect-results-table')).toContainText('Second Fixture');
}
test('development CSV import executes the same-origin module worker',async({page})=>{
 const errors:string[]=[];const workers:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('worker',w=>workers.push(w.url()));await create(page,'/');await importFixture(page);expect(workers.some(url=>url.includes('/src/platform/csv-worker.ts'))).toBe(true);expect(errors).toEqual([]);
});
test('exact portable artifact executes its embedded CSV worker offline without executable network dependencies',async({page,context})=>{
 const html=await readFile(resolve('dist/LATIMUS.html'),'utf8');const url='http://127.0.0.1:5173/dist/LATIMUS.html?mode=portable';const errors:string[]=[];const requests:string[]=[];const workers:string[]=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));page.on('worker',w=>workers.push(w.url()));await page.route('**/dist/LATIMUS.html?mode=portable',r=>r.fulfill({status:200,contentType:'text/html',body:html}));await context.setOffline(true);await create(page,url);await importFixture(page);
 expect(workers.some(value=>value.startsWith('blob:'))).toBe(true);expect(requests.filter(value=>value.startsWith('http:')||value.startsWith('https:'))).toEqual([url]);expect(errors).toEqual([]);
});

test('IndexedDB v1 encrypted workspace survives the v2 private-adapter store migration',async({page})=>{
 const {createVault}=await import('../../src/platform/crypto');const {emptyWorkspace}=await import('../../src/domain/workspace');const legacy:any=emptyWorkspace('Retained v1 workspace');
 legacy.sources.push({id:crypto.randomUUID(),name:'Retained source from v1',family:'Capital Projects',url:'https://example.com',tier:'A',geography:'Texas',mode:'manual',health:'not checked',cadence:'Manual',limitations:'Migration fixture'});
 for(const key of ['prospectBatches','prospectRows','prospectJobs','prospectCompanyCache','mappingTemplates'])delete legacy[key];const {envelope}=await createVault(JSON.stringify(legacy),password);
 await page.addInitScript(raw=>{const req=indexedDB.open('latimus-vault-v1',1);req.onupgradeneeded=()=>req.result.createObjectStore('vault');req.onsuccess=()=>{const db=req.result;const tx=db.transaction('vault','readwrite');tx.objectStore('vault').put(raw,'active');tx.oncomplete=()=>db.close();};},envelope);
 await page.goto('/');await expect(page.getByRole('heading',{name:'Welcome back'})).toBeVisible();await page.getByLabel('Passphrase',{exact:true}).fill(password);await page.getByRole('button',{name:'Unlock workspace'}).click();await expect(page.getByRole('heading',{name:'Command Center',exact:true})).toBeVisible();await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:'Sources',exact:true}).click();await expect(page.getByText('Retained source from v1',{exact:true})).toBeVisible();
 const metadata=await page.evaluate(()=>new Promise<{version:number;stores:string[];ciphertext:string}>((resolve,reject)=>{const req=indexedDB.open('latimus-vault-v1');req.onerror=()=>reject(req.error);req.onsuccess=()=>{const db=req.result;const r=db.transaction('vault').objectStore('vault').get('active');r.onsuccess=()=>{resolve({version:db.version,stores:[...db.objectStoreNames],ciphertext:r.result.ciphertext});db.close();};};}));
 expect(metadata.version).toBe(2);expect(metadata.stores).toEqual(expect.arrayContaining(['vault','provider-vault','file-handles']));expect(metadata.ciphertext).toBe(envelope.ciphertext);
});
