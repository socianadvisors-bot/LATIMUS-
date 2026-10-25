import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const password='fictional prospect workspace 123';
async function create(page:Page){await page.goto('/');await page.getByLabel('Passphrase',{exact:true}).fill(password);await page.getByLabel('Confirm passphrase',{exact:true}).fill(password);await page.getByRole('button',{name:'Create encrypted workspace'}).click();await expect(page.getByRole('heading',{name:'Command Center',exact:true})).toBeVisible();}
async function nav(page:Page,name:string){await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name,exact:true}).click();}
async function importCsv(page:Page,csv:string,name='fictional-prospects.csv'){
 await page.getByLabel('Import prospect CSV').setInputFiles({name,mimeType:'text/csv',buffer:Buffer.from(csv)});
 await expect(page.getByLabel('Map Company / business')).toBeVisible();
 await page.getByRole('button',{name:/Import.*preserve|Confirm.*import|Import mapped/i}).click();
 await expect(page.getByLabel('Search prospects')).toBeVisible();
}
test('CSV mapping, local durable work, review, explicit CRM, full original export and reload',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await create(page);await nav(page,'Prospecting');
 const csv='Company,Person,Website,Email,Legacy note,Legacy note\r\nFictional Gear LLC,Jane Example,https://example.com,jane.example@example.com,"line one\nline two",=1+1\r\nFictional Gear LLC,Sam Sample,https://example.com,,second,retained\r\n';
 await importCsv(page,csv);await expect(page.locator('.prospect-workbench-table, .prospecting-workbench')).toContainText('Jane Example');
 await page.getByRole('tab',{name:'Enrichment Jobs',exact:true}).click();await page.getByRole('button',{name:'Start local processing',exact:true}).click();
 await expect(page.getByText('completed',{exact:true})).toBeVisible();await expect(page.getByText(/2 \/ 2 rows checkpointed/)).toBeVisible();
 await page.getByRole('button',{name:'Inspect current results',exact:true}).click();await page.getByLabel('Select prospect row 1',{exact:true}).check();
 await page.getByRole('button',{name:'Accept',exact:true}).click();await page.getByRole('button',{name:'Promote to CRM',exact:true}).click();await expect(page.getByText('Owner: accepted · CRM promoted')).toBeVisible();
 await page.getByRole('tab',{name:'Export Center',exact:true}).click();const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export Full Fidelity CSV',exact:true}).click();const file=await download;const exported=await readFile((await file.path())!,'utf8');
 expect(exported).toContain('Company,Person,Website,Email,Legacy note,Legacy note,prospect_import_id');expect(exported).toContain('line one\nline two');expect(exported).toContain("'=1+1");expect(exported).toContain('extension_required');expect(exported).not.toContain('verified_work_email');
 await nav(page,'CRM / Relationships');await expect(page.getByText('Jane Example',{exact:true})).toBeVisible();await expect(page.getByText('user-provided',{exact:true})).toBeVisible();
 await page.reload();await page.getByLabel('Passphrase',{exact:true}).fill(password);await page.getByRole('button',{name:'Unlock workspace'}).click();await nav(page,'Prospecting');await page.getByRole('tab',{name:'Prospect Results',exact:true}).click();await expect(page.getByText('Owner: accepted · CRM promoted')).toBeVisible();
 // Exact-file duplicates are rejected without destroying the existing batch.
 await page.getByLabel('Import prospect CSV').setInputFiles({name:'same.csv',mimeType:'text/csv',buffer:Buffer.from(csv)});await expect(page.getByRole('alert')).toContainText('already imported');expect(errors).toEqual([]);
});
test('55-source manual intake preserves raw fields and stays outside CSV prospecting; property feeds disabled',async({page})=>{
 await create(page);await nav(page,'Sources');await page.getByLabel('Search source master').fill('INT-015');
 // Registry IDs and source names are searchable; disabled rows retain their metadata.
 await expect(page.locator('span.badge').filter({hasText:/^Disabled by owner$/})).toBeVisible();await page.getByRole('button',{name:'Details & source import',exact:true}).click();
 await expect(page.getByLabel('Import source master CSV')).toBeDisabled();await page.getByLabel('Close source master details').click();
 await page.getByLabel('Search source master').fill('INT-025');await page.getByRole('button',{name:'Details & source import',exact:true}).click();
 await page.getByLabel('Import source master CSV').setInputFiles({name:'fictional-source.csv',mimeType:'text/csv',buffer:Buffer.from('Company,Title,Unknown column\nFictional Source Company,Award notice,retain this\n')});
 await page.getByRole('button',{name:/Confirm.*source|Import.*source.*rows|Save.*source/i}).click();await expect(page.getByText(/raw rows retained with intelligence-source provenance/)).toBeVisible();
 await page.getByLabel('Close source master details').click();await nav(page,'Prospecting');await expect(page.getByLabel('Active prospect batch')).toHaveCount(0);await expect(page.getByText('Fictional Source Company',{exact:true})).toHaveCount(0);
});
