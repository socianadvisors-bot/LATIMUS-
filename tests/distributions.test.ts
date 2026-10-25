import {describe,it,expect} from 'vitest';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
const sourceHosts=['https://api.usaspending.gov','https://data.austintexas.gov','https://api.census.gov','https://www.tdlr.texas.gov','https://data.transportation.gov'];
describe('built distribution contracts',()=>{
 it('portable artifact contains its exact hashed bundle and a packaged Blob CSV worker, with no external executable dependencies',()=>{
  const html=readFileSync('dist/LATIMUS.html','utf8');const script=html.match(/<script>([\s\S]*)<\/script>/)?.[1];expect(script).toBeTruthy();const digest=createHash('sha256').update(script!).digest('base64');
  expect(html).toContain(`script-src 'sha256-${digest}'`);expect(html).toContain('worker-src blob:');expect(html).toContain(`connect-src ${sourceHosts.join(' ')}`);expect(html).not.toMatch(/<script[^>]+src=/);expect(html).not.toMatch(/<link[^>]+href=/);
  const worker=readFileSync('dist/extension/csv-worker.js','utf8');expect(worker.length).toBeGreaterThan(1000);expect(worker).toContain('Invalid CSV worker request.');expect(script).toContain('Invalid CSV worker request.');expect(worker).not.toMatch(/\bimport\s*\(|importScripts\s*\(|https?:\/\/cdn\./);
 });
 it('extension packages the trusted broker and self CSV worker, with network origins optional until specifically granted',()=>{
  const m=JSON.parse(readFileSync('dist/extension/manifest.json','utf8'));expect(m.manifest_version).toBe(3);expect(m.permissions).toEqual([]);expect(m.key).toBeTruthy();expect(m.content_scripts).toBeUndefined();expect(m.host_permissions).toBeUndefined();
  expect(m.optional_host_permissions).toEqual([...sourceHosts,'https://dns.google','https://api.search.brave.com'].map(origin=>origin+'/*').concat('https://*/*'));
  const csp=m.content_security_policy.extension_pages as string;expect(csp).toContain("script-src 'self'");expect(csp).toContain("worker-src 'self'");expect(csp).toContain("object-src 'none'");expect(csp).toContain('connect-src https:');expect(csp).not.toMatch(/unsafe-eval|unsafe-inline|http:|data:|blob:/);
  const background=readFileSync('dist/extension/worker.js','utf8');expect(background).toContain('Untrusted extension message sender.');expect(background).toContain('Only an active owner-imported CSV job');expect(background).toContain('latimus-unlocked-workspace');expect(background).not.toMatch(/importScripts\s*\(|\beval\s*\(|new Function\s*\(/);
  expect(existsSync('dist/extension/csv-worker.js')).toBe(true);expect(existsSync('dist/LATIMUS-extension.zip')).toBe(true);
 });
});
