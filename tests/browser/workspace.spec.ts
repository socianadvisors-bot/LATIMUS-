import {test,expect,chromium,type Page} from '@playwright/test';
import {resolve} from 'node:path';
import {readFile,mkdtemp} from 'node:fs/promises';
import {readFileSync} from 'node:fs';
function managedPolicyBlocks(kind:'file'|'extensions'){try{const p=JSON.parse(readFileSync(`/etc/chromium/policies/managed/${kind==='file'?'urls':'extensions'}.json`,'utf8'));return kind==='file'?p.URLBlocklist?.includes('*')&&!p.URLAllowlist?.some((s:string)=>s.startsWith('file:')):p.ExtensionInstallBlocklist?.includes('*');}catch{return false;}}
const password='test workspace password 123';
async function create(page:Page,sample=true,url='/'){
 await page.goto(url);await page.getByLabel('Passphrase',{exact:true}).fill(password);await page.getByLabel('Confirm passphrase',{exact:true}).fill(password);
 if(sample)await page.getByRole('checkbox').check();await page.getByRole('button',{name:'Create encrypted workspace'}).click();
 await expect(page.getByRole('heading',{name:'Command Center',exact:true})).toBeVisible();
}
async function nav(page:Page,name:string){await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name,exact:true}).click();}
async function addSource(page:Page,name:string){await nav(page,'Sources');await page.getByRole('button',{name:'Register source',exact:true}).click();const d=page.getByRole('dialog');await d.getByLabel('Source name').fill(name);await d.getByLabel('Geography',{exact:true}).fill('Texas');await d.getByRole('button',{name:'Save record'}).click();}
test('encrypted records, local report execution, lock, wrong password and reload',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await create(page);
 await page.screenshot({path:'test-results/command-center.png',fullPage:true});
 const stored=await page.evaluate(async()=>new Promise<string>((resolve,reject)=>{const r=indexedDB.open('latimus-vault-v1',1);r.onsuccess=()=>{const g=r.result.transaction('vault').objectStore('vault').get('active');g.onsuccess=()=>{resolve(JSON.stringify(g.result));r.result.close();};g.onerror=()=>reject(g.error);};}));
 expect(stored).not.toContain('Cedarline');expect(stored).toContain('PBKDF2-SHA256');
 await nav(page,'Reports');await page.getByRole('button',{name:'Queue executive brief'}).click();await expect(page.getByText('succeeded',{exact:true})).toBeVisible();await page.getByRole('button',{name:/^Executive Brief ·/}).click();await expect(page.locator('.report-preview')).toContainText('ILLUSTRATIVE');
 await page.getByRole('button',{name:'Lock workspace',exact:true}).click();await page.getByLabel('Passphrase',{exact:true}).fill('incorrect passphrase');await page.getByRole('button',{name:'Unlock workspace'}).click();await expect(page.getByRole('alert')).toContainText('wrong passphrase');
 await page.getByLabel('Passphrase',{exact:true}).fill(password);await page.getByRole('button',{name:'Unlock workspace'}).click();await nav(page,'PMO');const status=page.getByLabel('Status for Confirm capital and delivery baseline');await status.selectOption('Done');await expect(page.getByText('Encrypted · saved',{exact:false}).first()).toBeVisible();
 await page.reload();await page.getByLabel('Passphrase',{exact:true}).fill(password);await page.getByRole('button',{name:'Unlock workspace'}).click();await nav(page,'PMO');await expect(page.getByLabel('Status for Confirm capital and delivery baseline')).toHaveValue('Done');expect(errors).toEqual([]);
});
test('real intake source → reviewed evidence → qualified opportunity with no script execution',async({page})=>{
 await create(page,false);await addSource(page,'Official project evidence');await expect(page.getByRole('dialog')).not.toBeVisible();await nav(page,'Intelligence');await page.getByRole('button',{name:'Capture signal',exact:true}).click();const d=page.getByRole('dialog');
 await d.getByLabel('Company name',{exact:true}).fill('Actual Test Company');await d.getByLabel('Company domain').fill('test.example.com');await d.getByLabel('Signal title').fill('Warehouse mobilization');await d.getByLabel('Geography',{exact:true}).fill('Austin, Texas');await d.getByLabel('Evidence source',{exact:true}).selectOption({label:'Official project evidence · Tier A'});await d.getByLabel('Evidence reference URL').fill('https://example.com/evidence');await d.getByLabel('Source facts / excerpt').fill('<script>window.pwned=true</script> Recorded project evidence.');await d.getByLabel('Probable need / opportunity hypothesis').fill('Mobilization planning');
 for(const [label,value] of [['Trigger strength / 30','25'],['Demonstrated need / 25','20'],['Economic capacity / 20','15'],['Service fit / 15','15'],['Accessibility / 10','8']])await d.getByLabel(label).fill(value);
 await d.getByRole('button',{name:'Save record'}).click();await expect(d).not.toBeVisible();await expect(page.getByRole('button',{name:'Monitor / review'})).toBeDisabled();
 await page.getByRole('button',{name:/Evidence registry/}).click();await page.getByRole('button',{name:/Mark.*verified|Verify evidence|Mark reviewed/i}).first().click();
 await page.getByRole('button',{name:/^Signals/}).click();await page.getByRole('button',{name:'Qualify opportunity'}).click();await nav(page,'Opportunities');await expect(page.getByRole('heading',{name:'Warehouse mobilization'})).toBeVisible();expect(await page.evaluate(()=>Boolean((window as any).pwned))).toBe(false);
});
test('outreach exact-content human decision does not send, suppression revokes it',async({page})=>{
 await create(page);await nav(page,'Approvals');await page.getByRole('button',{name:'Prepare outreach draft',exact:true}).click();const d=page.getByRole('dialog');await d.getByLabel('Recipient').selectOption({index:1});await d.getByLabel('Subject',{exact:true}).fill('Delivery Readiness Review');await d.getByLabel('Exact message body').fill('Alex, could we discuss the next delivery milestone?');await d.getByRole('button',{name:'Create approval draft'}).click();await expect(d).not.toBeVisible();await page.getByRole('button',{name:'Review & approve'}).click();await d.getByLabel('Reviewer name').fill('Workspace owner');await d.getByRole('button',{name:'Approve exact draft'}).click();await expect(page.getByText('Approved',{exact:true})).toBeVisible();
 await nav(page,'CRM / Relationships');await page.getByRole('button',{name:'Suppress outreach'}).click();await nav(page,'Approvals');await expect(page.getByText('Rejected',{exact:true})).toBeVisible();
});
test('financial workpaper uses supplied inputs and explicit margin formula',async({page})=>{
 await create(page,false);await nav(page,'Finance');await page.getByLabel('Estimated hours (hours)').fill('10');await page.getByLabel('Approved loaded hourly cost (USD)').fill('100');await page.getByLabel('Outside partners / other direct costs (USD)').fill('0');await page.getByLabel('Input source / assumption reference').fill('Owner approved estimate v1');await page.getByRole('button',{name:'Calculate workpaper'}).click();await expect(page.locator('.result-list')).toContainText('$2,200.00');await expect(page.locator('.result-list')).toContainText('50.00%');await expect(page.locator('.result-list')).toContainText('100.00%');
});
test('two tabs cannot silently overwrite encrypted changes',async({page,context})=>{
 await create(page);const second=await context.newPage();await second.goto('/');await second.getByLabel('Passphrase',{exact:true}).fill(password);await second.getByRole('button',{name:'Unlock workspace'}).click();await expect(second.getByRole('heading',{name:'Command Center',exact:true})).toBeVisible();
 await addSource(page,'First tab retained');await expect(page.getByRole('dialog')).not.toBeVisible();await addSource(second,'Stale tab must not save');await expect(second.getByRole('alert')).toContainText('Another tab changed');
 await page.reload();await page.getByLabel('Passphrase',{exact:true}).fill(password);await page.getByRole('button',{name:'Unlock workspace'}).click();await nav(page,'Sources');await expect(page.getByText('First tab retained',{exact:true})).toBeVisible();await expect(page.getByText('Stale tab must not save',{exact:true})).toHaveCount(0);
});
test('won outcome evidence opens an engagement and persists accountable delivery work',async({page})=>{
 await create(page);await nav(page,'Opportunities');const card=page.locator('.opportunity-card').filter({hasText:'Northbank Energy'});await card.locator('select').selectOption('Won');let d=page.getByRole('dialog');await d.getByLabel('Outcome evidence / notes').fill('Test fixture: owner accepted proposal; signed agreement reference TEST-42.');await d.getByRole('button',{name:'Save record'}).click();await expect(d).not.toBeVisible();await card.getByRole('button',{name:'Set up engagement'}).click();d=page.getByRole('dialog');await d.getByLabel('Engagement name').fill('Storage development readiness');await d.getByLabel('Accountable owner').fill('Delivery owner');await d.getByLabel('Approved budget (USD)').fill('25000');await d.getByLabel('Baseline / objective').fill('Document owner-approved development dependencies');await d.getByLabel('Acceptance criteria').fill('Owner accepts readiness roadmap and risk register');await d.getByRole('button',{name:'Save record'}).click();await expect(d).not.toBeVisible();
 await nav(page,'PMO');await page.getByRole('button',{name:'Add delivery item',exact:true}).click();d=page.getByRole('dialog');await d.getByLabel('Engagement',{exact:true}).selectOption({label:'Storage development readiness'});await d.getByLabel('Delivery item',{exact:true}).fill('Confirm interconnection decision gate');await d.getByLabel('Due date').fill(new Date(Date.now()+86400000).toISOString().slice(0,10));await d.getByLabel('Accountable owner').fill('Delivery owner');await d.getByRole('button',{name:'Save record'}).click();await expect(d).not.toBeVisible();await expect(page.getByText('Confirm interconnection decision gate',{exact:true})).toBeVisible();
});
test('built self-contained HTML portable adapter runs offline and restores encrypted records',async({page,context})=>{
 const errors:string[]=[];const requests:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
 const html=await readFile(resolve('dist/LATIMUS.html'),'utf8');
 const url='http://127.0.0.1:5173/dist/LATIMUS.html?mode=portable';
 await page.route('**/dist/LATIMUS.html?mode=portable',r=>r.fulfill({status:200,contentType:'text/html',body:html}));
 await context.setOffline(true);await create(page,true,url);
 const wait=page.waitForEvent('download');await page.getByRole('button',{name:'Export workspace',exact:true}).click();const backup=await wait;const path=await backup.path();expect(path).toBeTruthy();const content=await readFile(path!,'utf8');expect(content).not.toContain('Cedarline');
 await page.reload();await expect(page.getByRole('heading',{name:'Welcome to LATIMUS'})).toBeVisible();await page.locator('.gate-import input[type=file]').setInputFiles(path!);await page.getByLabel('Passphrase',{exact:true}).fill(password);page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Preview & restore'}).click();await expect(page.getByRole('heading',{name:'Command Center',exact:true})).toBeVisible();await expect(page.locator('.radar-list')).toContainText('Cedarline');expect(errors).toEqual([]);
 expect(requests.every(r=>r===url)).toBe(true);
});
test('direct local-file opening requires unmanaged desktop acceptance',async({page})=>{
 test.skip(managedPolicyBlocks('file'),'Cloud Chromium URLBlocklist blocks file://. Portable adapter is tested with the exact built HTML above; direct file protocol remains unverified.');
 await create(page,true,'file://'+resolve('dist/LATIMUS.html'));
 await expect(page.locator('.radar-list')).toContainText('Cedarline');
});
test('unpacked MV3 extension loads bundled app with stable identity and restrictive permissions',async()=>{
 test.skip(managedPolicyBlocks('extensions'),'Cloud Chromium ExtensionInstallBlocklist blocks unpacked extensions. Manifest and bundled files are statically tested; actual loading remains unverified.');
 const dir=resolve('dist/extension');const profile=await mkdtemp('/tmp/latimus-chrome-');
 const context=await chromium.launchPersistentContext(profile,{headless:true,executablePath:'/usr/bin/chromium',args:['--no-sandbox',`--disable-extensions-except=${dir}`,`--load-extension=${dir}`]});
 try{const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');const id=new URL(worker.url()).host;const p=await context.newPage();const errors:string[]=[];p.on('pageerror',e=>errors.push(e.message));await create(p,true,`chrome-extension://${id}/index.html`);await nav(p,'Sources');await expect(p.getByText('Sample Public Project Register',{exact:true})).toBeVisible();
 const result=await worker.evaluate(()=>({registered:(globalThis as any).chrome.action.onClicked.hasListeners(),permissions:(globalThis as any).chrome.runtime.getManifest().permissions}));expect(result.registered).toBe(true);expect(result.permissions).toEqual([]);expect(errors).toEqual([]);
 }finally{await context.close();}
});
